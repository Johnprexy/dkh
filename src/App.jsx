import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion, AnimatePresence,
  useScroll, useTransform, useInView,
  useMotionValue, useSpring, animate
} from "framer-motion";

/* ─── IMAGES ─────────────────────────────────────────────────────────────── */
const IMG1 = "/dkh-hero.jpg";
const IMG2 = "/dkh-teaching.jpg";
const IMG3 = "/dkh-formal.jpg";

/* ─── DESIGN TOKENS ──────────────────────────────────────────────────────── */
// Pure white · near-black · ash greys · NO colour accent
// Animation IS the personality

/* ─── STYLES ──────────────────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Manrope:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --white:  #FFFFFF;
      --black:  #111111;
      --ash:    #F5F5F5;
      --ash2:   #EBEBEB;
      --ash3:   #D8D8D8;
      --mid:    #888888;
      --dim:    #BBBBBB;
      --serif:  'DM Serif Display', Georgia, serif;
      --sans:   'Manrope', system-ui, sans-serif;
    }

    html { scroll-behavior: smooth; overflow-x: hidden; }

    body {
      font-family: var(--sans);
      background: var(--white);
      color: var(--black);
      overflow-x: hidden;
      cursor: none;
    }
    @media (max-width: 768px) { body { cursor: auto; } }

    ::-webkit-scrollbar { width: 2px; }
    ::-webkit-scrollbar-thumb { background: var(--ash3); }

    /* ── CURSOR ── */
    .c-dot {
      position: fixed; width: 8px; height: 8px;
      background: var(--black); border-radius: 50%;
      pointer-events: none; z-index: 9999;
      transform: translate(-50%, -50%);
      mix-blend-mode: difference;
    }
    .c-ring {
      position: fixed; width: 40px; height: 40px;
      border: 1px solid rgba(17,17,17,0.25); border-radius: 50%;
      pointer-events: none; z-index: 9998;
      transform: translate(-50%, -50%);
      mix-blend-mode: difference;
    }
    @media (max-width: 768px) { .c-dot, .c-ring { display: none; } }

    /* ── NAV ── */
    .nav {
      position: fixed; inset: 0 0 auto;
      z-index: 200; height: 72px;
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 5vw;
      transition: background .5s, border-color .5s;
      border-bottom: 1px solid transparent;
    }
    .nav.scrolled {
      background: rgba(255,255,255,0.94);
      backdrop-filter: blur(18px);
      border-color: var(--ash2);
    }
    .nav-logo {
      font-family: var(--serif); font-size: 1.1rem;
      color: var(--black); text-decoration: none; cursor: none;
      letter-spacing: 0.01em;
    }
    .nav-logo em { font-style: italic; }
    @media (max-width: 768px) { .nav-logo { cursor: auto; } }
    .nav-links { display: flex; align-items: center; gap: 2.5rem; }
    @media (max-width: 900px) { .nav-links { display: none; } }
    .nav-link {
      font-size: 0.72rem; font-weight: 500; letter-spacing: 0.12em;
      text-transform: uppercase; color: var(--mid); text-decoration: none;
      cursor: none; transition: color .25s; position: relative;
    }
    .nav-link::after {
      content: ''; position: absolute; bottom: -2px; left: 0;
      width: 0; height: 1px; background: var(--black);
      transition: width .3s ease;
    }
    .nav-link:hover { color: var(--black); }
    .nav-link:hover::after { width: 100%; }
    .nav-cta {
      font-size: 0.7rem; font-weight: 600; letter-spacing: 0.12em;
      text-transform: uppercase; background: var(--black); color: var(--white);
      padding: 0.6rem 1.5rem; text-decoration: none; cursor: none;
      transition: background .25s, color .25s; border-radius: 0;
    }
    .nav-cta:hover { background: var(--mid); }
    @media (max-width: 768px) { .nav-cta { cursor: auto; } }
    /* hamburger */
    .ham { display: none; background: none; border: none; cursor: pointer; padding: 4px; flex-direction: column; gap: 5px; }
    @media (max-width: 900px) { .ham { display: flex; } }
    .ham-l { width: 22px; height: 1.5px; background: var(--black); border-radius: 1px; transition: transform .3s, opacity .3s; }
    /* mobile overlay */
    .mob-nav {
      position: fixed; inset: 0; background: var(--white); z-index: 190;
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; gap: 2.5rem;
    }
    .mob-nav a {
      font-family: var(--serif); font-size: 2.8rem; font-style: italic;
      color: var(--black); text-decoration: none; transition: opacity .2s;
    }
    .mob-nav a:hover { opacity: 0.5; }
    .mob-nav-cta {
      font-family: var(--sans) !important; font-style: normal !important;
      font-size: 0.72rem !important; font-weight: 600 !important;
      letter-spacing: 0.15em; text-transform: uppercase;
      background: var(--black); color: var(--white) !important;
      padding: 0.9rem 2.5rem; border-radius: 0; margin-top: 1rem;
    }
    .mob-div { width: 40px; height: 1px; background: var(--ash3); }

    /* ── HERO ── */
    .hero {
      min-height: 100vh;
      display: grid; grid-template-columns: 55% 45%;
      background: var(--white); overflow: hidden; position: relative;
    }
    @media (max-width: 900px) { .hero { grid-template-columns: 1fr; } }

    .hero-left {
      display: flex; flex-direction: column; justify-content: flex-end;
      padding: 0 6vw 8vh 7vw; position: relative; z-index: 2;
    }
    @media (max-width: 900px) { .hero-left { padding: 8rem 6vw 4rem; order: 2; } }

    .hero-kicker {
      font-size: 0.68rem; font-weight: 600; letter-spacing: 0.28em;
      text-transform: uppercase; color: var(--mid);
      display: flex; align-items: center; gap: 0.8rem; margin-bottom: 2.5rem;
    }
    .hero-kicker-line { width: 28px; height: 1px; background: var(--ash3); flex-shrink: 0; }

    /* BIG headline — DM Serif, massive, stacked */
    .hero-h1 {
      font-family: var(--serif);
      font-size: clamp(4rem, 8.5vw, 10rem);
      line-height: 0.9; font-weight: 400; letter-spacing: -0.02em;
      color: var(--black); overflow: hidden;
    }
    .hero-h1 em { font-style: italic; color: var(--black); display: block; }
    @media (max-width: 480px) { .hero-h1 { font-size: clamp(3.2rem, 11vw, 5rem); } }

    .hero-rule { width: 48px; height: 1px; background: var(--ash3); margin: 2.5rem 0; }

    .hero-desc {
      font-size: 1rem; font-weight: 300; line-height: 1.8;
      color: var(--mid); max-width: 440px; margin-bottom: 3rem;
    }
    .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

    /* Buttons */
    .btn-fill {
      font-size: 0.7rem; font-weight: 600; letter-spacing: 0.15em;
      text-transform: uppercase; background: var(--black); color: var(--white);
      padding: 0.9rem 2.2rem; text-decoration: none; cursor: none;
      display: inline-block; transition: background .25s;
      border: 1px solid var(--black);
    }
    .btn-fill:hover { background: var(--mid); border-color: var(--mid); }
    .btn-line {
      font-size: 0.7rem; font-weight: 600; letter-spacing: 0.15em;
      text-transform: uppercase; background: transparent; color: var(--black);
      padding: 0.9rem 2.2rem; text-decoration: none; cursor: none;
      display: inline-block; transition: background .25s, color .25s;
      border: 1px solid var(--ash3);
    }
    .btn-line:hover { background: var(--ash); }
    @media (max-width: 768px) { .btn-fill, .btn-line { cursor: auto; } }

    /* Hero right — photo */
    .hero-right {
      position: relative; overflow: hidden; background: var(--ash);
    }
    @media (max-width: 900px) { .hero-right { order: 1; height: 65vw; max-height: 500px; } }
    .hero-photo {
      width: 100%; height: 100%; object-fit: cover; object-position: top center;
      filter: grayscale(8%);
    }
    /* Soft left-fade so text panel bleeds cleanly */
    .hero-photo-fade {
      position: absolute; inset: 0;
      background: linear-gradient(to right, var(--white) 0%, transparent 18%),
                  linear-gradient(to top, rgba(255,255,255,.45) 0%, transparent 40%);
    }
    @media (max-width: 900px) {
      .hero-photo-fade {
        background: linear-gradient(to bottom, transparent 55%, var(--white) 100%);
      }
    }
    /* Small caption */
    .hero-caption {
      position: absolute; bottom: 1.5rem; right: 1.5rem;
      font-size: 0.58rem; font-weight: 500; letter-spacing: 0.18em;
      text-transform: uppercase; color: var(--dim);
      writing-mode: vertical-rl;
    }

    /* ── MARQUEE ── */
    .marquee { overflow: hidden; background: var(--ash); border-top: 1px solid var(--ash2); border-bottom: 1px solid var(--ash2); padding: 1.1rem 0; }
    .marquee-track { display: flex; white-space: nowrap; animation: mq 35s linear infinite; }
    @keyframes mq { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    .mq-item {
      font-size: 0.62rem; font-weight: 500; letter-spacing: 0.22em;
      text-transform: uppercase; color: var(--mid);
      padding: 0 2.5rem; display: inline-flex; align-items: center; gap: 2.5rem;
    }
    .mq-dot { width: 3px; height: 3px; background: var(--dim); border-radius: 50%; flex-shrink: 0; }

    /* ── SECTION COMMONS ── */
    .stag {
      font-size: 0.65rem; font-weight: 600; letter-spacing: 0.25em;
      text-transform: uppercase; color: var(--mid);
      display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;
    }
    .stag::before { content: ''; width: 20px; height: 1px; background: var(--ash3); flex-shrink: 0; }
    .sh2 {
      font-family: var(--serif);
      font-size: clamp(2.4rem, 5vw, 5rem);
      font-weight: 400; line-height: 1.0; letter-spacing: -0.01em;
      color: var(--black);
    }
    .sh2 em { font-style: italic; }

    /* ── ABOUT ── */
    .about {
      display: grid; grid-template-columns: 1fr 1fr;
      background: var(--white);
    }
    @media (max-width: 900px) { .about { grid-template-columns: 1fr; } }

    /* Photo panel */
    .about-photo { position: relative; overflow: hidden; min-height: 680px; }
    @media (max-width: 900px) { .about-photo { min-height: 75vw; max-height: 560px; } }
    .about-photo img {
      width: 100%; height: 100%; object-fit: cover; object-position: top center;
      filter: grayscale(5%); transition: transform .8s ease;
    }
    .about-photo:hover img { transform: scale(1.03); }
    .about-photo-ov {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(17,17,17,0.75) 0%, transparent 55%);
    }
    .about-photo-bottom {
      position: absolute; bottom: 0; left: 0; right: 0; padding: 2rem 2.5rem;
    }
    .about-blockquote {
      font-family: var(--serif); font-size: 1.25rem; font-style: italic;
      font-weight: 400; color: rgba(255,255,255,0.92); line-height: 1.5;
      margin-bottom: 0.75rem; border-left: 2px solid rgba(255,255,255,0.3);
      padding-left: 1rem;
    }
    .about-quote-by {
      font-size: 0.58rem; font-weight: 600; letter-spacing: 0.2em;
      text-transform: uppercase; color: rgba(255,255,255,0.45);
      padding-left: 1rem;
    }

    /* Text panel */
    .about-body {
      padding: 7rem 6vw;
      display: flex; flex-direction: column; justify-content: center;
      border-left: 1px solid var(--ash2);
    }
    @media (max-width: 900px) { .about-body { border-left: none; border-top: 1px solid var(--ash2); padding: 5rem 6vw; } }
    .about-body p { font-size: 0.95rem; line-height: 1.9; color: var(--mid); font-weight: 300; margin-bottom: 1.2rem; }
    .about-body strong { color: var(--black); font-weight: 500; }
    /* credential grid */
    .cred-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--ash2); margin: 2.5rem 0; border: 1px solid var(--ash2); }
    .cred-cell { padding: 1.2rem 1.4rem; background: var(--white); }
    .cred-title { font-size: 0.72rem; font-weight: 600; color: var(--black); margin-bottom: 0.2rem; }
    .cred-sub { font-size: 0.72rem; font-weight: 300; color: var(--mid); line-height: 1.45; }

    /* ── STATS ── */
    .stats {
      display: grid; grid-template-columns: repeat(4, 1fr);
      border-top: 1px solid var(--ash2); border-bottom: 1px solid var(--ash2);
      background: var(--ash);
    }
    @media (max-width: 640px) { .stats { grid-template-columns: repeat(2, 1fr); } }
    .stat { padding: 4rem 2rem; text-align: center; border-right: 1px solid var(--ash2); }
    .stat:last-child { border-right: none; }
    @media (max-width: 640px) { .stat:nth-child(2) { border-right: none; } }
    .stat-num {
      font-family: var(--serif); font-size: 4rem; font-weight: 400;
      color: var(--black); line-height: 1; letter-spacing: -0.02em;
    }
    .stat-label {
      font-size: 0.62rem; font-weight: 600; letter-spacing: 0.18em;
      text-transform: uppercase; color: var(--mid); margin-top: 0.5rem;
    }

    /* ── MINISTRIES ── */
    .ministries { background: var(--white); border-top: 1px solid var(--ash2); }
    .min-hd { padding: 6rem 7vw; border-bottom: 1px solid var(--ash2); }
    .min-grid { display: grid; grid-template-columns: 1fr 1fr; }
    @media (max-width: 768px) { .min-grid { grid-template-columns: 1fr; } }
    .min-panel {
      position: relative; overflow: hidden; min-height: 65vh;
      display: flex; flex-direction: column; justify-content: flex-end;
      padding: 5rem 5vw; border-right: 1px solid var(--ash2);
      cursor: none;
      background: var(--ash);
    }
    .min-panel:last-child { border-right: none; }
    @media (max-width: 768px) { .min-panel { border-right: none; border-bottom: 1px solid var(--ash2); cursor: auto; min-height: 420px; } }
    .min-photo {
      position: absolute; inset: 0; width: 100%; height: 100%;
      object-fit: cover; object-position: top center;
      filter: grayscale(30%) brightness(.92);
      opacity: 0.12; transition: opacity .6s ease;
    }
    .min-panel:hover .min-photo { opacity: 0.22; }
    .min-ov {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(255,255,255,0.97) 30%, rgba(255,255,255,0.6) 100%);
    }
    .min-content { position: relative; z-index: 2; }
    .min-kicker {
      font-size: 0.6rem; font-weight: 600; letter-spacing: 0.25em;
      text-transform: uppercase; color: var(--mid); margin-bottom: 1rem;
    }
    .min-name {
      font-family: var(--serif); font-size: clamp(1.8rem, 3.5vw, 3rem);
      font-weight: 400; line-height: 1.05; color: var(--black);
      margin-bottom: 1.2rem;
    }
    .min-name em { font-style: italic; }
    .min-desc { font-size: 0.85rem; line-height: 1.8; color: var(--mid); font-weight: 300; margin-bottom: 2rem; max-width: 400px; }
    .min-facts { display: flex; gap: 2rem; margin-bottom: 2rem; }
    .mf-n { font-family: var(--serif); font-size: 2rem; color: var(--black); line-height: 1; }
    .mf-l { font-size: 0.55rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--mid); margin-top: 0.2rem; }
    .min-link {
      font-size: 0.65rem; font-weight: 600; letter-spacing: 0.18em;
      text-transform: uppercase; color: var(--black); text-decoration: none;
      cursor: none; display: inline-flex; align-items: center; gap: 0.5rem;
      border-bottom: 1px solid var(--ash3); padding-bottom: 0.2rem;
      transition: border-color .25s, gap .25s;
    }
    .min-link:hover { border-color: var(--black); gap: 0.9rem; }
    @media (max-width: 768px) { .min-link { cursor: auto; } }

    /* ── VIDEOS ── */
    .videos { border-top: 1px solid var(--ash2); background: var(--white); }
    .vids-top {
      display: grid; grid-template-columns: 1fr 1.4fr;
      border-bottom: 1px solid var(--ash2);
    }
    @media (max-width: 900px) { .vids-top { grid-template-columns: 1fr; } }
    .vids-hd { padding: 6rem 6vw; display: flex; flex-direction: column; justify-content: center; }
    .vids-featured { overflow: hidden; border-left: 1px solid var(--ash2); }
    @media (max-width: 900px) { .vids-featured { border-left: none; border-top: 1px solid var(--ash2); } }
    .v-frame { width: 100%; aspect-ratio: 16/9; border: none; display: block; background: var(--ash); }
    .v-meta { padding: 1.4rem 1.8rem; border-top: 1px solid var(--ash2); }
    .v-tag { font-size: 0.58rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--mid); display: block; margin-bottom: 0.4rem; }
    .v-title { font-family: var(--serif); font-size: 1.1rem; color: var(--black); line-height: 1.3; }
    /* secondary grid */
    .vids-grid { display: grid; grid-template-columns: repeat(2, 1fr); }
    @media (max-width: 580px) { .vids-grid { grid-template-columns: 1fr; } }
    .vg {
      border-right: 1px solid var(--ash2); border-top: 1px solid var(--ash2);
      overflow: hidden; transition: background .3s; cursor: none;
    }
    .vg:nth-child(2n) { border-right: none; }
    .vg:hover { background: var(--ash); }
    @media (max-width: 768px) { .vg { cursor: auto; } }
    .vg .v-frame { aspect-ratio: 16/9; }
    .vg .v-meta { padding: 1.2rem 1.5rem; }
    .vg .v-title { font-size: 0.95rem; }
    .vg .v-src { font-size: 0.68rem; color: var(--dim); margin-top: 0.3rem; font-weight: 300; }

    /* ── BOOKS ── */
    .books { border-top: 1px solid var(--ash2); background: var(--ash); }
    .books-hd { padding: 6rem 7vw; border-bottom: 1px solid var(--ash2); }
    .books-grid { display: grid; grid-template-columns: repeat(3, 1fr); background: var(--white); }
    @media (max-width: 900px) { .books-grid { grid-template-columns: 1fr; } }
    .bk {
      padding: 3.5rem 4vw; border-right: 1px solid var(--ash2);
      border-bottom: 1px solid var(--ash2);
      transition: background .3s; cursor: none; position: relative; overflow: hidden;
    }
    .bk:nth-child(3n) { border-right: none; }
    @media (max-width: 900px) { .bk { border-right: none; } }
    .bk:hover { background: var(--ash); }
    @media (max-width: 768px) { .bk { cursor: auto; } }
    .bk-num {
      font-family: var(--serif); font-size: 5rem; font-weight: 400;
      color: var(--ash2); line-height: 1; margin-bottom: 1.5rem;
      transition: color .3s;
    }
    .bk:hover .bk-num { color: var(--ash3); }
    .bk-tag { font-size: 0.58rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--mid); margin-bottom: 0.7rem; }
    .bk-title { font-family: var(--serif); font-size: 1.5rem; color: var(--black); line-height: 1.15; margin-bottom: 1rem; }
    .bk-title em { font-style: italic; }
    .bk-p { font-size: 0.82rem; font-weight: 300; line-height: 1.75; color: var(--mid); margin-bottom: 1.6rem; }
    .bk-link {
      font-size: 0.62rem; font-weight: 600; letter-spacing: 0.18em;
      text-transform: uppercase; color: var(--black); text-decoration: none;
      display: inline-flex; align-items: center; gap: 0.5rem; cursor: none;
      border-bottom: 1px solid var(--ash3); padding-bottom: 0.15rem;
      transition: gap .25s, border-color .25s;
    }
    .bk-link:hover { gap: 0.9rem; border-color: var(--black); }
    @media (max-width: 768px) { .bk-link { cursor: auto; } }

    /* ── SPEAKING ── */
    .speaking { border-top: 1px solid var(--ash2); background: var(--white); }
    .sp-inner { display: grid; grid-template-columns: 360px 1fr; }
    @media (max-width: 960px) { .sp-inner { grid-template-columns: 1fr; } }
    .sp-left {
      padding: 6rem 5vw; border-right: 1px solid var(--ash2);
      position: sticky; top: 0; height: fit-content; align-self: start;
    }
    @media (max-width: 960px) { .sp-left { position: static; border-right: none; border-bottom: 1px solid var(--ash2); padding: 5rem 6vw; } }
    .sp-pull {
      margin-top: 2.5rem;
      border-left: 2px solid var(--ash3); padding-left: 1.4rem;
    }
    .sp-pull-text {
      font-family: var(--serif); font-size: 1.1rem; font-style: italic;
      color: var(--black); line-height: 1.6; margin-bottom: 0.8rem;
    }
    .sp-pull-by { font-size: 0.58rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--mid); }
    .ev-list { display: flex; flex-direction: column; }
    .ev {
      display: grid; grid-template-columns: 72px 1fr;
      gap: 1.5rem; padding: 1.8rem 5vw;
      border-bottom: 1px solid var(--ash2); transition: background .3s;
    }
    .ev:hover { background: var(--ash); }
    .ev-dt { text-align: center; }
    .ev-d { font-family: var(--serif); font-size: 2.5rem; color: var(--black); line-height: 1; }
    .ev-m { font-size: 0.55rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--mid); }
    .ev-name { font-family: var(--serif); font-size: 1.1rem; color: var(--black); line-height: 1.25; margin-bottom: 0.35rem; }
    .ev-meta { font-size: 0.7rem; color: var(--mid); display: flex; gap: 0.6rem; flex-wrap: wrap; }
    .ev-type { color: var(--black); font-weight: 500; }

    /* ── CONTACT ── */
    .contact { border-top: 1px solid var(--ash2); background: var(--white); }
    .ct-inner { display: grid; grid-template-columns: 1fr 1fr; }
    @media (max-width: 900px) { .ct-inner { grid-template-columns: 1fr; } }
    .ct-photo { position: relative; overflow: hidden; min-height: 640px; }
    @media (max-width: 900px) { .ct-photo { min-height: 65vw; max-height: 500px; } }
    .ct-photo img { width: 100%; height: 100%; object-fit: cover; object-position: top; filter: grayscale(10%); transition: transform .8s; }
    .ct-photo:hover img { transform: scale(1.03); }
    .ct-photo-ov { position: absolute; inset: 0; background: linear-gradient(to top, rgba(17,17,17,.7) 0%, transparent 55%); }
    .ct-photo-label {
      position: absolute; bottom: 2rem; left: 2.5rem; right: 2.5rem;
    }
    .ct-photo-title { font-family: var(--serif); font-size: 2rem; font-style: italic; color: var(--white); margin-bottom: 0.2rem; }
    .ct-photo-sub { font-size: 0.58rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(255,255,255,0.5); }
    .ct-form-side { padding: 6rem 5vw; border-left: 1px solid var(--ash2); }
    @media (max-width: 900px) { .ct-form-side { border-left: none; border-top: 1px solid var(--ash2); padding: 5rem 6vw; } }
    .ct-deets { margin: 2rem 0 2.5rem; border-top: 1px solid var(--ash2); border-bottom: 1px solid var(--ash2); padding: 1.5rem 0; display: flex; flex-direction: column; gap: 0.85rem; }
    .ctd { display: flex; gap: 0.8rem; align-items: flex-start; }
    .ctd-dash { width: 12px; height: 1px; background: var(--ash3); margin-top: 9px; flex-shrink: 0; }
    .ctd-lbl { font-size: 0.58rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--mid); margin-bottom: 0.15rem; }
    .ctd-val { font-size: 0.8rem; font-weight: 300; color: var(--black); }
    /* form */
    .cform { display: flex; flex-direction: column; gap: 0.9rem; }
    .crow { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; }
    @media (max-width: 480px) { .crow { grid-template-columns: 1fr; } }
    .cfg { display: flex; flex-direction: column; gap: 0.3rem; }
    .cfl { font-size: 0.58rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--mid); }
    .cfi, .cfs, .cfta {
      background: var(--ash); border: 1px solid var(--ash2);
      padding: 0.8rem 0.9rem; font-family: var(--sans);
      font-size: 0.85rem; font-weight: 300; color: var(--black);
      outline: none; width: 100%; transition: border-color .25s;
      border-radius: 0; -webkit-appearance: none;
    }
    .cfi::placeholder, .cfta::placeholder { color: var(--dim); }
    .cfi:focus, .cfs:focus, .cfta:focus { border-color: var(--black); background: var(--white); }
    .cfs option { background: var(--white); }
    .cfta { min-height: 100px; resize: vertical; }
    .cfbtn {
      font-size: 0.7rem; font-weight: 600; letter-spacing: 0.15em;
      text-transform: uppercase; background: var(--black); color: var(--white);
      padding: 1rem 2rem; border: none; cursor: none; font-family: var(--sans);
      transition: background .25s; width: 100%;
    }
    .cfbtn:hover { background: var(--mid); }
    @media (max-width: 768px) { .cfbtn { cursor: auto; } }
    .sent-box { padding: 3rem 2rem; text-align: center; border: 1px solid var(--ash2); background: var(--ash); }
    .sent-icon { font-family: var(--serif); font-size: 3rem; font-style: italic; color: var(--black); }
    .sent-title { font-family: var(--serif); font-size: 1.8rem; color: var(--black); margin-bottom: 0.5rem; }
    .sent-sub { font-size: 0.8rem; color: var(--mid); font-weight: 300; }

    /* ── FOOTER ── */
    .footer { border-top: 1px solid var(--ash2); background: var(--black); }
    .ft-top {
      display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
      border-bottom: 1px solid rgba(255,255,255,0.07);
    }
    @media (max-width: 900px) { .ft-top { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 480px) { .ft-top { grid-template-columns: 1fr; } }
    .ft-col { padding: 4rem 4vw; border-right: 1px solid rgba(255,255,255,0.07); }
    .ft-col:last-child { border-right: none; }
    @media (max-width: 900px) {
      .ft-col:nth-child(2) { border-right: none; }
      .ft-col:nth-child(3) { border-top: 1px solid rgba(255,255,255,0.07); }
      .ft-col:nth-child(4) { border-right: none; border-top: 1px solid rgba(255,255,255,0.07); }
    }
    @media (max-width: 480px) { .ft-col { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.07); } }
    .ft-logo { font-family: var(--serif); font-size: 1.2rem; font-style: italic; color: var(--white); margin-bottom: 0.9rem; }
    .ft-tagline { font-size: 0.78rem; font-weight: 300; line-height: 1.75; color: rgba(255,255,255,0.35); margin-bottom: 1.5rem; max-width: 240px; }
    .ft-rule { width: 30px; height: 1px; background: rgba(255,255,255,0.15); }
    .ft-ch { font-size: 0.6rem; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 1.4rem; }
    .ftl { display: block; font-size: 0.78rem; font-weight: 300; color: rgba(255,255,255,0.35); text-decoration: none; margin-bottom: 0.6rem; transition: color .25s; cursor: none; }
    .ftl:hover { color: var(--white); }
    @media (max-width: 768px) { .ftl { cursor: auto; } }
    .ft-bottom {
      padding: 1.5rem 4vw;
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;
    }
    .ft-copy { font-size: 0.62rem; font-weight: 300; color: rgba(255,255,255,0.2); letter-spacing: 0.05em; }
  `}</style>
);

/* ─── CURSOR ──────────────────────────────────────────────────────────────── */
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
    <motion.div className="c-dot" style={{ left: mx, top: my }} />
    <motion.div className="c-ring" style={{ left: rx, top: ry }} />
  </>);
}

/* ─── WORD-BY-WORD REVEAL ─────────────────────────────────────────────────── */
// Splits a string into words, each animating in with a slight stagger
function WordReveal({ text, className = "", delay = 0, italic = false }) {
  const ref = useRef(null);
  const inV = useInView(ref, { once: true, margin: "-40px" });
  const words = text.split(" ");
  return (
    <span ref={ref} className={className} style={{ display: "block" }} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom", marginRight: "0.28em" }}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "110%", opacity: 0 }}
            animate={inV ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            {italic ? <em>{w}</em> : w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ─── SCROLL REVEAL (generic) ─────────────────────────────────────────────── */
function R({ children, delay = 0, y = 30, x = 0, className = "" }) {
  const ref = useRef(null);
  const v = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y, x }}
      animate={v ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >{children}</motion.div>
  );
}

/* ─── COUNTING NUMBER ─────────────────────────────────────────────────────── */
function CountNum({ to, suffix = "" }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const inV = useInView(ref, { once: true });
  useEffect(() => {
    if (!inV) return;
    const n = parseInt(to);
    if (isNaN(n)) { setVal(to); return; }
    const ctrl = animate(0, n, { duration: 1.6, ease: "easeOut", onUpdate: v => setVal(Math.round(v)) });
    return () => ctrl.stop();
  }, [inV, to]);
  return <span ref={ref}>{isNaN(parseInt(to)) ? to : val}{suffix}</span>;
}

/* ─── NAV ──────────────────────────────────────────────────────────────────── */
function Nav() {
  const [sc, setSc] = useState(false), [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setSc(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["About", "Ministries", "Videos", "Books", "Speaking", "Contact"];
  return (<>
    <motion.header className={`nav${sc ? " scrolled" : ""}`}
      initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
      <a className="nav-logo" href="#home">Dr. Kunle <em>Hamilton</em></a>
      <nav className="nav-links">
        {links.map(l => <a key={l} className="nav-link" href={`#${l.toLowerCase()}`}>{l}</a>)}
        <a className="nav-cta" href="#contact">Book Session</a>
      </nav>
      <button className="ham" onClick={() => setOpen(!open)} aria-label="Menu">
        <div className="ham-l" style={open ? { transform: "rotate(45deg) translate(5px,5px)" } : {}} />
        <div className="ham-l" style={open ? { opacity: 0 } : {}} />
        <div className="ham-l" style={open ? { transform: "rotate(-45deg) translate(5px,-5px)" } : {}} />
      </button>
    </motion.header>
    <AnimatePresence>
      {open && (
        <motion.div className="mob-nav"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
          {links.map((l, i) => (
            <motion.a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}>
              {l}
            </motion.a>
          ))}
          <div className="mob-div" />
          <a className="nav-cta mob-nav-cta" href="#contact" onClick={() => setOpen(false)}>Book a Session</a>
        </motion.div>
      )}
    </AnimatePresence>
  </>);
}

