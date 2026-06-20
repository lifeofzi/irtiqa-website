'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MerchSection from './MerchSection';

const TRACKS = [
  { vid: 'brnIKzYLdp4', num: '01', title: 'Fariyadras' },
  { vid: 'IN-s9IAHV7Q', num: '02', title: 'Sui Bulbulah Rach' },
  { vid: '3d5BAnarNMc', num: '03', title: 'Eid Ayi Tai' },
  { vid: 'qDDU7YgwPeY', num: '04', title: 'Ya Rab Daptam' },
];
const PL = 'OLAK5uy_nJXx8GmUS2W2ZBhwWxJrofuE_j3VbgWP0';
const WORDS = ['Revolution', 'انقلاب', 'حق', 'Revolution', 'انقلاب', 'حق'];

const WOLIVO_TRACKS = [
  { vid: 'pE52j6i6hjw', num: '01', title: 'Zehni Ghulami' },
  { vid: 'hGsXfL1IQAk', num: '02', title: 'Fariyad' },
  { vid: '_OIzpO3nwbY', num: '03', title: 'Sleep Song' },
  { vid: 'V5ycgOSmgFo', num: '04', title: 'Kab Talak' },
  { vid: 'GF_IvQI6at0', num: '05', title: 'Behta Gaya' },
  { vid: 'JCx5wxEwDM8', num: '06', title: 'Wadiyon Mei' },
  { vid: 'IXDNuj-hXPg', num: '07', title: 'Wolivo' },
  { vid: '9KNBRvqykPU', num: '08', title: 'Main Nahin Maanta' },
  { vid: '7zhY1yReT30', num: '09', title: 'Jinki Wajah Se' },
  { vid: 'G2AyGm053V8', num: '10', title: 'Walo Ha' },
];

type Section = 'irtiqa' | 'wolivo' | 'videos' | 'about' | 'merch';

const SECTION_META: Record<Section, { label: string; titleEn: string; titleAr: string; cover: string; tag: string; epLabel: string }> = {
  irtiqa: { label: 'IRTIQA EP',   titleEn: 'IRTIQA', titleAr: 'ارتقا', cover: '/cover.jpg',   tag: 'Full Album', epLabel: 'EP · 2026 · 4 Tracks' },
  wolivo: { label: 'WOLIVO',      titleEn: 'WOLIVO',  titleAr: '',       cover: '/wolivo.webp', tag: 'Album',      epLabel: '2022 · 10 Tracks' },
  videos: { label: 'ALL VIDEOS',  titleEn: 'IRTIQA', titleAr: 'ارتقا', cover: '/cover.jpg',   tag: '',           epLabel: '' },
  about:  { label: 'ABOUT',       titleEn: 'IRTIQA', titleAr: 'ارتقا', cover: '/cover.jpg',   tag: '',           epLabel: '' },
  merch:  { label: 'MERCH',       titleEn: 'IRTIQA', titleAr: 'ارتقا', cover: '/cover.jpg',   tag: '',           epLabel: '' },
};

const STREAMING = [
  {
    label: 'Spotify',
    url: 'https://open.spotify.com/artist/0J3PUchbuLhyRD6RxFQrrE',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden>
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
  },
  {
    label: 'Apple Music',
    url: 'https://music.apple.com/us/artist/ali-saffudin/1456350962',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden>
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.44c1.45.07 2.45.82 3.3.82.8 0 2.3-.96 3.88-.82 1.64.13 2.88.93 3.67 2.45-3.32 2.13-2.78 6.55.39 8.05-.52 1.37-1.23 2.72-3.22 4.34zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
      </svg>
    ),
  },
  {
    label: 'YouTube Music',
    url: 'https://music.youtube.com/channel/UCpSS-5kQeow4IGs6Z4dq76w',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden>
        <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
      </svg>
    ),
  },
];

const ALL_VIDEOS = [
  { id: 'EL-hMaWoLlk', title: 'MAYI CHANI — A Song for the Love of Kashmir', views: '1.5M' },
  { id: '5H-BJKdtT50', title: 'Rah Bakshtam | Habba Khatoon | Ali Saffudin', views: '1M' },
  { id: 'VTpp9XLVNTU', title: 'Gah Chon — Ali Saffudin | Sarangi and Guitar', views: '864K' },
  { id: 'WvoZHoUGEUw', title: 'Sahal Kar - Ali Saffudin | Hyder Dar (Official Video)', views: '126K' },
  { id: '-hWRjAw-v9I', title: 'Hamesha - Ali Saffudin (Official Music Video)', views: '4.2K' },
  { id: 'fj57xdsuCBE', title: 'Jawano | Ali Saffudin | Complex Doppio Sessions', views: '' },
  { id: 'q0sB8GAZPzw', title: 'Zindagi Kya | Ali Saffudin | Complex Doppio Sessions', views: '' },
  { id: 'G6aT0M2VKls', title: 'Bumbroo | Ali Saffudin | Complex Doppio Sessions', views: '' },
  { id: '2WXBGAABXmA', title: 'SAAZ E QALB', views: '44K' },
  { id: 'iqk2nQuEtfw', title: 'Haider Haider Saaee | Ali Saffudin | Zeeshan Jaipuri', views: '31K' },
  { id: 'z_VVXqmkCuo', title: 'Haider Haider Bol', views: '24K' },
  { id: 'KQxqwd8oQZY', title: 'Sonay do | Ali Saffudin | Zeeshan Jaipuri', views: '16K' },
  { id: 'FTkb2cvaaQk', title: 'Subhik Waav | Song Teaser', views: '12K' },
  { id: 'CxdR5t-25Qk', title: 'Ba Sahra Yem Sada | Rehman Rahi | Ali Saffudin', views: '10K' },
  { id: 'WROo1XIACMk', title: 'Tabsur | Ali Saffudin', views: '10K' },
  { id: 'G2AyGm053V8', title: 'Walo Ha | Wolivo | Ali Saffudin | Azadi Records', views: '9.8K' },
  { id: 'Jc9m69nBYC8', title: 'Ghalib in the mountains', views: '9.8K' },
  { id: 'DY81c_fTERY', title: 'AL AJAL YA MAHDI | ALI SAFFUDIN', views: '9.1K' },
  { id: 'Kl8XYKlL88A', title: 'Remembrance', views: '8.3K' },
  { id: 'hGsXfL1IQAk', title: 'Fariyad | Wolivo | Ali Saffudin | Azadi Records', views: '7K' },
  { id: 'lSbg5eAh4lw', title: "Aah ko chahiye — Ghalib's Afzal Ghazal", views: '5.7K' },
  { id: 'pE52j6i6hjw', title: 'Zehni Ghulami | Wolivo | Azadi Records', views: '5.2K' },
  { id: '9KNBRvqykPU', title: 'Main Nahin Maanta | Wolivo | Ali Saffudin | Azadi Records', views: '5.2K' },
  { id: 'cusm3o2uyH0', title: 'Ali Saffudin | Khoda Boozin | Official Visualiser', views: '4.9K' },
  { id: 'JCx5wxEwDM8', title: 'Wadiyon Mei | Wolivo | Ali Saffudin | Azadi Records', views: '4.9K' },
  { id: 'Wdf8ABfO1m0', title: 'Mein Haidari Hoon - New Release', views: '4.7K' },
  { id: '_7pmMHlFx10', title: 'Inqalab o Inqalab - Live Jam', views: '4.5K' },
  { id: 's8mTGn92OzI', title: 'Ali Saffudin | Wuzmal | KSL Anthem 2024', views: '3.9K' },
  { id: '7zhY1yReT30', title: 'Jinki Wajah Se | Wolivo | Ali Saffudin | Azadi Records', views: '3.6K' },
  { id: 'IXDNuj-hXPg', title: 'Wolivo | Ali Saffudin | Azadi Records', views: '3.5K' },
  { id: 'GaqyGLVFLBY', title: 'Siyasat Ki Salaah | Urdu Blues Rock', views: '3.3K' },
  { id: '_OIzpO3nwbY', title: 'Sleep Song | Wolivo | Ali Saffudin | Azadi Records', views: '2.6K' },
  { id: 'SslNonQ6fy8', title: 'Jinki wajah se | Live', views: '2.5K' },
  { id: 'GF_IvQI6at0', title: 'Behta Gaya | Wolivo | Ali Saffudin', views: '2K' },
  { id: 'V5ycgOSmgFo', title: 'Kab Talak | Wolivo | Ali Saffudin | Azadi Records', views: '1.5K' },
];

