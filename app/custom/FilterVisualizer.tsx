'use client';

import styles from './custom-builder.module.css';

interface VisualizerProps {
  category: string;
  capTop: string;
  capBottom: string;
  meshOuter: string;
  meshInner: string;
  media: string;
  mediaColor: string;
  seal: string;
}

export default function FilterVisualizer({
  category,
  capTop,
  capBottom,
  meshOuter,
  meshInner,
  media,
  mediaColor,
  seal,
}: VisualizerProps) {
  // Determine media fill color
  let mediaFill = '#ffffff'; // Default Polyester white
  if (media === 'cellulose') {
    mediaFill = mediaColor || '#f59e0b'; // Selected cellulose color
  } else if (media === 'mesh') {
    mediaFill = '#94a3b8'; // Grey for mesh
  }

  // Determine seal color
  let sealFill = '#1e293b'; // Default sponge black
  if (seal === 'oil') {
    sealFill = '#ea580c'; // Orange for oil seal
  } else if (seal === 'oring') {
    sealFill = '#475569'; // Grey-black for O-ring
  }

  return (
    <div className={styles.visualizerContainer}>
      <h3 className={styles.visualizerTitle}>โครงสร้างไส้กรองจำลอง (Filter Assembly Model)</h3>
      <div className={styles.canvas}>
        <svg viewBox="0 0 400 520" className={styles.svg}>
          {/* DEFINITIONS FOR SVG PATTERNS */}
          <defs>
            {/* Round Hole Pattern */}
            <pattern id="round-holes" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" />
              <circle cx="5" cy="5" r="2.5" fill="rgba(0,0,0,0.4)" />
              <circle cx="15" cy="15" r="2.5" fill="rgba(0,0,0,0.4)" />
            </pattern>

            {/* Diamond Mesh Pattern */}
            <pattern id="diamond-mesh" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="none" />
              <path d="M 10,0 L 20,10 L 10,20 L 0,10 Z" fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth="1.5" />
            </pattern>

            {/* Wire Mesh Grid Pattern */}
            <pattern id="wire-mesh" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill="none" />
              <path d="M 0 4 L 8 4 M 4 0 L 4 8" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="0.8" />
            </pattern>

            {/* Square Grid Pattern for Inner Mesh */}
            <pattern id="square-mesh" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="16" height="16" fill="none" />
              <path d="M 0 8 L 16 8 M 8 0 L 8 16" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1.2" />
            </pattern>

            {/* Metallic Gradients */}
            <linearGradient id="metal-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4b5563" />
              <stop offset="25%" stopColor="#9ca3af" />
              <stop offset="50%" stopColor="#f3f4f6" />
              <stop offset="75%" stopColor="#9ca3af" />
              <stop offset="100%" stopColor="#4b5563" />
            </linearGradient>

            <linearGradient id="seal-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="50%" stopColor="#475569" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>

          {/* 1. UPPER CAP (ฝาบน) */}
          <g className={styles.svgLayer} id="layer-cap-top">
            <path
              d="M 80,80 C 80,60 320,60 320,80 L 320,105 C 320,115 80,115 80,105 Z"
              fill="url(#metal-grad)"
              stroke="#374151"
              strokeWidth="1"
            />
            {/* If through-hole cap (ฝาทะลุ), render center hole ellipse */}
            {capTop === 'through' && (
              <ellipse cx="200" cy="85" rx="55" ry="15" fill="#0d1b3e" stroke="#4b5563" strokeWidth="2" />
            )}
            <text x="200" y="50" textAnchor="middle" className={styles.layerLabel} fill="var(--primary)">
              ฝาบน (Upper Cap)
            </text>
          </g>

          {/* 2. UPPER SEAL (ซีลบน) */}
          <g className={styles.svgLayer} id="layer-seal-top">
            <path
              d="M 90,115 C 90,110 310,110 310,115 L 310,123 C 310,128 90,128 90,123 Z"
              fill={sealFill}
              opacity="0.9"
            />
          </g>

          {/* 3. FILTER MEDIA CORE (วัสดุกรอง - Renders Behind Outer Mesh) */}
          <g className={styles.svgLayer} id="layer-media">
            <rect x="100" y="125" width="200" height="260" fill={mediaFill} rx="5" />
            {/* Shading/Depth overlay for Media */}
            <rect
              x="100"
              y="125"
              width="200"
              height="260"
              fill="linear-gradient(90deg, rgba(0,0,0,0.15) 0%, rgba(255,255,255,0.2) 50%, rgba(0,0,0,0.15) 100%)"
              rx="5"
              style={{ mixBlendMode: 'multiply' }}
              pointerEvents="none"
            />
          </g>

          {/* 4. INNER MESH (ตะแกรงใน - Rendered as semi-transparent cuts overlay) */}
          <g className={styles.svgLayer} id="layer-inner-mesh">
            {meshInner === 'round' && (
              <rect x="125" y="135" width="150" height="240" fill="url(#round-holes)" opacity="0.22" rx="4" />
            )}
            {meshInner === 'diamond' && (
              <rect x="125" y="135" width="150" height="240" fill="url(#diamond-mesh)" opacity="0.22" rx="4" />
            )}
            {meshInner === 'square' && (
              <rect x="125" y="135" width="150" height="240" fill="url(#square-mesh)" opacity="0.22" rx="4" />
            )}
            {meshInner === 'mesh' && (
              <rect x="125" y="135" width="150" height="240" fill="url(#wire-mesh)" opacity="0.22" rx="4" />
            )}
          </g>

          {/* 5. OUTER MESH (ตะแกรงนอก) */}
          <g className={styles.svgLayer} id="layer-outer-mesh">
            {meshOuter === 'round' && (
              <rect x="98" y="123" width="204" height="264" fill="url(#round-holes)" rx="6" />
            )}
            {meshOuter === 'diamond' && (
              <rect x="98" y="123" width="204" height="264" fill="url(#diamond-mesh)" rx="6" />
            )}
            {meshOuter === 'mesh' && (
              <rect x="98" y="123" width="204" height="264" fill="url(#wire-mesh)" rx="6" />
            )}
            {/* Left and right metal edges of Outer Mesh to look solid */}
            <rect x="98" y="123" width="3" height="264" fill="url(#metal-grad)" />
            <rect x="299" y="123" width="3" height="264" fill="url(#metal-grad)" />
            <text x="360" y="255" textAnchor="start" className={styles.layerLabelSide} fill="var(--muted-foreground)">
              ตะแกรงนอก
            </text>
          </g>

          {/* 6. LOWER SEAL (ซีลล่าง) */}
          <g className={styles.svgLayer} id="layer-seal-bottom">
            <path
              d="M 90,387 C 90,382 310,382 310,387 L 310,395 C 310,400 90,400 90,395 Z"
              fill={sealFill}
              opacity="0.9"
            />
          </g>

          {/* 7. LOWER CAP (ฝาล่าง) */}
          <g className={styles.svgLayer} id="layer-cap-bottom">
            <path
              d="M 80,395 C 80,385 320,385 320,395 L 320,420 C 320,440 80,440 80,420 Z"
              fill="url(#metal-grad)"
              stroke="#374151"
              strokeWidth="1"
            />
            {/* If through-hole cap (ฝาทะลุ), render center ellipse */}
            {capBottom === 'through' && (
              <ellipse cx="200" cy="415" rx="55" ry="15" fill="#0d1b3e" stroke="#4b5563" strokeWidth="2" />
            )}
            {/* If closed cap (ฝาปิดทึบ), render a solid inner base */}
            {capBottom === 'closed' && (
              <ellipse cx="200" cy="405" rx="90" ry="10" fill="#4b5563" opacity="0.5" />
            )}
            <text x="200" y="465" textAnchor="middle" className={styles.layerLabel} fill="var(--primary)">
              ฝาล่าง (Lower Cap)
            </text>
          </g>

          {/* Application Label Overlay */}
          {category && (
            <g>
              <rect x="25" y="480" width="350" height="30" fill="rgba(26, 109, 204, 0.08)" rx="15" stroke="rgba(26, 109, 204, 0.2)" strokeWidth="1" />
              <text x="200" y="500" textAnchor="middle" fill="var(--foreground)" style={{ fontSize: '13px', fontWeight: '600' }}>
                ไส้กรองสำหรับกรอง: {
                  category === 'dust' ? '🌪️ ฝุ่นละออง' :
                  category === 'oil' ? '🛢️ น้ำมันอุตสาหกรรม' :
                  category === 'odor' ? '💨 กลิ่น / คาร์บอน' :
                  category === 'smoke' ? '🔥 ควันไอเสีย' :
                  category === 'sediment' ? '🛠️ ตะกอนและของแข็ง' : '⚙️ อื่นๆ'
                }
              </text>
            </g>
          )}
        </svg>
      </div>
      <div className={styles.visualizerInstructions}>
        <p>* แผนภาพจำลองประกอบโครงสร้างตามตัวเลือกของคุณในแบบเรียลไทม์</p>
      </div>
    </div>
  );
}
