import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";

// ── PHOTOS ────────────────────────────────────────────────────────────────────
const IMG_HERO     = "/dkh-hero.jpg";      // new — white garment, blue sash, mic
const IMG_TEACHING = "/dkh-teaching.jpg";  // new — close-up teaching, CelestialPhotos
const IMG_FORMAL   = "/dkh-formal.jpg";    // original formal headshot
const IMG_OLD1     = "/dkh-speaking.jpg";  // old speaking
const IMG_OLD2     = "/dkh-preaching.jpg"; // old preaching

// ── GLOBAL STYLES ─────────────────────────────────────────────────────────────
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400;1,700&family=Outfit:wght@200;300;400;500;600&display=swap');

    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

    :root {
      --bg:      #FDFCF8;
      --surface: #F7F3EB;
      --border:  #E8DFC8;
      --gold:    #C49A2A;
      --gold2:   #E2B84A;
      --ink:     #100E0A;
      --dark:    #1A1510;
      --muted:   #6B6255;
      --navy:    #14213D;
      --white:   #FFFFFF;
    }

    html { scroll-behavior:smooth; overflow-x:hidden; }
    body {
      font-family:'Outfit',sans-serif;
      background:var(--bg); color:var(--ink);
      overflow-x:hidden; cursor:none;
    }
    @media(max-width:768px){ body { cursor:auto; } }
    ::-webkit-scrollbar { width:2px; }
    ::-webkit-scrollbar-track { background:var(--surface); }
    ::-webkit-scrollbar-thumb { background:var(--gold); }

    /* ── CURSOR (desktop only) ── */
    .cur-dot {
      position:fixed; width:6px; height:6px; border-radius:50%;
      background:var(--gold); pointer-events:none; z-index:9999;
      transform:translate(-50%,-50%);
    }
    .cur-ring {
      position:fixed; width:38px; height:38px; border-radius:50%;
      border:1px solid rgba(196,154,42,.45); pointer-events:none; z-index:9998;
      transform:translate(-50%,-50%);
    }
    @media(max-width:768px){ .cur-dot,.cur-ring { display:none; } }

    /* ── NAV ── */
    .nav {
      position:fixed; inset:0 0 auto; z-index:300;
      padding:0 5vw; height:68px;
      display:flex; align-items:center; justify-content:space-between;
      transition:background .4s, box-shadow .4s;
    }
    .nav.bg {
      background:rgba(253,252,248,.96);
      backdrop-filter:blur(20px);
      box-shadow:0 1px 0 var(--border);
    }
    .logo {
      font-family:'Playfair Display',serif;
      font-size:1rem; font-weight:700; letter-spacing:.04em;
      color:var(--ink); text-decoration:none; cursor:none; z-index:10;
      white-space:nowrap;
    }
    .logo em { font-style:italic; color:var(--gold); }
    @media(max-width:768px){ .logo { cursor:auto; } }

    /* Desktop nav links */
    .nav-links {
      display:flex; gap:1.8rem; align-items:center;
    }
    @media(max-width:900px){
      .nav-links { display:none; }
    }
    .nl {
      font-size:.65rem; font-weight:500; letter-spacing:.16em;
      text-transform:uppercase; color:var(--muted);
      text-decoration:none; cursor:none; transition:color .25s;
      position:relative;
    }
    .nl::after {
      content:''; position:absolute; bottom:-3px; left:0;
      width:0; height:1px; background:var(--gold); transition:width .3s;
    }
    .nl:hover { color:var(--ink); }
    .nl:hover::after { width:100%; }
    .nav-cta {
      font-size:.62rem; font-weight:600; letter-spacing:.16em;
      text-transform:uppercase; background:var(--ink); color:#fff;
      padding:.55rem 1.3rem; text-decoration:none; cursor:none;
      transition:background .3s; white-space:nowrap; display:inline-block;
    }
    .nav-cta:hover { background:var(--gold); color:var(--ink); }
    @media(max-width:768px){ .nav-cta { cursor:auto; } }

    /* Hamburger */
    .hamburger {
      display:none; flex-direction:column; gap:5px;
      cursor:pointer; padding:4px; z-index:10;
      background:none; border:none;
    }
    @media(max-width:900px){ .hamburger { display:flex; } }
    .ham-line {
      width:24px; height:1.5px; background:var(--ink); border-radius:2px;
      transition:transform .3s, opacity .3s;
    }

    /* Mobile menu */
    .mobile-menu {
      position:fixed; inset:0; background:var(--bg); z-index:200;
      display:flex; flex-direction:column; align-items:center;
      justify-content:center; gap:2.5rem;
      padding:2rem;
    }
    .mobile-menu a {
      font-family:'Playfair Display',serif;
      font-size:2rem; font-weight:700; color:var(--ink);
      text-decoration:none; letter-spacing:-.01em;
    }
    .mobile-menu a:hover { color:var(--gold); }
    .mobile-menu .mob-cta {
      font-family:'Outfit',sans-serif;
      font-size:.7rem; font-weight:600; letter-spacing:.18em;
      text-transform:uppercase; background:var(--gold); color:var(--ink);
      padding:.9rem 2.4rem; font-size:.7rem; margin-top:1rem;
    }
    .mobile-gold-line {
      width:40px; height:1px; background:var(--gold); margin:.5rem 0;
    }

    /* ── HERO ── */
    .hero {
      min-height:100vh; display:grid;
      grid-template-columns:52% 48%;
      background:var(--bg); position:relative; overflow:hidden;
    }
    @media(max-width:900px){
      .hero { grid-template-columns:1fr; min-height:auto; }
    }
    .hero-left {
      display:flex; flex-direction:column; justify-content:center;
      padding:8rem 5vw 6rem 6vw; position:relative; z-index:2;
    }
    @media(max-width:900px){
      .hero-left { padding:7rem 6vw 4rem; order:2; }
    }
    .hero-tag {
      display:inline-flex; align-items:center; gap:.75rem;
      font-size:.58rem; font-weight:600; letter-spacing:.3em;
      text-transform:uppercase; color:var(--gold); margin-bottom:2rem;
    }
    .hero-tag-line { width:28px; height:1px; background:var(--gold); flex-shrink:0; }
    @media(max-width:480px){ .hero-tag { font-size:.5rem; } }

    .hero-h1 {
      font-family:'Playfair Display',serif;
      font-size:clamp(3rem,6.5vw,7.5rem);
      font-weight:900; line-height:.9;
      letter-spacing:-.03em; color:var(--ink);
    }
    .hero-h1 .gold { color:var(--gold); font-style:italic; display:block; }
    .hero-h1 .light { font-weight:400; font-style:italic; font-size:.7em; display:block; margin-bottom:.15em; }
    @media(max-width:480px){
      .hero-h1 { font-size:clamp(2.6rem,10vw,4rem); }
    }

    .hero-rule {
      width:60px; height:2px; background:var(--gold);
      margin:2rem 0; transform-origin:left;
    }
    .hero-p {
      font-size:clamp(.85rem,1.5vw,1rem); font-weight:300;
      line-height:1.85; color:var(--muted); max-width:460px; margin-bottom:2.5rem;
    }
    .hero-actions { display:flex; gap:.8rem; flex-wrap:wrap; }
    .btn-solid {
      font-size:.62rem; font-weight:600; letter-spacing:.18em;
      text-transform:uppercase; background:var(--ink); color:#fff;
      padding:.85rem 2rem; text-decoration:none; cursor:none;
      transition:background .3s; display:inline-block; white-space:nowrap;
    }
    .btn-solid:hover { background:var(--gold); color:var(--ink); }
    @media(max-width:768px){ .btn-solid { cursor:auto; } }
    .btn-outline {
      font-size:.62rem; font-weight:500; letter-spacing:.18em;
      text-transform:uppercase; color:var(--ink);
      border:1px solid var(--border); padding:.85rem 2rem;
      text-decoration:none; cursor:none; transition:border-color .3s, color .3s;
      display:inline-block; white-space:nowrap;
    }
    .btn-outline:hover { border-color:var(--gold); color:var(--gold); }
    @media(max-width:768px){ .btn-outline { cursor:auto; } }

    /* Hero right — image */
    .hero-right {
      position:relative; overflow:hidden; background:var(--surface);
    }
    @media(max-width:900px){
      .hero-right { order:1; height:70vw; max-height:520px; }
    }
    .hero-img {
      width:100%; height:100%; object-fit:cover;
      object-position:center top;
      transition:transform .6s ease;
    }
    .hero-img-overlay {
      position:absolute; inset:0;
      background:linear-gradient(to right, var(--bg) 0%, transparent 25%),
                 linear-gradient(to top, rgba(10,8,4,.55) 0%, transparent 55%);
    }
    @media(max-width:900px){
      .hero-img-overlay {
        background:linear-gradient(to bottom, transparent 60%, var(--bg) 100%);
      }
    }
    .hero-img-caption {
      position:absolute; bottom:1.5rem; left:1.5rem;
      font-size:.55rem; font-weight:500; letter-spacing:.22em;
      text-transform:uppercase; color:rgba(255,255,255,.55);
      background:rgba(0,0,0,.25); padding:.3rem .7rem;
      backdrop-filter:blur(6px);
    }
    @media(max-width:900px){ .hero-img-caption { font-size:.5rem; } }
    .hero-scroll {
      position:absolute; bottom:2rem; left:6vw; z-index:5;
      display:flex; flex-direction:column; align-items:center; gap:.5rem;
    }
    @media(max-width:900px){ .hero-scroll { display:none; } }
    .hs-text {
      font-size:.5rem; letter-spacing:.3em; text-transform:uppercase;
      color:var(--muted); writing-mode:vertical-rl;
    }
    .hero-bottom-line {
      position:absolute; bottom:0; left:0; right:0;
      height:2px; background:var(--gold); transform-origin:left;
    }

    /* ── MARQUEE ── */
    .marquee-wrap {
      background:var(--gold); overflow:hidden; padding:.8rem 0;
    }
    .marquee-track {
      display:flex; white-space:nowrap;
      animation:mqroll 30s linear infinite;
    }
    @keyframes mqroll { from{transform:translateX(0)} to{transform:translateX(-50%)} }
    .mq-item {
      font-size:.58rem; font-weight:600; letter-spacing:.25em;
      text-transform:uppercase; color:var(--dark);
      padding:0 2rem; display:inline-flex; align-items:center; gap:2rem;
    }
    .mq-dot { width:3px; height:3px; border-radius:50%; background:var(--dark); opacity:.4; }

    /* ── SECTION COMMONS ── */
    .sec-tag {
      font-size:.58rem; font-weight:600; letter-spacing:.3em;
      text-transform:uppercase; color:var(--gold);
      display:flex; align-items:center; gap:.75rem; margin-bottom:1.6rem;
    }
    .sec-tag::before { content:''; width:20px; height:1px; background:var(--gold); flex-shrink:0; }
    .sec-h2 {
      font-family:'Playfair Display',serif;
      font-size:clamp(2rem,4vw,4.5rem); font-weight:700;
      line-height:1.05; letter-spacing:-.02em; color:var(--ink);
    }
    .sec-h2 em { font-style:italic; color:var(--gold); }

    /* ── ABOUT ── */
    .about {
      padding:8rem 6vw; display:grid;
      grid-template-columns:1fr 1fr; gap:5rem; align-items:center;
    }
    @media(max-width:900px){
      .about { grid-template-columns:1fr; padding:5rem 6vw; gap:3.5rem; }
    }

    /* Mosaic */
    .mosaic {
      display:grid;
      grid-template-columns:1fr 1fr;
      grid-template-rows:320px 180px;
      gap:10px; position:relative;
    }
    @media(max-width:480px){
      .mosaic { grid-template-rows:240px 140px; }
    }
    .mos-a {
      grid-row:1/3; overflow:hidden; position:relative;
    }
    .mos-b, .mos-c { overflow:hidden; position:relative; }
    .mosaic img {
      width:100%; height:100%; object-fit:cover; object-position:top center;
      transition:transform .6s ease;
    }
    .mos-a:hover img, .mos-b:hover img, .mos-c:hover img { transform:scale(1.04); }
    .mos-lbl {
      position:absolute; bottom:.7rem; left:.7rem;
      font-size:.52rem; font-weight:500; letter-spacing:.2em;
      text-transform:uppercase; color:rgba(255,255,255,.75);
      background:rgba(0,0,0,.3); padding:.25rem .6rem;
      backdrop-filter:blur(4px);
    }
    .mos-bar {
      position:absolute; bottom:0; left:0; width:0; height:2px;
      background:var(--gold); transition:width .5s;
    }
    .mos-a:hover .mos-bar, .mos-b:hover .mos-bar, .mos-c:hover .mos-bar { width:100%; }
    .mos-quote {
      position:absolute; bottom:-1.2rem; right:-1.2rem;
      background:var(--ink); padding:1.6rem 1.4rem;
      width:clamp(160px,55%,220px); z-index:5;
    }
    @media(max-width:480px){
      .mos-quote { position:static; width:100%; margin-top:.5rem; }
    }
    .mos-q-text {
      font-family:'Playfair Display',serif;
      font-size:.9rem; font-style:italic; font-weight:400;
      color:rgba(255,255,255,.9); line-height:1.5; margin-bottom:.8rem;
    }
    .mos-q-by {
      font-size:.52rem; font-weight:600; letter-spacing:.2em;
      text-transform:uppercase; color:var(--gold);
    }

    /* About body */
    .about-body {}
    .about-body p {
      font-size:.92rem; font-weight:300; line-height:1.9;
      color:var(--muted); margin-bottom:1.3rem;
    }
    .pills {
      display:flex; flex-wrap:wrap; gap:.5rem; margin:1.8rem 0;
    }
    .pill {
      font-size:.58rem; font-weight:500; letter-spacing:.1em;
      text-transform:uppercase; padding:.4rem .9rem;
      border:1px solid var(--border); color:var(--muted);
      transition:all .25s;
    }
    .pill:hover { border-color:var(--gold); color:var(--gold); }

    /* ── STATS ── */
    .stats {
      background:var(--dark); border-top:2px solid var(--gold);
      display:grid; grid-template-columns:repeat(4,1fr);
    }
    @media(max-width:700px){
      .stats { grid-template-columns:repeat(2,1fr); }
    }
    .stat {
      text-align:center; padding:3.5rem 1.5rem;
      border-right:1px solid rgba(255,255,255,.06);
    }
    .stat:last-child { border-right:none; }
    @media(max-width:700px){
      .stat:nth-child(2) { border-right:none; }
    }
    .stat-n {
      font-family:'Playfair Display',serif;
      font-size:3.5rem; font-weight:700; color:var(--gold2); line-height:1;
    }
    .stat-l {
      font-size:.58rem; font-weight:500; letter-spacing:.2em;
      text-transform:uppercase; color:rgba(255,255,255,.3); margin-top:.5rem;
    }

    /* ── MINISTRIES ── */
    .ministries {
      display:grid; grid-template-columns:1fr 1fr;
    }
    @media(max-width:768px){
      .ministries { grid-template-columns:1fr; }
    }
    .min-panel {
      padding:7rem 5vw; display:flex; flex-direction:column;
      justify-content:flex-end; position:relative; overflow:hidden;
      min-height:80vh;
    }
    @media(max-width:768px){ .min-panel { min-height:auto; padding:5rem 6vw; } }
    .min-pv { background:var(--navy); }
    .min-sh { background:#1A1008; }
    .min-bg {
      position:absolute; top:2rem; right:2rem;
      font-family:'Playfair Display',serif; font-size:10rem; font-weight:900;
      color:rgba(255,255,255,.025); line-height:1; pointer-events:none;
      user-select:none;
    }
    @media(max-width:480px){ .min-bg { font-size:6rem; } }
    .min-tag {
      font-size:.56rem; font-weight:600; letter-spacing:.3em;
      text-transform:uppercase; color:var(--gold);
      display:flex; align-items:center; gap:.7rem; margin-bottom:1.3rem;
    }
    .min-tag::before { content:''; width:18px; height:1px; background:var(--gold); }
    .min-h3 {
      font-family:'Playfair Display',serif;
      font-size:clamp(1.8rem,3.5vw,3.2rem); font-weight:700;
      color:#fff; line-height:1.1; margin-bottom:1rem;
    }
    .min-h3 em { font-style:italic; color:var(--gold2); }
    .min-p {
      font-size:.85rem; font-weight:300; line-height:1.85;
      color:rgba(255,255,255,.45); max-width:400px; margin-bottom:1.8rem;
    }
    .min-facts { display:flex; gap:2rem; margin-bottom:2rem; flex-wrap:wrap; }
    .mf-n {
      font-family:'Playfair Display',serif;
      font-size:2rem; font-weight:700; color:var(--gold2); line-height:1;
    }
    .mf-l {
      font-size:.52rem; font-weight:500; letter-spacing:.18em;
      text-transform:uppercase; color:rgba(255,255,255,.3); margin-top:.3rem;
    }
    .min-btn {
      font-size:.6rem; font-weight:600; letter-spacing:.18em;
      text-transform:uppercase; color:#fff;
      border:1px solid rgba(255,255,255,.18); padding:.75rem 1.6rem;
      text-decoration:none; cursor:none; transition:all .3s;
      display:inline-block; align-self:flex-start;
    }
    .min-btn:hover { border-color:var(--gold); background:rgba(196,154,42,.1); }
    @media(max-width:768px){ .min-btn { cursor:auto; } }

    /* ── VIDEOS ── */
    .videos { padding:8rem 6vw; background:var(--surface); }
    @media(max-width:768px){ .videos { padding:5rem 6vw; } }
    .videos-hd { margin-bottom:3.5rem; }
    .vids-grid {
      display:grid; grid-template-columns:1.5fr 1fr 1fr; gap:1.5rem;
    }
    @media(max-width:1024px){ .vids-grid { grid-template-columns:1fr 1fr; } }
    @media(max-width:640px){ .vids-grid { grid-template-columns:1fr; } }
    .vid-card {
      background:var(--bg); border:1px solid var(--border);
      overflow:hidden; transition:border-color .3s, transform .3s, box-shadow .3s;
      cursor:none;
    }
    .vid-card:hover {
      border-color:var(--gold); transform:translateY(-5px);
      box-shadow:0 20px 50px rgba(196,154,42,.1);
    }
    @media(max-width:768px){ .vid-card { cursor:auto; transform:none!important; } }
    .vid-frame { width:100%; aspect-ratio:16/9; display:block; border:0; }
    .vid-info { padding:1.3rem 1.4rem; }
    .vid-tag {
      font-size:.52rem; font-weight:600; letter-spacing:.22em;
      text-transform:uppercase; color:var(--gold); display:block; margin-bottom:.5rem;
    }
    .vid-title {
      font-family:'Playfair Display',serif;
      font-size:1rem; font-weight:500; line-height:1.3;
      color:var(--ink); margin-bottom:.4rem;
    }
    .vid-src { font-size:.68rem; color:var(--muted); font-weight:300; }

    /* ── BOOKS ── */
    .books { padding:8rem 6vw; background:var(--bg); }
    @media(max-width:768px){ .books { padding:5rem 6vw; } }
    .books-grid {
      display:grid; grid-template-columns:repeat(3,1fr);
      gap:0; margin-top:3.5rem;
      border:1px solid var(--border);
    }
    @media(max-width:900px){ .books-grid { grid-template-columns:1fr; } }
    .bk {
      padding:2.8rem 2.2rem; border-right:1px solid var(--border);
      transition:background .3s; cursor:none; position:relative; overflow:hidden;
    }
    .bk:last-child { border-right:none; }
    @media(max-width:900px){
      .bk { border-right:none; border-bottom:1px solid var(--border); }
      .bk:last-child { border-bottom:none; }
    }
    .bk:hover { background:var(--surface); }
    .bk::before {
      content:''; position:absolute; top:0; left:0;
      width:0; height:3px; background:var(--gold); transition:width .5s;
    }
    .bk:hover::before { width:100%; }
    @media(max-width:768px){ .bk { cursor:auto; } }
    .bk-num {
      font-family:'Playfair Display',serif;
      font-size:4rem; font-weight:900; line-height:1;
      color:var(--border); margin-bottom:1.2rem; transition:color .3s;
    }
    .bk:hover .bk-num { color:var(--gold); opacity:.25; }
    .bk-tag {
      font-size:.52rem; font-weight:600; letter-spacing:.25em;
      text-transform:uppercase; color:var(--gold); margin-bottom:.7rem;
    }
    .bk-title {
      font-family:'Playfair Display',serif;
      font-size:1.3rem; font-weight:600; line-height:1.2;
      color:var(--ink); margin-bottom:.9rem;
    }
    .bk-desc {
      font-size:.8rem; font-weight:300; line-height:1.75;
      color:var(--muted); margin-bottom:1.4rem;
    }
    .bk-link {
      font-size:.58rem; font-weight:600; letter-spacing:.18em;
      text-transform:uppercase; color:var(--ink);
      text-decoration:none; display:inline-flex; align-items:center; gap:.4rem;
      cursor:none; transition:color .3s;
    }
    .bk-link:hover { color:var(--gold); }
    @media(max-width:768px){ .bk-link { cursor:auto; } }

    /* ── SPEAKING ── */
    .speaking { padding:8rem 6vw; background:var(--dark); }
    @media(max-width:768px){ .speaking { padding:5rem 6vw; } }
    .sp-inner {
      display:grid; grid-template-columns:1fr 1.4fr;
      gap:7rem; align-items:start;
    }
    @media(max-width:900px){
      .sp-inner { grid-template-columns:1fr; gap:3.5rem; }
    }
    .sp-aside { position:sticky; top:8rem; }
    @media(max-width:900px){ .sp-aside { position:static; } }
    .sp-aside .sec-tag { color:var(--gold); }
    .sp-aside .sec-h2 { color:#fff; }
    .sp-quote {
      margin-top:2.5rem; border-left:2px solid var(--gold); padding-left:1.4rem;
    }
    .sp-qt {
      font-family:'Playfair Display',serif;
      font-size:1.05rem; font-style:italic; font-weight:400;
      color:rgba(255,255,255,.7); line-height:1.6; margin-bottom:.8rem;
    }
    .sp-qby {
      font-size:.55rem; font-weight:600; letter-spacing:.2em;
      text-transform:uppercase; color:var(--gold);
    }
    .ev-list { display:flex; flex-direction:column; }
    .ev {
      display:grid; grid-template-columns:65px 1fr; gap:1.5rem;
      padding:1.6rem 0; border-bottom:1px solid rgba(255,255,255,.06);
      transition:border-color .3s;
    }
    .ev:hover { border-color:var(--gold); }
    .ev-date { text-align:center; padding-top:.2rem; }
    .ev-day {
      font-family:'Playfair Display',serif;
      font-size:2.4rem; font-weight:700; color:var(--gold2); line-height:1;
    }
    .ev-mon {
      font-size:.5rem; font-weight:600; letter-spacing:.2em;
      text-transform:uppercase; color:rgba(255,255,255,.25);
    }
    .ev-name {
      font-family:'Playfair Display',serif;
      font-size:1.05rem; font-weight:500; color:#fff;
      margin-bottom:.35rem; line-height:1.25;
    }
    .ev-meta {
      font-size:.68rem; color:rgba(255,255,255,.3);
      display:flex; gap:.7rem; flex-wrap:wrap;
    }
    .ev-type { color:var(--gold); }

    /* ── CONTACT ── */
    .contact { padding:8rem 6vw; background:var(--bg); }
    @media(max-width:768px){ .contact { padding:5rem 6vw; } }
    .ct-inner {
      display:grid; grid-template-columns:1fr 1.2fr;
      gap:7rem; align-items:start;
    }
    @media(max-width:900px){
      .ct-inner { grid-template-columns:1fr; gap:3.5rem; }
    }
    .ct-photo {
      width:100%; aspect-ratio:4/5; object-fit:cover;
      object-position:top; filter:grayscale(10%) contrast(1.05);
    }
    @media(max-width:900px){
      .ct-photo { aspect-ratio:16/9; object-position:center top; max-height:400px; }
    }
    .ct-detail { display:flex; gap:.9rem; align-items:flex-start; margin-bottom:1.3rem; }
    .ct-icon {
      width:32px; height:32px; flex-shrink:0;
      border:1px solid var(--border);
      display:flex; align-items:center; justify-content:center;
      font-size:.65rem; color:var(--gold);
    }
    .ct-lbl {
      font-size:.52rem; font-weight:600; letter-spacing:.2em;
      text-transform:uppercase; color:var(--muted); margin-bottom:.2rem;
    }
    .ct-val { font-size:.82rem; color:var(--ink); font-weight:300; }
    .cform { display:flex; flex-direction:column; gap:.9rem; margin-top:2rem; }
    .crow { display:grid; grid-template-columns:1fr 1fr; gap:.9rem; }
    @media(max-width:480px){ .crow { grid-template-columns:1fr; } }
    .cfg { display:flex; flex-direction:column; gap:.35rem; }
    .cfl {
      font-size:.52rem; font-weight:600; letter-spacing:.18em;
      text-transform:uppercase; color:var(--muted);
    }
    .cfi, .cfs, .cfta {
      background:var(--surface); border:1px solid var(--border);
      padding:.8rem .9rem; font-family:'Outfit',sans-serif;
      font-size:.82rem; font-weight:300; color:var(--ink);
      outline:none; width:100%; transition:border-color .3s;
      -webkit-appearance:none; border-radius:0;
    }
    .cfi:focus, .cfs:focus, .cfta:focus { border-color:var(--gold); }
    .cfta { min-height:100px; resize:vertical; }
    .cfbtn {
      font-size:.62rem; font-weight:600; letter-spacing:.2em;
      text-transform:uppercase; background:var(--ink); color:#fff;
      padding:.9rem 2.2rem; border:none; cursor:none;
      font-family:'Outfit',sans-serif; transition:background .3s;
      align-self:flex-start; -webkit-appearance:none;
    }
    .cfbtn:hover { background:var(--gold); color:var(--ink); }
    @media(max-width:768px){ .cfbtn { cursor:auto; width:100%; text-align:center; } }
    .sent-box {
      margin-top:2rem; padding:2.5rem; background:var(--surface);
      border:1px solid var(--border); text-align:center;
    }
    .sent-icon {
      font-family:'Playfair Display',serif;
      font-size:2.5rem; color:var(--gold); margin-bottom:.8rem;
    }
    .sent-title {
      font-family:'Playfair Display',serif;
      font-size:1.4rem; margin-bottom:.5rem;
    }
    .sent-sub { font-size:.8rem; color:var(--muted); font-weight:300; }

    /* ── FOOTER ── */
    .footer { background:var(--ink); padding:5rem 6vw 2.5rem; }
    @media(max-width:768px){ .footer { padding:4rem 6vw 2rem; } }
    .ft-top {
      display:grid; grid-template-columns:2fr 1fr 1fr 1fr;
      gap:3rem; padding-bottom:3.5rem;
      border-bottom:1px solid rgba(255,255,255,.07); margin-bottom:2rem;
    }
    @media(max-width:900px){ .ft-top { grid-template-columns:1fr 1fr; gap:2.5rem; } }
    @media(max-width:480px){ .ft-top { grid-template-columns:1fr; gap:2rem; } }
    .ft-brand {
      font-family:'Playfair Display',serif;
      font-size:1.2rem; font-weight:700; color:#fff; margin-bottom:.8rem;
    }
    .ft-brand em { font-style:italic; color:var(--gold); }
    .ft-tag {
      font-size:.75rem; font-weight:300; line-height:1.7;
      color:rgba(255,255,255,.28); margin-bottom:1.5rem;
    }
    .ft-ch {
      font-size:.52rem; font-weight:600; letter-spacing:.28em;
      text-transform:uppercase; color:var(--gold); margin-bottom:1.2rem;
    }
    .ftl {
      display:block; font-size:.75rem; font-weight:300;
      color:rgba(255,255,255,.28); text-decoration:none;
      margin-bottom:.6rem; transition:color .25s; cursor:none;
    }
    .ftl:hover { color:#fff; }
    @media(max-width:768px){ .ftl { cursor:auto; } }
    .ft-bottom {
      display:flex; justify-content:space-between; align-items:center;
      flex-wrap:wrap; gap:1rem;
    }
    .ft-copy {
      font-size:.62rem; color:rgba(255,255,255,.18); letter-spacing:.05em;
    }
    .ft-sep { width:28px; height:1px; background:var(--gold); opacity:.3; }
  `}</style>
);

// ── CURSOR ────────────────────────────────────────────────────────────────────
function Cursor() {
  const mx = useMotionValue(-100), my = useMotionValue(-100);
  const rx = useSpring(mx,{stiffness:180,damping:20});
  const ry = useSpring(my,{stiffness:180,damping:20});
  useEffect(() => {
    const fn = e => { mx.set(e.clientX); my.set(e.clientY); };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);
  return (<>
    <motion.div className="cur-dot" style={{left:mx,top:my}}/>
    <motion.div className="cur-ring" style={{left:rx,top:ry}}/>
  </>);
}

// ── REVEAL ────────────────────────────────────────────────────────────────────
function R({children,delay=0,y=32,x=0,className=""}) {
  const ref = useRef(null);
  const v = useInView(ref,{once:true,margin:"-50px"});
  return (
    <motion.div ref={ref} className={className}
      initial={{opacity:0,y,x}}
      animate={v?{opacity:1,y:0,x:0}:{}}
      transition={{duration:.85,delay,ease:[.22,1,.36,1]}}
    >{children}</motion.div>
  );
}

// ── NAV ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [bg,setBg]=useState(false);
  const [open,setOpen]=useState(false);
  useEffect(()=>{
    const fn=()=>setBg(window.scrollY>40);
    window.addEventListener("scroll",fn);
    return ()=>window.removeEventListener("scroll",fn);
  },[]);
  const links=["About","Ministries","Videos","Books","Speaking","Contact"];
  return (<>
    <motion.header className={`nav${bg?" bg":""}`}
      initial={{y:-80,opacity:0}} animate={{y:0,opacity:1}}
      transition={{duration:.7,ease:[.22,1,.36,1]}}
    >
      <a className="logo" href="#home">Dr. Kunle <em>Hamilton</em></a>
      <nav className="nav-links">
        {links.map(l=><a key={l} className="nl" href={`#${l.toLowerCase()}`}>{l}</a>)}
        <a className="nav-cta" href="#contact">Book a Session</a>
      </nav>
      <button className="hamburger" onClick={()=>setOpen(!open)} aria-label="Menu">
        <div className="ham-line" style={open?{transform:"rotate(45deg) translate(5px,5px)"}:{}}/>
        <div className="ham-line" style={open?{opacity:0}:{}}/>
        <div className="ham-line" style={open?{transform:"rotate(-45deg) translate(5px,-5px)"}:{}}/>
      </button>
    </motion.header>

    <AnimatePresence>
      {open && (
        <motion.div className="mobile-menu"
          initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}}
          exit={{opacity:0,y:-20}} transition={{duration:.3}}
        >
          {links.map(l=>(
            <a key={l} href={`#${l.toLowerCase()}`} onClick={()=>setOpen(false)}>{l}</a>
          ))}
          <div className="mobile-gold-line"/>
          <a className="nav-cta mob-cta" href="#contact" onClick={()=>setOpen(false)}>
            Book a Session
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  </>);
}

// ── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  const {scrollY}=useScroll();
  const imgY=useTransform(scrollY,[0,600],[0,70]);
  return (
    <section className="hero" id="home">
      <div className="hero-left">
        <motion.div className="hero-tag"
          initial={{opacity:0,x:-24}} animate={{opacity:1,x:0}}
          transition={{duration:.7,delay:.4}}
        >
          <span className="hero-tag-line"/>
          Prophet · Scholar · Shepherd · Author
        </motion.div>
        <motion.h1 className="hero-h1"
          initial={{opacity:0,y:60}} animate={{opacity:1,y:0}}
          transition={{duration:1,delay:.55,ease:[.22,1,.36,1]}}
        >
          <span className="light">Dr. Kunle</span>
          <span className="gold">Hamilton</span>
        </motion.h1>
        <motion.div className="hero-rule"
          initial={{scaleX:0}} animate={{scaleX:1}}
          transition={{duration:1.2,delay:.9,ease:[.22,1,.36,1]}}
        />
        <motion.p style={{fontSize:"clamp(.85rem,1.5vw,1rem)",fontWeight:300,lineHeight:1.85,color:"var(--muted)",maxWidth:460,marginBottom:"2.5rem"}}
          initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
          transition={{duration:.8,delay:1}}
        >
          A voice that bridges faith, scholarship and culture. Prophet, media veteran, international author and founder of CCC PraiseVille &amp; ShaddaiVille Ministries — transforming lives across five nations.
        </motion.p>
        <motion.div className="hero-actions"
          initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
          transition={{duration:.8,delay:1.1}}
        >
          <a className="btn-solid" href="#about">Discover His Legacy</a>
          <a className="btn-outline" href="#videos">Watch Teachings</a>
        </motion.div>
        <div className="hero-scroll">
          <span className="hs-text">Scroll</span>
          <motion.div style={{width:1,height:48,background:"var(--gold)",transformOrigin:"top"}}
            animate={{scaleY:[0,1,0]}}
            transition={{duration:2,repeat:Infinity,ease:"easeInOut"}}
          />
        </div>
      </div>

      <motion.div className="hero-right" style={{y:imgY}}>
        <img src={IMG_HERO} alt="Dr. Kunle Hamilton in ministry" className="hero-img" />
        <div className="hero-img-overlay"/>
        <div className="hero-img-caption">Senior Shepherd · CCC PraiseVille Global</div>
      </motion.div>

      <motion.div className="hero-bottom-line"
        initial={{scaleX:0}} animate={{scaleX:1}}
        transition={{duration:1.5,delay:1.3,ease:[.22,1,.36,1]}}
      />
    </section>
  );
}

