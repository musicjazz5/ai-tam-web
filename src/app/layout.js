export const metadata = {
  title: 'AI-TAM — Intelligence for Investors',
  description: 'AI & Growth 類股地圖：追蹤 AI Compute、Memory、Photonics、Networking 等主題的即時動能與訊號',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'AI-TAM — Intelligence for Investors',
    description: 'AI & Growth 類股地圖：AI 供應鏈主題分類 × 即時動能',
    url: 'https://ai-tam.com',
    siteName: 'AI-TAM',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <body style={{ margin: 0, fontFamily: "'Inter', 'Noto Sans TC', system-ui, sans-serif", background: '#0a0f1e', color: '#e2e8f0' }}>
        {children}
      </body>
    </html>
  );
}
