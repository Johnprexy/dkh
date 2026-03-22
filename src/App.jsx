import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";

const IMG_HERO     = "/dkh-hero.jpg";
const IMG_TEACHING = "/dkh-teaching.jpg";
const IMG_FORMAL   = "/dkh-formal.jpg";
const IMG_OLD1     = "/dkh-speaking.jpg";
const IMG_OLD2     = "/dkh-preaching.jpg";

/* ─── STYLES ─────────────────────────────────────────────────────────────── */
const S = () => (
<style>{`
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=Inter:wght@300;400;500&display=swap');

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{
  --k:#060606;
  --off:#0E0E0E;
  --card:#111111;
  --line:#1E1E1E;
  --amber:#F5A623;
  --amber2:#FFB84D;
  --amber-dim:#7A5010;
  --white:#F0EEE8;
  --muted:#6A6A6A;
  --muted2:#444;
}
html{scroll-behavior:smooth;overflow-x:hidden}
body{font-family:'Inter',sans-serif;background:var(--k);color:var(--white);overflow-x:hidden;cursor:none}
@media(max-width:768px){body{cursor:auto}}
::-webkit-scrollbar{width:1px}
::-webkit-scrollbar-thumb{background:var(--amber)}

/* CURSOR */
.cur{position:fixed;width:5px;height:5px;background:var(--amber);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%)}
.cur2{position:fixed;width:32px;height:32px;border:1px solid rgba(245,166,35,.4);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%)}
@media(max-width:768px){.cur,.cur2{display:none}}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:200;height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 4vw;transition:background .4s,border-color .4s;border-bottom:1px solid transparent}
.nav.s{background:rgba(6,6,6,.96);backdrop-filter:blur(24px);border-color:var(--line)}
.logo{font-family:'Cormorant',serif;font-size:1.15rem;font-weight:600;color:var(--white);text-decoration:none;letter-spacing:.02em;cursor:none}
.logo span{color:var(--amber);font-style:italic}
@media(max-width:768px){.logo{cursor:auto}}
.nav-d{display:flex;align-items:center;gap:2rem}
@media(max-width:900px){.nav-d{display:none}}
.nl{font-size:.6rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);text-decoration:none;cursor:none;transition:color .25s}
.nl:hover{color:var(--white)}
.n-cta{font-size:.6rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;padding:.55rem 1.4rem;background:transparent;border:1px solid var(--amber);color:var(--amber);text-decoration:none;cursor:none;transition:all .3s}
.n-cta:hover{background:var(--amber);color:var(--k)}
@media(max-width:768px){.n-cta{cursor:auto}}
.ham{display:none;background:none;border:none;cursor:pointer;padding:4px;flex-direction:column;gap:5px;z-index:10}
@media(max-width:900px){.ham{display:flex}}
.hl{width:22px;height:1px;background:var(--white);transition:transform .3s,opacity .3s}
.mob-menu{position:fixed;inset:0;background:var(--k);z-index:199;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2.5rem;border-top:1px solid var(--amber)}
.mob-menu a{font-family:'Cormorant',serif;font-size:2.5rem;font-weight:600;color:var(--white);text-decoration:none;letter-spacing:.02em}
.mob-menu a:hover{color:var(--amber)}
.mob-sep{width:1px;height:40px;background:var(--amber);opacity:.3}

/* HERO */
.hero{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;position:relative;overflow:hidden;background:var(--k)}
@media(max-width:900px){.hero{grid-template-columns:1fr;min-height:auto}}
.hero-l{display:flex;flex-direction:column;justify-content:flex-end;padding:0 5vw 8vh 6vw;position:relative;z-index:2}
@media(max-width:900px){.hero-l{padding:5rem 6vw 4rem;order:2}}
.h-pre{display:flex;align-items:center;gap:1rem;margin-bottom:2rem}
.h-pre-line{width:40px;height:1px;background:var(--amber)}
.h-pre-txt{font-size:.55rem;font-weight:500;letter-spacing:.35em;text-transform:uppercase;color:var(--amber)}
.h-name{font-family:'Bebas Neue',sans-serif;font-size:clamp(5rem,10vw,12rem);line-height:.88;letter-spacing:.01em;color:var(--white)}
.h-name .amb{color:var(--amber)}
@media(max-width:480px){.h-name{font-size:clamp(4rem,14vw,7rem)}}
.h-title{font-family:'Cormorant',serif;font-size:clamp(1rem,1.6vw,1.3rem);font-style:italic;font-weight:300;color:var(--muted);margin:1.5rem 0 2.5rem;letter-spacing:.04em;line-height:1.6;max-width:480px}
.h-actions{display:flex;gap:1rem;flex-wrap:wrap;padding-bottom:4rem}
@media(max-width:900px){.h-actions{padding-bottom:2rem}}
.b-amber{font-size:.6rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;background:var(--amber);color:var(--k);padding:.85rem 2rem;text-decoration:none;cursor:none;transition:background .3s;display:inline-block}
.b-amber:hover{background:var(--amber2)}
@media(max-width:768px){.b-amber{cursor:auto}}
.b-ghost{font-size:.6rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;border:1px solid var(--line);color:var(--muted);padding:.85rem 2rem;text-decoration:none;cursor:none;transition:all .3s;display:inline-block}
.b-ghost:hover{border-color:var(--white);color:var(--white)}
@media(max-width:768px){.b-ghost{cursor:auto}}

/* Hero right image */
.hero-r{position:relative;overflow:hidden}
@media(max-width:900px){.hero-r{height:75vw;max-height:550px;order:1}}
.h-img{width:100%;height:100%;object-fit:cover;object-position:center top;filter:contrast(1.1) brightness(.9)}
.h-overlay{position:absolute;inset:0;background:linear-gradient(to right,var(--k) 0%,transparent 20%),linear-gradient(to top,rgba(6,6,6,.7) 0%,transparent 40%)}
@media(max-width:900px){.h-overlay{background:linear-gradient(to bottom,transparent 50%,var(--k) 95%)}}
.h-num{position:absolute;bottom:2.5rem;right:2rem;font-family:'Bebas Neue',sans-serif;font-size:8rem;line-height:1;color:rgba(245,166,35,.06);user-select:none;pointer-events:none}
.h-badge{position:absolute;bottom:2rem;left:2rem;border:1px solid rgba(245,166,35,.3);padding:.7rem 1.2rem;backdrop-filter:blur(12px);background:rgba(6,6,6,.4)}
.h-badge-t{font-size:.5rem;font-weight:500;letter-spacing:.25em;text-transform:uppercase;color:var(--amber);margin-bottom:.15rem}
.h-badge-v{font-size:.72rem;font-weight:300;color:var(--muted)}
.h-bot-line{position:absolute;bottom:0;left:0;right:0;height:1px;background:var(--amber);transform-origin:left}
/* Scroll indicator */
.scroll-i{position:absolute;bottom:3rem;left:5vw;display:flex;flex-direction:column;align-items:center;gap:.6rem}
@media(max-width:900px){.scroll-i{display:none}}
.si-t{font-size:.5rem;letter-spacing:.3em;text-transform:uppercase;color:var(--muted);writing-mode:vertical-rl}
.si-line{width:1px;height:44px;background:var(--amber-dim);transform-origin:top}

/* TICKER */
.ticker{background:var(--amber);overflow:hidden;padding:.65rem 0;border-top:none;border-bottom:none}
.tick-track{display:flex;white-space:nowrap;animation:tick 26s linear infinite}
@keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.tick-item{font-size:.55rem;font-weight:500;letter-spacing:.25em;text-transform:uppercase;color:var(--k);padding:0 2rem;display:inline-flex;align-items:center;gap:2rem;opacity:.85}
.tick-star{font-size:.5rem;opacity:.5}

/* SECTION HELPERS */
.tag{display:flex;align-items:center;gap:.8rem;font-size:.55rem;font-weight:500;letter-spacing:.3em;text-transform:uppercase;color:var(--amber);margin-bottom:1.4rem}
.tag::before{content:'';width:24px;height:1px;background:var(--amber);flex-shrink:0}
.sech2{font-family:'Cormorant',serif;font-size:clamp(2.2rem,4vw,5rem);font-weight:700;line-height:1;letter-spacing:-.01em;color:var(--white)}
.sech2 i{font-style:italic;color:var(--amber)}
.sep-line{width:100%;height:1px;background:var(--line);margin:0}

/* ABOUT */
.about{display:grid;grid-template-columns:1fr 1fr;background:var(--k);border-top:1px solid var(--line)}
@media(max-width:900px){.about{grid-template-columns:1fr}}
.about-photos{position:relative;overflow:hidden;min-height:600px;background:var(--off)}
@media(max-width:900px){.about-photos{min-height:70vw;max-height:500px}}
.ap-main{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top;filter:contrast(1.1)}
.ap-card{position:absolute;bottom:0;left:0;right:0;padding:2rem;background:linear-gradient(to top,rgba(6,6,6,.95) 0%,rgba(6,6,6,.6) 60%,transparent 100%)}
.ap-quote{font-family:'Cormorant',serif;font-size:1.05rem;font-style:italic;font-weight:300;color:var(--white);line-height:1.6;margin-bottom:.6rem}
.ap-by{font-size:.5rem;font-weight:500;letter-spacing:.25em;text-transform:uppercase;color:var(--amber)}
.about-text{padding:6rem 5vw;display:flex;flex-direction:column;justify-content:center;border-left:1px solid var(--line)}
@media(max-width:900px){.about-text{border-left:none;border-top:1px solid var(--line);padding:4rem 6vw}}
.about-text p{font-size:.9rem;font-weight:300;line-height:1.9;color:var(--muted);margin-bottom:1.2rem}
.about-text p strong{color:var(--white);font-weight:400}
.about-roles{margin:2rem 0;display:flex;flex-direction:column;gap:0;border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.role-row{display:flex;align-items:center;gap:1rem;padding:.9rem 0;border-bottom:1px solid var(--line)}
.role-row:last-child{border-bottom:none}
.role-dot{width:4px;height:4px;background:var(--amber);border-radius:50%;flex-shrink:0}
.role-txt{font-size:.75rem;font-weight:300;color:var(--muted);}
.role-txt strong{color:var(--white);font-weight:400}

/* STATS */
.stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line)}
@media(max-width:700px){.stats{grid-template-columns:repeat(2,1fr)}}
.stat{padding:3rem 2rem;text-align:center;border-right:1px solid var(--line)}
.stat:last-child{border-right:none}
@media(max-width:700px){.stat:nth-child(2){border-right:none}}
.stat-n{font-family:'Bebas Neue',sans-serif;font-size:4rem;color:var(--amber);line-height:1;margin-bottom:.3rem}
.stat-l{font-size:.52rem;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:var(--muted2)}

/* MINISTRIES */
.ministries{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--line)}
@media(max-width:768px){.ministries{grid-template-columns:1fr}}
.min{padding:6rem 5vw;position:relative;overflow:hidden;border-right:1px solid var(--line)}
.min:last-child{border-right:none}
@media(max-width:768px){.min{border-right:none;border-bottom:1px solid var(--line)}}
.min::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--amber);transform:scaleX(0);transform-origin:left;transition:transform .5s}
.min:hover::before{transform:scaleX(1)}
.min-bg{position:absolute;top:1.5rem;right:2rem;font-family:'Bebas Neue',sans-serif;font-size:9rem;color:rgba(255,255,255,.02);line-height:1;pointer-events:none;user-select:none}
.min-icon{width:48px;height:48px;border:1px solid var(--amber-dim);display:flex;align-items:center;justify-content:center;margin-bottom:2.5rem;position:relative;z-index:1}
.min-icon::after{content:'✦';font-size:.7rem;color:var(--amber)}
.min-title{font-family:'Cormorant',serif;font-size:clamp(1.8rem,3vw,2.8rem);font-weight:700;color:var(--white);line-height:1.05;margin-bottom:1rem;position:relative;z-index:1}
.min-title i{font-style:italic;color:var(--amber)}
.min-sub{font-size:.55rem;font-weight:500;letter-spacing:.25em;text-transform:uppercase;color:var(--amber-dim);margin-bottom:1.5rem;display:block;position:relative;z-index:1}
.min-p{font-size:.82rem;font-weight:300;line-height:1.85;color:var(--muted);margin-bottom:2rem;position:relative;z-index:1}
.min-stats{display:flex;gap:2rem;margin-bottom:2.5rem;position:relative;z-index:1}
.ms-n{font-family:'Cormorant',serif;font-size:2rem;font-weight:700;color:var(--amber);line-height:1}
.ms-l{font-size:.48rem;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--muted2);margin-top:.2rem}
.min-link{font-size:.58rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);text-decoration:none;display:inline-flex;align-items:center;gap:.6rem;cursor:none;transition:color .3s;border-bottom:1px solid var(--line);padding-bottom:.3rem;position:relative;z-index:1}
.min-link:hover{color:var(--amber);border-color:var(--amber)}
@media(max-width:768px){.min-link{cursor:auto}}

/* VIDEOS */
.videos{padding:8rem 0;border-top:1px solid var(--line)}
@media(max-width:768px){.videos{padding:5rem 0}}
.vid-hd{padding:0 6vw 4rem}
.vids-grid{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--line)}
@media(max-width:900px){.vids-grid{grid-template-columns:1fr}}
.v-card{border-right:1px solid var(--line);overflow:hidden;position:relative;cursor:none;transition:background .3s}
.v-card:last-child{border-right:none}
.v-card:hover{background:var(--off)}
@media(max-width:900px){.v-card{border-right:none;border-bottom:1px solid var(--line);cursor:auto}}
.v-frame{width:100%;aspect-ratio:16/9;display:block;border:0;background:var(--off)}
.v-info{padding:1.5rem 2rem 2rem}
.v-tag{font-size:.5rem;font-weight:500;letter-spacing:.25em;text-transform:uppercase;color:var(--amber);display:block;margin-bottom:.6rem}
.v-title{font-family:'Cormorant',serif;font-size:1.15rem;font-weight:600;color:var(--white);line-height:1.3;margin-bottom:.5rem}
.v-src{font-size:.65rem;color:var(--muted2);font-weight:300}
.v-arrow{position:absolute;top:1.2rem;right:1.2rem;width:28px;height:28px;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:.55rem;color:var(--muted);transition:all .3s}
.v-card:hover .v-arrow{border-color:var(--amber);color:var(--amber)}

/* BOOKS */
.books{border-top:1px solid var(--line)}
.books-hd{padding:6rem 6vw 5rem;border-bottom:1px solid var(--line)}
.books-grid{display:grid;grid-template-columns:repeat(3,1fr)}
@media(max-width:900px){.books-grid{grid-template-columns:1fr}}
.bk{padding:3.5rem 4vw;border-right:1px solid var(--line);position:relative;overflow:hidden;cursor:none;transition:background .3s}
.bk:last-child{border-right:none}
.bk:hover{background:var(--off)}
@media(max-width:900px){.bk{border-right:none;border-bottom:1px solid var(--line);cursor:auto}}
.bk::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:var(--amber);transition:width .5s}
.bk:hover::after{width:100%}
.bk-n{font-family:'Bebas Neue',sans-serif;font-size:5rem;color:var(--line);line-height:1;margin-bottom:1.5rem;transition:color .3s}
.bk:hover .bk-n{color:var(--amber-dim)}
.bk-tag{font-size:.5rem;font-weight:500;letter-spacing:.25em;text-transform:uppercase;color:var(--amber);margin-bottom:.7rem}
.bk-title{font-family:'Cormorant',serif;font-size:1.5rem;font-weight:700;color:var(--white);line-height:1.15;margin-bottom:1rem}
.bk-p{font-size:.78rem;font-weight:300;line-height:1.8;color:var(--muted);margin-bottom:1.8rem}
.bk-link{font-size:.55rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--muted2);text-decoration:none;display:inline-flex;align-items:center;gap:.5rem;cursor:none;transition:color .3s}
.bk-link:hover{color:var(--amber)}
@media(max-width:768px){.bk-link{cursor:auto}}

/* SPEAKING */
.speaking{display:grid;grid-template-columns:380px 1fr;border-top:1px solid var(--line)}
@media(max-width:1024px){.speaking{grid-template-columns:1fr}}
.sp-aside{padding:6rem 5vw;border-right:1px solid var(--line);position:sticky;top:0;align-self:start;height:fit-content}
@media(max-width:1024px){.sp-aside{position:static;border-right:none;border-bottom:1px solid var(--line);padding:4rem 6vw}}
.sp-q{margin-top:2.5rem;padding:1.5rem;border-left:2px solid var(--amber);background:var(--off)}
.sp-qt{font-family:'Cormorant',serif;font-size:1.05rem;font-style:italic;font-weight:300;color:var(--white);line-height:1.6;margin-bottom:.8rem}
.sp-qby{font-size:.5rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--amber)}
.ev-list{display:flex;flex-direction:column}
.ev{display:grid;grid-template-columns:72px 1fr;gap:1.5rem;padding:1.8rem 4vw;border-bottom:1px solid var(--line);transition:background .3s}
.ev:hover{background:var(--off)}
.ev-dt{text-align:center;padding-top:.2rem}
.ev-d{font-family:'Bebas Neue',sans-serif;font-size:2.8rem;color:var(--amber);line-height:1}
.ev-m{font-size:.48rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--muted2)}
.ev-name{font-family:'Cormorant',serif;font-size:1.15rem;font-weight:600;color:var(--white);margin-bottom:.35rem;line-height:1.2}
.ev-meta{font-size:.65rem;color:var(--muted2);display:flex;gap:.7rem;flex-wrap:wrap}
.ev-type{color:var(--amber-dim)}

/* CONTACT */
.contact{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--line)}
@media(max-width:900px){.contact{grid-template-columns:1fr}}
.ct-photo-wrap{position:relative;overflow:hidden;min-height:600px}
@media(max-width:900px){.ct-photo-wrap{min-height:70vw;max-height:500px}}
.ct-photo{width:100%;height:100%;object-fit:cover;object-position:top;filter:contrast(1.1) brightness(.85)}
.ct-photo-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(6,6,6,.8) 0%,transparent 50%)}
.ct-photo-txt{position:absolute;bottom:2.5rem;left:2.5rem;right:2.5rem}
.ct-photo-ttl{font-family:'Cormorant',serif;font-size:1.5rem;font-weight:700;color:var(--white);margin-bottom:.3rem;font-style:italic}
.ct-photo-sub{font-size:.55rem;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:var(--amber)}
.ct-form-wrap{padding:6rem 5vw;border-left:1px solid var(--line)}
@media(max-width:900px){.ct-form-wrap{border-left:none;border-top:1px solid var(--line);padding:4rem 6vw}}
.ct-details{display:flex;flex-direction:column;gap:.9rem;margin:2rem 0 2.5rem;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:1.5rem 0}
.ctd{display:flex;gap:1rem;align-items:flex-start}
.ctd-icon{font-size:.6rem;color:var(--amber);margin-top:2px;flex-shrink:0;width:12px}
.ctd-lbl{font-size:.5rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--muted2);margin-bottom:.15rem}
.ctd-val{font-size:.78rem;font-weight:300;color:var(--muted)}
.cform{display:flex;flex-direction:column;gap:.85rem}
.crow{display:grid;grid-template-columns:1fr 1fr;gap:.85rem}
@media(max-width:480px){.crow{grid-template-columns:1fr}}
.cfg{display:flex;flex-direction:column;gap:.35rem}
.cfl{font-size:.5rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;color:var(--muted2)}
.cfi,.cfs,.cfta{background:var(--off);border:1px solid var(--line);padding:.8rem .9rem;font-family:'Inter',sans-serif;font-size:.8rem;font-weight:300;color:var(--white);outline:none;width:100%;transition:border-color .3s;-webkit-appearance:none;border-radius:0}
.cfi::placeholder,.cfta::placeholder{color:var(--muted2)}
.cfi:focus,.cfs:focus,.cfta:focus{border-color:var(--amber)}
.cfs option{background:var(--k)}
.cfta{min-height:100px;resize:vertical}
.cfbtn{font-size:.6rem;font-weight:500;letter-spacing:.2em;text-transform:uppercase;background:var(--amber);color:var(--k);padding:.95rem 2rem;border:none;cursor:none;font-family:'Inter',sans-serif;transition:background .3s;align-self:flex-start;width:100%}
.cfbtn:hover{background:var(--amber2)}
@media(max-width:768px){.cfbtn{cursor:auto}}
.sent{padding:3rem 2rem;text-align:center;border:1px solid var(--amber-dim)}
.sent-icon{font-family:'Bebas Neue',sans-serif;font-size:3rem;color:var(--amber);margin-bottom:.5rem}
.sent-t{font-family:'Cormorant',serif;font-size:1.5rem;font-weight:700;color:var(--white);margin-bottom:.5rem}
.sent-s{font-size:.75rem;font-weight:300;color:var(--muted)}

/* FOOTER */
.footer{border-top:2px solid var(--amber);background:var(--off)}
.ft-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:0;border-bottom:1px solid var(--line)}
@media(max-width:900px){.ft-top{grid-template-columns:1fr 1fr}}
@media(max-width:480px){.ft-top{grid-template-columns:1fr}}
.ft-col{padding:4rem 4vw;border-right:1px solid var(--line)}
.ft-col:last-child{border-right:none}
@media(max-width:900px){.ft-col:nth-child(2){border-right:none}.ft-col:nth-child(3){border-top:1px solid var(--line)}.ft-col:nth-child(4){border-right:none;border-top:1px solid var(--line)}}
@media(max-width:480px){.ft-col{border-right:none!important;border-bottom:1px solid var(--line)}.ft-col:last-child{border-bottom:none}}
.ft-logo{font-family:'Cormorant',serif;font-size:1.3rem;font-weight:700;color:var(--white);margin-bottom:.8rem}
.ft-logo span{color:var(--amber);font-style:italic}
.ft-tagline{font-size:.72rem;font-weight:300;line-height:1.7;color:var(--muted2);margin-bottom:1.5rem;max-width:260px}
.ft-hl{font-size:.5rem;font-weight:500;letter-spacing:.28em;text-transform:uppercase;color:var(--amber);margin-bottom:1.3rem}
.ftl{display:block;font-size:.72rem;font-weight:300;color:var(--muted2);text-decoration:none;margin-bottom:.55rem;transition:color .25s;cursor:none}
.ftl:hover{color:var(--white)}
@media(max-width:768px){.ftl{cursor:auto}}
.ft-bottom{padding:1.5rem 4vw;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem}
.ft-copy{font-size:.58rem;font-weight:300;color:var(--muted2);letter-spacing:.05em}
.ft-amber-dot{width:5px;height:5px;border-radius:50%;background:var(--amber)}
`}</style>
);

