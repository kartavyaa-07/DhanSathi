// Real Claude API integration for Vaani, the Hindi-first voice agent.
// Calls the Anthropic Messages API directly from the browser.
//
// Key resolution order:
//   1. VITE_CLAUDE_API_KEY from .env (baked in at build time — see .env.example)
//   2. A per-browser override saved to localStorage (set via setApiKey)
//
// ⚠️ This is a client-only app with no backend: whichever key resolves here
// is visible in plaintext to anyone who opens dev tools on the deployed
// site, or reads the built JS bundle directly. Option 1 is fine for local
// development; shipping a real key via VITE_CLAUDE_API_KEY to a public
// production deploy means every visitor shares — and bills against — that
// one key. For a genuinely private production secret, proxy the Anthropic
// call through a server/serverless function instead.

import { SCHEMES, INVESTMENTS } from '../data';

const API_KEY_STORAGE = 'dhansathi_claude_api_key';
const MODEL = 'claude-sonnet-5';

export function getApiKey(): string {
  const envKey = import.meta.env.VITE_CLAUDE_API_KEY;
  if (envKey) return envKey.trim();
  return localStorage.getItem(API_KEY_STORAGE) || '';
}

/** True when the key came from .env (VITE_CLAUDE_API_KEY) rather than a saved local override. */
export function apiKeyFromEnv(): boolean {
  return !!import.meta.env.VITE_CLAUDE_API_KEY;
}

export function setApiKey(key: string) {
  localStorage.setItem(API_KEY_STORAGE, key.trim());
}

export function hasApiKey(): boolean {
  return getApiKey().length > 0;
}

export interface VaaniProfile {
  incomeTypeId: string | null;
  monthlyIncome: number;
  monthlyExpenses: number;
  riskTier: string | null;
  enrolledSchemes: string[];
  vaaniQuestionCount: number;
}

export function buildVaaniSystemPrompt(p: VaaniProfile): string {
  const enrolled = p.enrolledSchemes.length ? p.enrolledSchemes.join(', ') : 'none yet';
  const affordability = Math.max(p.monthlyIncome - p.monthlyExpenses, 0);
  return `You are Vaani, a warm, patient Hindi-first AI financial companion inside the DhanSathi app for Indian gig/informal workers.
Reply in EXACTLY this format, three lines, nothing else:
Line 1: a short Hindi sentence in Devanagari script (under 25 words).
Line 2: its natural English paraphrase (under 25 words).
Line 3: exactly "NEXT_ACTION: <code>" where <code> is one of: enroll_pmsby, enroll_pmjjby, enroll_pmjay, enroll_hospicash, invest, borrow_compare, none.
Lines 1 and 2 are spoken aloud by text-to-speech, so write them the way a person would say them out loud: plain sentences only.
Never use emojis, emoticons, markdown (no asterisks, underscores, bullets, headers), or special symbols — they get read aloud as gibberish.
Write scheme codes and abbreviations exactly as normal (e.g. "PMSBY", "PM-JAY") — do not add spaces or dashes between their letters yourself; the app already expands them into spelled-out letters for speech.
Never use financial jargon without a one-line plain explanation in the same sentence.

DO A LITTLE RESEARCH BEFORE YOU ANSWER — do not give the same generic answer to every user:
1. Actually work with this specific person's numbers before recommending anything: their exact monthly income (₹${p.monthlyIncome}), expenses (₹${p.monthlyExpenses}), what's left over (₹${affordability}/month), their risk tier, and whatever amount/duration/goal they just told you in this conversation. Your final recommendation must reference at least one number specific to *them* — e.g. how a scheme's premium compares to their leftover ₹${affordability}, or the exact interest they'd pay on the amount they asked about — never a canned description that would read the same for any user.
2. You have a web_search tool. Use it — briefly, 1-2 searches at most — whenever you're not fully confident a number is current: a scheme's premium/coverage amount, an interest rate, or an eligibility rule. Search, read the result, then answer with the verified number. Do this silently — your reply must be ONLY the 3 lines specified above, nothing before them and nothing after. Do not add a confirmation note, a "found it" line, or any text summarizing what you searched for, even after using the tool — put that reasoning in your thinking, not in the reply.
3. Two users with the same income type but different amounts, existing enrollments, or stated needs should get visibly different recommendations. If your answer would fit almost any user in this income bracket, it's too generic — go back and use their specific numbers or search for the specific fact you're missing.

User profile: income type ${p.incomeTypeId || 'unknown'}, estimated monthly income ₹${p.monthlyIncome}, monthly expenses ₹${p.monthlyExpenses}, risk profile ${p.riskTier || 'not set'}, existing DhanSathi enrollments: ${enrolled}.
Only recommend from this exact list of DhanSathi-supported products, never invent products — but you may use web_search to verify or refresh the numbers below before quoting them: ${JSON.stringify(SCHEMES.map(x => ({ id: x.id, name: x.nameEn, premium: x.premiumEn, cover: x.coverEn })))}
Investment options: ${JSON.stringify(INVESTMENTS.map(x => ({ id: x.id, name: x.name, return: x.returnPct, withdraw: x.withdrawBadge })))}
Never recommend a lock-in investment product to a Conservative-tier user.
You have asked ${p.vaaniQuestionCount} question(s) so far in this session. Ask at most 5 total before giving ONE specific final recommendation. If you have already asked 5, you MUST give a final recommendation now (NEXT_ACTION must not be "none").
Only ask about information not already given above. When you give your final recommendation, state the concrete cost and benefit numbers in Line 1/2, computed for this person, not a generic figure.`;
}

