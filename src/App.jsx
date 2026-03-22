import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";

// ─── GOOGLE FONTS ──────────────────────────────────────────────────────────────
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=Cormorant:ital,wght@0,300;1,300&display=swap');

    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --ivory:       #FAF8F3;
      --cream:       #F2EDE3;
      --parchment:   #E8E0D0;
      --gold:        #B8952A;
      --gold-light:  #D4AF54;
      --gold-muted:  #C9A84C;
      --obsidian:    #0D0D0D;
      --ink:         #1A1614;
      --slate:       #3D3530;
      --mist:        #7A7068;
      --white:       #FFFFFF;
      --praiseville: #1C2B4A;
      --shaddai:     #2A1C0D;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: var(--ivory);
      color: var(--ink);
      overflow-x: hidden;
      cursor: none;
    }

    /* Custom cursor */
    .cursor {
      position: fixed;
      width: 8px; height: 8px;
      background: var(--gold);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.1s ease;
      mix-blend-mode: multiply;
    }
    .cursor-ring {
      position: fixed;
      width: 36px; height: 36px;
      border: 1px solid var(--gold);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transition: transform 0.25s ease, width 0.2s, height 0.2s;
      mix-blend-mode: multiply;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: var(--cream); }
    ::-webkit-scrollbar-thumb { background: var(--gold); }

    /* Nav */
    .nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      padding: 1.5rem 4rem;
      display: flex; align-items: center; justify-content: space-between;
      transition: background 0.4s ease, backdrop-filter 0.4s;
    }
    .nav.scrolled {
      background: rgba(250,248,243,0.92);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(184,149,42,0.15);
    }
    .nav-logo {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.1rem;
      font-weight: 500;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--ink);
      text-decoration: none;
    }
    .nav-logo span { color: var(--gold); }
    .nav-links { display: flex; gap: 2.5rem; align-items: center; }
    .nav-link {
      font-size: 0.72rem;
      font-weight: 500;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--slate);
      text-decoration: none;
      position: relative;
      cursor: none;
    }
    .nav-link::after {
      content: '';
      position: absolute; bottom: -3px; left: 0;
      width: 0; height: 1px;
      background: var(--gold);
      transition: width 0.3s ease;
    }
    .nav-link:hover::after { width: 100%; }
    .nav-link:hover { color: var(--ink); }
    .nav-cta {
      font-size: 0.68rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-weight: 500;
      color: var(--white);
      background: var(--obsidian);
      padding: 0.65rem 1.6rem;
      text-decoration: none;
      cursor: none;
      transition: background 0.3s, color 0.3s;
    }
    .nav-cta:hover { background: var(--gold); }

    /* Hero */
    .hero {
      min-height: 100vh;
      background: var(--ivory);
      display: grid;
      grid-template-columns: 1fr 1fr;
      position: relative;
      overflow: hidden;
    }
    .hero-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 10rem 4rem 6rem 6rem;
      position: relative;
      z-index: 2;
    }
    .hero-eyebrow {
      font-size: 0.68rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--gold);
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2.5rem;
    }
    .hero-eyebrow::before {
      content: '';
      display: block;
      width: 40px; height: 1px;
      background: var(--gold);
    }
    .hero-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(4rem, 7vw, 7.5rem);
      font-weight: 300;
      line-height: 0.95;
      color: var(--ink);
      letter-spacing: -0.02em;
      margin-bottom: 0.5rem;
    }
    .hero-title em {
      font-style: italic;
      color: var(--gold);
    }
    .hero-title .dr {
      font-size: 0.45em;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-style: normal;
      font-weight: 500;
      display: block;
      color: var(--mist);
      margin-bottom: 0.5rem;
    }
    .hero-subtitle {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(1rem, 1.6vw, 1.4rem);
      font-weight: 300;
      font-style: italic;
      color: var(--mist);
      margin: 2rem 0 3rem;
      line-height: 1.6;
      max-width: 480px;
    }
    .hero-actions { display: flex; gap: 1.2rem; align-items: center; }
    .btn-primary {
      font-size: 0.68rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-weight: 500;
      color: var(--white);
      background: var(--obsidian);
      padding: 1rem 2.5rem;
      text-decoration: none;
      cursor: none;
      transition: background 0.3s;
      display: inline-block;
    }
    .btn-primary:hover { background: var(--gold); }
    .btn-ghost {
      font-size: 0.68rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-weight: 500;
      color: var(--ink);
      text-decoration: none;
      display: flex; align-items: center; gap: 0.6rem;
      cursor: none;
    }
    .btn-ghost::after {
      content: '→';
      transition: transform 0.3s;
    }
    .btn-ghost:hover::after { transform: translateX(5px); }

    .hero-right {
      position: relative;
      overflow: hidden;
      background: var(--cream);
    }
    .hero-image-placeholder {
      width: 100%; height: 100%;
      background: linear-gradient(135deg, var(--cream) 0%, var(--parchment) 50%, var(--cream) 100%);
      display: flex; align-items: center; justify-content: center;
      position: relative;
    }
    .hero-monogram {
      font-family: 'Cormorant Garamond', serif;
      font-size: 22rem;
      font-weight: 300;
      color: rgba(184,149,42,0.08);
      line-height: 1;
      user-select: none;
      position: absolute;
    }
    .hero-cross {
      width: 2px; height: 180px;
      background: linear-gradient(to bottom, transparent, var(--gold), transparent);
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
    }
    .hero-cross::after {
      content: '';
      position: absolute;
      height: 2px; width: 80px;
      background: linear-gradient(to right, transparent, var(--gold), transparent);
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
    }
    .hero-ornament {
      position: absolute;
      font-family: 'Cormorant Garamond', serif;
      font-size: 0.65rem;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: var(--gold);
      writing-mode: vertical-rl;
      right: 2rem; top: 50%; transform: translateY(-50%);
    }

    /* Gold line divider */
    .gold-line {
      width: 60px; height: 1px;
      background: var(--gold);
      margin: 0 auto 1.5rem;
    }

    /* Section base */
    section { position: relative; }

    /* Credentials strip */
    .credentials {
      background: var(--obsidian);
      padding: 2rem 6rem;
      display: flex;
      gap: 0; align-items: stretch;
      overflow: hidden;
    }
    .credential-item {
      flex: 1;
      text-align: center;
      padding: 1.5rem 2rem;
      border-right: 1px solid rgba(184,149,42,0.2);
    }
    .credential-item:last-child { border-right: none; }
    .credential-number {
      font-family: 'Cormorant Garamond', serif;
      font-size: 3rem;
      font-weight: 300;
      color: var(--gold-light);
      line-height: 1;
      margin-bottom: 0.4rem;
    }
    .credential-label {
      font-size: 0.6rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.4);
    }

    /* About */
    .about {
      padding: 10rem 6rem;
      display: grid;
      grid-template-columns: 1fr 1.4fr;
      gap: 8rem;
      align-items: center;
      background: var(--ivory);
    }
    .section-label {
      font-size: 0.62rem;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: var(--gold);
      font-weight: 500;
      display: flex; align-items: center; gap: 1rem;
      margin-bottom: 2rem;
    }
    .section-label::before {
      content: '';
      width: 30px; height: 1px;
      background: var(--gold);
    }
    .section-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2.8rem, 4.5vw, 5rem);
      font-weight: 300;
      line-height: 1.05;
      color: var(--ink);
      letter-spacing: -0.01em;
    }
    .section-title em { font-style: italic; color: var(--gold); }
    .about-visual {
      position: relative;
      height: 600px;
    }
    .about-card {
      position: absolute;
      background: var(--obsidian);
      padding: 2.5rem;
      bottom: 0; right: -2rem;
      width: 280px;
    }
    .about-card-quote {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.3rem;
      font-style: italic;
      font-weight: 300;
      color: var(--white);
      line-height: 1.5;
      margin-bottom: 1.2rem;
    }
    .about-card-attr {
      font-size: 0.6rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--gold);
    }
    .about-frame {
      position: absolute;
      top: 0; left: 0;
      width: calc(100% - 4rem);
      height: calc(100% - 4rem);
      background: var(--cream);
      border: 1px solid var(--parchment);
      display: flex; align-items: center; justify-content: center;
      overflow: hidden;
    }
    .frame-monogram {
      font-family: 'Cormorant Garamond', serif;
      font-size: 14rem;
      font-weight: 300;
      color: rgba(184,149,42,0.07);
      position: absolute;
    }
    .frame-cross-v {
      width: 1px; height: 120px;
      background: linear-gradient(to bottom, transparent, var(--gold), transparent);
    }
    .about-body {
      padding-top: 1rem;
    }
    .about-text {
      font-size: 1.05rem;
      line-height: 1.85;
      color: var(--slate);
      font-weight: 300;
      margin-bottom: 1.5rem;
    }
    .about-roles {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      margin: 2.5rem 0;
      border-left: 2px solid var(--gold);
      padding-left: 1.5rem;
    }
    .about-role {
      font-size: 0.8rem;
      letter-spacing: 0.08em;
      color: var(--slate);
      font-weight: 400;
    }
    .about-role strong {
      color: var(--ink);
      display: block;
      font-size: 0.95rem;
      margin-bottom: 0.1rem;
    }

    /* Books */
    .books {
      background: var(--obsidian);
      padding: 10rem 6rem;
    }
    .books-header { text-align: center; margin-bottom: 5rem; }
    .books-header .section-label { justify-content: center; }
    .books-header .section-label::before { display: none; }
    .books-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(3rem, 5vw, 5.5rem);
      font-weight: 300;
      color: var(--white);
      line-height: 1;
    }
    .books-title em { font-style: italic; color: var(--gold-light); }
    .books-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2px;
    }
    .book-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(184,149,42,0.1);
      padding: 3rem 2.5rem;
      transition: background 0.4s, border-color 0.4s;
      cursor: none;
    }
    .book-card:hover {
      background: rgba(184,149,42,0.05);
      border-color: rgba(184,149,42,0.3);
    }
    .book-icon {
      width: 48px; height: 60px;
      border: 1px solid rgba(184,149,42,0.3);
      margin-bottom: 2rem;
      display: flex; align-items: center; justify-content: center;
      position: relative;
    }
    .book-icon::before {
      content: '';
      position: absolute;
      left: 6px; top: 0; bottom: 0;
      width: 3px;
      background: linear-gradient(to bottom, var(--gold), rgba(184,149,42,0.3));
    }
    .book-icon-text {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.2rem;
      color: var(--gold-light);
      margin-left: 6px;
    }
    .book-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.6rem;
      font-weight: 400;
      color: var(--white);
      line-height: 1.2;
      margin-bottom: 1rem;
    }
    .book-desc {
      font-size: 0.82rem;
      line-height: 1.7;
      color: rgba(255,255,255,0.45);
      font-weight: 300;
      margin-bottom: 2rem;
    }
    .book-link {
      font-size: 0.62rem;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: var(--gold-light);
      text-decoration: none;
      display: flex; align-items: center; gap: 0.6rem;
      cursor: none;
    }
    .book-link:hover { color: var(--white); }

    /* Ministries */
    .ministries {
      padding: 10rem 0;
      background: var(--ivory);
    }
    .ministries-header {
      text-align: center;
      padding: 0 6rem;
      margin-bottom: 6rem;
    }
    .ministries-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
    .ministry-panel {
      padding: 6rem;
      position: relative;
      overflow: hidden;
      min-height: 70vh;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
    .ministry-panel.praiseville {
      background: var(--praiseville);
    }
    .ministry-panel.shaddai {
      background: var(--shaddai);
    }
    .ministry-bg-text {
      position: absolute;
      top: 2rem; left: 3rem;
      font-family: 'Cormorant Garamond', serif;
      font-size: 12rem;
      font-weight: 300;
      color: rgba(255,255,255,0.03);
      line-height: 1;
      user-select: none;
      pointer-events: none;
    }
    .ministry-eyebrow {
      font-size: 0.6rem;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: var(--gold-light);
      margin-bottom: 1.5rem;
      display: flex; align-items: center; gap: 0.8rem;
    }
    .ministry-eyebrow::before {
      content: '';
      width: 24px; height: 1px;
      background: var(--gold-light);
    }
    .ministry-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2.5rem, 4vw, 4rem);
      font-weight: 300;
      color: var(--white);
      line-height: 1.1;
      margin-bottom: 1.5rem;
    }
    .ministry-name em { font-style: italic; color: var(--gold-light); }
    .ministry-desc {
      font-size: 0.85rem;
      line-height: 1.8;
      color: rgba(255,255,255,0.5);
      font-weight: 300;
      max-width: 420px;
      margin-bottom: 2.5rem;
    }
    .ministry-facts {
      display: flex; gap: 2rem;
      margin-bottom: 2.5rem;
    }
    .ministry-fact-num {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2.5rem;
      font-weight: 300;
      color: var(--gold-light);
      line-height: 1;
    }
    .ministry-fact-label {
      font-size: 0.58rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.35);
      margin-top: 0.3rem;
    }
    .ministry-btn {
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-weight: 500;
      color: var(--white);
      border: 1px solid rgba(255,255,255,0.2);
      padding: 0.9rem 2rem;
      text-decoration: none;
      display: inline-block;
      cursor: none;
      transition: border-color 0.3s, background 0.3s;
      align-self: flex-start;
    }
    .ministry-btn:hover {
      border-color: var(--gold-light);
      background: rgba(184,149,42,0.1);
    }

    /* Speaking */
    .speaking {
      background: var(--cream);
      padding: 10rem 6rem;
    }
    .speaking-grid {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 8rem;
      align-items: start;
    }
    .events-list { display: flex; flex-direction: column; }
    .event-item {
      display: grid;
      grid-template-columns: 80px 1fr;
      gap: 2rem;
      padding: 2rem 0;
      border-bottom: 1px solid var(--parchment);
      transition: border-color 0.3s;
    }
    .event-item:hover { border-color: var(--gold); }
    .event-date {
      text-align: center;
      padding-top: 0.3rem;
    }
    .event-day {
      font-family: 'Cormorant Garamond', serif;
      font-size: 2.8rem;
      font-weight: 300;
      color: var(--gold);
      line-height: 1;
    }
    .event-month {
      font-size: 0.6rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--mist);
    }
    .event-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.3rem;
      font-weight: 400;
      color: var(--ink);
      margin-bottom: 0.4rem;
      line-height: 1.2;
    }
    .event-meta {
      font-size: 0.75rem;
      color: var(--mist);
      display: flex; gap: 1rem;
    }
    .speaking-quote {
      position: sticky;
      top: 8rem;
    }
    .big-quote {
      font-family: 'Cormorant Garamond', serif;
      font-size: 5rem;
      color: var(--gold);
      line-height: 1;
      margin-bottom: -1rem;
      opacity: 0.4;
    }
    .quote-text {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(1.6rem, 2.5vw, 2.2rem);
      font-weight: 300;
      font-style: italic;
      color: var(--ink);
      line-height: 1.5;
      margin-bottom: 2rem;
    }

    /* Media */
    .media-section {
      background: var(--ivory);
      padding: 10rem 6rem;
    }
    .media-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
      margin-top: 4rem;
    }
    .media-card {
      border: 1px solid var(--parchment);
      overflow: hidden;
      transition: border-color 0.3s, transform 0.3s;
      cursor: none;
      background: var(--white);
    }
    .media-card:hover {
      border-color: var(--gold);
      transform: translateY(-4px);
    }
    .media-thumb {
      height: 200px;
      background: var(--cream);
      display: flex; align-items: center; justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .media-thumb-bg {
      position: absolute; inset: 0;
      background: linear-gradient(135deg, var(--cream), var(--parchment));
    }
    .play-icon {
      width: 56px; height: 56px;
      border: 1px solid var(--gold);
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      position: relative; z-index: 1;
      transition: background 0.3s;
    }
    .media-card:hover .play-icon { background: var(--gold); }
    .play-icon::after {
      content: '▶';
      font-size: 0.8rem;
      color: var(--gold);
      margin-left: 3px;
    }
    .media-card:hover .play-icon::after { color: var(--white); }
    .media-tag {
      position: absolute;
      top: 1rem; left: 1rem;
      font-size: 0.55rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--white);
      background: var(--obsidian);
      padding: 0.3rem 0.7rem;
      z-index: 1;
    }
    .media-info { padding: 1.5rem; }
    .media-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.15rem;
      font-weight: 400;
      color: var(--ink);
      line-height: 1.3;
      margin-bottom: 0.5rem;
    }
    .media-meta {
      font-size: 0.7rem;
      color: var(--mist);
      letter-spacing: 0.05em;
    }

    /* Contact */
    .contact {
      background: var(--obsidian);
      padding: 10rem 6rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8rem;
      align-items: center;
    }
    .contact-left .section-title { color: var(--white); }
    .contact-left .section-title em { color: var(--gold-light); }
    .contact-desc {
      font-size: 0.9rem;
      line-height: 1.8;
      color: rgba(255,255,255,0.45);
      font-weight: 300;
      margin: 2rem 0 3rem;
    }
    .contact-detail {
      display: flex; gap: 1.2rem;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }
    .contact-icon {
      width: 36px; height: 36px;
      border: 1px solid rgba(184,149,42,0.3);
      display: flex; align-items: center; justify-content: center;
      font-size: 0.7rem;
      color: var(--gold-light);
      flex-shrink: 0;
    }
    .contact-detail-label {
      font-size: 0.58rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.3);
      margin-bottom: 0.2rem;
    }
    .contact-detail-value {
      font-size: 0.85rem;
      color: rgba(255,255,255,0.7);
    }
    .contact-form { display: flex; flex-direction: column; gap: 1.2rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .form-label {
      font-size: 0.58rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.4);
    }
    .form-input, .form-select, .form-textarea {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.1);
      padding: 0.9rem 1rem;
      color: var(--white);
      font-family: 'DM Sans', sans-serif;
      font-size: 0.85rem;
      font-weight: 300;
      outline: none;
      transition: border-color 0.3s;
      width: 100%;
    }
    .form-input:focus, .form-select:focus, .form-textarea:focus {
      border-color: var(--gold-muted);
    }
    .form-select option { background: var(--obsidian); }
    .form-textarea { resize: vertical; min-height: 120px; }
    .form-submit {
      font-size: 0.68rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      font-weight: 500;
      color: var(--obsidian);
      background: var(--gold-light);
      padding: 1.1rem 2.5rem;
      border: none;
      cursor: none;
      transition: background 0.3s;
      align-self: flex-start;
      font-family: 'DM Sans', sans-serif;
    }
    .form-submit:hover { background: var(--white); }

    /* Footer */
    .footer {
      background: #080808;
      padding: 5rem 6rem 3rem;
    }
    .footer-top {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 4rem;
      padding-bottom: 4rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      margin-bottom: 3rem;
    }
    .footer-brand {
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.4rem;
      font-weight: 400;
      color: var(--white);
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
    }
    .footer-brand span { color: var(--gold-light); }
    .footer-tagline {
      font-size: 0.78rem;
      line-height: 1.7;
      color: rgba(255,255,255,0.3);
      font-weight: 300;
      margin-bottom: 2rem;
    }
    .footer-col-title {
      font-size: 0.58rem;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: var(--gold-light);
      margin-bottom: 1.5rem;
    }
    .footer-link {
      display: block;
      font-size: 0.8rem;
      color: rgba(255,255,255,0.35);
      text-decoration: none;
      margin-bottom: 0.8rem;
      transition: color 0.3s;
      cursor: none;
    }
    .footer-link:hover { color: var(--white); }
    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer-copy {
      font-size: 0.7rem;
      color: rgba(255,255,255,0.2);
      letter-spacing: 0.05em;
    }
    .footer-gold-line {
      width: 40px; height: 1px;
      background: var(--gold-light);
      opacity: 0.4;
    }

    /* Scroll reveal utility */
    .reveal { opacity: 0; transform: translateY(30px); }

    /* Noise overlay */
    .noise {
      position: fixed; inset: 0;
      pointer-events: none; z-index: 1000;
      opacity: 0.025;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    }

    @media (max-width: 1024px) {
      .hero { grid-template-columns: 1fr; }
      .hero-right { display: none; }
      .hero-left { padding: 8rem 3rem 5rem; }
      .about { grid-template-columns: 1fr; gap: 4rem; padding: 6rem 3rem; }
      .about-visual { height: 350px; }
      .credentials { padding: 2rem 3rem; flex-wrap: wrap; }
      .books-grid { grid-template-columns: 1fr; }
      .ministries-grid { grid-template-columns: 1fr; }
      .speaking-grid { grid-template-columns: 1fr; gap: 4rem; }
      .media-grid { grid-template-columns: 1fr 1fr; }
      .contact { grid-template-columns: 1fr; gap: 4rem; padding: 6rem 3rem; }
      .footer-top { grid-template-columns: 1fr 1fr; }
      .nav { padding: 1.5rem 2rem; }
      .nav-links { gap: 1.5rem; }
    }
  `}</style>
);

// ─── ANIMATION VARIANTS ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }
  })
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.9, delay: i * 0.1, ease: "easeOut" }
  })
};
const lineGrow = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }
};

// ─── REVEAL WRAPPER ────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, direction = "up", className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const yVal = direction === "up" ? 40 : direction === "down" ? -40 : 0;
  const xVal = direction === "left" ? 40 : direction === "right" ? -40 : 0;
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: yVal, x: xVal }}
      animate={inView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── NAV ───────────────────────────────────────────────────────────────────────
function Nav({ active, setActive }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = ["About","Books","Ministries","Speaking","Media","Contact"];
  return (
    <motion.nav
      className={`nav ${scrolled ? "scrolled" : ""}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <a className="nav-logo" href="#home">
        Dr. Kunle <span>Hamilton</span>
      </a>
      <div className="nav-links">
        {links.map(l => (
          <a
            key={l}
            className="nav-link"
            href={`#${l.toLowerCase()}`}
            onClick={() => setActive(l)}
          >
            {l}
          </a>
        ))}
        <a className="nav-cta" href="#contact">Book a Session</a>
      </div>
    </motion.nav>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  return (
    <section className="hero" id="home">
      <div className="hero-left">
        <motion.div
          className="hero-eyebrow"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Prophet · Author · Media Veteran · Shepherd
        </motion.div>
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="dr">Dr.</span>
          Kunle<br /><em>Hamilton</em>
        </motion.h1>
        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
        >
          A voice that bridges faith, scholarship, and culture — transforming lives across continents through ministry, mentorship, and media.
        </motion.p>
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <a className="btn-primary" href="#about">Discover His Legacy</a>
          <a className="btn-ghost" href="#media">Watch & Listen</a>
        </motion.div>
      </div>
      <div className="hero-right">
        <motion.div
          className="hero-image-placeholder"
          style={{ y, opacity }}
        >
          <div className="hero-monogram">KH</div>
          <div className="hero-cross" />
          <div className="hero-ornament">PraiseVille Global · ShaddaiVille Ministries</div>
        </motion.div>
      </div>
      {/* Animated gold line across bottom */}
      <motion.div
        style={{
          position: "absolute", bottom: 0, left: 0,
          height: "2px", background: "var(--gold)",
          transformOrigin: "left"
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </section>
  );
}

// ─── CREDENTIALS ───────────────────────────────────────────────────────────────
function Credentials() {
  const stats = [
    { num: "40+", label: "Years in Ministry" },
    { num: "5", label: "Countries of Impact" },
    { num: "2", label: "Thriving Ministries" },
    { num: "∞", label: "Lives Transformed" },
  ];
  return (
    <Reveal>
      <div className="credentials">
        {stats.map((s, i) => (
          <div className="credential-item" key={i}>
            <div className="credential-number">{s.num}</div>
            <div className="credential-label">{s.label}</div>
          </div>
        ))}
      </div>
    </Reveal>
  );
}

// ─── ABOUT ─────────────────────────────────────────────────────────────────────
function About() {
  return (
    <section className="about" id="about">
      <div className="about-visual">
        <Reveal direction="left">
          <div className="about-frame">
            <div className="frame-monogram">KH</div>
            <div className="frame-cross-v" />
          </div>
        </Reveal>
        <Reveal delay={0.3} direction="right">
          <div className="about-card">
            <div className="about-card-quote">
              "God didn't choose Germany. Germany chose me. Better still — God made this a successful missionary journey."
            </div>
            <div className="about-card-attr">— Dr. Kunle Hamilton</div>
          </div>
        </Reveal>
      </div>

      <div className="about-body">
        <Reveal>
          <div className="section-label">The Man Behind the Ministry</div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="section-title">
            A Prophet. A Scholar.<br /><em>A Shepherd.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="about-text">
            Dr. Kunle Hamilton is one of Nigeria's most remarkable multi-disciplinary voices — a prophet of the Celestial Church of Christ, a veteran journalist, a reputation management expert, and a transformative spiritual leader whose reach extends across four continents.
          </p>
          <p className="about-text">
            A Philosophy graduate and Mass Communication scholar from the University of Lagos, Dr. Hamilton fuses rigorous academic thinking with prophetic grace. His is a ministry of discipleship, not spectacle — of nation-building through faith, education, and empowerment.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="about-roles">
            <div className="about-role">
              <strong>Senior Shepherd — CCC PraiseVille Global</strong>
              Celestial Church parishes in Nigeria, Germany, UK & USA
            </div>
            <div className="about-role">
              <strong>Founder & President — ShaddaiVille Ministries International</strong>
              Non-denominational discipleship, leadership & entrepreneurship training
            </div>
            <div className="about-role">
              <strong>CEO — Virgin Outdoor</strong>
              Lagos-based perception management & brand communication consultancy
            </div>
            <div className="about-role">
              <strong>International Author</strong>
              Published in 18 countries across Europe by Lambert Academic Publishing
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.4}>
          <a className="btn-primary" href="#contact" style={{ display: "inline-block" }}>
            Connect with Dr. Hamilton
          </a>
        </Reveal>
      </div>
    </section>
  );
}

