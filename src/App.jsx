import { useState, useEffect, useRef } from "react";
import {
  motion, AnimatePresence,
  useScroll, useTransform,
  useInView, useMotionValue, useSpring
} from "framer-motion";

/* ── images ── */
const I = {
  hero:     "/dkh-hero.jpg",
  teaching: "/dkh-teaching.jpg",
  formal:   "/dkh-formal.jpg",
  speak:    "/dkh-speaking.jpg",
  preach:   "/dkh-preaching.jpg",
};

/* ════════════════════════════════════════════════════════════
   GLOBAL CSS
════════════════════════════════════════════════════════════ */
const Css = () => (
<style>{`
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;600;700;800;900&family=Barlow:wght@300;400;500;600&family=Barlow+Semi+Condensed:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:    #111111;
  --bg2:   #191919;
  --bg3:   #222222;
  --line:  #2a2a2a;
  --y:     #E8C547;
  --y2:    #F0D060;
  --yd:    #8A7220;
  --w:     #FFFFFF;
  --wm:    rgba(255,255,255,.7);
  --wl:    rgba(255,255,255,.35);
  --wll:   rgba(255,255,255,.12);
}
html{scroll-behavior:smooth;overflow-x:hidden}
body{
  font-family:'Barlow',sans-serif;
  background:var(--bg);color:var(--w);
  overflow-x:hidden;cursor:none;
  -webkit-font-smoothing:antialiased;
}
@media(max-width:768px){body{cursor:auto}}
::selection{background:var(--y);color:#000}
::-webkit-scrollbar{width:2px}
::-webkit-scrollbar-thumb{background:var(--y)}

/* ── cursor ── */
.cx{position:fixed;pointer-events:none;z-index:9999;transform:translate(-50%,-50%)}
.cx-dot{width:5px;height:5px;border-radius:50%;background:var(--y)}
.cx-ring{width:34px;height:34px;border-radius:50%;border:1px solid rgba(232,197,71,.45)}
@media(max-width:768px){.cx,.cx-ring{display:none}}

/* ── nav ── */
.nav{
  position:fixed;top:0;left:0;right:0;z-index:300;
  height:60px;display:flex;align-items:center;justify-content:space-between;
  padding:0 5vw;transition:background .35s,border-color .35s;
  border-bottom:1px solid transparent;
}
.nav.s{background:rgba(17,17,17,.97);backdrop-filter:blur(20px);border-color:var(--line)}
.logo{
  font-family:'Barlow Condensed',sans-serif;
  font-size:1.25rem;font-weight:800;letter-spacing:.08em;
  text-transform:uppercase;color:var(--w);text-decoration:none;cursor:none;
}
.logo span{color:var(--y)}
@media(max-width:768px){.logo{cursor:auto;font-size:1.1rem}}
.nav-links{display:flex;align-items:center;gap:2rem}
@media(max-width:960px){.nav-links{display:none}}
.nl{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.72rem;font-weight:600;letter-spacing:.18em;
  text-transform:uppercase;color:var(--wl);text-decoration:none;cursor:none;
  transition:color .2s;
}
.nl:hover{color:var(--w)}
.nav-cta{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.7rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;
  background:var(--y);color:#000;padding:.5rem 1.4rem;
  text-decoration:none;cursor:none;transition:background .25s;
}
.nav-cta:hover{background:var(--y2)}
@media(max-width:768px){.nav-cta{cursor:auto}}
.ham{display:none;background:none;border:none;cursor:pointer;padding:4px;flex-direction:column;gap:5px;z-index:10}
@media(max-width:960px){.ham{display:flex}}
.hl{width:22px;height:1.5px;background:var(--w);transition:transform .28s,opacity .28s}

/* mobile overlay */
.mob{
  position:fixed;inset:0;background:var(--bg);z-index:200;
  display:flex;flex-direction:column;align-items:flex-start;
  justify-content:center;padding:0 8vw;gap:0;
  border-top:2px solid var(--y);
}
.mob a{
  font-family:'Barlow Condensed',sans-serif;
  font-size:3rem;font-weight:800;letter-spacing:.04em;
  text-transform:uppercase;color:var(--w);text-decoration:none;
  border-bottom:1px solid var(--line);width:100%;padding:.6rem 0;
  transition:color .2s;
}
.mob a:hover{color:var(--y)}
.mob-cta{
  margin-top:2rem;font-size:1rem!important;
  background:var(--y)!important;color:#000!important;
  padding:.8rem 2rem!important;border-bottom:none!important;
  width:auto!important;
}

/* ════ HERO ════ */
.hero{
  position:relative;min-height:100vh;
  display:grid;grid-template-columns:55% 45%;
  overflow:hidden;background:var(--bg);
}
@media(max-width:900px){
  .hero{grid-template-columns:1fr;min-height:auto}
}
.hero-l{
  display:flex;flex-direction:column;justify-content:flex-end;
  padding:8rem 5vw 6rem 6vw;position:relative;z-index:2;
}
@media(max-width:900px){.hero-l{padding:6rem 6vw 4rem;order:2}}

/* giant background text */
.hero-bg-txt{
  position:absolute;bottom:-2rem;left:-.5rem;
  font-family:'Barlow Condensed',sans-serif;
  font-size:clamp(12rem,22vw,28rem);
  font-weight:900;letter-spacing:-.03em;text-transform:uppercase;
  color:rgba(255,255,255,.025);line-height:1;
  pointer-events:none;user-select:none;z-index:0;
  white-space:nowrap;
}
@media(max-width:900px){.hero-bg-txt{font-size:clamp(8rem,28vw,16rem)}}

.hero-pre{
  display:flex;align-items:center;gap:.8rem;
  margin-bottom:1.6rem;position:relative;z-index:1;
}
.hero-pre-bar{width:32px;height:2px;background:var(--y);flex-shrink:0}
.hero-pre-txt{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.65rem;font-weight:700;letter-spacing:.3em;
  text-transform:uppercase;color:var(--y);
}
.hero-h1{
  font-family:'Barlow Condensed',sans-serif;
  font-size:clamp(4.5rem,11vw,14rem);
  font-weight:900;line-height:.88;
  text-transform:uppercase;letter-spacing:-.01em;
  color:var(--w);position:relative;z-index:1;
}
.hero-h1 .y{color:var(--y)}
.hero-h1 .thin{font-weight:300;font-style:italic;letter-spacing:.02em}
@media(max-width:480px){.hero-h1{font-size:clamp(3.5rem,16vw,7rem)}}

.hero-rule{
  width:56px;height:2px;background:var(--y);
  margin:2rem 0;transform-origin:left;position:relative;z-index:1;
}
.hero-body{
  font-family:'Barlow Semi Condensed',sans-serif;
  font-size:clamp(.9rem,1.4vw,1.05rem);font-weight:300;
  line-height:1.75;color:var(--wm);
  max-width:460px;margin-bottom:2.5rem;position:relative;z-index:1;
}
.hero-btns{display:flex;gap:.8rem;flex-wrap:wrap;position:relative;z-index:1}
.btn-y{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.7rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;
  background:var(--y);color:#000;padding:.9rem 2.2rem;
  text-decoration:none;cursor:none;transition:background .25s;display:inline-block;
}
.btn-y:hover{background:var(--y2)}
@media(max-width:768px){.btn-y{cursor:auto}}
.btn-ol{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.7rem;font-weight:600;letter-spacing:.2em;text-transform:uppercase;
  border:1.5px solid var(--wll);color:var(--wm);padding:.9rem 2.2rem;
  text-decoration:none;cursor:none;transition:border-color .25s,color .25s;display:inline-block;
}
.btn-ol:hover{border-color:var(--y);color:var(--y)}
@media(max-width:768px){.btn-ol{cursor:auto}}

/* hero scroll cue */
.hero-scroll{
  position:absolute;bottom:2.5rem;left:6vw;z-index:5;
  display:flex;flex-direction:column;align-items:center;gap:.5rem;
}
@media(max-width:900px){.hero-scroll{display:none}}
.hs-lbl{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.52rem;font-weight:600;letter-spacing:.3em;
  text-transform:uppercase;color:var(--wl);writing-mode:vertical-rl;
}

/* hero image */
.hero-r{position:relative;overflow:hidden;background:#0a0a0a}
@media(max-width:900px){.hero-r{height:80vw;max-height:560px;order:1}}
.hero-img{
  width:100%;height:100%;object-fit:cover;object-position:center top;
  filter:brightness(.85) contrast(1.08);
}
.hero-img-grad{
  position:absolute;inset:0;
  background:
    linear-gradient(to right,var(--bg) 0%,transparent 22%),
    linear-gradient(to top,rgba(17,17,17,.75) 0%,transparent 45%);
}
@media(max-width:900px){
  .hero-img-grad{
    background:linear-gradient(to bottom,transparent 55%,var(--bg) 98%);
  }
}
/* yellow vertical stripe detail */
.hero-stripe{
  position:absolute;top:0;right:0;width:4px;height:100%;
  background:linear-gradient(to bottom,transparent,var(--y),transparent);
  opacity:.5;
}
.hero-badge{
  position:absolute;top:2.5rem;right:2.5rem;
  font-family:'Barlow Condensed',sans-serif;
  font-size:.6rem;font-weight:700;letter-spacing:.22em;
  text-transform:uppercase;color:var(--y);
  border:1px solid rgba(232,197,71,.35);padding:.5rem .9rem;
  backdrop-filter:blur(8px);background:rgba(17,17,17,.3);
}
@media(max-width:900px){.hero-badge{font-size:.52rem;top:1.5rem;right:1.5rem}}

/* bottom yellow bar */
.hero-ybar{
  position:absolute;bottom:0;left:0;right:0;height:3px;
  background:var(--y);transform-origin:left;
}

/* ════ TICKER ════ */
.ticker{
  background:var(--y);overflow:hidden;
  padding:.6rem 0;display:flex;
}
.tk-track{
  display:flex;white-space:nowrap;
  animation:tk 28s linear infinite;
}
@keyframes tk{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.tk-item{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.62rem;font-weight:700;letter-spacing:.22em;
  text-transform:uppercase;color:#000;
  padding:0 1.8rem;display:inline-flex;align-items:center;gap:1.8rem;
}
.tk-sep{width:3px;height:3px;border-radius:50%;background:#000;opacity:.3}

/* ════ SECTION HELPERS ════ */
.stag{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.62rem;font-weight:700;letter-spacing:.28em;
  text-transform:uppercase;color:var(--y);
  display:flex;align-items:center;gap:.8rem;margin-bottom:1.2rem;
}
.stag::before{content:'';width:20px;height:2px;background:var(--y);flex-shrink:0}
.sh2{
  font-family:'Barlow Condensed',sans-serif;
  font-size:clamp(2.5rem,5.5vw,6rem);
  font-weight:900;text-transform:uppercase;
  letter-spacing:-.01em;line-height:.92;color:var(--w);
}
.sh2 em{font-style:italic;font-weight:300;color:var(--y)}

/* ════ ABOUT ════ */
.about{
  display:grid;grid-template-columns:1fr 1fr;
  border-top:1px solid var(--line);
}
@media(max-width:900px){.about{grid-template-columns:1fr}}

/* photo half */
.about-photo{
  position:relative;overflow:hidden;
  min-height:580px;background:#0d0d0d;
}
@media(max-width:900px){.about-photo{min-height:70vw;max-height:500px}}
.ap-img{
  width:100%;height:100%;object-fit:cover;object-position:top;
  filter:brightness(.8) contrast(1.1);
}
/* yellow corner bracket */
.ap-bracket{
  position:absolute;bottom:0;left:0;
  width:60px;height:60px;
  border-left:3px solid var(--y);
  border-bottom:3px solid var(--y);
}
.ap-bracket-tr{
  position:absolute;top:0;right:0;
  width:60px;height:60px;
  border-right:3px solid var(--y);
  border-top:3px solid var(--y);
}
.ap-quote-card{
  position:absolute;bottom:0;left:0;right:0;
  padding:2rem;
  background:linear-gradient(to top,rgba(17,17,17,.97) 0%,rgba(17,17,17,.5) 70%,transparent 100%);
}
.ap-qt{
  font-family:'Barlow Semi Condensed',sans-serif;
  font-size:1rem;font-style:italic;font-weight:300;
  color:var(--w);line-height:1.55;margin-bottom:.6rem;
}
.ap-qby{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.55rem;font-weight:700;letter-spacing:.25em;
  text-transform:uppercase;color:var(--y);
}

/* text half */
.about-body{
  padding:6rem 5vw;display:flex;flex-direction:column;
  justify-content:center;border-left:1px solid var(--line);
}
@media(max-width:900px){.about-body{border-left:none;border-top:1px solid var(--line);padding:4rem 6vw}}
.about-body p{
  font-size:.9rem;font-weight:300;line-height:1.9;color:var(--wm);
  margin-bottom:1.1rem;
}
.about-body strong{color:var(--w);font-weight:500}
.roles{
  margin:2rem 0;
  border-top:1px solid var(--line);
}
.role{
  display:flex;align-items:flex-start;gap:1rem;
  padding:1rem 0;border-bottom:1px solid var(--line);
}
.role-dot{
  width:6px;height:6px;border-radius:50%;
  background:var(--y);flex-shrink:0;margin-top:.45rem;
}
.role-t{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.95rem;font-weight:700;letter-spacing:.04em;
  text-transform:uppercase;color:var(--w);
}
.role-s{
  font-size:.75rem;font-weight:300;color:var(--wl);margin-top:.15rem;
}

/* ════ STATS ════ */
.stats{
  display:grid;grid-template-columns:repeat(4,1fr);
  background:var(--y);border-top:none;
}
@media(max-width:700px){.stats{grid-template-columns:repeat(2,1fr)}}
.stat{
  padding:2.8rem 1.5rem;text-align:center;
  border-right:1px solid rgba(0,0,0,.12);
}
.stat:last-child{border-right:none}
@media(max-width:700px){.stat:nth-child(2){border-right:none}}
.stat-n{
  font-family:'Barlow Condensed',sans-serif;
  font-size:3.8rem;font-weight:900;color:#000;line-height:1;
}
.stat-l{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.6rem;font-weight:700;letter-spacing:.2em;
  text-transform:uppercase;color:rgba(0,0,0,.55);margin-top:.25rem;
}

/* ════ FEATURED VIDEO ════ */
.feat-vid{
  padding:8rem 6vw;border-top:1px solid var(--line);
  display:grid;grid-template-columns:1fr 1fr;gap:6rem;align-items:center;
}
@media(max-width:900px){.feat-vid{grid-template-columns:1fr;padding:5rem 6vw;gap:3rem}}
.fv-frame-wrap{
  position:relative;aspect-ratio:16/9;
  border:1px solid var(--line);overflow:hidden;
}
.fv-frame-wrap::before{
  content:'';position:absolute;inset:0;
  box-shadow:inset 0 0 0 1px rgba(232,197,71,.15);
  z-index:1;pointer-events:none;
}
.fv-frame{width:100%;height:100%;display:block;border:0}
.fv-corner{
  position:absolute;width:20px;height:20px;z-index:2;
}
.fv-tl{top:-1px;left:-1px;border-top:2px solid var(--y);border-left:2px solid var(--y)}
.fv-tr{top:-1px;right:-1px;border-top:2px solid var(--y);border-right:2px solid var(--y)}
.fv-bl{bottom:-1px;left:-1px;border-bottom:2px solid var(--y);border-left:2px solid var(--y)}
.fv-br{bottom:-1px;right:-1px;border-bottom:2px solid var(--y);border-right:2px solid var(--y)}

/* ════ VIDEO GRID ════ */
.vid-section{border-top:1px solid var(--line);padding-bottom:8rem}
@media(max-width:768px){.vid-section{padding-bottom:5rem}}
.vid-hd{padding:6rem 6vw 3rem}
@media(max-width:768px){.vid-hd{padding:4rem 6vw 2.5rem}}
.vid-grid{
  display:grid;grid-template-columns:repeat(3,1fr);
  border-top:1px solid var(--line);
}
@media(max-width:900px){.vid-grid{grid-template-columns:1fr}}
.vc{
  border-right:1px solid var(--line);overflow:hidden;
  transition:background .25s;position:relative;cursor:none;
}
.vc:last-child{border-right:none}
.vc:hover{background:var(--bg2)}
@media(max-width:900px){.vc{border-right:none;border-bottom:1px solid var(--line);cursor:auto}}
.vc iframe{width:100%;aspect-ratio:16/9;display:block;border:0}
.vc-info{padding:1.4rem 2rem 2rem}
.vc-tag{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.55rem;font-weight:700;letter-spacing:.25em;
  text-transform:uppercase;color:var(--y);display:block;margin-bottom:.5rem;
}
.vc-title{
  font-family:'Barlow Condensed',sans-serif;
  font-size:1.2rem;font-weight:700;text-transform:uppercase;
  letter-spacing:.03em;color:var(--w);line-height:1.15;margin-bottom:.4rem;
}
.vc-src{font-size:.68rem;font-weight:300;color:var(--wl)}

/* ════ MINISTRIES ════ */
.min-sec{border-top:1px solid var(--line)}
.min-hd{padding:6rem 6vw 4rem;border-bottom:1px solid var(--line)}
@media(max-width:768px){.min-hd{padding:4rem 6vw 3rem}}
.min-grid{display:grid;grid-template-columns:1fr 1fr}
@media(max-width:768px){.min-grid{grid-template-columns:1fr}}
.mp{
  padding:5rem 5vw;border-right:1px solid var(--line);
  position:relative;overflow:hidden;
  transition:background .3s;
}
.mp:hover{background:var(--bg2)}
.mp:last-child{border-right:none}
@media(max-width:768px){.mp{border-right:none;border-bottom:1px solid var(--line)}}
/* animated yellow side line */
.mp::before{
  content:'';position:absolute;top:0;left:0;
  width:3px;height:0;background:var(--y);
  transition:height .5s ease;
}
.mp:hover::before{height:100%}
.mp-bg{
  position:absolute;top:1rem;right:2rem;
  font-family:'Barlow Condensed',sans-serif;
  font-size:9rem;font-weight:900;letter-spacing:-.02em;
  text-transform:uppercase;color:rgba(255,255,255,.025);
  line-height:1;pointer-events:none;user-select:none;
}
.mp-tag{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.58rem;font-weight:700;letter-spacing:.28em;
  text-transform:uppercase;color:var(--y);
  display:flex;align-items:center;gap:.7rem;margin-bottom:1.5rem;
}
.mp-tag::before{content:'';width:16px;height:2px;background:var(--y)}
.mp-title{
  font-family:'Barlow Condensed',sans-serif;
  font-size:clamp(2rem,4vw,3.8rem);font-weight:900;
  text-transform:uppercase;letter-spacing:-.01em;
  color:var(--w);line-height:.95;margin-bottom:1.2rem;
}
.mp-title em{font-style:italic;font-weight:300;color:var(--y)}
.mp-p{font-size:.85rem;font-weight:300;line-height:1.85;color:var(--wl);max-width:400px;margin-bottom:2rem}
.mp-nums{display:flex;gap:2rem;margin-bottom:2rem}
.mn-n{
  font-family:'Barlow Condensed',sans-serif;
  font-size:2.2rem;font-weight:900;color:var(--y);line-height:1;
}
.mn-l{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.5rem;font-weight:600;letter-spacing:.2em;
  text-transform:uppercase;color:var(--wl);margin-top:.25rem;
}
.mp-link{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.65rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;
  color:var(--wl);text-decoration:none;display:inline-flex;
  align-items:center;gap:.5rem;cursor:none;transition:color .25s;
}
.mp-link:hover{color:var(--y)}
@media(max-width:768px){.mp-link{cursor:auto}}

/* ════ BOOKS ════ */
.books{border-top:1px solid var(--line)}
.books-hd{
  padding:6rem 6vw 0;
  display:flex;align-items:flex-end;justify-content:space-between;flex-wrap:wrap;gap:2rem;
}
@media(max-width:768px){.books-hd{padding:4rem 6vw 0}}
.bk-grid{
  display:grid;grid-template-columns:repeat(3,1fr);
  margin-top:4rem;border-top:1px solid var(--line);
}
@media(max-width:900px){.bk-grid{grid-template-columns:1fr}}
.bk{
  padding:3.5rem 4vw 4rem;border-right:1px solid var(--line);
  position:relative;overflow:hidden;cursor:none;transition:background .25s;
}
.bk:last-child{border-right:none}
.bk:hover{background:var(--bg2)}
@media(max-width:900px){.bk{border-right:none;border-bottom:1px solid var(--line);cursor:auto}}
/* top animated line */
.bk::after{
  content:'';position:absolute;top:0;left:0;
  width:0;height:2px;background:var(--y);transition:width .45s;
}
.bk:hover::after{width:100%}
.bk-n{
  font-family:'Barlow Condensed',sans-serif;
  font-size:5.5rem;font-weight:900;
  color:rgba(255,255,255,.06);line-height:1;margin-bottom:1.5rem;
  transition:color .3s;
}
.bk:hover .bk-n{color:rgba(232,197,71,.12)}
.bk-tag{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.55rem;font-weight:700;letter-spacing:.28em;
  text-transform:uppercase;color:var(--y);margin-bottom:.6rem;
}
.bk-title{
  font-family:'Barlow Condensed',sans-serif;
  font-size:1.6rem;font-weight:800;text-transform:uppercase;
  letter-spacing:.02em;color:var(--w);line-height:1.05;margin-bottom:1rem;
}
.bk-p{font-size:.8rem;font-weight:300;line-height:1.8;color:var(--wl);margin-bottom:1.5rem}
.bk-link{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.62rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;
  color:var(--wl);text-decoration:none;cursor:none;transition:color .25s;
  display:inline-flex;align-items:center;gap:.4rem;
}
.bk-link:hover{color:var(--y)}
@media(max-width:768px){.bk-link{cursor:auto}}

/* ════ SPEAKING ════ */
.speaking{
  border-top:1px solid var(--line);
  display:grid;grid-template-columns:360px 1fr;
}
@media(max-width:1024px){.speaking{grid-template-columns:1fr}}
.sp-side{
  padding:6rem 4vw;border-right:1px solid var(--line);
  position:sticky;top:0;align-self:start;
}
@media(max-width:1024px){.sp-side{position:static;border-right:none;border-bottom:1px solid var(--line);padding:4rem 6vw}}
.sp-quote{
  margin-top:2.5rem;padding:1.5rem 1.5rem 1.5rem 1.8rem;
  background:var(--bg2);border-left:3px solid var(--y);
}
.sp-qt{
  font-family:'Barlow Semi Condensed',sans-serif;
  font-size:1rem;font-style:italic;font-weight:300;
  color:var(--wm);line-height:1.65;margin-bottom:.8rem;
}
.sp-qby{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.52rem;font-weight:700;letter-spacing:.22em;
  text-transform:uppercase;color:var(--y);
}
.ev-list{display:flex;flex-direction:column}
.ev{
  display:grid;grid-template-columns:72px 1fr;gap:1.5rem;
  padding:2rem 4vw;border-bottom:1px solid var(--line);
  transition:background .25s;
}
.ev:hover{background:var(--bg2)}
.ev-dt{text-align:center;padding-top:.2rem}
.ev-d{
  font-family:'Barlow Condensed',sans-serif;
  font-size:2.8rem;font-weight:900;color:var(--y);line-height:1;
}
.ev-m{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.5rem;font-weight:700;letter-spacing:.22em;
  text-transform:uppercase;color:var(--wl);
}
.ev-name{
  font-family:'Barlow Condensed',sans-serif;
  font-size:1.2rem;font-weight:700;text-transform:uppercase;
  letter-spacing:.03em;color:var(--w);margin-bottom:.4rem;line-height:1.15;
}
.ev-meta{font-size:.7rem;font-weight:300;color:var(--wl);display:flex;gap:.7rem;flex-wrap:wrap}
.ev-type{color:var(--yd)}

/* ════ PHOTO STRIP ════ */
.photo-strip{
  display:grid;grid-template-columns:repeat(3,1fr);
  border-top:1px solid var(--line);height:420px;
}
@media(max-width:768px){.photo-strip{grid-template-columns:1fr;height:auto}}
.ps-img{
  position:relative;overflow:hidden;
}
.ps-img img{
  width:100%;height:100%;object-fit:cover;object-position:top;
  filter:brightness(.75) contrast(1.08) grayscale(15%);
  transition:transform .6s ease,filter .5s;
}
.ps-img:hover img{transform:scale(1.04);filter:brightness(.88) contrast(1.05) grayscale(0%)}
.ps-img::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(to top,rgba(17,17,17,.7) 0%,transparent 50%);
}
.ps-lbl{
  position:absolute;bottom:1rem;left:1.2rem;z-index:1;
  font-family:'Barlow Condensed',sans-serif;
  font-size:.55rem;font-weight:700;letter-spacing:.25em;
  text-transform:uppercase;color:var(--y);
}
@media(max-width:768px){.ps-img{height:60vw}}

/* ════ CONTACT ════ */
.contact{
  border-top:1px solid var(--line);
  display:grid;grid-template-columns:1fr 1fr;
}
@media(max-width:900px){.contact{grid-template-columns:1fr}}
.ct-photo{
  position:relative;overflow:hidden;min-height:600px;background:#0a0a0a;
}
@media(max-width:900px){.ct-photo{min-height:70vw;max-height:520px}}
.ct-photo img{
  width:100%;height:100%;object-fit:cover;object-position:top;
  filter:brightness(.75) contrast(1.1);
}
.ct-photo-ov{
  position:absolute;inset:0;
  background:linear-gradient(to top,rgba(17,17,17,.9) 0%,transparent 55%);
}
.ct-photo-txt{position:absolute;bottom:2.5rem;left:2.5rem;right:2.5rem}
.ct-photo-name{
  font-family:'Barlow Condensed',sans-serif;
  font-size:2rem;font-weight:900;text-transform:uppercase;
  letter-spacing:.02em;color:var(--w);line-height:1;margin-bottom:.4rem;
}
.ct-photo-sub{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.58rem;font-weight:700;letter-spacing:.25em;
  text-transform:uppercase;color:var(--y);
}
.ct-form{
  padding:6rem 5vw;border-left:1px solid var(--line);
  display:flex;flex-direction:column;justify-content:center;
}
@media(max-width:900px){.ct-form{border-left:none;border-top:1px solid var(--line);padding:4rem 6vw}}
.ct-deets{
  display:flex;flex-direction:column;gap:.8rem;
  margin:2rem 0 2.5rem;
  padding:1.5rem 0;
  border-top:1px solid var(--line);border-bottom:1px solid var(--line);
}
.ctd{display:flex;gap:.9rem;align-items:flex-start}
.ctd-bul{width:5px;height:5px;border-radius:50%;background:var(--y);flex-shrink:0;margin-top:.35rem}
.ctd-lbl{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.52rem;font-weight:700;letter-spacing:.22em;
  text-transform:uppercase;color:var(--yd);margin-bottom:.15rem;
}
.ctd-val{font-size:.78rem;font-weight:300;color:var(--wl)}
.cform{display:flex;flex-direction:column;gap:.8rem}
.crow{display:grid;grid-template-columns:1fr 1fr;gap:.8rem}
@media(max-width:480px){.crow{grid-template-columns:1fr}}
.cfg{display:flex;flex-direction:column;gap:.3rem}
.cfl{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.52rem;font-weight:700;letter-spacing:.2em;
  text-transform:uppercase;color:var(--wl);
}
.cfi,.cfs,.cfta{
  background:var(--bg2);border:1px solid var(--line);
  padding:.8rem .9rem;font-family:'Barlow',sans-serif;
  font-size:.82rem;font-weight:300;color:var(--w);
  outline:none;width:100%;transition:border-color .25s;
  -webkit-appearance:none;border-radius:0;
}
.cfi::placeholder,.cfta::placeholder{color:var(--wl)}
.cfi:focus,.cfs:focus,.cfta:focus{border-color:var(--y)}
.cfs option{background:var(--bg)}
.cfta{min-height:95px;resize:vertical}
.cfbtn{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.7rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;
  background:var(--y);color:#000;padding:.95rem;border:none;cursor:none;
  font-family:'Barlow Condensed',sans-serif;transition:background .25s;
  width:100%;
}
.cfbtn:hover{background:var(--y2)}
@media(max-width:768px){.cfbtn{cursor:auto}}
.sent-box{
  margin-top:1.5rem;padding:2.5rem;
  border:1px solid var(--yd);background:var(--bg2);text-align:center;
}
.sb-icon{
  font-family:'Barlow Condensed',sans-serif;
  font-size:2.5rem;font-weight:900;color:var(--y);margin-bottom:.5rem;
}
.sb-t{
  font-family:'Barlow Condensed',sans-serif;
  font-size:1.5rem;font-weight:800;text-transform:uppercase;
  color:var(--w);margin-bottom:.4rem;
}
.sb-s{font-size:.78rem;font-weight:300;color:var(--wl)}

/* ════ FOOTER ════ */
.footer{border-top:3px solid var(--y);background:var(--bg2)}
.ft-inner{
  display:grid;grid-template-columns:2fr 1fr 1fr 1fr;
  border-bottom:1px solid var(--line);
}
@media(max-width:900px){.ft-inner{grid-template-columns:1fr 1fr}}
@media(max-width:480px){.ft-inner{grid-template-columns:1fr}}
.ftc{padding:4rem 4vw;border-right:1px solid var(--line)}
.ftc:last-child{border-right:none}
@media(max-width:900px){
  .ftc:nth-child(2){border-right:none}
  .ftc:nth-child(3){border-top:1px solid var(--line)}
  .ftc:nth-child(4){border-right:none;border-top:1px solid var(--line)}
}
@media(max-width:480px){
  .ftc{border-right:none!important;border-bottom:1px solid var(--line)}
  .ftc:last-child{border-bottom:none}
}
.ft-logo{
  font-family:'Barlow Condensed',sans-serif;
  font-size:1.5rem;font-weight:900;text-transform:uppercase;
  letter-spacing:.04em;color:var(--w);margin-bottom:.8rem;
}
.ft-logo span{color:var(--y)}
.ft-tag{font-size:.75rem;font-weight:300;line-height:1.7;color:var(--wl);margin-bottom:1.5rem;max-width:260px}
.ft-hl{
  font-family:'Barlow Condensed',sans-serif;
  font-size:.58rem;font-weight:700;letter-spacing:.28em;
  text-transform:uppercase;color:var(--y);margin-bottom:1.2rem;
}
.ftl{
  display:block;font-size:.75rem;font-weight:300;
  color:var(--wl);text-decoration:none;
  margin-bottom:.55rem;transition:color .2s;cursor:none;
}
.ftl:hover{color:var(--w)}
@media(max-width:768px){.ftl{cursor:auto}}
.ft-base{
  padding:1.4rem 4vw;
  display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;
}
.ft-copy{font-size:.6rem;font-weight:300;color:var(--wl);letter-spacing:.06em}
.ft-ydot{width:5px;height:5px;border-radius:50%;background:var(--y)}
`}</style>
);