/* ─── CURSOR ─────────────────────────────────────────────────────────────── */
function Cursor() {
  const mx=useMotionValue(-100),my=useMotionValue(-100);
  const rx=useSpring(mx,{stiffness:200,damping:22}),ry=useSpring(my,{stiffness:200,damping:22});
  useEffect(()=>{const fn=e=>{mx.set(e.clientX);my.set(e.clientY)};window.addEventListener("mousemove",fn);return()=>window.removeEventListener("mousemove",fn)},[]);
  return(<><motion.div className="cur" style={{left:mx,top:my}}/><motion.div className="cur2" style={{left:rx,top:ry}}/></>);
}

/* ─── REVEAL ─────────────────────────────────────────────────────────────── */
function R({children,delay=0,y=28,x=0,className=""}){
  const ref=useRef(null);
  const v=useInView(ref,{once:true,margin:"-40px"});
  return(<motion.div ref={ref} className={className} initial={{opacity:0,y,x}} animate={v?{opacity:1,y:0,x:0}:{}} transition={{duration:.8,delay,ease:[.22,1,.36,1]}}>{children}</motion.div>);
}

/* ─── NAV ────────────────────────────────────────────────────────────────── */
function Nav(){
  const[bg,setBg]=useState(false),[open,setOpen]=useState(false);
  useEffect(()=>{const fn=()=>setBg(window.scrollY>30);window.addEventListener("scroll",fn);return()=>window.removeEventListener("scroll",fn)},[]);
  const links=["About","Ministries","Videos","Books","Speaking","Contact"];
  return(<>
    <motion.header className={`nav${bg?" s":""}`} initial={{y:-70,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:.7,ease:[.22,1,.36,1]}}>
      <a className="logo" href="#home">Dr. Kunle <span>Hamilton</span></a>
      <div className="nav-d">
        {links.map(l=><a key={l} className="nl" href={`#${l.toLowerCase()}`}>{l}</a>)}
        <a className="n-cta" href="#contact">Book a Session</a>
      </div>
      <button className="ham" onClick={()=>setOpen(!open)} aria-label="Menu">
        <div className="hl" style={open?{transform:"rotate(45deg) translate(5px,5px)"}:{}}/>
        <div className="hl" style={open?{opacity:0}:{}}/>
        <div className="hl" style={open?{transform:"rotate(-45deg) translate(5px,-5px)"}:{}}/>
      </button>
    </motion.header>
    <AnimatePresence>
      {open&&(
        <motion.div className="mob-menu" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.25}}>
          {links.map(l=><a key={l} href={`#${l.toLowerCase()}`} onClick={()=>setOpen(false)}>{l}</a>)}
          <div className="mob-sep"/>
          <a className="b-amber" href="#contact" onClick={()=>setOpen(false)}>Book a Session</a>
        </motion.div>
      )}
    </AnimatePresence>
  </>);
}

