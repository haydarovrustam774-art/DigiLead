import React, { useState } from 'react';
import { DigitalIndicators12, IndicatorKey } from '../types';
import { INDICATORS_METADATA, INDICATOR_KEYS } from '../data/indicatorsData';
import { Target, Info, Sparkles } from 'lucide-react';

interface RadarChartProps {
  indicators: DigitalIndicators12;
  initialIndicators?: DigitalIndicators12;
  onSelectIndicator?: (key: IndicatorKey) => void;
  selectedKey?: IndicatorKey | null;
  hideHeader?: boolean;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  indicators,
  initialIndicators,
  onSelectIndicator,
  selectedKey,
  hideHeader = false,
}) => {
  const [hoveredKey, setHoveredKey] = useState<IndicatorKey | null>(null);

  const size = 460;
  const center = size / 2;
  const maxRadius = 150;
  const totalPoints = INDICATOR_KEYS.length;

  // Concentric polygon grid levels (25%, 50%, 75%, 100%)
  const levels = [0.25, 0.5, 0.75, 1.0];

  const getCoordinates = (index: number, valueRatio: number) => {
    // Start at top (-90 degrees)
    const angle = (index * (2 * Math.PI)) / totalPoints - Math.PI / 2;
    const r = valueRatio * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle };
  };

  // Build polygon points for director's actual scores (Current Test)
  const userPolygonPoints = INDICATOR_KEYS.map((key, i) => {
    const val = indicators[key] || 0;
    const { x, y } = getCoordinates(i, val / 100);
    return `${x},${y}`;
  }).join(' ');

  // Build polygon points for initial scores (First Test)
  const initialPolygonPoints = initialIndicators ? INDICATOR_KEYS.map((key, i) => {
    const val = initialIndicators[key] || 0;
    const { x, y } = getCoordinates(i, val / 100);
    return `${x},${y}`;
  }).join(' ') : '';

  // Build polygon points for standard benchmark (75%)
  const benchmarkPoints = INDICATOR_KEYS.map((key, i) => {
    const meta = INDICATORS_METADATA[key];
    const target = (meta?.targetBenchmark || 75) / 100;
    const { x, y } = getCoordinates(i, target);
    return `${x},${y}`;
  }).join(' ');

  const activeKey = hoveredKey || selectedKey;
  const activeMeta = activeKey ? INDICATORS_METADATA[activeKey] : null;
  const activeScore = activeKey ? indicators[activeKey] : null;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs flex flex-col justify-between">
      {/* Header */}
      {!hideHeader && (
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 font-['Outfit',sans-serif]">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              12 Indikatorli Raqamli Radar (Spider Chart)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              12 ta kompetensiyaning o'zaro muvozanati va maqsadli standart bilan solishtirmasi
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs">
            {initialIndicators && (
              <div className="flex items-center gap-1.5 font-medium text-amber-600">
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block ring-2 ring-amber-200" />
                <span>Birinchi Test</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 font-medium text-emerald-700">
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block ring-2 ring-emerald-200" />
              <span>{initialIndicators ? "Joriy Holat" : "Direktor ko'rsatkichi"}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 font-medium text-slate-500">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-slate-400 inline-block" />
              <span>Maqsadli me'yor (75%)</span>
            </div>
          </div>
        </div>
      )}

      {/* SVG Radar Visual */}
      <div className="relative flex items-center justify-center my-2">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full max-w-[420px] h-auto overflow-visible select-none"
        >
          <defs>
            <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.05" />
            </radialGradient>
          </defs>

          {/* Concentric grid webs */}
          {levels.map((level, lvlIdx) => {
            const gridPts = INDICATOR_KEYS.map((_, i) => {
              const { x, y } = getCoordinates(i, level);
              return `${x},${y}`;
            }).join(' ');
            return (
              <g key={`level-${lvlIdx}`}>
                <polygon
                  points={gridPts}
                  className="fill-none stroke-slate-200/80"
                  strokeWidth={lvlIdx === levels.length - 1 ? '1.5' : '1'}
                />
                <text
                  x={center + 5}
                  y={center - level * maxRadius + 12}
                  className="text-[9px] font-bold fill-slate-300"
                >
                  {Math.round(level * 100)}%
                </text>
              </g>
            );
          })}

          {/* Radial axis spokes */}
          {INDICATOR_KEYS.map((key, i) => {
            const { x, y } = getCoordinates(i, 1.0);
            return (
              <line
                key={`spoke-${key}`}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                className="stroke-slate-200/60"
                strokeWidth="1"
              />
            );
          })}

          {/* Benchmark polygon (Target) */}
          <polygon
            points={benchmarkPoints}
            className="fill-slate-100/40 stroke-slate-400"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />

          {/* Initial Test polygon */}
          {initialIndicators && (
             <polygon
               points={initialPolygonPoints}
               className="fill-transparent stroke-amber-500 transition-all duration-700 ease-out"
               strokeWidth="2"
               strokeDasharray="5 5"
             />
          )}

          {/* Director's actual score polygon */}
          <polygon
            points={userPolygonPoints}
            fill="url(#radarGlow)"
            className="stroke-emerald-600 transition-all duration-700 ease-out"
            strokeWidth="2.5"
          />

          {/* Interactive nodes and outer labels */}
          {INDICATOR_KEYS.map((key, i) => {
            const val = indicators[key] || 0;
            const coord = getCoordinates(i, val / 100);
            const labelCoord = getCoordinates(i, 1.22);
            const isCurrent = key === activeKey;
            const meta = INDICATORS_METADATA[key];

            return (
              <g key={`node-${key}`} className="cursor-pointer">
                {/* Clickable transparent target area */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r="14"
                  fill="transparent"
                  onMouseEnter={() => setHoveredKey(key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  onClick={() => onSelectIndicator && onSelectIndicator(key)}
                />

                {/* Visible Data Point Dot */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={isCurrent ? '7' : '4.5'}
                  className={`transition-all duration-300 ${
                    val >= 75
                      ? 'fill-emerald-600 stroke-white'
                      : val >= 50
                      ? 'fill-amber-500 stroke-white'
                      : 'fill-rose-500 stroke-white'
                  } ${isCurrent ? 'stroke-3 ring-4 ring-emerald-200' : 'stroke-2'}`}
                  onMouseEnter={() => setHoveredKey(key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  onClick={() => onSelectIndicator && onSelectIndicator(key)}
                />

                {/* Outer short label */}
                <text
                  x={labelCoord.x}
                  y={labelCoord.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={`text-[10px] font-bold transition-colors ${
                    isCurrent ? 'fill-emerald-700 font-extrabold' : 'fill-slate-600'
                  }`}
                  onMouseEnter={() => setHoveredKey(key)}
                  onMouseLeave={() => setHoveredKey(null)}
                  onClick={() => onSelectIndicator && onSelectIndicator(key)}
                >
                  {meta?.shortTitle.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Dynamic Hover/Click Information Card */}
      <div className="mt-3 min-h-[78px] bg-slate-50 rounded-2xl p-3.5 border border-slate-200/70 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-5 h-5 text-emerald-700" />
        </div>
        <div className="flex-1 min-w-0">
          {activeKey && activeMeta ? (
            <div>
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {activeMeta.title}
                </h4>
                <div className="flex flex-col gap-1 items-end">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    (activeScore || 0) >= 75
                      ? 'bg-emerald-100 text-emerald-800'
                      : (activeScore || 0) >= 50
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {activeScore}%
                  </span>
                  {initialIndicators && (
                    <span className="text-[10px] text-slate-500 font-medium">
                      Birinchi test: {initialIndicators[activeKey] || 0}%
                    </span>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                {activeMeta.friendlyExplanation}
              </p>
            </div>
          ) : (
            <div>
              <h4 className="text-xs font-bold text-slate-800">
                Indikator haqida ma'lumot olish
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Grafikdagi nuqtalardan birining ustiga sichqonchani olib boring yoki bosing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