/* ── Cursor ── */
function Cursor() {
  const mx=useMotionValue(-100),my=useMotionValue(-100);
  const rx=useSpring(mx,{stiffness:210,damping:22}),ry=useSpring(my,{stiffness:210,damping:22});
  useEffect(()=>{
    const fn=e=>{mx.set(e.clientX);my.set(e.clientY)};
    window.addEventListener("mousemove",fn);
    return()=>window.removeEventListener("mousemove",fn);
  },[]);
  return(<>
    <motion.div className="cx" style={{left:mx,top:my}}><div className="cx-dot"/></motion.div>
    <motion.div className="cx cx-ring" style={{left:rx,top:ry}}/>
  </>);
}

/* ── Reveal ── */
function R({children,delay=0,y=28,x=0,className=""}){
  const ref=useRef(null);
  const v=useInView(ref,{once:true,margin:"-40px"});
  return(
    <motion.div ref={ref} className={className}
      initial={{opacity:0,y,x}}
      animate={v?{opacity:1,y:0,x:0}:{}}
      transition={{duration:.75,delay,ease:[.22,1,.36,1]}}
    >{children}</motion.div>
  );
}

/* ── Nav ── */
function Nav(){
  const[scrolled,setScrolled]=useState(false);
  const[open,setOpen]=useState(false);
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>30);
    window.addEventListener("scroll",fn);
    return()=>window.removeEventListener("scroll",fn);
  },[]);
  const links=["About","Ministries","Videos","Books","Speaking","Contact"];
  return(<>
    <motion.header className={`nav${scrolled?" s":""}`}
      initial={{y:-70,opacity:0}} animate={{y:0,opacity:1}}
      transition={{duration:.65,ease:[.22,1,.36,1]}}
    >
      <a className="logo" href="#home">Dr. Kunle <span>Hamilton</span></a>
      <div className="nav-links">
        {links.map(l=><a key={l} className="nl" href={`#${l.toLowerCase()}`}>{l}</a>)}
        <a className="nav-cta" href="#contact">Book a Session</a>
      </div>
      <button className="ham" onClick={()=>setOpen(o=>!o)} aria-label="Menu">
        <div className="hl" style={open?{transform:"rotate(45deg) translate(5px,5px)"}:{}}/>
        <div className="hl" style={open?{opacity:0}:{}}/>
        <div className="hl" style={open?{transform:"rotate(-45deg) translate(5px,-5px)"}:{}}/>
      </button>
    </motion.header>
    <AnimatePresence>
      {open&&(
        <motion.nav className="mob"
          initial={{opacity:0,x:"100%"}} animate={{opacity:1,x:0}}
          exit={{opacity:0,x:"100%"}} transition={{duration:.3,ease:[.22,1,.36,1]}}
        >
          {links.map(l=><a key={l} href={`#${l.toLowerCase()}`} onClick={()=>setOpen(false)}>{l}</a>)}
          <a className="btn-y mob-cta" href="#contact" onClick={()=>setOpen(false)}>Book a Session</a>
        </motion.nav>
      )}
    </AnimatePresence>
  </>);
}