/* ─── HERO ──────────────────────────────────────────────────────────────────── */
function Hero() {
  const { scrollY } = useScroll();
  const iy = useTransform(scrollY, [0, 600], [0, 70]);
  return (
    <section className="hero" id="home">
      <div className="hero-left">
        {/* Kicker */}
        <motion.div className="hero-kicker"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}>
          <span className="hero-kicker-line" />
          Prophet · Scholar · Shepherd · Author
        </motion.div>

        {/* Headline — stacked word reveals */}
        <h1 className="hero-h1" aria-label="Dr. Kunle Hamilton">
          <div style={{ overflow: "hidden" }}>
            <motion.span style={{ display: "block" }}
              initial={{ y: "105%" }} animate={{ y: 0 }}
              transition={{ delay: 0.75, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              Dr.
            </motion.span>
          </div>
          <div style={{ overflow: "hidden" }}>
            <motion.span style={{ display: "block" }}
              initial={{ y: "105%" }} animate={{ y: 0 }}
              transition={{ delay: 0.88, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              Kunle
            </motion.span>
          </div>
          <div style={{ overflow: "hidden" }}>
            <motion.em style={{ display: "block" }}
              initial={{ y: "105%" }} animate={{ y: 0 }}
              transition={{ delay: 1.0, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              Hamilton
            </motion.em>
          </div>
        </h1>

        <motion.div className="hero-rule"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          style={{ transformOrigin: "left" }}
          transition={{ delay: 1.25, duration: 1, ease: [0.22, 1, 0.36, 1] }} />

        <motion.p className="hero-desc"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}>
          Veteran journalist. International author. Prophet of the Celestial Church. Founder of PraiseVille Global & ShaddaiVille Ministries — a life poured out for God across five nations.
        </motion.p>

        <motion.div className="hero-actions"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.45, duration: 0.7 }}>
          <a className="btn-fill" href="#about">Discover His Story</a>
          <a className="btn-line" href="#videos">Watch Teachings</a>
        </motion.div>
      </div>

      {/* Photo */}
      <motion.div className="hero-right" style={{ y: iy }}>
        <motion.img src={IMG1} alt="Dr. Kunle Hamilton" className="hero-photo"
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1.4, ease: [0.22, 1, 0.36, 1] }} />
        <div className="hero-photo-fade" />
        <div className="hero-caption">CCC PraiseVille Global</div>
      </motion.div>
    </section>
  );
}