// ─── BOOKS ─────────────────────────────────────────────────────────────────────
function Books() {
  const books = [
    {
      title: "Releasing the Eagle in You",
      desc: "An eight-chapter inspirational work on leadership and self-actualization — a guide to unlocking the greatness God has placed within every person.",
      tag: "Leadership"
    },
    {
      title: "Journey to Understanding",
      desc: "A philosophical investigation of how style and content impact the spoken word, using the church and radio broadcasting as its remarkable canvas.",
      tag: "Philosophy"
    },
    {
      title: "The ShaddaiVille Mandate",
      desc: "Dr. Hamilton's vision for discipleship-driven ministry that transcends denominational walls, building leaders across faith traditions and vocations.",
      tag: "Ministry"
    }
  ];
  return (
    <section className="books" id="books">
      <div className="books-header">
        <Reveal><div className="section-label" style={{ color: "var(--gold-light)", justifyContent: "center" }}>Written Works</div></Reveal>
        <Reveal delay={0.1}>
          <h2 className="books-title">Books & <em>Publications</em></h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.85rem", marginTop: "1rem", fontWeight: 300, maxWidth: 520, margin: "1rem auto 0" }}>
            Words that have crossed oceans. Truths that have shaped generations.
          </p>
        </Reveal>
      </div>
      <div className="books-grid">
        {books.map((b, i) => (
          <Reveal delay={i * 0.15} key={i}>
            <div className="book-card">
              <div className="book-icon">
                <span className="book-icon-text">{b.tag[0]}</span>
              </div>
              <div style={{ fontSize: "0.58rem", letterSpacing: "0.25em", textTransform: "uppercase", color: "var(--gold-light)", marginBottom: "0.8rem" }}>{b.tag}</div>
              <div className="book-title">{b.title}</div>
              <div className="book-desc">{b.desc}</div>
              <a className="book-link" href="#contact">Request a Copy →</a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─── MINISTRIES ────────────────────────────────────────────────────────────────
function Ministries() {
  return (
    <section className="ministries" id="ministries">
      <div className="ministries-header">
        <Reveal><div className="section-label">Twin Pillars of Purpose</div></Reveal>
        <Reveal delay={0.1}>
          <h2 className="section-title">The <em>Ministries</em></h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p style={{ color: "var(--mist)", fontSize: "0.88rem", marginTop: "1rem", fontWeight: 300, maxWidth: 540, margin: "1rem auto 0" }}>
            Two expressions of one divine mandate — rooted in worship, growing in grace, expanding in love.
          </p>
        </Reveal>
      </div>

      <div className="ministries-grid">
        {/* PraiseVille */}
        <Reveal direction="left">
          <div className="ministry-panel praiseville">
            <div className="ministry-bg-text">PV</div>
            <div className="ministry-eyebrow">Celestial Church of Christ</div>
            <div className="ministry-name">CCC<br /><em>PraiseVille</em><br />Global</div>
            <div className="ministry-desc">
              A spirit-filled Celestial Church community founded in Berlin, Germany in 2016 — and now flourishing in Nigeria, the UK, the USA and beyond. PraiseVille is a place of genuine worship, authentic prophecy, and transformational fellowship.
            </div>
            <div className="ministry-facts">
              <div>
                <div className="ministry-fact-num">4+</div>
                <div className="ministry-fact-label">Countries</div>
              </div>
              <div>
                <div className="ministry-fact-num">2016</div>
                <div className="ministry-fact-label">Founded Berlin</div>
              </div>
              <div>
                <div className="ministry-fact-num">7+</div>
                <div className="ministry-fact-label">Festival of the Word</div>
              </div>
            </div>
            <a className="ministry-btn" href="#contact">Visit PraiseVille →</a>
          </div>
        </Reveal>

        {/* ShaddaiVille */}
        <Reveal direction="right">
          <div className="ministry-panel shaddai">
            <div className="ministry-bg-text">SV</div>
            <div className="ministry-eyebrow">Non-Denominational · Leadership Training</div>
            <div className="ministry-name">ShaddaiVille<br /><em>Ministries</em><br />International</div>
            <div className="ministry-desc">
              "God's City" — a non-denominational discipleship movement training Christians and Muslims alike in UK-certificated leadership and entrepreneurship. Free of charge. Building moral beacons across nations since 2007.
            </div>
            <div className="ministry-facts">
              <div>
                <div className="ministry-fact-num">5</div>
                <div className="ministry-fact-label">Nations</div>
              </div>
              <div>
                <div className="ministry-fact-num">2007</div>
                <div className="ministry-fact-label">Est. Nigeria</div>
              </div>
              <div>
                <div className="ministry-fact-num">UK</div>
                <div className="ministry-fact-label">Certified Academy</div>
              </div>
            </div>
            <a className="ministry-btn" href="#contact">Explore ShaddaiVille →</a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── SPEAKING ──────────────────────────────────────────────────────────────────
function Speaking() {
  const events = [
    { day: "12", month: "Apr", name: "Festival of the Word — Annual Harvest", loc: "Lagos, Nigeria", type: "Worship & Teaching" },
    { day: "03", month: "May", name: "ShaddaiVille Leadership Retreat", loc: "London, United Kingdom", type: "Leadership Academy" },
    { day: "21", month: "Jun", name: "Teenagers' Motivational Summit", loc: "Berlin, Germany", type: "Youth Empowerment" },
    { day: "08", month: "Aug", name: "Ephphatha Non-Denominational Crusade", loc: "Lagos, Nigeria", type: "Evangelism" },
    { day: "15", month: "Sep", name: "Media & Ministry — Public Lecture", loc: "University of Lagos", type: "Academic" },
  ];
  return (
    <section className="speaking" id="speaking">
      <div className="speaking-grid">
        <div>
          <Reveal><div className="section-label">Events & Engagements</div></Reveal>
          <Reveal delay={0.1}><h2 className="section-title">Speaking &<br /><em>Appearances</em></h2></Reveal>
          <div className="events-list" style={{ marginTop: "3rem" }}>
            {events.map((e, i) => (
              <Reveal delay={i * 0.1} key={i}>
                <div className="event-item">
                  <div className="event-date">
                    <div className="event-day">{e.day}</div>
                    <div className="event-month">{e.month}</div>
                  </div>
                  <div>
                    <div className="event-name">{e.name}</div>
                    <div className="event-meta">
                      <span>📍 {e.loc}</span>
                      <span style={{ color: "var(--gold)" }}>· {e.type}</span>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="speaking-quote">
          <Reveal delay={0.3}>
            <div className="big-quote">"</div>
            <div className="quote-text">
              The responsibility of religious leaders is to guide young people towards righteousness — not to encourage them to chase fame through questionable means.
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: 40, height: 1, background: "var(--gold)" }} />
              <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--mist)" }}>Dr. Kunle Hamilton</span>
            </div>
            <div style={{ marginTop: "3rem" }}>
              <a className="btn-primary" href="#contact" style={{ display: "inline-block" }}>
                Invite Dr. Hamilton to Speak
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── MEDIA ─────────────────────────────────────────────────────────────────────
function Media() {
  const items = [
    { tag: "Sermon", title: "Discipleship: The Heart of the Gospel", meta: "CCC PraiseVille · 2025" },
    { tag: "Interview", title: "Social Media Can Make or Mar a Brand", meta: "Business Hallmark · Feature" },
    { tag: "Teaching", title: "The Roles of Leadership in the Church", meta: "Hephzibah Television" },
    { tag: "Sermon", title: "A Tribute to Professor Odeyemi at 89", meta: "CCC PraiseVille · 2020" },
    { tag: "Lecture", title: "Understanding Through Style & Content", meta: "Raypower 100.5 FM · Series" },
    { tag: "Teaching", title: "GOs & the Image of the Church Today", meta: "Sunday Telegraph Interview" },
  ];
  return (
    <section className="media-section" id="media">
      <div style={{ textAlign: "center" }}>
        <Reveal><div className="section-label" style={{ justifyContent: "center" }}>Sermons, Interviews & Teachings</div></Reveal>
        <Reveal delay={0.1}>
          <h2 className="section-title" style={{ fontSize: "clamp(2.8rem,5vw,5rem)" }}>
            Media & <em>Sermons</em>
          </h2>
        </Reveal>
      </div>
      <div className="media-grid">
        {items.map((m, i) => (
          <Reveal delay={i * 0.1} key={i}>
            <div className="media-card">
              <div className="media-thumb">
                <div className="media-thumb-bg" />
                <div className="media-tag">{m.tag}</div>
                <div className="play-icon" />
              </div>
              <div className="media-info">
                <div className="media-title">{m.title}</div>
                <div className="media-meta">{m.meta}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─── CONTACT ───────────────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", inquiry: "general", message: "" });
  const [sent, setSent] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); setSent(true); };

  return (
    <section className="contact" id="contact">
      <div className="contact-left">
        <Reveal><div className="section-label" style={{ color: "var(--gold-light)" }}>Get in Touch</div></Reveal>
        <Reveal delay={0.1}>
          <h2 className="section-title" style={{ color: "var(--white)" }}>
            Let's <em>Connect</em>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="contact-desc">
            For speaking engagements, ministry inquiries, media requests, book orders, or to reach Dr. Hamilton's team — reach out and we will respond with care.
          </p>
        </Reveal>
        {[
          { icon: "✦", label: "Ministry", value: "CCC PraiseVille Global · ShaddaiVille International" },
          { icon: "✦", label: "Based In", value: "Lagos, Nigeria · Berlin, Germany · London, UK" },
          { icon: "✦", label: "Media & PR", value: "Virgin Outdoor Communications, Lagos" },
        ].map((d, i) => (
          <Reveal delay={0.3 + i * 0.1} key={i}>
            <div className="contact-detail">
              <div className="contact-icon">{d.icon}</div>
              <div>
                <div className="contact-detail-label">{d.label}</div>
                <div className="contact-detail-value">{d.value}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div>
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center", padding: "4rem 2rem" }}
            >
              <div style={{ fontFamily: "Cormorant Garamond", fontSize: "4rem", color: "var(--gold-light)", marginBottom: "1rem" }}>✦</div>
              <div style={{ fontFamily: "Cormorant Garamond", fontSize: "2rem", color: "var(--white)", marginBottom: "1rem" }}>Message Received</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", fontWeight: 300 }}>Dr. Hamilton's team will be in touch with you shortly.</div>
            </motion.div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-input" placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Nature of Inquiry</label>
                <select className="form-select" value={form.inquiry} onChange={e => setForm({...form, inquiry: e.target.value})}>
                  <option value="speaking">Speaking Engagement</option>
                  <option value="ministry">Ministry / Church</option>
                  <option value="books">Books & Publications</option>
                  <option value="media">Media / Interview</option>
                  <option value="leadership">ShaddaiVille Leadership Academy</option>
                  <option value="general">General Enquiry</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input className="form-input" placeholder="Brief subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Your Message</label>
                <textarea className="form-textarea" placeholder="Share your request or message here..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} required />
              </div>
              <button className="form-submit" type="submit">Send Message →</button>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div>
          <div className="footer-brand">Dr. Kunle <span>Hamilton</span></div>
          <div className="footer-tagline">
            Prophet. Scholar. Shepherd. Author. Media Veteran.<br />
            Serving God and humanity across five nations.
          </div>
          <div style={{ width: 40, height: 1, background: "var(--gold-light)", opacity: 0.4 }} />
        </div>
        <div>
          <div className="footer-col-title">Main Site</div>
          {["About","Books","Speaking","Media","Contact"].map(l => (
            <a key={l} className="footer-link" href={`#${l.toLowerCase()}`}>{l}</a>
          ))}
        </div>
        <div>
          <div className="footer-col-title">CCC PraiseVille</div>
          {["About PraiseVille","Sunday Services","Festival of the Word","Pastoral Team","Join Us"].map(l => (
            <a key={l} className="footer-link" href="#ministries">{l}</a>
          ))}
        </div>
        <div>
          <div className="footer-col-title">ShaddaiVille</div>
          {["About ShaddaiVille","Leadership Academy","Teens Academy","Outreach","Partner With Us"].map(l => (
            <a key={l} className="footer-link" href="#ministries">{l}</a>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-copy">© 2025 Dr. Kunle Hamilton · All Rights Reserved</div>
        <div className="footer-gold-line" />
        <div className="footer-copy">PraiseVille Global · ShaddaiVille Ministries International</div>
      </div>
    </footer>
  );
}

// ─── CUSTOM CURSOR ─────────────────────────────────────────────────────────────
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (dot.current) { dot.current.style.left = e.clientX - 4 + "px"; dot.current.style.top = e.clientY - 4 + "px"; }
      if (ring.current) { ring.current.style.left = e.clientX - 18 + "px"; ring.current.style.top = e.clientY - 18 + "px"; }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <>
      <div className="cursor" ref={dot} />
      <div className="cursor-ring" ref={ring} />
    </>
  );
}

// ─── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("Home");

  return (
    <>
      <FontLink />
      <div className="noise" />
      <Cursor />
      <Nav active={active} setActive={setActive} />
      <Hero />
      <Credentials />
      <About />
      <Books />
      <Ministries />
      <Speaking />
      <Media />
      <Contact />
      <Footer />
    </>
  );
}
