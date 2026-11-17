import React, { useState } from 'react';
import { NavalZoneCenso, NavalVessel } from '../types/naval';
import { 
  TrendingUp, 
  Ship, 
  DollarSign, 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Maximize2, 
  Minimize2, 
  CheckCircle2, 
  Compass, 
  Flame, 
  ChevronRight,
  MapPin,
  BarChart3,
  LineChart
} from 'lucide-react';

interface ExecutiveKPIDashboardProps {
  zones: NavalZoneCenso[];
  vessels: NavalVessel[];
  totalDiscrepanciesCount: number;
  totalNavigationsCount: number;
  onNavigateToTab?: (tab: 'paa' | 'mantenimiento' | 'auditoria' | 'navegaciones' | 'mapa' | 'uniformes' | 'armamento') => void;
}

export const ExecutiveKPIDashboard: React.FC<ExecutiveKPIDashboardProps> = ({
  zones,
  vessels,
  totalDiscrepanciesCount,
  totalNavigationsCount,
  onNavigateToTab
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [hoveredClass, setHoveredClass] = useState<string | null>(null);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [activeBudgetGraphView, setActiveBudgetGraphView] = useState<'regiones' | 'partidas' | 'curva_anual'>('regiones');

  // ==========================================
  // 1. CÁLCULO DE CUMPLIMIENTO PRESUPUESTAL ANUAL
  // ==========================================
  const totalApprovedBudget = zones.reduce((acc, z) => acc + z.annualBudgetApproved, 0);
  const totalCommittedBudget = zones.reduce((acc, z) => acc + z.annualBudgetCommitted, 0);
  const budgetExecutionPercent = totalApprovedBudget > 0 
    ? Math.round((totalCommittedBudget / totalApprovedBudget) * 1000) / 10 
    : 0;
  
  // Programmed Target Benchmark (72.0% for current period in fiscal year)
  const programmedTargetPercent = 72.0;
  const budgetVariancePercent = Math.round((budgetExecutionPercent - programmedTargetPercent) * 10) / 10;
  const isBudgetWithinThreshold = Math.abs(budgetVariancePercent) <= 5;

  // Monthly Budget Burn-Rate Data (Ene-Dic)
  const monthlyBurnRate = [
    { month: 'Ene', programmed: 180, executed: 172, status: 'CERRADO' },
    { month: 'Feb', programmed: 370, executed: 360, status: 'CERRADO' },
    { month: 'Mar', programmed: 580, executed: 595, status: 'CERRADO' },
    { month: 'Abr', programmed: 790, executed: 780, status: 'CERRADO' },
    { month: 'May', programmed: 1010, executed: 995, status: 'CERRADO' },
    { month: 'Jun', programmed: 1240, executed: 1220, status: 'CERRADO' },
    { month: 'Jul', programmed: 1460, executed: 1435, status: 'CERRADO' },
    { month: 'Ago', programmed: 1670, executed: 1650, status: 'CERRADO' },
    { month: 'Sep', programmed: 1890, executed: 1870, status: 'CERRADO' },
    { month: 'Oct', programmed: 2090, executed: Math.round(totalCommittedBudget / 1000000), status: 'ACTUAL' },
    { month: 'Nov', programmed: 2240, executed: 2210, status: 'PROYECCION' },
    { month: 'Dic', programmed: 2375, executed: 2375, status: 'PROYECCION' },
  ];

  // Breakdown by Partida Presupuestal
  const partidaBreakdown = [
    { code: '26102', name: 'Combustibles y Lubricantes Marinos', sharePercent: 38, amount: totalCommittedBudget * 0.38, color: '#2563eb' },
    { code: '35701', name: 'Mantenimiento Naval y Dique Seco', sharePercent: 26, amount: totalCommittedBudget * 0.26, color: '#0284c7' },
    { code: '27101', name: 'Vestuario, Uniformes y Blancos', sharePercent: 16, amount: totalCommittedBudget * 0.16, color: '#0d9488' },
    { code: '22104', name: 'Alimentación y Raciones de Dotación', sharePercent: 12, amount: totalCommittedBudget * 0.12, color: '#16a34a' },
    { code: '29601', name: 'Refacciones y Accesorios de Cubierta', sharePercent: 8, amount: totalCommittedBudget * 0.08, color: '#64748b' },
  ];

  // ==========================================
  // 2. CÁLCULO DE DISPONIBILIDAD OPERATIVA DE FLOTA
  // ==========================================
  const totalVessels = vessels.length;
  const operationalVessels = vessels.filter((v) => v.status === 'OPERATIVO').length;
  const preventiveVessels = vessels.filter((v) => v.status === 'PREVENTIVO').length;
  const dryDockVessels = vessels.filter((v) => v.status === 'EN_DIQUE').length;
  const nonOperationalVessels = vessels.filter((v) => v.status === 'NO_OPERATIVO').length;

  const fleetReadinessPercent = totalVessels > 0 
    ? Math.round((operationalVessels / totalVessels) * 1000) / 10 
    : 0;

  // Fleet Target Benchmark (Naval doctrine standard: 75.0%)
  const fleetTargetPercent = 75.0;

  // Average Engine Health index across all vessels' critical components
  const allCriticalComponents = vessels.flatMap((v) => v.criticalComponents);
  const avgEngineHealth = allCriticalComponents.length > 0
    ? Math.round(
        allCriticalComponents.reduce((acc, c) => acc + (100 - c.wearPercentage), 0) /
          allCriticalComponents.length
      )
    : 85;

  // Breakdown by Vessel Class
  const classBreakdown = [
    { 
      type: 'PATRULLA_OCEANICA', 
      label: 'Patrullas Oceánicas (PO)', 
      total: vessels.filter(v => v.vesselClass === 'PATRULLA_OCEANICA').length,
      active: vessels.filter(v => v.vesselClass === 'PATRULLA_OCEANICA' && v.status === 'OPERATIVO').length
    },
    { 
      type: 'FRAGATA', 
      label: 'Fragatas Misileras (F)', 
      total: vessels.filter(v => v.vesselClass === 'FRAGATA').length,
      active: vessels.filter(v => v.vesselClass === 'FRAGATA' && v.status === 'OPERATIVO').length
    },
    { 
      type: 'PATRULLA_INTERCEPTORA', 
      label: 'Patrullas Interceptoras (PI)', 
      total: vessels.filter(v => v.vesselClass === 'PATRULLA_INTERCEPTORA').length,
      active: vessels.filter(v => v.vesselClass === 'PATRULLA_INTERCEPTORA' && v.status === 'OPERATIVO').length
    },
    { 
      type: 'BUQUE_APROVISIONAMIENTO', 
      label: 'Buques de Apoyo Logístico (BAL)', 
      total: vessels.filter(v => v.vesselClass === 'BUQUE_APROVISIONAMIENTO').length,
      active: vessels.filter(v => v.vesselClass === 'BUQUE_APROVISIONAMIENTO' && v.status === 'OPERATIVO').length
    },
    { 
      type: 'VEHICULO_TACTICO_ANFIBIO', 
      label: 'Vehículos Tácticos Anfibios (VTA)', 
      total: vessels.filter(v => v.vesselClass === 'VEHICULO_TACTICO_ANFIBIO').length,
      active: vessels.filter(v => v.vesselClass === 'VEHICULO_TACTICO_ANFIBIO' && v.status === 'OPERATIVO').length
    }
  ].filter(c => c.total > 0);

  // SVG Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * (240 / 360);
  const strokeDashoffset = circumference - (fleetReadinessPercent / 100) * arcLength;

  return (
    <section className="bg-white border border-slate-200 rounded-lg shadow-xs mb-6 overflow-hidden">
      {/* KPI Header Bar */}
      <div className="bg-slate-900 text-white px-5 py-3 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-blue-600/30 text-blue-400 border border-blue-500/30">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider text-blue-400 uppercase">
                PANEL DE INDICADORES CLAVE (KPI) // COMANDO CENTRAL
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                TELEMETRÍA EN VIVO
              </span>
            </div>
            <h2 className="text-sm font-bold text-slate-100 tracking-tight">
              Cumplimiento Presupuestal PAA & Disponibilidad Operativa de Flota Naval
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToTab && (
            <button
              onClick={() => onNavigateToTab('mapa')}
              className="px-2.5 py-1 text-xs font-mono font-semibold rounded bg-blue-950 hover:bg-blue-900 text-cyan-300 transition-colors flex items-center gap-1.5 border border-cyan-800/60 cursor-pointer shadow-xs"
              title="Abrir mapa táctico interactivo con todas las zonas navales y flotas"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ver Mapa Táctico Zonal</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1 text-xs font-mono font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            title={isExpanded ? 'Contraer vista gráfica' : 'Expandir gráficas completas'}
          >
            {isExpanded ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Vista Compacta</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Ver Gráficas Analíticas</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main KPI Hero Cards Grid */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        
        {/* ========================================================
            CARD 1: CUMPLIMIENTO PRESUPUESTAL ANUAL (PAA / SECTOR)
        ======================================================== */}
        <div className="flex flex-col justify-between pt-2 lg:pt-0">
          <div>
            {/* Header / Badges */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded bg-blue-50 text-blue-900 border border-blue-200">
                  <DollarSign className="w-5 h-5 text-blue-800" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-500 tracking-wider">
                    RECURSOS FISCALES // EJERCICIO PAA 2026
                  </span>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    Cumplimiento Presupuestal Anual
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                  isBudgetWithinThreshold
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Meta: {programmedTargetPercent}%</span>
                </span>
              </div>
            </div>

            {/* KPI Main Numeric Big Display */}
            <div className="flex items-baseline justify-between mt-2 mb-3">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-blue-950 font-mono tracking-tight">
                    {budgetExecutionPercent.toFixed(1)}%
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    ejercido / comprometido
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-0.5 font-mono">
                  ${(totalCommittedBudget / 1000000).toLocaleString('es-MX', { maximumFractionDigits: 1 })} MDP ejercidos de ${(totalApprovedBudget / 1000000).toLocaleString('es-MX', { maximumFractionDigits: 1 })} MDP aprobados
                </div>
              </div>

              <div className="text-right font-mono text-xs">
                <div className="text-[10px] uppercase text-slate-500 font-semibold">Desviación Programática</div>
                <div className={`font-bold ${budgetVariancePercent >= 0 ? 'text-blue-700' : 'text-amber-700'}`}>
                  {budgetVariancePercent >= 0 ? `+${budgetVariancePercent}%` : `${budgetVariancePercent}%`} vs Calendario
                </div>
              </div>
            </div>

            {/* Modern Gradient Progress Track with Milestone Marker */}
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between text-[11px] font-mono text-slate-500 font-medium">
                <span>0 MDP (Inicio)</span>
                <span className="text-blue-900 font-bold">Meta Trimestral: 72%</span>
                <span>{Math.round(totalApprovedBudget / 1000000)} MDP (Techo PEF)</span>
              </div>
              <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 transition-all duration-700 shadow-xs relative"
                  style={{ width: `${Math.min(100, budgetExecutionPercent)}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                </div>
                {/* Benchmark indicator line */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10 shadow-xs" 
                  style={{ left: `${programmedTargetPercent}%` }} 
                  title={`Meta programada: ${programmedTargetPercent}%`}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" /> Comprometido en adquisiciones
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Referencia Meta SEMAR
                </span>
              </div>
            </div>
          </div>

          {/* Expanded Modern Graphic View for Budget */}
          {isExpanded && (
            <div className="mt-2 pt-3 border-t border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-slate-700 uppercase">
                  Desglose Gráfico de Cumplimiento
                </span>
                <div className="flex items-center gap-1 text-[11px] font-mono">
                  <button
                    onClick={() => setActiveBudgetGraphView('regiones')}
                    className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                      activeBudgetGraphView === 'regiones'
                        ? 'bg-blue-900 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Regiones
                  </button>
                  <button
                    onClick={() => setActiveBudgetGraphView('partidas')}
                    className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                      activeBudgetGraphView === 'partidas'
                        ? 'bg-blue-900 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Partidas
                  </button>
                  <button
                    onClick={() => setActiveBudgetGraphView('curva_anual')}
                    className={`px-2 py-0.5 rounded transition-colors cursor-pointer flex items-center gap-1 ${
                      activeBudgetGraphView === 'curva_anual'
                        ? 'bg-blue-900 text-white font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <LineChart className="w-3 h-3" />
                    <span>Curva Anual</span>
                  </button>
                </div>
              </div>

              {/* View A: Regional Modern Bar Charts with Tooltip */}
              {activeBudgetGraphView === 'regiones' && (
                <div className="space-y-2 bg-slate-50/70 p-3 rounded-lg border border-slate-200/80">
                  {zones.map((zone) => {
                    const zonePercent = Math.round((zone.annualBudgetCommitted / zone.annualBudgetApproved) * 100);
                    const isHovered = hoveredZone === zone.id;
                    return (
                      <div 
                        key={zone.id} 
                        className={`transition-all rounded px-2 py-1.5 ${isHovered ? 'bg-white shadow-xs border border-blue-200' : 'hover:bg-slate-100/70'}`}
                        onMouseEnter={() => setHoveredZone(zone.id)}
                        onMouseLeave={() => setHoveredZone(null)}
                      >
                        <div className="flex items-center justify-between text-xs font-mono mb-1">
                          <span className="font-semibold text-slate-800 truncate max-w-[220px]" title={zone.name}>
                            {zone.id} · {zone.name.split('(')[1]?.replace(')', '') || zone.location}
                          </span>
                          <span className="font-bold text-slate-900">
                            {zonePercent}%
                            <span className="text-[10px] font-normal text-slate-500 ml-1">
                              (${Math.round(zone.annualBudgetCommitted / 1000000)} / ${Math.round(zone.annualBudgetApproved / 1000000)} MDP)
                            </span>
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              zonePercent > 80 
                                ? 'bg-amber-600' 
                                : zonePercent > 65 
                                ? 'bg-blue-600' 
                                : 'bg-emerald-600'
                            }`}
                            style={{ width: `${Math.min(100, zonePercent)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* View B: Partidas de Gasto Modern Chart */}
              {activeBudgetGraphView === 'partidas' && (
                <div className="space-y-2.5 bg-slate-50/70 p-3 rounded-lg border border-slate-200/80">
                  {partidaBreakdown.map((partida) => (
                    <div key={partida.code} className="text-xs font-mono">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                          <span 
                            className="w-2.5 h-2.5 rounded-xs inline-block" 
                            style={{ backgroundColor: partida.color }}
                          />
                          Partida {partida.code} · <span className="text-slate-600 font-normal truncate max-w-[190px]">{partida.name}</span>
                        </span>
                        <span className="font-bold text-slate-900">
                          {partida.sharePercent}%
                          <span className="text-[10px] font-normal text-slate-500 ml-1">
                            (${(partida.amount / 1000000).toFixed(1)} MDP)
                          </span>
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${partida.sharePercent * 2.5}%`,
                            backgroundColor: partida.color 
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* View C: Monthly Burn-Rate SVG Area Curve */}
              {activeBudgetGraphView === 'curva_anual' && (
                <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200/80">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-600 mb-2">
                    <span className="font-semibold">Curva de Gasto Anual Acumulado ($ MDP)</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-0.5 bg-blue-700 inline-block" /> Comprometido
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-0.5 bg-slate-400 inline-block border-t border-dashed" /> Meta PEF
                      </span>
                    </div>
                  </div>

                  <div className="relative w-full h-28">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 360 90">
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Grid lines */}
                      <line x1="0" y1="20" x2="360" y2="20" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3 3" />
                      <line x1="0" y1="50" x2="360" y2="50" stroke="#e2e8f0" strokeWidth="0.8" strokeDasharray="3 3" />
                      <line x1="0" y1="80" x2="360" y2="80" stroke="#cbd5e1" strokeWidth="1" />

                      {/* Programmed Target Dashed Line */}
                      <path
                        d="M 15 82 L 45 76 L 75 68 L 105 60 L 135 52 L 165 43 L 195 35 L 225 27 L 255 19 L 285 13 L 315 8 L 345 5"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="1.2"
                        strokeDasharray="3 3"
                      />

                      {/* Executed Area Fill */}
                      <path
                        d="M 15 82 L 45 76 L 75 67 L 105 61 L 135 53 L 165 44 L 195 36 L 225 28 L 255 20 L 285 14 L 315 9 L 345 5 L 345 85 L 15 85 Z"
                        fill="url(#areaGrad)"
                      />

                      {/* Executed Solid Blue Line */}
                      <path
                        d="M 15 82 L 45 76 L 75 67 L 105 61 L 135 53 L 165 44 L 195 36 L 225 28 L 255 20 L 285 14 L 315 9 L 345 5"
                        fill="none"
                        stroke="#1d4ed8"
                        strokeWidth="2"
                      />

                      {/* Monthly Interactive Dots */}
                      {monthlyBurnRate.map((item, idx) => {
                        const cx = 15 + idx * 30;
                        const cy = 82 - (item.executed / 2375) * 77;
                        const isHovered = hoveredMonth === idx;
                        return (
                          <g 
                            key={idx}
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredMonth(idx)}
                            onMouseLeave={() => setHoveredMonth(null)}
                          >
                            <circle
                              cx={cx}
                              cy={cy}
                              r={isHovered ? 5 : 3}
                              fill={item.status === 'PROYECCION' ? '#94a3b8' : '#1d4ed8'}
                              stroke="#ffffff"
                              strokeWidth="1.5"
                            />
                            {/* Month Label */}
                            <text
                              x={cx}
                              y="89"
                              textAnchor="middle"
                              fill="#64748b"
                              fontSize="7"
                              fontFamily="monospace"
                            >
                              {item.month}
                            </text>

                            {/* Tooltip on hover */}
                            {isHovered && (
                              <g transform={`translate(${Math.min(280, Math.max(30, cx - 40))}, ${Math.max(5, cy - 26)})`}>
                                <rect width="80" height="22" rx="3" fill="#0f172a" opacity="0.9" />
                                <text x="40" y="11" textAnchor="middle" fill="#38bdf8" fontSize="8" fontFamily="monospace" fontWeight="bold">
                                  {item.month}: ${item.executed}M
                                </text>
                                <text x="40" y="19" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontFamily="monospace">
                                  Meta: ${item.programmed}M
                                </text>
                              </g>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              )}

              {onNavigateToTab && (
                <div className="mt-2 text-right">
                  <button
                    onClick={() => onNavigateToTab('paa')}
                    className="text-[11px] font-mono text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Ir a Tablero Completo de Necesidades & PAA</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ========================================================
            CARD 2: DISPONIBILIDAD OPERATIVA DE FLOTA NAVAL
        ======================================================== */}
        <div className="flex flex-col justify-between pt-4 lg:pt-0 lg:pl-6">
          <div>
            {/* Header / Badges */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded bg-emerald-50 text-emerald-900 border border-emerald-200">
                  <Ship className="w-5 h-5 text-emerald-800" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-500 tracking-wider">
                    ESTADO MAYOR GENERAL // FLOTA ACTIVA
                  </span>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    Disponibilidad Operativa en Tiempo Real
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                  fleetReadinessPercent >= fleetTargetPercent
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Estándar: {fleetTargetPercent}%</span>
                </span>
              </div>
            </div>

            {/* Gauge & Metrics Split Display */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mt-2 mb-3">
              {/* Modern SVG Radial Gauge */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center p-2 bg-gradient-to-b from-slate-50 to-white rounded-lg border border-slate-200">
                <div className="relative w-36 h-28 flex items-center justify-center">
                  <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 120 120">
                    {/* Background track arc */}
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      className="text-slate-100"
                      strokeWidth="10"
                      stroke="currentColor"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference * (120 / 360)}
                      strokeLinecap="round"
                    />
                    {/* Foreground value arc with gradient */}
                    <defs>
                      <linearGradient id="fleetGaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#0284c7" />
                        <stop offset="100%" stopColor="#1e3a8a" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      stroke="url(#fleetGaugeGradient)"
                      strokeWidth="10"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>

                  {/* Inner text inside gauge */}
                  <div className="absolute top-10 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-extrabold text-slate-900 font-mono tracking-tight leading-none">
                      {fleetReadinessPercent.toFixed(1)}%
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 font-semibold uppercase mt-1">
                      {operationalVessels} / {totalVessels} Buques
                    </span>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-600 font-semibold mt-1">
                  Índice de Alistamiento Táctico
                </div>
              </div>

              {/* Status Breakdown Pills & Health Index */}
              <div className="sm:col-span-7 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-emerald-50 border border-emerald-200">
                    <div className="text-[10px] text-emerald-800 font-semibold uppercase">Operativos</div>
                    <div className="text-base font-bold text-emerald-900 tabular-nums">
                      {operationalVessels} Unidades
                    </div>
                  </div>

                  <div className="p-2 rounded bg-amber-50 border border-amber-200">
                    <div className="text-[10px] text-amber-800 font-semibold uppercase">Preventivo</div>
                    <div className="text-base font-bold text-amber-900 tabular-nums">
                      {preventiveVessels} Buques
                    </div>
                  </div>

                  <div className="p-2 rounded bg-blue-50 border border-blue-200">
                    <div className="text-[10px] text-blue-800 font-semibold uppercase">En Dique Seco</div>
                    <div className="text-base font-bold text-blue-900 tabular-nums">
                      {dryDockVessels} Buques
                    </div>
                  </div>

                  <div className="p-2 rounded bg-rose-50 border border-rose-200">
                    <div className="text-[10px] text-rose-800 font-semibold uppercase">Fuera Servicio</div>
                    <div className="text-base font-bold text-rose-900 tabular-nums">
                      {nonOperationalVessels} Buques
                    </div>
                  </div>
                </div>

                {/* Propulsion Health Bar */}
                <div className="p-2 bg-slate-50 rounded border border-slate-200 text-xs font-mono">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-slate-600 font-semibold flex items-center gap-1 text-[11px]">
                      <Flame className="w-3.5 h-3.5 text-amber-600" />
                      Salud Propulsión (MTU / Auxiliares)
                    </span>
                    <span className="font-bold text-slate-900">{avgEngineHealth}% Promedio</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        avgEngineHealth >= 80 ? 'bg-emerald-600' : 'bg-amber-600'
                      }`}
                      style={{ width: `${avgEngineHealth}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expanded Modern Graphic View for Fleet Classes */}
          {isExpanded && (
            <div className="mt-2 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-slate-700 uppercase">
                  Disponibilidad por Clase Táctica de Nave
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {vessels.reduce((acc, v) => acc + v.mainEngineHours, 0).toLocaleString('es-MX')} Horómetros Flota
                </span>
              </div>

              {/* Tactical Class Modern Stacked Meters */}
              <div className="space-y-2 bg-slate-50/70 p-3 rounded-lg border border-slate-200/80">
                {classBreakdown.map((item) => {
                  const rate = item.total > 0 ? Math.round((item.active / item.total) * 100) : 0;
                  const isHovered = hoveredClass === item.type;
                  return (
                    <div 
                      key={item.type}
                      className={`transition-all rounded px-2 py-1.5 ${isHovered ? 'bg-white shadow-xs border border-emerald-200' : 'hover:bg-slate-100/70'}`}
                      onMouseEnter={() => setHoveredClass(item.type)}
                      onMouseLeave={() => setHoveredClass(null)}
                    >
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="font-semibold text-slate-800">{item.label}</span>
                        <span className="font-bold text-slate-900">
                          {rate}%
                          <span className="text-[10px] font-normal text-slate-500 ml-1.5">
                            ({item.active} de {item.total} en orden de zarpe)
                          </span>
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            rate >= 75 ? 'bg-emerald-600' : rate >= 50 ? 'bg-amber-600' : 'bg-rose-600'
                          }`}
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {onNavigateToTab && (
                <div className="mt-2 text-right">
                  <button
                    onClick={() => onNavigateToTab('mantenimiento')}
                    className="text-[11px] font-mono text-emerald-700 hover:text-emerald-900 font-semibold inline-flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Gestionar Buques, Horómetros y Dique Seco</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sub-Strip: Integrated Quick Tactical Health Signals */}
      <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-600">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sistema PAA: <strong>{zones.length} Regiones Auditadas</strong></span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-700">
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Operaciones en ZEE: <strong>{totalNavigationsCount} Derrotas Simuladas</strong></span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-700">
            <AlertTriangle className={`w-3.5 h-3.5 ${totalDiscrepanciesCount > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
            <span>Discrepancias en Tránsito: <strong className={totalDiscrepanciesCount > 0 ? 'text-amber-700' : 'text-slate-600'}>{totalDiscrepanciesCount} Casos</strong></span>
          </span>
        </div>

        <div className="text-[11px] text-slate-500 font-mono">
          Actualización Cripto-Sincronizada · Nodo CG-NAV-01
        </div>
      </div>
    </section>
  );
};