// ── MARQUEE ───────────────────────────────────────────────────────────────────
const MQ_ITEMS=["Prophet","Scholar","Media Veteran","Author","Shepherd","PraiseVille Global","ShaddaiVille International","Discipleship","Leadership","Faith","Nigeria · Germany · UK · USA"];
function Marquee() {
  const all=[...MQ_ITEMS,...MQ_ITEMS];
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {all.map((t,i)=>(
          <span key={i} className="mq-item">{t}<span className="mq-dot"/></span>
        ))}
      </div>
    </div>
  );
}

// ── ABOUT ─────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section className="about" id="about">
      <R x={-36} y={0}>
        <div className="mosaic">
          <div className="mos-a">
            <img src={IMG_HERO} alt="Dr. Kunle Hamilton" />
            <div className="mos-lbl">Prophet · Shepherd</div>
            <div className="mos-bar"/>
          </div>
          <div className="mos-b">
            <img src={IMG_TEACHING} alt="Dr. Kunle Hamilton teaching" />
            <div className="mos-lbl">In Ministry</div>
            <div className="mos-bar"/>
          </div>
          <div className="mos-c">
            <img src={IMG_FORMAL} alt="Dr. Kunle Hamilton" />
            <div className="mos-lbl">CCC PraiseVille</div>
            <div className="mos-bar"/>
          </div>
          <div className="mos-quote">
            <div className="mos-q-text">"If God had not arrested me with the drama of the Celestial Church, He would have lost me to atheism."</div>
            <div className="mos-q-by">— Dr. Kunle Hamilton</div>
          </div>
        </div>
      </R>
      <div className="about-body">
        <R><div className="sec-tag">The Man Behind the Ministry</div></R>
        <R delay={.1}><h2 className="sec-h2">A Philosopher<br/>Who Found <em>God.</em></h2></R>
        <R delay={.2}>
          <p style={{marginTop:"1.5rem"}}>Dr. Kunle Hamilton is one of Nigeria's most remarkable multi-disciplinary voices — a Prophet of the Celestial Church of Christ, veteran journalist, media executive, reputation management expert, international author, and transformative spiritual leader whose reach spans four continents.</p>
          <p>A Philosophy first-class graduate (Best Student, 1985) and Mass Communication scholar from the University of Lagos, Dr. Hamilton fuses rigorous academic thought with prophetic grace. His ministry is defined by discipleship, nation-building, and the empowerment of the next generation.</p>
        </R>
        <R delay={.3}>
          <div className="pills">
            {["Prophet · CCC","Philosophy BA — UNILAG","M.Sc. Mass Comm.","Veteran Journalist","Reputation Manager","International Author","CEO — Virgin Outdoor","18 Countries Published"].map(p=>(
              <span key={p} className="pill">{p}</span>
            ))}
          </div>
        </R>
        <R delay={.4}>
          <a className="btn-solid" href="#contact" style={{display:"inline-block"}}>Connect with Dr. Hamilton</a>
        </R>
      </div>
    </section>
  );
}

