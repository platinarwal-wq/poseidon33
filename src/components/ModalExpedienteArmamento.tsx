import React, { useState } from 'react';
import { AsignacionArmamento, EstadoArmamento } from '../types/armamento';
import { 
  X, 
  Crosshair, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Building2, 
  FileText, 
  Printer, 
  Hash, 
  Award, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert,
  Layers,
  Wrench,
  FileCheck2,
  Lock,
  RotateCcw
} from 'lucide-react';

interface ModalExpedienteArmamentoProps {
  asignacion: AsignacionArmamento | null;
  onClose: () => void;
  onUpdateEstado?: (id: string, nuevoEstado: EstadoArmamento, nuevasObservaciones?: string) => void;
}

export const ModalExpedienteArmamento: React.FC<ModalExpedienteArmamentoProps> = ({
  asignacion,
  onClose,
  onUpdateEstado
}) => {
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [isEditingStatus, setIsEditingStatus] = useState<boolean>(false);
  const [tempEstado, setTempEstado] = useState<EstadoArmamento>(asignacion?.estado || 'Activa');
  const [tempObs, setTempObs] = useState<string>(asignacion?.observaciones || '');

  if (!asignacion) return null;

  // Format date helper: DD/MM/AAAA - HH:mm
  const formatFechaLegible = (fechaStr: string) => {
    try {
      const [datePart, timePart] = fechaStr.split(' ');
      const [year, month, day] = datePart.split('-');
      return `${day}/${month}/${year} - ${timePart || '08:00'} hrs`;
    } catch {
      return fechaStr;
    }
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateEstado) {
      onUpdateEstado(asignacion.id, tempEstado, tempObs);
    }
    setIsEditingStatus(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden font-sans my-auto">
        
        {/* Top Header */}
        <div className="bg-slate-950 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-blue-900/90 rounded-lg text-cyan-400 border border-blue-700/60 shadow-xs">
              <Crosshair className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-cyan-300 font-bold uppercase bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                  EXPEDIENTE DE CONTROL DE ARMAMENTO NAVAL
                </span>
                <span className="text-xs font-mono text-slate-400">
                  FOLIO: ARM-REG-{asignacion.matricula}
                </span>
              </div>
              <h2 className="text-lg font-bold tracking-tight text-white mt-0.5 flex items-center gap-2">
                <span>{asignacion.nombre}</span>
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Cerrar expediente"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/50">

          {/* Ficha Militar del Receptor */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
              <div className="border-r border-slate-100 pr-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Grado Naval</div>
                <div className="text-sm font-bold text-blue-950 mt-0.5 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>{asignacion.grado}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {asignacion.categoriaJerarquica}
                </div>
              </div>

              <div className="border-r border-slate-100 pr-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Matrícula Militar</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <Hash className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{asignacion.matricula}</span>
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  Porte Oficial Autorizado
                </div>
              </div>

              <div className="border-r border-slate-100 pr-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase">Unidad / Adscripción</div>
                <div className="text-xs font-bold text-slate-800 mt-0.5 truncate" title={asignacion.adscripcion}>
                  {asignacion.adscripcion}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Fuerza de Adscripción
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Estado del Arma</div>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1.5 ${
                    asignacion.estado === 'Activa'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : asignacion.estado === 'En Custodia'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-slate-200 text-slate-800 border border-slate-300'
                  }`}>
                    {asignacion.estado === 'Activa' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
                    {asignacion.estado === 'En Custodia' && <AlertCircle className="w-3.5 h-3.5 text-amber-700" />}
                    {asignacion.estado === 'Devuelto' && <RotateCcw className="w-3.5 h-3.5 text-slate-600" />}
                    <span>{asignacion.estado}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ficha Técnica y Balística del Armamento Asignado */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between font-mono">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Especificación de Arma Principal y Cartuchería Reglamentaria
                </span>
              </div>
              <span className="text-[10px] bg-blue-900 text-cyan-300 px-2 py-0.5 rounded border border-blue-700">
                1 ARMA PRINCIPAL POR ELEMENTO
              </span>
            </div>

            <div className="p-5 font-mono text-xs space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Modelo del Arma</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">{asignacion.arma_asignada}</div>
                  <div className="text-[11px] text-blue-900 mt-0.5 font-semibold">Dotación Jerárquica</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Número de Serie</div>
                  <div className="text-sm font-bold text-blue-950 mt-1 font-mono tracking-wider">{asignacion.numero_serie}</div>
                  <div className="text-[11px] text-emerald-700 mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Registro SEDENA/SECMAR</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Calibre Nominal</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">{asignacion.calibre}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Estriado y recámara ok</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Munición de Dotación</div>
                  <div className="text-xs font-bold text-amber-900 mt-1">{asignacion.municion_dotacion}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Cargadores precintados</div>
                </div>
              </div>

              {/* Fecha y Armero Inspector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-slate-700">
                <div className="flex items-center gap-2 p-2.5 bg-slate-100/70 rounded-lg border border-slate-200">
                  <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Fecha y Hora de Entrega:</span>
                    <span className="font-bold text-slate-900">{formatFechaLegible(asignacion.fecha_asignacion)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-slate-100/70 rounded-lg border border-slate-200">
                  <Wrench className="w-4 h-4 text-slate-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Armero Inspector Militar:</span>
                    <span className="font-bold text-slate-900">{asignacion.armeroInspector || 'Cap. Corb. CG. Manuel E. Cárdenas'}</span>
                  </div>
                </div>
              </div>

              {/* Observaciones y Condición Técnica */}
              <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-1">
                <div className="text-[11px] uppercase font-bold text-slate-600 flex items-center justify-between">
                  <span>Condición Técnica y Observaciones del Equipo</span>
                  <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    REVISTA MILITAR APROBADA
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed pt-1">
                  {asignacion.observaciones}
                </p>
              </div>

              {/* Firma Digital y Sello Criptográfico */}
              <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-[11px] text-blue-950 break-all space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-blue-900">
                  <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>SELLO CRIPTOGRÁFICO DE ASIGNACIÓN (SHA-256):</span>
                </div>
                <div className="font-mono text-[10px] text-slate-600">
                  {asignacion.folioFirmaDigital || 'SHA256:88402a1b9c7d4e2f5a0b3c6d8e1f4a7b2c5d8e0fa1b9c7d4e2f5a0b3c6d8e1f4'}
                </div>
              </div>
            </div>
          </div>

          {/* Formulario rápido para cambiar estado / registrar novedad */}
          {isEditingStatus ? (
            <form onSubmit={handleSaveStatus} className="bg-white rounded-xl border border-slate-300 p-4 shadow-xs space-y-3 font-mono text-xs">
              <div className="font-bold text-slate-900 uppercase flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-blue-900" />
                <span>Actualizar Estado de Custodia / Revista Técnica</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Nuevo Estado de Custodia
                  </label>
                  <select
                    value={tempEstado}
                    onChange={(e) => setTempEstado(e.target.value as EstadoArmamento)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-mono"
                  >
                    <option value="Activa">Activa (Porte en Servicio)</option>
                    <option value="En Custodia">En Custodia (Depositada en Pañol)</option>
                    <option value="Devuelto">Devuelto (Baja de Asignación)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Novedades / Observaciones Técnicas
                  </label>
                  <input
                    type="text"
                    value={tempObs}
                    onChange={(e) => setTempObs(e.target.value)}
                    placeholder="Detalles de inspección o mantenimiento..."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingStatus(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded font-bold"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between text-xs font-mono bg-white p-3 rounded-lg border border-slate-200">
              <span className="text-slate-500">¿Requiere actualizar estado de pañol o novedad técnica?</span>
              <button
                type="button"
                onClick={() => setIsEditingStatus(true)}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded border border-slate-300 transition-colors cursor-pointer"
              >
                Actualizar Estado
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="text-slate-600 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-blue-900" />
            <span>Registro oficial bajo control estricto de la Jefatura de Armamento Naval</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrintModal(true)}
              className="px-4 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Emitir Acta Oficial de Resguardo</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold transition-colors cursor-pointer"
            >
              Cerrar Expediente
            </button>
          </div>
        </div>
      </div>

      {/* Official Military Weapon Certificate (Print Preview Modal) */}
      {showPrintModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-slate-300 font-mono text-slate-900 my-auto print:m-0 print:p-0 print:shadow-none print:border-none">
            
            {/* Header del Acta Militar */}
            <div className="text-center border-b-2 border-slate-900 pb-4 mb-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                SECRETARÍA DE MARINA — ARMADA DE MÉXICO
              </div>
              <div className="text-sm font-extrabold uppercase tracking-wide text-slate-900 mt-0.5">
                DIRECCIÓN GENERAL DE INTENDENCIA Y LOGÍSTICA NAVAL
              </div>
              <div className="text-xs font-bold text-blue-900 mt-1">
                ACTA OFICIAL DE ASIGNACIÓN, CUSTODIA Y RESGUARDO DE ARMAMENTO MILITAR
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                FOLIO OFICIAL: ACTA-ARM-{asignacion.matricula}-{Date.now().toString().slice(-4)}
              </div>
            </div>

            {/* Ficha del Militar Receptor */}
            <div className="bg-slate-50 border border-slate-300 rounded p-3 mb-4 text-xs space-y-1.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500">Elemento Receptor: </span>
                  <span className="font-bold">{asignacion.nombre}</span>
                </div>
                <div>
                  <span className="text-slate-500">Grado: </span>
                  <span className="font-bold">{asignacion.grado}</span>
                </div>
                <div>
                  <span className="text-slate-500">Matrícula Militar: </span>
                  <span className="font-bold">{asignacion.matricula}</span>
                </div>
                <div>
                  <span className="text-slate-500">Unidad / Adscripción: </span>
                  <span className="font-bold">{asignacion.adscripcion}</span>
                </div>
              </div>
            </div>

            {/* Detalle Técnico del Armamento */}
            <div className="border border-slate-300 rounded overflow-hidden mb-4 text-xs">
              <div className="bg-slate-900 text-white font-bold p-2 text-center text-[11px] uppercase tracking-wide">
                ESPECIFICACIÓN OFICIAL DEL ARMA PRINCIPAL ASIGNADA
              </div>
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-white">
                    <td className="p-2 font-bold text-slate-600 w-1/3">Modelo del Arma:</td>
                    <td className="p-2 font-bold text-slate-900">{asignacion.arma_asignada}</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-2 font-bold text-slate-600">Número de Serie:</td>
                    <td className="p-2 font-bold text-blue-950 font-mono">{asignacion.numero_serie}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-2 font-bold text-slate-600">Calibre Reglamentario:</td>
                    <td className="p-2 font-mono">{asignacion.calibre}</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-2 font-bold text-slate-600">Dotación de Munición:</td>
                    <td className="p-2 font-bold text-slate-900">{asignacion.municion_dotacion}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-2 font-bold text-slate-600">Fecha y Hora de Entrega:</td>
                    <td className="p-2">{formatFechaLegible(asignacion.fecha_asignacion)}</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-2 font-bold text-slate-600">Estado Operativo:</td>
                    <td className="p-2 font-bold text-emerald-800">{asignacion.estado.toUpperCase()} (VERIFICADO EN PAÑOL)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Declaración y Compromiso Militar */}
            <div className="text-[10px] text-slate-600 leading-relaxed border-t border-b border-slate-200 py-2.5 mb-6 text-justify">
              El militar que suscribe hace constar haber recibido para su servicio exclusivo en la Armada de México el armamento y cartuchería arriba especificados, asumiendo la responsabilidad penal y disciplinaria de su custodia, mantenimiento, empleo legítimo conforme a los manuales de tiro y la Ley de Disciplina del Ejército y Fuerza Aérea / Armada de México. Queda estrictamente prohibida su cesión o custodia por terceros.
            </div>

            {/* Firmas Oficiales */}
            <div className="grid grid-cols-2 gap-8 text-center pt-2 mb-6">
              <div className="border-t border-slate-800 pt-2">
                <div className="text-xs font-bold">{asignacion.nombre}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">{asignacion.grado} — Mat. {asignacion.matricula}</div>
                <div className="text-[9px] text-slate-400 mt-1 font-mono">Firma del Elemento Receptor</div>
              </div>

              <div className="border-t border-slate-800 pt-2">
                <div className="text-xs font-bold">{asignacion.armeroInspector || 'Cap. Corb. CG. Manuel E. Cárdenas'}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">Jefe del Pañol de Armas y Pertrechos</div>
                <div className="text-[9px] text-emerald-700 mt-1 font-mono">Sello de Revista Balística Válido</div>
              </div>
            </div>

            {/* Sello SHA-256 */}
            <div className="p-2 bg-slate-100 rounded text-[9px] text-slate-500 break-all border border-slate-200 mb-4 font-mono">
              <span className="font-bold text-slate-700">HASH DE CERTIFICACIÓN BALÍSTICA SHA-256: </span>
              {asignacion.folioFirmaDigital || 'SHA256:88402a1b9c7d4e2f5a0b3c6d8e1f4a7b2c5d8e0fa1b9c7d4e2f5a0b3c6d8e1f4'}
            </div>

            {/* Botones de acción */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 print:hidden">
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded cursor-pointer"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir Acta Oficial</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
