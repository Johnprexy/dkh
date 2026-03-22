import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";

const P1 = "/dkh-hero.jpg";
const P2 = "/dkh-teaching.jpg";
const P3 = "/dkh-formal.jpg";

/* ─── FONTS + RESET ──────────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,400;0,600;0,700;0,800;0,900;1,300;1,700;1,900&family=Barlow:wght@300;400;500&display=swap');

    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --bg:     #141414;
      --bg2:    #1C1C1C;
      --bg3:    #222222;
      --white:  #FFFFFF;
      --off:    #E8E8E8;
      --muted:  #888888;
      --dim:    #555555;
      --yellow: #F2C94C;
      --yellow2:#FFD966;
      --line:   #2A2A2A;
    }

    html { scroll-behavior: smooth; overflow-x: hidden; }
    body {
      font-family: 'Barlow', sans-serif;
      background: var(--bg);
      color: var(--white);
      overflow-x: hidden;
      cursor: none;
    }
    @media (max-width: 768px) { body { cursor: auto; } }
    ::-webkit-scrollbar { width: 2px; }
    ::-webkit-scrollbar-thumb { background: var(--yellow); }

    /* CURSOR */
    .cd { position: fixed; width: 7px; height: 7px; background: var(--yellow); border-radius: 50%; pointer-events: none; z-index: 9999; transform: translate(-50%,-50%); }
    .cr { position: fixed; width: 34px; height: 34px; border: 1.5px solid rgba(242,201,76,.5); border-radius: 50%; pointer-events: none; z-index: 9998; transform: translate(-50%,-50%); }
    @media (max-width: 768px) { .cd, .cr { display: none; } }

    /* ── NAV ── */
    .nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 200;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 5vw; height: 70px;
      transition: background .4s, border-color .4s;
      border-bottom: 1px solid transparent;
    }
    .nav.s { background: rgba(20,20,20,.96); backdrop-filter: blur(20px); border-color: var(--line); }
    .logo {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 1.3rem; font-weight: 800; letter-spacing: .06em;
      text-transform: uppercase; color: var(--white); text-decoration: none; cursor: none;
    }
    .logo span { color: var(--yellow); }
    @media (max-width: 768px) { .logo { cursor: auto; } }
    .nav-links { display: flex; align-items: center; gap: 2.5rem; }
    @media (max-width: 900px) { .nav-links { display: none; } }
    .nl {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: .78rem; font-weight: 600; letter-spacing: .18em;
      text-transform: uppercase; color: var(--muted); text-decoration: none; cursor: none;
      transition: color .2s;
    }
    .nl:hover { color: var(--white); }
    .nav-btn {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: .75rem; font-weight: 700; letter-spacing: .18em;
      text-transform: uppercase; padding: .55rem 1.5rem;
      background: var(--yellow); color: var(--bg); cursor: none;
      text-decoration: none; transition: background .25s; display: inline-block;
    }
    .nav-btn:hover { background: var(--yellow2); }
    @media (max-width: 768px) { .nav-btn { cursor: auto; } }
    .ham { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
    @media (max-width: 900px) { .ham { display: flex; } }
    .hl { width: 22px; height: 1.5px; background: var(--white); border-radius: 2px; transition: transform .3s, opacity .3s; }
    .mob { position: fixed; inset: 0; background: var(--bg); z-index: 190; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; }
    .mob a { font-family: 'Barlow Condensed', sans-serif; font-size: 3rem; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; color: var(--white); text-decoration: none; transition: color .2s; }
    .mob a:hover { color: var(--yellow); }
    .mob-line { width: 40px; height: 2px; background: var(--yellow); }

    /* ── HERO ── */
    .hero {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
      position: relative;
      overflow: hidden;
      background: var(--bg);
    }
    @media (max-width: 900px) { .hero { grid-template-columns: 1fr; min-height: auto; } }

    /* Left text side */
    .hero-txt {
      display: flex; flex-direction: column; justify-content: center;
      padding: 0 6vw 0 7vw; position: relative; z-index: 2;
    }
    @media (max-width: 900px) { .hero-txt { padding: 8rem 6vw 4rem; order: 2; } }

    .hero-label {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: .72rem; font-weight: 700; letter-spacing: .35em;
      text-transform: uppercase; color: var(--yellow);
      display: flex; align-items: center; gap: .8rem;
      margin-bottom: 2rem;
    }
    .hero-label-dot { width: 5px; height: 5px; background: var(--yellow); border-radius: 50%; }

    /* The BIG name — Steven Furtick style: huge condensed stacked */
    .hero-name {
      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 900; line-height: .88;
      letter-spacing: -.01em;
      text-transform: uppercase;
    }
    .hero-name .line1 { font-size: clamp(3.5rem, 7vw, 8rem); color: var(--white); display: block; }
    .hero-name .line2 { font-size: clamp(3.5rem, 7vw, 8rem); color: var(--white); display: block; }
    .hero-name .line3 {
      font-size: clamp(3.5rem, 7vw, 8rem); color: var(--yellow); display: block;
      position: relative;
    }
    /* Yellow underline bar — Furtick signature move */
    .hero-name .line3::after {
      content: '';
      display: block; width: 100%; height: 5px;
      background: var(--yellow); margin-top: 4px;
    }
    @media (max-width: 480px) {
      .hero-name .line1, .hero-name .line2, .hero-name .line3 { font-size: clamp(3rem, 11vw, 5.5rem); }
    }

    .hero-roles {
      margin: 2.5rem 0;
      display: flex; flex-direction: column; gap: .5rem;
    }
    .hero-role {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 1rem; font-weight: 300; letter-spacing: .12em;
      text-transform: uppercase; color: var(--muted);
    }
    .hero-role strong { color: var(--off); font-weight: 600; }

    .hero-ctas { display: flex; gap: 1rem; flex-wrap: wrap; }
    .btn-y {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: .78rem; font-weight: 700; letter-spacing: .2em;
      text-transform: uppercase; background: var(--yellow); color: var(--bg);
      padding: .9rem 2.2rem; text-decoration: none; cursor: none;
      transition: background .25s; display: inline-block;
    }
    .btn-y:hover { background: var(--yellow2); }
    @media (max-width: 768px) { .btn-y { cursor: auto; } }
    .btn-w {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: .78rem; font-weight: 700; letter-spacing: .2em;
      text-transform: uppercase; border: 1.5px solid var(--dim); color: var(--off);
      padding: .9rem 2.2rem; text-decoration: none; cursor: none;
      transition: border-color .25s, color .25s; display: inline-block;
    }
    .btn-w:hover { border-color: var(--white); color: var(--white); }
    @media (max-width: 768px) { .btn-w { cursor: auto; } }

    /* Right photo side */
    .hero-img-wrap {
      position: relative; overflow: hidden; background: var(--bg2);
    }
    @media (max-width: 900px) { .hero-img-wrap { height: 70vw; max-height: 520px; order: 1; } }
    .hero-img {
      width: 100%; height: 100%; object-fit: cover;
      object-position: center top;
      filter: contrast(1.08) brightness(.95);
    }
    /* Gradient fade from left so text overlaps cleanly */
    .hero-img-fade {
      position: absolute; inset: 0;
      background: linear-gradient(to right, var(--bg) 0%, transparent 35%),
                  linear-gradient(to top, rgba(20,20,20,.6) 0%, transparent 40%);
    }
    @media (max-width: 900px) {
      .hero-img-fade { background: linear-gradient(to bottom, transparent 55%, var(--bg) 95%); }
    }
    /* Yellow tag bottom-left of photo */
    .hero-img-tag {
      position: absolute; bottom: 2rem; left: 2rem;
      background: var(--yellow); color: var(--bg);
      font-family: 'Barlow Condensed', sans-serif;
      font-size: .65rem; font-weight: 700; letter-spacing: .2em;
      text-transform: uppercase; padding: .45rem 1rem;
    }

    /* ── YELLOW BANNER STRIP ── Furtick-style full-width yellow bar */
    .strip {
      background: var(--yellow);
      padding: 1.1rem 7vw;
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 1rem;
      overflow: hidden;
    }
    .strip-items { display: flex; gap: 3rem; flex-wrap: wrap; align-items: center; }
    .strip-item {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: .75rem; font-weight: 700; letter-spacing: .25em;
      text-transform: uppercase; color: var(--bg);
      display: flex; align-items: center; gap: .7rem;
    }
    .strip-dot { width: 4px; height: 4px; background: rgba(20,20,20,.3); border-radius: 50%; }
    .strip-btn {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: .7rem; font-weight: 700; letter-spacing: .2em;
      text-transform: uppercase; padding: .55rem 1.4rem;
      background: var(--bg); color: var(--yellow);
      text-decoration: none; cursor: none; transition: background .2s;
      white-space: nowrap;
    }
    .strip-btn:hover { background: #222; }
    @media (max-width: 768px) { .strip-btn { cursor: auto; } }

    /* ── SECTION HELPERS ── */
    .stag {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: .72rem; font-weight: 700; letter-spacing: .3em;
      text-transform: uppercase; color: var(--yellow);
      display: flex; align-items: center; gap: .75rem;
      margin-bottom: 1.2rem;
    }
    .stag::before { content: ''; width: 24px; height: 2px; background: var(--yellow); flex-shrink: 0; }
    .sh2 {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: clamp(2.4rem, 5vw, 5.5rem); font-weight: 900;
      line-height: .92; letter-spacing: -.01em; text-transform: uppercase;
      color: var(--white);
    }
    .sh2 span { color: var(--yellow); }

    /* ── ABOUT ── */
    .about {
      display: grid; grid-template-columns: 1fr 1fr;
      background: var(--bg);
    }
    @media (max-width: 900px) { .about { grid-template-columns: 1fr; } }

    /* Photo side */
    .about-photo { position: relative; overflow: hidden; min-height: 650px; }
    @media (max-width: 900px) { .about-photo { min-height: 80vw; max-height: 560px; } }
    .about-photo img { width: 100%; height: 100%; object-fit: cover; object-position: top center; filter: contrast(1.05); }
    .about-photo-ov { position: absolute; inset: 0; background: linear-gradient(to top, rgba(20,20,20,.9) 0%, transparent 50%); }
    .about-photo-text { position: absolute; bottom: 0; left: 0; right: 0; padding: 2.5rem; }
    .about-quote {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 1.5rem; font-style: italic; font-weight: 300; line-height: 1.35;
      color: var(--white); margin-bottom: .8rem; border-left: 3px solid var(--yellow); padding-left: 1rem;
    }
    .about-quote-by {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: .65rem; font-weight: 700; letter-spacing: .25em;
      text-transform: uppercase; color: var(--yellow); padding-left: 1rem;
    }

    /* Text side */
    .about-body {
      padding: 7rem 6vw 7rem;
      display: flex; flex-direction: column; justify-content: center;
      border-left: 1px solid var(--line);
    }
    @media (max-width: 900px) { .about-body { border-left: none; border-top: 1px solid var(--line); padding: 5rem 6vw; } }
    .about-body p { font-size: .95rem; font-weight: 300; line-height: 1.9; color: var(--muted); margin-bottom: 1.2rem; }
    .about-body strong { color: var(--off); font-weight: 500; }
    .about-creds {
      margin: 2.5rem 0;
      display: grid; grid-template-columns: 1fr 1fr; gap: 0;
      border: 1px solid var(--line);
    }
    @media (max-width: 480px) { .about-creds { grid-template-columns: 1fr; } }
    .cred {
      padding: 1.2rem 1.4rem; border-right: 1px solid var(--line); border-bottom: 1px solid var(--line);
    }
    .cred:nth-child(2n) { border-right: none; }
    .cred:nth-last-child(-n+2) { border-bottom: none; }
    @media (max-width: 480px) { .cred { border-right: none; } .cred:last-child { border-bottom: none; } }
    .cred-title {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: .75rem; font-weight: 700; letter-spacing: .12em;
      text-transform: uppercase; color: var(--white); margin-bottom: .25rem;
    }
    .cred-sub { font-size: .75rem; font-weight: 300; color: var(--dim); line-height: 1.4; }

    /* ── STATS BAR ── */
    .stats {
      background: var(--bg2); border-top: 2px solid var(--yellow);
      display: grid; grid-template-columns: repeat(4, 1fr);
    }
    @media (max-width: 640px) { .stats { grid-template-columns: repeat(2, 1fr); } }
    .stat {
      padding: 3.5rem 2rem; text-align: center;
      border-right: 1px solid var(--line);
    }
    .stat:last-child { border-right: none; }
    @media (max-width: 640px) { .stat:nth-child(2) { border-right: none; } }
    .stat-n {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 4.5rem; font-weight: 900; line-height: 1;
      color: var(--yellow); letter-spacing: -.02em;
    }
    .stat-l {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: .68rem; font-weight: 700; letter-spacing: .2em;
      text-transform: uppercase; color: var(--dim); margin-top: .4rem;
    }

    /* ── MINISTRIES — full-width dark panels with photo ── */
    .ministries { background: var(--bg); }
    .min-header { padding: 7rem 7vw 4rem; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
    .min-grid { display: grid; grid-template-columns: 1fr 1fr; }
    @media (max-width: 768px) { .min-grid { grid-template-columns: 1fr; } }
    .min-panel {
      position: relative; overflow: hidden; min-height: 560px;
      display: flex; flex-direction: column; justify-content: flex-end;
      padding: 4rem 4vw; border-right: 1px solid var(--line);
      cursor: none; group: true;
    }
    .min-panel:last-child { border-right: none; }
    @media (max-width: 768px) { .min-panel { border-right: none; border-bottom: 1px solid var(--line); min-height: 420px; cursor: auto; } }
    .min-panel-bg {
      position: absolute; inset: 0;
      background: var(--bg2);
    }
    .min-panel-img {
      position: absolute; inset: 0; width: 100%; height: 100%;
      object-fit: cover; opacity: .18; transition: opacity .5s;
      filter: contrast(1.2);
    }
    .min-panel:hover .min-panel-img { opacity: .28; }
    .min-panel-ov { position: absolute; inset: 0; background: linear-gradient(to top, rgba(20,20,20,.98) 30%, rgba(20,20,20,.5) 100%); }
    .min-content { position: relative; z-index: 2; }
    .min-tag {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: .65rem; font-weight: 700; letter-spacing: .28em;
      text-transform: uppercase; color: var(--yellow); margin-bottom: 1rem;
    }
    .min-name {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: clamp(2rem, 4vw, 3.8rem); font-weight: 900;
      text-transform: uppercase; line-height: .9; color: var(--white);
      margin-bottom: 1.5rem; letter-spacing: -.01em;
    }
    .min-name span { color: var(--yellow); }
    .min-desc { font-size: .85rem; font-weight: 300; line-height: 1.8; color: var(--muted); margin-bottom: 1.8rem; max-width: 400px; }
    .min-facts { display: flex; gap: 2rem; margin-bottom: 2rem; }
    .mf-n { font-family: 'Barlow Condensed', sans-serif; font-size: 2rem; font-weight: 900; color: var(--yellow); line-height: 1; }
    .mf-l { font-family: 'Barlow Condensed', sans-serif; font-size: .6rem; font-weight: 600; letter-spacing: .15em; text-transform: uppercase; color: var(--dim); margin-top: .2rem; }
    .min-link {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: .7rem; font-weight: 700; letter-spacing: .2em;
      text-transform: uppercase; color: var(--yellow);
      text-decoration: none; display: inline-flex; align-items: center; gap: .5rem;
      cursor: none; transition: gap .25s;
    }
    .min-link:hover { gap: .9rem; }
    @media (max-width: 768px) { .min-link { cursor: auto; } }

    /* ── VIDEOS — video-first Furtick layout ── */
    .videos { background: var(--bg); border-top: 1px solid var(--line); }
    .videos-top {
      display: grid; grid-template-columns: 1fr 1fr;
      border-bottom: 1px solid var(--line);
    }
    @media (max-width: 768px) { .videos-top { grid-template-columns: 1fr; } }
    .videos-hd { padding: 5rem 7vw; display: flex; flex-direction: column; justify-content: center; }
    .videos-featured { border-left: 1px solid var(--line); overflow: hidden; }
    @media (max-width: 768px) { .videos-featured { border-left: none; border-top: 1px solid var(--line); } }
    .vf-frame { width: 100%; aspect-ratio: 16/9; display: block; border: none; }
    .vf-info { padding: 1.5rem 2rem; border-top: 1px solid var(--line); }
    .vf-tag {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: .62rem; font-weight: 700; letter-spacing: .25em;
      text-transform: uppercase; color: var(--yellow); display: block; margin-bottom: .5rem;
    }
    .vf-title {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 1.3rem; font-weight: 700; letter-spacing: .02em; text-transform: uppercase;
      color: var(--white); line-height: 1.2;
    }
    /* Secondary video grid */
    .videos-grid {
      display: grid; grid-template-columns: repeat(2, 1fr);
      border-top: none;
    }
    @media (max-width: 640px) { .videos-grid { grid-template-columns: 1fr; } }
    .vg-card {
      border-right: 1px solid var(--line); border-top: 1px solid var(--line);
      overflow: hidden; transition: background .25s; cursor: none;
    }
    .vg-card:nth-child(2n) { border-right: none; }
    .vg-card:hover { background: var(--bg2); }
    @media (max-width: 768px) { .vg-card { cursor: auto; } }
    .vg-frame { width: 100%; aspect-ratio: 16/9; display: block; border: none; }
    .vg-info { padding: 1.2rem 1.5rem; }
    .vg-tag {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: .58rem; font-weight: 700; letter-spacing: .22em;
      text-transform: uppercase; color: var(--yellow); margin-bottom: .4rem; display: block;
    }
    .vg-title {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 1.05rem; font-weight: 700; text-transform: uppercase;
      color: var(--white); line-height: 1.2;
    }
    .vg-src { font-size: .7rem; color: var(--dim); margin-top: .3rem; font-weight: 300; }

    /* ── BOOKS ── */
    .books { background: var(--bg); border-top: 1px solid var(--line); }
    .books-hd { padding: 6rem 7vw; border-bottom: 1px solid var(--line); }
    .books-grid { display: grid; grid-template-columns: repeat(3, 1fr); }
    @media (max-width: 900px) { .books-grid { grid-template-columns: 1fr; } }
    .bk {
      padding: 3.5rem 4vw; border-right: 1px solid var(--line);
      transition: background .25s; cursor: none; position: relative; overflow: hidden;
    }
    .bk:last-child { border-right: none; }
    .bk:hover { background: var(--bg2); }
    @media (max-width: 900px) { .bk { border-right: none; border-bottom: 1px solid var(--line); cursor: auto; } }
    /* Yellow top-bar on hover */
    .bk::before { content: ''; position: absolute; top: 0; left: 0; width: 0; height: 3px; background: var(--yellow); transition: width .45s; }
    .bk:hover::before { width: 100%; }
    .bk-num {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 5rem; font-weight: 900; color: var(--line); line-height: 1;
      margin-bottom: 1.5rem; letter-spacing: -.02em; transition: color .25s;
    }
    .bk:hover .bk-num { color: #2E2A1A; }
    .bk-tag {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: .62rem; font-weight: 700; letter-spacing: .25em;
      text-transform: uppercase; color: var(--yellow); margin-bottom: .7rem;
    }
    .bk-title {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 1.7rem; font-weight: 900; text-transform: uppercase;
      line-height: 1; color: var(--white); margin-bottom: 1rem; letter-spacing: -.01em;
    }
    .bk-p { font-size: .82rem; font-weight: 300; line-height: 1.75; color: var(--muted); margin-bottom: 1.6rem; }
    .bk-link {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: .68rem; font-weight: 700; letter-spacing: .2em;
      text-transform: uppercase; color: var(--yellow); text-decoration: none;
      display: inline-flex; align-items: center; gap: .5rem; cursor: none;
      transition: gap .25s;
    }
    .bk-link:hover { gap: .9rem; }
    @media (max-width: 768px) { .bk-link { cursor: auto; } }

    /* ── SPEAKING ── */
    .speaking { background: var(--bg); border-top: 1px solid var(--line); }
    .sp-inner { display: grid; grid-template-columns: 380px 1fr; }
    @media (max-width: 960px) { .sp-inner { grid-template-columns: 1fr; } }
    .sp-left {
      padding: 6rem 5vw; border-right: 1px solid var(--line);
      position: sticky; top: 0; align-self: start; height: fit-content;
    }
    @media (max-width: 960px) { .sp-left { position: static; border-right: none; border-bottom: 1px solid var(--line); padding: 5rem 6vw; } }
    .sp-q {
      margin-top: 2.5rem; padding: 1.5rem;
      border-left: 3px solid var(--yellow); background: var(--bg2);
    }
    .sp-qt {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 1.25rem; font-style: italic; font-weight: 300;
      color: var(--off); line-height: 1.5; margin-bottom: .8rem;
    }
    .sp-qby {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: .62rem; font-weight: 700; letter-spacing: .22em;
      text-transform: uppercase; color: var(--yellow);
    }
    .ev-list { display: flex; flex-direction: column; }
    .ev {
      display: grid; grid-template-columns: 80px 1fr;
      gap: 1.5rem; padding: 1.8rem 4vw;
      border-bottom: 1px solid var(--line); transition: background .25s;
    }
    .ev:hover { background: var(--bg2); }
    .ev-dt { text-align: center; padding-top: .2rem; }
    .ev-d { font-family: 'Barlow Condensed', sans-serif; font-size: 3rem; font-weight: 900; color: var(--yellow); line-height: 1; }
    .ev-m { font-family: 'Barlow Condensed', sans-serif; font-size: .58rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: var(--dim); }
    .ev-name { font-family: 'Barlow Condensed', sans-serif; font-size: 1.2rem; font-weight: 700; text-transform: uppercase; color: var(--white); margin-bottom: .35rem; line-height: 1.15; }
    .ev-meta { font-size: .7rem; color: var(--dim); display: flex; gap: .7rem; flex-wrap: wrap; }
    .ev-type { color: var(--yellow); font-weight: 500; }

    /* ── CONTACT ── */
    .contact { background: var(--bg); border-top: 1px solid var(--line); }
    .ct-inner { display: grid; grid-template-columns: 1fr 1fr; }
    @media (max-width: 900px) { .ct-inner { grid-template-columns: 1fr; } }
    .ct-img-wrap { position: relative; overflow: hidden; min-height: 600px; }
    @media (max-width: 900px) { .ct-img-wrap { min-height: 65vw; max-height: 500px; } }
    .ct-img { width: 100%; height: 100%; object-fit: cover; object-position: top; filter: contrast(1.05) brightness(.85); }
    .ct-img-ov { position: absolute; inset: 0; background: linear-gradient(to top, rgba(20,20,20,.85) 0%, transparent 55%); }
    .ct-img-badge {
      position: absolute; bottom: 0; left: 0; right: 0;
      background: var(--yellow); padding: 1.2rem 2.5rem;
      display: flex; align-items: center; justify-content: space-between;
    }
    .ct-badge-txt { font-family: 'Barlow Condensed', sans-serif; font-size: 1.3rem; font-weight: 900; text-transform: uppercase; letter-spacing: .04em; color: var(--bg); }
    .ct-badge-sub { font-family: 'Barlow Condensed', sans-serif; font-size: .65rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: rgba(20,20,20,.55); }
    .ct-form-side { padding: 6rem 5vw; border-left: 1px solid var(--line); }
    @media (max-width: 900px) { .ct-form-side { border-left: none; border-top: 1px solid var(--line); padding: 5rem 6vw; } }
    .ct-details { display: flex; flex-direction: column; gap: .8rem; margin: 2rem 0 2.5rem; padding: 1.5rem 0; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
    .ctd { display: flex; gap: .8rem; align-items: flex-start; }
    .ctd-dot { width: 5px; height: 5px; background: var(--yellow); border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
    .ctd-lbl { font-family: 'Barlow Condensed', sans-serif; font-size: .62rem; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: var(--dim); margin-bottom: .15rem; }
    .ctd-val { font-size: .8rem; font-weight: 300; color: var(--muted); }
    .cform { display: flex; flex-direction: column; gap: .9rem; }
    .crow { display: grid; grid-template-columns: 1fr 1fr; gap: .9rem; }
    @media (max-width: 480px) { .crow { grid-template-columns: 1fr; } }
    .cfg { display: flex; flex-direction: column; gap: .35rem; }
    .cfl { font-family: 'Barlow Condensed', sans-serif; font-size: .62rem; font-weight: 700; letter-spacing: .2em; text-transform: uppercase; color: var(--dim); }
    .cfi, .cfs, .cfta {
      background: var(--bg2); border: 1px solid var(--line);
      padding: .8rem .9rem; font-family: 'Barlow', sans-serif;
      font-size: .85rem; font-weight: 300; color: var(--white);
      outline: none; width: 100%; transition: border-color .25s;
      -webkit-appearance: none; border-radius: 0;
    }
    .cfi::placeholder, .cfta::placeholder { color: var(--dim); }
    .cfi:focus, .cfs:focus, .cfta:focus { border-color: var(--yellow); }
    .cfs option { background: var(--bg); }
    .cfta { min-height: 100px; resize: vertical; }
    .cfbtn {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: .72rem; font-weight: 700; letter-spacing: .22em;
      text-transform: uppercase; background: var(--yellow); color: var(--bg);
      padding: 1rem 2rem; border: none; cursor: none;
      transition: background .25s; width: 100%;
    }
    .cfbtn:hover { background: var(--yellow2); }
    @media (max-width: 768px) { .cfbtn { cursor: auto; } }
    .sent { padding: 3rem 2rem; text-align: center; border: 1px solid var(--yellow); }
    .sent-icon { font-family: 'Barlow Condensed', sans-serif; font-size: 3.5rem; font-weight: 900; color: var(--yellow); }
    .sent-t { font-family: 'Barlow Condensed', sans-serif; font-size: 2rem; font-weight: 900; text-transform: uppercase; color: var(--white); margin-bottom: .4rem; }
    .sent-s { font-size: .8rem; font-weight: 300; color: var(--muted); }

    /* ── FOOTER ── */
    .footer { border-top: 3px solid var(--yellow); background: var(--bg2); }
    .ft-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; border-bottom: 1px solid var(--line); }
    @media (max-width: 900px) { .ft-top { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 480px) { .ft-top { grid-template-columns: 1fr; } }
    .ft-col { padding: 4rem 4vw; border-right: 1px solid var(--line); }
    .ft-col:last-child { border-right: none; }
    @media (max-width: 900px) { .ft-col:nth-child(2) { border-right: none; } .ft-col:nth-child(3) { border-top: 1px solid var(--line); } .ft-col:nth-child(4) { border-right: none; border-top: 1px solid var(--line); } }
    @media (max-width: 480px) { .ft-col { border-right: none !important; border-bottom: 1px solid var(--line); } }
    .ft-logo { font-family: 'Barlow Condensed', sans-serif; font-size: 1.6rem; font-weight: 900; text-transform: uppercase; letter-spacing: .04em; color: var(--white); margin-bottom: .7rem; }
    .ft-logo span { color: var(--yellow); }
    .ft-tagline { font-size: .8rem; font-weight: 300; line-height: 1.7; color: var(--dim); margin-bottom: 1.5rem; max-width: 260px; }
    .ft-yl { width: 30px; height: 2px; background: var(--yellow); }
    .ft-ch { font-family: 'Barlow Condensed', sans-serif; font-size: .65rem; font-weight: 700; letter-spacing: .28em; text-transform: uppercase; color: var(--yellow); margin-bottom: 1.2rem; }
    .ftl { display: block; font-size: .8rem; font-weight: 300; color: var(--dim); text-decoration: none; margin-bottom: .55rem; transition: color .2s; cursor: none; }
    .ftl:hover { color: var(--white); }
    @media (max-width: 768px) { .ftl { cursor: auto; } }
    .ft-bottom { padding: 1.5rem 4vw; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
    .ft-copy { font-family: 'Barlow Condensed', sans-serif; font-size: .65rem; font-weight: 500; letter-spacing: .1em; text-transform: uppercase; color: var(--dim); }
  `}</style>
);

/* ─── CURSOR ──── */
function Cursor() {
  const mx = useMotionValue(-100), my = useMotionValue(-100);
  const rx = useSpring(mx, { stiffness: 200, damping: 22 });
  const ry = useSpring(my, { stiffness: 200, damping: 22 });
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

/* ─── REVEAL ──── */
function R({ children, delay = 0, y = 28, x = 0, className = "" }) {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y, x }}
      animate={v ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: .75, delay, ease: [.22, 1, .36, 1] }}
    >{children}</motion.div>
  );
}

/* ─── NAV ──── */
function Nav() {
  const [s, setS] = useState(false), [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setS(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["About", "Ministries", "Videos", "Books", "Speaking", "Contact"];
  return (<>
    <motion.header className={`nav${s ? " s" : ""}`}
      initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: .7, ease: [.22, 1, .36, 1] }}>
      <a className="logo" href="#home">Dr. Kunle <span>Hamilton</span></a>
      <nav className="nav-links">
        {links.map(l => <a key={l} className="nl" href={`#${l.toLowerCase()}`}>{l}</a>)}
        <a className="nav-btn" href="#contact">Book Session</a>
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
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: .25 }}>
          {links.map(l => <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}>{l}</a>)}
          <div className="mob-line" />
          <a className="nav-btn" href="#contact" onClick={() => setOpen(false)}>Book a Session</a>
        </motion.div>
      )}
    </AnimatePresence>
  </>);
}