/* ─── HERO ───────────────────────────────────────────────────────────────── */
function Hero(){
  const{scrollY}=useScroll();
  const iy=useTransform(scrollY,[0,600],[0,80]);
  return(
    <section className="hero" id="home">
      <div className="hero-l">
        <motion.div className="h-pre" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:.5,duration:.7}}>
          <div className="h-pre-line"/><span className="h-pre-txt">Prophet · Scholar · Shepherd · Author</span>
        </motion.div>
        <motion.div className="h-name" initial={{opacity:0,y:60}} animate={{opacity:1,y:0}} transition={{delay:.65,duration:1,ease:[.22,1,.36,1]}}>
          <div>DR.</div>
          <div>KUNLE</div>
          <div className="amb">HAMILTON</div>
        </motion.div>
        <motion.p className="h-title" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.95,duration:.8}}>
          Veteran journalist. International author. Prophet of the Celestial Church. Founder of PraiseVille Global & ShaddaiVille Ministries — a life poured out for God and humanity across five nations.
        </motion.p>
        <motion.div className="h-actions" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:1.1,duration:.7}}>
          <a className="b-amber" href="#about">Discover His Story</a>
          <a className="b-ghost" href="#videos">Watch Teachings</a>
        </motion.div>
        <div className="scroll-i">
          <span className="si-t">Scroll</span>
          <motion.div className="si-line" animate={{scaleY:[0,1,0]}} transition={{duration:2,repeat:Infinity,ease:"easeInOut"}}/>
        </div>
      </div>
      <motion.div className="hero-r" style={{y:iy}}>
        <img src={IMG_HERO} alt="Dr. Kunle Hamilton" className="h-img"/>
        <div className="h-overlay"/>
        <div className="h-num">KH</div>
        <div className="h-badge">
          <div className="h-badge-t">Senior Shepherd</div>
          <div className="h-badge-v">CCC PraiseVille Global</div>
        </div>
        <motion.div className="h-bot-line" initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:1.5,delay:1.3,ease:[.22,1,.36,1]}}/>
      </motion.div>
    </section>
  );
}