export default function HomeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSection = (searchParams.get('s') as Section | null);
  const validSections: Section[] = ['irtiqa', 'wolivo', 'videos', 'about', 'merch'];
  const [activeSection, setActiveSection] = useState<Section>(
    initialSection && validSections.includes(initialSection) ? initialSection : 'irtiqa'
  );

  function navigateTo(s: Section) {
    if (s !== 'irtiqa' && isPlaying && !isPausedByUser) {
      cassetteVideoRef.current?.pause();
      ytIframeRef.current?.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      setIsPausedByUser(true);
    }
    setActiveSection(s);
    router.replace(`?s=${s}`, { scroll: false });
  }
  const [activeTrack, setActiveTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPausedByUser, setIsPausedByUser] = useState(false);
  // Fixed src — iframe stays loaded so loadVideoById works immediately on first tap
  const ytSrc = `https://www.youtube.com/embed/${TRACKS[0].vid}?enablejsapi=1&rel=0&modestbranding=1&color=red`;
  const [activeWolivoTrack, setActiveWolivoTrack] = useState(0);
  const [wolivoSrc, setWolivoSrc] = useState(
    `https://www.youtube.com/embed/${WOLIVO_TRACKS[0].vid}?rel=0&modestbranding=1&color=red`
  );
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string; views: string }>(ALL_VIDEOS[0]);

  const meta = SECTION_META[activeSection];

  const pausedCassetteRef = useRef<HTMLCanvasElement>(null);
  const cassetteVideoRef = useRef<HTMLVideoElement>(null);
  const ytIframeRef = useRef<HTMLIFrameElement>(null);
  const eqRef = useRef<HTMLDivElement>(null);
  const wolivoBgRef = useRef<HTMLCanvasElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const wireTopRef = useRef<HTMLCanvasElement>(null);
  const wireBotRef = useRef<HTMLCanvasElement>(null);
  const heroCanvasRef = useRef<HTMLCanvasElement>(null);
  const vizRef = useRef<HTMLCanvasElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);

  /* ── Freeze GIF first frame onto canvas for paused state ── */
  useEffect(() => {
    const cv = pausedCassetteRef.current;
    if (!cv) return;
    const img = new Image();
    img.src = '/cassette.gif';
    img.onload = () => {
      cv.width = img.naturalWidth;
      cv.height = img.naturalHeight;
      cv.getContext('2d')?.drawImage(img, 0, 0);
    };
  }, []);

  /* ── Wolivo floral background ── */
  useEffect(() => {
    const canvas = wolivoBgRef.current;
    if (!canvas) return;
    if (activeSection !== 'wolivo') { canvas.width = 0; return; }

    const PAL = {
      bg: '#080503',
      vine: '#1C3A1A', vineLight: '#2E5A2A',
      leafDark: '#284E26', leafLight: '#4E7C44', leafHi: '#6FA060',
      red: '#A81520', crimson: '#7A0A10', orange: '#B84E0A',
      gold: '#A87800', yellow: '#C49010', pink: '#8A1228',
      petalHi: '#D05818', center: '#C49010', centerDot: '#6A4800',
    };

    function cubicBez(p0: number, p1: number, p2: number, p3: number, t: number) {
      const m = 1 - t;
      return m*m*m*p0 + 3*m*m*t*p1 + 3*m*t*t*p2 + t*t*t*p3;
    }

    interface Flower { x: number; y: number; r: number; color: string; np: number; phase: number }
    interface Leaf { x: number; y: number; len: number; w: number; angle: number; color: string }
    interface Vine { pts: {x:number;y:number}[] }
    interface Scene { vines: Vine[]; flowers: Flower[]; leaves: Leaf[] }

    function buildScene(W: number, H: number): Scene {
      let seed = 7;
      const rng = () => { seed = (seed * 1664525 + 1013904223) & 0xFFFFFFFF; return (seed >>> 0) / 0xFFFFFFFF; };
      const flColors = [PAL.red, PAL.crimson, PAL.orange, PAL.pink, PAL.gold, PAL.yellow];
      const vines: Vine[] = [], flowers: Flower[] = [], leaves: Leaf[] = [];

      for (let i = 0; i < 22; i++) {
        let sx: number, sy: number;
        const edge = Math.floor(rng() * 4);
        if (edge === 0) { sx = rng() * W; sy = -10; }
        else if (edge === 1) { sx = rng() * W; sy = H + 10; }
        else if (edge === 2) { sx = -10; sy = rng() * H; }
        else { sx = W + 10; sy = rng() * H; }
        const ex = rng() * W, ey = rng() * H;
        const cx1 = rng() * W, cy1 = rng() * H, cx2 = rng() * W, cy2 = rng() * H;
        const pts: {x:number;y:number}[] = [];
        for (let s = 0; s <= 40; s++) {
          const t = s / 40;
          const x = cubicBez(sx, cx1, cx2, ex, t);
          const y = cubicBez(sy, cy1, cy2, ey, t);
          pts.push({ x, y });
          if (s > 0 && s < 40 && rng() < 0.3) {
            const prev = pts[pts.length - 2];
            const ang = Math.atan2(y - prev.y, x - prev.x) + (rng() > 0.5 ? 1 : -1) * (Math.PI / 2 + (rng() - 0.5) * 0.7);
            const ll = 10 + rng() * 24;
            leaves.push({ x, y, len: ll, w: ll * 0.38, angle: ang, color: rng() > 0.5 ? PAL.leafDark : PAL.leafLight });
          }
        }
        vines.push({ pts });
        if (rng() > 0.15) flowers.push({ x: ex, y: ey, r: 9 + rng() * 17, color: flColors[Math.floor(rng() * flColors.length)], np: 5 + Math.floor(rng() * 3), phase: rng() * Math.PI * 2 });
      }
      for (let i = 0; i < 30; i++) {
        flowers.push({ x: rng() * W, y: rng() * H, r: 5 + rng() * 14, color: flColors[Math.floor(rng() * flColors.length)], np: 5 + Math.floor(rng() * 3), phase: rng() * Math.PI * 2 });
      }
      return { vines, flowers, leaves };
    }

    function drawLeaf(ctx: CanvasRenderingContext2D, { x, y, len, w, angle, color }: Leaf) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(w * 0.5, -len * 0.25, w * 0.5, -len * 0.75, 0, -len);
      ctx.bezierCurveTo(-w * 0.5, -len * 0.75, -w * 0.5, -len * 0.25, 0, 0);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, -1);
      ctx.lineTo(0, -len + 1);
      ctx.strokeStyle = PAL.leafHi;
      ctx.lineWidth = 0.6;
      ctx.globalAlpha = 0.35;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    function drawFlower(ctx: CanvasRenderingContext2D, { x, y, r, color, np, phase }: Flower, tick: number) {
      const rot = phase + tick * 0.002;
      for (let i = 0; i < np; i++) {
        const a = (i / np) * Math.PI * 2 + rot;
        ctx.beginPath();
        ctx.ellipse(x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62, r * 0.4, r * 0.2, a, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
      for (let i = 0; i < np; i++) {
        const a = (i / np) * Math.PI * 2 + rot + Math.PI / np;
        ctx.beginPath();
        ctx.ellipse(x + Math.cos(a) * r * 0.4, y + Math.sin(a) * r * 0.4, r * 0.26, r * 0.14, a, 0, Math.PI * 2);
        ctx.fillStyle = PAL.petalHi;
        ctx.globalAlpha = 0.65;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.beginPath(); ctx.arc(x, y, r * 0.26, 0, Math.PI * 2); ctx.fillStyle = PAL.center; ctx.fill();
      ctx.beginPath(); ctx.arc(x, y, r * 0.13, 0, Math.PI * 2); ctx.fillStyle = PAL.centerDot; ctx.fill();
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2;
        ctx.beginPath(); ctx.arc(x + Math.cos(a) * r * 0.2, y + Math.sin(a) * r * 0.2, r * 0.04, 0, Math.PI * 2);
        ctx.fillStyle = PAL.centerDot; ctx.fill();
      }
    }

    let scene: Scene;
    let raf = 0;
    let tick = 0;

    const cv = canvas;

    function resize() {
      cv.width = cv.offsetWidth || window.innerWidth;
      cv.height = cv.offsetHeight || window.innerHeight;
      scene = buildScene(cv.width, cv.height);
    }
    resize();
    window.addEventListener('resize', resize);

    function frame() {
      tick++;
      const ctx = cv.getContext('2d')!;
      const W = cv.width, H = cv.height;

      ctx.fillStyle = PAL.bg;
      ctx.fillRect(0, 0, W, H);

      const gr = ctx.createRadialGradient(W * 0.5, H * 0.42, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.72);
      gr.addColorStop(0, 'rgba(28,12,6,0.25)');
      gr.addColorStop(1, 'rgba(4,2,1,0.55)');
      ctx.fillStyle = gr;
      ctx.fillRect(0, 0, W, H);

      ctx.globalAlpha = 0.55;
      scene.vines.forEach(({ pts }) => {
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = PAL.vine; ctx.lineWidth = 1.8; ctx.stroke();
        ctx.beginPath();
        pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.strokeStyle = PAL.vineLight; ctx.lineWidth = 0.7; ctx.globalAlpha = 0.25; ctx.stroke();
        ctx.globalAlpha = 0.55;
      });

      ctx.globalAlpha = 0.62;
      scene.leaves.forEach(l => drawLeaf(ctx, l));

      ctx.globalAlpha = 0.72;
      scene.flowers.forEach(f => drawFlower(ctx, f, tick));

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }
    frame();

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [activeSection]);

  /* ── Track switching ── */
  function selectTrack(idx: number) {
    const isMobile = typeof window !== 'undefined' && navigator.maxTouchPoints > 0;
    setActiveTrack(idx);
    setIsPlaying(true);
    const win = ytIframeRef.current?.contentWindow;
    win?.postMessage(
      JSON.stringify({ event: 'command', func: 'loadVideoById', args: [{ videoId: TRACKS[idx].vid, startSeconds: 0 }] }),
      '*'
    );
    if (isMobile) {
      // Start paused — play tap is the user gesture that unlocks audio on mobile
      setIsPausedByUser(true);
      cassetteVideoRef.current?.pause();
    } else {
      setIsPausedByUser(false);
      cassetteVideoRef.current?.play();
      win?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    }
  }

  function togglePlayPause() {
    const vid = cassetteVideoRef.current;
    const iframe = ytIframeRef.current;
    if (!vid) return;
    if (isPausedByUser) {
      vid.play();
      iframe?.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      setIsPausedByUser(false);
    } else {
      vid.pause();
      iframe?.contentWindow?.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      setIsPausedByUser(true);
    }
  }

  function selectWolivoTrack(idx: number) {
    setActiveWolivoTrack(idx);
    setWolivoSrc(
      `https://www.youtube.com/embed/${WOLIVO_TRACKS[idx].vid}?autoplay=1&rel=0&modestbranding=1&color=red`
    );
  }

  useEffect(() => {

    /* ── EQ bars ── */
    const eq = eqRef.current;
    if (eq) {
      for (let i = 0; i < 24; i++) {
        const b = document.createElement('div');
        b.className = 'eq-bar';
        b.style.cssText = `--h:${(14 + Math.random() * 38).toFixed(0)}px;--dur:${(0.22 + Math.random() * 0.7).toFixed(2)}s;--dly:${(-Math.random()).toFixed(2)}s`;
        eq.appendChild(b);
      }
    }

    /* ── Ticker ── */
    const ticker = tickerRef.current;
    if (ticker) {
      const words = ['IRTIQA', 'ارتقا', 'Ali Saffudin', '◆', 'IRTIQA', 'ارتقا', 'Ali Saffudin', '◆'];
      [...words, ...words].forEach((w) => {
        const s = document.createElement('span');
        s.className = 'tick';
        s.textContent = w;
        ticker.appendChild(s);
      });
    }

    /* ── GRAIN overlay ── */
    const S = 128;
    const grainLayer = document.createElement('canvas');
    grainLayer.width = grainLayer.height = S;
    grainLayer.style.cssText =
      'position:fixed;inset:0;opacity:.012;pointer-events:none;z-index:9997;width:100%;height:100%;image-rendering:pixelated';
    document.body.appendChild(grainLayer);
    const gc = grainLayer.getContext('2d')!;
    let grainTimer: ReturnType<typeof setTimeout>;
    function tickGrain() {
      const d = gc.createImageData(S, S);
      const p = d.data;
      for (let i = 0; i < p.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        p[i] = p[i + 1] = p[i + 2] = v;
        p[i + 3] = 255;
      }
      gc.putImageData(d, 0, 0);
      grainTimer = setTimeout(tickGrain, 80);
    }
    tickGrain();

    /* ── VHS Flicker ── */
    let flickerTimer: ReturnType<typeof setTimeout>;
    function flicker() {
      const el = heroSectionRef.current;
      if (!el) return;
      const v = (0.82 + Math.random() * 0.22).toFixed(2);
      el.style.filter = `brightness(${v})`;
      flickerTimer = setTimeout(() => {
        el.style.filter = '';
        flickerTimer = setTimeout(flicker, 3500 + Math.random() * 8000);
      }, 40 + Math.random() * 130);
    }
    flickerTimer = setTimeout(flicker, 2000 + Math.random() * 3000);

    /* ── Barbed wire canvas ── */
    function drawBarb(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, angleDeg: number) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((angleDeg * Math.PI) / 180);
      ctx.strokeStyle = 'rgba(255,60,0,0.22)';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      for (let a = 0; a < 360; a += 90) {
        const r = (a * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(r) * size, Math.sin(r) * size);
        ctx.stroke();
      }
      ctx.strokeStyle = '#cc1100';
      ctx.lineWidth = 2.8;
      for (let a = 0; a < 360; a += 90) {
        const r = (a * Math.PI) / 180;
        const ex = Math.cos(r) * size, ey = Math.sin(r) * size;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        const hr1 = ((a + 75) * Math.PI) / 180, hr2 = ((a - 75) * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex + Math.cos(hr1) * 5, ey + Math.sin(hr1) * 5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex + Math.cos(hr2) * 5, ey + Math.sin(hr2) * 5);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(255,100,0,0.55)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#ff3300';
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1a0000';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.restore();
    }

    function buildWire(canvas: HTMLCanvasElement) {
      const DPR = window.devicePixelRatio || 1;
      const W = Math.max(canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth, 320);
      const H = canvas.parentElement && window.innerWidth < 761 ? 44 : 60;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      const ctx = canvas.getContext('2d')!;
      ctx.scale(DPR, DPR);
      const period = 68, amp = 14, cy = H / 2;
      const pts: { x: number; y: number }[] = [];
      for (let x = 0; x <= W; x += 2) pts.push({ x, y: cy + amp * Math.sin((x / period) * Math.PI * 2) });
      ctx.strokeStyle = 'rgba(160,0,0,0.2)';
      ctx.lineWidth = 16;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();
      ctx.strokeStyle = '#120000';
      ctx.lineWidth = 6;
      ctx.beginPath();
      pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();
      for (let i = 0; i < pts.length - 8; i += 7) {
        const p = pts[i], q = pts[Math.min(i + 8, pts.length - 1)];
        const dx = q.x - p.x, dy = q.y - p.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = (-dy / len) * 5, ny = (dx / len) * 5;
        ctx.strokeStyle = Math.floor(i / 7) % 2 === 0 ? '#883300' : '#551100';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x + nx, p.y + ny);
        ctx.lineTo(q.x - nx, q.y - ny);
        ctx.stroke();
      }
      ctx.strokeStyle = '#bb2200';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();
      ctx.strokeStyle = 'rgba(100,20,0,0.6)';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      pts.forEach((p, i) => {
        const y2 = cy - amp * 0.65 * Math.sin((p.x / period) * Math.PI * 2 + 1.0);
        i === 0 ? ctx.moveTo(p.x, y2) : ctx.lineTo(p.x, y2);
      });
      ctx.stroke();
      let bx = period * 0.5, bcount = 0;
      while (bx < W) {
        const bi = Math.round(bx / 2);
        if (bi < pts.length) { drawBarb(ctx, pts[bi].x, pts[bi].y, 14, bcount % 2 === 0 ? 45 : 0); bcount++; }
        bx += period * 0.5;
      }
    }

    const wTop = wireTopRef.current, wBot = wireBotRef.current;
    if (wTop) buildWire(wTop);
    if (wBot) { buildWire(wBot); wBot.style.transform = 'scaleY(-1)'; }

    function onWireResize() {
      if (wTop) buildWire(wTop);
      if (wBot) buildWire(wBot);
    }
    window.addEventListener('resize', onWireResize);

    /* ── Resistance hero canvas ── */
    const heroCv = heroCanvasRef.current;
    let heroRaf = 0;
    if (heroCv) {
      const heroCvNN = heroCv; // non-null alias for use inside closures
      const ctx = heroCvNN.getContext('2d')!;
      let W = 0, H = 0, tick = 0;
      let fistPulse = 0, fistDir = 1;
      const birds: { px: number; py: number; vx: number; vy: number; sz: number; al: number }[] = [];
      const glitchQ: { x: number; y: number; w: number; h: number; ttl: number; col: string }[] = [];
      const wordQ: { w: string; x: number; y: number; sz: number; rot: number; ttl: number; maxL: number }[] = [];

      function resizeHero() {
        W = heroCvNN.width = heroCvNN.offsetWidth || window.innerWidth;
        H = heroCvNN.height = heroCvNN.offsetHeight || window.innerHeight;
      }
      resizeHero();
      window.addEventListener('resize', resizeHero);

      for (let i = 0; i < 20; i++) {
        birds.push({
          px: Math.random(), py: 0.2 + Math.random() * 0.6,
          vx: 0.00025 + Math.random() * 0.0004,
          vy: -(0.00005 + Math.random() * 0.00015),
          sz: 5 + Math.random() * 11, al: 0.08 + Math.random() * 0.28,
        });
      }

      function drawMountains() {
        ctx.save();
        ctx.globalAlpha = 0.09;
        ctx.fillStyle = '#770000';
        ctx.beginPath();
        ctx.moveTo(0, H);
        [[.04,.68],[.13,.48],[.22,.62],[.33,.35],[.44,.52],[.55,.28],[.65,.46],[.75,.33],[.85,.55],[.95,.42],[1,.6]].forEach(([px,py]) => ctx.lineTo(px*W,py*H));
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 0.13;
        ctx.fillStyle = '#440000';
        ctx.beginPath();
        ctx.moveTo(0, H);
        [[.02,.84],[.11,.72],[.2,.8],[.3,.63],[.4,.75],[.52,.58],[.62,.7],[.71,.6],[.8,.76],[.9,.67],[1,.8]].forEach(([px,py]) => ctx.lineTo(px*W,py*H));
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      function drawFist(cx: number, cy: number, scale: number, alpha: number) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#aa0000';
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);
        ctx.beginPath();
        ctx.moveTo(-14, 30);
        ctx.lineTo(-16, -2);
        ctx.lineTo(-13, -20);
        ctx.lineTo(-6, -28);
        ctx.lineTo(0, -30);
        ctx.lineTo(6, -28);
        ctx.lineTo(13, -20);
        ctx.lineTo(16, -2);
        ctx.bezierCurveTo(18, -14, 14, -34, 0, -34);
        ctx.bezierCurveTo(-14, -34, -18, -14, -16, -2);
        ctx.closePath();
        ctx.fill();
        ctx.fillRect(-11, 24, 22, 20);
        ctx.restore();
      }

      function drawBird(x: number, y: number, sz: number, al: number) {
        ctx.save();
        ctx.globalAlpha = al;
        ctx.strokeStyle = '#bb1100';
        ctx.lineWidth = Math.max(1, sz * 0.16);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x - sz, y + sz * 0.38);
        ctx.quadraticCurveTo(x - sz * 0.38, y - sz * 0.38, x, y);
        ctx.quadraticCurveTo(x + sz * 0.38, y - sz * 0.38, x + sz, y + sz * 0.38);
        ctx.stroke();
        ctx.restore();
      }

      function drawCrescent(x: number, y: number, r: number, al: number) {
        ctx.save();
        ctx.globalAlpha = al;
        ctx.fillStyle = '#880000';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#050505';
        ctx.beginPath();
        ctx.arc(x + r * 0.38, y - r * 0.08, r * 0.78, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      function drawCrowd() {
        ctx.save();
        ctx.globalAlpha = 0.07;
        ctx.fillStyle = '#880000';
        const sp = 28, hy = H - 18, hr = 7;
        for (let x = sp / 2; x < W; x += sp) {
          const bob = Math.sin(x * 0.07 + tick * 0.6) * 2.5;
          ctx.beginPath();
          ctx.arc(x, hy - hr + bob, hr, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(x - 5, hy + bob, 10, 18);
          if (Math.floor(x / sp) % 3 === 0) {
            ctx.fillRect(x - 1.5, hy - 28 + bob, 3, 16);
            ctx.beginPath();
            ctx.arc(x, hy - 29 + bob, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      function drawEdgeWires() {
        ctx.save();
        ctx.globalAlpha = 0.2;
        [22, W - 22].forEach((ex) => {
          ctx.strokeStyle = '#881100';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let y = 0; y <= H; y += 3) {
            const wx = ex + Math.sin(y * 0.12 + tick) * 5;
            y === 0 ? ctx.moveTo(wx, y) : ctx.lineTo(wx, y);
          }
          ctx.stroke();
          ctx.strokeStyle = '#cc2200';
          ctx.lineWidth = 1.8;
          for (let y = 35; y < H; y += 50) {
            const bx = ex + Math.sin(y * 0.12 + tick) * 5, bs = 7;
            ctx.beginPath();
            ctx.moveTo(bx - bs, y - bs);
            ctx.lineTo(bx + bs, y + bs);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(bx + bs, y - bs);
            ctx.lineTo(bx - bs, y + bs);
            ctx.stroke();
            ctx.fillStyle = '#ff2200';
            ctx.beginPath();
            ctx.arc(bx, y, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.restore();
      }

      function spawnGlitch() {
        if (Math.random() < 0.05) {
          glitchQ.push({
            x: Math.random() * W, y: Math.random() * H,
            w: 15 + Math.random() * 200, h: 1.5 + Math.random() * 12,
            ttl: 4 + Math.random() * 10,
            col: Math.random() < 0.65 ? 'rgba(180,0,0,' : 'rgba(220,220,220,',
          });
        }
        for (let i = glitchQ.length - 1; i >= 0; i--) {
          const b = glitchQ[i];
          b.ttl--;
          if (b.ttl <= 0) { glitchQ.splice(i, 1); continue; }
          ctx.fillStyle = b.col + b.ttl * 0.025 + ')';
          ctx.fillRect(b.x, b.y, b.w, b.h);
        }
      }

      function spawnWords() {
        if (Math.random() < 0.006) {
          const maxL = 30 + Math.random() * 50;
          wordQ.push({
            w: WORDS[Math.floor(Math.random() * WORDS.length)],
            x: 0.1 + Math.random() * 0.8, y: 0.08 + Math.random() * 0.78,
            sz: 38 + Math.random() * 90, rot: (Math.random() - 0.5) * 0.45,
            ttl: maxL, maxL,
          });
        }
        wordQ.forEach((wf) => {
          const prog = wf.ttl / wf.maxL;
          const al = (prog < 0.3 ? prog / 0.3 : prog > 0.7 ? (1 - prog) / 0.3 : 1) * 0.12;
          ctx.save();
          ctx.globalAlpha = al;
          ctx.font = `bold ${wf.sz}px "Oswald",Impact,sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#cc0000';
          ctx.translate(wf.x * W, wf.y * H);
          ctx.rotate(wf.rot);
          ctx.fillText(wf.w, 0, 0);
          ctx.globalAlpha = al * 0.5;
          ctx.fillStyle = '#ff5500';
          ctx.fillText(wf.w, Math.random() * 10 - 5, 0);
          ctx.restore();
          wf.ttl--;
        });
        for (let i = wordQ.length - 1; i >= 0; i--) {
          if (wordQ[i].ttl <= 0) wordQ.splice(i, 1);
        }
      }

      function heroFrame() {
        tick += 0.016;
        ctx.clearRect(0, 0, W, H);
        drawMountains();
        drawCrowd();
        fistPulse += fistDir * 0.004;
        if (fistPulse > 0.14 || fistPulse < 0.03) fistDir *= -1;
        drawFist(W * 0.83, H * 0.58, 1.9, fistPulse);
        drawFist(W * 0.13, H * 0.52, 1.2, fistPulse * 0.65);
        drawFist(W * 0.5, H * 0.18, 0.8, fistPulse * 0.4);
        drawCrescent(W * 0.87, H * 0.11, 26, 0.07);
        birds.forEach((b) => {
          b.px += b.vx;
          b.py += b.vy;
          if (b.px > 1.06) { b.px = -0.06; b.py = 0.25 + Math.random() * 0.5; }
          if (b.py < -0.06) b.py = 0.15 + Math.random() * 0.4;
          drawBird(b.px * W, b.py * H, b.sz, b.al);
        });
        spawnGlitch();
        spawnWords();
        drawEdgeWires();
        heroRaf = requestAnimationFrame(heroFrame);
      }
      heroFrame();
    }

    /* ── Audio Visualizer ── */
    const vizCv = vizRef.current;
    let vizRaf = 0;
    if (vizCv) {
      const vizCvNN = vizCv;
      const ctx = vizCvNN.getContext('2d')!;
      const N = 90;
      const vals = new Float32Array(N);
      let t = 0;
      const phases = Array.from({ length: N }, () => Math.random() * Math.PI * 2);
      const speeds = Array.from({ length: N }, () => 0.6 + Math.random() * 2.2);
      const particles: { x: number; y: number; vx: number; vy: number; life: number; r: number }[] = [];

      function resizeViz() {
        vizCvNN.width = vizCvNN.offsetWidth;
        vizCvNN.height = vizCvNN.offsetHeight;
      }
      resizeViz();
      window.addEventListener('resize', resizeViz);

      function lerp(a: number, b: number, k: number) { return a + (b - a) * k; }

      function vizFrame() {
        t += 0.018;
        const W = vizCvNN.width, H = vizCvNN.height;
        for (let i = 0; i < N; i++) {
          const bass = i < 12 ? 0.85 : i < 30 ? 0.55 : 0.3;
          vals[i] = lerp(
            vals[i],
            Math.min(1, (bass * (Math.sin(t * 3.1 + i * 0.18) * 0.35 + 0.65) + (Math.sin(t * speeds[i] + phases[i]) * 0.5 + 0.5) * 0.55) * 0.95),
            0.14
          );
        }
        if (Math.random() < 0.4) {
          const pi = Math.floor(Math.random() * N);
          if (vals[pi] > 0.72) {
            particles.push({
              x: ((pi + 0.5) / N) * W, y: H * (1 - vals[pi] * 0.92),
              vx: (Math.random() - 0.5) * 1.5, vy: -(0.8 + Math.random() * 2),
              life: 1, r: 1 + Math.random() * 2.5,
            });
          }
        }
        ctx.clearRect(0, 0, W, H);
        ctx.save();
        ctx.translate(0, H);
        ctx.scale(1, -0.22);
        ctx.globalAlpha = 0.15;
        for (let i = 0; i < N; i++) {
          const h = vals[i] * H * 0.9, x = (i / N) * W, bw = W / N;
          ctx.fillStyle = `rgb(${(180 + vals[i] * 70) | 0},${(vals[i] * vals[i] * 60) | 0},0)`;
          ctx.fillRect(x + 1, 0, bw - 2, h);
        }
        ctx.restore();
        ctx.globalAlpha = 1;
        for (let i = 0; i < N; i++) {
          const h = vals[i] * H * 0.92, x = (i / N) * W, bw = W / N, y = H - h;
          const r = (180 + vals[i] * 75) | 0, g = (vals[i] * vals[i] * 80) | 0;
          const gr = ctx.createLinearGradient(x, y, x, H);
          gr.addColorStop(0, `rgba(${r},${g},0,1)`);
          gr.addColorStop(0.6, `rgba(${(r * 0.7) | 0},0,0,.9)`);
          gr.addColorStop(1, 'rgba(70,0,0,.5)');
          ctx.fillStyle = gr;
          ctx.fillRect(x + 1, y, bw - 2, h);
          if (h > 8) {
            const tp = ctx.createLinearGradient(x, y - 14, x, y + 2);
            tp.addColorStop(0, `rgba(255,${Math.min(255, g * 3)},0,0)`);
            tp.addColorStop(1, `rgba(255,${Math.min(255, g * 3)},0,.75)`);
            ctx.fillStyle = tp;
            ctx.fillRect(x + 1, y - 14, bw - 2, 16);
          }
        }
        ctx.strokeStyle = 'rgba(255,40,40,.45)';
        ctx.lineWidth = 1.5;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
          const x = ((i + 0.5) / N) * W, y = H * (1 - vals[i] * 0.92);
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx; p.y += p.vy; p.vy += 0.07; p.life -= 0.025;
          if (p.life <= 0) { particles.splice(i, 1); continue; }
          ctx.fillStyle = `rgba(255,${(p.life * 80) | 0},0,${p.life})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
        vizRaf = requestAnimationFrame(vizFrame);
      }
      vizFrame();
    }

    return () => {
      clearTimeout(grainTimer);
      if (grainLayer.parentNode) document.body.removeChild(grainLayer);
      clearTimeout(flickerTimer);
      cancelAnimationFrame(heroRaf);
      cancelAnimationFrame(vizRaf);
      if (heroSectionRef.current) heroSectionRef.current.style.filter = '';
      window.removeEventListener('resize', onWireResize);
    };
  }, []);

  return (
    <>
      <div className="scanlines" />
      <div className="vignette" />

      <nav className="top-nav" aria-label="Content sections">
        <div className="top-tabs">
          {(['irtiqa', 'wolivo', 'videos', 'about', 'merch'] as Section[]).map((s) => (
            <button
              key={s}
              className={`top-tab${activeSection === s ? ' active' : ''}`}
              onClick={() => navigateTo(s)}
            >
              {SECTION_META[s].label}
            </button>
          ))}
        </div>
        <div className="top-stream-icons">
          {STREAMING.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="top-stream-icon" title={s.label}>
              {s.icon}
            </a>
          ))}
        </div>
      </nav>

      {activeSection !== 'videos' && activeSection !== 'about' && activeSection !== 'merch' && <section className="hero" ref={heroSectionRef}>
        <div
          className="hero-bg"
          style={{ backgroundImage: activeSection === 'wolivo' ? 'none' : `url('${meta.cover}')`, opacity: activeSection === 'wolivo' ? 0 : 1 }}
        />
        <canvas ref={wolivoBgRef} className={`wolivo-bg${activeSection === 'wolivo' ? ' visible' : ''}`} />
        <canvas className="hero-resist" ref={heroCanvasRef} />
        <div className="hero-content">
          <div className="title-row">
            <h1 className="title-en">
              {meta.titleEn}
              <span className="g-a" aria-hidden="true">{meta.titleEn}</span>
              <span className="g-b" aria-hidden="true">{meta.titleEn}</span>
            </h1>
            {meta.titleAr && <span className="title-ar">{meta.titleAr}</span>}
          </div>
          <div className="hairline" />
          <div className="cover-outer">
            <div className="cover-glow" />
            <div className="cover-frame">
              <span className="c c-tl" /><span className="c c-tr" />
              <span className="c c-bl" /><span className="c c-br" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="cover-img" src={meta.cover} alt={`${meta.titleEn} — Ali Saffudin`} />
            </div>
          </div>
          <div className="artist">Ali Saffudin</div>
          <div className="hero-stream-links">
            <a href={activeSection === 'wolivo' ? 'https://open.spotify.com/album/5Qn6xtn4tjzf0He630r4XN' : 'https://open.spotify.com/album/7ywkGokC4VJcQwqSM4CXuN'} target="_blank" rel="noopener noreferrer" className="hero-stream-link" title="Spotify">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
            </a>
            <a href={activeSection === 'wolivo' ? 'https://music.youtube.com/playlist?list=OLAK5uy_lOCkO1qrTTKSBaGMoeH_ydFQsgoBx1i0A&si=sF8bA0sW3-xpexZI' : 'https://www.youtube.com/playlist?list=OLAK5uy_mGlIUjQvewEWnAZFDXhViSu3fB0VVoGRE'} target="_blank" rel="noopener noreferrer" className="hero-stream-link" title="YouTube Music">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"/></svg>
            </a>
            <a href={activeSection === 'wolivo' ? 'https://music.apple.com/in/album/wolivo/1804721802' : 'https://music.apple.com/us/album/irtiqa-ep/6773801507'} target="_blank" rel="noopener noreferrer" className="hero-stream-link" title="Apple Music">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.08-.35C2.79 15.25 3.51 7.7 9.05 7.42c1.28.07 2.17.74 2.93.8 1.12-.23 2.19-.91 3.39-.84 1.44.12 2.53.66 3.22 1.67-2.88 1.74-2.2 5.49.48 6.54-.57 1.52-1.31 3.02-2.02 4.69zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
            </a>
          </div>
          <div className={`eq${isPlaying && !isPausedByUser ? ' eq--playing' : ''}`} ref={eqRef} id="eq" />
        </div>
      </section>}

      {activeSection !== 'videos' && activeSection !== 'about' && activeSection !== 'merch' && (
        <>
          <div className="ticker-wrap" aria-hidden="true">
            <div className="ticker" ref={tickerRef} />
          </div>
          <div className="wire-wrap"><canvas ref={wireTopRef} /></div>
        </>
      )}

      {activeSection === 'irtiqa' ? (
        <section className="music">
          <div className="music-header">
            <span className="music-tag">Full Album</span>
            <h2 className="music-title">IRTIQA</h2>
            <span className="music-ep">EP · 2026 · 4 Tracks</span>
          </div>
          <div className="player-grid">
            <div className="yt-col">
              <div className="cassette-player">
                <video
                  ref={cassetteVideoRef}
                  src="/cassette-loop.webm"
                  poster="/cassette-poster.jpg"
                  className="cassette-player-gif"
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
                <iframe
                    ref={ytIframeRef}
                    src={ytSrc}
                    className="cassette-player-iframe"
                    title="audio"
                    allow="autoplay; encrypted-media"
                  />
                <div className={`cassette-player-overlay${!isPlaying ? ' cassette-player-overlay--idle' : ''}`}>
                  <div className="cassette-player-track">
                    {isPlaying ? TRACKS[activeTrack].title : 'Select a track'}
                  </div>
                  {isPlaying && (
                    <div className="cassette-controls">
                      <button onClick={togglePlayPause} className="cassette-ctrl-btn" aria-label={isPausedByUser ? 'Play' : 'Pause'}>
                        <span className="cassette-btn-body">
                          <span className="cassette-btn-label">
                            {isPausedByUser ? '▶︎' : '⏸︎'}
                          </span>
                        </span>
                        <span className="cassette-btn-shadow" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="tracklist-col">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/cassette.jpg" alt="" aria-hidden className="cassette-bg" />
              <div className="tracklist-head">Tracklist — Irtiqa EP</div>
              {TRACKS.map((track, idx) => (
                <div
                  key={track.vid}
                  className={`track-item${activeTrack === idx ? ' active' : ''}`}
                  onClick={() => selectTrack(idx)}
                >
                  <span className="track-num">{track.num}</span>
                  <span className="track-title">{track.title}</span>
                  <span className="track-play">▶︎</span>
                </div>
              ))}
            </div>
          </div>
          <div className="viz-wrap">
            <div className="viz-gradient" />
          </div>
        </section>
      ) : activeSection === 'wolivo' ? (
        <section className="music">
          <div className="music-header">
            <span className="music-tag">Album</span>
            <h2 className="music-title">WOLIVO</h2>
            <span className="music-ep">2022 · 10 Tracks</span>
          </div>
          <div className="player-grid">
            <div className="yt-col">
              <iframe
                src={wolivoSrc}
                className="yt-frame"
                title="Wolivo — Ali Saffudin"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
              <div className="now-playing-bar">
                <div className="mini-spool" />
                <span className="np-label">Now Playing</span>
                <span className="np-track">{WOLIVO_TRACKS[activeWolivoTrack].title}</span>
                <div className="mini-spool" />
              </div>
            </div>
            <div className="tracklist-col">
              <div className="tracklist-head">Tracklist — Wolivo</div>
              {WOLIVO_TRACKS.map((track, idx) => (
                <div
                  key={track.vid}
                  className={`track-item${activeWolivoTrack === idx ? ' active' : ''}`}
                  onClick={() => selectWolivoTrack(idx)}
                >
                  <span className="track-num">{track.num}</span>
                  <span className="track-title">{track.title}</span>
                  <span className="track-play">▶︎</span>
                </div>
              ))}
            </div>
          </div>
          <div className="viz-wrap">
            <div className="viz-gradient" />
          </div>
        </section>
      ) : activeSection === 'about' ? (
        <section className="about-section">
          <div className="about-photo-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/ali.jpg" alt="Ali Saffudin" className="about-photo" />
            <div className="about-photo-overlay" />
          </div>
          <div className="about-body">
            <div className="about-portrait-col">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/ali.jpg" alt="Ali Saffudin" className="about-portrait" />
            </div>
            <div className="about-text-col">
              <div className="about-tag">Singer · Songwriter · Kashmir</div>
              <h1 className="about-name">Ali Saffudin</h1>
              <div className="about-hairline" />
              <p className="about-para">
                Ali Saffudin is a singer-songwriter from Hassanabad, Downtown Srinagar, Kashmir.
                Raised in a Shia neighbourhood where elegies on the martyrdom of Imam Hussain
                were a way of life, music entered him early — not as performance, but as testimony.
              </p>
              <p className="about-para">
                He studied fine arts at Delhi University before returning to Kashmir in 2014,
                completing a Masters in Mass Communication at Kashmir University. He has spent
                the years since making music that refuses to separate beauty from resistance.
              </p>
              <p className="about-para">
                His early work drew from the classical Kashmiri folk tradition — reworking ballads
                by 16th-century poetess Habba Khatoon into pop without losing their original soul.
                But his range runs wider: punk, grunge, heavy metal, folk, and rock all surface in
                his writing, which moves fluidly between Kashmiri and Urdu, between grief and defiance.
              </p>
              <p className="about-para">
                In 2022, he released <em>Wolivo</em> on Azadi Records — a 10-track debut album
                that tells the story of a boy whose heartland is torn apart by conflict. It is an
                act of catharsis, condemnation, and reformation. In 2026, he returns with <em>IRTIQA</em> —
                four tracks, one question: how high can you rise?
              </p>
              <div className="about-contact-block">
                <span className="about-contact-label">Contact</span>
                <a className="about-contact-email" href="mailto:alisaffudin@gmail.com">alisaffudin@gmail.com</a>
              </div>
            </div>
          </div>
        </section>
      ) : activeSection === 'merch' ? (
        <MerchSection />
      ) : (
        <section className="videos-section">
          <div className="videos-header">
            <span className="music-tag">YouTube</span>
            <h1 className="music-title">All Videos</h1>
            <span className="music-ep">{ALL_VIDEOS.length} videos</span>
          </div>
          <div className="video-player-wrap">
            <iframe
              key={activeVideo.id}
              src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0&modestbranding=1&color=red`}
              title={activeVideo.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
            <div className="now-playing-bar">
              <div className="mini-spool" />
              <span className="np-label">Now Playing</span>
              <span className="np-track">{activeVideo.title}</span>
              <div className="mini-spool" />
            </div>
          </div>
          <div className="video-grid">
            {ALL_VIDEOS.map((v) => (
              <div
                key={v.id}
                className={`video-card${activeVideo.id === v.id ? ' active' : ''}`}
                onClick={() => setActiveVideo(v)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                  alt={v.title}
                  loading="lazy"
                />
                <div className="video-card-title">{v.title}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="wire-wrap"><canvas ref={wireBotRef} /></div>
      <footer>Ali Saffudin &nbsp;·&nbsp; alisaffudin@gmail.com &nbsp;·&nbsp; 2026</footer>
    </>
  );
}
