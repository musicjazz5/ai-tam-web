'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const CATEGORY_ICONS = {
  'AI Compute': '⚡', 'Memory': '🧠', 'Semis': '🔬', 'Networking': '🌐',
  'Photonics': '💡', 'AI Systems': '🖥️', 'AI Cloud': '☁️',
  'Infrastructure': '🏗️', 'Power': '⚡', 'AI Software': '💻',
  'Drones': '🚁', 'Space / Satellite / Defense': '🛸', 'Quantum': '⚛️',
  'Robotics': '🤖', 'Nuclear': '☢️', 'Fintech': '💰',
  'Hyperscalers': '🌍', 'Foundry': '🏭', 'Semi Equipment': '🔧',
  'EDA / Design': '📐', 'Cybersecurity': '🔒', 'Data / Observability': '📊',
  'Crypto / Miners': '₿', 'eVTOL / Air Mobility': '✈️', 'Defense': '🛡️',
};

function pct(v) {
  if (v == null) return null;
  return `${v >= 0 ? '+' : ''}${Number(v).toFixed(1)}%`;
}

function TickerChip({ t }) {
  const chg = t.regular_change_pct ?? t.change_pct;
  const chgStr = pct(chg);
  const color = chg == null ? '#64748b' : chg >= 0 ? '#4ade80' : '#f87171';
  return (
    <span style={{ background: '#1e293b', borderRadius: 5, padding: '3px 7px', fontSize: 11.5, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{ color: '#e2e8f0', fontWeight: 700 }}>{t.symbol}</span>
      {chgStr && <span style={{ color, fontSize: 10.5 }}>{chgStr}</span>}
    </span>
  );
}

function CategoryCard({ cat }) {
  const [open, setOpen] = useState(false);
  const icon = CATEGORY_ICONS[cat.name] || '◈';
  const tickers = cat.tickers || [];
  const shown = open ? tickers : tickers.slice(0, 6);

  return (
    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: '14px 16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <span style={{ fontSize: 15 }}>{icon}</span>
        <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 13 }}>{cat.name}</span>
        <span style={{ color: '#475569', fontSize: 10.5, marginLeft: 'auto' }}>{tickers.length}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {shown.map(t => <TickerChip key={t.symbol} t={t} />)}
        {tickers.length > 6 && (
          <button onClick={() => setOpen(o => !o)} style={{ background: 'transparent', border: '1px solid #334155', borderRadius: 5, padding: '3px 7px', fontSize: 10.5, color: '#64748b', cursor: 'pointer' }}>
            {open ? '收起' : `+${tickers.length - 6}`}
          </button>
        )}
      </div>
    </div>
  );
}

function SignalRow({ t }) {
  const rel = t.rel_5d_vs_qqq_pct;
  const score = t.thesis_score;
  const relColor = rel == null ? '#64748b' : rel >= 0 ? '#4ade80' : '#f87171';
  return (
    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
      <span style={{ color: '#f1f5f9', fontWeight: 800, fontSize: 13, minWidth: 52 }}>{t.symbol}</span>
      {rel != null && (
        <span style={{ color: relColor, fontWeight: 700, fontSize: 12 }}>5D vs QQQ {pct(rel)}</span>
      )}
      {score != null && (
        <span style={{ background: '#1e293b', borderRadius: 4, padding: '2px 7px', color: '#a78bfa', fontSize: 11, fontWeight: 700 }}>Score {Math.round(score)}</span>
      )}
      <span style={{ background: '#052e16', color: '#4ade80', borderRadius: 4, padding: '2px 7px', fontSize: 11 }}>{t.action}</span>
      {t.watch_reason && (
        <span style={{ color: '#475569', fontSize: 11, flex: 1 }}>{t.watch_reason}</span>
      )}
    </div>
  );
}

function WatchRow({ t }) {
  const chg = t.regular_change_pct ?? t.change_pct;
  const chgColor = chg == null ? '#94a3b8' : chg >= 0 ? '#4ade80' : '#f87171';
  const actionColor = t.action?.includes('做多') || t.action?.includes('追蹤') ? '#4ade80'
    : t.action?.includes('避開') || t.action?.includes('放空') ? '#f87171' : '#fbbf24';
  return (
    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <span style={{ color: '#f1f5f9', fontWeight: 800, fontSize: 13, minWidth: 52 }}>{t.symbol}</span>
      {chg != null && <span style={{ color: chgColor, fontSize: 12, fontWeight: 700 }}>{pct(chg)}</span>}
      {t.price != null && <span style={{ color: '#94a3b8', fontSize: 11 }}>${t.price.toFixed(2)}</span>}
      <span style={{ color: actionColor, fontSize: 11, fontWeight: 700 }}>{t.action}</span>
      {t.thesis_score != null && (
        <span style={{ color: '#64748b', fontSize: 10.5 }}>Score {Math.round(t.thesis_score)}</span>
      )}
      {t.watch_reason && (
        <span style={{ color: '#475569', fontSize: 11, flex: 1 }}>{t.watch_reason}</span>
      )}
    </div>
  );
}

const TABS = [
  { id: 'map',      label: '類股地圖',  en: 'AI Growth Map' },
  { id: 'signal',   label: 'Early Signal', en: '族群轉折' },
  { id: 'watch',    label: '追蹤名單',  en: 'Watchlist' },
];