/* ─── TICKER ─────────────────────────────────────────────────────────────── */
const TI=["Prophet","Scholar","Media Veteran","Bestselling Author","Senior Shepherd","PraiseVille Global","ShaddaiVille International","Discipleship","Berlin · Lagos · London","Leadership","Nigeria's Finest"];
function Ticker(){
  const all=[...TI,...TI];
  return(<div className="ticker"><div className="tick-track">{all.map((t,i)=><span key={i} className="tick-item">{t}<span className="tick-star">✦</span></span>)}</div></div>);
}

/* ─── ABOUT ──────────────────────────────────────────────────────────────── */
function About(){
  return(
    <section className="about" id="about">
      <R x={-20} y={0}>
        <div className="about-photos">
          <img src={IMG_HERO} alt="Dr. Kunle Hamilton" className="ap-main"/>
          <div className="ap-card">
            <div className="ap-quote">"If God had not arrested me with the drama of the Celestial Church, He would have lost me to atheism."</div>
            <div className="ap-by">— Dr. Kunle Hamilton, Prophet & Scholar</div>
          </div>
        </div>
      </R>
      <div className="about-text">
        <R><div className="tag">The Man Behind the Ministry</div></R>
        <R delay={.1}><h2 className="sech2">A Philosopher<br/>Who Found <i>God.</i></h2></R>
        <R delay={.2}>
          <div style={{height:1,background:"var(--line)",margin:"2rem 0"}}/>
          <p>Dr. Kunle Hamilton is one of Nigeria's most remarkable multi-disciplinary voices — <strong>a Prophet of the Celestial Church of Christ</strong>, veteran journalist, media executive, reputation management expert, international author, and transformative spiritual leader whose reach spans four continents.</p>
          <p>A <strong>Philosophy first-class graduate</strong> (Best Student, 1985) and Mass Communication scholar from the University of Lagos, Dr. Hamilton fuses rigorous academic thought with prophetic grace. His ministry is defined by discipleship, nation-building, and the empowerment of the next generation.</p>
        </R>
        <R delay={.3}>
          <div className="about-roles">
            {[
              ["Senior Shepherd","CCC PraiseVille Global — Nigeria · Germany · UK · USA"],
              ["Founder & President","ShaddaiVille Ministries International — since 2007"],
              ["CEO","Virgin Outdoor — Reputation & Brand Management, Lagos"],
              ["International Author","Published in 18 countries by Lambert Academic Publishing"],
            ].map(([t,v],i)=>(
              <div className="role-row" key={i}>
                <div className="role-dot"/>
                <div className="role-txt"><strong>{t}</strong> — {v}</div>
              </div>
            ))}
          </div>
        </R>
        <R delay={.4}><a className="b-amber" href="#contact" style={{display:"inline-block",marginTop:"1.5rem"}}>Connect with Dr. Hamilton</a></R>
      </div>
    </section>
  );
}

