import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ali Saffudin — Press & Links',
  description:
    'Press coverage, streaming profiles, and external links for Ali Saffudin — Kashmiri singer-songwriter from Srinagar, Kashmir.',
};

const STREAMING = [
  { label: 'Spotify', url: 'https://open.spotify.com/artist/0J3PUchbuLhyRD6RxFQrrE' },
  { label: 'Apple Music', url: 'https://music.apple.com/us/artist/ali-saffudin/1456350962' },
  { label: 'YouTube', url: 'https://www.youtube.com/channel/UC9ezXxVBdZH7uFwE1Ua57rA' },
  { label: 'Deezer', url: 'https://www.deezer.com/en/artist/83209642' },
  { label: 'Bandcamp', url: 'https://alisaffudin.bandcamp.com/' },
  { label: 'Instagram', url: 'https://instagram.com/alisaffudin' },
  { label: 'Facebook', url: 'https://www.facebook.com/alisaffu' },
];

const PRESS = [
  {
    outlet: 'The Guardian',
    title: "'To sing in Kashmiri is political': Ali Saffudin, the singer-songwriter who smuggled his album to the world",
    url: 'https://www.theguardian.com/music/2022/aug/30/to-sing-in-kashmiri-is-political-ali-saffudin-singer-songwriter-smuggled-album',
    year: '2022',
  },
  {
    outlet: 'Platform Magazine',
    title: 'Ali Saffudin — Debut Album Wolivo',
    url: 'https://www.platform-mag.com/music/ali-saffudin.html',
    year: '2022',
  },
  {
    outlet: 'Wild City',
    title: 'Ali Saffudin — Artist Profile',
    url: 'https://www.thewildcity.com/artists/17750-ali-saffudin',
    year: '',
  },
  {
    outlet: 'Brooklyn Raga Massive',
    title: 'Ali Saffudin — Artist Profile',
    url: 'https://www.brooklynragamassive.org/artists/ali-saffudin',
    year: '',
  },
  {
    outlet: 'Outlook India',
    title: 'Meet Ali Saffudin: Singer of New Kashmiri Music',
    url: 'https://www.outlookindia.com/website/story/meet-ali-saffudin-singer-of-new-kashmiri-music/404520',
    year: '',
  },
  {
    outlet: 'Scroll.in',
    title: 'This young Kashmiri musician flew down to Delhi for a day — just to buy medicines for his granny',
    url: 'https://scroll.in/article/933379/this-young-kashmiri-musician-flew-down-to-delhi-for-a-day-just-to-buy-medicines',
    year: '',
  },
  {
    outlet: 'Sunday Guardian Live',
    title: "This solo-frontman is Valley's own Rock and Blues prodigy",
    url: 'https://sundayguardianlive.com/culture/solo-frontman-valleys-rock-blues-prodigy',
    year: '',
  },
];

export default function PressPage() {
  return (
    <div className="press-page">
      <div className="scanlines" />
      <div className="vignette" />

      <header className="press-header">
        <Link href="/" className="press-back">← Back</Link>
        <div className="press-title-block">
          <p className="press-eyebrow">Ali Saffudin</p>
          <h1 className="press-heading">Press &amp; Links</h1>
          <div className="press-hairline" />
        </div>
      </header>

      <main className="press-main">
        <section className="press-section">
          <h2 className="press-section-label">Stream &amp; Follow</h2>
          <ul className="press-link-list">
            {STREAMING.map((item) => (
              <li key={item.label} className="press-link-item">
                <a
                  href={item.url}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="press-link"
                >
                  <span className="press-link-outlet">{item.label}</span>
                  <span className="press-link-arrow">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="press-section">
          <h2 className="press-section-label">Press &amp; Features</h2>
          <ul className="press-link-list">
            {PRESS.map((item) => (
              <li key={item.url} className="press-link-item">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press-link press-link--article"
                >
                  <span className="press-link-outlet">
                    {item.outlet}
                    {item.year ? <span className="press-link-year">&nbsp;·&nbsp;{item.year}</span> : null}
                  </span>
                  <span className="press-link-title">{item.title}</span>
                  <span className="press-link-arrow">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="press-footer">
        <Link href="/" className="press-footer-home">alisaffudin.com</Link>
        &nbsp;·&nbsp; 2026
      </footer>
    </div>
  );
}
