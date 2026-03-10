import React, { useEffect, useRef, useState } from 'react';
import birthdayImage from './../assets/ii.jpeg';

const Birthday = () => {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 300);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Floating petals & sparkles
    const symbols = ['🌸', '🌷', '💮', '✿', '❀', '🌺', '💗', '✨', '💫', '🦋'];
    const petals = Array.from({ length: 40 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight + window.innerHeight,
      size: Math.random() * 18 + 8,
      speedY: -(Math.random() * 0.8 + 0.2),
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.02 + 0.005,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
    }));

    // Confetti cannon state
    let confetti = [];
    const confettiColors = [
      '#ffb3c6','#ff85a1','#ffc8dd','#ff5c8a',
      '#ffcfd2','#f4acb7','#ffb347','#ff6eb4',
      '#c77dff','#e0aaff','#ffd6ff','#ff9ebb',
    ];
    const shapes = ['rect', 'ribbon', 'circle', 'rect', 'ribbon'];

    const spawnCannon = (fromLeft) => {
      // Fire from top-left or top-right corner of the entire screen
      const ox = fromLeft ? 0 : canvas.width;
      const oy = 0;

      const count = 120;
      for (let i = 0; i < count; i++) {
        const baseAngle = fromLeft
          ? (Math.random() * Math.PI * 0.45)          // top-left: fans down-right
          : (Math.PI - Math.random() * Math.PI * 0.45); // top-right: fans down-left
        const speed = Math.random() * 14 + 6;
        confetti.push({
          x: ox, y: oy,
          vx: Math.cos(baseAngle) * speed,
          vy: Math.sin(baseAngle) * speed,
          alpha: 1,
          decay: Math.random() * 0.009 + 0.005,
          w: Math.random() * 10 + 5,
          h: Math.random() * 5 + 3,
          color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
          gravity: 0.20,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.2,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          wobble: Math.random() * Math.PI * 2,
          wobbleSpeed: Math.random() * 0.08 + 0.03,
        });
      }
    };

    const blast = () => {
      spawnCannon(true);
      setTimeout(() => spawnCannon(false), 150);
    };

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Petals
      petals.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.wobble) * 0.4;
        p.wobble += p.wobbleSpeed;
        p.rotation += p.rotSpeed;
        if (p.y < -60) { p.y = canvas.height + 60; p.x = Math.random() * canvas.width; }
        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.symbol, 0, 0);
        ctx.restore();
      });

      // Confetti
      confetti = confetti.filter(c => c.alpha > 0.01);
      confetti.forEach(c => {
        c.x += c.vx; c.y += c.vy;
        c.vy += c.gravity;
        c.vx += Math.sin(c.wobble) * 0.3;
        c.wobble += c.wobbleSpeed;
        c.rotation += c.rotSpeed;
        c.alpha -= c.decay;
        ctx.save();
        ctx.globalAlpha = Math.max(0, c.alpha);
        ctx.fillStyle = c.color;
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rotation);
        if (c.shape === 'circle') {
          ctx.beginPath(); ctx.arc(0, 0, c.w / 2, 0, Math.PI * 2); ctx.fill();
        } else if (c.shape === 'ribbon') {
          ctx.fillRect(-c.w * 1.5, -c.h / 2, c.w * 3, c.h / 2);
        } else {
          ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        }
        ctx.restore();
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    setTimeout(() => blast(), 500);
    const intervalId = setInterval(() => blast(), 6000);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(intervalId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Great+Vibes&family=Jost:wght@300;400&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { height: 100%; overflow: hidden; }

        :root {
          --rose:      #e8849a;
          --rose-deep: #c9607a;
          --blush:     #f7cad0;
          --petal:     #fde8ec;
          --gold:      #d4a0a7;
          --cream:     #fdf6f8;
          --text:      #7a3d52;
          --text-lt:   #b5788a;
        }

        .g-root {
          position: relative;
          width: 100vw; height: 100vh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--cream);
        }

        /* ── Layered background ── */
        .g-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 10% 10%, rgba(255,192,203,0.45) 0%, transparent 60%),
            radial-gradient(ellipse 60% 70% at 90% 90%, rgba(255,182,193,0.40) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 90% 5%,  rgba(255,218,224,0.35) 0%, transparent 55%),
            radial-gradient(ellipse 40% 50% at 5%  90%, rgba(255,160,180,0.30) 0%, transparent 55%),
            linear-gradient(145deg, #fff0f3 0%, #fdf6f8 40%, #fff5f7 100%);
        }

        /* Soft lace-like dot grid */
        .g-texture {
          position: absolute; inset: 0;
          background-image:
            radial-gradient(circle, rgba(220,120,150,0.12) 1px, transparent 1px),
            radial-gradient(circle, rgba(200,100,130,0.08) 1px, transparent 1px);
          background-size: 22px 22px, 44px 44px;
          background-position: 0 0, 11px 11px;
          pointer-events: none;
        }

        /* Ambient soft glows */
        .g-glow {
          position: absolute; border-radius: 50%;
          filter: blur(70px); pointer-events: none; z-index: 0;
          animation: glowPulse ease-in-out infinite alternate;
        }
        .g-glow-1 { width:380px;height:380px; background:rgba(255,182,193,0.28); top:-100px;left:-100px; animation-duration:8s; }
        .g-glow-2 { width:320px;height:320px; background:rgba(255,160,180,0.22); bottom:-80px;right:-80px; animation-duration:10s;animation-delay:1.5s; }
        .g-glow-3 { width:240px;height:240px; background:rgba(255,200,210,0.20); top:35%;right:2%; animation-duration:7s;animation-delay:0.8s; }
        .g-glow-4 { width:200px;height:200px; background:rgba(255,175,195,0.18); bottom:25%;left:2%; animation-duration:9s;animation-delay:2s; }
        @keyframes glowPulse {
          from { transform: scale(1) translate(0,0); }
          to   { transform: scale(1.1) translate(12px,-16px); }
        }

        canvas.g-canvas {
          position: absolute; inset: 0; z-index: 2; pointer-events: none;
        }

        /* ── Layout: side by side ── */
        .g-card {
          position: relative; z-index: 10;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: clamp(24px, 4vw, 60px);
          padding: 0 32px;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 1.2s cubic-bezier(0.16,1,0.3,1), transform 1.2s cubic-bezier(0.16,1,0.3,1);
        }
        .g-card.visible { opacity: 1; transform: translateY(0); }

        /* ── Left: text side ── */
        .g-text-side {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          max-width: 380px;
        }

        .g-eyebrow {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 10px;
          opacity: 0; animation: fadeSlide 0.8s ease forwards 0.5s;
        }
        .g-eyebrow-line {
          width: 36px; height: 1.5px;
          background: linear-gradient(90deg, var(--rose), transparent);
          border-radius: 2px;
        }
        .g-eyebrow-text {
          font-family: 'Jost', sans-serif;
          font-size: 0.6rem; font-weight: 300;
          letter-spacing: 5px; color: var(--rose);
          text-transform: uppercase;
        }

        .g-title {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(3rem, 5.5vw, 5.2rem);
          line-height: 1.05;
          color: var(--rose-deep);
          filter: drop-shadow(0 2px 12px rgba(200,80,110,0.18));
          margin-bottom: 4px;
          opacity: 0; animation: fadeSlide 1s ease forwards 0.75s;
        }

        .g-name {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-style: italic; font-weight: 300;
          font-size: clamp(1.6rem, 3vw, 2.6rem);
          color: var(--text);
          letter-spacing: 3px;
          margin-bottom: 24px;
          opacity: 0; animation: fadeSlide 1s ease forwards 1s;
        }

        /* Divider */
        .g-divider {
          display: flex; align-items: center; gap: 12px;
          width: 100%; margin-bottom: 20px;
          opacity: 0; animation: fadeSlide 1s ease forwards 1.15s;
        }
        .g-div-line { flex:1; height:1px; background: linear-gradient(90deg, var(--blush), transparent); }
        .g-div-icon { font-size: 0.9rem; }

        .g-wish {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-style: italic; font-weight: 300;
          font-size: clamp(1rem, 1.6vw, 1.2rem);
          color: var(--text-lt);
          line-height: 1.85;
          letter-spacing: 0.4px;
          margin-bottom: 28px;
          opacity: 0; animation: fadeSlide 1s ease forwards 1.3s;
        }

        /* Signature */
        .g-sig {
          display: flex; flex-direction: column; gap: 2px;
          opacity: 0; animation: fadeSlide 1s ease forwards 1.55s;
        }
        .g-sig-from {
          font-family: 'Jost', sans-serif; font-weight: 300;
          font-size: 0.58rem; letter-spacing: 4px;
          color: var(--text-lt); text-transform: uppercase;
        }
        .g-sig-name {
          font-family: 'Great Vibes', cursive;
          font-size: 1.8rem; color: var(--rose-deep);
          line-height: 1;
        }

        /* ── Right: photo side ── */
        .g-photo-side {
          position: relative;
          flex-shrink: 0;
          opacity: 0; animation: fadeSlide 1.1s ease forwards 0.9s;
        }

        /* Decorative petal shapes behind photo */
        .g-photo-side::before {
          content: '';
          position: absolute;
          width: calc(100% + 40px); height: calc(100% + 40px);
          top: -20px; left: -20px;
          border-radius: 60% 40% 55% 45% / 45% 55% 45% 55%;
          background: linear-gradient(135deg, rgba(255,182,193,0.30), rgba(255,160,175,0.20));
          animation: morphShape 8s ease-in-out infinite alternate;
          z-index: -1;
        }
        .g-photo-side::after {
          content: '';
          position: absolute;
          width: calc(100% + 24px); height: calc(100% + 24px);
          top: -12px; left: -12px;
          border-radius: 45% 55% 40% 60% / 55% 45% 55% 45%;
          border: 1.5px solid rgba(220,140,160,0.30);
          animation: morphShape 8s ease-in-out infinite alternate-reverse;
          z-index: -1;
        }
        @keyframes morphShape {
          0%   { border-radius: 60% 40% 55% 45% / 45% 55% 45% 55%; }
          50%  { border-radius: 40% 60% 45% 55% / 55% 45% 55% 45%; }
          100% { border-radius: 55% 45% 60% 40% / 40% 60% 40% 60%; }
        }

        .g-photo-frame {
          width: clamp(200px, 26vw, 300px);
          height: clamp(260px, 34vw, 390px);
          border-radius: 48% 52% 44% 56% / 42% 48% 52% 58%;
          overflow: hidden;
          border: 4px solid rgba(255,255,255,0.9);
          box-shadow:
            0 16px 48px rgba(200,80,110,0.18),
            0 4px 16px rgba(220,120,140,0.14),
            inset 0 0 0 2px rgba(255,210,220,0.5);
          position: relative;
          animation: floatPhoto 6s ease-in-out infinite alternate;
        }
        @keyframes floatPhoto {
          from { transform: translateY(0px) rotate(-0.5deg); }
          to   { transform: translateY(-10px) rotate(0.5deg); }
        }

        .g-photo-frame img {
          width: 100%; height: 100%;
          object-fit: cover; object-position: center top;
          display: block;
        }

        /* Floating badge */
        .g-badge {
          position: absolute;
          bottom: -14px; left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #e8849a, #c9607a);
          color: #fff;
          font-family: 'Jost', sans-serif;
          font-size: 0.6rem; font-weight: 400;
          letter-spacing: 4px; text-transform: uppercase;
          padding: 7px 20px;
          border-radius: 30px;
          box-shadow: 0 4px 16px rgba(200,80,110,0.30);
          white-space: nowrap;
          z-index: 5;
        }

        /* ── Floating corner roses ── */
        .corner-rose {
          position: absolute; font-size: 2rem; z-index: 5;
          pointer-events: none;
          animation: roseFloat ease-in-out infinite alternate;
          filter: drop-shadow(0 3px 6px rgba(200,80,110,0.20));
        }
        .cr-1 { top: 12px;  left: 16px;  font-size: 2.2rem; animation-duration:4s; }
        .cr-2 { top: 12px;  right: 16px; font-size: 1.8rem; animation-duration:5s; animation-delay:0.6s; }
        .cr-3 { bottom:16px; left: 16px; font-size:1.8rem;  animation-duration:4.5s; animation-delay:1.2s; }
        .cr-4 { bottom:16px; right:16px; font-size:2rem;    animation-duration:3.8s; animation-delay:0.3s; }
        @keyframes roseFloat {
          from { transform: translateY(0) rotate(-6deg) scale(1); }
          to   { transform: translateY(-10px) rotate(6deg) scale(1.1); }
        }

        /* ── Credit ── */
        .g-credit {
          position: absolute; bottom: 18px; right: 22px;
          z-index: 10; text-align: right;
          opacity: 0; animation: fadeSlide 1s ease forwards 2.2s;
        }
        .g-credit-by {
          font-family: 'Jost', sans-serif; font-weight:300;
          font-size:0.55rem; letter-spacing:4px;
          color: var(--text-lt); text-transform:uppercase; display:block;
        }
        .g-credit-name {
          font-family: 'Great Vibes', cursive;
          font-size: 1.4rem; color: var(--rose-deep); opacity: 0.7;
        }

        @keyframes fadeSlide {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }

        /* ── Responsive ── */
        @media (max-width: 820px) {
          .g-card {
            flex-direction: column-reverse;
            gap: 20px; padding: 16px 20px;
            justify-content: center;
          }
          .g-text-side { align-items: center; text-align: center; max-width: 92vw; }
          .g-eyebrow { justify-content: center; }
          .g-divider { justify-content: center; }
          .g-sig { align-items: center; }
          .g-photo-frame { width: clamp(160px, 52vw, 220px); height: clamp(200px, 65vw, 275px); }
          .g-wish { font-size: 1rem; margin-bottom: 16px; }
          .g-title { font-size: clamp(2.6rem, 9vw, 4rem); }
          .g-name { font-size: clamp(1.3rem, 5vw, 2rem); margin-bottom: 14px; }
        }
        @media (max-width: 480px) {
          .g-card { gap: 14px; padding: 10px 14px; }
          .g-photo-frame { width: 54vw; height: 68vw; max-width: 200px; max-height: 252px; }
          .g-title { font-size: clamp(2.2rem, 10vw, 3.2rem); }
          .g-name { font-size: clamp(1.1rem, 5.5vw, 1.6rem); }
          .g-wish { font-size: 0.92rem; line-height: 1.7; }
          .corner-rose { font-size: 1.4rem; }
          .cr-1,.cr-2 { top:8px; } .cr-1 { left:8px; } .cr-2 { right:8px; }
          .cr-3,.cr-4 { bottom:10px; } .cr-3 { left:8px; } .cr-4 { right:8px; }
        }
        @media (max-width: 360px) {
          .g-title { font-size: 2rem; }
          .g-photo-frame { width: 60vw; height: 75vw; }
        }
        @media (max-height: 600px) and (orientation: landscape) {
          .g-root { overflow-y: auto; height: auto; min-height: 100vh; }
          .g-card { flex-direction: row; gap: 20px; padding: 20px; }
          .g-text-side { align-items: flex-start; text-align: left; }
          .g-photo-frame { width: 140px; height: 175px; }
          .g-title { font-size: 2.6rem; }
          .g-wish { font-size: 0.88rem; margin-bottom: 12px; }
          .corner-rose { display: none; }
        }
      `}</style>

      <div className="g-root">
        <div className="g-bg" />
        <div className="g-texture" />
        <div className="g-glow g-glow-1" />
        <div className="g-glow g-glow-2" />
        <div className="g-glow g-glow-3" />
        <div className="g-glow g-glow-4" />
        <canvas ref={canvasRef} className="g-canvas" />

        {/* Corner roses */}
        <div className="corner-rose cr-1">🌹</div>
        <div className="corner-rose cr-2">🌸</div>
        <div className="corner-rose cr-3">🌷</div>
        <div className="corner-rose cr-4">🌹</div>

        <div className={`g-card ${loaded ? 'visible' : ''}`}>

          {/* Left — text */}
          <div className="g-text-side">
            <div className="g-eyebrow">
              <div className="g-eyebrow-line" />
              <span className="g-eyebrow-text">A Special Celebration</span>
            </div>

            <h1 className="g-title">Happy Birthday</h1>
            <p className="g-name">Mami</p>

            <div className="g-divider">
              <div className="g-div-line" />
              <span className="g-div-icon">🌸</span>
              <div className="g-div-line" />
            </div>

            <p className="g-wish">
              Wishing you all the love<br />
              and happiness today<br />
              and always!
            </p>

            <div className="g-sig">
              <span className="g-sig-from">with love from</span>
              <span className="g-sig-name">Shanu</span>
            </div>
          </div>

          {/* Right — photo */}
          <div className="g-photo-side" ref={frameRef}>
            <div className="g-photo-frame">
              <img
                src={birthdayImage}
                alt="Birthday"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.style.background = 'linear-gradient(135deg,#fde8ec,#fff0f3)';
                  e.target.parentNode.innerHTML += `<div style="display:flex;align-items:center;justify-content:center;height:100%;flex-direction:column;gap:10px"><div style="font-size:3rem">🌸</div><div style="font-size:0.65rem;letter-spacing:3px;color:#b5788a;font-family:serif">PHOTO HERE</div></div>`;
                }}
              />
            </div>
            <div className="g-badge">✦ Birthday Girl ✦</div>
          </div>

        </div>

        <div className="g-credit">
          <span className="g-credit-by">crafted with love by</span>
          <span className="g-credit-name">Shanu</span>
        </div>
      </div>
    </>
  );
};

export default Birthday;
