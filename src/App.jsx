import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

// ── REAL PHOTO IMPORTS ────────────────────────────────────────────────────────
const IMG_FORMAL   = "/dkh-formal.jpg";
const IMG_PREACHING = "/dkh-preaching.jpg";
const IMG_SPEAKING  = "/dkh-speaking.jpg";

// ── FACEBOOK VIDEO IDs (extracted from search results) ────────────────────────
const VIDEOS = [
  { fbId: "1356642479037237", page: "celestial.focus",     title: "Dr. Kunle Hamilton Teaches Discipleship",      tag: "Discipleship" },
  { fbId: "449065333576250",  page: "hephzibahtelevision", title: "Meeting with Dr. Kunle Hamilton — The Roles of Leadership", tag: "Leadership" },
  { fbId: "1241668604555889", page: "celestial.focus",     title: "Christmas — CCC PraiseVille Highlight",       tag: "Worship" },
];

// ── STYLES ────────────────────────────────────────────────────────────────────
const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=Outfit:wght@200;300;400;500;600&display=swap');

    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

    :root {
      --c-bg:       #FDFCF8;
      --c-surface:  #F7F3EB;
      --c-border:   #E8DFC8;
      --c-gold:     #C49A2A;
      --c-gold2:    #E2B84A;
      --c-gold-dim: #9A7820;
      --c-ink:      #100E0A;
      --c-dark:     #1A1510;
      --c-muted:    #6B6255;
      --c-white:    #FFFFFF;
      --c-navy:     #14213D;
      --c-navy2:    #1C2D52;
      --r: 0px;
    }

    html { scroll-behavior:smooth; overflow-x:hidden; }
    body {
      font-family:'Outfit',sans-serif;
      background:var(--c-bg);
      color:var(--c-ink);
      overflow-x:hidden;
      cursor:none;
    }
    ::-webkit-scrollbar { width:2px; }
    ::-webkit-scrollbar-track { background:var(--c-surface); }
    ::-webkit-scrollbar-thumb { background:var(--c-gold); }

    /* ── CURSOR ── */
    .cur-dot {
      position:fixed; width:6px; height:6px; border-radius:50%;
      background:var(--c-gold); pointer-events:none; z-index:9999;
      transform:translate(-50%,-50%);
    }
    .cur-circle {
      position:fixed; width:40px; height:40px; border-radius:50%;
      border:1px solid rgba(196,154,42,0.5); pointer-events:none; z-index:9998;
      transform:translate(-50%,-50%); transition:width .2s,height .2s,opacity .2s;
    }
    body:hover .cur-circle { opacity:1; }

    /* ── NAV ── */
    .nav {
      position:fixed; inset:0 0 auto; z-index:200;
      padding:0 5vw;
      height:72px; display:flex; align-items:center; justify-content:space-between;
      transition:background .5s,box-shadow .5s;
    }
    .nav.bg {
      background:rgba(253,252,248,0.95);
      backdrop-filter:blur(24px);
      box-shadow:0 1px 0 var(--c-border);
    }
    .logo {
      font-family:'Playfair Display',serif;
      font-size:1.05rem; font-weight:700; letter-spacing:0.04em;
      color:var(--c-ink); text-decoration:none; cursor:none;
    }
    .logo em { font-style:italic; color:var(--c-gold); }
    .nav-links { display:flex; gap:2rem; align-items:center; }
    .nl {
      font-size:.68rem; font-weight:500; letter-spacing:.16em;
      text-transform:uppercase; color:var(--c-muted);
      text-decoration:none; cursor:none; transition:color .25s;
      position:relative;
    }
    .nl::after {
      content:''; position:absolute; bottom:-4px; left:0;
      width:0; height:1px; background:var(--c-gold);
      transition:width .3s;
    }
    .nl:hover { color:var(--c-ink); }
    .nl:hover::after { width:100%; }
    .nav-btn {
      font-size:.65rem; font-weight:600; letter-spacing:.16em;
      text-transform:uppercase; color:var(--c-dark);
      background:var(--c-gold); padding:.6rem 1.4rem;
      border:none; cursor:none; text-decoration:none;
      transition:background .3s, transform .2s;
      display:inline-block;
    }
    .nav-btn:hover { background:var(--c-ink); color:#fff; }

    /* ── HERO ── */
    .hero {
      min-height:100vh; display:grid;
      grid-template-columns:55% 45%;
      background:var(--c-bg); position:relative; overflow:hidden;
    }
    .hero-left {
      display:flex; flex-direction:column; justify-content:center;
      padding:9rem 5vw 6rem 6vw; position:relative; z-index:2;
    }
    .hero-tag {
      display:inline-flex; align-items:center; gap:.75rem;
      font-size:.6rem; font-weight:600; letter-spacing:.3em;
      text-transform:uppercase; color:var(--c-gold);
      margin-bottom:2.5rem;
    }
    .hero-tag-line { width:32px; height:1px; background:var(--c-gold); }
    .hero-h1 {
      font-family:'Playfair Display',serif;
      font-size:clamp(3.5rem,6.5vw,7rem);
      font-weight:900; line-height:.92;
      letter-spacing:-.03em; color:var(--c-ink);
    }
    .hero-h1 .gold { color:var(--c-gold); font-style:italic; }
    .hero-h1 .light { font-weight:400; font-style:italic; display:block; }
    .hero-rule {
      width:60px; height:2px; background:var(--c-gold);
      margin:2.5rem 0; transform-origin:left;
    }
    .hero-p {
      font-size:1rem; font-weight:300; line-height:1.8;
      color:var(--c-muted); max-width:460px; margin-bottom:3rem;
    }
    .hero-actions { display:flex; gap:1rem; align-items:center; flex-wrap:wrap; }
    .btn-solid {
      font-size:.65rem; font-weight:600; letter-spacing:.18em;
      text-transform:uppercase; background:var(--c-ink); color:#fff;
      padding:.9rem 2.2rem; text-decoration:none; cursor:none;
      transition:background .3s; display:inline-block;
    }
    .btn-solid:hover { background:var(--c-gold); color:var(--c-ink); }
    .btn-line {
      font-size:.65rem; font-weight:500; letter-spacing:.18em;
      text-transform:uppercase; color:var(--c-ink);
      text-decoration:none; cursor:none;
      border-bottom:1px solid var(--c-gold);
      padding-bottom:2px; transition:color .3s;
    }
    .btn-line:hover { color:var(--c-gold); }

    /* Hero image panel */
    .hero-right {
      position:relative; overflow:hidden;
      background:var(--c-surface);
    }
    .hero-img {
      position:absolute; inset:0; width:100%; height:100%;
      object-fit:cover; object-position:top center;
      filter:grayscale(15%) contrast(1.05);
    }
    .hero-img-overlay {
      position:absolute; inset:0;
      background:linear-gradient(to right, var(--c-bg) 0%, transparent 30%),
                 linear-gradient(to top, rgba(10,8,5,.6) 0%, transparent 50%);
    }
    .hero-caption {
      position:absolute; bottom:2.5rem; left:2rem; right:2rem;
      font-size:.62rem; font-weight:500; letter-spacing:.25em;
      text-transform:uppercase; color:rgba(255,255,255,.5);
    }
    .hero-number {
      position:absolute; top:50%; right:2rem;
      transform:translateY(-50%) rotate(90deg);
      font-family:'Playfair Display',serif;
      font-size:.6rem; letter-spacing:.3em;
      text-transform:uppercase; color:rgba(255,255,255,.2);
      white-space:nowrap;
    }

    /* Scroll indicator */
    .scroll-cue {
      position:absolute; bottom:2rem; left:6vw;
      display:flex; flex-direction:column; align-items:center; gap:.6rem;
      cursor:none;
    }
    .scroll-cue-text {
      font-size:.55rem; letter-spacing:.3em; text-transform:uppercase;
      color:var(--c-muted); writing-mode:vertical-rl;
    }
    .scroll-cue-line {
      width:1px; height:50px; background:var(--c-gold); transform-origin:top;
    }

    /* ── MARQUEE strip ── */
    .marquee-wrap {
      background:var(--c-gold); overflow:hidden;
      padding:.85rem 0; display:flex;
    }
    .marquee-track {
      display:flex; gap:0; white-space:nowrap;
      animation:marquee 28s linear infinite;
    }
    @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
    .marquee-item {
      font-size:.62rem; font-weight:600; letter-spacing:.25em;
      text-transform:uppercase; color:var(--c-dark);
      padding:0 2.5rem; display:flex; align-items:center; gap:2.5rem;
    }
    .marquee-dot { width:4px; height:4px; border-radius:50%; background:var(--c-dark); opacity:.4; }

    /* ── ABOUT ── */
    .about {
      padding:9rem 6vw; display:grid;
      grid-template-columns:1fr 1fr; gap:6rem; align-items:center;
      background:var(--c-bg);
    }
    .sec-eyebrow {
      font-size:.6rem; font-weight:600; letter-spacing:.3em;
      text-transform:uppercase; color:var(--c-gold);
      display:flex; align-items:center; gap:.8rem; margin-bottom:1.8rem;
    }
    .sec-eyebrow::before { content:''; width:24px; height:1px; background:var(--c-gold); }
    .sec-h2 {
      font-family:'Playfair Display',serif;
      font-size:clamp(2.4rem,4vw,4.5rem); font-weight:700;
      line-height:1.05; letter-spacing:-.02em; color:var(--c-ink);
      margin-bottom:2rem;
    }
    .sec-h2 em { font-style:italic; color:var(--c-gold); }
    .about-body p {
      font-size:.95rem; font-weight:300; line-height:1.9;
      color:var(--c-muted); margin-bottom:1.4rem;
    }
    .about-pills {
      display:flex; flex-wrap:wrap; gap:.6rem; margin:2rem 0;
    }
    .pill {
      font-size:.6rem; font-weight:500; letter-spacing:.12em;
      text-transform:uppercase; padding:.45rem 1rem;
      border:1px solid var(--c-border); color:var(--c-muted);
      background:transparent; transition:all .25s;
    }
    .pill:hover { border-color:var(--c-gold); color:var(--c-gold); }

    /* Photo mosaic */
    .mosaic {
      display:grid;
      grid-template-rows:280px 200px;
      grid-template-columns:1fr 1fr;
      gap:12px; position:relative;
    }
    .mosaic-a {
      grid-row:1/3; overflow:hidden; position:relative;
    }
    .mosaic-b, .mosaic-c { overflow:hidden; position:relative; }
    .mosaic img {
      width:100%; height:100%; object-fit:cover;
      object-position:top center;
      filter:grayscale(10%) contrast(1.05);
      transition:transform .6s ease;
    }
    .mosaic-a:hover img,
    .mosaic-b:hover img,
    .mosaic-c:hover img { transform:scale(1.04); }
    .mosaic-label {
      position:absolute; bottom:.8rem; left:.8rem;
      font-size:.55rem; font-weight:500; letter-spacing:.2em;
      text-transform:uppercase; color:rgba(255,255,255,.7);
      background:rgba(0,0,0,.35); padding:.3rem .7rem;
      backdrop-filter:blur(4px);
    }
    .mosaic-gold-bar {
      position:absolute; bottom:0; left:0; width:0; height:2px;
      background:var(--c-gold); transition:width .5s;
    }
    .mosaic-a:hover .mosaic-gold-bar,
    .mosaic-b:hover .mosaic-gold-bar,
    .mosaic-c:hover .mosaic-gold-bar { width:100%; }
    /* floating quote card */
    .mosaic-quote {
      position:absolute; bottom:-1.5rem; right:-1.5rem;
      background:var(--c-ink); color:#fff; padding:1.8rem;
      width:220px; z-index:10;
    }
    .mosaic-quote-text {
      font-family:'Playfair Display',serif;
      font-size:1rem; font-style:italic; font-weight:400;
      line-height:1.5; margin-bottom:1rem; color:rgba(255,255,255,.9);
    }
    .mosaic-quote-by {
      font-size:.55rem; font-weight:600; letter-spacing:.2em;
      text-transform:uppercase; color:var(--c-gold);
    }

    /* ── STATS BAND ── */
    .stats {
      background:var(--c-dark); padding:5rem 6vw;
      display:grid; grid-template-columns:repeat(4,1fr);
      gap:0; border-top:2px solid var(--c-gold);
    }
    .stat-item {
      text-align:center; padding:2rem;
      border-right:1px solid rgba(255,255,255,.06);
    }
    .stat-item:last-child { border-right:none; }
    .stat-num {
      font-family:'Playfair Display',serif;
      font-size:3.5rem; font-weight:700; color:var(--c-gold2);
      line-height:1; margin-bottom:.5rem;
    }
    .stat-label {
      font-size:.6rem; font-weight:500; letter-spacing:.2em;
      text-transform:uppercase; color:rgba(255,255,255,.3);
    }

    /* ── MINISTRIES ── */
    .ministries {
      display:grid; grid-template-columns:1fr 1fr; min-height:85vh;
    }
    .min-panel {
      padding:8rem 5vw; display:flex; flex-direction:column;
      justify-content:flex-end; position:relative; overflow:hidden;
    }
    .min-panel-pv { background:var(--c-navy); }
    .min-panel-sh { background:#1A1008; }
    .min-bg-word {
      position:absolute; top:3rem; right:2rem;
      font-family:'Playfair Display',serif;
      font-size:11rem; font-weight:900;
      color:rgba(255,255,255,.025); line-height:1;
      pointer-events:none; user-select:none;
    }
    .min-tag {
      font-size:.58rem; font-weight:600; letter-spacing:.3em;
      text-transform:uppercase; color:var(--c-gold);
      display:flex; align-items:center; gap:.7rem; margin-bottom:1.5rem;
    }
    .min-tag::before { content:''; width:20px; height:1px; background:var(--c-gold); }
    .min-h3 {
      font-family:'Playfair Display',serif;
      font-size:clamp(2rem,3.5vw,3.5rem);
      font-weight:700; color:#fff; line-height:1.1; margin-bottom:1.2rem;
    }
    .min-h3 em { font-style:italic; color:var(--c-gold2); }
    .min-p {
      font-size:.88rem; font-weight:300; line-height:1.85;
      color:rgba(255,255,255,.45); max-width:400px; margin-bottom:2rem;
    }
    .min-facts {
      display:flex; gap:2.5rem; margin-bottom:2.5rem;
    }
    .mf-num {
      font-family:'Playfair Display',serif;
      font-size:2.2rem; font-weight:700; color:var(--c-gold2); line-height:1;
    }
    .mf-lbl {
      font-size:.55rem; font-weight:500; letter-spacing:.18em;
      text-transform:uppercase; color:rgba(255,255,255,.3); margin-top:.3rem;
    }
    .min-btn {
      font-size:.62rem; font-weight:600; letter-spacing:.18em;
      text-transform:uppercase; color:#fff;
      border:1px solid rgba(255,255,255,.18); padding:.8rem 1.8rem;
      text-decoration:none; cursor:none; transition:all .3s;
      display:inline-block; align-self:flex-start;
    }
    .min-btn:hover { border-color:var(--c-gold); background:rgba(196,154,42,.1); }

    /* ── VIDEOS ── */
    .videos { padding:9rem 6vw; background:var(--c-surface); }
    .videos-header { margin-bottom:4rem; }
    .videos-grid {
      display:grid; grid-template-columns:1.6fr 1fr 1fr; gap:1.5rem;
    }
    .vid-card {
      overflow:hidden; background:var(--c-bg);
      border:1px solid var(--c-border);
      transition:border-color .3s, transform .3s, box-shadow .3s;
      cursor:none;
    }
    .vid-card:hover {
      border-color:var(--c-gold);
      transform:translateY(-6px);
      box-shadow:0 20px 60px rgba(196,154,42,.1);
    }
    .vid-embed {
      width:100%; aspect-ratio:16/9; border:0;
    }
    .vid-info { padding:1.4rem 1.6rem; }
    .vid-tag {
      font-size:.55rem; font-weight:600; letter-spacing:.22em;
      text-transform:uppercase; color:var(--c-gold);
      margin-bottom:.6rem; display:block;
    }
    .vid-title {
      font-family:'Playfair Display',serif;
      font-size:1.05rem; font-weight:500; line-height:1.35;
      color:var(--c-ink); margin-bottom:.5rem;
    }
    .vid-source {
      font-size:.7rem; color:var(--c-muted); font-weight:300;
    }

    /* Also add YouTube-style play cards for videos without direct embeds */
    .vid-thumb {
      width:100%; aspect-ratio:16/9;
      background:var(--c-ink); display:flex;
      align-items:center; justify-content:center;
      position:relative; overflow:hidden;
    }
    .vid-thumb-bg {
      position:absolute; inset:0;
      background:linear-gradient(135deg,#1a1510 0%,#2a2018 100%);
    }
    .vid-thumb-pattern {
      position:absolute; inset:0; opacity:.04;
      background-image:repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%);
      background-size:10px 10px;
    }
    .play-btn {
      width:60px; height:60px; border-radius:50%;
      background:rgba(196,154,42,.15); border:2px solid var(--c-gold);
      display:flex; align-items:center; justify-content:center;
      position:relative; z-index:1; transition:background .3s, transform .3s;
    }
    .vid-card:hover .play-btn { background:var(--c-gold); transform:scale(1.1); }
    .play-arrow {
      width:0; height:0; margin-left:4px;
      border-top:10px solid transparent;
      border-bottom:10px solid transparent;
      border-left:16px solid var(--c-gold);
      transition:border-left-color .3s;
    }
    .vid-card:hover .play-arrow { border-left-color:var(--c-ink); }
    .vid-fb-label {
      position:absolute; bottom:.8rem; right:.8rem;
      font-size:.55rem; font-weight:600; letter-spacing:.15em;
      text-transform:uppercase; color:rgba(255,255,255,.4);
      background:rgba(0,0,0,.3); padding:.3rem .6rem;
      backdrop-filter:blur(4px);
    }

    /* ── BOOKS ── */
    .books { padding:9rem 6vw; background:var(--c-bg); }
    .books-grid {
      display:grid; grid-template-columns:repeat(3,1fr);
      gap:2px; margin-top:4rem;
      border:2px solid var(--c-border);
    }
    .bk-card {
      padding:3rem 2.5rem; background:var(--c-bg);
      border-right:2px solid var(--c-border);
      transition:background .3s; cursor:none; position:relative;
      overflow:hidden;
    }
    .bk-card:last-child { border-right:none; }
    .bk-card:hover { background:var(--c-surface); }
    .bk-card::before {
      content:''; position:absolute; top:0; left:0;
      width:0; height:3px; background:var(--c-gold);
      transition:width .5s;
    }
    .bk-card:hover::before { width:100%; }
    .bk-num {
      font-family:'Playfair Display',serif;
      font-size:4.5rem; font-weight:900; line-height:1;
      color:var(--c-border); margin-bottom:1.5rem;
      transition:color .3s;
    }
    .bk-card:hover .bk-num { color:var(--c-gold); opacity:.3; }
    .bk-tag {
      font-size:.55rem; font-weight:600; letter-spacing:.25em;
      text-transform:uppercase; color:var(--c-gold); margin-bottom:.8rem;
    }
    .bk-title {
      font-family:'Playfair Display',serif;
      font-size:1.4rem; font-weight:600; line-height:1.25;
      color:var(--c-ink); margin-bottom:1rem;
    }
    .bk-desc {
      font-size:.82rem; font-weight:300; line-height:1.75;
      color:var(--c-muted); margin-bottom:1.5rem;
    }
    .bk-link {
      font-size:.6rem; font-weight:600; letter-spacing:.18em;
      text-transform:uppercase; color:var(--c-ink);
      text-decoration:none; display:inline-flex; align-items:center; gap:.5rem;
      cursor:none; transition:color .3s;
    }
    .bk-link:hover { color:var(--c-gold); }

    /* ── SPEAKING ── */
    .speaking { padding:9rem 6vw; background:var(--c-dark); }
    .speaking-inner { display:grid; grid-template-columns:1fr 1.4fr; gap:8rem; align-items:start; }
    .speaking-aside { position:sticky; top:9rem; }
    .speaking-aside .sec-eyebrow { color:var(--c-gold); }
    .speaking-aside .sec-h2 { color:#fff; }
    .aside-quote {
      margin-top:3rem; border-left:2px solid var(--c-gold);
      padding-left:1.5rem;
    }
    .aside-quote-text {
      font-family:'Playfair Display',serif;
      font-size:1.15rem; font-style:italic; font-weight:400;
      color:rgba(255,255,255,.7); line-height:1.6; margin-bottom:1rem;
    }
    .aside-quote-by {
      font-size:.58rem; font-weight:600; letter-spacing:.2em;
      text-transform:uppercase; color:var(--c-gold);
    }
    .ev-list { display:flex; flex-direction:column; }
    .ev-item {
      display:grid; grid-template-columns:72px 1fr;
      gap:1.8rem; padding:1.8rem 0;
      border-bottom:1px solid rgba(255,255,255,.06);
      transition:border-color .3s;
    }
    .ev-item:hover { border-color:var(--c-gold); }
    .ev-date { text-align:center; padding-top:.25rem; }
    .ev-day {
      font-family:'Playfair Display',serif;
      font-size:2.8rem; font-weight:700; color:var(--c-gold2); line-height:1;
    }
    .ev-mon {
      font-size:.55rem; font-weight:600; letter-spacing:.2em;
      text-transform:uppercase; color:rgba(255,255,255,.25);
    }
    .ev-name {
      font-family:'Playfair Display',serif;
      font-size:1.15rem; font-weight:500; color:#fff;
      margin-bottom:.4rem; line-height:1.25;
    }
    .ev-meta {
      font-size:.72rem; color:rgba(255,255,255,.35);
      display:flex; gap:.8rem; flex-wrap:wrap;
    }
    .ev-type { color:var(--c-gold); }

    /* ── CONTACT ── */
    .contact {
      padding:9rem 6vw; background:var(--c-bg);
      display:grid; grid-template-columns:1fr 1.2fr; gap:8rem; align-items:start;
    }
    .contact-hero-img {
      width:100%; aspect-ratio:3/4; object-fit:cover;
      object-position:top; filter:grayscale(20%) contrast(1.05);
    }
    .contact-right { padding-top:1rem; }
    .c-detail { display:flex; gap:1rem; align-items:flex-start; margin-bottom:1.5rem; }
    .c-icon {
      width:34px; height:34px; flex-shrink:0;
      border:1px solid var(--c-border);
      display:flex; align-items:center; justify-content:center;
      font-size:.7rem; color:var(--c-gold);
    }
    .c-lbl {
      font-size:.55rem; font-weight:600; letter-spacing:.2em;
      text-transform:uppercase; color:var(--c-muted); margin-bottom:.2rem;
    }
    .c-val { font-size:.85rem; color:var(--c-ink); font-weight:300; }
    .cform { display:flex; flex-direction:column; gap:1rem; margin-top:2.5rem; }
    .crow { display:grid; grid-template-columns:1fr 1fr; gap:1rem; }
    .cfg { display:flex; flex-direction:column; gap:.4rem; }
    .cfl {
      font-size:.55rem; font-weight:600; letter-spacing:.18em;
      text-transform:uppercase; color:var(--c-muted);
    }
    .cfi, .cfs, .cfta {
      background:var(--c-surface); border:1px solid var(--c-border);
      padding:.85rem 1rem; font-family:'Outfit',sans-serif;
      font-size:.85rem; font-weight:300; color:var(--c-ink);
      outline:none; width:100%; transition:border-color .3s;
    }
    .cfi:focus, .cfs:focus, .cfta:focus { border-color:var(--c-gold); }
    .cfta { min-height:110px; resize:vertical; }
    .cfbtn {
      font-size:.65rem; font-weight:600; letter-spacing:.2em;
      text-transform:uppercase; background:var(--c-ink); color:#fff;
      padding:1rem 2.4rem; border:none; cursor:none;
      font-family:'Outfit',sans-serif; transition:background .3s;
      align-self:flex-start;
    }
    .cfbtn:hover { background:var(--c-gold); color:var(--c-ink); }

    /* ── FOOTER ── */
    .footer { background:var(--c-ink); padding:5rem 6vw 2.5rem; }
    .ft-top {
      display:grid; grid-template-columns:2fr 1fr 1fr 1fr;
      gap:4rem; padding-bottom:4rem;
      border-bottom:1px solid rgba(255,255,255,.07);
      margin-bottom:2.5rem;
    }
    .ft-brand {
      font-family:'Playfair Display',serif;
      font-size:1.25rem; font-weight:700; color:#fff; margin-bottom:1rem;
    }
    .ft-brand em { font-style:italic; color:var(--c-gold); }
    .ft-tagline {
      font-size:.78rem; font-weight:300; line-height:1.7;
      color:rgba(255,255,255,.3); margin-bottom:1.8rem;
    }
    .ft-col-h {
      font-size:.55rem; font-weight:600; letter-spacing:.28em;
      text-transform:uppercase; color:var(--c-gold); margin-bottom:1.4rem;
    }
    .ftl {
      display:block; font-size:.78rem; font-weight:300;
      color:rgba(255,255,255,.3); text-decoration:none;
      margin-bottom:.7rem; transition:color .25s; cursor:none;
    }
    .ftl:hover { color:#fff; }
    .ft-bottom {
      display:flex; justify-content:space-between; align-items:center;
    }
    .ft-copy {
      font-size:.65rem; color:rgba(255,255,255,.18); letter-spacing:.05em;
    }
    .ft-gold-sep { width:30px; height:1px; background:var(--c-gold); opacity:.3; }

    /* ── RESPONSIVE ── */
    @media(max-width:1024px){
      .hero { grid-template-columns:1fr; }
      .hero-right { display:none; }
      .hero-left { padding:7rem 6vw 5rem; }
      .about { grid-template-columns:1fr; }
      .mosaic { order:-1; }
      .stats { grid-template-columns:repeat(2,1fr); }
      .ministries { grid-template-columns:1fr; }
      .videos-grid { grid-template-columns:1fr; }
      .books-grid { grid-template-columns:1fr; }
      .books-grid .bk-card { border-right:none; border-bottom:2px solid var(--c-border); }
      .speaking-inner { grid-template-columns:1fr; }
      .speaking-aside { position:static; }
      .contact { grid-template-columns:1fr; }
      .contact-hero-img { aspect-ratio:16/9; }
      .ft-top { grid-template-columns:1fr 1fr; }
    }
  `}</style>
);

// ── CURSOR ────────────────────────────────────────────────────────────────────
function Cursor() {
  const mx = useMotionValue(-100), my = useMotionValue(-100);
  const rx = useSpring(mx, { stiffness:200, damping:22 });
  const ry = useSpring(my, { stiffness:200, damping:22 });
  useEffect(() => {
    const move = e => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <>
      <motion.div className="cur-dot" style={{ left: mx, top: my }} />
      <motion.div className="cur-circle" style={{ left: rx, top: ry }} />
    </>
  );
}

// ── REVEAL ────────────────────────────────────────────────────────────────────
function R({ children, delay=0, y=36, x=0, className="" }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once:true, margin:"-60px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity:0, y, x }}
      animate={inV ? { opacity:1, y:0, x:0 } : {}}
      transition={{ duration:.85, delay, ease:[.22,1,.36,1] }}
    >{children}</motion.div>
  );
}

// ── NAV ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [bg, setBg] = useState(false);
  useEffect(() => {
    const fn = () => setBg(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <motion.header className={`nav ${bg?"bg":""}`}
      initial={{ y:-80, opacity:0 }}
      animate={{ y:0, opacity:1 }}
      transition={{ duration:.7, ease:[.22,1,.36,1] }}
    >
      <a className="logo" href="#home">Dr. Kunle <em>Hamilton</em></a>
      <nav className="nav-links">
        {["About","Ministries","Videos","Books","Speaking","Contact"].map(l => (
          <a key={l} className="nl" href={`#${l.toLowerCase()}`}>{l}</a>
        ))}
        <a className="nav-btn" href="#contact">Book a Session</a>
      </nav>
    </motion.header>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0,600], [0,80]);
  return (
    <section className="hero" id="home">
      <div className="hero-left">
        <motion.div className="hero-tag"
          initial={{ opacity:0, x:-30 }} animate={{ opacity:1, x:0 }}
          transition={{ duration:.7, delay:.4 }}
        >
          <span className="hero-tag-line" />
          Prophet · Scholar · Shepherd · Author
        </motion.div>

        <motion.h1 className="hero-h1"
          initial={{ opacity:0, y:70 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:1, delay:.55, ease:[.22,1,.36,1] }}
        >
          <span className="light">Dr. Kunle</span>
          <span className="gold">Hamilton</span>
        </motion.h1>

        <motion.div className="hero-rule"
          initial={{ scaleX:0 }} animate={{ scaleX:1 }}
          transition={{ duration:1.2, delay:.9, ease:[.22,1,.36,1] }}
        />

        <motion.p className="hero-p"
          initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:.8, delay:1 }}
        >
          A voice that bridges faith, scholarship and culture. Prophet, media veteran, bestselling author and founder of CCC PraiseVille &amp; ShaddaiVille Ministries — transforming lives across five nations.
        </motion.p>

        <motion.div className="hero-actions"
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:.8, delay:1.15 }}
        >
          <a className="btn-solid" href="#about">Discover His Legacy</a>
          <a className="btn-line" href="#videos">Watch Teachings</a>
        </motion.div>

        <div className="scroll-cue">
          <span className="scroll-cue-text">Scroll</span>
          <motion.div className="scroll-cue-line"
            animate={{ scaleY:[0,1,0] }}
            transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }}
          />
        </div>
      </div>

      <motion.div className="hero-right" style={{ y: imgY }}>
        <img src={IMG_PREACHING} alt="Dr. Kunle Hamilton preaching" className="hero-img" />
        <div className="hero-img-overlay" />
        <div className="hero-caption">Senior Shepherd · CCC PraiseVille Global</div>
        <div className="hero-number">Lagos · Berlin · London · USA</div>
      </motion.div>

      {/* Animated gold border */}
      <motion.div style={{
        position:"absolute", bottom:0, left:0, height:"2px", background:"var(--c-gold)",
        transformOrigin:"left", width:"100%"
      }}
        initial={{ scaleX:0 }} animate={{ scaleX:1 }}
        transition={{ duration:1.5, delay:1.3, ease:[.22,1,.36,1] }}
      />
    </section>
  );
}

