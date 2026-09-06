import React from 'react';
import { useAppStore } from '../store';
import { C, jakarta, work, cardStyle } from '../ui';
import { TRACKER_ICONS, IconBackspace } from './Icons';

const KEYPAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];

export function TrackerScreen() {
  const { s, actions, derived } = useAppStore();
  const { t } = derived;
  const isIncome = s.trackerKind === 'income';
  const canSubmit = derived.trackerEntryValid;

  const segment = (kind: 'income' | 'expense', label: string) => {
    const active = s.trackerKind === kind;
    return (
      <button
        key={kind}
        onClick={() => actions.onSetTrackerKind(kind)}
        style={{
          flex: 1, height: 44, borderRadius: 9, border: 'none', cursor: 'pointer',
          background: active ? C.greenBg : 'transparent',
          color: active ? C.greenDark : C.inkFaint,
          fontFamily: work, fontWeight: active ? 700 : 600, fontSize: 15,
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, padding: '16px 20px 20px 20px' }}>
        <div style={{ display: 'flex', gap: 6, padding: 5, borderRadius: 12, background: '#EDEFF2' }}>
          {segment('income', t.income)}
          {segment('expense', t.expenses)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontFamily: work, fontWeight: 600, fontSize: 14, color: C.inkSoft }}>{t.amountLabel}</span>
          <div style={{ ...cardStyle, height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px' }}>
            <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 22, color: C.inkFaint }}>₹</span>
            <span style={{ fontFamily: jakarta, fontWeight: 800, fontSize: 30, color: s.trackerAmount ? C.ink : C.borderStrong }}>
              {derived.trackerAmountDisplay}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ fontFamily: work, fontWeight: 600, fontSize: 14, color: C.inkSoft }}>{t.categoryLabel}</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {derived.trackerCategoryList.map(cat => {
              const active = s.trackerCategoryId === cat.id;
              const Icon = TRACKER_ICONS[cat.id] || TRACKER_ICONS.other;
              return (
                <button
                  key={cat.id}
                  onClick={() => actions.onSelectTrackerCategory(cat.id)}
                  style={{
                    height: 84, borderRadius: 12, cursor: 'pointer', padding: 10,
                    background: active ? C.greenBgSoft : '#fff',
                    border: `${active ? 2 : 1}px solid ${active ? C.green : C.border}`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  <Icon color={active ? C.green : C.ink} size={22} />
                  <span style={{ fontFamily: work, fontWeight: 600, fontSize: 14, color: active ? C.greenDark : C.ink }}>
                    {s.lang === 'hi' ? cat.labelHi : cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ position: 'sticky', bottom: 0, background: '#fff', borderTop: `1px solid ${C.border}`, boxShadow: '0 -6px 18px rgba(0,0,0,0.06)', padding: '14px 16px calc(env(safe-area-inset-bottom,0px) + 14px) 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* "Others" never silently swallows an entry — the user names it themselves.
            It lives in the pinned footer so the keypad can never cover it. */}
        {s.trackerCategoryId === 'other' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontFamily: work, fontWeight: 600, fontSize: 13, color: C.inkSoft }}>{t.otherCategoryLabel}</span>
            <input
              autoFocus
              value={s.trackerCustomCategory}
              onChange={e => actions.onChangeTrackerCustomCategory(e.target.value)}
              placeholder={t.otherCategoryPlaceholder}
              style={{
                height: 50, borderRadius: 12, border: `1px solid ${C.borderStrong}`, background: '#fff',
                padding: '0 16px', fontFamily: work, fontSize: 15, color: C.ink, outline: 'none', width: '100%', boxSizing: 'border-box',
              }}
            />
          </div>
        )}

        <button
          onClick={actions.onSubmitTrackerEntry}
          disabled={!canSubmit}
          style={{
            height: 54, borderRadius: 12, border: 'none', width: '100%',
            background: canSubmit ? C.sidebarBg : C.borderStrong, color: '#fff',
            fontFamily: work, fontWeight: 700, fontSize: 16, cursor: canSubmit ? 'pointer' : 'default',
          }}
        >
          {isIncome ? t.addIncomeCta : t.addExpenseCta}
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
          {KEYPAD.map(key => (
            <button
              key={key}
              onClick={() => actions.onTrackerKey(key)}
              style={{
                height: 52, borderRadius: 10, border: 'none', background: 'transparent', cursor: 'pointer',
                fontFamily: jakarta, fontWeight: 600, fontSize: 24, color: C.ink,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {key === 'del' ? <IconBackspace color={C.inkSoft} size={22} /> : key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
