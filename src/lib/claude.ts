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

OUTPUT FORMAT — reply with these lines and nothing else:
Line 1: a short Hindi sentence in Devanagari script (under 25 words; up to 35 words only for your final recommendation).
Line 2: its natural English paraphrase (same length rule).
Line 3: exactly "NEXT_ACTION: <code>" where <code> is one of: ${VALID_ACTIONS.join(', ')}.
Line 4 (ONLY when NEXT_ACTION is not "none"): exactly "SCHEME: <product name> | <organization that runs it> | <official URL>". Use "-" for a field you genuinely could not verify.
Lines 1 and 2 are spoken aloud by text-to-speech, so write them the way a person would say them out loud: plain sentences only.
Never use emojis, emoticons, markdown (no asterisks, underscores, bullets, headers), or special symbols — they get read aloud as gibberish.
Write scheme codes and abbreviations exactly as normal (e.g. "PMSBY", "PM-JAY") — do not add spaces or dashes between their letters yourself; the app already expands them into spelled-out letters for speech.
Never use financial jargon without a one-line plain explanation in the same sentence.

RESEARCH THE ANSWER — never recommend from memory:
1. You have a web_search tool and you are expected to use it (2-4 searches) before any final recommendation. Search the open web for what actually fits THIS person: central government schemes, state government schemes for their state and occupation, welfare board and e-Shram linked benefits, insurer/bank/NBFC/post office/mutual fund products — whatever genuinely fits best. You are NOT limited to a fixed list of products.
2. Ground every number you say in a source you just read: premium, cover, interest rate, tenure, eligibility, age limits, deadlines. If a search does not confirm a number, do not state it — say what you do know instead.
3. Prefer specific over famous. A state-level or occupation-specific scheme this person actually qualifies for beats a well-known national one they do not.
4. Do all of this silently. Your reply must be ONLY the lines specified above — no preamble, no "let me check", no summary of what you searched.

USE THIS PERSON'S NUMBERS:
Income type ${p.incomeTypeId || 'unknown'}; estimated monthly income Rs ${p.monthlyIncome}; monthly expenses Rs ${p.monthlyExpenses}; roughly Rs ${affordability} left over each month; risk profile ${p.riskTier || 'not set'}; existing DhanSathi enrollments: ${enrolled}.
Your final recommendation must reference at least one number specific to them — how a premium compares with their Rs ${affordability} monthly surplus, the exact interest on the amount they asked about, and so on. If your answer would read the same for any user in this income bracket, it is too generic: search again for the specific fact you are missing.
Never recommend a product with a lock-in to a Conservative-tier user.

HOW TO PRESENT A RECOMMENDATION — this is a hard rule:
DhanSathi is a guide, not the provider. Never say or imply that DhanSathi runs, offers, funds, underwrites or owns any scheme.
Always name the organization that actually runs it — the Government of India ministry, the state government, the insurer, the bank, the fund house — in Line 1 and Line 2. For example: "This is run by LIC under the central government's PMJJBY."
Then offer help in your own words, in the same breath: you can bring them more details about that scheme and help them register or apply. Close by asking how they would like to proceed.
NEXT_ACTION and the SCHEME line must both describe the SAME product you just named in Line 1 and Line 2 — never carry over a code from an earlier turn. On a follow-up about a product you already recommended (documents, steps, eligibility), keep that same product and repeat its SCHEME line; only switch products if you say in Line 1 and Line 2 that you are switching.
These ${JSON.stringify(SCHEMES.map(x => x.id))} are the only products DhanSathi can complete enrollment for inside the app — use the matching enroll_* action for those. For anything else you researched, use explore_scheme and offer to walk them through registering with the provider.
Reference details for the in-app ones (verify with web_search before quoting, they change): ${JSON.stringify(SCHEMES.map(x => ({ id: x.id, name: x.nameEn, runBy: 'Government of India', premium: x.premiumEn, cover: x.coverEn })))}
Investment options DhanSathi can transact in-app: ${JSON.stringify(INVESTMENTS.map(x => ({ id: x.id, name: x.name, return: x.returnPct, withdraw: x.withdrawBadge })))}

