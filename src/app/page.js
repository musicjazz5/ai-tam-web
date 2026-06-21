import Link from 'next/link';

const themes = [
  { icon: '⚡', label: 'AI Compute',    desc: 'NVDA · AMD · TSMC' },
  { icon: '🧠', label: 'AI Memory',     desc: 'MU · SNDK · HBM' },
  { icon: '💡', label: 'Photonics',     desc: 'COHR · LITE · MRVL' },
  { icon: '🌐', label: 'AI Networking', desc: 'ANET · CIEN · ALAB' },
  { icon: '☁️', label: 'AI Cloud',      desc: 'MSFT · AMZN · GOOGL' },
  { icon: '🤖', label: 'Robotics',      desc: 'ISRG · ABB · FANUC' },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{ padding: '18px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #1e293b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#6366f1,#a855f7)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, color: '#fff' }}>AI</div>
          <span style={{ fontWeight: 800, fontSize: 17, color: '#f1f5f9', letterSpacing: '-0.02em' }}>AI-TAM</span>
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Link href="/map" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>類股地圖</Link>
          <Link href="https://ai-tam.org/market-scan" style={{ color: '#94a3b8', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>市場掃描</Link>
          <Link href="/map" style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            開始使用 →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 60px', textAlign: 'center' }}>

        <div style={{ background: 'linear-gradient(135deg,#6366f120,#a855f720)', border: '1px solid #6366f140', borderRadius: 999, padding: '6px 16px', fontSize: 12.5, color: '#a78bfa', fontWeight: 700, marginBottom: 24, letterSpacing: '0.05em' }}>
          ◈ AI & GROWTH 類股地圖
        </div>

        <h1 style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', margin: '0 0 20px', background: 'linear-gradient(135deg,#f1f5f9 0%,#a78bfa 60%,#6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Intelligence<br />for Investors
        </h1>

        <p style={{ fontSize: 18, color: '#94a3b8', maxWidth: 560, lineHeight: 1.7, margin: '0 0 40px', fontWeight: 400 }}>
          依主題分類追蹤 AI 供應鏈與成長股動能——<br />
          從 AI Compute、Memory、矽光子到 Robotics，即時訊號一圖掌握。
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 72 }}>
          <Link href="/map" style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', color: '#fff', padding: '14px 32px', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: '0 0 32px #6366f140' }}>
            進入類股地圖 →
          </Link>
          <Link href="https://ai-tam.org/market-scan" style={{ background: '#1e293b', color: '#cbd5e1', padding: '14px 32px', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none', border: '1px solid #334155' }}>
            完整市場掃描
          </Link>
        </div>

        {/* Theme grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, maxWidth: 720, width: '100%' }}>
          {themes.map(t => (
            <div key={t.label} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: '16px 14px', textAlign: 'left' }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{t.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0', marginBottom: 3 }}>{t.label}</div>
              <div style={{ fontSize: 11.5, color: '#64748b' }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{ padding: '20px 32px', borderTop: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ color: '#475569', fontSize: 12.5 }}>© 2026 AI-TAM · Intelligence for Investors</span>
        <span style={{ color: '#334155', fontSize: 12 }}>非投資建議，僅供研究參考</span>
      </footer>

    </div>
  );
}
