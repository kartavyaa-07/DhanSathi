import React, { useState } from 'react';
import { useAppStore } from '../store';
import { C, jakarta, work, cardStyle } from '../ui';
import { IconWarning } from './Icons';
import { getApiKey, setApiKey } from '../lib/claude';

export function ProfileScreen() {
  const { s, actions, derived } = useAppStore();
  const { t } = derived;
  const [keyInput, setKeyInput] = useState(getApiKey());
  const [saved, setSaved] = useState(false);

  const handleSaveKey = () => {
    setApiKey(keyInput);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const reportScamHref = 'https://wa.me/?text=' + encodeURIComponent('I want to report a suspected scam call claiming to be from DhanSathi.');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, padding: '20px 20px 24px 20px' }}>
      <div style={{ ...cardStyle, padding: 16, display: 'flex', gap: 14, alignItems: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: 9999, background: C.sidebarBg, color: C.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: jakarta, fontWeight: 700, fontSize: 18 }}>
          {s.profileName.charAt(0)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: work, fontWeight: 700, fontSize: 16, color: C.ink }}>{s.profileName}</span>
          <span style={{ fontFamily: work, fontSize: 13, color: C.inkFaint }}>{derived.selectedIncomeTypeLabel}</span>
        </div>
      </div>

      <div style={{ ...cardStyle, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: work, fontSize: 13, color: C.inkFaint }}>{t.riskProfileLabel}</span>
          <span style={{ fontFamily: work, fontWeight: 700, fontSize: 15, color: C.ink }}>{s.riskTier || '—'}</span>
        </div>
        <button onClick={actions.onRetakeQuiz} style={{ height: 36, padding: '0 14px', borderRadius: 9999, border: `1px solid ${C.green}`, background: '#fff', color: C.green, fontFamily: work, fontWeight: 600, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>{t.retake}</button>
      </div>

      <div style={{ ...cardStyle, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontFamily: work, fontSize: 13, color: C.inkFaint }}>{t.aaStatusLabel}</span>
          <span style={{ fontFamily: work, fontWeight: 700, fontSize: 15, color: C.ink }}>{s.aaLinked ? 'Linked' : 'Not linked'}</span>
        </div>
        {s.aaLinked && (
          <button onClick={actions.onRevokeAA} style={{ height: 36, padding: '0 14px', borderRadius: 9999, border: `1px solid ${C.danger}`, background: '#fff', color: C.danger, fontFamily: work, fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>{t.revoke}</button>
        )}
      </div>

      <div style={{ ...cardStyle, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: work, fontSize: 14, color: C.ink }}>{t.language}</span>
        <button onClick={actions.onToggleLanguage} style={{ height: 36, padding: '0 14px', borderRadius: 9999, border: `1px solid ${C.borderStrong}`, background: '#fff', color: C.green, fontFamily: work, fontWeight: 600, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {s.lang === 'hi' ? 'हि | EN' : 'EN | हि'}
        </button>
      </div>

      <div style={{ ...cardStyle, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span style={{ fontFamily: work, fontWeight: 700, fontSize: 14, color: C.ink }}>{t.apiKeyLabel}</span>
        <input
          type="password"
          value={keyInput}
          onChange={e => setKeyInput(e.target.value)}
          placeholder={t.apiKeyPlaceholder}
          style={{ height: 48, borderRadius: 10, border: `2px solid ${C.borderStrong}`, padding: '0 14px', fontFamily: work, fontSize: 14, color: C.ink }}
        />
        <span style={{ fontFamily: work, fontSize: 12, color: C.inkFaint }}>{t.apiKeyHelp}</span>
        <button onClick={handleSaveKey} style={{ height: 44, borderRadius: 10, border: 'none', background: C.green, color: '#fff', fontFamily: work, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
          {saved ? t.apiKeySaved + ' ✓' : 'Save key'}
        </button>
      </div>

      <a href={reportScamHref} target="_blank" rel="noreferrer" style={{ fontFamily: work, fontWeight: 600, fontSize: 14, color: C.danger, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <IconWarning size={14} />{t.reportScam}
      </a>
    </div>
  );
}
