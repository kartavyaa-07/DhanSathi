// Real Claude API integration for Vaani, the Hindi-first voice agent.
// Calls the Anthropic Messages API directly from the browser using the user's
// own API key (stored only in localStorage — never sent anywhere but api.anthropic.com).

import { SCHEMES, INVESTMENTS } from '../data';

const API_KEY_STORAGE = 'dhansathi_claude_api_key';
const MODEL = 'claude-opus-5';

export function getApiKey(): string {
  return localStorage.getItem(API_KEY_STORAGE) || '';
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
  return `You are Vaani, a warm, patient Hindi-first AI financial companion inside the DhanSathi app for Indian gig/informal workers.
Reply in EXACTLY this format, three lines, nothing else:
Line 1: a short Hindi sentence in Devanagari script (under 25 words).
Line 2: its natural English paraphrase (under 25 words).
Line 3: exactly "NEXT_ACTION: <code>" where <code> is one of: enroll_pmsby, enroll_pmjjby, enroll_pmjay, enroll_hospicash, invest, borrow_compare, none.
Lines 1 and 2 are spoken aloud by text-to-speech, so write them the way a person would say them out loud: plain sentences only.
Never use emojis, emoticons, markdown (no asterisks, underscores, bullets, headers), or special symbols — they get read aloud as gibberish.
Write scheme codes and abbreviations exactly as normal (e.g. "PMSBY", "PM-JAY") — do not add spaces or dashes between their letters yourself; the app already expands them into spelled-out letters for speech.
Never use financial jargon without a one-line plain explanation in the same sentence.
User profile: income type ${p.incomeTypeId || 'unknown'}, estimated monthly income ₹${p.monthlyIncome}, monthly expenses ₹${p.monthlyExpenses}, risk profile ${p.riskTier || 'not set'}, existing DhanSathi enrollments: ${enrolled}.
Only recommend from this exact list, never invent products: ${JSON.stringify(SCHEMES.map(x => ({ id: x.id, name: x.nameEn, premium: x.premiumEn, cover: x.coverEn })))}
Investment options: ${JSON.stringify(INVESTMENTS.map(x => ({ id: x.id, name: x.name, return: x.returnPct, withdraw: x.withdrawBadge })))}
Never recommend a lock-in investment product to a Conservative-tier user.
You have asked ${p.vaaniQuestionCount} question(s) so far in this session. Ask at most 5 total before giving ONE specific final recommendation. If you have already asked 5, you MUST give a final recommendation now (NEXT_ACTION must not be "none").
Only ask about information not already given above. When you give your final recommendation, state the concrete cost and benefit numbers in Line 1/2.`;
}

export interface ChatTurn { role: 'user' | 'assistant'; content: string }

export interface VaaniParsed { hi: string; en: string; action: string }

const VALID_ACTIONS = ['enroll_pmsby', 'enroll_pmjjby', 'enroll_pmjay', 'enroll_hospicash', 'invest', 'borrow_compare', 'none'];

export function parseVaaniReply(raw: string): VaaniParsed {
  const lines = raw.trim().split('\n').filter(Boolean);
  let action = 'none';
  const m = raw.match(/NEXT_ACTION\s*:?\s*[*_]*\s*(\w+)/i);
  if (m && VALID_ACTIONS.includes(m[1].toLowerCase())) action = m[1].toLowerCase();
  const others = lines.filter(l => !/NEXT_ACTION/i.test(l));
  return { hi: others[0] || '...', en: others[1] || '', action };
}

export class ClaudeApiError extends Error {}

/**
 * Sends the conversation to Claude and returns the raw text reply.
 * Throws ClaudeApiError with a user-facing message on failure.
 */
export async function completeVaaniTurn(system: string, history: ChatTurn[]): Promise<string> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new ClaudeApiError('No Claude API key set. Add one in Profile settings.');
  }
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
        max_tokens: 400,
        system,
        output_config: { effort: 'low' },
        messages: history.map(h => ({ role: h.role, content: h.content })),
      }),
    });
  } catch (e) {
    throw new ClaudeApiError('Network error reaching Claude. Check your connection.');
  }
  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json())?.error?.message || ''; } catch {}
    throw new ClaudeApiError(`Claude API error (${res.status}): ${detail || res.statusText}`);
  }
  const data = await res.json();
  if (data.stop_reason === 'refusal') {
    throw new ClaudeApiError('Vaani declined to answer that. Please rephrase.');
  }
  const textBlock = (data.content || []).find((b: any) => b.type === 'text');
  return textBlock?.text || '...';
}
