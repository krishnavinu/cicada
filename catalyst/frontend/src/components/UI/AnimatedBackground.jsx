import React from 'react';

const AnimatedBackground = ({ variant = 'default', intensity = 'medium' }) => {
  const particleCount = intensity === 'high' ? 60 : intensity === 'medium' ? 40 : 20;
  const orbCount = intensity === 'high' ? 8 : intensity === 'medium' ? 5 : 3;

  return (
    <div className="animated-bg-container fixed inset-0 -z-10">
      {/* Mesh Gradient Background */}
      <div className="mesh-gradient-bg"></div>
      
      {/* Animated Gradient Orbs */}
      <div className="particle-bg">
        {[...Array(orbCount)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className="absolute rounded-full opacity-20 animate-float"
            style={{
              width: `${150 + Math.random() * 200}px`,
              height: `${150 + Math.random() * 200}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: `radial-gradient(circle, ${
                ['rgba(102, 126, 234, 0.3)', 'rgba(118, 75, 162, 0.3)', 'rgba(240, 147, 251, 0.3)', 'rgba(79, 172, 254, 0.3)'][Math.floor(Math.random() * 4)]
              } 0%, transparent 70%)`,
              filter: 'blur(60px)',
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* Floating Particles */}
      <div className="particle-bg">
        {[...Array(particleCount)].map((_, i) => {
          const size = 2 + Math.random() * 4;
          const duration = 3 + Math.random() * 4;
          const delay = Math.random() * 3;
          const x = Math.random() * 100;
          const y = Math.random() * 100;
          
          return (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-40"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${x}%`,
                top: `${y}%`,
                '--tx': `${(Math.random() - 0.5) * 200}px`,
                '--ty': `${(Math.random() - 0.5) * 200}px`,
                animation: `particle-float ${duration}s linear infinite`,
                animationDelay: `${delay}s`,
                filter: 'blur(1px)',
              }}
            />
          );
        })}
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(102, 126, 234, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102, 126, 234, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Radial Gradient Overlays */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-radial from-blue-500/10 to-transparent opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-radial from-purple-500/10 to-transparent opacity-50"></div>
    </div>
  );
};

export default AnimatedBackground;

