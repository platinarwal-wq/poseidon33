import React, { useState } from 'react';
import { 
  NavalSupplyItem, 
  NavalZoneCenso, 
  RequisitionPAA,
  NavalVessel
} from '../types/naval';
import { VesselNSNDetailModal } from './VesselNSNDetailModal';
import { 
  Search, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  Users, 
  Ship, 
  TrendingUp, 
  Building2,
  FileBadge,
  Info
} from 'lucide-react';

interface ModulePAAProps {
  supplies: NavalSupplyItem[];
  zones: NavalZoneCenso[];
  requisitions: RequisitionPAA[];
  vessels?: NavalVessel[];
  onSignRequisition: (reqId: string, level: number) => void;
  onAddSupplyOrder: (supplyId: string, qty: number) => void;
}

export const getVesselForNSN = (nsnCode: string, fleet: NavalVessel[] = []): NavalVessel | null => {
  if (nsnCode === '4730-01-382-9912') {
    return fleet.find((v) => v.hullNumber === 'PO-161') || fleet[0] || null;
  }
  if (nsnCode === '8010-01-528-7741') {
    return fleet.find((v) => v.hullNumber === 'BAL-01') || fleet[0] || null;
  }
  if (nsnCode === '2815-01-490-3321') {
    return fleet.find((v) => v.hullNumber === 'F-214') || fleet[0] || null;
  }
  if (nsnCode === '6850-00-224-8901') {
    return fleet.find((v) => v.hullNumber === 'BAL-01') || fleet[0] || null;
  }
  if (nsnCode === '7920-00-240-2555') {
    return fleet.find((v) => v.hullNumber === 'PO-162') || fleet[0] || null;
  }
  if (nsnCode === '7530-01-164-9812') {
    return fleet.find((v) => v.hullNumber === 'PO-161') || fleet[0] || null;
  }
  if (nsnCode === '7642-01-089-2231') {
    return fleet.find((v) => v.hullNumber === 'PI-1102') || fleet[0] || null;
  }
  if (nsnCode === '4010-01-311-6677') {
    return fleet.find((v) => v.hullNumber === 'BAL-01') || fleet[0] || null;
  }
  return fleet[0] || null;
};