// ── MARQUEE ───────────────────────────────────────────────────────────────────
const marqueeItems = ["Prophet","Scholar","Media Veteran","Author","Shepherd","PraiseVille Global","ShaddaiVille International","Discipleship","Leadership","Faith"];
function Marquee() {
  const all = [...marqueeItems, ...marqueeItems];
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {all.map((t,i) => (
          <span key={i} className="marquee-item">
            {t}<span className="marquee-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}

// ── ABOUT ─────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section className="about" id="about">
      {/* Photo mosaic */}
      <R x={-40} y={0}>
        <div className="mosaic" style={{ position:"relative" }}>
          <div className="mosaic-a">
            <img src={IMG_FORMAL} alt="Dr. Kunle Hamilton — formal portrait" />
            <div className="mosaic-label">Prophet · Scholar</div>
            <div className="mosaic-gold-bar" />
          </div>
          <div className="mosaic-b">
            <img src={IMG_SPEAKING} alt="Dr. Kunle Hamilton speaking" />
            <div className="mosaic-label">In Ministry</div>
            <div className="mosaic-gold-bar" />
          </div>
          <div className="mosaic-c">
            <img src={IMG_PREACHING} alt="Dr. Kunle Hamilton preaching" />
            <div className="mosaic-label">CCC PraiseVille</div>
            <div className="mosaic-gold-bar" />
          </div>
          <div className="mosaic-quote">
            <div className="mosaic-quote-text">
              "If God had not arrested me with the drama of the Celestial Church, He would have lost me to atheism."
            </div>
            <div className="mosaic-quote-by">— Dr. Kunle Hamilton</div>
          </div>
        </div>
      </R>

      <div className="about-body">
        <R><div className="sec-eyebrow">The Man Behind the Ministry</div></R>
        <R delay={.1}>
          <h2 className="sec-h2">
            A Philosopher<br />Who Found <em>God.</em>
          </h2>
        </R>
        <R delay={.2}>
          <p>Dr. Kunle Hamilton is one of Nigeria's most remarkable multi-disciplinary voices — a Prophet of the Celestial Church of Christ, a veteran journalist and media executive, reputation management expert, international author, and a transformative spiritual leader whose reach spans four continents.</p>
          <p>A Philosophy first-class graduate (Best Student, 1985) and Mass Communication scholar from the University of Lagos, Dr. Hamilton fuses rigorous academic thought with prophetic grace. His ministry is defined by discipleship, nation-building, and the empowerment of the next generation.</p>
        </R>
        <R delay={.3}>
          <div className="about-pills">
            {["Prophet · CCC","Philosophy BA — UNILAG","M.Sc. Mass Comm.","Veteran Journalist","Reputation Manager","International Author","CEO — Virgin Outdoor","Lambert Academic Publishing"].map(p => (
              <span key={p} className="pill">{p}</span>
            ))}
          </div>
        </R>
        <R delay={.4}>
          <a className="btn-solid" href="#contact" style={{ display:"inline-block" }}>
            Connect with Dr. Hamilton
          </a>
        </R>
      </div>
    </section>
  );
}

// ── STATS ─────────────────────────────────────────────────────────────────────
function Stats() {
  const items = [
    { n:"40+", l:"Years in Ministry" },
    { n:"5",   l:"Nations of Impact" },
    { n:"2",   l:"Thriving Ministries" },
    { n:"18",  l:"Countries — Books Published" },
  ];
  return (
    <R>
      <div className="stats">
        {items.map((s,i) => (
          <motion.div key={i} className="stat-item"
            initial={{ opacity:0, y:20 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ delay:i*.12, duration:.7 }}
          >
            <div className="stat-num">{s.n}</div>
            <div className="stat-label">{s.l}</div>
          </motion.div>
        ))}
      </div>
    </R>
  );
}

// ── MINISTRIES ────────────────────────────────────────────────────────────────
function Ministries() {
  return (
    <section className="ministries" id="ministries">
      <R x={-30} y={0}>
        <div className="min-panel min-panel-pv" style={{ display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8rem 5vw", position:"relative", overflow:"hidden", minHeight:"80vh" }}>
          <div className="min-bg-word">PV</div>
          <div className="min-tag">Celestial Church of Christ</div>
          <h3 className="min-h3">CCC <em>PraiseVille</em><br />Global</h3>
          <p className="min-p">
            Founded in Berlin, Germany on May 8, 2016 and now flourishing across Nigeria, UK, USA and Germany. PraiseVille is a place of authentic worship, genuine prophecy, and deep fellowship — the Celestial Church alive in the modern world.
          </p>
          <div className="min-facts">
            <div><div className="mf-num">4+</div><div className="mf-lbl">Countries</div></div>
            <div><div className="mf-num">2016</div><div className="mf-lbl">Founded Berlin</div></div>
            <div><div className="mf-num">7+</div><div className="mf-lbl">Festival of Word</div></div>
          </div>
          <a className="min-btn" href="#contact">Visit PraiseVille →</a>
        </div>
      </R>
      <R x={30} y={0}>
        <div className="min-panel min-panel-sh" style={{ display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"8rem 5vw", position:"relative", overflow:"hidden", minHeight:"80vh" }}>
          <div className="min-bg-word">SV</div>
          <div className="min-tag">Non-Denominational · Global Training</div>
          <h3 className="min-h3">ShaddaiVille<br /><em>Ministries</em><br />International</h3>
          <p className="min-p">
            "God's City" — training Christians and Muslims alike in UK-certificated leadership and entrepreneurship since 2007. Free of charge. Branches in Nigeria, USA, UK, Germany and Canada.
          </p>
          <div className="min-facts">
            <div><div className="mf-num">5</div><div className="mf-lbl">Nations</div></div>
            <div><div className="mf-num">2007</div><div className="mf-lbl">Est. Nigeria</div></div>
            <div><div className="mf-num">UK</div><div className="mf-lbl">Certified Academy</div></div>
          </div>
          <a className="min-btn" href="#contact">Explore ShaddaiVille →</a>
        </div>
      </R>
    </section>
  );
}

// ── VIDEOS ────────────────────────────────────────────────────────────────────
function Videos() {
  // Real Facebook video IDs found in search results
  const vids = [
    {
      embedUrl: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fcelestial.focus%2Fvideos%2F1356642479037237&show_text=false&mute=0",
      title: "Dr. Kunle Hamilton Teaches Discipleship",
      tag: "Discipleship · Teaching",
      src: "CelestialFocus · Facebook"
    },
    {
      embedUrl: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fhephzibahtelevision%2Fvideos%2F449065333576250&show_text=false&mute=0",
      title: "Meeting with Dr. Kunle Hamilton — The Roles of Leadership",
      tag: "Leadership · Interview",
      src: "Hephzibah Television · Facebook"
    },
    {
      embedUrl: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fcelestial.focus%2Fvideos%2F1241668604555889&show_text=false&mute=0",
      title: "Christmas Celebration — CCC PraiseVille Highlight",
      tag: "Worship · Celebration",
      src: "CelestialFocus · Facebook"
    },
  ];
  return (
    <section className="videos" id="videos">
      <div className="videos-header">
        <R><div className="sec-eyebrow">Teachings, Sermons & Interviews</div></R>
        <R delay={.1}><h2 className="sec-h2">Watch Dr. Hamilton<br /><em>In Action</em></h2></R>
      </div>
      <div className="videos-grid">
        {vids.map((v,i) => (
          <R key={i} delay={i*.15}>
            <div className="vid-card">
              <iframe
                className="vid-embed"
                src={v.embedUrl}
                style={{ border:"none", overflow:"hidden" }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title={v.title}
              />
              <div className="vid-info">
                <span className="vid-tag">{v.tag}</span>
                <div className="vid-title">{v.title}</div>
                <div className="vid-source">{v.src}</div>
              </div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

// ── BOOKS ─────────────────────────────────────────────────────────────────────
function Books() {
  const bks = [
    { tag:"Leadership", title:"Releasing the Eagle in You", desc:"An eight-chapter inspirational work on leadership and self-actualization — a guide to unlocking the greatness God placed within every person. Published internationally in 18 countries." },
    { tag:"Philosophy", title:"Journey to Understanding", desc:"A philosophical investigation of how style and content impact the spoken word, using the church, a preacher and his congregation, plus Raypower 100.5 FM as its remarkable canvas." },
    { tag:"Ministry", title:"The ShaddaiVille Vision", desc:"Dr. Hamilton's framework for discipleship-driven ministry that transcends denominational walls — building leaders, entrepreneurs and moral beacons across faith traditions and nations." },
  ];
  return (
    <section className="books" id="books">
      <R><div className="sec-eyebrow">Written Works</div></R>
      <R delay={.1}><h2 className="sec-h2" style={{ marginBottom:0 }}>Books &amp; <em>Publications</em></h2></R>
      <div className="books-grid">
        {bks.map((b,i) => (
          <R key={i} delay={i*.12}>
            <div className="bk-card">
              <div className="bk-num">0{i+1}</div>
              <div className="bk-tag">{b.tag}</div>
              <div className="bk-title">{b.title}</div>
              <div className="bk-desc">{b.desc}</div>
              <a className="bk-link" href="#contact">Order a Copy →</a>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

// ── SPEAKING ──────────────────────────────────────────────────────────────────
function Speaking() {
  const evs = [
    { d:"12", m:"Apr", name:"Festival of the Word — Annual Harvest", loc:"Lagos, Nigeria", type:"Worship & Teaching" },
    { d:"03", m:"May", name:"ShaddaiVille UK Leadership Retreat", loc:"London, United Kingdom", type:"Leadership Academy" },
    { d:"21", m:"Jun", name:"Teenagers' Motivational Summit", loc:"Berlin, Germany", type:"Youth Empowerment" },
    { d:"08", m:"Aug", name:"Ephphatha Non-Denominational Crusade", loc:"Lagos, Nigeria", type:"Evangelism" },
    { d:"15", m:"Sep", name:"Media & Ministry — Public Lecture", loc:"University of Lagos", type:"Academic Talk" },
  ];
  return (
    <section className="speaking" id="speaking">
      <div className="speaking-inner">
        <div className="speaking-aside">
          <R><div className="sec-eyebrow">Events & Engagements</div></R>
          <R delay={.1}><h2 className="sec-h2">Speaking &amp;<br /><em>Appearances</em></h2></R>
          <R delay={.2}>
            <div className="aside-quote">
              <div className="aside-quote-text">
                "The responsibility of religious leaders is to guide young people towards righteousness — not to encourage them to chase fame through questionable means."
              </div>
              <div className="aside-quote-by">— Dr. Kunle Hamilton</div>
            </div>
          </R>
          <R delay={.35}>
            <div style={{ marginTop:"2.5rem" }}>
              <a className="btn-solid" href="#contact">Invite Dr. Hamilton</a>
            </div>
          </R>
        </div>
        <div className="ev-list">
          {evs.map((e,i) => (
            <R key={i} delay={i*.1} x={30} y={0}>
              <div className="ev-item">
                <div className="ev-date">
                  <div className="ev-day">{e.d}</div>
                  <div className="ev-mon">{e.m}</div>
                </div>
                <div>
                  <div className="ev-name">{e.name}</div>
                  <div className="ev-meta">
                    <span>📍 {e.loc}</span>
                    <span className="ev-type">· {e.type}</span>
                  </div>
                </div>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CONTACT ───────────────────────────────────────────────────────────────────
function Contact() {
  const [f, setF] = useState({ name:"", email:"", inquiry:"speaking", msg:"" });
  const [sent, setSent] = useState(false);
  return (
    <section className="contact" id="contact">
      <R x={-30} y={0}>
        <div>
          <img src={IMG_SPEAKING} alt="Dr. Kunle Hamilton" className="contact-hero-img" />
        </div>
      </R>
      <R delay={.15}>
        <div className="contact-right">
          <div className="sec-eyebrow">Get in Touch</div>
          <h2 className="sec-h2">Let's <em>Connect</em></h2>
          {[
            { icon:"✦", label:"Ministry", val:"CCC PraiseVille Global · ShaddaiVille International" },
            { icon:"✦", label:"Based In", val:"Lagos, Nigeria · Berlin, Germany · London, UK" },
            { icon:"✦", label:"Media & PR", val:"Virgin Outdoor Communications, Lagos" },
          ].map((d,i) => (
            <div className="c-detail" key={i}>
              <div className="c-icon">{d.icon}</div>
              <div><div className="c-lbl">{d.label}</div><div className="c-val">{d.val}</div></div>
            </div>
          ))}
          {sent ? (
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
              style={{ marginTop:"2.5rem", padding:"2.5rem", background:"var(--c-surface)",
                       border:"1px solid var(--c-border)", textAlign:"center" }}>
              <div style={{ fontFamily:"Playfair Display,serif", fontSize:"2rem",
                            color:"var(--c-gold)", marginBottom:".8rem" }}>✦</div>
              <div style={{ fontFamily:"Playfair Display,serif", fontSize:"1.4rem",
                            marginBottom:".5rem" }}>Message Received</div>
              <div style={{ fontSize:".8rem", color:"var(--c-muted)", fontWeight:300 }}>
                Dr. Hamilton's team will be in touch shortly.
              </div>
            </motion.div>
          ) : (
            <form className="cform" onSubmit={e => { e.preventDefault(); setSent(true); }}>
              <div className="crow">
                <div className="cfg"><label className="cfl">Full Name</label>
                  <input className="cfi" placeholder="Your name" value={f.name} onChange={e=>setF({...f,name:e.target.value})} required /></div>
                <div className="cfg"><label className="cfl">Email</label>
                  <input className="cfi" type="email" placeholder="your@email.com" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required /></div>
              </div>
              <div className="cfg"><label className="cfl">Nature of Inquiry</label>
                <select className="cfs" value={f.inquiry} onChange={e=>setF({...f,inquiry:e.target.value})}>
                  <option value="speaking">Speaking Engagement</option>
                  <option value="ministry">Ministry / Church</option>
                  <option value="books">Books & Publications</option>
                  <option value="media">Media / Interview</option>
                  <option value="leadership">ShaddaiVille Leadership Academy</option>
                  <option value="general">General Enquiry</option>
                </select></div>
              <div className="cfg"><label className="cfl">Message</label>
                <textarea className="cfta" placeholder="Your message..." value={f.msg} onChange={e=>setF({...f,msg:e.target.value})} required /></div>
              <button className="cfbtn" type="submit">Send Message →</button>
            </form>
          )}
        </div>
      </R>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="ft-top">
        <div>
          <div className="ft-brand">Dr. Kunle <em>Hamilton</em></div>
          <div className="ft-tagline">Prophet · Scholar · Shepherd · Author · Media Veteran<br/>Serving God & humanity across five nations.</div>
          <div className="ft-gold-sep" />
        </div>
        <div>
          <div className="ft-col-h">Main Site</div>
          {["About","Videos","Books","Speaking","Contact"].map(l=>(
            <a key={l} className="ftl" href={`#${l.toLowerCase()}`}>{l}</a>
          ))}
        </div>
        <div>
          <div className="ft-col-h">CCC PraiseVille</div>
          {["About PraiseVille","Sunday Services","Festival of the Word","Pastoral Team","Join Us"].map(l=>(
            <a key={l} className="ftl" href="#ministries">{l}</a>
          ))}
        </div>
        <div>
          <div className="ft-col-h">ShaddaiVille</div>
          {["About ShaddaiVille","Leadership Academy","Teens Academy","Outreach","Partner With Us"].map(l=>(
            <a key={l} className="ftl" href="#ministries">{l}</a>
          ))}
        </div>
      </div>
      <div className="ft-bottom">
        <div className="ft-copy">© 2025 Dr. Kunle Hamilton · All Rights Reserved</div>
        <div className="ft-gold-sep" />
        <div className="ft-copy">PraiseVille Global · ShaddaiVille Ministries International</div>
      </div>
    </footer>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <G />
      <Cursor />
      <Nav />
      <Hero />
      <Marquee />
      <About />
      <Stats />
      <Ministries />
      <Videos />
      <Books />
      <Speaking />
      <Contact />
      <Footer />
    </>
  );
}
