'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const SIGNAL_COLORS = {
  bullish:   { bg: '#052e16', border: '#16a34a', text: '#4ade80', badge: '#16a34a' },
  caution:   { bg: '#1c1917', border: '#d97706', text: '#fbbf24', badge: '#d97706' },
  hold:      { bg: '#0f172a', border: '#3b82f6', text: '#93c5fd', badge: '#3b82f6' },
  neutral:   { bg: '#0f172a', border: '#475569', text: '#94a3b8', badge: '#475569' },
  watchlist: { bg: '#1e1b4b', border: '#7c3aed', text: '#c4b5fd', badge: '#7c3aed' },
};

function pct(v) {
  if (v == null) return '—';
  return `${v >= 0 ? '+' : ''}${Number(v).toFixed(1)}%`;
}

function ThemeCard({ theme }) {
  const [open, setOpen] = useState(false);
  const tickers = theme.tickers || [];
  const preview = tickers.slice(0, open ? tickers.length : 4);
  const c = SIGNAL_COLORS[theme.signal] || SIGNAL_COLORS.neutral;

  return (
    <div style={{ background: c.bg, border: `1.5px solid ${c.border}30`, borderRadius: 12, padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 16 }}>{theme.icon || '◈'}</span>
            <span style={{ color: '#f1f5f9', fontWeight: 800, fontSize: 14 }}>{theme.label}</span>
            <span style={{ background: c.badge + '25', color: c.text, fontSize: 10.5, fontWeight: 700, padding: '2px 7px', borderRadius: 4 }}>{theme.signal}</span>
          </div>
          {theme.thesis && <div style={{ color: '#64748b', fontSize: 11.5, lineHeight: 1.5 }}>{theme.thesis}</div>}
        </div>
        {theme.score != null && (
          <div style={{ background: c.border + '20', borderRadius: 8, padding: '6px 10px', textAlign: 'center', flexShrink: 0 }}>
            <div style={{ color: c.text, fontSize: 18, fontWeight: 900, lineHeight: 1 }}>{theme.score}</div>
            <div style={{ color: c.text + '80', fontSize: 10 }}>score</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
        {preview.map(t => (
          <span key={t.symbol} style={{ background: '#1e293b', borderRadius: 5, padding: '4px 8px', fontSize: 11.5, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ color: '#e2e8f0', fontWeight: 700 }}>{t.display_symbol || t.symbol}</span>
            {t.rel_5d_vs_qqq_pct != null && (
              <span style={{ color: t.rel_5d_vs_qqq_pct >= 0 ? '#4ade80' : '#f87171', fontSize: 10.5 }}>
                {pct(t.rel_5d_vs_qqq_pct)}
              </span>
            )}
          </span>
        ))}
        {tickers.length > 4 && (
          <button onClick={() => setOpen(o => !o)} style={{ background: 'transparent', border: '1px solid #334155', borderRadius: 5, padding: '4px 8px', fontSize: 11, color: '#64748b', cursor: 'pointer' }}>
            {open ? '收起' : `+${tickers.length - 4} 更多`}
          </button>
        )}
      </div>

      {(theme.catalysts || []).length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {theme.catalysts.map(c2 => (
            <span key={c2} style={{ background: '#1e293b', borderRadius: 4, fontSize: 10.5, color: '#475569', padding: '2px 6px' }}>{c2}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MapPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/map-data')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(String(e)); setLoading(false); });
  }, []);

  const themes = (data?.themes || []).filter(t => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.label?.toLowerCase().includes(q) ||
      t.thesis?.toLowerCase().includes(q) ||
      (t.tickers || []).some(tk => (tk.display_symbol || tk.symbol || '').toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', position: 'sticky', top: 0, background: '#0a0f1e', zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#6366f1,#a855f7)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12, color: '#fff' }}>AI</div>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#f1f5f9' }}>AI-TAM</span>
        </Link>
        <div style={{ color: '#6366f1', fontWeight: 700, fontSize: 13 }}>AI & Growth 類股地圖</div>
        {data?.generated_at && (
          <div style={{ color: '#475569', fontSize: 11 }}>更新 {new Date(data.generated_at).toLocaleDateString('zh-TW')}</div>
        )}
      </nav>

      <main style={{ flex: 1, padding: '24px 20px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#f1f5f9', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            AI & Growth 類股地圖
          </h1>
          <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
            依主題分類追蹤 AI 供應鏈動能 · 5D vs QQQ 相對強弱 · 即時訊號
          </p>
        </div>

        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜尋主題或個股…"
          style={{ width: '100%', maxWidth: 380, background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: '9px 14px', color: '#e2e8f0', fontSize: 13, marginBottom: 20, outline: 'none', boxSizing: 'border-box' }}
        />

        {loading && (
          <div style={{ textAlign: 'center', color: '#475569', padding: '60px 0' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>⟳</div>
            載入中…
          </div>
        )}

        {error && (
          <div style={{ background: '#1c0a0a', border: '1px solid #7f1d1d', borderRadius: 10, padding: '16px 20px', color: '#fca5a5', fontSize: 13 }}>
            資料載入失敗：{error}。請稍後重試或前往 <a href="https://ai-tam.org/market-scan?tab=aiGrowthMap" style={{ color: '#818cf8' }}>ai-tam.org</a>。
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Stats bar */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
              {[
                { label: '主題數', val: themes.length },
                { label: 'Bullish', val: themes.filter(t => t.signal === 'bullish').length, color: '#4ade80' },
                { label: 'Caution', val: themes.filter(t => t.signal === 'caution').length, color: '#fbbf24' },
                { label: 'Watchlist', val: themes.filter(t => t.signal === 'watchlist').length, color: '#c4b5fd' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: '8px 14px', textAlign: 'center' }}>
                  <div style={{ color: color || '#94a3b8', fontSize: 18, fontWeight: 900 }}>{val}</div>
                  <div style={{ color: '#475569', fontSize: 10.5 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Themes grid */}
            <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))' }}>
              {themes.map((t, i) => <ThemeCard key={t.label || i} theme={t} />)}
            </div>

            {themes.length === 0 && (
              <div style={{ color: '#475569', textAlign: 'center', padding: '40px 0' }}>沒有符合的主題</div>
            )}
          </>
        )}
      </main>

      <footer style={{ padding: '16px 24px', borderTop: '1px solid #1e293b', color: '#334155', fontSize: 11.5, textAlign: 'center' }}>
        AI-TAM · 資料每日自動更新 · 非投資建議，僅供研究參考
      </footer>
    </div>
  );
}