export default function MapPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('map');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/data/theme_maps_latest.json')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(String(e)); setLoading(false); });
  }, []);

  const themes = data?.themes || [];
  const mapTheme    = themes.find(t => t.id === 'aiGrowth');
  const signalTheme = themes.find(t => t.id === 'earlySignal');
  const watchTheme  = themes.find(t => t.id === 'aiTamWatchlist');

  const q = search.toLowerCase();

  const mapCats = (mapTheme?.categories || []).filter(c =>
    !q || c.name.toLowerCase().includes(q) ||
    (c.tickers || []).some(t => t.symbol?.toLowerCase().includes(q))
  );

  const signalTickers = (signalTheme?.categories || [])
    .flatMap(c => (c.tickers || []).map(t => ({ ...t, _cat: c.name })))
    .filter(t => !q || t.symbol?.toLowerCase().includes(q) || t._cat?.toLowerCase().includes(q))
    .sort((a, b) => (b.rel_5d_vs_qqq_pct ?? -999) - (a.rel_5d_vs_qqq_pct ?? -999));

  const watchTickers = (watchTheme?.categories || [])
    .flatMap(c => (c.tickers || []).map(t => ({ ...t, _cat: c.name })))
    .filter(t => !q || t.symbol?.toLowerCase().includes(q) || t.action?.toLowerCase().includes(q));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', position: 'sticky', top: 0, background: '#0a0f1e', zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#6366f1,#a855f7)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12, color: '#fff' }}>AI</div>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#f1f5f9' }}>AI-TAM</span>
        </Link>
        <div style={{ color: '#6366f1', fontWeight: 700, fontSize: 13, display: 'none' }}>
          {data?.generated_at && new Date(data.generated_at).toLocaleDateString('zh-TW')}
        </div>
        {data?.generated_at && (
          <div style={{ color: '#475569', fontSize: 11 }}>更新 {new Date(data.generated_at).toLocaleDateString('zh-TW')}</div>
        )}
      </nav>

      <main style={{ flex: 1, padding: '20px', maxWidth: 1280, margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid #1e293b', paddingBottom: 0 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: '10px 16px', fontSize: 13, fontWeight: tab === t.id ? 700 : 500,
              color: tab === t.id ? '#a78bfa' : '#64748b',
              borderBottom: tab === t.id ? '2px solid #a78bfa' : '2px solid transparent',
              marginBottom: -1,
            }}>
              {t.label}
              <span style={{ marginLeft: 5, fontSize: 10.5, color: '#475569' }}>{t.en}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="搜尋類別或個股…"
          style={{ width: '100%', maxWidth: 340, background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, padding: '8px 14px', color: '#e2e8f0', fontSize: 13, marginBottom: 18, outline: 'none', boxSizing: 'border-box' }}
        />

        {/* Loading / Error */}
        {loading && (
          <div style={{ textAlign: 'center', color: '#475569', padding: '60px 0', fontSize: 14 }}>載入中…</div>
        )}
        {error && (
          <div style={{ background: '#1c0a0a', border: '1px solid #7f1d1d', borderRadius: 10, padding: '16px 20px', color: '#fca5a5', fontSize: 13 }}>
            資料載入失敗：{error}。請稍後重試或前往 <a href="https://ai-tam.org/market-scan" style={{ color: '#818cf8' }}>ai-tam.org</a>。
          </div>
        )}

        {/* ── Tab: AI Growth Map ── */}
        {!loading && !error && tab === 'map' && (
          <>
            <div style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ color: '#64748b', fontSize: 12 }}>
                {mapCats.length} 類股族群 · 資料每日更新
              </div>
            </div>
            {mapCats.length === 0 && (
              <div style={{ color: '#475569', padding: '30px 0', fontSize: 13 }}>沒有符合的類別</div>
            )}
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
              {mapCats.map(c => <CategoryCard key={c.name} cat={c} />)}
            </div>
          </>
        )}

        {/* ── Tab: Early Signal ── */}
        {!loading && !error && tab === 'signal' && (
          <>
            <div style={{ color: '#64748b', fontSize: 12, marginBottom: 14 }}>
              {signalTickers.length} 個早期訊號 · 依 5D vs QQQ 排序
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {signalTickers.length === 0 && <div style={{ color: '#475569', fontSize: 13 }}>目前無早期訊號</div>}
              {signalTickers.map((t, i) => (
                <div key={`${t.symbol}-${i}`}>
                  {(i === 0 || t._cat !== signalTickers[i - 1]._cat) && (
                    <div style={{ color: '#475569', fontSize: 11, fontWeight: 700, marginTop: i > 0 ? 14 : 0, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {t._cat}
                    </div>
                  )}
                  <SignalRow t={t} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Tab: Watchlist ── */}
        {!loading && !error && tab === 'watch' && (
          <>
            <div style={{ color: '#64748b', fontSize: 12, marginBottom: 14 }}>
              {watchTickers.length} 個追蹤個股 · AI-TAM 每日更新
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {watchTickers.length === 0 && <div style={{ color: '#475569', fontSize: 13 }}>目前無追蹤標的</div>}
              {watchTickers.map((t, i) => (
                <div key={`${t.symbol}-${i}`}>
                  {(i === 0 || t._cat !== watchTickers[i - 1]._cat) && (
                    <div style={{ color: '#475569', fontSize: 11, fontWeight: 700, marginTop: i > 0 ? 14 : 0, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {t._cat}
                    </div>
                  )}
                  <WatchRow t={t} />
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <footer style={{ padding: '16px 24px', borderTop: '1px solid #1e293b', color: '#334155', fontSize: 11.5, textAlign: 'center' }}>
        AI-TAM · 資料每日自動更新 · 非投資建議，僅供研究參考
      </footer>
    </div>
  );
}