/* ─── HERO ──── */
function Hero() {
  const { scrollY } = useScroll();
  const iy = useTransform(scrollY, [0, 600], [0, 80]);
  return (
    <section className="hero" id="home">
      <div className="hero-txt">
        <motion.div className="hero-label"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: .5, duration: .6 }}>
          <span className="hero-label-dot" />
          Prophet · Scholar · Shepherd · Author
        </motion.div>

        <motion.div className="hero-name"
          initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .65, duration: .9, ease: [.22, 1, .36, 1] }}>
          <span className="line1">DR.</span>
          <span className="line2">KUNLE</span>
          <span className="line3">HAMILTON</span>
        </motion.div>

        <motion.div className="hero-roles"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: .95, duration: .7 }}>
          <div className="hero-role"><strong>Senior Shepherd</strong> — CCC PraiseVille Global</div>
          <div className="hero-role"><strong>Founder</strong> — ShaddaiVille Ministries International</div>
          <div className="hero-role"><strong>CEO</strong> — Virgin Outdoor, Lagos</div>
        </motion.div>

        <motion.div className="hero-ctas"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: .7 }}>
          <a className="btn-y" href="#about">Discover His Story</a>
          <a className="btn-w" href="#videos">Watch Teachings</a>
        </motion.div>
      </div>

      <motion.div className="hero-img-wrap" style={{ y: iy }}>
        <img src={P1} alt="Dr. Kunle Hamilton" className="hero-img" />
        <div className="hero-img-fade" />
        <div className="hero-img-tag">CCC PraiseVille Global</div>
        <motion.div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "var(--yellow)", transformOrigin: "left" }}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.4, delay: 1.3, ease: [.22, 1, .36, 1] }} />
      </motion.div>
    </section>
  );
}