CONVERSATION BUDGET:
You have asked ${p.vaaniQuestionCount} question(s) so far. Ask at most 5 short questions total, then give ONE specific final recommendation (NEXT_ACTION must not be "none"). Only ask about things not already known above.`;
}

export interface ChatTurn { role: 'user' | 'assistant'; content: string }

export interface VaaniParsed {
  hi: string;
  en: string;
  action: string;
  /** Researched product name, the organization that runs it, and its official page. */
  schemeName: string;
  provider: string;
  url: string;
}

// 'explore_scheme' is the open-ended one: a product Vaani found by researching
// the web that DhanSathi cannot enroll into directly. The enroll_* codes stay
// reserved for the four schemes the app completes in-app.
const VALID_ACTIONS = ['enroll_pmsby', 'enroll_pmjjby', 'enroll_pmjay', 'enroll_hospicash', 'explore_scheme', 'invest', 'borrow_compare', 'none'];

function safeUrl(raw: string): string {
  const cleaned = raw.trim().replace(/^[<(\[]|[>)\].,]$/g, '');
  if (!cleaned || cleaned === '-') return '';
  try {
    const u = new URL(cleaned.startsWith('http') ? cleaned : `https://${cleaned}`);
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : '';
  } catch {
    return '';
  }
}

function parseSchemeLine(raw: string): { schemeName: string; provider: string; url: string } {
  // Anchored to the start of a line and requiring the colon: the English
  // paraphrase often contains the word "scheme" in prose, and a loose match
  // happily grabbed the rest of that sentence as the product name.
  const m = raw.match(/^\s*[*_]*SCHEME[*_]*\s*:\s*(.+)$/im);
  if (!m) return { schemeName: '', provider: '', url: '' };
  const parts = m[1].split('|').map(x => x.trim().replace(/[*_`]/g, ''));
  const clean = (v: string | undefined) => (!v || v === '-' ? '' : v);
  return { schemeName: clean(parts[0]), provider: clean(parts[1]), url: safeUrl(parts[2] || '') };
}



export function parseVaaniReply(raw: string): VaaniParsed {
  const lines = raw.trim().split('\n').map(l => l.trim()).filter(Boolean);
  let action = 'none';
  const m = raw.match(/NEXT_ACTION[*_]*\s*:?\s*[*_]*\s*(\w+)/i);
  if (m && VALID_ACTIONS.includes(m[1].toLowerCase())) action = m[1].toLowerCase();
  const scheme = parseSchemeLine(raw);
  const others = lines.filter(l => !/NEXT_ACTION/i.test(l) && !/^SCHEME\s*:/i.test(l));
  // Take the LAST two non-NEXT_ACTION lines, not the first two. When Vaani
  // uses web_search it occasionally slips in a stray note ("Confirmed ₹20/yr")
  // before its real 3-line answer despite instructions not to — the actual
  // Hindi/English pair is always the two lines immediately before
  // NEXT_ACTION, so anchoring from the end skips any such preamble instead
  // of mis-assigning it as the Hindi line.
  const en = others[others.length - 1] || '';
  const hi = others.length >= 2 ? others[others.length - 2] : others[0] || '...';
  return { hi, en, action, ...scheme };
}

// The enroll_* actions drop the user straight into an in-app enrollment, so
// they must match the scheme the reply actually talks about. Vaani sometimes
// answers about a researched product (say Atal Pension Yojana) while emitting a
// leftover enroll_* code from earlier in the conversation — that would offer a
// button for a completely different scheme. When the reply does not mention the
// scheme its action points at, demote it to explore_scheme, which is always
// truthful: read the provider's page, or ask Vaani to walk you through it.
const ENROLL_ALIASES: Record<string, string[]> = {
  enroll_pmsby: ['pmsby', 'suraksha bima', 'सुरक्षा बीमा', 'पीएमएसबीवाई'],
  enroll_pmjjby: ['pmjjby', 'jeevan jyoti', 'जीवन ज्योति', 'पीएमजेजेबीवाई'],
  enroll_pmjay: ['pm-jay', 'pmjay', 'ayushman', 'आयुष्मान'],
  enroll_hospicash: ['hospi', 'हॉस्पि'],
};

export function reconcileAction(parsed: VaaniParsed): VaaniParsed {
  const aliases = ENROLL_ALIASES[parsed.action];
  if (!aliases) return parsed;
  const haystack = `${parsed.hi} ${parsed.en} ${parsed.schemeName}`.toLowerCase();
  if (aliases.some(a => haystack.includes(a))) return parsed;
  return { ...parsed, action: 'explore_scheme' };
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
          max_tokens: 2048,
          system,
          output_config: { effort: 'low' },
          tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: 5 }],
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
