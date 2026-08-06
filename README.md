# DhanSathi

AI-powered financial companion for India's informal and gig workers — Hindi-first onboarding, a scheme eligibility engine, an Account Aggregator-style tracker, and **Vaani**, a real Claude-powered voice agent. Built as a single responsive web app: the desktop view wraps the same screens in a sidebar shell, the mobile view uses a bottom tab bar + FAB, matching the two Claude Design specs (`DhanSathi Desktop.dc.html` / `DhanSathi.dc.html`).

## Run it

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-checks + production bundle
```

## Set up Vaani (the voice agent)

Vaani calls the real Anthropic Messages API (`claude-opus-5`) directly from the browser.

1. Open the app → **Profile** (hamburger menu, top-left) → **Claude API key**.
2. Paste an API key from [console.anthropic.com](https://console.anthropic.com) and hit **Save**.
3. Tap the mic FAB (bottom-right) or **Ask Vaani** (desktop sidebar) to start a session — Hindi voice in/out via the Web Speech API, falling back to text automatically if the browser has no mic support.

The key is stored only in `localStorage` on your device — it is sent as a request header straight to `api.anthropic.com` and nowhere else.

## What's real vs. simulated

| Feature | Status |
|---|---|
| Onboarding (language → income type → anti-scam → risk quiz → dashboard) | Fully functional, 5-question scoring engine |
| Vaani voice agent (chat mode) | **Real Claude API calls**, real browser STT/TTS |
| Vaani-guided scheme enrollment | Scripted flow (as designed) with real TTS narration |
| Certificate download | **Real PDF** generated client-side (jsPDF) |
| Insurance / Investment / Borrowing data | Seeded demo data (matches PRD's 15+ MVP schemes subset) — swap `src/data.ts` for a live MyScheme/AMFI feed |
| Account Aggregator bank linking | Simulated (no real AA provider integration) |

## Structure

```
src/
  data.ts            seed data: schemes, investment products, quiz, translations
  store.tsx          app-wide state machine (screen routing + all actions)
  ui.ts              shared style tokens (brand colors, button styles)
  lib/
    claude.ts        Anthropic Messages API client + Vaani system prompt
    voice.ts         Web Speech API (STT/TTS) wrapper
    pdf.ts            jsPDF certificate generator
  components/
    Shell.tsx         responsive layout (desktop sidebar / mobile bottom nav)
    *Screens.tsx       one file per screen group
```
