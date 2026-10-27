import React from "react";

/**
 * Reusable Bulusan National High School (BNHS) Official Crest SVG Atom
 * Features the scalloped green shield, laurel wreath, Mount Bulusan silhouette,
 * ocean waves, open book of knowledge, quill, flaming torch, and "2000" founding year.
 */
export default function SchoolSeal({
  size = "md",
  showWreath = false,
  schoolName = "GREENFIELD NATIONAL HIGH SCHOOL",
  founded = "2000",
  className = "",
}) {
  const sizeClasses = {
    xs: "w-9 h-9",
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
    xl: "w-44 h-44 md:w-56 md:h-56",
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-lg"
        role="img"
        aria-label="Bulusan National High School Official Seal"
      >
        <defs>
          <linearGradient id="shieldGreen" x1="0" y1="0" x2="240" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1b5e3a" />
            <stop offset="50%" stopColor="#124028" />
            <stop offset="100%" stopColor="#0a2918" />
          </linearGradient>
          <linearGradient id="ringSilver" x1="40" y1="40" x2="200" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
          <linearGradient id="flameGrad" x1="120" y1="52" x2="120" y2="105" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
          <path id="topArc" d="M 56,120 A 64,64 0 1,1 184,120" />
          <path id="bottomArc" d="M 180,126 A 60,60 0 0,1 60,126" />
        </defs>

        {/* Outer Laurel Wreath when showWreath is enabled */}
        {showWreath && (
          <g stroke="#1b5e3a" strokeWidth="2.5" fill="#2d6a4f" opacity="0.9">
            {/* Left Laurel Branch */}
            <path d="M 115,225 C 55,215 18,165 22,95 C 24,65 38,38 58,20" fill="none" stroke="#1b4332" strokeWidth="3.5" strokeLinecap="round" />
            <ellipse cx="26" cy="155" rx="12" ry="5" transform="rotate(-35 26 155)" />
            <ellipse cx="20" cy="125" rx="12" ry="5" transform="rotate(-15 20 125)" />
            <ellipse cx="24" cy="95" rx="12" ry="5" transform="rotate(10 24 95)" />
            <ellipse cx="35" cy="65" rx="12" ry="5" transform="rotate(30 35 65)" />
            <ellipse cx="50" cy="40" rx="11" ry="4.5" transform="rotate(45 50 40)" />
            {/* Right Laurel Branch */}
            <path d="M 125,225 C 185,215 222,165 218,95 C 216,65 202,38 182,20" fill="none" stroke="#1b4332" strokeWidth="3.5" strokeLinecap="round" />
            <ellipse cx="214" cy="155" rx="12" ry="5" transform="rotate(35 214 155)" />
            <ellipse cx="220" cy="125" rx="12" ry="5" transform="rotate(15 220 125)" />
            <ellipse cx="216" cy="95" rx="12" ry="5" transform="rotate(-10 216 95)" />
            <ellipse cx="205" cy="65" rx="12" ry="5" transform="rotate(-30 205 65)" />
            <ellipse cx="190" cy="40" rx="11" ry="4.5" transform="rotate(-45 190 40)" />
          </g>
        )}

        {/* Scalloped Outer Shield */}
        <path
          d="M120 12 C135 12 148 22 162 20 C176 18 190 28 198 42 C206 56 220 65 222 82 C224 99 216 115 222 132 C228 149 218 168 206 180 C194 192 188 208 172 214 C156 220 138 218 120 228 C102 218 84 220 68 214 C52 208 46 192 34 180 C22 168 12 149 18 132 C24 99 16 99 18 82 C20 65 34 56 42 42 C50 28 64 18 78 20 C92 22 105 12 120 12 Z"
          fill="url(#shieldGreen)"
          stroke="#d97706"
          strokeWidth="3"
        />

        {/* White/Silver Circular Band */}
        <circle cx="120" cy="120" r="82" fill="url(#ringSilver)" stroke="#0f291e" strokeWidth="3.5" />
        <circle cx="120" cy="120" r="56" fill="#e0f2fe" stroke="#0f291e" strokeWidth="2.5" />

        {/* Inner Scene: Mount Bulusan + Sea Waves */}
        <clipPath id="innerCircleClip">
          <circle cx="120" cy="120" r="55" />
        </clipPath>

        <g clipPath="url(#innerCircleClip)">
          {/* Sky */}
          <rect x="65" y="65" width="110" height="55" fill="#bae6fd" />
          {/* Mount Bulusan Green Volcano Peak */}
          <path d="M60 120 L92 84 L115 104 L142 78 L180 120 Z" fill="#15803d" />
          <path d="M60 120 L92 84 L106 96 L85 120 Z" fill="#166534" />
          {/* Sea Waves */}
          <rect x="65" y="118" width="110" height="60" fill="#0284c7" />
          <path d="M65 126 Q80 122 95 126 T125 126 T155 126 T180 126" stroke="#ffffff" strokeWidth="2" fill="none" />
          <path d="M65 135 Q80 131 95 135 T125 135 T155 135 T180 135" stroke="#ffffff" strokeWidth="2" fill="none" />
          <path d="M65 144 Q80 140 95 144 T125 144 T155 144 T180 144" stroke="#ffffff" strokeWidth="2" fill="none" />

          {/* Open Book of Knowledge */}
          <path
            d="M84 132 L120 138 L156 132 L162 158 L120 164 L78 158 Z"
            fill="#ffffff"
            stroke="#1e293b"
            strokeWidth="2.2"
          />
          <line x1="120" y1="138" x2="120" y2="164" stroke="#1e293b" strokeWidth="2" />

          {/* Torch Handle */}
          <rect x="116" y="102" width="8" height="36" rx="2" fill="#eab308" stroke="#1e293b" strokeWidth="1.5" />
          <path d="M108 102 L132 102 L127 110 L113 110 Z" fill="#cbd5e1" stroke="#1e293b" strokeWidth="1.5" />

          {/* Feather Quill */}
          <path
            d="M104 162 C114 145 128 128 144 114 C140 128 130 142 114 156 Z"
            fill="#e2e8f0"
            stroke="#0f172a"
            strokeWidth="1.5"
          />
        </g>

        {/* Torch Flame (extending slightly above inner circle like original seal) */}
        <path
          d="M120 50 C132 66 138 78 132 92 C128 99 112 99 108 92 C102 78 108 66 120 50 Z"
          fill="url(#flameGrad)"
          stroke="#b91c1c"
          strokeWidth="1.5"
        />

        {/* Circular Typography */}
        <text fill="#091e13" fontSize="11.2" fontWeight="800" letterSpacing="1.1">
          <textPath href="#topArc" startOffset="50%" textAnchor="middle">
            {String(schoolName).toUpperCase()}
          </textPath>
        </text>

        {/* Founding Year */}
        <circle cx="84" cy="175" r="3" fill="#091e13" />
        <text x="120" y="182" fill="#091e13" fontSize="13" fontWeight="900" textAnchor="middle" letterSpacing="1.5">
          {founded}
        </text>
        <circle cx="156" cy="175" r="3" fill="#091e13" />

        <text fill="#1e293b" fontSize="8.2" fontWeight="700" letterSpacing="1">
          <textPath href="#bottomArc" startOffset="50%" textAnchor="middle">
            OFFICIAL SCHOOL SEAL
          </textPath>
        </text>
      </svg>
    </div>
  );
}
