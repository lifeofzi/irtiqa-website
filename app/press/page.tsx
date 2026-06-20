import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Press — Ali Saffudin | Kashmiri Singer-Songwriter',
  description: 'Press coverage of Ali Saffudin — featured in The Guardian, Outlook India, Scroll.in, Wild City, Brooklyn Raga Massive, and more.',
  alternates: { canonical: 'https://alisaffudin.com/press' },
  openGraph: {
    title: 'Press — Ali Saffudin',
    description: 'Press coverage of Ali Saffudin — featured in The Guardian, Outlook India, Scroll.in, Wild City, Brooklyn Raga Massive, and more.',
    url: 'https://alisaffudin.com/press',
    images: [{ url: '/ali.jpg' }],
  },
};

const PRESS = [
  {
    publication: 'The Guardian',
    year: '2022',
    title: '"To sing in Kashmiri is political" — Ali Saffudin, the singer-songwriter who smuggled his album to the world',
  },
  {
    publication: 'Outlook India',
    year: '2022',
    title: 'Meet Ali Saffudin: Singer of New Kashmiri Music',
  },
  {
    publication: 'Scroll.in',
    year: '2022',
    title: 'This young Kashmiri musician flew down to Delhi for a day — just to buy medicines for his granny',
  },
  {
    publication: 'Platform Magazine',
    year: '2022',
    title: 'Ali Saffudin — Debut Album Wolivo',
  },
  {
    publication: 'Sunday Guardian Live',
    year: '2022',
    title: "This solo-frontman is Valley's own Rock and Blues prodigy",
  },
  {
    publication: 'Wild City',
    year: '',
    title: 'Ali Saffudin — Artist Profile',
  },
  {
    publication: 'Brooklyn Raga Massive',
    year: '',
    title: 'Ali Saffudin — Artist Profile',
  },
];

export default function PressPage() {
  return (
    <>
      <div className="scanlines" />
      <div className="vignette" />
      <nav className="top-nav" style={{ justifyContent: 'flex-start' }}>
        <Link href="/" className="top-tab">← Back</Link>
      </nav>
      <main className="press-page">
        <div className="press-page-header">
          <span className="music-tag">Media</span>
          <h1 className="music-title">Press</h1>
        </div>
        <div className="press-list">
          {PRESS.map((item, i) => (
            <article key={i} className="press-item">
              <div className="press-item-meta">
                <span className="press-publication">{item.publication}</span>
                {item.year && <span className="press-year">{item.year}</span>}
              </div>
              <p className="press-item-title">{item.title}</p>
            </article>
          ))}
        </div>
        <div className="press-contact">
          <span className="about-contact-label">Press Enquiries</span>
          <a className="about-contact-email" href="mailto:alisaffudin@gmail.com">alisaffudin@gmail.com</a>
        </div>
      </main>
    </>
  );
}