// ── STATS ─────────────────────────────────────────────────────────────────────
function Stats() {
  return (
    <div className="stats">
      {[{n:"40+",l:"Years in Ministry"},{n:"5",l:"Nations of Impact"},{n:"2",l:"Thriving Ministries"},{n:"18",l:"Countries Published"}].map((s,i)=>(
        <motion.div key={i} className="stat"
          initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}}
          viewport={{once:true}} transition={{delay:i*.1,duration:.7}}
        >
          <div className="stat-n">{s.n}</div>
          <div className="stat-l">{s.l}</div>
        </motion.div>
      ))}
    </div>
  );
}

// ── MINISTRIES ────────────────────────────────────────────────────────────────
function Ministries() {
  return (
    <section className="ministries" id="ministries">
      <R x={-28} y={0}>
        <div className="min-panel min-pv">
          <div className="min-bg">PV</div>
          <div className="min-tag">Celestial Church of Christ</div>
          <h3 className="min-h3">CCC <em>PraiseVille</em><br/>Global</h3>
          <p className="min-p">Founded in Berlin, Germany on May 8, 2016 and now flourishing across Nigeria, UK, USA and Germany. A place of authentic worship, genuine prophecy, and deep fellowship.</p>
          <div className="min-facts">
            <div><div className="mf-n">4+</div><div className="mf-l">Countries</div></div>
            <div><div className="mf-n">2016</div><div className="mf-l">Founded</div></div>
            <div><div className="mf-n">7+</div><div className="mf-l">Festival of Word</div></div>
          </div>
          <a className="min-btn" href="#contact">Visit PraiseVille →</a>
        </div>
      </R>
      <R x={28} y={0}>
        <div className="min-panel min-sh">
          <div className="min-bg">SV</div>
          <div className="min-tag">Non-Denominational · Global Training</div>
          <h3 className="min-h3">ShaddaiVille<br/><em>Ministries</em><br/>International</h3>
          <p className="min-p">"God's City" — training Christians and Muslims in UK-certified leadership and entrepreneurship since 2007. Free of charge. Branches in Nigeria, USA, UK, Germany and Canada.</p>
          <div className="min-facts">
            <div><div className="mf-n">5</div><div className="mf-l">Nations</div></div>
            <div><div className="mf-n">2007</div><div className="mf-l">Founded</div></div>
            <div><div className="mf-n">UK</div><div className="mf-l">Certified</div></div>
          </div>
          <a className="min-btn" href="#contact">Explore ShaddaiVille →</a>
        </div>
      </R>
    </section>
  );
}

