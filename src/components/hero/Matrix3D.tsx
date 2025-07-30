
import React, { useEffect, useRef } from 'react';

interface Matrix3DProps {
  animationSpeed: number;
  colorIntensity: number;
  shapeComplexity: number;
}

const Matrix3D: React.FC<Matrix3DProps> = ({ 
  animationSpeed, 
  colorIntensity, 
  shapeComplexity 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix animation variables
    const gridSize = Math.floor(20 + (shapeComplexity * 10));
    const particles: Array<{
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];

    // Initialize particles
    const particleCount = Math.floor(50 + (shapeComplexity * 30));
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
        color: Math.random() > 0.5 ? 'hsl(330, 81%, 60%)' : 'hsl(250, 85%, 65%)'
      });
    }

    let time = 0;

    const animate = () => {
      time += animationSpeed * 0.02;
      
      // Clear canvas with subtle gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `hsla(222, 84%, 5%, ${0.1 + colorIntensity * 0.05})`);
      gradient.addColorStop(1, `hsla(250, 50%, 10%, ${0.1 + colorIntensity * 0.05})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = `hsla(330, 81%, 60%, ${0.1 + colorIntensity * 0.1})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();

      // Vertical lines
      for (let x = 0; x < canvas.width; x += gridSize) {
        const offset = Math.sin(time + x * 0.01) * 10;
        ctx.moveTo(x + offset, 0);
        ctx.lineTo(x + offset, canvas.height);
      }

      // Horizontal lines  
      for (let y = 0; y < canvas.height; y += gridSize) {
        const offset = Math.cos(time + y * 0.01) * 10;
        ctx.moveTo(0, y + offset);
        ctx.lineTo(canvas.width, y + offset);
      }
      ctx.stroke();

      // Update and draw particles
      particles.forEach((particle, index) => {
        // Update position with 3D movement
        particle.x += particle.vx * animationSpeed;
        particle.y += particle.vy * animationSpeed;
        particle.z += particle.vz * animationSpeed;

        // Add wave motion
        const waveX = Math.sin(time + index * 0.1) * 2;
        const waveY = Math.cos(time + index * 0.15) * 2;
        
        // Perspective calculation
        const perspective = 300;
        const scale = perspective / (perspective + particle.z);
        const x2d = particle.x + waveX;
        const y2d = particle.y + waveY;

        // Wrap around edges
        if (particle.x < -50) particle.x = canvas.width + 50;
        if (particle.x > canvas.width + 50) particle.x = -50;
        if (particle.y < -50) particle.y = canvas.height + 50;
        if (particle.y > canvas.height + 50) particle.y = -50;
        if (particle.z < -500) particle.z = 500;
        if (particle.z > 500) particle.z = -500;

        // Draw particle with glow effect
        const size = particle.size * scale * (1 + colorIntensity * 0.5);
        const opacity = particle.opacity * scale * colorIntensity;
        
        if (opacity > 0.1 && size > 0.5) {
          // Glow effect
          const glowGradient = ctx.createRadialGradient(x2d, y2d, 0, x2d, y2d, size * 3);
          glowGradient.addColorStop(0, particle.color.replace(')', `, ${opacity})`).replace('hsl', 'hsla'));
          glowGradient.addColorStop(1, particle.color.replace(')', ', 0)').replace('hsl', 'hsla'));
          
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(x2d, y2d, size * 3, 0, Math.PI * 2);
          ctx.fill();

          // Core particle
          ctx.fillStyle = particle.color.replace(')', `, ${opacity + 0.3})`).replace('hsl', 'hsla');
          ctx.beginPath();
          ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw connecting lines between nearby particles
      if (shapeComplexity > 3) {
        particles.forEach((particle1, i) => {
          particles.slice(i + 1, i + 6).forEach(particle2 => {
            const dx = particle1.x - particle2.x;
            const dy = particle1.y - particle2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              const opacity = (1 - distance / 100) * 0.3 * colorIntensity;
              ctx.strokeStyle = `hsla(280, 70%, 65%, ${opacity})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particle1.x, particle1.y);
              ctx.lineTo(particle2.x, particle2.y);
              ctx.stroke();
            }
          });
        });
      }

      // Draw floating geometric shapes
      const shapeCount = Math.floor(shapeComplexity * 2);
      for (let i = 0; i < shapeCount; i++) {
        const x = (canvas.width / 2) + Math.sin(time * 0.5 + i) * 200;
        const y = (canvas.height / 2) + Math.cos(time * 0.3 + i) * 150;
        const size = 20 + Math.sin(time + i) * 10;
        const rotation = time * animationSpeed + i;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // Draw rotating shape
        ctx.strokeStyle = `hsla(${330 + i * 20}, 81%, 60%, ${0.3 * colorIntensity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const sides = 3 + Math.floor(shapeComplexity);
        for (let j = 0; j < sides; j++) {
          const angle = (j / sides) * Math.PI * 2;
          const px = Math.cos(angle) * size;
          const py = Math.sin(angle) * size;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
        
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animationSpeed, colorIntensity, shapeComplexity]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default Matrix3D;