/* ─── STRIP ──── */
function Strip() {
  const items = ["Prophet", "Scholar", "Media Veteran", "Author", "Lagos · Berlin · London · USA"];
  return (
    <div className="strip">
      <div className="strip-items">
        {items.map((t, i) => (
          <span key={i} className="strip-item">
            {i > 0 && <span className="strip-dot" />}
            {t}
          </span>
        ))}
      </div>
      <a className="strip-btn" href="#contact">Book a Session →</a>
    </div>
  );
}

/* ─── ABOUT ──── */
function About() {
  return (
    <section className="about" id="about">
      <R x={-20} y={0}>
        <div className="about-photo">
          <img src={P2} alt="Dr. Kunle Hamilton teaching" />
          <div className="about-photo-ov" />
          <div className="about-photo-text">
            <div className="about-quote">"If God had not arrested me with the drama of the Celestial Church, He would have lost me to atheism."</div>
            <div className="about-quote-by">— Dr. Kunle Hamilton</div>
          </div>
        </div>
      </R>
      <div className="about-body">
        <R><div className="stag">The Man Behind the Ministry</div></R>
        <R delay={.1}><h2 className="sh2">A PHILOSOPHER<br />WHO FOUND <span>GOD.</span></h2></R>
        <R delay={.2}>
          <div style={{ height: 1, background: "var(--line)", margin: "2rem 0" }} />
          <p>Dr. Kunle Hamilton is one of Nigeria's most remarkable multi-disciplinary voices — <strong>a Prophet of the Celestial Church of Christ</strong>, veteran journalist, media executive, and international author whose reach spans four continents.</p>
          <p>A <strong>Philosophy first-class graduate</strong> (Best Student, 1985) and Mass Communication scholar from the University of Lagos, Dr. Hamilton fuses rigorous academic thought with prophetic grace — a ministry defined by discipleship and the empowerment of nations.</p>
        </R>
        <R delay={.3}>
          <div className="about-creds">
            {[
              ["Senior Shepherd", "CCC PraiseVille — 4 Nations"],
              ["Founder & President", "ShaddaiVille Ministries Int'l"],
              ["CEO", "Virgin Outdoor, Lagos"],
              ["International Author", "18 Countries Published"],
            ].map(([t, v], i) => (
              <div className="cred" key={i}>
                <div className="cred-title">{t}</div>
                <div className="cred-sub">{v}</div>
              </div>
            ))}
          </div>
        </R>
        <R delay={.4}><a className="btn-y" href="#contact" style={{ display: "inline-block" }}>Connect with Dr. Hamilton</a></R>
      </div>
    </section>
  );
}