export interface ChatTurn { role: 'user' | 'assistant'; content: string }

export interface VaaniParsed { hi: string; en: string; action: string }

const VALID_ACTIONS = ['enroll_pmsby', 'enroll_pmjjby', 'enroll_pmjay', 'enroll_hospicash', 'invest', 'borrow_compare', 'none'];

export function parseVaaniReply(raw: string): VaaniParsed {
  const lines = raw.trim().split('\n').map(l => l.trim()).filter(Boolean);
  let action = 'none';
  const m = raw.match(/NEXT_ACTION\s*:?\s*[*_]*\s*(\w+)/i);
  if (m && VALID_ACTIONS.includes(m[1].toLowerCase())) action = m[1].toLowerCase();
  const others = lines.filter(l => !/NEXT_ACTION/i.test(l));
  // Take the LAST two non-NEXT_ACTION lines, not the first two. When Vaani
  // uses web_search it occasionally slips in a stray note ("Confirmed ₹20/yr")
  // before its real 3-line answer despite instructions not to — the actual
  // Hindi/English pair is always the two lines immediately before
  // NEXT_ACTION, so anchoring from the end skips any such preamble instead
  // of mis-assigning it as the Hindi line.
  const en = others[others.length - 1] || '';
  const hi = others.length >= 2 ? others[others.length - 2] : others[0] || '...';
  return { hi, en, action };
}

export class ClaudeApiError extends Error {}

// 429 (rate limit) and 5xx (server error, including 529 "overloaded") are
// transient — the Anthropic SDKs retry these automatically with backoff.
// We're calling fetch() directly here, so we replicate that: up to 3
// attempts, exponential backoff with jitter (matches the SDK's max_retries).
const RETRYABLE_STATUSES = new Set([408, 409, 429, 500, 502, 503, 529]);
const MAX_RETRIES = 3;

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Sends the conversation to Claude and returns the raw text reply.
 * Throws ClaudeApiError with a user-facing message on failure.
 */
export async function completeVaaniTurn(system: string, history: ChatTurn[]): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new ClaudeApiError('No Claude API key set. Add one to .env as VITE_CLAUDE_API_KEY.');
  }

  let lastError: ClaudeApiError | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    let res: Response;
    try {
      res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 1024,
          system,
          output_config: { effort: 'low' },
          tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 2 }],
          messages: history.map(h => ({ role: h.role, content: h.content })),
        }),
      });
    } catch (e) {
      // Network failure — retryable, same backoff as a 5xx.
      lastError = new ClaudeApiError('Network error reaching Claude. Check your connection.');
      if (attempt < MAX_RETRIES) { await sleep(backoffMs(attempt)); continue; }
      throw lastError;
    }

    if (!res.ok) {
      let detail = '';
      try { detail = (await res.json())?.error?.message || ''; } catch {}
      const err = new ClaudeApiError(`Claude API error (${res.status}): ${detail || res.statusText}`);
      if (RETRYABLE_STATUSES.has(res.status) && attempt < MAX_RETRIES) {
        lastError = err;
        // Honor Retry-After if Anthropic sent one, otherwise exponential backoff.
        const retryAfter = Number(res.headers.get('retry-after'));
        await sleep(retryAfter > 0 ? retryAfter * 1000 : backoffMs(attempt));
        continue;
      }
      throw err;
    }

    const data = await res.json();
    if (data.stop_reason === 'refusal') {
      throw new ClaudeApiError('Vaani declined to answer that. Please rephrase.');
    }
    // When web_search runs, the response can contain text blocks *before*
    // the search (e.g. stray "let me check" text) as well as the real
    // 3-line answer after — take the last text block, which is always the
    // model's final response once any tool use is done.
    const textBlocks = (data.content || []).filter((b: any) => b.type === 'text');
    const textBlock = textBlocks[textBlocks.length - 1];
    return textBlock?.text || '...';
  }

  throw lastError ?? new ClaudeApiError('Claude API request failed after retries.');
}

function backoffMs(attempt: number): number {
  const base = Math.min(1000 * 2 ** attempt, 8000);
  return base + Math.random() * 300; // jitter, avoids retry stampedes
}
