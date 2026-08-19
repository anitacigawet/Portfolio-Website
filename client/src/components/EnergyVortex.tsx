import React from 'react';

export const EnergyVortex: React.FC = () => {
  return (
    <svg
      width="200"
      height="400"
      viewBox="0 0 200 400"
      className="energy-vortex-svg"
    >
      <defs>
        <linearGradient id="vortexGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#ec4899" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
        </linearGradient>

        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g className="vortex-container">
        {/* Main flowing wisp paths */}
        <path
          className="vortex-path"
          d="M 100 20 Q 120 60, 100 100 Q 80 140, 100 180 Q 120 220, 100 280 Q 90 340, 100 400"
          strokeDasharray="200"
        />
        <path
          className="vortex-path"
          d="M 100 20 Q 80 70, 100 110 Q 120 150, 100 190 Q 85 240, 100 300 Q 110 350, 100 400"
          strokeDasharray="200"
        />
        <path
          className="vortex-path"
          d="M 100 20 Q 110 50, 100 90 Q 95 130, 100 170 Q 105 210, 100 260 Q 95 320, 100 400"
          strokeDasharray="200"
        />

        {/* Spiral accent paths for depth */}
        <circle
          cx="100"
          cy="80"
          r="25"
          fill="none"
          stroke="url(#vortexGradient)"
          strokeWidth="1.5"
          opacity="0.4"
          className="vortex-orbit vortex-orbit-near"
          strokeDasharray="157"
        />
        <circle
          cx="100"
          cy="200"
          r="35"
          fill="none"
          stroke="url(#vortexGradient)"
          strokeWidth="1.5"
          opacity="0.3"
          className="vortex-orbit vortex-orbit-far"
          strokeDasharray="220"
        />
      </g>
    </svg>
  );
};