/* ─── STATS ──── */
function Stats() {
  return (
    <div className="stats">
      {[{ n: "40+", l: "Years in Ministry" }, { n: "5", l: "Nations of Impact" }, { n: "2", l: "Thriving Ministries" }, { n: "18", l: "Countries Published" }].map((s, i) => (
        <motion.div key={i} className="stat"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: i * .1, duration: .6 }}>
          <div className="stat-n">{s.n}</div>
          <div className="stat-l">{s.l}</div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── MINISTRIES ──── */
function Ministries() {
  return (
    <section className="ministries" id="ministries">
      <div className="min-header">
        <R><div className="stag">Twin Pillars of Purpose</div></R>
        <R delay={.1}><h2 className="sh2">THE <span>MINISTRIES</span></h2></R>
      </div>
      <div className="min-grid">
        {[
          {
            img: P1, tag: "Celestial Church of Christ", name: "CCC PRAISEVILLE", nameSpan: "GLOBAL",
            desc: "Founded in Berlin on May 8 2016, now flourishing across Nigeria, UK, USA and Germany. Authentic worship, genuine prophecy, deep fellowship.",
            facts: [{ n: "4+", l: "Countries" }, { n: "2016", l: "Founded Berlin" }, { n: "7+", l: "Festival of Word" }]
          },
          {
            img: P2, tag: "Non-Denominational · Global Training", name: "SHADDAIVILLE", nameSpan: "MINISTRIES INT'L",
            desc: "\"God's City\" — UK-certified leadership & entrepreneurship training since 2007. Free of charge. Christians and Muslims trained together across 5 nations.",
            facts: [{ n: "5", l: "Nations" }, { n: "2007", l: "Est. Nigeria" }, { n: "UK", l: "Certified Academy" }]
          }
        ].map((m, i) => (
          <R key={i} x={i === 0 ? -20 : 20} y={0}>
            <div className="min-panel">
              <div className="min-panel-bg" />
              <img src={m.img} className="min-panel-img" alt={m.name} />
              <div className="min-panel-ov" />
              <div className="min-content">
                <div className="min-tag">{m.tag}</div>
                <h3 className="min-name">{m.name}<br /><span>{m.nameSpan}</span></h3>
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

/* ─── VIDEOS ──── */
function Videos() {
  const vids = [
    { url: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fcelestial.focus%2Fvideos%2F1356642479037237&show_text=false", tag: "Discipleship · Teaching", title: "Dr. Kunle Hamilton Teaches Discipleship", src: "CelestialFocus · Facebook" },
    { url: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fhephzibahtelevision%2Fvideos%2F449065333576250&show_text=false", tag: "Leadership · Interview", title: "Meeting with Dr. Hamilton — The Roles of Leadership", src: "Hephzibah Television" },
    { url: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fcelestial.focus%2Fvideos%2F1241668604555889&show_text=false", tag: "Worship · Celebration", title: "Christmas — CCC PraiseVille Highlight", src: "CelestialFocus · Facebook" },
  ];
  return (
    <section className="videos" id="videos">
      <div className="videos-top">
        <div className="videos-hd">
          <R><div className="stag">Teachings · Sermons · Interviews</div></R>
          <R delay={.1}><h2 className="sh2">WATCH<br /><span>DR. HAMILTON</span><br />IN ACTION</h2></R>
          <R delay={.25}><div style={{ marginTop: "2rem" }}><a className="btn-y" href="#contact">Attend a Service</a></div></R>
        </div>
        <R y={0} x={20}>
          <div className="videos-featured">
            <iframe className="vf-frame" src={vids[0].url} scrolling="no" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" title={vids[0].title} />
            <div className="vf-info">
              <span className="vf-tag">{vids[0].tag}</span>
              <div className="vf-title">{vids[0].title}</div>
            </div>
          </div>
        </R>
      </div>
      <div className="videos-grid">
        {vids.slice(1).map((v, i) => (
          <R key={i} delay={i * .12}>
            <div className="vg-card">
              <iframe className="vg-frame" src={v.url} scrolling="no" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" title={v.title} />
              <div className="vg-info">
                <span className="vg-tag">{v.tag}</span>
                <div className="vg-title">{v.title}</div>
                <div className="vg-src">{v.src}</div>
              </div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ─── BOOKS ──── */
function Books() {
  return (
    <section className="books" id="books">
      <div className="books-hd">
        <R><div className="stag">Written Works</div></R>
        <R delay={.1}><h2 className="sh2">BOOKS &amp; <span>PUBLICATIONS</span></h2></R>
      </div>
      <div className="books-grid">
        {[
          { tag: "Leadership", title: "RELEASING THE EAGLE IN YOU", p: "An eight-chapter inspirational work on leadership and self-actualization — unlocking the greatness God placed within every person. Published internationally across 18 countries." },
          { tag: "Philosophy", title: "JOURNEY TO UNDERSTANDING", p: "A philosophical investigation of how style and content impact the spoken word, using the church and Raypower 100.5 FM as its remarkable canvas." },
          { tag: "Ministry", title: "THE SHADDAIVILLE VISION", p: "Dr. Hamilton's framework for discipleship-driven ministry that transcends denominational walls — building leaders, entrepreneurs and moral beacons across faith traditions." },
        ].map((b, i) => (
          <R key={i} delay={i * .12}>
            <div className="bk">
              <div className="bk-num">0{i + 1}</div>
              <div className="bk-tag">{b.tag}</div>
              <div className="bk-title">{b.title}</div>
              <div className="bk-p">{b.p}</div>
              <a className="bk-link" href="#contact">Order a Copy →</a>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ─── SPEAKING ──── */
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
      <div className="sp-inner">
        <div className="sp-left">
          <R><div className="stag">Events & Engagements</div></R>
          <R delay={.1}><h2 className="sh2">SPEAKING &amp;<br /><span>APPEARANCES</span></h2></R>
          <R delay={.2}>
            <div className="sp-q">
              <div className="sp-qt">"The responsibility of religious leaders is to guide young people towards righteousness — not to encourage them to chase fame through questionable means."</div>
              <div className="sp-qby">— Dr. Kunle Hamilton</div>
            </div>
          </R>
          <R delay={.3}><div style={{ marginTop: "2rem" }}><a className="btn-y" href="#contact">Invite Dr. Hamilton</a></div></R>
        </div>
        <div className="ev-list">
          {evs.map((e, i) => (
            <R key={i} delay={i * .08} x={20} y={0}>
              <div className="ev">
                <div className="ev-dt">
                  <div className="ev-d">{e.d}</div>
                  <div className="ev-m">{e.m}</div>
                </div>
                <div>
                  <div className="ev-name">{e.name}</div>
                  <div className="ev-meta"><span>📍 {e.loc}</span><span className="ev-type">· {e.type}</span></div>
                </div>
              </div>
            </R>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ──── */
function Contact() {
  const [f, setF] = useState({ name: "", email: "", inquiry: "speaking", msg: "" });
  const [sent, setSent] = useState(false);
  return (
    <section className="contact" id="contact">
      <div className="ct-inner">
        <R x={-20} y={0}>
          <div className="ct-img-wrap">
            <img src={P2} alt="Dr. Kunle Hamilton" className="ct-img" />
            <div className="ct-img-ov" />
            <div className="ct-img-badge">
              <div>
                <div className="ct-badge-txt">Let's Connect</div>
                <div className="ct-badge-sub">Reach Dr. Hamilton's Team</div>
              </div>
              <div style={{ fontSize: "2rem", fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, color: "var(--bg)" }}>→</div>
            </div>
          </div>
        </R>
        <R delay={.15}>
          <div className="ct-form-side">
            <div className="stag">Get in Touch</div>
            <h2 className="sh2">SEND A <span>MESSAGE</span></h2>
            <div className="ct-details">
              {[
                ["Ministry", "CCC PraiseVille Global · ShaddaiVille International"],
                ["Based In", "Lagos · Berlin · London · USA"],
                ["Media & PR", "Virgin Outdoor Communications, Lagos"],
              ].map(([l, v], i) => (
                <div className="ctd" key={i}>
                  <div className="ctd-dot" />
                  <div><div className="ctd-lbl">{l}</div><div className="ctd-val">{v}</div></div>
                </div>
              ))}
            </div>
            {sent ? (
              <motion.div className="sent" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <div className="sent-icon">✓</div>
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
                <button className="cfbtn" type="submit">Send Message →</button>
              </form>
            )}
          </div>
        </R>
      </div>
    </section>
  );
}

/* ─── FOOTER ──── */
function Footer() {
  return (
    <footer className="footer">
      <div className="ft-top">
        <div className="ft-col">
          <div className="ft-logo">Dr. Kunle <span>Hamilton</span></div>
          <div className="ft-tagline">Prophet · Scholar · Shepherd · Author · Media Veteran. Serving God and humanity across five nations since 1985.</div>
          <div className="ft-yl" />
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

/* ─── APP ──── */
export default function App() {
  return (<>
    <Styles />
    <Cursor />
    <Nav />
    <Hero />
    <Strip />
    <About />
    <Stats />
    <Ministries />
    <Videos />
    <Books />
    <Speaking />
    <Contact />
    <Footer />
  </>);
}
