'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface IntroAnimationProps {
  onComplete: () => void;
}

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [phase, setPhase] = useState<'glitch' | 'title' | 'tagline' | 'explosion' | 'done'>('glitch');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => { onCompleteRef.current = onComplete; });

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('title'), 800),
      setTimeout(() => setPhase('tagline'), 2400),
      setTimeout(() => setPhase('explosion'), 3600),
      setTimeout(() => { setPhase('done'); onCompleteRef.current(); }, 4500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'TALENTSPHEREアイウエオカキクケコサシスセソ';
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array.from({ length: columns }, () => Math.random() * -50);

    let animationId: number;
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        if (Math.random() > 0.98) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        } else {
          ctx.fillStyle = `rgba(139, 92, 246, ${0.15 + Math.random() * 0.4})`;
        }
        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.4 + Math.random() * 0.3;
      }

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => cancelAnimationFrame(animationId);
  }, []);

  if (phase === 'done') return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      animate={{ opacity: phase === 'explosion' ? 0 : 1 }}
      transition={{ duration: 0.8 }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 opacity-40" />

      <div className="absolute inset-0 bg-gradient-to-b from-violet-900/20 via-transparent to-cyan-900/20" />

      <div className="relative z-10 text-center">
        {phase === 'glitch' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
            animate={{ opacity: [0, 1], scale: [0.8, 1.05, 1], filter: ['blur(20px)', 'blur(0px)'] }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-6xl md:text-8xl font-bold tracking-tighter">
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent opacity-50">TS</span>
            </div>
          </motion.div>
        )}

        {phase === 'title' && (
          <div className="flex justify-center flex-wrap gap-0.5 mb-8">
            {'TALENTSPHERE AI'.split('').map((char, i) => (
              <motion.span
                key={i}
                className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 50, rotateX: -90, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.04,
                  type: 'spring',
                  stiffness: 120,
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>
        )}

        {phase !== 'glitch' && phase !== 'title' && (
          <div className="flex justify-center flex-wrap gap-0.5 mb-8">
            {'TALENTSPHERE AI'.split('').map((char, i) => (
              <motion.span
                key={i}
                className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>
        )}

        {phase === 'tagline' && (
          <motion.p
            className="text-lg md:text-xl text-gray-400 tracking-[0.3em] uppercase"
            initial={{ opacity: 0, y: 20, letterSpacing: '0.1em' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '0.3em' }}
            transition={{ duration: 0.8 }}
          >
            The Future of Intelligent Candidate Discovery
          </motion.p>
        )}

        {phase === 'explosion' && (
          <motion.p
            className="text-lg md:text-xl text-gray-400 tracking-[0.3em] uppercase"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            The Future of Intelligent Candidate Discovery
          </motion.p>
        )}

        <motion.div
          className="mt-12 mx-auto h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent"
          initial={{ width: 0 }}
          animate={{ width: 280 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />
      </div>

      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 'tagline' ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle at center, rgba(139,92,246,0.2) 0%, transparent 60%)' }}
        />
      </motion.div>
    </motion.div>
  );
}