/* ── Hero ── */
function Hero(){
  const{scrollY}=useScroll();
  const iy=useTransform(scrollY,[0,700],[0,90]);
  return(
    <section className="hero" id="home">
      <div className="hero-l">
        <div className="hero-bg-txt" aria-hidden="true">DKH</div>
        <motion.div className="hero-pre"
          initial={{opacity:0,x:-24}} animate={{opacity:1,x:0}}
          transition={{delay:.5,duration:.6}}
        >
          <div className="hero-pre-bar"/>
          <span className="hero-pre-txt">Prophet · Scholar · Shepherd · Author</span>
        </motion.div>
        <motion.h1 className="hero-h1"
          initial={{opacity:0,y:70}} animate={{opacity:1,y:0}}
          transition={{delay:.65,duration:.95,ease:[.22,1,.36,1]}}
        >
          <span className="thin">Dr.</span><br/>
          Kunle<br/>
          <span className="y">Hamilton</span>
        </motion.h1>
        <motion.div className="hero-rule"
          initial={{scaleX:0}} animate={{scaleX:1}}
          transition={{delay:1,duration:1.1,ease:[.22,1,.36,1]}}
        />
        <motion.p className="hero-body"
          initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
          transition={{delay:1.05,duration:.75}}
        >
          Veteran journalist. International author. Prophet of the Celestial Church. Founder of CCC PraiseVille Global &amp; ShaddaiVille Ministries — a life poured out for God and humanity across five nations.
        </motion.p>
        <motion.div className="hero-btns"
          initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
          transition={{delay:1.18,duration:.7}}
        >
          <a className="btn-y" href="#about">Discover His Story</a>
          <a className="btn-ol" href="#videos">Watch Teachings</a>
        </motion.div>
        <div className="hero-scroll">
          <span className="hs-lbl">Scroll</span>
          <motion.div style={{width:1,height:44,background:"var(--y)",transformOrigin:"top"}}
            animate={{scaleY:[0,1,0]}} transition={{duration:2,repeat:Infinity,ease:"easeInOut"}}
          />
        </div>
      </div>

      <motion.div className="hero-r" style={{y:iy}}>
        <img src={I.hero} alt="Dr. Kunle Hamilton" className="hero-img"/>
        <div className="hero-img-grad"/>
        <div className="hero-stripe"/>
        <div className="hero-badge">CCC PraiseVille Global</div>
        <motion.div className="hero-ybar"
          initial={{scaleX:0}} animate={{scaleX:1}}
          transition={{delay:1.4,duration:1.3,ease:[.22,1,.36,1]}}
        />
      </motion.div>
    </section>
  );
}

