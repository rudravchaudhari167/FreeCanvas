import React from 'react';

export const BotanicalBackground: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}
      aria-hidden="true"
    >
      {/* Bottom-left realistic botanical plant / leaves matching Reference Image 1 */}
      <svg
        style={{
          position: 'absolute',
          bottom: -20,
          left: -20,
          width: 320,
          height: 380,
          filter: 'drop-shadow(0 12px 24px rgba(70, 60, 45, 0.08))',
          opacity: 0.95
        }}
        viewBox="0 0 320 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main stem */}
        <path
          d="M30 400 C 60 300, 80 180, 110 50"
          stroke="#4F543C"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Stem branches */}
        <path d="M55 310 C 95 290, 130 280, 165 270" stroke="#5D6247" strokeWidth="4" strokeLinecap="round" />
        <path d="M72 230 C 40 200, 20 180, 0 160" stroke="#5D6247" strokeWidth="4" strokeLinecap="round" />
        <path d="M85 170 C 130 145, 170 135, 210 125" stroke="#5D6247" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M98 110 C 60 85, 40 70, 15 50" stroke="#5D6247" strokeWidth="3" strokeLinecap="round" />

        {/* Leaf 1 - Lower Right */}
        <path
          d="M165 270 C 230 250, 280 270, 295 300 C 275 325, 210 325, 165 270 Z"
          fill="url(#leafGrad1)"
        />
        <path d="M165 270 Q 235 285 295 300" stroke="#484E37" strokeWidth="1.5" opacity="0.6" />

        {/* Leaf 2 - Lower Left */}
        <path
          d="M0 160 C 10 110, 35 90, 65 95 C 75 125, 45 155, 0 160 Z"
          fill="url(#leafGrad2)"
        />

        {/* Leaf 3 - Mid Right Large */}
        <path
          d="M210 125 C 275 95, 305 110, 315 135 C 285 160, 235 155, 210 125 Z"
          fill="url(#leafGrad1)"
        />
        <path d="M210 125 Q 265 135 315 135" stroke="#484E37" strokeWidth="1.5" opacity="0.6" />

        {/* Leaf 4 - Mid Left */}
        <path
          d="M15 50 C 10 10, 45 0, 75 15 C 80 45, 55 65, 15 50 Z"
          fill="url(#leafGrad2)"
        />

        {/* Leaf 5 - Center Top Specimen */}
        <path
          d="M110 50 C 120 10, 145 -10, 160 0 C 160 25, 140 45, 110 50 Z"
          fill="url(#leafGrad3)"
        />

        {/* Additional lush leaves */}
        <path
          d="M115 200 C 170 175, 220 190, 230 215 C 200 235, 150 230, 115 200 Z"
          fill="url(#leafGrad2)"
          opacity="0.9"
        />

        <defs>
          <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#82886A" />
            <stop offset="50%" stopColor="#6C7254" />
            <stop offset="100%" stopColor="#555B3F" />
          </linearGradient>
          <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#969C7E" />
            <stop offset="50%" stopColor="#777D5E" />
            <stop offset="100%" stopColor="#5E6446" />
          </linearGradient>
          <linearGradient id="leafGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A8AE90" />
            <stop offset="100%" stopColor="#6E7456" />
          </linearGradient>
        </defs>
      </svg>

      {/* Bottom-right soft warm peach organic wave matching Reference Image 1 */}
      <svg
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: 360,
          height: 280,
          opacity: 0.7
        }}
        viewBox="0 0 360 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50 280 C 110 200, 170 160, 230 180 C 290 200, 320 150, 360 140 L 360 280 Z"
          fill="#EED4C5"
        />
        <path
          d="M120 280 C 170 230, 230 200, 280 220 C 330 240, 350 210, 360 200 L 360 280 Z"
          fill="#F5DFD2"
          opacity="0.8"
        />
      </svg>
    </div>
  );
};
