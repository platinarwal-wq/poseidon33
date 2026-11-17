import React, { useState } from 'react';
import { SimulatedNavigation } from '../types/naval';
import { 
  Compass, 
  Ship, 
  Fuel, 
  Clock, 
  Activity, 
  Utensils, 
  Waves, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  Download,
  Printer
} from 'lucide-react';

interface ModuleNavigationsProps {
  navigations: SimulatedNavigation[];
  onApplyNavigationTelemetry?: (nav: SimulatedNavigation) => void;
}

export const ModuleNavigations: React.FC<ModuleNavigationsProps> = ({
  navigations,
  onApplyNavigationTelemetry
}) => {
  const [selectedNavId, setSelectedNavId] = useState<string>(navigations[0]?.id || '');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [appliedMsg, setAppliedMsg] = useState<string | null>(null);

  const selectedNav = navigations.find((n) => n.id === selectedNavId) || navigations[0] || null;

  const filteredNavs = navigations.filter((n) => {
    if (filterType === 'ALL') return true;
    return n.missionType === filterType;
  });

  // Aggregated totals from the 10 navigations
  const totalHours = navigations.reduce((acc, n) => acc + n.durationHours, 0);
  const totalMiles = navigations.reduce((acc, n) => acc + n.distanceNauticalMiles, 0);
  const totalFuelLiters = navigations.reduce((acc, n) => acc + n.fuelConsumedLiters, 0);
  const totalFuelCost = navigations.reduce((acc, n) => acc + n.fuelCostMXN, 0);
  const totalRations = navigations.reduce((acc, n) => acc + n.rationsConsumed, 0);

  const handleApply = (nav: SimulatedNavigation) => {
    if (onApplyNavigationTelemetry) {
      onApplyNavigationTelemetry(nav);
      setAppliedMsg(`¡Telemetría de ${nav.id} (${nav.vesselName}) sincronizada con éxito! Horómetros y partidas presupuestales actualizadas.`);
      setTimeout(() => setAppliedMsg(null), 5000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = 'ID,Buque,Casco,Mision,Tipo,Origen,Destino,Zarpe,Arribo,Horas,Millas_NM,Velocidad_Kts,Diesel_Litros,Costo_MXN,Tripulacion,Raciones,Agua_Tons,Desgaste_Delta,Estado_Final\n';
    const rows = navigations.map((n) => 
      `"${n.id}","${n.vesselName}","${n.hullNumber}","${n.missionName}","${n.missionType}","${n.originPort}","${n.destinationPort}","${n.departureDate}","${n.arrivalDate}",${n.durationHours},${n.distanceNauticalMiles},${n.avgSpeedKnots},${n.fuelConsumedLiters},${n.fuelCostMXN},${n.crewOnboard},${n.rationsConsumed},${n.freshWaterTons},"${n.engineWearDeltaPercent}%","${n.finalVesselStatus}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BITACORA_10_NAVEGACIONES_POSEIDON_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-900 uppercase tracking-widest font-bold">
            <Compass className="w-3.5 h-3.5 text-blue-800" />
            <span>BITÁCORA TÁCTICA // 10 NAVEGACIONES SIMULADAS</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Registro y Telemetría de Navegaciones de la Flota Naval
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Simulación operativa de 10 derrotas de patrullaje, interdicción y escolta. Arroja datos matemáticos de horómetros acumulados, consumo de combustible diesel, desgaste de motores y raciones de dotación.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-semibold rounded bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-blue-900" />
            <span>Descargar CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs font-semibold rounded bg-blue-900 hover:bg-blue-800 text-white transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Bitácora</span>
          </button>
        </div>
      </div>

      {appliedMsg && (
        <div className="p-3.5 rounded border border-emerald-300 bg-emerald-50 text-xs text-emerald-900 font-mono font-medium flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{appliedMsg}</span>
        </div>
      )}

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono font-semibold">
            <Compass className="w-3.5 h-3.5 text-blue-800" />
            <span>MILLAS NÁUTICAS</span>
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-1">
            {totalMiles.toLocaleString('es-MX')} NM
          </div>
          <div className="text-[10px] text-slate-500">10 Misiones en ZEE</div>
        </div>

        <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono font-semibold">
            <Clock className="w-3.5 h-3.5 text-blue-800" />
            <span>HORAS DE MOTOR</span>
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-1">
            {totalHours.toLocaleString('es-MX')} Horas
          </div>
          <div className="text-[10px] text-slate-500">Acumulado en horómetros</div>
        </div>

        <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono font-semibold">
            <Fuel className="w-3.5 h-3.5 text-amber-700" />
            <span>DIESEL MARINO</span>
          </div>
          <div className="text-lg font-bold text-amber-800 font-mono tabular-nums mt-1">
            {totalFuelLiters.toLocaleString('es-MX')} Lts
          </div>
          <div className="text-[10px] text-slate-500">{(totalFuelLiters / 159).toFixed(0)} Barriles</div>
        </div>

        <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono font-semibold">
            <Activity className="w-3.5 h-3.5 text-emerald-700" />
            <span>COSTO COMBUSTIBLE</span>
          </div>
          <div className="text-lg font-bold text-emerald-800 font-mono tabular-nums mt-1">
            ${(totalFuelCost / 1000000).toFixed(2)}M
          </div>
          <div className="text-[10px] text-slate-500">Partida 26102 Gasto Público</div>
        </div>

        <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono font-semibold">
            <Utensils className="w-3.5 h-3.5 text-cyan-700" />
            <span>RACIONES DOTACIÓN</span>
          </div>
          <div className="text-lg font-bold text-slate-900 font-mono tabular-nums mt-1">
            {totalRations.toLocaleString('es-MX')}
          </div>
          <div className="text-[10px] text-slate-500">Intendencia Consumida</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
        <div className="text-xs font-mono font-bold text-slate-700">
          Filtrar por Misión Táctica:
        </div>
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'ALL', label: 'Todas las Derrotas (10)' },
            { id: 'PATRULLAJE_ZEE', label: 'Patrullaje ZEE' },
            { id: 'INTERDICCION_MARITIMA', label: 'Interdicción' },
            { id: 'REABASTECIMIENTO', label: 'Reabastecimiento' },
            { id: 'ESCOLTA_TACTICA', label: 'Escolta Táctica' },
            { id: 'PLAN_MARINA', label: 'Plan Marina' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              className={`px-2.5 py-1 text-[11px] font-mono rounded whitespace-nowrap transition-colors ${
                filterType === cat.id
                  ? 'bg-blue-900 text-white font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table of 10 Navigations */}
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-mono text-[11px] border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Folio</th>
                <th className="py-2.5 px-3">Buque Naval</th>
                <th className="py-2.5 px-3">Misión / Derrota</th>
                <th className="py-2.5 px-3 text-right">Duración</th>
                <th className="py-2.5 px-3 text-right">Distancia</th>
                <th className="py-2.5 px-3 text-right">Consumo Diesel</th>
                <th className="py-2.5 px-3 text-right">Gasto Presupuestal</th>
                <th className="py-2.5 px-3 text-center">Desgaste</th>
                <th className="py-2.5 px-3 text-center">Estado Final</th>
                <th className="py-2.5 px-3 text-center">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-900">
              {filteredNavs.map((nav) => {
                const isSelected = nav.id === selectedNavId;
                return (
                  <tr
                    key={nav.id}
                    onClick={() => setSelectedNavId(nav.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/70 font-semibold' : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono text-blue-900 font-bold whitespace-nowrap">
                      {nav.id}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{nav.vesselName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{nav.hullNumber}</div>
                    </td>
                    <td className="py-2.5 px-3 max-w-xs">
                      <div className="text-slate-900 font-medium truncate">{nav.missionName}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">
                        {nav.originPort} ➔ {nav.destinationPort}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-900">
                      {nav.durationHours} hrs
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                      {nav.distanceNauticalMiles} NM
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-amber-800 font-medium">
                      {nav.fuelConsumedLiters.toLocaleString('es-MX')} Lts
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums text-emerald-800 font-bold">
                      ${nav.fuelCostMXN.toLocaleString('es-MX')}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        nav.engineWearDeltaPercent >= 3 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        +{nav.engineWearDeltaPercent}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        nav.finalVesselStatus === 'OPERATIVO'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : nav.finalVesselStatus === 'PREVENTIVO'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : nav.finalVesselStatus === 'EN_DIQUE'
                          ? 'bg-blue-100 text-blue-900 border border-blue-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}>
                        {nav.finalVesselStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedNavId(nav.id);
                        }}
                        className="px-2 py-0.5 text-[11px] font-semibold text-blue-900 hover:text-blue-800 bg-white border border-slate-300 rounded shadow-2xs"
                      >
                        Ver Ficha
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Navigation Comprehensive Telemetry Card */}
      {selectedNav && (
        <div className="rounded-lg border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-blue-900 font-bold uppercase">
                <FileText className="w-4 h-4 text-blue-800" />
                <span>PARTE OFICIAL DE NAVEGACIÓN // {selectedNav.id}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5">
                {selectedNav.missionName}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                selectedNav.finalVesselStatus === 'OPERATIVO'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}>
                ESTADO RESULTANTE: {selectedNav.finalVesselStatus}
              </span>
              <button
                onClick={() => handleApply(selectedNav)}
                className="px-3 py-1 text-xs font-semibold bg-blue-900 hover:bg-blue-800 text-white rounded transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Sincronizar con Buque</span>
              </button>
            </div>
          </div>

          {/* Grid of Telemetry Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-slate-500 font-semibold block text-[10px]">DERROTA Y TRAYECTO:</span>
              <div className="text-slate-900 font-bold">{selectedNav.originPort}</div>
              <div className="text-slate-600">➔ {selectedNav.destinationPort}</div>
              <div className="text-[10px] text-slate-500 pt-1">
                Zarpe: {selectedNav.departureDate}
              </div>
              <div className="text-[10px] text-slate-500">
                Arribo: {selectedNav.arrivalDate}
              </div>
            </div>

            <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-slate-500 font-semibold block text-[10px]">CINEMÁTICA Y RENDIMIENTO:</span>
              <div className="text-slate-900">
                Distancia: <span className="font-bold text-blue-900">{selectedNav.distanceNauticalMiles} NM</span>
              </div>
              <div className="text-slate-900">
                Tiempo en Máquinas: <span className="font-bold text-blue-900">{selectedNav.durationHours} hrs</span>
              </div>
              <div className="text-slate-900">
                Velocidad Promedio: <span className="font-bold text-slate-900">{selectedNav.avgSpeedKnots} nudos</span>
              </div>
              <div className="text-[10px] text-slate-500 pt-1 flex items-center gap-1">
                <Waves className="w-3 h-3 text-cyan-700" />
                <span>{selectedNav.seaConditions}</span>
              </div>
            </div>

            <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-slate-500 font-semibold block text-[10px]">LOGÍSTICA DE COMBUSTIBLE:</span>
              <div className="text-amber-800 font-bold text-sm tabular-nums">
                {selectedNav.fuelConsumedLiters.toLocaleString('es-MX')} Litros
              </div>
              <div className="text-emerald-800 font-bold text-sm tabular-nums">
                ${selectedNav.fuelCostMXN.toLocaleString('es-MX')} MXN
              </div>
              <div className="text-[10px] text-slate-500 pt-1">
                Afectación: Partida 26102 (Combustibles y Lubricantes Marinos)
              </div>
            </div>

            <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-slate-500 font-semibold block text-[10px]">INTENDENCIA Y TRIPULACIÓN:</span>
              <div className="text-slate-900">
                Dotación a Bordo: <span className="font-bold">{selectedNav.crewOnboard} Elementos</span>
              </div>
              <div className="text-slate-900">
                Raciones Consumidas: <span className="font-bold text-slate-900">{selectedNav.rationsConsumed}</span>
              </div>
              <div className="text-slate-900">
                Agua Dulce: <span className="font-bold text-blue-900">{selectedNav.freshWaterTons} Tons</span>
              </div>
              <div className="text-[10px] text-rose-700 font-bold pt-1">
                Desgaste Motor: +{selectedNav.engineWearDeltaPercent}% acum.
              </div>
            </div>
          </div>

          {/* Technical Logbook Incident Report */}
          <div className="p-3.5 rounded border border-slate-200 bg-slate-50/80 font-mono text-xs text-slate-800 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Reporte de Incidencias Técnicas & Novedades de Bitácora de Máquinas:</span>
            </div>
            <p className="text-slate-900 font-sans leading-relaxed pt-1">
              {selectedNav.incidentReport}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