/* ── Ticker ── */
const TICKS=["Prophet","Scholar","Media Veteran","Bestselling Author","Senior Shepherd","PraiseVille Global","ShaddaiVille Ministries","Discipleship","Berlin · Lagos · London","Leadership Academy","Nigeria · Germany · UK · USA"];
function Ticker(){
  const all=[...TICKS,...TICKS];
  return(
    <div className="ticker">
      <div className="tk-track">
        {all.map((t,i)=>(
          <span key={i} className="tk-item">{t}<span className="tk-sep"/></span>
        ))}
      </div>
    </div>
  );
}

/* ── About ── */
function About(){
  return(
    <section className="about" id="about">
      <R x={-20} y={0}>
        <div className="about-photo">
          <img src={I.teaching} alt="Dr. Kunle Hamilton" className="ap-img"/>
          <div className="ap-bracket"/><div className="ap-bracket-tr"/>
          <div className="ap-quote-card">
            <div className="ap-qt">"If God had not arrested me with the drama of the Celestial Church, He would have lost me to atheism."</div>
            <div className="ap-qby">— Dr. Kunle Hamilton, Prophet & Scholar</div>
          </div>
        </div>
      </R>
      <div className="about-body">
        <R><div className="stag">The Man Behind the Ministry</div></R>
        <R delay={.1}><h2 className="sh2">A PHILOSOPHER<br/>WHO FOUND <em>GOD</em></h2></R>
        <R delay={.2}>
          <div style={{height:1,background:"var(--line)",margin:"2rem 0"}}/>
          <p>Dr. Kunle Hamilton is one of Nigeria's most remarkable multi-disciplinary voices — <strong>a Prophet of the Celestial Church of Christ</strong>, veteran journalist, media executive, reputation management expert, international author, and transformative spiritual leader whose reach spans four continents.</p>
          <p>A <strong>Philosophy first-class graduate</strong> (Best Student, UNILAG 1985) and Mass Communication scholar, Dr. Hamilton fuses rigorous academic thought with prophetic grace. His ministry is defined by discipleship, nation-building, and the empowerment of the next generation.</p>
        </R>
        <R delay={.3}>
          <div className="roles">
            {[
              ["Senior Shepherd","CCC PraiseVille Global — Nigeria · Germany · UK · USA"],
              ["Founder & President","ShaddaiVille Ministries International — since 2007"],
              ["CEO","Virgin Outdoor — Reputation & Brand Management, Lagos"],
              ["International Author","Published in 18 countries, Lambert Academic Publishing"],
            ].map(([t,s],i)=>(
              <div className="role" key={i}>
                <div className="role-dot"/>
                <div>
                  <div className="role-t">{t}</div>
                  <div className="role-s">{s}</div>
                </div>
              </div>
            ))}
          </div>
        </R>
        <R delay={.4}>
          <a className="btn-y" href="#contact" style={{display:"inline-block",marginTop:"1rem"}}>
            Connect with Dr. Hamilton
          </a>
        </R>
      </div>
    </section>
  );
}

