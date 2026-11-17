import React, { useState } from 'react';
import { InventoryDiscrepancy, ZonalAuditLog } from '../types/naval';
import { 
  AlertTriangle, 
  ShieldAlert, 
  FileCheck2, 
  Building2, 
  Search, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Fingerprint, 
  Scale, 
  DollarSign, 
  ArrowRight,
  Printer,
  Download
} from 'lucide-react';

interface ModuleDiscrepancyDashboardProps {
  discrepancies: InventoryDiscrepancy[];
  auditLogs: ZonalAuditLog[];
  onReconcileDiscrepancy: (discrepancyId: string, adjustedQty: number) => void;
  onRaiseOfficialActa: (discrepancyId: string, notes: string) => void;
}

export const ModuleDiscrepancyDashboard: React.FC<ModuleDiscrepancyDashboardProps> = ({
  discrepancies,
  auditLogs,
  onReconcileDiscrepancy,
  onRaiseOfficialActa
}) => {
  const [subTab, setSubTab] = useState<'alertas' | 'bitacora_zonal'>('alertas');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDiscrepancyId, setSelectedDiscrepancyId] = useState<string>(discrepancies[0]?.id || '');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const selectedDiscrepancy = discrepancies.find((d) => d.id === selectedDiscrepancyId) || discrepancies[0];

  const filteredDiscrepancies = discrepancies.filter((d) => {
    const matchesZone = selectedZone === 'ALL' || d.zoneId === selectedZone;
    const matchesStatus = selectedStatus === 'ALL' || d.status === selectedStatus;
    const matchesSearch = 
      d.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.nsnCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.locationNode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesZone && matchesStatus && matchesSearch;
  });

  const filteredAuditLogs = auditLogs.filter((log) => {
    return selectedZone === 'ALL' || log.zoneId === selectedZone;
  });

  // Aggregated KPIs
  const totalFinancialAtRisk = discrepancies.reduce((acc, d) => acc + (d.status !== 'CONCILIADO' ? d.financialImpactMXN : 0), 0);
  const criticalCount = discrepancies.filter((d) => d.severity === 'CRITICA' && d.status !== 'CONCILIADO').length;
  const inInvestigationCount = discrepancies.filter((d) => d.status === 'EN_INVESTIGACION').length;
  const reconciledCount = discrepancies.filter((d) => d.status === 'CONCILIADO').length;

  const handleReconcile = (d: InventoryDiscrepancy) => {
    onReconcileDiscrepancy(d.id, d.physicalCount);
    setActionNotice(`Inventario conciliado con éxito para ${d.itemName} (${d.id}). Saldo del sistema ajustado a ${d.physicalCount} ${d.unit}.`);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleActa = (d: InventoryDiscrepancy) => {
    onRaiseOfficialActa(d.id, 'Acta de Hechos formal levantada por mando para procedimiento administrativo.');
    setActionNotice(`Acta de Hechos Militar ratificada para ${d.id}. Notificación enviada al Órgano Interno de Control.`);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const getSeverityBadge = (sev: InventoryDiscrepancy['severity']) => {
    switch (sev) {
      case 'CRITICA':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800 border border-rose-300">CRÍTICA</span>;
      case 'ALTA':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-100 text-amber-800 border border-amber-300">ALTA</span>;
      case 'MODERADA':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-100 text-blue-900 border border-blue-300">MODERADA</span>;
      case 'LEVE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-300">LEVE</span>;
    }
  };

  const getStatusBadge = (status: InventoryDiscrepancy['status']) => {
    switch (status) {
      case 'EN_INVESTIGACION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-100 text-amber-900 border border-amber-300">EN INVESTIGACIÓN</span>;
      case 'ACTA_LEVANTADA':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-900 border border-rose-300">ACTA DE HECHOS</span>;
      case 'CONCILIADO':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">CONCILIADO</span>;
      case 'JUSTIFICADO_MERMA':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-100 text-blue-900 border border-blue-300">MERMA JUSTIFICADA</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-900 uppercase tracking-widest font-bold">
            <Scale className="w-3.5 h-3.5 text-blue-800" />
            <span>AUDITORÍA & CONTROL // DISCREPANCIAS DE INVENTARIO</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Dashboard Administrativo de Discrepancias & Bitácora de Auditoría Zonal
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Cotejo sistemático entre registros del sistema central y conteos físicos en pañoles y almacenes. Detección inmediata de faltantes, sobrantes y acceso directo a la bitácora de auditoría de cada nodo zonal naval.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 rounded-lg self-start">
          <button
            onClick={() => setSubTab('alertas')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
              subTab === 'alertas'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Alertas de Discrepancias ({discrepancies.length})
          </button>
          <button
            onClick={() => setSubTab('bitacora_zonal')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
              subTab === 'bitacora_zonal'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bitácora de Auditoría Zonal ({auditLogs.length})
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded border border-emerald-300 bg-emerald-50 text-xs text-emerald-900 font-mono font-medium flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono font-semibold">
            <DollarSign className="w-3.5 h-3.5 text-rose-700" />
            <span>IMPACTO EN RIESGO</span>
          </div>
          <div className="text-xl font-bold text-rose-700 font-mono tabular-nums mt-1">
            ${totalFinancialAtRisk.toLocaleString('es-MX')} MXN
          </div>
          <div className="text-[10px] text-slate-500">Monto observado no conciliado</div>
        </div>

        <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono font-semibold">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            <span>DISCREPANCIAS CRÍTICAS</span>
          </div>
          <div className="text-xl font-bold text-amber-800 font-mono tabular-nums mt-1">
            {criticalCount} Alertas
          </div>
          <div className="text-[10px] text-slate-500">Requieren intervención de mando</div>
        </div>

        <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono font-semibold">
            <Clock className="w-3.5 h-3.5 text-blue-800" />
            <span>EN INVESTIGACIÓN</span>
          </div>
          <div className="text-xl font-bold text-blue-900 font-mono tabular-nums mt-1">
            {inInvestigationCount} Casos
          </div>
          <div className="text-[10px] text-slate-500">Cotejo de remisiones y garita</div>
        </div>

        <div className="p-3 rounded-lg border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>CONCILIADAS / CERRADAS</span>
          </div>
          <div className="text-xl font-bold text-emerald-800 font-mono tabular-nums mt-1">
            {reconciledCount} Regularizadas
          </div>
          <div className="text-[10px] text-slate-500">Ajuste avalado por auditoría</div>
        </div>
      </div>

      {/* SUBTAB 1: DISCREPANCY ALERTS */}
      {subTab === 'alertas' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por artículo, código OTAN NSN, pañol o folio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 font-sans"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono"
              >
                <option value="ALL">Todas las Regiones Navales</option>
                <option value="RN-1">RN-1 (Golfo Norte - Tuxpan)</option>
                <option value="RN-2">RN-2 (Pacífico Norte - Ensenada)</option>
                <option value="RN-3">RN-3 (Caribe - Chetumal)</option>
                <option value="RN-4">RN-4 (Pacífico Centro - Mazatlán)</option>
                <option value="RN-5">RN-5 (Pacífico Sur - Salina Cruz)</option>
                <option value="RN-6">RN-6 (Sonda Campeche - Carmen)</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="EN_INVESTIGACION">En Investigación</option>
                <option value="ACTA_LEVANTADA">Acta Levantada</option>
                <option value="CONCILIADO">Conciliado</option>
                <option value="JUSTIFICADO_MERMA">Merma Justificada</option>
              </select>
            </div>
          </div>

          {/* Table of Discrepancies */}
          <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-mono text-[11px] border-b border-slate-200 uppercase font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Folio Alerta</th>
                    <th className="py-2.5 px-3">Suministro OTAN</th>
                    <th className="py-2.5 px-3">Nodo Zonal / Pañol</th>
                    <th className="py-2.5 px-3 text-right">Sistema</th>
                    <th className="py-2.5 px-3 text-right">Conteo Físico</th>
                    <th className="py-2.5 px-3 text-right">Diferencia</th>
                    <th className="py-2.5 px-3 text-right">Impacto MXN</th>
                    <th className="py-2.5 px-3 text-center">Severidad</th>
                    <th className="py-2.5 px-3 text-center">Estado Auditoría</th>
                    <th className="py-2.5 px-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-900">
                  {filteredDiscrepancies.map((disc) => {
                    const isSelected = disc.id === selectedDiscrepancyId;
                    const isMissing = disc.differenceQty < 0;

                    return (
                      <tr
                        key={disc.id}
                        onClick={() => setSelectedDiscrepancyId(disc.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50/70 font-semibold' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-mono text-blue-900 font-bold whitespace-nowrap">
                          {disc.id}
                        </td>
                        <td className="py-2.5 px-3 max-w-xs">
                          <div className="font-bold text-slate-900 truncate">{disc.itemName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{disc.nsnCode} · Partida {disc.partidaGasto}</div>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="text-slate-900 font-medium">{disc.zoneName}</div>
                          <div className="text-[10px] text-slate-500 font-mono truncate">{disc.locationNode}</div>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-700">
                          {disc.systemStock}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-900 font-bold">
                          {disc.physicalCount}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                          <span className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                            isMissing ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {disc.differenceQty > 0 ? `+${disc.differenceQty}` : disc.differenceQty} {disc.unit.slice(0, 8)}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums font-bold text-slate-900">
                          ${disc.financialImpactMXN.toLocaleString('es-MX')}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {getSeverityBadge(disc.severity)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {getStatusBadge(disc.status)}
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          {disc.status !== 'CONCILIADO' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReconcile(disc);
                              }}
                              className="px-2 py-1 text-[11px] font-semibold bg-blue-900 hover:bg-blue-800 text-white rounded shadow-2xs transition-colors"
                            >
                              Conciliar
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-800 font-mono font-semibold">Resuelto</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Discrepancy Detail Inspector */}
          {selectedDiscrepancy && (
            <div className="rounded-lg border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-900 font-bold uppercase">
                    <FileText className="w-4 h-4 text-blue-800" />
                    <span>EXPEDIENTE DE AUDITORÍA MILITAR // {selectedDiscrepancy.id}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    {selectedDiscrepancy.itemName}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(selectedDiscrepancy.status)}
                  {selectedDiscrepancy.status !== 'CONCILIADO' && (
                    <>
                      <button
                        onClick={() => handleActa(selectedDiscrepancy)}
                        className="px-3 py-1 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded transition-colors shadow-2xs"
                      >
                        Ratificar Acta
                      </button>
                      <button
                        onClick={() => handleReconcile(selectedDiscrepancy)}
                        className="px-3 py-1 text-xs font-semibold bg-blue-900 hover:bg-blue-800 text-white rounded transition-colors shadow-2xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ajustar Saldo del Sistema</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1">
                  <span className="text-slate-500 font-semibold block text-[10px]">UBICACIÓN FÍSICA Y NODO:</span>
                  <div className="text-slate-900 font-bold">{selectedDiscrepancy.zoneName}</div>
                  <div className="text-slate-700">{selectedDiscrepancy.locationNode}</div>
                  <div className="text-[10px] text-slate-500 pt-1">
                    Última Inspección: {selectedDiscrepancy.lastAuditDate}
                  </div>
                </div>

                <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1">
                  <span className="text-slate-500 font-semibold block text-[10px]">BALANCE FÍSICO VS SISTEMA:</span>
                  <div className="text-slate-700">En Sistema: <span className="font-bold text-slate-900">{selectedDiscrepancy.systemStock} {selectedDiscrepancy.unit}</span></div>
                  <div className="text-slate-700">Conteo Real: <span className="font-bold text-blue-900">{selectedDiscrepancy.physicalCount} {selectedDiscrepancy.unit}</span></div>
                  <div className="text-rose-700 font-bold pt-1">
                    Diferencia Neta: {selectedDiscrepancy.differenceQty} {selectedDiscrepancy.unit}
                  </div>
                </div>

                <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1">
                  <span className="text-slate-500 font-semibold block text-[10px]">IMPACTO ECONÓMICO:</span>
                  <div className="text-slate-700">Costo Unitario: ${selectedDiscrepancy.unitCost.toLocaleString('es-MX')}</div>
                  <div className="text-sm font-bold text-rose-700">
                    ${selectedDiscrepancy.financialImpactMXN.toLocaleString('es-MX')} MXN
                  </div>
                  <div className="text-[10px] text-slate-500 pt-1">
                    Partida Afectada: {selectedDiscrepancy.partidaGasto}
                  </div>
                </div>

                <div className="p-3 rounded border border-slate-200 bg-slate-50 space-y-1">
                  <span className="text-slate-500 font-semibold block text-[10px]">AUDITOR RESPONSABLE:</span>
                  <div className="text-slate-900 font-bold">{selectedDiscrepancy.auditorOfficer}</div>
                  <div className="text-slate-600">Folio: {selectedDiscrepancy.folioActa}</div>
                  <div className="text-[10px] text-emerald-800 font-semibold pt-1">
                    Firma Biométrica Registrada
                  </div>
                </div>
              </div>

              {/* Investigation Notes */}
              <div className="p-3.5 rounded border border-slate-200 bg-slate-50/80 font-mono text-xs text-slate-800 space-y-1">
                <div className="text-[10px] text-slate-500 uppercase font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Dictamen y Notas de la Inspección Ocular:</span>
                </div>
                <p className="text-slate-900 font-sans leading-relaxed pt-1">
                  {selectedDiscrepancy.investigationNotes}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: ZONAL AUDIT LOGBOOK */}
      {subTab === 'bitacora_zonal' && (
        <div className="space-y-4">
          {/* Quick Zonal Node Selector Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {[
              { id: 'ALL', name: 'Todas las Zonas', location: 'Mando General', alerts: discrepancies.length },
              { id: 'RN-1', name: 'RN-1 Tuxpan', location: 'Golfo Norte', alerts: discrepancies.filter((d) => d.zoneId === 'RN-1').length },
              { id: 'RN-2', name: 'RN-2 Ensenada', location: 'Pacífico Norte', alerts: discrepancies.filter((d) => d.zoneId === 'RN-2').length },
              { id: 'RN-3', name: 'RN-3 Chetumal', location: 'Caribe', alerts: discrepancies.filter((d) => d.zoneId === 'RN-3').length },
              { id: 'RN-4', name: 'RN-4 Mazatlán', location: 'Pacífico Centro', alerts: discrepancies.filter((d) => d.zoneId === 'RN-4').length },
              { id: 'RN-5', name: 'RN-5 Salina Cruz', location: 'Pacífico Sur', alerts: discrepancies.filter((d) => d.zoneId === 'RN-5').length }
            ].map((zone) => (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  selectedZone === zone.id
                    ? 'border-blue-800 bg-blue-50/80 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                  <span className="font-bold text-blue-900">{zone.id}</span>
                  {zone.alerts > 0 ? (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {zone.alerts}
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </div>
                <div className="text-xs font-bold text-slate-900 truncate">{zone.name}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{zone.location}</div>
              </button>
            ))}
          </div>

          {/* Audit Log Entries List */}
          <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="text-xs font-mono text-blue-900 uppercase font-bold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-800" />
                <span>Asientos Oficiales de la Bitácora de Auditoría Zonal</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {filteredAuditLogs.length} Asientos Registrados
              </span>
            </div>

            <div className="space-y-3">
              {filteredAuditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded border border-slate-200 bg-slate-50/70 space-y-2 hover:border-blue-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-900">{log.id}</span>
                      <span className="text-slate-400">·</span>
                      <span className="font-semibold text-slate-800">{log.zoneName}</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {log.timestamp}
                    </div>
                  </div>

                  <div className="text-sm font-bold text-slate-900">
                    {log.actionTaken}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200/80 text-[11px] font-mono text-slate-700">
                    <div>
                      <span className="text-slate-500 block">Bien Involucrado:</span>
                      <span className="font-semibold text-slate-900">{log.affectedItem}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Tipo de Resolución:</span>
                      <span className="font-bold text-blue-900">{log.resolutionType.replace(/_/g, ' ')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Auditor Actuante:</span>
                      <span>{log.auditorName} ({log.auditorRank})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Fingerprint className="w-3.5 h-3.5 text-blue-800" />
                      <span>Sello Digital: {log.shaHash}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      log.status === 'CERRADA'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.status === 'RATIFICADA_MANDO'
                        ? 'bg-blue-100 text-blue-900'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      ESTADO: {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