// ── VIDEOS ────────────────────────────────────────────────────────────────────
function Videos() {
  const vids=[
    {url:"https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fcelestial.focus%2Fvideos%2F1356642479037237&show_text=false",tag:"Discipleship · Teaching",title:"Dr. Kunle Hamilton Teaches Discipleship",src:"CelestialFocus · Facebook"},
    {url:"https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fhephzibahtelevision%2Fvideos%2F449065333576250&show_text=false",tag:"Leadership · Interview",title:"Meeting with Dr. Hamilton — The Roles of Leadership",src:"Hephzibah Television · Facebook"},
    {url:"https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fcelestial.focus%2Fvideos%2F1241668604555889&show_text=false",tag:"Worship · Celebration",title:"Christmas — CCC PraiseVille Highlight",src:"CelestialFocus · Facebook"},
  ];
  return (
    <section className="videos" id="videos">
      <div className="videos-hd">
        <R><div className="sec-tag">Teachings, Sermons & Interviews</div></R>
        <R delay={.1}><h2 className="sec-h2">Watch Dr. Hamilton<br/><em>In Action</em></h2></R>
      </div>
      <div className="vids-grid">
        {vids.map((v,i)=>(
          <R key={i} delay={i*.12}>
            <div className="vid-card">
              <iframe className="vid-frame" src={v.url}
                scrolling="no" frameBorder="0" allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title={v.title}
              />
              <div className="vid-info">
                <span className="vid-tag">{v.tag}</span>
                <div className="vid-title">{v.title}</div>
                <div className="vid-src">{v.src}</div>
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
  const bks=[
    {tag:"Leadership",title:"Releasing the Eagle in You",desc:"An eight-chapter inspirational work on leadership and self-actualization — a guide to unlocking the greatness God placed within every person. Published internationally in 18 countries."},
    {tag:"Philosophy",title:"Journey to Understanding",desc:"A philosophical investigation of how style and content impact the spoken word, using the church and Raypower 100.5 FM as its remarkable canvas."},
    {tag:"Ministry",title:"The ShaddaiVille Vision",desc:"Dr. Hamilton's framework for discipleship-driven ministry that transcends denominational walls — building leaders, entrepreneurs and moral beacons across nations."},
  ];
  return (
    <section className="books" id="books">
      <R><div className="sec-tag">Written Works</div></R>
      <R delay={.1}><h2 className="sec-h2">Books &amp; <em>Publications</em></h2></R>
      <div className="books-grid">
        {bks.map((b,i)=>(
          <R key={i} delay={i*.12}>
            <div className="bk">
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
  const evs=[
    {d:"12",m:"Apr",name:"Festival of the Word — Annual Harvest",loc:"Lagos, Nigeria",type:"Worship & Teaching"},
    {d:"03",m:"May",name:"ShaddaiVille UK Leadership Retreat",loc:"London, United Kingdom",type:"Leadership Academy"},
    {d:"21",m:"Jun",name:"Teenagers' Motivational Summit",loc:"Berlin, Germany",type:"Youth Empowerment"},
    {d:"08",m:"Aug",name:"Ephphatha Non-Denominational Crusade",loc:"Lagos, Nigeria",type:"Evangelism"},
    {d:"15",m:"Sep",name:"Media & Ministry — Public Lecture",loc:"University of Lagos",type:"Academic Talk"},
  ];
  return (
    <section className="speaking" id="speaking">
      <div className="sp-inner">
        <div className="sp-aside">
          <R><div className="sec-tag">Events & Engagements</div></R>
          <R delay={.1}><h2 className="sec-h2">Speaking &amp;<br/><em>Appearances</em></h2></R>
          <R delay={.2}>
            <div className="sp-quote">
              <div className="sp-qt">"The responsibility of religious leaders is to guide young people towards righteousness — not to encourage them to chase fame through questionable means."</div>
              <div className="sp-qby">— Dr. Kunle Hamilton</div>
            </div>
          </R>
          <R delay={.35}>
            <div style={{marginTop:"2rem"}}>
              <a className="btn-solid" href="#contact">Invite Dr. Hamilton</a>
            </div>
          </R>
        </div>
        <div className="ev-list">
          {evs.map((e,i)=>(
            <R key={i} delay={i*.1} x={28} y={0}>
              <div className="ev">
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
  const [f,setF]=useState({name:"",email:"",inquiry:"speaking",msg:""});
  const [sent,setSent]=useState(false);
  return (
    <section className="contact" id="contact">
      <div className="ct-inner">
        <R x={-28} y={0}>
          <img src={IMG_TEACHING} alt="Dr. Kunle Hamilton teaching" className="ct-photo"/>
        </R>
        <R delay={.15}>
          <div>
            <div className="sec-tag">Get in Touch</div>
            <h2 className="sec-h2">Let's <em>Connect</em></h2>
            <div style={{marginTop:"2rem"}}>
              {[
                {icon:"✦",lbl:"Ministry",val:"CCC PraiseVille Global · ShaddaiVille International"},
                {icon:"✦",lbl:"Based In",val:"Lagos, Nigeria · Berlin, Germany · London, UK"},
                {icon:"✦",lbl:"Media & PR",val:"Virgin Outdoor Communications, Lagos"},
              ].map((d,i)=>(
                <div className="ct-detail" key={i}>
                  <div className="ct-icon">{d.icon}</div>
                  <div><div className="ct-lbl">{d.lbl}</div><div className="ct-val">{d.val}</div></div>
                </div>
              ))}
            </div>
            {sent ? (
              <motion.div className="sent-box" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
                <div className="sent-icon">✦</div>
                <div className="sent-title">Message Received</div>
                <div className="sent-sub">Dr. Hamilton's team will be in touch shortly.</div>
              </motion.div>
            ) : (
              <form className="cform" onSubmit={e=>{e.preventDefault();setSent(true);}}>
                <div className="crow">
                  <div className="cfg"><label className="cfl">Full Name</label>
                    <input className="cfi" placeholder="Your name" value={f.name} onChange={e=>setF({...f,name:e.target.value})} required/></div>
                  <div className="cfg"><label className="cfl">Email</label>
                    <input className="cfi" type="email" placeholder="your@email.com" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required/></div>
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
                  <textarea className="cfta" placeholder="Your message..." value={f.msg} onChange={e=>setF({...f,msg:e.target.value})} required/></div>
                <button className="cfbtn" type="submit">Send Message →</button>
              </form>
            )}
          </div>
        </R>
      </div>
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
          <div className="ft-tag">Prophet · Scholar · Shepherd · Author · Media Veteran<br/>Serving God & humanity across five nations.</div>
          <div className="ft-sep"/>
        </div>
        <div>
          <div className="ft-ch">Main Site</div>
          {["About","Videos","Books","Speaking","Contact"].map(l=>(
            <a key={l} className="ftl" href={`#${l.toLowerCase()}`}>{l}</a>
          ))}
        </div>
        <div>
          <div className="ft-ch">CCC PraiseVille</div>
          {["About PraiseVille","Sunday Services","Festival of the Word","Pastoral Team","Join Us"].map(l=>(
            <a key={l} className="ftl" href="#ministries">{l}</a>
          ))}
        </div>
        <div>
          <div className="ft-ch">ShaddaiVille</div>
          {["About ShaddaiVille","Leadership Academy","Teens Academy","Outreach","Partner With Us"].map(l=>(
            <a key={l} className="ftl" href="#ministries">{l}</a>
          ))}
        </div>
      </div>
      <div className="ft-bottom">
        <div className="ft-copy">© 2025 Dr. Kunle Hamilton · All Rights Reserved</div>
        <div className="ft-sep"/>
        <div className="ft-copy">PraiseVille Global · ShaddaiVille Ministries International</div>
      </div>
    </footer>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────


export default function App() {
  return (<>
    <Styles/>
    <Cursor/>
    <Nav/>
    <Hero/>
    <Marquee/>
    <About/>
    <Stats/>
    <Ministries/>
    <Videos/>
    <Books/>
    <Speaking/>
    <Contact/>
    <Footer/>
  </>);
}
