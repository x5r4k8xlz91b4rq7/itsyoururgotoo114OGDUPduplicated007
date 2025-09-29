"use client";

import { useCallback, useEffect, useRef } from "react";

interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: { x: number; y: number };
  colors?: string[];
  gravity?: number;
  drift?: number;
  ticks?: number;
  shapes?: string[];
  scalar?: number;
  startVelocity?: number;
  angle?: number;
  direction?: string;
  decay?: number;
  velocity?: number;
}

interface ConfettiProps {
  className?: string;
  options?: ConfettiOptions;
  globalOptions?: ConfettiOptions;
  manualstart?: boolean;
  children?: React.ReactNode;
}

// Simple confetti implementation
const createConfetti = (canvas: HTMLCanvasElement, options: ConfettiOptions = {}) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const {
    particleCount = 50,
    spread = 50,
    origin = { x: 0.5, y: 0.5 },
    colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
    gravity = 0.3,
    drift = 0,
    ticks = 200,
    startVelocity = 45,
    angle = 90,
    direction = 'up',
    scalar = 0.6,
    decay = 0.008,
    velocity = 7
  } = options;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    life: number;
    maxLife: number;
    size: number;
  }> = [];

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    const spreadRad = (spread * Math.PI / 180);
    const angleRad = (angle * Math.PI / 180);
    const speed = Math.random() * velocity + velocity * 0.5;
    
    particles.push({
      x: canvas.width * origin.x,
      y: canvas.height * origin.y,
      vx: Math.cos(angleRad + (Math.random() - 0.5) * spreadRad) * speed * scalar,
      vy: direction === 'up' ? -Math.abs(Math.sin(angleRad + (Math.random() - 0.5) * spreadRad) * speed * scalar) : Math.sin(angleRad + (Math.random() - 0.5) * spreadRad) * speed * scalar,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: ticks,
      maxLife: ticks,
      size: 2 + Math.random() * 4
    });
  }

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += gravity;
      particle.vx += drift;
      particle.life -= decay;

      const alpha = particle.life / particle.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
      ctx.restore();
      
      if (particle.life <= 0) {
        particles.splice(index, 1);
      }
    });

    if (particles.length > 0) {
      requestAnimationFrame(animate);
    }
  };

  animate();
};

export function Confetti({
  className = "",
  options = {},
  globalOptions = {},
  manualstart = false,
  children,
  ...props
}: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fire = useCallback(() => {
    if (canvasRef.current) {
      createConfetti(canvasRef.current, { ...globalOptions, ...options });
    }
  }, [options, globalOptions]);

  useEffect(() => {
    if (!manualstart) {
      fire();
    }
  }, [fire, manualstart]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        // Ensure canvas doesn't exceed viewport dimensions
        const rect = canvasRef.current.getBoundingClientRect()
        canvasRef.current.width = Math.min(window.innerWidth, rect.width || window.innerWidth)
        canvasRef.current.height = Math.min(window.innerHeight, rect.height || window.innerHeight)
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`relative ${className}`} {...props}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          width: '100vw',
          height: '100vh',
        }}
      />
      {children}
    </div>
  );
}