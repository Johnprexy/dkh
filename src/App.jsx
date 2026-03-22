import { useState, useEffect, useRef } from "react";
import {
  motion, AnimatePresence,
  useScroll, useTransform, useInView,
  useMotionValue, useSpring, animate
} from "framer-motion";

// IMG_1665 — white garment + blue sash, forward-facing mic — HERO
const P1 = "/dkh-hero.jpg";
// IMG_1666 — CelestialFocus teaching shot — ABOUT / CONTACT / PANELS
const P2 = "/dkh-teaching.jpg";
// Original formal headshot — supplementary panels
const P3 = "/dkh-formal.jpg";

/* ─── STYLES ──────────────────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,700;1,9..144,300;1,9..144,400;1,9..144,700&family=Manrope:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      /* ── DEEP NAVY + WHITE + ELECTRIC BLUE ── */
      --ink:     #09152A;   /* deep navy — dark sections */
      --ink2:    #0E1D3A;   /* mid navy */
      --ink3:    #152444;   /* lighter navy card */
      --warm:    #FFFFFF;   /* pure white — light sections */
      --warm2:   #EEF3FB;   /* ice-blue surface */
      --border-d: rgba(255,255,255,0.08);
      --border-l: rgba(9,21,42,0.10);
      --gold:    #2563EB;   /* electric blue — primary accent */
      --gold2:   #4A80F5;   /* lighter blue hover */
      --blue-glow: rgba(37,99,235,0.18);
      --white:   #FFFFFF;
      --muted-d: rgba(255,255,255,0.50);
      --muted-l: #4E6389;

      /* ── TYPE ── */
      --serif: 'Fraunces', Georgia, serif;
      --sans:  'Manrope', system-ui, sans-serif;
    }

    html { scroll-behavior: smooth; overflow-x: hidden; }
    body { font-family: var(--sans); background: var(--warm); color: var(--ink); overflow-x: hidden; cursor: none; }
    @media (max-width: 768px) { body { cursor: auto; } }
    ::-webkit-scrollbar { width: 2px; }
    ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }

    /* ── CURSOR ── */
    .cd { position:fixed; width:8px; height:8px; background:var(--gold); border-radius:50%; pointer-events:none; z-index:9999; transform:translate(-50%,-50%); mix-blend-mode:normal; }
    .cr { position:fixed; width:38px; height:38px; border:1.5px solid rgba(37,99,235,.35); border-radius:50%; pointer-events:none; z-index:9998; transform:translate(-50%,-50%); }
    @media(max-width:768px){.cd,.cr{display:none}}

    /* ── NAV ── */
    .nav {
      position:fixed; inset:0 0 auto; z-index:200; height:70px;
      display:flex; align-items:center; justify-content:space-between;
      padding:0 5vw; transition:background .5s, border-color .5s;
      border-bottom: 1px solid transparent;
    }
    .nav.s { background:rgba(13,13,13,.93); backdrop-filter:blur(20px); border-color:var(--border-d); }
    .logo { font-family:var(--serif); font-size:.95rem; font-weight:400; color:var(--white); text-decoration:none; cursor:none; letter-spacing:.02em; }
    .logo em { font-style:italic; color:var(--gold); }
    @media(max-width:768px){.logo{cursor:auto}}
    .nav-links { display:flex; align-items:center; gap:2.5rem; }
    @media(max-width:900px){.nav-links{display:none}}
    .nl { font-size:.68rem; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:rgba(255,255,255,.55); text-decoration:none; cursor:none; transition:color .2s; }
    .nl:hover { color:var(--white); }
    .nav-cta { font-size:.68rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; padding:.58rem 1.6rem; background:var(--gold); color:var(--white); text-decoration:none; cursor:none; transition:background .25s; }
    .nav-cta:hover { background:var(--gold2); color:var(--white); }
    @media(max-width:768px){.nav-cta{cursor:auto}}
    .ham { display:none; background:none; border:none; cursor:pointer; flex-direction:column; gap:5px; padding:4px; }
    @media(max-width:900px){.ham{display:flex}}
    .hl { width:22px; height:1.5px; background:var(--white); border-radius:1px; transition:transform .3s,opacity .3s; }
    .mob { position:fixed; inset:0; background:var(--ink); z-index:195; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2.5rem; }
    .mob a { font-family:var(--serif); font-size:2.8rem; font-weight:300; font-style:italic; color:var(--white); text-decoration:none; transition:color .2s; }
    .mob a:hover { color:var(--gold); }
    .mob-sep { width:40px; height:1px; background:var(--border-d); }

    /* ══════════════════════════════════════════════════════════════
       HERO — Full-bleed portrait, Tony Robbins-style
       Photo fills the ENTIRE viewport. Text lives at bottom-left.
       ══════════════════════════════════════════════════════════════ */
    .hero {
      position:relative; width:100%; height:100vh; overflow:hidden;
      background:var(--ink);
    }
    .hero-photo {
      position:absolute; inset:0; width:100%; height:100%;
      object-fit:cover; object-position:center 15%;
      filter:brightness(.72) contrast(1.10) saturate(0.85);
    }
    /* STYLISH GRADIENT — Navy base + blue shimmer + text legibility */
    .hero-overlay {
      position:absolute; inset:0;
      background:
        /* Strong dark at bottom for text clarity */
        linear-gradient(to top,
          rgba(9,21,42,0.97) 0%,
          rgba(9,21,42,0.80) 28%,
          rgba(9,21,42,0.35) 52%,
          transparent 72%
        ),
        /* Left vignette — text side */
        linear-gradient(to right,
          rgba(9,21,42,0.75) 0%,
          rgba(9,21,42,0.30) 45%,
          transparent 70%
        ),
        /* Top vignette — nav area */
        linear-gradient(to bottom,
          rgba(9,21,42,0.55) 0%,
          transparent 35%
        ),
        /* Blue colour wash — gives image the electric blue tint */
        linear-gradient(135deg,
          rgba(15,30,70,0.45) 0%,
          rgba(37,99,235,0.12) 50%,
          rgba(9,21,42,0.35) 100%
        );
    }
    /* The text content */
    .hero-body {
      position:absolute; bottom:0; left:0; right:0;
      padding:90px 7vw 7vh;
      display:flex; flex-direction:column; align-items:flex-start;
      z-index:2;
    }
    .hero-kicker {
      font-size:.62rem; font-weight:700; letter-spacing:.32em;
      text-transform:uppercase; color:rgba(147,197,253,1);
      display:flex; align-items:center; gap:.8rem; margin-bottom:1.8rem;
    }
    .hero-kicker-line { width:32px; height:1.5px; background:rgba(147,197,253,.7); flex-shrink:0; }
    /* Giant serif name — clips upward */
    .hero-h1 {
      font-family:var(--serif);
      font-size:clamp(3.8rem, 9vw, 11rem);
      font-weight:300; line-height:.88;
      letter-spacing:-.02em; color:var(--white);
      margin-bottom:1.6rem;
    }
    .hero-h1 em { font-style:italic; color:#93C5FD; display:block; }
    @media(max-width:600px){.hero-h1{font-size:clamp(3rem,12vw,5rem)}}
    .hero-sub {
      font-size:clamp(.85rem,1.4vw,.95rem); font-weight:300;
      line-height:1.75; color:rgba(255,255,255,.6);
      max-width:480px; margin-bottom:2.5rem;
    }
    .hero-actions { display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:3vh; }
    /* Button: gold fill */
    .b-gold { font-size:.68rem; font-weight:700; letter-spacing:.15em; text-transform:uppercase; background:var(--gold); color:var(--white); padding:.9rem 2.2rem; text-decoration:none; cursor:none; transition:background .25s; display:inline-block; }
    .b-gold:hover { background:var(--gold2); }
    /* Button: ghost white */
    .b-ghost { font-size:.68rem; font-weight:700; letter-spacing:.15em; text-transform:uppercase; border:1.5px solid rgba(255,255,255,.28); color:var(--white); padding:.9rem 2.2rem; text-decoration:none; cursor:none; transition:border-color .25s,color .25s; display:inline-block; }
    .b-ghost:hover { border-color:var(--white); }
    @media(max-width:768px){.b-gold,.b-ghost{cursor:auto}}
    /* Scroll cue */
    .scroll-cue {
      position:absolute; bottom:2.5rem; right:5vw; z-index:3;
      display:flex; flex-direction:column; align-items:center; gap:.5rem;
    }
    @media(max-width:768px){.scroll-cue{display:none}}
    .sc-text { font-size:.5rem; font-weight:600; letter-spacing:.28em; text-transform:uppercase; color:rgba(255,255,255,.3); writing-mode:vertical-rl; }
    .sc-line { width:1px; height:44px; background:rgba(255,255,255,.2); transform-origin:top; }

    /* ── STATS STRIP ── on dark ink background */
    .stats-strip {
      background:var(--ink); border-top:1px solid var(--border-d);
      display:grid; grid-template-columns:repeat(4,1fr);
    }
    @media(max-width:640px){.stats-strip{grid-template-columns:repeat(2,1fr)}}
    .stat { padding:3.5rem 2rem; text-align:center; border-right:1px solid var(--border-d); }
    .stat:last-child{border-right:none}
    @media(max-width:640px){.stat:nth-child(2){border-right:none}}
    .stat-n { font-family:var(--serif); font-size:4rem; font-weight:300; color:#60A5FA; line-height:1; letter-spacing:-.02em; }
    .stat-l { font-size:.6rem; font-weight:600; letter-spacing:.2em; text-transform:uppercase; color:var(--muted-d); margin-top:.5rem; }

    /* ── SECTION COMMONS ── */
    .stag { font-size:.6rem; font-weight:700; letter-spacing:.28em; text-transform:uppercase; display:flex; align-items:center; gap:.8rem; margin-bottom:1.4rem; }
    .stag.light { color:#93C5FD; }
    .stag.light::before { content:''; width:20px; height:1.5px; background:#93C5FD; flex-shrink:0; }
    .stag.dark  { color:var(--muted-l); }
    .stag.dark::before  { content:''; width:20px; height:1.5px; background:var(--border-l); flex-shrink:0; }
    .sh2 { font-family:var(--serif); font-size:clamp(2.2rem,4.5vw,5rem); font-weight:300; line-height:1; letter-spacing:-.01em; }
    .sh2.light { color:var(--white); }
    .sh2.dark  { color:var(--ink); }
    .sh2 em { font-style:italic; color:var(--gold); }

    /* ── ABOUT ── Dark bg section */
    .about { background:var(--ink); display:grid; grid-template-columns:1fr 1fr; }
    @media(max-width:900px){.about{grid-template-columns:1fr}}
    .about-photo { position:relative; overflow:hidden; min-height:660px; }
    @media(max-width:900px){.about-photo{min-height:75vw;max-height:560px}}
    .about-photo img { width:100%; height:100%; object-fit:cover; object-position:center 10%; filter:brightness(.85) contrast(1.05); transition:transform .8s ease; }
    .about-photo:hover img { transform:scale(1.03); }
    .about-photo-ov { position:absolute; inset:0; background:linear-gradient(to top,rgba(13,13,13,.9) 0%,transparent 50%); }
    .about-q { position:absolute; bottom:0; left:0; right:0; padding:2rem 2.5rem; }
    .about-qt { font-family:var(--serif); font-size:1.15rem; font-style:italic; font-weight:300; color:rgba(255,255,255,.9); line-height:1.5; margin-bottom:.7rem; border-left:2px solid #93C5FD; padding-left:1rem; }
    .about-qb { font-size:.55rem; font-weight:700; letter-spacing:.22em; text-transform:uppercase; color:#93C5FD; padding-left:1rem; }
    .about-body { padding:7rem 6vw; display:flex; flex-direction:column; justify-content:center; border-left:1px solid var(--border-d); }
    @media(max-width:900px){.about-body{border-left:none;border-top:1px solid var(--border-d);padding:5rem 6vw}}
    .about-body p { font-size:.92rem; font-weight:300; line-height:1.9; color:var(--muted-d); margin-bottom:1.2rem; }
    .about-body strong { color:var(--white); font-weight:500; }
    .roles { display:flex; flex-direction:column; gap:0; margin:2.5rem 0; border-top:1px solid var(--border-d); border-bottom:1px solid var(--border-d); }
    .role { display:flex; gap:1rem; align-items:flex-start; padding:1rem 0; border-bottom:1px solid var(--border-d); }
    .role:last-child{border-bottom:none}
    .role-dot { width:5px; height:5px; background:#60A5FA; border-radius:50%; margin-top:6px; flex-shrink:0; }
    .role-t { font-size:.8rem; font-weight:600; color:var(--white); margin-bottom:.15rem; }
    .role-s { font-size:.75rem; font-weight:300; color:var(--muted-d); }

    /* ── MINISTRIES ── Warm bg, full-panel */
    .ministries { background:var(--warm); border-top:1px solid var(--border-l); }
    .min-hd { padding:6rem 7vw; border-bottom:1px solid var(--border-l); }
    .min-panels { display:grid; grid-template-columns:1fr 1fr; }
    @media(max-width:768px){.min-panels{grid-template-columns:1fr}}
    .min-panel {
      position:relative; overflow:hidden; min-height:70vh;
      display:flex; flex-direction:column; justify-content:flex-end;
      padding:5rem 5vw; border-right:1px solid var(--border-l); cursor:none;
    }
    .min-panel:last-child{border-right:none}
    @media(max-width:768px){.min-panel{border-right:none;border-bottom:1px solid var(--border-l);min-height:480px;cursor:auto}}
    .min-photo { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:top; filter:brightness(.18) saturate(0); transition:filter .6s; }
    .min-panel:hover .min-photo { filter:brightness(.28) saturate(0); }
    .min-ov { position:absolute; inset:0; background:linear-gradient(to top, rgba(248,246,241,.97) 30%, rgba(248,246,241,.75) 100%); }
    .min-content { position:relative; z-index:2; }
    .min-tag { font-size:.58rem; font-weight:700; letter-spacing:.28em; text-transform:uppercase; color:var(--gold); margin-bottom:1rem; }
    .min-name { font-family:var(--serif); font-size:clamp(1.8rem,3.5vw,3rem); font-weight:300; line-height:1.0; color:var(--ink); margin-bottom:1.2rem; }
    .min-name em { font-style:italic; color:var(--gold); }
    .min-desc { font-size:.85rem; font-weight:300; line-height:1.85; color:var(--muted-l); margin-bottom:2rem; max-width:420px; }
    .min-facts { display:flex; gap:2rem; margin-bottom:2rem; }
    .mf-n { font-family:var(--serif); font-size:2rem; font-weight:300; color:var(--ink); line-height:1; }
    .mf-l { font-size:.52rem; font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:var(--muted-l); margin-top:.2rem; }
    .min-link { font-size:.62rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:var(--ink); text-decoration:none; cursor:none; display:inline-flex; align-items:center; gap:.5rem; border-bottom:1px solid var(--border-l); padding-bottom:.2rem; transition:border-color .25s,gap .25s,color .25s; }
    .min-link:hover { color:var(--gold); border-color:var(--gold); gap:.9rem; }
    @media(max-width:768px){.min-link{cursor:auto}}

    /* ── VIDEOS ── Dark bg, video-first */
    .videos { background:var(--ink); border-top:1px solid var(--border-d); }
    .vids-top { display:grid; grid-template-columns:1fr 1.4fr; border-bottom:1px solid var(--border-d); }
    @media(max-width:900px){.vids-top{grid-template-columns:1fr}}
    .vids-hd { padding:6rem 6vw; display:flex; flex-direction:column; justify-content:center; }
    .vids-feature { border-left:1px solid var(--border-d); overflow:hidden; }
    @media(max-width:900px){.vids-feature{border-left:none;border-top:1px solid var(--border-d)}}
    .vf { width:100%; aspect-ratio:16/9; border:none; display:block; background:var(--ink2); }
    .vf-info { padding:1.5rem 2rem; border-top:1px solid var(--border-d); }
    .vf-tag { font-size:.55rem; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:var(--gold); display:block; margin-bottom:.4rem; }
    .vf-title { font-family:var(--serif); font-size:1.15rem; font-weight:300; color:var(--white); line-height:1.3; font-style:italic; }
    .vids-grid { display:grid; grid-template-columns:1fr 1fr; }
    @media(max-width:560px){.vids-grid{grid-template-columns:1fr}}
    .vg { border-right:1px solid var(--border-d); border-top:1px solid var(--border-d); overflow:hidden; transition:background .3s; cursor:none; }
    .vg:nth-child(2n){border-right:none}
    .vg:hover{background:var(--ink2)}
    @media(max-width:768px){.vg{cursor:auto}}
    .vg .vf { aspect-ratio:16/9; }
    .vg .vf-info { padding:1.2rem 1.6rem; }
    .vg .vf-title { font-size:1rem; }
    .vg-src { font-size:.68rem; color:rgba(255,255,255,.25); margin-top:.3rem; font-weight:300; }

    /* ── BOOKS ── warm bg */
    .books { background:var(--warm2); border-top:1px solid var(--border-l); }
    .books-hd { padding:6rem 7vw; border-bottom:1px solid var(--border-l); }
    .books-grid { display:grid; grid-template-columns:repeat(3,1fr); background:var(--warm); }
    @media(max-width:900px){.books-grid{grid-template-columns:1fr}}
    .bk { padding:3.5rem 4vw; border-right:1px solid var(--border-l); transition:background .3s; cursor:none; position:relative; overflow:hidden; }
    .bk:last-child{border-right:none}
    .bk:hover{background:var(--warm2)}
    @media(max-width:900px){.bk{border-right:none;border-bottom:1px solid var(--border-l);cursor:auto}}
    .bk::before { content:''; position:absolute; top:0; left:0; width:0; height:2px; background:var(--gold); transition:width .5s; }
    .bk:hover::before { width:100%; }
    .bk-num { font-family:var(--serif); font-size:5rem; font-weight:300; color:var(--border-l); line-height:1; margin-bottom:1.5rem; transition:color .3s; }
    .bk:hover .bk-num { color:rgba(201,145,58,.15); }
    .bk-tag { font-size:.55rem; font-weight:700; letter-spacing:.22em; text-transform:uppercase; color:var(--gold); margin-bottom:.7rem; }
    .bk-title { font-family:var(--serif); font-size:1.5rem; font-weight:300; color:var(--ink); line-height:1.15; margin-bottom:1rem; font-style:italic; }
    .bk-p { font-size:.82rem; font-weight:300; line-height:1.75; color:var(--muted-l); margin-bottom:1.6rem; }
    .bk-cta { font-size:.6rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:var(--ink); text-decoration:none; cursor:none; display:inline-flex; align-items:center; gap:.5rem; border-bottom:1px solid var(--border-l); padding-bottom:.15rem; transition:gap .25s,border-color .25s,color .25s; }
    .bk-cta:hover{color:var(--gold);border-color:var(--gold);gap:.9rem}
    @media(max-width:768px){.bk-cta{cursor:auto}}

    /* ── SPEAKING ── dark bg */
    .speaking { background:var(--ink); border-top:1px solid var(--border-d); display:grid; grid-template-columns:360px 1fr; }
    @media(max-width:960px){.speaking{grid-template-columns:1fr}}
    .sp-left { padding:6rem 5vw; border-right:1px solid var(--border-d); position:sticky; top:0; align-self:start; height:fit-content; }
    @media(max-width:960px){.sp-left{position:static;border-right:none;border-bottom:1px solid var(--border-d);padding:5rem 6vw}}
    .sp-pull { margin-top:2.5rem; border-left:2px solid #60A5FA; padding-left:1.4rem; }
    .sp-qt { font-family:var(--serif); font-size:1.1rem; font-style:italic; font-weight:300; color:rgba(255,255,255,.75); line-height:1.6; margin-bottom:.8rem; }
    .sp-qby { font-size:.55rem; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:#93C5FD; }
    .ev-list { display:flex; flex-direction:column; }
    .ev { display:grid; grid-template-columns:72px 1fr; gap:1.5rem; padding:1.8rem 5vw; border-bottom:1px solid var(--border-d); transition:background .3s; }
    .ev:hover{background:var(--ink2)}
    .ev-d { font-family:var(--serif); font-size:2.6rem; font-weight:300; color:var(--gold); line-height:1; }
    .ev-m { font-size:.52rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.25); }
    .ev-name { font-family:var(--serif); font-size:1.1rem; font-style:italic; font-weight:300; color:var(--white); margin-bottom:.35rem; line-height:1.25; }
    .ev-meta { font-size:.7rem; color:rgba(255,255,255,.3); display:flex; gap:.6rem; flex-wrap:wrap; }
    .ev-type { color:#60A5FA; font-weight:600; }

    /* ── CONTACT ── warm bg split */
    .contact { background:var(--warm); border-top:1px solid var(--border-l); display:grid; grid-template-columns:1fr 1fr; }
    @media(max-width:900px){.contact{grid-template-columns:1fr}}
    .ct-img { position:relative; overflow:hidden; min-height:640px; }
    @media(max-width:900px){.ct-img{min-height:65vw;max-height:520px}}
    .ct-img img { width:100%; height:100%; object-fit:cover; object-position:center 10%; filter:brightness(.78) contrast(1.05); transition:transform .8s; }
    .ct-img:hover img{transform:scale(1.03)}
    .ct-img-ov { position:absolute; inset:0; background:linear-gradient(to top,rgba(13,13,13,.8) 0%,transparent 55%); }
    .ct-img-label { position:absolute; bottom:2.5rem; left:2.5rem; right:2.5rem; }
    .ct-img-t { font-family:var(--serif); font-size:2rem; font-style:italic; font-weight:300; color:var(--white); margin-bottom:.2rem; }
    .ct-img-s { font-size:.55rem; font-weight:700; letter-spacing:.22em; text-transform:uppercase; color:rgba(255,255,255,.45); }
    .ct-form { padding:6rem 5vw; border-left:1px solid var(--border-l); }
    @media(max-width:900px){.ct-form{border-left:none;border-top:1px solid var(--border-l);padding:5rem 6vw}}
    .ct-deets { margin:2rem 0 2.5rem; padding:1.5rem 0; border-top:1px solid var(--border-l); border-bottom:1px solid var(--border-l); display:flex; flex-direction:column; gap:.9rem; }
    .ctd { display:flex; gap:.9rem; align-items:flex-start; }
    .ctd-gold-line { width:2px; height:16px; background:var(--gold); margin-top:4px; flex-shrink:0; }
    .ctd-lbl { font-size:.55rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:var(--muted-l); margin-bottom:.15rem; }
    .ctd-val { font-size:.8rem; font-weight:300; color:var(--ink); }
    .cform { display:flex; flex-direction:column; gap:.9rem; }
    .crow { display:grid; grid-template-columns:1fr 1fr; gap:.9rem; }
    @media(max-width:480px){.crow{grid-template-columns:1fr}}
    .cfg { display:flex; flex-direction:column; gap:.32rem; }
    .cfl { font-size:.55rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:var(--muted-l); }
    .cfi,.cfs,.cfta { background:var(--warm2); border:1px solid var(--border-l); padding:.82rem .9rem; font-family:var(--sans); font-size:.85rem; font-weight:300; color:var(--ink); outline:none; width:100%; transition:border-color .25s; border-radius:0; -webkit-appearance:none; }
    .cfi::placeholder,.cfta::placeholder{color:var(--muted-l);opacity:.6}
    .cfi:focus,.cfs:focus,.cfta:focus{border-color:var(--gold);background:var(--warm)}
    .cfs option{background:var(--warm)}
    .cfta{min-height:100px;resize:vertical}
    .cfbtn { font-size:.68rem; font-weight:700; letter-spacing:.15em; text-transform:uppercase; background:var(--gold); color:var(--white); padding:1rem 2rem; border:none; cursor:none; font-family:var(--sans); transition:background .25s; width:100%; }
    .cfbtn:hover{background:var(--gold2)}
    @media(max-width:768px){.cfbtn{cursor:auto}}
    .sent { padding:3rem 2rem; text-align:center; border:1px solid var(--border-l); background:var(--warm2); }
    .sent-i { font-family:var(--serif); font-size:2.5rem; font-style:italic; color:var(--gold); }
    .sent-t { font-family:var(--serif); font-size:1.8rem; font-weight:300; font-style:italic; color:var(--ink); margin-bottom:.4rem; }
    .sent-s { font-size:.8rem; font-weight:300; color:var(--muted-l); }

    /* ── FOOTER ── ink black */
    .footer { border-top:2px solid var(--gold); background:var(--ink); }
    .ft-top { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; border-bottom:1px solid var(--border-d); }
    @media(max-width:900px){.ft-top{grid-template-columns:1fr 1fr}}
    @media(max-width:480px){.ft-top{grid-template-columns:1fr}}
    .ft-col { padding:4rem 4vw; border-right:1px solid var(--border-d); }
    .ft-col:last-child{border-right:none}
    @media(max-width:900px){.ft-col:nth-child(2){border-right:none}.ft-col:nth-child(3){border-top:1px solid var(--border-d)}.ft-col:nth-child(4){border-right:none;border-top:1px solid var(--border-d)}}
    @media(max-width:480px){.ft-col{border-right:none!important;border-bottom:1px solid var(--border-d)}.ft-col:last-child{border-bottom:none}}
    .ft-logo { font-family:var(--serif); font-size:1.2rem; font-style:italic; font-weight:300; color:var(--white); margin-bottom:.8rem; }
    .ft-logo span{color:#93C5FD}
    .ft-tagline { font-size:.75rem; font-weight:300; line-height:1.75; color:rgba(255,255,255,.3); margin-bottom:1.5rem; max-width:240px; }
    .ft-gold { width:32px; height:1.5px; background:#60A5FA; }
    .ft-ch { font-size:.55rem; font-weight:700; letter-spacing:.28em; text-transform:uppercase; color:rgba(255,255,255,.25); margin-bottom:1.2rem; }
    .ftl { display:block; font-size:.78rem; font-weight:300; color:rgba(255,255,255,.32); text-decoration:none; margin-bottom:.55rem; transition:color .2s; cursor:none; }
    .ftl:hover{color:var(--white)}
    @media(max-width:768px){.ftl{cursor:auto}}
    .ft-bottom { padding:1.5rem 4vw; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; }
    .ft-copy { font-size:.62rem; font-weight:300; color:rgba(255,255,255,.18); letter-spacing:.05em; }

    /* ── MARQUEE ── gold bg strip */
    .mq-wrap { background:var(--gold); overflow:hidden; padding:.75rem 0; }
    .mq-track { display:flex; white-space:nowrap; animation:mq 32s linear infinite; }
    @keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
    .mqi { font-size:.6rem; font-weight:700; letter-spacing:.22em; text-transform:uppercase; color:var(--ink); padding:0 2.5rem; display:inline-flex; align-items:center; gap:2.5rem; opacity:.8; }
    .mqi-dot { width:3px; height:3px; background:var(--ink); border-radius:50%; opacity:.4; flex-shrink:0; }
  `}</style>
);

/* ─── CURSOR ─────────────────────────────────────────────────────────────── */
function Cursor() {
  const mx = useMotionValue(-100), my = useMotionValue(-100);
  const rx = useSpring(mx, { stiffness: 220, damping: 24 });
  const ry = useSpring(my, { stiffness: 220, damping: 24 });
  useEffect(() => {
    const fn = e => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return (<>
    <motion.div className="cd" style={{ left: mx, top: my }} />
    <motion.div className="cr" style={{ left: rx, top: ry }} />
  </>);
}

/* ─── REVEAL ─────────────────────────────────────────────────────────────── */
function R({ children, delay = 0, y = 28, x = 0, className = "" }) {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y, x }}
      animate={v ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: .85, delay, ease: [.22, 1, .36, 1] }}
    >{children}</motion.div>
  );
}

/* ─── CLIP-UP TEXT ───────────────────────────────────────────────────────── */
// Each line wipes upward — the signature cinematic move
function ClipLine({ text, delay = 0, italic = false, className = "" }) {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-30px" });
  return (
    <div ref={ref} style={{ overflow: "hidden", display: "block" }}>
      <motion.span
        style={{ display: "block" }}
        initial={{ y: "110%" }}
        animate={v ? { y: "0%" } : {}}
        transition={{ duration: .9, delay, ease: [.22, 1, .36, 1] }}
        className={className}
      >
        {italic ? <em>{text}</em> : text}
      </motion.span>
    </div>
  );
}

/* ─── COUNT UP ───────────────────────────────────────────────────────────── */
function CountUp({ to, suffix = "" }) {
  const ref = useRef(null);
  const [val, setVal] = useState("0");
  const v = useInView(ref, { once: true });
  useEffect(() => {
    if (!v) return;
    const n = parseInt(to);
    if (isNaN(n)) { setVal(to); return; }
    const c = animate(0, n, { duration: 1.8, ease: "easeOut", onUpdate: v => setVal(Math.round(v).toString()) });
    return () => c.stop();
  }, [v, to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── NAV ────────────────────────────────────────────────────────────────── */
function Nav() {
  const [s, setS] = useState(false), [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setS(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["About", "Ministries", "Videos", "Books", "Speaking", "Contact"];
  return (<>
    <motion.header className={`nav${s ? " s" : ""}`}
      initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: .8, ease: [.22, 1, .36, 1] }}>
      <a className="logo" href="#home">Dr. Kunle <em>Hamilton</em></a>
      <nav className="nav-links">
        {links.map(l => <a key={l} className="nl" href={`#${l.toLowerCase()}`}>{l}</a>)}
        <a className="nav-cta" href="#contact">Book Session</a>
      </nav>
      <button className="ham" onClick={() => setOpen(!open)} aria-label="Menu">
        <div className="hl" style={open ? { transform: "rotate(45deg) translate(5px,5px)" } : {}} />
        <div className="hl" style={open ? { opacity: 0 } : {}} />
        <div className="hl" style={open ? { transform: "rotate(-45deg) translate(5px,-5px)" } : {}} />
      </button>
    </motion.header>
    <AnimatePresence>
      {open && (
        <motion.div className="mob"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          exit={{ opacity: 0 }} transition={{ duration: .25 }}>
          {links.map((l, i) => (
            <motion.a key={l} href={`#${l.toLowerCase()}`}
              onClick={() => setOpen(false)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * .07 }}>
              {l}
            </motion.a>
          ))}
          <div className="mob-sep" />
          <a className="nav-cta" href="#contact" onClick={() => setOpen(false)}>Book a Session</a>
        </motion.div>
      )}
    </AnimatePresence>
  </>);
}

/* ─── HERO ── Full-bleed Tony Robbins style ─────────────────────────────── */
function Hero() {
  const { scrollY } = useScroll();
  // Subtle parallax on the photo
  const photoY = useTransform(scrollY, [0, 700], [0, 90]);
  return (
    <section className="hero" id="home">
      {/* Full-bleed photo */}
      <motion.img
        src={P1}
        alt="Dr. Kunle Hamilton"
        className="hero-photo"
        style={{ y: photoY }}
        initial={{ scale: 1.07, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [.22, 1, .36, 1] }}
      />
      <div className="hero-overlay" />

      {/* Text at bottom-left — Furtick/Robbins style */}
      <div className="hero-body">
        {/* Kicker */}
        <motion.div className="hero-kicker"
          initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: .7, duration: .7 }}>
          <span className="hero-kicker-line" />
          Prophet · Scholar · Shepherd · Author
        </motion.div>

        {/* Massive stacked name — each line clips up */}
        <h1 className="hero-h1" aria-label="Dr. Kunle Hamilton">
          <div style={{ overflow: "hidden" }}>
            <motion.span style={{ display: "block" }}
              initial={{ y: "105%" }} animate={{ y: "0%" }}
              transition={{ delay: .85, duration: 1, ease: [.22, 1, .36, 1] }}>
              Dr.
            </motion.span>
          </div>
          <div style={{ overflow: "hidden" }}>
            <motion.span style={{ display: "block" }}
              initial={{ y: "105%" }} animate={{ y: "0%" }}
              transition={{ delay: .98, duration: 1, ease: [.22, 1, .36, 1] }}>
              Kunle
            </motion.span>
          </div>
          <div style={{ overflow: "hidden" }}>
            <motion.em style={{ display: "block" }}
              initial={{ y: "105%" }} animate={{ y: "0%" }}
              transition={{ delay: 1.1, duration: 1, ease: [.22, 1, .36, 1] }}>
              Hamilton
            </motion.em>
          </div>
        </h1>

        <motion.p className="hero-sub"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, duration: .8 }}>
          Veteran journalist. International author. Prophet of the Celestial Church of Christ. Founder of CCC PraiseVille & ShaddaiVille Ministries — a life poured out for God across five nations.
        </motion.p>

        <motion.div className="hero-actions"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: .7 }}>
          <a className="b-gold" href="#about">Discover His Story</a>
          <a className="b-ghost" href="#videos">Watch Teachings</a>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <div className="scroll-cue">
        <span className="sc-text">Scroll</span>
        <motion.div className="sc-line"
          animate={{ scaleY: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
      </div>
    </section>
  );
}

/* ─── MARQUEE ────────────────────────────────────────────────────────────── */
const MQI = ["Prophet", "Scholar", "Media Veteran", "Bestselling Author", "Senior Shepherd", "PraiseVille Global", "ShaddaiVille International", "5 Nations", "40 Years of Ministry", "Berlin · Lagos · London · USA"];
function Marquee() {
  const all = [...MQI, ...MQI];
  return (
    <div className="mq-wrap">
      <div className="mq-track">
        {all.map((t, i) => <span key={i} className="mqi">{t}<span className="mqi-dot" /></span>)}
      </div>
    </div>
  );
}

/* ─── STATS ──────────────────────────────────────────────────────────────── */
function Stats() {
  return (
    <div className="stats-strip">
      {[{ n: "40", s: "+", l: "Years in Ministry" }, { n: "5", s: "", l: "Nations of Impact" }, { n: "2", s: "", l: "Thriving Ministries" }, { n: "18", s: "", l: "Countries Published" }].map((s, i) => (
        <motion.div key={i} className="stat"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: i * .1, duration: .7 }}>
          <div className="stat-n"><CountUp to={s.n} suffix={s.s} /></div>
          <div className="stat-l">{s.l}</div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── ABOUT ──────────────────────────────────────────────────────────────── */
function About() {
  return (
    <section className="about" id="about">
      <R x={-20} y={0}>
        <div className="about-photo">
          <img src={P2} alt="Dr. Kunle Hamilton teaching" />
          <div className="about-photo-ov" />
          <div className="about-q">
            <div className="about-qt">"If God had not arrested me with the drama of the Celestial Church, He would have lost me to atheism."</div>
            <div className="about-qb">— Dr. Kunle Hamilton</div>
          </div>
        </div>
      </R>
      <div className="about-body">
        <R><div className="stag light">The Man Behind the Ministry</div></R>
        <div>
          <ClipLine text="A Philosopher" className="sh2 light" delay={.1} />
          <ClipLine text="Who Found" className="sh2 light" delay={.2} />
          <ClipLine text="God." className="sh2 light" delay={.3} italic />
        </div>
        <R delay={.2}>
          <div style={{ height: 1, background: "var(--border-d)", margin: "2rem 0" }} />
          <p>Dr. Kunle Hamilton is one of Nigeria's most remarkable multi-disciplinary voices — <strong>a Prophet of the Celestial Church of Christ</strong>, veteran journalist, media executive, and international author whose reach spans four continents.</p>
          <p>A <strong>Philosophy first-class graduate</strong> (Best Student, 1985) and Mass Communication scholar from the University of Lagos, he fuses rigorous academic thought with prophetic grace.</p>
        </R>
        <R delay={.3}>
          <div className="roles">
            {[
              ["Senior Shepherd", "CCC PraiseVille Global — Nigeria · Germany · UK · USA"],
              ["Founder & President", "ShaddaiVille Ministries International — since 2007"],
              ["CEO", "Virgin Outdoor — Reputation & Brand Management, Lagos"],
              ["International Author", "Published in 18 countries by Lambert Academic Publishing"],
            ].map(([t, v], i) => (
              <div className="role" key={i}>
                <div className="role-dot" />
                <div><div className="role-t">{t}</div><div className="role-s">{v}</div></div>
              </div>
            ))}
          </div>
        </R>
        <R delay={.4}><a className="b-gold" href="#contact" style={{ display: "inline-block" }}>Connect with Dr. Hamilton</a></R>
      </div>
    </section>
  );
}

/* ─── MINISTRIES ─────────────────────────────────────────────────────────── */
function Ministries() {
  const panels = [
    { img: P2, tag: "Celestial Church of Christ", name: "CCC PraiseVille", nameEm: "Global", desc: "Founded in Berlin on May 8 2016, now flourishing across Nigeria, UK, USA and Germany. Authentic worship, genuine prophecy, deep fellowship — the Celestial Church alive in the modern world.", facts: [{ n: "4+", l: "Countries" }, { n: "2016", l: "Founded" }, { n: "7+", l: "Annual Harvest" }] },
    { img: P1, tag: "Non-Denominational · Global Training", name: "ShaddaiVille", nameEm: "Ministries Int'l", desc: "\"God's City\" — UK-certified leadership & entrepreneurship since 2007. Free of charge. Christians and Muslims trained together as moral beacons across five nations.", facts: [{ n: "5", l: "Nations" }, { n: "2007", l: "Founded" }, { n: "UK", l: "Certified" }] }
  ];
  return (
    <section className="ministries" id="ministries">
      <div className="min-hd">
        <R><div className="stag dark">Twin Pillars of Purpose</div></R>
        <ClipLine text="The Ministries" className="sh2 dark" delay={.1} />
      </div>
      <div className="min-panels">
        {panels.map((m, i) => (
          <R key={i} x={i === 0 ? -20 : 20} y={0} delay={i * .1}>
            <div className="min-panel">
              <img src={m.img} className="min-photo" alt={m.name} />
              <div className="min-ov" />
              <div className="min-content">
                <div className="min-tag">{m.tag}</div>
                <div className="min-name">{m.name}<br /><em>{m.nameEm}</em></div>
                <p className="min-desc">{m.desc}</p>
                <div className="min-facts">
                  {m.facts.map((f, j) => <div key={j}><div className="mf-n">{f.n}</div><div className="mf-l">{f.l}</div></div>)}
                </div>
                <a className="min-link" href="#contact">Learn More →</a>
              </div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ─── VIDEOS ─────────────────────────────────────────────────────────────── */
function Videos() {
  const vids = [
    { url: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fcelestial.focus%2Fvideos%2F1356642479037237&show_text=false", tag: "Discipleship · Teaching", title: "Dr. Kunle Hamilton Teaches Discipleship", src: "CelestialFocus · Facebook" },
    { url: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fhephzibahtelevision%2Fvideos%2F449065333576250&show_text=false", tag: "Leadership · Interview", title: "Meeting with Dr. Hamilton — The Roles of Leadership", src: "Hephzibah Television" },
    { url: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fcelestial.focus%2Fvideos%2F1241668604555889&show_text=false", tag: "Worship · Celebration", title: "Christmas — CCC PraiseVille Highlight", src: "CelestialFocus" },
  ];
  return (
    <section className="videos" id="videos">
      <div className="vids-top">
        <div className="vids-hd">
          <R><div className="stag light">Teachings · Sermons · Interviews</div></R>
          <ClipLine text="Watch" className="sh2 light" delay={.1} />
          <ClipLine text="Dr. Hamilton" className="sh2 light" delay={.18} />
          <ClipLine text="In Action" className="sh2 light" delay={.26} italic />
          <R delay={.35}><div style={{ marginTop: "2rem" }}><a className="b-gold" href="#contact">Attend a Service</a></div></R>
        </div>
        <R y={0} x={24}>
          <div className="vids-feature">
            <iframe className="vf" src={vids[0].url} scrolling="no" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" title={vids[0].title} />
            <div className="vf-info">
              <span className="vf-tag">{vids[0].tag}</span>
              <div className="vf-title">{vids[0].title}</div>
            </div>
          </div>
        </R>
      </div>
      <div className="vids-grid">
        {vids.slice(1).map((v, i) => (
          <R key={i} delay={i * .1}>
            <div className="vg">
              <iframe className="vf" src={v.url} scrolling="no" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" title={v.title} />
              <div className="vf-info">
                <span className="vf-tag">{v.tag}</span>
                <div className="vf-title">{v.title}</div>
                <div className="vg-src">{v.src}</div>
              </div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ─── BOOKS ──────────────────────────────────────────────────────────────── */
function Books() {
  return (
    <section className="books" id="books">
      <div className="books-hd">
        <R><div className="stag dark">Written Works</div></R>
        <ClipLine text="Books &" className="sh2 dark" delay={.1} />
        <ClipLine text="Publications" className="sh2 dark" delay={.18} italic />
      </div>
      <div className="books-grid">
        {[
          { tag: "Leadership", title: "Releasing the Eagle in You", p: "An eight-chapter inspirational work on leadership and self-actualization — unlocking the greatness God placed within every person. Published internationally across 18 countries." },
          { tag: "Philosophy", title: "Journey to Understanding", p: "A philosophical investigation of how style and content impact the spoken word, using the church and Raypower 100.5 FM as its remarkable canvas." },
          { tag: "Ministry", title: "The ShaddaiVille Vision", p: "Dr. Hamilton's framework for discipleship-driven ministry that transcends denominational walls — building leaders and moral beacons across faith traditions and nations." },
        ].map((b, i) => (
          <R key={i} delay={i * .12}>
            <div className="bk">
              <div className="bk-num">0{i + 1}</div>
              <div className="bk-tag">{b.tag}</div>
              <div className="bk-title">{b.title}</div>
              <div className="bk-p">{b.p}</div>
              <a className="bk-cta" href="#contact">Order a Copy →</a>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ─── SPEAKING ───────────────────────────────────────────────────────────── */
function Speaking() {
  const evs = [
    { d: "12", m: "Apr", name: "Festival of the Word — Annual Harvest", loc: "Lagos, Nigeria", type: "Worship & Teaching" },
    { d: "03", m: "May", name: "ShaddaiVille UK Leadership Retreat", loc: "London, United Kingdom", type: "Leadership Academy" },
    { d: "21", m: "Jun", name: "Teenagers' Motivational Summit", loc: "Berlin, Germany", type: "Youth Empowerment" },
    { d: "08", m: "Aug", name: "Ephphatha Non-Denominational Crusade", loc: "Lagos, Nigeria", type: "Evangelism" },
    { d: "15", m: "Sep", name: "Media & Ministry — Public Lecture", loc: "University of Lagos", type: "Academic Talk" },
  ];
  return (
    <section className="speaking" id="speaking">
      <div className="sp-left">
        <R><div className="stag light">Events & Engagements</div></R>
        <ClipLine text="Speaking &" className="sh2 light" delay={.1} />
        <ClipLine text="Appearances" className="sh2 light" delay={.18} italic />
        <R delay={.25}>
          <div className="sp-pull">
            <div className="sp-qt">"The responsibility of religious leaders is to guide young people towards righteousness — not to encourage them to chase fame through questionable means."</div>
            <div className="sp-qby">— Dr. Kunle Hamilton</div>
          </div>
        </R>
        <R delay={.35}><div style={{ marginTop: "2rem" }}><a className="b-gold" href="#contact">Invite Dr. Hamilton</a></div></R>
      </div>
      <div className="ev-list">
        {evs.map((e, i) => (
          <R key={i} delay={i * .08} x={20} y={0}>
            <div className="ev">
              <div>
                <div className="ev-d">{e.d}</div>
                <div className="ev-m">{e.m}</div>
              </div>
              <div>
                <div className="ev-name">{e.name}</div>
                <div className="ev-meta"><span>📍 {e.loc}</span><span className="ev-type"> · {e.type}</span></div>
              </div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ─── CONTACT ────────────────────────────────────────────────────────────── */
function Contact() {
  const [f, setF] = useState({ name: "", email: "", inquiry: "speaking", msg: "" });
  const [sent, setSent] = useState(false);
  return (
    <section className="contact" id="contact">
      <R x={-20} y={0}>
        <div className="ct-img">
          <img src={P2} alt="Dr. Kunle Hamilton" />
          <div className="ct-img-ov" />
          <div className="ct-img-label">
            <div className="ct-img-t">Let's Connect</div>
            <div className="ct-img-s">Reach Dr. Hamilton's Team</div>
          </div>
        </div>
      </R>
      <R delay={.15}>
        <div className="ct-form">
          <div className="stag dark">Get in Touch</div>
          <ClipLine text="Send a" className="sh2 dark" delay={.1} />
          <ClipLine text="Message" className="sh2 dark" delay={.18} italic />
          <div className="ct-deets">
            {[
              ["Ministry", "CCC PraiseVille Global · ShaddaiVille International"],
              ["Based In", "Lagos, Nigeria · Berlin · London · USA"],
              ["Media & PR", "Virgin Outdoor Communications, Lagos"],
            ].map(([l, v], i) => (
              <div className="ctd" key={i}>
                <div className="ctd-gold-line" />
                <div><div className="ctd-lbl">{l}</div><div className="ctd-val">{v}</div></div>
              </div>
            ))}
          </div>
          {sent ? (
            <motion.div className="sent" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="sent-i">✓</div>
              <div className="sent-t">Message Received</div>
              <div className="sent-s">Dr. Hamilton's team will be in touch shortly.</div>
            </motion.div>
          ) : (
            <form className="cform" onSubmit={e => { e.preventDefault(); setSent(true); }}>
              <div className="crow">
                <div className="cfg"><label className="cfl">Full Name</label><input className="cfi" placeholder="Your name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} required /></div>
                <div className="cfg"><label className="cfl">Email</label><input className="cfi" type="email" placeholder="your@email.com" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} required /></div>
              </div>
              <div className="cfg"><label className="cfl">Nature of Inquiry</label>
                <select className="cfs" value={f.inquiry} onChange={e => setF({ ...f, inquiry: e.target.value })}>
                  <option value="speaking">Speaking Engagement</option>
                  <option value="ministry">Ministry / Church</option>
                  <option value="books">Books & Publications</option>
                  <option value="media">Media / Interview</option>
                  <option value="leadership">ShaddaiVille Leadership Academy</option>
                  <option value="general">General Enquiry</option>
                </select>
              </div>
              <div className="cfg"><label className="cfl">Message</label><textarea className="cfta" placeholder="Your message..." value={f.msg} onChange={e => setF({ ...f, msg: e.target.value })} required /></div>
              <button className="cfbtn">Send Message →</button>
            </form>
          )}
        </div>
      </R>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="footer">
      <div className="ft-top">
        <div className="ft-col">
          <div className="ft-logo">Dr. Kunle <span>Hamilton</span></div>
          <div className="ft-tagline">Prophet · Scholar · Shepherd · Author · Media Veteran. Serving God and humanity across five nations since 1985.</div>
          <div className="ft-gold" />
        </div>
        <div className="ft-col">
          <div className="ft-ch">Main Site</div>
          {["About", "Videos", "Books", "Speaking", "Contact"].map(l => <a key={l} className="ftl" href={`#${l.toLowerCase()}`}>{l}</a>)}
        </div>
        <div className="ft-col">
          <div className="ft-ch">CCC PraiseVille</div>
          {["About PraiseVille", "Sunday Services", "Festival of the Word", "Pastoral Team", "Join Us"].map(l => <a key={l} className="ftl" href="#ministries">{l}</a>)}
        </div>
        <div className="ft-col">
          <div className="ft-ch">ShaddaiVille</div>
          {["About ShaddaiVille", "Leadership Academy", "Teens Academy", "Outreach", "Partner With Us"].map(l => <a key={l} className="ftl" href="#ministries">{l}</a>)}
        </div>
      </div>
      <div className="ft-bottom">
        <div className="ft-copy">© 2025 Dr. Kunle Hamilton · All Rights Reserved</div>
        <div className="ft-copy">PraiseVille Global · ShaddaiVille Ministries International</div>
      </div>
    </footer>
  );
}

/* ─── APP ────────────────────────────────────────────────────────────────── */
export default function App() {
  return (<>
    <Styles />
    <Cursor />
    <Nav />
    <Hero />
    <Marquee />
    <Stats />
    <About />
    <Ministries />
    <Videos />
    <Books />
    <Speaking />
    <Contact />
    <Footer />
  </>);
}