/* ─── MARQUEE ──────────────────────────────────────────────────────────────── */
const MQ = ["Prophet", "Scholar", "Media Veteran", "Bestselling Author", "Senior Shepherd", "PraiseVille Global", "ShaddaiVille International", "5 Nations", "40 Years of Ministry"];
function Marquee() {
  const all = [...MQ, ...MQ];
  return (
    <div className="marquee">
      <div className="marquee-track">
        {all.map((t, i) => <span key={i} className="mq-item">{t}<span className="mq-dot" /></span>)}
      </div>
    </div>
  );
}

/* ─── ABOUT ──────────────────────────────────────────────────────────────────── */
function About() {
  return (
    <section className="about" id="about">
      {/* Photo */}
      <R x={-24} y={0}>
        <div className="about-photo">
          <img src={IMG2} alt="Dr. Kunle Hamilton teaching" />
          <div className="about-photo-ov" />
          <div className="about-photo-bottom">
            <div className="about-blockquote">
              "If God had not arrested me with the drama of the Celestial Church, He would have lost me to atheism."
            </div>
            <div className="about-quote-by">— Dr. Kunle Hamilton</div>
          </div>
        </div>
      </R>

      {/* Text */}
      <div className="about-body">
        <R><div className="stag">The Man Behind the Ministry</div></R>
        <div style={{ overflow: "hidden" }}>
          <WordReveal text="A Philosopher" className="sh2" delay={0.1} />
          <WordReveal text="Who Found" className="sh2" delay={0.2} />
          <WordReveal text="God." className="sh2" delay={0.3} italic />
        </div>
        <R delay={0.2}>
          <div style={{ height: 1, background: "var(--ash2)", margin: "2rem 0" }} />
          <p>Dr. Kunle Hamilton is one of Nigeria's most remarkable multi-disciplinary voices — <strong>a Prophet of the Celestial Church of Christ</strong>, veteran journalist, media executive, and international author whose reach spans four continents.</p>
          <p>A <strong>Philosophy first-class graduate</strong> (Best Student, 1985) and Mass Communication scholar from the University of Lagos, he fuses rigorous academic thought with prophetic grace — a ministry defined by discipleship and the empowerment of nations.</p>
        </R>
        <R delay={0.3}>
          <div className="cred-grid">
            {[
              ["Senior Shepherd", "CCC PraiseVille — 4 Nations"],
              ["Founder & President", "ShaddaiVille Ministries Int'l"],
              ["CEO", "Virgin Outdoor, Lagos"],
              ["International Author", "18 Countries Published"],
            ].map(([t, v], i) => (
              <div className="cred-cell" key={i}>
                <div className="cred-title">{t}</div>
                <div className="cred-sub">{v}</div>
              </div>
            ))}
          </div>
        </R>
        <R delay={0.4}><a className="btn-fill" href="#contact" style={{ display: "inline-block" }}>Connect with Dr. Hamilton</a></R>
      </div>
    </section>
  );
}

