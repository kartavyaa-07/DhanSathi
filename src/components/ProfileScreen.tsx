import React from 'react';
import { useAppStore } from '../store';
import { C, jakarta, work, cardStyle } from '../ui';
import { IconWarning, IconBank, IconPlusCircle, IconTrend, IconChevron, IconEdit, TRACKER_ICONS } from './Icons';
import { entryTimeLabel } from '../data';
import { hasApiKey, apiKeyFromEnv } from '../lib/claude';

export function ProfileScreen() {
  const { s, actions, derived } = useAppStore();
  const { t, fmt } = derived;

  const reportScamHref = 'https://wa.me/?text=' + encodeURIComponent(t.reportScamMessage);

  const usedPct = derived.budgetUsedPct;
  const overBudget = usedPct > 100;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, padding: '20px 20px 24px 20px' }}>
      {/* The whole name card is the way into the editor, so tapping the name works. */}
      <button
        onClick={actions.onOpenProfileEditor}
        aria-label={t.editProfile}
        style={{ ...cardStyle, padding: 16, display: 'flex', gap: 14, alignItems: 'center', width: '100%', textAlign: 'left', cursor: 'pointer' }}
      >
        <div style={{ width: 52, height: 52, borderRadius: 9999, flexShrink: 0, background: C.sidebarBg, color: C.greenLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: jakarta, fontWeight: 700, fontSize: 18 }}>
          {s.profileName.charAt(0)}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          <span style={{ fontFamily: work, fontWeight: 700, fontSize: 16, color: C.ink }}>{s.profileName}</span>
          <span style={{ fontFamily: work, fontSize: 13, color: C.inkFaint }}>{derived.selectedIncomeTypeLabel}</span>
        </div>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, color: C.green }}>
          <IconEdit color={C.green} size={16} />
          <span style={{ fontFamily: work, fontWeight: 600, fontSize: 13 }}>{t.edit}</span>
        </span>
      </button>

      {/* ---- Financial tracker ------------------------------------------ */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 18, color: C.ink }}>{t.financialTracker}</span>
        <span style={{ fontFamily: work, fontSize: 13, color: C.inkFaint }}>{t.thisMonth}</span>
      </div>

      <div style={{ borderRadius: 12, background: C.sidebarBg, padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontFamily: work, fontSize: 14, color: C.sidebarInk }}>{t.availableBalance}</span>
        <span style={{ fontFamily: jakarta, fontWeight: 800, fontSize: 30, color: '#fff' }}>₹{fmt(derived.availableBalance)}</span>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid #565E74' }}>
          <TrackerStat label={t.addedThisMonth} value={`+₹${fmt(derived.monthlyIncome)}`} tone={C.greenLight} />
          <TrackerStat label={t.spentThisMonth} value={`−₹${fmt(derived.monthlyExpenses)}`} tone="#FFB4AB" align="right" />
        </div>

        {derived.monthlyBudget > 0 ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 14 }}>
              <span style={{ fontFamily: work, fontSize: 12, color: C.sidebarInk }}>₹{fmt(derived.monthlyExpenses)} / ₹{fmt(derived.monthlyBudget)}</span>
              <span style={{ fontFamily: work, fontWeight: 700, fontSize: 12, color: overBudget ? '#FFB4AB' : '#fff' }}>
                {overBudget ? t.budgetOver : `${usedPct}%`}
              </span>
            </div>
            <div style={{ height: 8, borderRadius: 9999, background: 'rgba(190,198,224,0.25)', marginTop: 6, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(usedPct, 100)}%`, borderRadius: 9999, background: overBudget ? '#FFB4AB' : C.greenLight, transition: 'width 240ms ease' }} />
            </div>
          </>
        ) : (
          <span style={{ fontFamily: work, fontSize: 12, color: C.sidebarInk, marginTop: 12 }}>{t.noIncomeYet}</span>
        )}
      </div>

      {s.aaLinked ? (
        <div style={{ ...cardStyle, padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <IconBank color={C.green} size={20} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: work, fontWeight: 700, fontSize: 14, color: C.ink }}>{t.upiBankLinked}</span>
              <span style={{ fontFamily: work, fontSize: 12, color: C.inkFaint }}>{t.upiBankSublabel}</span>
            </div>
          </div>
          <button onClick={actions.onRevokeAA} style={{ height: 36, padding: '0 14px', borderRadius: 9999, border: `1px solid ${C.danger}`, background: '#fff', color: C.danger, fontFamily: work, fontWeight: 600, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>{t.revoke}</button>
        </div>
      ) : (
        <button onClick={actions.onLinkBankFromProfile} style={{ height: 56, borderRadius: 12, border: 'none', background: C.sidebarBg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer', width: '100%' }}>
          <IconBank color="#fff" size={20} />
          <span style={{ fontFamily: work, fontWeight: 700, fontSize: 16 }}>{t.linkUpiBank}</span>
        </button>
      )}

      <div style={{ display: 'flex', gap: 10 }}>
        <TrackerCta label={t.addIncomeCta} onClick={() => actions.onOpenTracker('income')} />
        <TrackerCta label={t.addExpenseCta} onClick={() => actions.onOpenTracker('expense')} />
      </div>

      <div style={{ ...cardStyle, padding: 4, display: 'flex', flexDirection: 'column' }}>
        {s.trackerEntries.length === 0 ? (
          <span style={{ fontFamily: work, fontSize: 13, color: C.inkFaint, padding: 14, lineHeight: '19px' }}>{t.noEntriesYet}</span>
        ) : (
          derived.recentEntries.map((e, i) => {
            const Icon = TRACKER_ICONS[e.categoryId] || TRACKER_ICONS.other;
            const income = e.kind === 'income';
            return (
              <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderTop: i === 0 ? 'none' : `1px solid ${C.border}` }}>
                <div style={{ width: 36, height: 36, borderRadius: 9999, flexShrink: 0, background: income ? C.greenBg : C.dangerBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon color={income ? C.greenDark : C.danger} size={18} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                  <span style={{ fontFamily: work, fontWeight: 600, fontSize: 14, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{derived.entryLabel(e)}</span>
                  <span style={{ fontFamily: work, fontSize: 12, color: C.inkFaint }}>{entryTimeLabel(e.at, s.lang)}</span>
                </div>
                <span style={{ fontFamily: jakarta, fontWeight: 700, fontSize: 15, color: income ? C.green : C.ink, flexShrink: 0 }}>
                  {income ? '+' : '−'}₹{fmt(e.amount)}
                </span>
              </div>
            );
          })
        )}
      </div>

      {/* ---- Profile settings ------------------------------------------- */}
      <div style={{ ...cardStyle, padding: 0, display: 'flex', flexDirection: 'column' }}>
        <button onClick={actions.onRetakeQuiz} style={{ background: 'none', border: 'none', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer' }}>
          <IconTrend color={C.inkSoft} size={20} />
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <span style={{ fontFamily: work, fontWeight: 600, fontSize: 14, color: C.ink }}>{t.riskProfileLabel}</span>
            <span style={{ fontFamily: work, fontSize: 12, color: C.inkFaint }}>{t.currentLabel}: {derived.riskTierLabel}</span>
          </div>
          <IconChevron />
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderTop: `1px solid ${C.border}` }}>
          <span style={{ fontFamily: work, fontSize: 14, color: C.ink }}>{t.language}</span>
          <button onClick={actions.onToggleLanguage} style={{ height: 36, padding: '0 14px', borderRadius: 9999, border: `1px solid ${C.borderStrong}`, background: '#fff', color: C.green, fontFamily: work, fontWeight: 600, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {s.lang === 'hi' ? 'हि | EN' : 'EN | हि'}
          </button>
        </div>
      </div>

      <div style={{ ...cardStyle, padding: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontFamily: work, fontWeight: 700, fontSize: 14, color: C.ink }}>{t.apiKeyLabel}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: 9999, background: hasApiKey() ? C.green : C.borderStrong, display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontFamily: work, fontWeight: 600, fontSize: 14, color: hasApiKey() ? C.green : C.inkFaint }}>
            {hasApiKey() ? (apiKeyFromEnv() ? t.apiKeyEnv : t.apiKeyLocal) : t.apiKeyNone}
          </span>
        </div>
        <span style={{ fontFamily: work, fontSize: 12, color: C.inkFaint }}>
          {t.apiKeyEnvHelp}
        </span>
      </div>

      <a href={reportScamHref} target="_blank" rel="noreferrer" style={{ fontFamily: work, fontWeight: 600, fontSize: 14, color: C.danger, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <IconWarning size={14} />{t.reportScam}
      </a>
    </div>
  );
}

function TrackerStat({ label, value, tone = '#fff', align = 'left' }: { label: string; value: string; tone?: string; align?: 'left' | 'right' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: align === 'right' ? 'flex-end' : 'flex-start' }}>
      <span style={{ fontFamily: work, fontSize: 12, color: C.sidebarInk }}>{label}</span>
      <span style={{ fontFamily: work, fontWeight: 600, fontSize: 15, color: tone }}>{value}</span>
    </div>
  );
}

function TrackerCta({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ flex: 1, height: 50, borderRadius: 12, border: `1px solid ${C.borderStrong}`, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
      <IconPlusCircle color={C.green} size={18} />
      <span style={{ fontFamily: work, fontWeight: 600, fontSize: 14, color: C.ink }}>{label}</span>
    </button>
  );
}
