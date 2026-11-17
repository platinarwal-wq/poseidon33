import React, { useState } from 'react';
import { 
  MilitaryCredential, 
  SerializedItem 
} from '../types/naval';
import { 
  Shield, 
  CreditCard, 
  QrCode, 
  CheckCircle2, 
  AlertOctagon, 
  Search, 
  User, 
  FileSignature, 
  Fingerprint,
  Box
} from 'lucide-react';

interface ModuleCustodyProps {
  personnel: MilitaryCredential[];
  serializedStock: SerializedItem[];
  onAuthorizeEntitlement: (militaryId: string, itemCategory: string) => void;
}

export const ModuleCustody: React.FC<ModuleCustodyProps> = ({
  personnel,
  serializedStock,
  onAuthorizeEntitlement
}) => {
  const [selectedPersonnelId, setSelectedPersonnelId] = useState<string>(personnel[0].militaryId);
  const [nfcSimulating, setNfcSimulating] = useState(false);
  const [searchSerial, setSearchSerial] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'danger' } | null>(null);

  const currentPersonnel = personnel.find((p) => p.militaryId === selectedPersonnelId) || personnel[0];

  const handleSimulateNFC = (person: MilitaryCredential) => {
    setNfcSimulating(true);
    setTimeout(() => {
      setSelectedPersonnelId(person.militaryId);
      setNfcSimulating(false);
      setStatusMessage({
        text: `Lectura NFC completada: Credencial Militar ${person.militaryId} (${person.fullName}) verificada con chip UID: ${person.nfcChipUid}.`,
        type: 'success'
      });
      setTimeout(() => setStatusMessage(null), 5000);
    }, 600);
  };

  const handleDeliver = (category: string, itemStatus: string) => {
    if (itemStatus === 'BLOQUEADO_POR_TIEMPO') {
      setStatusMessage({
        text: `¡DENEGADO POR AUDITORÍA MILITAR! El elemento no cumple con el periodo reglamentario mínimo. Duplicidad o desvío bloqueado automáticamente.`,
        type: 'danger'
      });
      return;
    }

    onAuthorizeEntitlement(currentPersonnel.militaryId, category);
    setStatusMessage({
      text: `Entrega nominal validada y autorizada para ${currentPersonnel.fullName}. Acta digital registrada con firma militar.`,
      type: 'success'
    });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const filteredStock = serializedStock.filter((s) => 
    s.serialNumber.toLowerCase().includes(searchSerial.toLowerCase()) ||
    s.itemType.toLowerCase().includes(searchSerial.toLowerCase()) ||
    s.lotNumber.toLowerCase().includes(searchSerial.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-900 uppercase tracking-widest font-bold">
            <Shield className="w-3.5 h-3.5 text-blue-800" />
            <span>MÓDULO III // CADENA DE CUSTODIA & AUDITORÍA NOMINAL</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Control de Inventarios, Dotación Nominal NFC y Stock Serializado
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Trazabilidad completa de 6 eslabones desde la compra hasta el elemento naval, validación nominal estricta por chip militar para evitar duplicidades o desvíos, y serialización DataMatrix/RFID.
          </p>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded border text-xs font-mono font-medium flex items-center gap-2.5 shadow-xs ${
            statusMessage.type === 'danger'
              ? 'border-rose-300 bg-rose-50 text-rose-900'
              : 'border-emerald-300 bg-emerald-50 text-emerald-900'
          }`}
        >
          {statusMessage.type === 'danger' ? (
            <AlertOctagon className="w-4 h-4 text-rose-700 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* SECTION 1: 6-STEP CUSTODY CHAIN PIPELINE VISUALIZER */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <div className="text-xs font-mono text-blue-900 uppercase font-bold flex items-center gap-2">
            <Box className="w-4 h-4 text-blue-800" />
            <span>Cadena de Custodia Militar (6 Eslabones Reglamentarios de Trazabilidad)</span>
          </div>
          <span className="text-xs text-slate-500 font-mono">Protocolo OTAN STANAG 4370</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {[
            { step: 1, name: '1. Requisición', desc: 'Validación técnica y justificación de demanda operativa', code: 'REQ-01' },
            { step: 2, name: '2. Compra / Licitación', desc: 'Comité técnico y afectación de partida presupuestal', code: 'LIC-02' },
            { step: 3, name: '3. Fabricación Maestranza', desc: 'Explosión de BOM, manufactura y control de calidad', code: 'MFG-03' },
            { step: 4, name: '4. Almacén General', desc: 'Recepción formal, inspección y grabado DataMatrix', code: 'ALM-04' },
            { step: 5, name: '5. Pañol de Unidad', desc: 'Custodia en buque o batallón de infantería', code: 'PAN-05' },
            { step: 6, name: '6. Elemento Naval', desc: 'Entrega nominal con lectura NFC y firma biométrica', code: 'NOM-06' }
          ].map((item) => (
            <div
              key={item.step}
              className="p-3 rounded border border-slate-200 bg-slate-50/70 space-y-1 relative group hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-blue-900 font-bold">
                <span>{item.code}</span>
                <span className="w-2 h-2 rounded-full bg-blue-900" />
              </div>
              <div className="text-xs font-bold text-slate-900 mt-1">{item.name}</div>
              <div className="text-[10px] text-slate-600 leading-tight">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: NFC MILITARY CREDENTIAL & NOMINAL ENDOWMENT VALIDATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Credential Selector & NFC Simulator */}
        <div className="lg:col-span-5 rounded-lg border border-slate-200 bg-white p-4 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="text-xs font-mono text-blue-900 uppercase font-bold flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-800" />
              <span>Lector de Credencial Militar NFC / Chip</span>
            </div>
            <span className="text-[11px] text-emerald-800 font-mono font-semibold">Sensor Activo</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-600 block font-medium">
              Seleccionar Elemento Naval para Validación:
            </label>
            <div className="space-y-2">
              {personnel.map((p) => {
                const isSelected = p.militaryId === selectedPersonnelId;
                return (
                  <button
                    key={p.militaryId}
                    onClick={() => setSelectedPersonnelId(p.militaryId)}
                    className={`w-full p-2.5 rounded border text-left transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'border-blue-800 bg-blue-50/70 text-slate-900'
                        : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{p.fullName}</div>
                      <div className="text-[11px] text-slate-600 font-mono">
                        {p.rank} · ID: {p.militaryId}
                      </div>
                    </div>
                    <div className="text-right font-mono text-[10px] text-blue-900 font-semibold">
                      NFC: {p.nfcChipUid.slice(0, 8)}...
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick NFC Scan Button */}
          <button
            onClick={() => handleSimulateNFC(currentPersonnel)}
            disabled={nfcSimulating}
            className="w-full py-2 px-3 rounded bg-slate-100 hover:bg-slate-200 text-blue-950 text-xs font-mono font-bold border border-slate-300 transition-colors flex items-center justify-center gap-2 shadow-2xs"
          >
            <Fingerprint className="w-4 h-4 text-blue-900" />
            <span>{nfcSimulating ? 'Validando UID de Chip...' : 'Simular Lectura de Chip NFC'}</span>
          </button>

          {/* Physical ID Preview */}
          <div className="p-3.5 rounded border border-slate-300 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-900 relative overflow-hidden font-mono shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-300 pb-2 mb-2 text-[10px] text-slate-600 font-semibold">
              <span>ARMADA // CREDENCIAL DE IDENTIDAD MILITAR</span>
              <span className="text-blue-900">CHIP ACTIVO</span>
            </div>
            <div className="flex gap-3">
              <div className="w-16 h-20 bg-white border border-slate-300 rounded flex flex-col items-center justify-center text-center p-1 shadow-2xs">
                <User className="w-8 h-8 text-slate-500" />
                <span className="text-[8px] text-slate-600 mt-1 leading-tight font-bold">{currentPersonnel.photoPlaceholder}</span>
              </div>
              <div className="flex-1 text-xs space-y-1">
                <div className="font-bold text-slate-900 text-sm font-sans">{currentPersonnel.fullName}</div>
                <div className="text-blue-900 text-[11px] font-bold">{currentPersonnel.rank}</div>
                <div className="text-[10px] text-slate-600">ID Militar: <span className="text-slate-900 font-bold">{currentPersonnel.militaryId}</span></div>
                <div className="text-[10px] text-slate-600">Unidad: <span className="text-slate-900 font-medium truncate block">{currentPersonnel.unit}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Nominal Entitlements & Duplicity Rule Engine */}
        <div className="lg:col-span-7 rounded-lg border border-slate-200 bg-white p-4 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="text-xs font-mono text-blue-900 uppercase font-bold flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-blue-800" />
              <span>Matriz de Dotaciones Reglamentarias & Reglas Anti-Duplicidad</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">Reglamento de Intendencia</span>
          </div>

          <div className="space-y-3">
            {currentPersonnel.entitlements.map((ent, idx) => {
              const isBlocked = ent.status === 'BLOQUEADO_POR_TIEMPO';
              const remainingMonths = Math.max(0, ent.minCycleMonths - ent.currentCycleElapsedMonths);

              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded border text-xs space-y-2.5 ${
                    isBlocked
                      ? 'border-amber-300 bg-amber-50/50'
                      : 'border-emerald-300 bg-emerald-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                        {ent.category}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm">{ent.item}</h4>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isBlocked
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {isBlocked ? 'BLOQUEADO POR TIEMPO' : 'APTO PARA DOTACIÓN'}
                    </span>
                  </div>

                  {/* Progress & rules */}
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-1 text-slate-700">
                    <div>
                      <span className="text-slate-500 block">Última Dotación:</span>
                      <span className="font-medium text-slate-900">{ent.lastDeliveredDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Tiempo Transcurrido:</span>
                      <span className="font-bold text-slate-900">{ent.currentCycleElapsedMonths.toFixed(1)} meses</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Ciclo Reglamentario:</span>
                      <span className="font-medium text-slate-900">{ent.minCycleMonths} meses</span>
                    </div>
                  </div>

                  {isBlocked ? (
                    <div className="text-[11px] text-amber-900 bg-amber-100/70 p-2 rounded border border-amber-300 font-mono flex items-center justify-between font-medium">
                      <span>Restan {remainingMonths.toFixed(1)} meses para nueva dotación legal.</span>
                      <span className="text-rose-700 font-bold">INTENTO DE DUPLICIDAD DETECTADO</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[11px] text-emerald-800 font-mono flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Cumple periodo reglamentario ({ent.currentCycleElapsedMonths.toFixed(1)} &gt;= {ent.minCycleMonths} meses).</span>
                      </div>
                      <button
                        onClick={() => handleDeliver(ent.category, ent.status)}
                        className="px-3 py-1 bg-blue-900 hover:bg-blue-800 text-white rounded font-bold text-xs transition-colors shadow-xs"
                      >
                        Autorizar Entrega Nominal
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 3: SERIALIZED STOCK (DATAMATRIX / RFID) */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-2 text-xs font-mono text-blue-900 uppercase font-bold">
            <QrCode className="w-4 h-4 text-blue-800" />
            <span>Inventario Serializado (DataMatrix / RFID de Alta Resistencia)</span>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar serie o lote..."
              value={searchSerial}
              onChange={(e) => setSearchSerial(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-300 rounded text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900 font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-mono text-[11px] border-b border-slate-200 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Código Serial (DataMatrix)</th>
                <th className="py-2.5 px-3">Bien / Activo Militar</th>
                <th className="py-2.5 px-3">Lote de Fabricación</th>
                <th className="py-2.5 px-3">Ubicación Física Actual</th>
                <th className="py-2.5 px-3 text-center">Eslabones Cumplidos</th>
                <th className="py-2.5 px-3 text-center">Estado Inspección</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-900">
              {filteredStock.map((stk) => {
                const completedSteps = stk.custodyChain.filter((c) => c.completed).length;
                return (
                  <tr key={stk.serialNumber} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 font-mono text-blue-900 font-bold whitespace-nowrap">
                      {stk.serialNumber}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{stk.itemType}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{stk.lotNumber}</td>
                    <td className="py-2.5 px-3 text-slate-700 font-mono text-[11px]">{stk.assignedLocation}</td>
                    <td className="py-2.5 px-3 text-center font-mono">
                      <span className="text-blue-900 font-bold">{completedSteps}</span> / 6
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        INSPECCIONADO MIL-STD
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