/* ─── STATS ──────────────────────────────────────────────────────────────────── */
function Stats() {
  return (
    <div className="stats">
      {[{ n: "40", s: "+", l: "Years in Ministry" }, { n: "5", s: "", l: "Nations of Impact" }, { n: "2", s: "", l: "Thriving Ministries" }, { n: "18", s: "", l: "Countries Published" }].map((s, i) => (
        <motion.div key={i} className="stat"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7 }}>
          <div className="stat-num"><CountNum to={s.n} suffix={s.s} /></div>
          <div className="stat-label">{s.l}</div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── MINISTRIES ──────────────────────────────────────────────────────────────── */
function Ministries() {
  const panels = [
    {
      img: IMG1, kicker: "Celestial Church of Christ",
      name: "CCC PraiseVille", nameItalic: "Global",
      desc: "Founded in Berlin on May 8 2016, now flourishing across Nigeria, UK, USA and Germany. Authentic worship, genuine prophecy, deep fellowship.",
      facts: [{ n: "4+", l: "Countries" }, { n: "2016", l: "Founded" }, { n: "7+", l: "Annual Harvest" }]
    },
    {
      img: IMG2, kicker: "Non-Denominational · Global Training",
      name: "ShaddaiVille", nameItalic: "Ministries Int'l",
      desc: "\"God's City\" — UK-certified leadership & entrepreneurship since 2007. Free of charge. Christians and Muslims trained across 5 nations.",
      facts: [{ n: "5", l: "Nations" }, { n: "2007", l: "Founded" }, { n: "UK", l: "Certified Academy" }]
    }
  ];
  return (
    <section className="ministries" id="ministries">
      <div className="min-hd">
        <R><div className="stag">Twin Pillars of Purpose</div></R>
        <WordReveal text="The Ministries" className="sh2" delay={0.1} />
      </div>
      <div className="min-grid">
        {panels.map((m, i) => (
          <R key={i} x={i === 0 ? -20 : 20} y={0} delay={i * 0.1}>
            <div className="min-panel">
              <img src={m.img} className="min-photo" alt={m.name} />
              <div className="min-ov" />
              <div className="min-content">
                <div className="min-kicker">{m.kicker}</div>
                <div className="min-name">{m.name}<br /><em>{m.nameItalic}</em></div>
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

/* ─── VIDEOS ──────────────────────────────────────────────────────────────────── */
function Videos() {
  const vids = [
    { url: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fcelestial.focus%2Fvideos%2F1356642479037237&show_text=false", tag: "Discipleship · Teaching", title: "Dr. Kunle Hamilton Teaches Discipleship", src: "CelestialFocus · Facebook" },
    { url: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fhephzibahtelevision%2Fvideos%2F449065333576250&show_text=false", tag: "Leadership · Interview", title: "Meeting with Dr. Hamilton — The Roles of Leadership", src: "Hephzibah Television" },
    { url: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fcelestial.focus%2Fvideos%2F1241668604555889&show_text=false", tag: "Worship · Celebration", title: "Christmas — CCC PraiseVille Highlight", src: "CelestialFocus · Facebook" },
  ];
  return (
    <section className="videos" id="videos">
      <div className="vids-top">
        <div className="vids-hd">
          <R><div className="stag">Teachings · Sermons · Interviews</div></R>
          <div style={{ overflow: "hidden" }}>
            <WordReveal text="Watch" className="sh2" delay={0.1} />
            <WordReveal text="Dr. Hamilton" className="sh2" delay={0.18} />
            <WordReveal text="In Action" className="sh2" delay={0.26} italic />
          </div>
          <R delay={0.3}><div style={{ marginTop: "2rem" }}><a className="btn-fill" href="#contact">Attend a Service</a></div></R>
        </div>
        <R y={0} x={24}>
          <div className="vids-featured">
            <iframe className="v-frame" src={vids[0].url} scrolling="no" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" title={vids[0].title} />
            <div className="v-meta">
              <span className="v-tag">{vids[0].tag}</span>
              <div className="v-title">{vids[0].title}</div>
            </div>
          </div>
        </R>
      </div>
      <div className="vids-grid">
        {vids.slice(1).map((v, i) => (
          <R key={i} delay={i * 0.1}>
            <div className="vg">
              <iframe className="v-frame" src={v.url} scrolling="no" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" title={v.title} />
              <div className="v-meta">
                <span className="v-tag">{v.tag}</span>
                <div className="v-title">{v.title}</div>
                <div className="vg v-src">{v.src}</div>
              </div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ─── BOOKS ──────────────────────────────────────────────────────────────────── */
function Books() {
  return (
    <section className="books" id="books">
      <div className="books-hd">
        <R><div className="stag">Written Works</div></R>
        <div style={{ overflow: "hidden" }}>
          <WordReveal text="Books &" className="sh2" delay={0.1} />
          <WordReveal text="Publications" className="sh2" delay={0.18} italic />
        </div>
      </div>
      <div className="books-grid">
        {[
          { tag: "Leadership", title: "Releasing the", titleEm: "Eagle in You", p: "An eight-chapter inspirational work on leadership and self-actualization — unlocking the greatness God placed within every person. Published internationally across 18 countries." },
          { tag: "Philosophy", title: "Journey to", titleEm: "Understanding", p: "A philosophical investigation of how style and content impact the spoken word, using the church and Raypower 100.5 FM as its remarkable canvas." },
          { tag: "Ministry", title: "The ShaddaiVille", titleEm: "Vision", p: "Dr. Hamilton's framework for discipleship-driven ministry that transcends denominational walls — building leaders and moral beacons across faith traditions." },
        ].map((b, i) => (
          <R key={i} delay={i * 0.12}>
            <div className="bk">
              <div className="bk-num">0{i + 1}</div>
              <div className="bk-tag">{b.tag}</div>
              <div className="bk-title">{b.title} <em>{b.titleEm}</em></div>
              <div className="bk-p">{b.p}</div>
              <a className="bk-link" href="#contact">Order a Copy →</a>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ─── SPEAKING ──────────────────────────────────────────────────────────────── */
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
          <div style={{ overflow: "hidden" }}>
            <WordReveal text="Speaking &" className="sh2" delay={0.1} />
            <WordReveal text="Appearances" className="sh2" delay={0.18} italic />
          </div>
          <R delay={0.25}>
            <div className="sp-pull">
              <div className="sp-pull-text">"The responsibility of religious leaders is to guide young people towards righteousness — not to encourage them to chase fame through questionable means."</div>
              <div className="sp-pull-by">— Dr. Kunle Hamilton</div>
            </div>
          </R>
          <R delay={0.35}><div style={{ marginTop: "2rem" }}><a className="btn-fill" href="#contact">Invite Dr. Hamilton</a></div></R>
        </div>
        <div className="ev-list">
          {evs.map((e, i) => (
            <R key={i} delay={i * 0.08} x={20} y={0}>
              <div className="ev">
                <div className="ev-dt">
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
      </div>
    </section>
  );
}

/* ─── CONTACT ──────────────────────────────────────────────────────────────── */
function Contact() {
  const [f, setF] = useState({ name: "", email: "", inquiry: "speaking", msg: "" });
  const [sent, setSent] = useState(false);
  return (
    <section className="contact" id="contact">
      <div className="ct-inner">
        <R x={-20} y={0}>
          <div className="ct-photo">
            <img src={IMG2} alt="Dr. Kunle Hamilton" />
            <div className="ct-photo-ov" />
            <div className="ct-photo-label">
              <div className="ct-photo-title">Let's Connect</div>
              <div className="ct-photo-sub">Reach Dr. Hamilton's Team</div>
            </div>
          </div>
        </R>
        <R delay={0.15}>
          <div className="ct-form-side">
            <div className="stag">Get in Touch</div>
            <div style={{ overflow: "hidden" }}>
              <WordReveal text="Send a" className="sh2" delay={0.1} />
              <WordReveal text="Message" className="sh2" delay={0.18} italic />
            </div>
            <div className="ct-deets">
              {[
                ["Ministry", "CCC PraiseVille Global · ShaddaiVille International"],
                ["Based In", "Lagos, Nigeria · Berlin · London · USA"],
                ["Media & PR", "Virgin Outdoor Communications, Lagos"],
              ].map(([l, v], i) => (
                <div className="ctd" key={i}>
                  <div className="ctd-dash" />
                  <div><div className="ctd-lbl">{l}</div><div className="ctd-val">{v}</div></div>
                </div>
              ))}
            </div>
            {sent ? (
              <motion.div className="sent-box" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
                <div className="sent-icon">✓</div>
                <div className="sent-title">Message Received</div>
                <div className="sent-sub">Dr. Hamilton's team will be in touch shortly.</div>
              </motion.div>
            ) : (
              <form className="cform" onSubmit={e => { e.preventDefault(); setSent(true); }}>
                <div className="crow">
                  <div className="cfg"><label className="cfl">Full Name</label><input className="cfi" placeholder="Your name" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} required /></div>
                  <div className="cfg"><label className="cfl">Email</label><input className="cfi" type="email" placeholder="your@email.com" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} required /></div>
                </div>
                <div className="cfg">
                  <label className="cfl">Nature of Inquiry</label>
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

/* ─── FOOTER ──────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="footer">
      <div className="ft-top">
        <div className="ft-col">
          <div className="ft-logo">Dr. Kunle Hamilton</div>
          <div className="ft-tagline">Prophet · Scholar · Shepherd · Author · Media Veteran. Serving God and humanity across five nations.</div>
          <div className="ft-rule" />
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

/* ─── APP ──────────────────────────────────────────────────────────────────── */
export default function App() {
  return (<>
    <Styles />
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
  </>);
}