/* ─── STATS ──────────────────────────────────────────────────────────────── */
function Stats(){
  return(
    <div className="stats">
      {[{n:"40+",l:"Years in Ministry"},{n:"5",l:"Nations of Impact"},{n:"2",l:"Thriving Ministries"},{n:"18",l:"Countries Published"}].map((s,i)=>(
        <motion.div key={i} className="stat" initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.1,duration:.6}}>
          <div className="stat-n">{s.n}</div>
          <div className="stat-l">{s.l}</div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── MINISTRIES ─────────────────────────────────────────────────────────── */
function Ministries(){
  return(
    <section className="ministries" id="ministries">
      <R x={-20} y={0}>
        <div className="min">
          <div className="min-bg">PV</div>
          <div className="min-icon"/>
          <span className="min-sub">Celestial Church of Christ</span>
          <h3 className="min-title">CCC <i>PraiseVille</i><br/>Global</h3>
          <p className="min-p">Founded in Berlin, Germany on May 8, 2016 — now flourishing across Nigeria, UK, USA and Germany. PraiseVille is a place of authentic worship, genuine prophecy, and deep fellowship where the Celestial Church lives in the modern world.</p>
          <div className="min-stats">
            <div><div className="ms-n">4+</div><div className="ms-l">Countries</div></div>
            <div><div className="ms-n">2016</div><div className="ms-l">Founded</div></div>
            <div><div className="ms-n">7+</div><div className="ms-l">Annual Harvest</div></div>
          </div>
          <a className="min-link" href="#contact">Explore PraiseVille →</a>
        </div>
      </R>
      <R x={20} y={0}>
        <div className="min">
          <div className="min-bg">SV</div>
          <div className="min-icon"/>
          <span className="min-sub">Non-Denominational · Global Training</span>
          <h3 className="min-title">ShaddaiVille<br/><i>Ministries</i><br/>International</h3>
          <p className="min-p">"God's City" — training Christians and Muslims in UK-certified leadership and entrepreneurship since 2007. Free of charge. Building moral beacons and nation-builders across Nigeria, USA, UK, Germany and Canada.</p>
          <div className="min-stats">
            <div><div className="ms-n">5</div><div className="ms-l">Nations</div></div>
            <div><div className="ms-n">2007</div><div className="ms-l">Est. Nigeria</div></div>
            <div><div className="ms-n">UK</div><div className="ms-l">Certified Academy</div></div>
          </div>
          <a className="min-link" href="#contact">Explore ShaddaiVille →</a>
        </div>
      </R>
    </section>
  );
}

/* ─── VIDEOS ─────────────────────────────────────────────────────────────── */
function Videos(){
  const vids=[
    {url:"https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fcelestial.focus%2Fvideos%2F1356642479037237&show_text=false",tag:"Discipleship · Teaching",title:"Dr. Kunle Hamilton Teaches Discipleship",src:"CelestialFocus · Facebook"},
    {url:"https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fhephzibahtelevision%2Fvideos%2F449065333576250&show_text=false",tag:"Leadership · Interview",title:"Meeting with Dr. Hamilton — The Roles of Leadership",src:"Hephzibah Television · Facebook"},
    {url:"https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fcelestial.focus%2Fvideos%2F1241668604555889&show_text=false",tag:"Worship · Celebration",title:"Christmas — CCC PraiseVille Highlight",src:"CelestialFocus · Facebook"},
  ];
  return(
    <section className="videos" id="videos">
      <div className="vid-hd">
        <R><div className="tag">Teachings, Sermons & Interviews</div></R>
        <R delay={.1}><h2 className="sech2">Watch Dr. Hamilton <i>In Action</i></h2></R>
      </div>
      <div className="vids-grid">
        {vids.map((v,i)=>(
          <R key={i} delay={i*.12}>
            <div className="v-card">
              <div className="v-arrow">↗</div>
              <iframe className="v-frame" src={v.url} scrolling="no" frameBorder="0" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" title={v.title}/>
              <div className="v-info">
                <span className="v-tag">{v.tag}</span>
                <div className="v-title">{v.title}</div>
                <div className="v-src">{v.src}</div>
              </div>
            </div>
          </R>
        ))}
      </div>
    </section>
  );
}

/* ─── BOOKS ──────────────────────────────────────────────────────────────── */
function Books(){
  const bks=[
    {tag:"Leadership",title:"Releasing the Eagle in You",p:"An eight-chapter inspirational work on leadership and self-actualization — a guide to unlocking the greatness God placed within every person. Published internationally in 18 countries."},
    {tag:"Philosophy",title:"Journey to Understanding",p:"A philosophical investigation of how style and content impact the spoken word, using the church and Raypower 100.5 FM as its remarkable canvas."},
    {tag:"Ministry",title:"The ShaddaiVille Vision",p:"Dr. Hamilton's framework for discipleship-driven ministry that transcends denominational walls — building leaders, entrepreneurs and moral beacons across faith traditions."},
  ];
  return(
    <section className="books" id="books">
      <div className="books-hd">
        <R><div className="tag">Written Works</div></R>
        <R delay={.1}><h2 className="sech2">Books &amp; <i>Publications</i></h2></R>
      </div>
      <div className="books-grid">
        {bks.map((b,i)=>(
          <R key={i} delay={i*.12}>
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

/* ─── SPEAKING ───────────────────────────────────────────────────────────── */
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
      <div className="sp-aside">
        <R><div className="tag">Events & Engagements</div></R>
        <R delay={.1}><h2 className="sech2">Speaking &amp;<br/><i>Appearances</i></h2></R>
        <R delay={.2}>
          <div className="sp-q">
            <div className="sp-qt">"The responsibility of religious leaders is to guide young people towards righteousness — not to encourage them to chase fame through questionable means."</div>
            <div className="sp-qby">— Dr. Kunle Hamilton</div>
          </div>
        </R>
        <R delay={.3}><div style={{marginTop:"2rem"}}><a className="b-amber" href="#contact">Invite Dr. Hamilton</a></div></R>
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

/* ─── CONTACT ────────────────────────────────────────────────────────────── */
function Contact(){
  const[f,setF]=useState({name:"",email:"",inquiry:"speaking",msg:""});
  const[sent,setSent]=useState(false);
  return(
    <section className="contact" id="contact">
      <R x={-20} y={0}>
        <div className="ct-photo-wrap">
          <img src={IMG_TEACHING} alt="Dr. Kunle Hamilton teaching" className="ct-photo"/>
          <div className="ct-photo-ov"/>
          <div className="ct-photo-txt">
            <div className="ct-photo-ttl">Let's Connect</div>
            <div className="ct-photo-sub">Reach Dr. Hamilton's Team</div>
          </div>
        </div>
      </R>
      <R delay={.15}>
        <div className="ct-form-wrap">
          <div className="tag">Get in Touch</div>
          <h2 className="sech2">Send a <i>Message</i></h2>
          <div className="ct-details">
            {[
              ["✦","Ministry","CCC PraiseVille Global · ShaddaiVille International"],
              ["✦","Based In","Lagos, Nigeria · Berlin, Germany · London, UK"],
              ["✦","Media & PR","Virgin Outdoor Communications, Lagos"],
            ].map(([ic,lbl,val],i)=>(
              <div className="ctd" key={i}>
                <div className="ctd-icon">{ic}</div>
                <div><div className="ctd-lbl">{lbl}</div><div className="ctd-val">{val}</div></div>
              </div>
            ))}
          </div>
          {sent?(
            <motion.div className="sent" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}>
              <div className="sent-icon">✦</div>
              <div className="sent-t">Message Received</div>
              <div className="sent-s">Dr. Hamilton's team will be in touch with you shortly.</div>
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

/* ─── FOOTER ─────────────────────────────────────────────────────────────── */
function Footer(){
  return(
    <footer className="footer">
      <div className="ft-top">
        <div className="ft-col">
          <div className="ft-logo">Dr. Kunle <span>Hamilton</span></div>
          <div className="ft-tagline">Prophet · Scholar · Shepherd · Author · Media Veteran. Serving God and humanity across five nations since 1985.</div>
          <div style={{width:30,height:1,background:"var(--amber)"}}/>
        </div>
        <div className="ft-col">
          <div className="ft-hl">Main Site</div>
          {["About","Videos","Books","Speaking","Contact"].map(l=><a key={l} className="ftl" href={`#${l.toLowerCase()}`}>{l}</a>)}
        </div>
        <div className="ft-col">
          <div className="ft-hl">CCC PraiseVille</div>
          {["About PraiseVille","Sunday Services","Festival of the Word","Pastoral Team","Join Us"].map(l=><a key={l} className="ftl" href="#ministries">{l}</a>)}
        </div>
        <div className="ft-col">
          <div className="ft-hl">ShaddaiVille</div>
          {["About ShaddaiVille","Leadership Academy","Teens Academy","Outreach","Partner With Us"].map(l=><a key={l} className="ftl" href="#ministries">{l}</a>)}
        </div>
      </div>
      <div className="ft-bottom">
        <div className="ft-copy">© 2025 Dr. Kunle Hamilton · All Rights Reserved</div>
        <div className="ft-amber-dot"/>
        <div className="ft-copy">PraiseVille Global · ShaddaiVille Ministries International</div>
      </div>
    </footer>
  );
}

/* ─── APP ────────────────────────────────────────────────────────────────── */
export default function App(){
  return(<>
    <S/><Cursor/><Nav/><Hero/><Ticker/><About/><Stats/>
    <Ministries/><Videos/><Books/><Speaking/><Contact/><Footer/>
  </>);
}
