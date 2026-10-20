import React from 'react';

interface EmptyCanvasStateProps {
  visible: boolean;
}

export const EmptyCanvasState: React.FC<EmptyCanvasStateProps> = ({ visible }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        transition: 'opacity 0.35s ease-out, visibility 0.35s ease-out',
        opacity: visible ? 1 : 0,
        visibility: visible ? 'visible' : 'hidden',
        zIndex: 1,
        width: 440,
        textAlign: 'center'
      }}
    >
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
        {/* Handwritten Core Message */}
        <div
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '38px',
            lineHeight: 1.15,
            fontWeight: 600,
            color: '#30312D',
            letterSpacing: '0.5px'
          }}
        >
          <div>Turn your ideas</div>
          <div>into something beautiful</div>
        </div>

        {/* Terracotta Sparkle / Sunburst Rays at top right of 'ideas' */}
        <svg
          style={{
            position: 'absolute',
            top: -12,
            right: -24,
            width: 32,
            height: 32
          }}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="16" y1="2" x2="16" y2="8" stroke="#D99379" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="26" y1="6" x2="22" y2="10" stroke="#D99379" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="30" y1="16" x2="24" y2="16" stroke="#D99379" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="26" y1="26" x2="22" y2="22" stroke="#D99379" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="6" y1="6" x2="10" y2="10" stroke="#D99379" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </svg>

        {/* Sage-Green Curved Underline */}
        <svg
          style={{
            width: '100%',
            height: 24,
            marginTop: 4,
            overflow: 'visible'
          }}
          viewBox="0 0 280 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 6 C 90 22, 190 20, 260 8"
            stroke="#777D5E"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Terracotta Sun, Mountain Outline, and Flying Birds */}
      <svg
        style={{
          width: 220,
          height: 90,
          marginTop: 2
        }}
        viewBox="0 0 220 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Terracotta Sun */}
        <circle cx="100" cy="28" r="14" fill="#D99379" opacity="0.9" />

        {/* Flying Birds */}
        <path d="M125 36 Q 128 32 131 36 Q 134 32 137 36" stroke="#5E6547" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        <path d="M142 42 Q 144 39 146 42 Q 148 39 150 42" stroke="#5E6547" strokeWidth="1.1" strokeLinecap="round" fill="none" />
        <path d="M136 49 Q 138 46 140 49 Q 142 46 144 49" stroke="#5E6547" strokeWidth="1" strokeLinecap="round" fill="none" />

        {/* Mountain Outline Sketch */}
        <path
          d="M30 80 Q 60 70 85 52 Q 100 62 115 56 Q 140 75 190 80"
          stroke="#D99379"
          strokeWidth="1.6"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M75 78 Q 110 60 135 72 Q 155 64 175 80"
          stroke="#D99379"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>

      {/* Sub-caption */}
      <div
        style={{
          fontSize: '13px',
          fontWeight: 400,
          color: '#79766F',
          marginTop: 8,
          letterSpacing: '0.2px'
        }}
      >
        Draw, create, and make it yours.
      </div>
    </div>
  );
};
