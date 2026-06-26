'use client';

import { motion } from 'framer-motion';

const orbs = [
  { size: 200, x: '10%', y: '20%', color: 'from-violet-600/20 to-purple-800/10', dur: 25, delay: 0 },
  { size: 300, x: '70%', y: '10%', color: 'from-cyan-500/15 to-blue-700/10', dur: 30, delay: 2 },
  { size: 150, x: '80%', y: '60%', color: 'from-fuchsia-500/20 to-pink-700/10', dur: 20, delay: 4 },
  { size: 250, x: '20%', y: '70%', color: 'from-blue-500/15 to-indigo-800/10', dur: 35, delay: 1 },
  { size: 180, x: '50%', y: '40%', color: 'from-purple-500/20 to-violet-900/10', dur: 22, delay: 3 },
  { size: 120, x: '40%', y: '80%', color: 'from-teal-400/15 to-cyan-700/10', dur: 28, delay: 5 },
  { size: 220, x: '90%', y: '30%', color: 'from-indigo-500/15 to-purple-800/10', dur: 32, delay: 6 },
  { size: 160, x: '5%', y: '50%', color: 'from-pink-500/15 to-rose-800/10', dur: 18, delay: 7 },
  { size: 280, x: '60%', y: '85%', color: 'from-blue-600/10 to-violet-900/10', dur: 38, delay: 2 },
  { size: 140, x: '30%', y: '15%', color: 'from-emerald-500/15 to-teal-800/10', dur: 26, delay: 8 },
];

export function ParticlesBg() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-to-br ${orb.color} blur-3xl`}
          style={{ width: orb.size, height: orb.size, left: orb.x, top: orb.y }}
          animate={{
            x: [0, 30, -20, 15, 0],
            y: [0, -25, 20, -10, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
            opacity: [0.5, 0.7, 0.4, 0.6, 0.5],
          }}
          transition={{
            duration: orb.dur,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
    </div>
  );
}