/* ── Stats ── */
function Stats(){
  return(
    <R>
      <div className="stats">
        {[{n:"40+",l:"Years in Ministry"},{n:"5",l:"Nations of Impact"},{n:"2",l:"Thriving Ministries"},{n:"18",l:"Countries Published"}].map((s,i)=>(
          <motion.div key={i} className="stat"
            initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}}
            viewport={{once:true}} transition={{delay:i*.08,duration:.6}}
          >
            <div className="stat-n">{s.n}</div>
            <div className="stat-l">{s.l}</div>
          </motion.div>
        ))}
      </div>
    </R>
  );
}

/* ── Featured Video ── */
function FeaturedVideo(){
  return(
    <section className="feat-vid" id="videos">
      <div>
        <R><div className="stag">Featured Teaching</div></R>
        <R delay={.1}><h2 className="sh2">DR. HAMILTON<br/>TEACHES<br/><em>DISCIPLESHIP</em></h2></R>
        <R delay={.2}>
          <p style={{marginTop:"2rem",fontSize:".88rem",fontWeight:300,lineHeight:1.85,color:"var(--wl)",maxWidth:420,marginBottom:"2rem"}}>
            Watch Dr. Kunle Hamilton in one of his most celebrated teachings — a message that has impacted thousands across nations and ministry boundaries.
          </p>
          <a className="btn-y" href="#vid-more" style={{display:"inline-block"}}>See All Teachings</a>
        </R>
      </div>
      <R delay={.2} x={30} y={0}>
        <div className="fv-frame-wrap">
          <div className="fv-corner fv-tl"/><div className="fv-corner fv-tr"/>
          <div className="fv-corner fv-bl"/><div className="fv-corner fv-br"/>
          <iframe className="fv-frame"
            src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fcelestial.focus%2Fvideos%2F1356642479037237&show_text=false"
            scrolling="no" frameBorder="0" allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            title="Dr. Kunle Hamilton Teaches Discipleship"
          />
        </div>
      </R>
    </section>
  );
}

