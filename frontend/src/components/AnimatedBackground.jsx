import React, { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle Setup
    const particleCount = Math.min(Math.floor(window.innerWidth / 20), 60);
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.2, // Slightly larger particles in light mode
      });
    }

    let mouse = { x: null, y: null, radius: 140 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const isDarkMode = () => document.documentElement.classList.contains('dark');

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dark = isDarkMode();

      // Increased saturation & alpha opacity for light mode particles and lines
      const particleColor = dark ? 'rgba(56, 189, 248, ' : 'rgba(14, 116, 144, '; // Vibrant Cyan-700 in light mode
      const lineColor = dark ? 'rgba(147, 51, 234, ' : 'rgba(124, 58, 237, ';     // Rich Violet-600 in light mode

      // Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${particleColor}${dark ? '0.6' : '0.85'})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            const alpha = (1 - dist / 130) * (dark ? 0.25 : 0.35); // Higher opacity in light mode
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${lineColor}${alpha})`;
            ctx.lineWidth = dark ? 0.8 : 1.1;
            ctx.stroke();
          }
        }

        // Connect to mouse pointer
        if (mouse.x !== null && mouse.y !== null) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < mouse.radius) {
            const malpha = (1 - mdist / mouse.radius) * (dark ? 0.4 : 0.55);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `${particleColor}${malpha})`;
            ctx.lineWidth = 1.3;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      {/* 1. Canvas for interactive particle mesh */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 2. Top-Left Floating Glowing Orb (Enhanced cyan glow in Light Mode) */}
      <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-gradient-to-tr from-cyan-400/45 to-blue-500/35 dark:from-cyan-500/25 dark:to-blue-600/15 blur-3xl animate-blob-1" />

      {/* 3. Top-Right Floating Glowing Orb (Enhanced violet glow in Light Mode) */}
      <div className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] rounded-full bg-gradient-to-br from-violet-400/40 to-purple-500/35 dark:from-violet-600/20 dark:to-indigo-700/15 blur-3xl animate-blob-2" />

      {/* 4. Bottom-Center Floating Glowing Orb (Enhanced pink glow in Light Mode) */}
      <div className="absolute -bottom-32 left-1/4 w-[38rem] h-[38rem] rounded-full bg-gradient-to-r from-pink-400/35 to-fuchsia-500/30 dark:from-fuchsia-600/15 dark:to-purple-900/15 blur-3xl animate-blob-3" />

      {/* 5. Tech Grid Overlay - Subtitle Tech Grid for BOTH Light and Dark Modes */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b212_1px,transparent_1px),linear-gradient(to_bottom,#0891b212_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px] opacity-60 dark:opacity-25" />
    </div>
  );
}