export const ModulePAA: React.FC<ModulePAAProps> = ({
  supplies,
  zones,
  requisitions,
  vessels = [],
  onSignRequisition,
  onAddSupplyOrder
}) => {
  const [subTab, setSubTab] = useState<'catalogo' | 'censo_paa' | 'firmas'>('catalogo');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [selectedSupply, setSelectedSupply] = useState<NavalSupplyItem | null>(null);
  const [orderQty, setOrderQty] = useState<number>(10);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // State for Vessel detail modal linked to OTAN NSN
  const [vesselModalSupply, setVesselModalSupply] = useState<NavalSupplyItem | null>(null);
  const [vesselModalTarget, setVesselModalTarget] = useState<NavalVessel | null>(null);

  const handleOpenVesselModal = (item: NavalSupplyItem) => {
    const target = getVesselForNSN(item.nsnCode, vessels);
    setVesselModalSupply(item);
    setVesselModalTarget(target);
  };

  const filteredSupplies = supplies.filter((s) => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.nsnCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.partidaGasto.includes(searchTerm);
    const matchesCat = categoryFilter === 'ALL' || s.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const totalPersonnel = zones.reduce((acc, z) => acc + z.personnelActive, 0);
  const totalVessels = zones.reduce((acc, z) => acc + z.vesselsAssigned, 0);
  const totalApprovedBudget = zones.reduce((acc, z) => acc + z.annualBudgetApproved, 0);
  const totalCommittedBudget = zones.reduce((acc, z) => acc + z.annualBudgetCommitted, 0);

  const handleCreateOrder = (s: NavalSupplyItem) => {
    onAddSupplyOrder(s.id, orderQty);
    setActionMessage(`Orden de reabastecimiento generada: ${orderQty} ${s.unit} de "${s.name}".`);
    setTimeout(() => setActionMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Module Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-900 uppercase tracking-widest font-bold">
            <FileBadge className="w-3.5 h-3.5 text-blue-800" />
            <span>MÓDULO I // GESTIÓN ADMINISTRATIVA</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Gestión de Necesidades Administrativas & Programa Anual (PAA)
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Estandarización de catálogo OTAN, consolidación presupuestal cruzando censos de personal naval, detección predictiva de sobrepedidos y trazabilidad de firmas jerárquicas.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg self-start">
          <button
            onClick={() => setSubTab('catalogo')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
              subTab === 'catalogo'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Catálogo OTAN Suministros
          </button>
          <button
            onClick={() => setSubTab('censo_paa')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
              subTab === 'censo_paa'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Censo Naval & Predictivo
          </button>
          <button
            onClick={() => setSubTab('firmas')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
              subTab === 'firmas'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Firmas Jerárquicas ({requisitions.length})
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 rounded border border-blue-200 bg-blue-50 text-xs text-blue-900 font-mono font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-blue-700 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3.5 rounded border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono font-semibold">
            <Users className="w-3.5 h-3.5 text-blue-800" />
            <span>CENSO NAVAL ACTIVO</span>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {totalPersonnel.toLocaleString('es-MX')}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">En 6 Regiones Navales</div>
        </div>

        <div className="p-3.5 rounded border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono font-semibold">
            <Ship className="w-3.5 h-3.5 text-blue-800" />
            <span>FLOTA EN DESPLIEGUE</span>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {totalVessels} Buques
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Flotillas Oceánicas y Ribereñas</div>
        </div>

        <div className="p-3.5 rounded border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono font-semibold">
            <Building2 className="w-3.5 h-3.5 text-amber-700" />
            <span>PRESUPUESTO PAA 2026</span>
          </div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            ${(totalApprovedBudget / 1000000).toFixed(1)}M MXN
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Comprometido: {((totalCommittedBudget / totalApprovedBudget) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="p-3.5 rounded border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
            <span>ANOMALÍAS DETECTADAS</span>
          </div>
          <div className="text-xl font-bold text-amber-800 font-mono tabular-nums mt-1">
            {requisitions.filter((r) => r.anomalyDetected).length} Alertas
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Desviación &gt;20% vs Histórico</div>
        </div>
      </div>

      {/* SUB-TAB 1: CATALOG */}
      {subTab === 'catalogo' && (
        <div className="space-y-4">
          {/* CUADRO DE CÓDIGO OTAN (NSN): Selector de opción para desplegar toda la información de la embarcación */}
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white rounded-lg p-4 border border-blue-800/80 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-600/30 text-cyan-300 border border-blue-500/30 shrink-0">
                <Ship className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                    CONSULTA NAVAL AVANZADA // CÓDIGO OTAN (NSN)
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                    INTERACTIVO
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight mt-0.5">
                  Selecciona un Código OTAN (NSN) para ver la ficha completa de la embarcación
                </h3>
                <p className="text-[11px] text-slate-300 font-sans">
                  Vinculación directa entre insumos estandarizados Mil-Spec, horómetros y estado operativo de la flota naval.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 min-w-[320px] md:max-w-md w-full md:w-auto">
              <select
                aria-label="Seleccionar Código OTAN (NSN)"
                onChange={(e) => {
                  const nsn = e.target.value;
                  if (!nsn) return;
                  const item = supplies.find((s) => s.nsnCode === nsn);
                  if (item) {
                    handleOpenVesselModal(item);
                  }
                }}
                defaultValue=""
                className="w-full text-xs font-mono py-2.5 px-3 bg-slate-900 text-cyan-300 border border-cyan-700/60 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-400 cursor-pointer font-semibold shadow-inner"
              >
                <option value="" disabled className="text-slate-400">
                  -- Seleccionar Código OTAN (NSN) --
                </option>
                {supplies.map((s) => {
                  const targetVessel = getVesselForNSN(s.nsnCode, vessels);
                  return (
                    <option key={s.id} value={s.nsnCode} className="text-slate-900 bg-white">
                      {s.nsnCode} · {s.name.slice(0, 30)}... [{targetVessel ? `${targetVessel.name} ${targetVessel.hullNumber}` : 'Buque'}]
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por descripción, código OTAN NSN o partida de gasto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 font-sans"
              />
            </div>
            <div className="flex items-center gap-1 overflow-x-auto">
              {['ALL', 'PINTURA_MARINA', 'QUIMICOS_SENTINA', 'ASEO_DOTACION', 'PAPELERIA_OFICIAL', 'CONSUMIBLES_CUBIERTA'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded whitespace-nowrap transition-colors ${
                    categoryFilter === cat
                      ? 'bg-blue-900 text-white font-bold'
                      : 'text-slate-600 hover:text-slate-900 bg-slate-50 border border-slate-200'
                  }`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-mono text-[11px] border-b border-slate-200 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-2.5 px-4">Código OTAN (NSN)</th>
                    <th className="py-2.5 px-4">Descripción Estandarizada Mil-Spec</th>
                    <th className="py-2.5 px-4">Partida</th>
                    <th className="py-2.5 px-4 text-right">Existencia</th>
                    <th className="py-2.5 px-4 text-right">Pto. Reorden</th>
                    <th className="py-2.5 px-4 text-right">Costo Unitario</th>
                    <th className="py-2.5 px-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-900">
                  {filteredSupplies.map((item) => {
                    const isLow = item.stockActual <= item.stockMinimo;
                    const assignedVessel = getVesselForNSN(item.nsnCode, vessels);
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-4 font-mono text-blue-900 font-bold text-[11px] whitespace-nowrap">
                          <button
                            onClick={() => handleOpenVesselModal(item)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 transition-colors cursor-pointer group text-left shadow-2xs"
                            title={`Haz clic para ver toda la información de la embarcación asignada (${assignedVessel?.name})`}
                          >
                            <Ship className="w-3.5 h-3.5 text-blue-700 group-hover:text-blue-900 shrink-0" />
                            <span className="font-bold underline decoration-blue-300 group-hover:decoration-blue-900">
                              {item.nsnCode}
                            </span>
                          </button>
                          {assignedVessel && (
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
                              <span>{assignedVessel.hullNumber} · {assignedVessel.name.replace('ARM ', '')}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-2.5 px-4 max-w-md">
                          <div className="font-semibold text-slate-900">{item.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            Norma: {item.specDoc} · Presentación: {item.unit} · Lead Time: {item.leadTimeDays}d
                          </div>
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-600 font-medium">
                          {item.partidaGasto}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums">
                          <span className={isLow ? 'text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200' : 'text-slate-800'}>
                            {item.stockActual}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-500">
                          {item.stockMinimo}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono tabular-nums text-slate-900 font-medium">
                          ${item.unitCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <button
                            onClick={() => setSelectedSupply(item)}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-slate-50 text-blue-900 border border-slate-300 rounded transition-colors whitespace-nowrap shadow-xs"
                          >
                            Reabastecer
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Reorder Modal/Card */}
          {selectedSupply && (
            <div className="p-4 rounded-lg border border-blue-300 bg-white shadow-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="text-xs font-mono text-blue-900 font-bold">
                  ORDEN DE REABASTECIMIENTO // {selectedSupply.nsnCode}
                </div>
                <button
                  onClick={() => setSelectedSupply(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-mono font-semibold"
                >
                  Cerrar [✕]
                </button>
              </div>
              <div className="text-sm font-bold text-slate-900">{selectedSupply.name}</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-slate-600 font-mono block mb-1">
                    Cantidad a Ordenar ({selectedSupply.unit})
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={orderQty}
                    onChange={(e) => setOrderQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded font-mono text-slate-900"
                  />
                </div>
                <div>
                  <div className="text-[11px] text-slate-600 font-mono mb-1">Partida Presupuestal</div>
                  <div className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded font-mono text-blue-900 font-semibold">
                    {selectedSupply.partidaGasto} (Gasto Corriente)
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-600 font-mono mb-1">Costo Estimado Bruto</div>
                  <div className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded font-mono font-bold text-emerald-800">
                    ${(orderQty * selectedSupply.unitCost).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setSelectedSupply(null)}
                  className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleCreateOrder(selectedSupply)}
                  className="px-3.5 py-1 text-xs font-semibold bg-blue-900 hover:bg-blue-800 text-white rounded transition-colors shadow-xs"
                >
                  Emitir Requisición PAA
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: CENSO & PREDICTIVO */}
      {subTab === 'censo_paa' && (
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 font-mono uppercase mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-800" />
              <span>Censo de Personal y Distribución de Asignaciones por Región Naval</span>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-mono text-[11px] border-b border-slate-200 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Región Naval</th>
                    <th className="py-2.5 px-3">Sede</th>
                    <th className="py-2.5 px-3 text-right">Censo Activo</th>
                    <th className="py-2.5 px-3 text-right">Buques</th>
                    <th className="py-2.5 px-3 text-right">Presupuesto PAA Aprobado</th>
                    <th className="py-2.5 px-3 text-right">Comprometido</th>
                    <th className="py-2.5 px-3 text-right">Saldo Disponible</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-900">
                  {zones.map((zone) => {
                    const balance = zone.annualBudgetApproved - zone.annualBudgetCommitted;
                    const pct = (zone.annualBudgetCommitted / zone.annualBudgetApproved) * 100;
                    return (
                      <tr key={zone.id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{zone.name}</td>
                        <td className="py-2.5 px-3 text-slate-600">{zone.location}</td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-blue-900 font-bold">
                          {zone.personnelActive.toLocaleString('es-MX')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums font-medium">{zone.vesselsAssigned}</td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                          ${(zone.annualBudgetApproved / 1000000).toFixed(2)}M
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-amber-800 font-medium">
                          ${(zone.annualBudgetCommitted / 1000000).toFixed(2)}M ({pct.toFixed(0)}%)
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-emerald-800 font-bold">
                          ${(balance / 1000000).toFixed(2)}M
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Predictive demand & anomaly detection */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-mono uppercase flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-700" />
                <span>Auditoría Algorítmica de Series Temporales (Detección de Sobrepedidos)</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">Modelo: Holt-Winters Naval Holt3</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requisitions.map((req) => (
                <div
                  key={req.id}
                  className={`p-3.5 rounded border ${
                    req.anomalyDetected
                      ? 'border-amber-300 bg-amber-50/60'
                      : 'border-slate-200 bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-blue-900 font-bold">{req.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        req.anomalyDetected
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {req.anomalyDetected ? 'SOBREPEDIDO DETECTADO' : 'DENTRO DE NORMA'}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1">{req.item}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{req.solicitante}</div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-200 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-500 block">Solicitado</span>
                      <span className="text-slate-900 font-bold">{req.quantityRequested}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Proyección Censo</span>
                      <span className="text-slate-700 font-medium">{req.predictedDemand}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Desviación</span>
                      <span className={req.anomalyDetected ? 'text-amber-800 font-bold' : 'text-emerald-800 font-bold'}>
                        {(((req.quantityRequested - req.predictedDemand) / req.predictedDemand) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200 shadow-2xs">
                    <span className="text-slate-500 font-mono font-semibold">Justificación Operativa:</span> {req.justification}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: FIRMAS JERÁRQUICAS */}
      {subTab === 'firmas' && (
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 font-mono uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-800" />
                <span>Flujo de Aprobación Jerárquico y Trazabilidad Criptográfica de Firmas</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono font-medium">Cadena de Mando SEMAR</span>
            </div>

            {requisitions.map((req) => (
              <div key={req.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono text-blue-900 font-bold">{req.id}</span>
                    <span className="text-xs text-slate-500 font-mono ml-2">Partida {req.partidaGasto}</span>
                    <h4 className="text-sm font-bold text-slate-900">{req.item} ({req.quantityRequested} unidades)</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono text-slate-500">Afectación Total</div>
                    <div className="text-sm font-bold text-emerald-800 font-mono tabular-nums">
                      ${req.totalCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                    </div>
                  </div>
                </div>

                {/* 4-Step Chain */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2">
                  {req.approvalChain.map((step) => (
                    <div
                      key={step.level}
                      className={`p-2.5 rounded border text-xs font-mono ${
                        step.signed
                          ? 'border-emerald-300 bg-emerald-50/80'
                          : 'border-slate-200 bg-white shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-500 font-semibold">NIVEL {step.level}</span>
                        {step.signed ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-amber-700" />
                        )}
                      </div>
                      <div className="font-bold text-slate-900 text-[11px] truncate">{step.role}</div>
                      <div className="text-[10px] text-slate-600 truncate">{step.officerName}</div>

                      {step.signed ? (
                        <div className="mt-2 text-[9px] text-emerald-800 border-t border-emerald-200 pt-1 font-medium">
                          Firmado: {step.timestamp}
                          <div className="text-[8px] text-slate-500 truncate">{step.digitalFingerprint}</div>
                        </div>
                      ) : (
                        <button
                          onClick={() => onSignRequisition(req.id, step.level)}
                          className="mt-2 w-full py-1 text-[11px] font-semibold rounded bg-blue-900 hover:bg-blue-800 text-white transition-colors shadow-xs"
                        >
                          Estampar Firma
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Ficha Técnica de Embarcación vinculada a Código OTAN (NSN) */}
      <VesselNSNDetailModal
        supply={vesselModalSupply}
        vessel={vesselModalTarget}
        onClose={() => {
          setVesselModalSupply(null);
          setVesselModalTarget(null);
        }}
      />
    </div>
  );
};
