import React from 'react';
import { useAppStore } from '../store';
import { C, jakarta, work, devanagari, primaryOrDisabled } from '../ui';
import { INCOME_TYPES } from '../data';
import { INCOME_ICONS } from './Icons';

const inputStyle: React.CSSProperties = {
  height: 52, borderRadius: 12, border: `1px solid ${C.borderStrong}`, background: '#fff',
  padding: '0 14px', fontFamily: work, fontSize: 15, color: C.ink, width: '100%', boxSizing: 'border-box',
};

export function ProfileEditScreen() {
  const { s, actions, derived } = useAppStore();
  const { t } = derived;
  const font = s.lang === 'hi' ? devanagari : work;
  const d = s.profileDraft;
  if (!d) return null;

  const genders: Array<{ id: 'male' | 'female' | 'other'; label: string }> = [
    { id: 'male', label: t.male }, { id: 'female', label: t.female }, { id: 'other', label: t.other },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '8px 20px 24px 20px', gap: 18 }}>
        <span style={{ fontFamily: font, fontSize: 14, color: C.inkSoft, lineHeight: '20px' }}>{t.editProfileSubtitle}</span>

        <Field label={t.fullName}>
          <input value={d.name} onChange={e => actions.onChangeProfileDraft({ name: e.target.value })} placeholder={t.fullName} style={inputStyle} />
        </Field>

        <Field label={t.dateOfBirth}>
          <input type="date" value={d.dob} onChange={e => actions.onChangeProfileDraft({ dob: e.target.value })} style={inputStyle} />
        </Field>

        <Field label={t.gender}>
          <div style={{ display: 'flex', gap: 10 }}>
            {genders.map(g => {
              const selected = d.gender === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => actions.onChangeProfileDraft({ gender: g.id })}
                  style={{ flex: 1, height: 56, borderRadius: 12, border: `2px solid ${selected ? C.green : C.borderStrong}`, background: selected ? C.greenBgSoft : '#fff', cursor: 'pointer', fontFamily: font, fontWeight: 600, fontSize: 14, color: selected ? C.greenDark : C.ink }}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label={t.residentialArea}>
          <input value={d.area} onChange={e => actions.onChangeProfileDraft({ area: e.target.value })} placeholder={t.selectYourArea} style={inputStyle} />
        </Field>

        <Field label={t.workType}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {INCOME_TYPES.map(it => {
              const selected = d.incomeTypeId === it.id;
              const Icon = INCOME_ICONS[it.id];
              return (
                <button
                  key={it.id}
                  onClick={() => actions.onChangeProfileDraft({ incomeTypeId: it.id })}
                  style={{ minHeight: 56, borderRadius: 12, border: `2px solid ${selected ? C.green : C.borderStrong}`, background: selected ? C.greenBgSoft : '#fff', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', cursor: 'pointer', textAlign: 'left' }}
                >
                  <span style={{ width: 24, height: 24, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon /></span>
                  <span style={{ fontFamily: font, fontWeight: 600, fontSize: 15, color: C.ink }}>{s.lang === 'hi' ? it.labelHi : it.label}</span>
                </button>
              );
            })}
          </div>
        </Field>

        <Field label={t.monthlyIncomeLabel}>
          <input
            type="number"
            value={d.income}
            onChange={e => actions.onChangeProfileDraft({ income: e.target.value })}
            placeholder={t.manualIncomePlaceholder}
            style={inputStyle}
          />
          <span style={{ fontFamily: font, fontSize: 12, color: C.inkFaint }}>{t.monthlyIncomeHelp}</span>
        </Field>
      </div>

      <div style={{ position: 'sticky', bottom: 0, padding: '14px 20px calc(env(safe-area-inset-bottom,0px) + 18px) 20px', background: `linear-gradient(180deg,rgba(247,249,251,0) 0%,${C.bg} 40%)`, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button onClick={actions.onSaveProfileEdits} disabled={!derived.profileDraftValid} style={primaryOrDisabled(derived.profileDraftValid)}>
          {t.updateDetails}
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontFamily: jakarta, fontWeight: 600, fontSize: 14, color: C.ink }}>{label}</span>
      {children}
    </div>
  );
}
