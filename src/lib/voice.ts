// Web Speech API wrapper — real browser STT (SpeechRecognition) and TTS
// (speechSynthesis), matching the Vaani voice interaction from the design spec.
// Falls back gracefully (returns null / no-ops) on browsers without support —
// the UI always keeps the text-input fallback available (FR-08 / NFR-08).

type SR = typeof window extends { SpeechRecognition: infer T } ? T : any;

function getRecognitionCtor(): any {
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
}

export function speechSupported(): boolean {
  return !!getRecognitionCtor();
}

// Emoji / pictographic ranges TTS engines otherwise try to "pronounce"
// (they read some as blank, others announce the unicode name).
const EMOJI_RE = /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}\u{2190}-\u{21FF}\u{2300}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}]/gu;

// Acronyms/scheme codes (PMSBY, PM-JAY, PMJJBY, KYC, OTP, AA, PDF, ...) read as
// gibberish words by TTS — spell them out letter by letter instead, the way a
// person reading them aloud naturally would.
function spellOutAbbreviations(text: string): string {
  return text.replace(/\b[A-Z]{2,}\b/g, (word) => word.split('').join(' '));
}

/**
 * Strips characters that make speech synthesis sound robotic (emojis read as
 * literal symbol names, markdown asterisks/underscores read as "star"/
 * "underscore", the ₹ sign read as "rupee sign") and expands acronyms into
 * spelled-out letters, so Vaani speaks like a person would, not a screen
 * reader. Only affects what is *spoken* — the on-screen chat bubble keeps the
 * original text untouched.
 */
export function sanitizeForSpeech(text: string, lang: 'hi' | 'en'): string {
  let s = text;
  s = s.replace(EMOJI_RE, '');
  s = s
    .replace(/₹/g, lang === 'hi' ? 'रुपये ' : 'rupees ')
    .replace(/%/g, lang === 'hi' ? ' प्रतिशत' : ' percent')
    .replace(/&/g, lang === 'hi' ? ' और ' : ' and ')
    .replace(/[*_#`~^]/g, '')
    .replace(/[/\\]/g, ' ')
    .replace(/-/g, ' ');
  s = spellOutAbbreviations(s);
  return s.replace(/\s{2,}/g, ' ').trim();
}

export function speak(text: string, lang: 'hi' | 'en') {
  if (!('speechSynthesis' in window) || !text) return;
  const clean = sanitizeForSpeech(text, lang);
  if (!clean) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    u.rate = 0.97;
    window.speechSynthesis.speak(u);
  } catch {}
}

export function stopSpeaking() {
  try { window.speechSynthesis?.cancel(); } catch {}
}

export interface RecognitionHandle {
  stop: () => void;
}

/**
 * Starts a single-utterance speech recognition session.
 * onResult receives the transcript; onEnd fires when listening stops (success, error, or manual stop).
 */
export function listenOnce(
  lang: 'hi' | 'en',
  onResult: (transcript: string) => void,
  onEnd: () => void,
): RecognitionHandle | null {
  const Ctor = getRecognitionCtor();
  if (!Ctor) { onEnd(); return null; }
  const recognition = new Ctor();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
  recognition.onresult = (ev: any) => {
    const transcript = ev.results[0][0].transcript;
    onResult(transcript);
  };
  recognition.onend = onEnd;
  recognition.onerror = onEnd;
  try {
    recognition.start();
  } catch {
    onEnd();
    return null;
  }
  return { stop: () => { try { recognition.stop(); } catch {} } };
}