/* ── Video Grid ── */
function VideoGrid(){
  const vids=[
    {url:"https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fhephzibahtelevision%2Fvideos%2F449065333576250&show_text=false",tag:"Leadership · Interview",title:"The Roles of Leadership in the Church",src:"Hephzibah Television"},
    {url:"https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fcelestial.focus%2Fvideos%2F1241668604555889&show_text=false",tag:"Worship · Celebration",title:"CCC PraiseVille Christmas Celebration",src:"CelestialFocus TV"},
    {url:"https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fcelestial.focus%2Fvideos%2F1356642479037237&show_text=false",tag:"Teaching · Faith",title:"Kingdom Principles for a New Generation",src:"CelestialFocus TV"},
  ];
  return(
    <section className="vid-section" id="vid-more">
      <div className="vid-hd">
        <R><div className="stag">Sermons, Talks & Interviews</div></R>
        <R delay={.1}><h2 className="sh2">MORE<br/><em>TEACHINGS</em></h2></R>
      </div>
      <div className="vid-grid">
        {vids.map((v,i)=>(
          <R key={i} delay={i*.1}>
            <div className="vc">
              <iframe src={v.url} scrolling="no" frameBorder="0" allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                title={v.title} style={{width:"100%",aspectRatio:"16/9",display:"block",border:0}}
              />
              <div className="vc-info">
                <span className="vc-tag">{v.tag}</span>
                <div className="vc-title">{v.title}</div>
                <div className="vc-src">{v.src}</div>
              </div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ── Ministries ── */
function Ministries(){
  return(
    <section className="min-sec" id="ministries">
      <div className="min-hd">
        <R><div className="stag">Twin Pillars of Purpose</div></R>
        <R delay={.1}><h2 className="sh2">THE<br/><em>MINISTRIES</em></h2></R>
      </div>
      <div className="min-grid">
        {[
          {bg:"PV",tag:"Celestial Church of Christ",title:<>CCC<br/><em>PRAISEVILLE</em><br/>GLOBAL</>,p:"Founded in Berlin, Germany on May 8, 2016 — now flourishing across Nigeria, UK, USA and Germany. A place of authentic worship, genuine prophecy, and deep fellowship.",nums:[{n:"4+",l:"Countries"},{n:"2016",l:"Founded"},{n:"7+",l:"Harvests"}]},
          {bg:"SV",tag:"Non-Denominational · Global Training",title:<>SHADDAIVILLE<br/><em>MINISTRIES</em><br/>INTERNATIONAL</>,p:'"God\'s City" — training Christians and Muslims in UK-certified leadership and entrepreneurship since 2007. Free of charge. Five nations strong.',nums:[{n:"5",l:"Nations"},{n:"2007",l:"Founded"},{n:"UK",l:"Certified"}]},
        ].map((m,i)=>(
          <R key={i} x={i===0?-20:20} y={0}>
            <div className="mp">
              <div className="mp-bg">{m.bg}</div>
              <div className="mp-tag">{m.tag}</div>
              <h3 className="mp-title">{m.title}</h3>
              <p className="mp-p">{m.p}</p>
              <div className="mp-nums">
                {m.nums.map((mn,j)=>(
                  <div key={j}><div className="mn-n">{mn.n}</div><div className="mn-l">{mn.l}</div></div>
                ))}
              </div>
              <a className="mp-link" href="#contact">Learn More →</a>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ── Photo Strip ── */
function PhotoStrip(){
  const photos=[
    {src:I.hero,     lbl:"Shepherd · PraiseVille"},
    {src:I.teaching, lbl:"Teaching · Discipleship"},
    {src:I.formal,   lbl:"Prophet · Scholar"},
  ];
  return(
    <div className="photo-strip">
      {photos.map((p,i)=>(
        <R key={i} delay={i*.12} y={0} x={0}>
          <div className="ps-img">
            <img src={p.src} alt={p.lbl}/>
            <div className="ps-lbl">{p.lbl}</div>
          </div>
        </R>
      ))}
    </div>
  );
}

/* ── Books ── */
function Books(){
  const bks=[
    {tag:"Leadership",title:"Releasing the Eagle in You",p:"An eight-chapter inspirational work on leadership and self-actualization — unlocking the greatness God placed within every person. Published in 18 countries."},
    {tag:"Philosophy",title:"Journey to Understanding",p:"A philosophical investigation of how style and content impact the spoken word, using the church and Raypower 100.5 FM as its remarkable canvas."},
    {tag:"Ministry",title:"The ShaddaiVille Vision",p:"Dr. Hamilton's framework for discipleship-driven ministry that transcends denominational walls — building leaders across faith traditions and nations."},
  ];
  return(
    <section className="books" id="books">
      <div className="books-hd">
        <div>
          <R><div className="stag">Written Works</div></R>
          <R delay={.1}><h2 className="sh2">BOOKS &amp;<br/><em>PUBLICATIONS</em></h2></R>
        </div>
        <R delay={.2}>
          <a className="btn-ol" href="#contact" style={{display:"inline-block",alignSelf:"flex-end"}}>Order a Copy</a>
        </R>
      </div>
      <div className="bk-grid">
        {bks.map((b,i)=>(
          <R key={i} delay={i*.1}>
            <div className="bk">
              <div className="bk-n">0{i+1}</div>
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

/* ── Speaking ── */
function Speaking(){
  const evs=[
    {d:"12",m:"Apr",name:"Festival of the Word — Annual Harvest",loc:"Lagos, Nigeria",type:"Worship & Teaching"},
    {d:"03",m:"May",name:"ShaddaiVille UK Leadership Retreat",loc:"London, United Kingdom",type:"Leadership Academy"},
    {d:"21",m:"Jun",name:"Teenagers' Motivational Summit",loc:"Berlin, Germany",type:"Youth Empowerment"},
    {d:"08",m:"Aug",name:"Ephphatha Non-Denominational Crusade",loc:"Lagos, Nigeria",type:"Evangelism"},
    {d:"15",m:"Sep",name:"Media & Ministry — Public Lecture",loc:"University of Lagos",type:"Academic Talk"},
  ];
  return(
    <section className="speaking" id="speaking">
      <div className="sp-side">
        <R><div className="stag">Events & Engagements</div></R>
        <R delay={.1}><h2 className="sh2">SPEAKING &amp;<br/><em>APPEARANCES</em></h2></R>
        <R delay={.2}>
          <div className="sp-quote">
            <div className="sp-qt">"The responsibility of religious leaders is to guide young people towards righteousness — not to encourage them to chase fame through questionable means."</div>
            <div className="sp-qby">— Dr. Kunle Hamilton</div>
          </div>
        </R>
        <R delay={.3}>
          <div style={{marginTop:"2rem"}}>
            <a className="btn-y" href="#contact">Invite Dr. Hamilton</a>
          </div>
        </R>
      </div>
      <div className="ev-list">
        {evs.map((e,i)=>(
          <R key={i} delay={i*.08} x={20} y={0}>
            <div className="ev">
              <div className="ev-dt"><div className="ev-d">{e.d}</div><div className="ev-m">{e.m}</div></div>
              <div>
                <div className="ev-name">{e.name}</div>
                <div className="ev-meta"><span>📍 {e.loc}</span><span className="ev-type">· {e.type}</span></div>
              </div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ── Contact ── */
function Contact(){
  const[f,setF]=useState({name:"",email:"",inquiry:"speaking",msg:""});
  const[sent,setSent]=useState(false);
  return(
    <section className="contact" id="contact">
      <R x={-20} y={0}>
        <div className="ct-photo">
          <img src={I.hero} alt="Dr. Kunle Hamilton"/>
          <div className="ct-photo-ov"/>
          <div className="ct-photo-txt">
            <div className="ct-photo-name">Dr. Kunle<br/>Hamilton</div>
            <div className="ct-photo-sub">Reach His Team Today</div>
          </div>
        </div>
      </R>
      <R delay={.15}>
        <div className="ct-form">
          <div className="stag">Get in Touch</div>
          <h2 className="sh2">SEND A<br/><em>MESSAGE</em></h2>
          <div className="ct-deets">
            {[
              ["Ministry","CCC PraiseVille Global · ShaddaiVille International"],
              ["Based In","Lagos, Nigeria · Berlin, Germany · London, UK"],
              ["Media & PR","Virgin Outdoor Communications, Lagos"],
            ].map(([l,v],i)=>(
              <div className="ctd" key={i}>
                <div className="ctd-bul"/>
                <div><div className="ctd-lbl">{l}</div><div className="ctd-val">{v}</div></div>
              </div>
            ))}
          </div>
          {sent?(
            <motion.div className="sent-box" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
              <div className="sb-icon">✦</div>
              <div className="sb-t">Message Sent</div>
              <div className="sb-s">Dr. Hamilton's team will be in touch shortly.</div>
            </motion.div>
          ):(
            <form className="cform" onSubmit={e=>{e.preventDefault();setSent(true)}}>
              <div className="crow">
                <div className="cfg"><label className="cfl">Full Name</label><input className="cfi" placeholder="Your name" value={f.name} onChange={e=>setF({...f,name:e.target.value})} required/></div>
                <div className="cfg"><label className="cfl">Email</label><input className="cfi" type="email" placeholder="your@email.com" value={f.email} onChange={e=>setF({...f,email:e.target.value})} required/></div>
              </div>
              <div className="cfg"><label className="cfl">Nature of Inquiry</label>
                <select className="cfs" value={f.inquiry} onChange={e=>setF({...f,inquiry:e.target.value})}>
                  <option value="speaking">Speaking Engagement</option>
                  <option value="ministry">Ministry / Church</option>
                  <option value="books">Books & Publications</option>
                  <option value="media">Media / Interview</option>
                  <option value="leadership">ShaddaiVille Leadership Academy</option>
                  <option value="general">General Enquiry</option>
                </select>
              </div>
              <div className="cfg"><label className="cfl">Message</label><textarea className="cfta" placeholder="Your message..." value={f.msg} onChange={e=>setF({...f,msg:e.target.value})} required/></div>
              <button className="cfbtn" type="submit">Send Message →</button>
            </form>
          )}
        </div>
      </R>
    </section>
  );
}

/* ── Footer ── */
function Footer(){
  return(
    <footer className="footer">
      <div className="ft-inner">
        <div className="ftc">
          <div className="ft-logo">Dr. Kunle <span>Hamilton</span></div>
          <div className="ft-tag">Prophet · Scholar · Shepherd · Author · Media Veteran. Serving God and humanity across five nations since 1985.</div>
          <div style={{width:28,height:2,background:"var(--y)"}}/>
        </div>
        <div className="ftc">
          <div className="ft-hl">Main Site</div>
          {["About","Videos","Books","Speaking","Contact"].map(l=><a key={l} className="ftl" href={`#${l.toLowerCase()}`}>{l}</a>)}
        </div>
        <div className="ftc">
          <div className="ft-hl">CCC PraiseVille</div>
          {["About PraiseVille","Sunday Services","Festival of the Word","Pastoral Team","Join Us"].map(l=><a key={l} className="ftl" href="#ministries">{l}</a>)}
        </div>
        <div className="ftc">
          <div className="ft-hl">ShaddaiVille</div>
          {["About ShaddaiVille","Leadership Academy","Teens Academy","Outreach","Partner With Us"].map(l=><a key={l} className="ftl" href="#ministries">{l}</a>)}
        </div>
      </div>
      <div className="ft-base">
        <div className="ft-copy">© 2025 Dr. Kunle Hamilton · All Rights Reserved</div>
        <div className="ft-ydot"/>
        <div className="ft-copy">PraiseVille Global · ShaddaiVille Ministries International</div>
      </div>
    </footer>
  );
}

/* ── App ── */
export default function App(){
  return(<>
    <Css/>
    <Cursor/>
    <Nav/>
    <Hero/>
    <Ticker/>
    <About/>
    <Stats/>
    <FeaturedVideo/>
    <VideoGrid/>
    <PhotoStrip/>
    <Ministries/>
    <Books/>
    <Speaking/>
    <Contact/>
    <Footer/>
  </>);
}
