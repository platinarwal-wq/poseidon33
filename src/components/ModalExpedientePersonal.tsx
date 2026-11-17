import React, { useState } from 'react';
import { PersonalMilitar, UniformeAsignado } from '../types/uniformes';
import { 
  X, 
  Shirt, 
  Printer, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Building2, 
  FileCheck2, 
  DollarSign, 
  QrCode, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  UserCheck,
  Award,
  Hash
} from 'lucide-react';

interface ModalExpedientePersonalProps {
  personal: PersonalMilitar | null;
  onClose: () => void;
  onAddUniform?: (militarId: string) => void;
}

export const ModalExpedientePersonal: React.FC<ModalExpedientePersonalProps> = ({
  personal,
  onClose,
  onAddUniform
}) => {
  const [showPrintReceipt, setShowPrintReceipt] = useState<boolean>(false);
  const [selectedUniformeForAcuse, setSelectedUniformeForAcuse] = useState<UniformeAsignado | null>(null);

  if (!personal) return null;

  // Format date helper: DD/MM/AAAA - HH:mm
  const formatFechaExacta = (isoDate: string) => {
    try {
      const d = new Date(isoDate);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} - ${hours}:${minutes} hrs`;
    } catch {
      return isoDate;
    }
  };

  const oficialesGratuitos = personal.asignaciones.filter(a => !a.esExcedenteNomina).length;
  const excedentesNomina = personal.asignaciones.filter(a => a.esExcedenteNomina).length;
  const totalMontoDescuento = personal.asignaciones
    .filter(a => a.esExcedenteNomina && a.deduccionNomina)
    .reduce((acc, curr) => acc + (curr.deduccionNomina?.montoUnitarioMXN || 0), 0);

  const handleOpenAcuse = (uniforme?: UniformeAsignado) => {
    setSelectedUniformeForAcuse(uniforme || personal.asignaciones[0] || null);
    setShowPrintReceipt(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden font-sans my-auto">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-blue-900/80 rounded-lg text-cyan-400 border border-blue-700/50">
              <Shirt className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-cyan-300 font-bold uppercase bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                  EXPEDIENTE INDIVIDUAL DE VESTUARIO
                </span>
                <span className="text-xs font-mono text-slate-400">
                  FOLIO: EXP-INT-{personal.matricula}
                </span>
              </div>
              <h2 className="text-lg font-bold tracking-tight text-white mt-0.5 flex items-center gap-2">
                <span>{personal.nombre}</span>
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">

          {/* Ficha Militar Superior */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border-r border-slate-100 pr-3">
                <div className="text-[11px] font-mono font-bold text-slate-400 uppercase">Grado Naval</div>
                <div className="text-sm font-bold text-blue-950 font-mono mt-0.5 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>{personal.grado}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Categoría: {personal.categoriaJerarquica}
                </div>
              </div>

              <div className="border-r border-slate-100 pr-3">
                <div className="text-[11px] font-mono font-bold text-slate-400 uppercase">Matrícula Militar</div>
                <div className="text-sm font-bold text-slate-900 font-mono mt-0.5 flex items-center gap-1.5">
                  <Hash className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>{personal.matricula}</span>
                </div>
                <div className="text-[11px] text-emerald-700 font-mono mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  Censo Nominal Activo
                </div>
              </div>

              <div className="border-r border-slate-100 pr-3">
                <div className="text-[11px] font-mono font-bold text-slate-400 uppercase">Zona / Adscripción</div>
                <div className="text-sm font-semibold text-slate-800 font-mono mt-0.5 flex items-center gap-1.5 truncate">
                  <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="truncate">{personal.adscripcion}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  Sector: {personal.zonaId}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-mono font-bold text-slate-400 uppercase">Estado de Dotación</div>
                <div className="mt-1 flex items-center gap-1.5">
                  {personal.cargoNomina ? (
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                      3 Uniformes (Cargo Nómina)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      2/2 Dotación Oficial
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">
                  Límite reglamentario gratuito: 2 piezas
                </div>
              </div>
            </div>
          </div>

          {/* Resumen Reglamentario de Cumplimiento */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3 text-emerald-950">
              <div className="text-[10px] uppercase font-bold text-emerald-800 flex items-center justify-between">
                <span>Dotación Reglamentaria</span>
                <span className="bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded text-[10px]">OFICIAL</span>
              </div>
              <div className="text-xl font-bold mt-1 text-emerald-900">
                {oficialesGratuitos} / 2 <span className="text-xs font-normal">Uniformes</span>
              </div>
              <div className="text-[11px] text-emerald-700 mt-0.5">
                100% Sin costo (Partida 27101)
              </div>
            </div>

            <div className={`rounded-lg p-3 border font-mono ${
              excedentesNomina > 0 
                ? 'bg-amber-50/80 border-amber-300 text-amber-950' 
                : 'bg-slate-100/60 border-slate-200 text-slate-600'
            }`}>
              <div className="text-[10px] uppercase font-bold flex items-center justify-between">
                <span>Pieza Excedente</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  excedentesNomina > 0 ? 'bg-amber-200 text-amber-900' : 'bg-slate-200 text-slate-700'
                }`}>
                  {excedentesNomina > 0 ? 'DEDUCCIÓN NÓMINA' : 'SIN EXCEDENTE'}
                </span>
              </div>
              <div className="text-xl font-bold mt-1">
                {excedentesNomina} <span className="text-xs font-normal">Pieza(s) adicional(es)</span>
              </div>
              <div className="text-[11px] mt-0.5">
                {excedentesNomina > 0 ? `Deducción autorizada por $${totalMontoDescuento.toLocaleString('es-MX')}.00 MXN` : 'Sin cargos a nómina activos'}
              </div>
            </div>

            <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 text-blue-950">
              <div className="text-[10px] uppercase font-bold text-blue-900 flex items-center justify-between">
                <span>Total Asignaciones</span>
                <span className="bg-blue-200 text-blue-900 px-1.5 py-0.2 rounded text-[10px]">HISTORIAL</span>
              </div>
              <div className="text-xl font-bold mt-1 text-blue-950">
                {personal.asignaciones.length} <span className="text-xs font-normal">Prendas registradas</span>
              </div>
              <div className="text-[11px] text-blue-800 mt-0.5">
                Última: {formatFechaExacta(personal.fechaUltimaDotacion)}
              </div>
            </div>
          </div>

          {/* Historial Detallado de Vestuario */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Shirt className="w-4 h-4 text-blue-900" />
                <h3 className="text-xs font-bold font-mono text-slate-900 uppercase tracking-wide">
                  Historial Detallado de Vestuario Naval ({personal.asignaciones.length} Piezas)
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Reglamento de Vestuario y Equipo de la Armada de México
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {personal.asignaciones.map((asig, index) => {
                const isExcedente = asig.esExcedenteNomina;
                return (
                  <div key={asig.idUniforme} className="p-4 hover:bg-slate-50/60 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0 mt-0.5 ${
                          isExcedente 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                            : 'bg-blue-100 text-blue-950 border border-blue-300'
                        }`}>
                          #{index + 1}
                        </span>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-bold text-slate-900 font-mono">
                              {asig.tipo}
                            </span>
                            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              Talla: {asig.talla}
                            </span>
                            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              Lote: {asig.codigoLote}
                            </span>
                          </div>

                          {/* Cargo Badge & Delivery Badge */}
                          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
                            {isExcedente ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                                <DollarSign className="w-3 h-3 text-amber-700" />
                                Cargo a Nómina ({asig.deduccionNomina?.estadoDeduccion || 'Deducción Registrada'})
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                                Dotación Oficial Reglamentaria (Gratuita)
                              </span>
                            )}

                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              asig.estatus === 'Entregado'
                                ? 'bg-slate-100 text-emerald-800 border border-emerald-300'
                                : asig.estatus === 'En Sastrería'
                                ? 'bg-blue-100 text-blue-900 border border-blue-300'
                                : asig.estatus === 'En Tránsito'
                                ? 'bg-purple-100 text-purple-900 border border-purple-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}>
                              Estatus: {asig.estatus}
                            </span>
                          </div>

                          {/* Detalles del Cargo a Nómina si aplica */}
                          {isExcedente && asig.deduccionNomina && (
                            <div className="bg-amber-50/70 border border-amber-200 rounded p-2.5 mt-2 font-mono text-xs text-amber-900 space-y-1">
                              <div className="font-bold text-[11px] text-amber-800 flex items-center gap-1.5">
                                <DollarSign className="w-3.5 h-3.5 text-amber-700" />
                                <span>REGISTRO DE DEDUCCIÓN EN SISTEMA DE NÓMINA NAVAL</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-700 pt-0.5">
                                <div>
                                  <span className="text-slate-500">Folio Descuento: </span>
                                  <span className="font-bold text-slate-900">{asig.deduccionNomina.folioDescuento}</span>
                                </div>
                                <div>
                                  <span className="text-slate-500">Monto Deducible: </span>
                                  <span className="font-bold text-amber-900">${asig.deduccionNomina.montoUnitarioMXN.toLocaleString('es-MX')}.00 MXN</span>
                                </div>
                                <div>
                                  <span className="text-slate-500">Periodo Nómina: </span>
                                  <span className="font-bold text-slate-900">{asig.deduccionNomina.quincenaAplicacion}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Metadata row */}
                          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 font-mono">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>Asignación: {formatFechaExacta(asig.fechaAsignacion)}</span>
                            </span>
                            {asig.folioFirmaDigital && (
                              <span className="hidden sm:flex items-center gap-1 text-[10px] text-slate-400 truncate max-w-xs" title={asig.folioFirmaDigital}>
                                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span className="truncate">{asig.folioFirmaDigital}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Action: Button to Print Official Receipt */}
                      <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 lg:pt-0">
                        <button
                          onClick={() => handleOpenAcuse(asig)}
                          className="px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Emitir Acuse Oficial</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="text-slate-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-900" />
            <span>Certificado de intendencia digital con respaldo en el libro de almacén zonal</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleOpenAcuse()}
              className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileCheck2 className="w-4 h-4 text-blue-900" />
              <span>Imprimir Acuse Completo</span>
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

      {/* Military Acuse de Recibo Modal (Print preview / Official certificate) */}
      {showPrintReceipt && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-slate-300 font-mono text-slate-900 my-auto print:m-0 print:p-0 print:shadow-none print:border-none">
            
            {/* Header del Acuse */}
            <div className="text-center border-b-2 border-slate-900 pb-4 mb-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                SECRETARÍA DE MARINA — ARMADA DE MÉXICO
              </div>
              <div className="text-sm font-extrabold uppercase tracking-wide text-slate-900 mt-0.5">
                DIRECCIÓN GENERAL DE INTENDENCIA NAVAL // JEFATURA DE VESTUARIO
              </div>
              <div className="text-xs font-bold text-blue-900 mt-1">
                ACUSE OFICIAL DE ENTREGA Y RESGUARDO DE VESTUARIO MILITAR
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                FOLIO OFICIAL: ACU-NAV-{personal.matricula}-{Date.now().toString().slice(-4)}
              </div>
            </div>

            {/* Datos del Elemento Receptor */}
            <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-4 text-xs space-y-1">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500">Elemento Receptor: </span>
                  <span className="font-bold">{personal.nombre}</span>
                </div>
                <div>
                  <span className="text-slate-500">Grado: </span>
                  <span className="font-bold">{personal.grado}</span>
                </div>
                <div>
                  <span className="text-slate-500">Matrícula Militar: </span>
                  <span className="font-bold">{personal.matricula}</span>
                </div>
                <div>
                  <span className="text-slate-500">Adscripción / Zona: </span>
                  <span className="font-bold">{personal.adscripcion}</span>
                </div>
              </div>
            </div>

            {/* Detalle de la Prenda Asignada */}
            <div className="border border-slate-300 rounded overflow-hidden mb-4 text-xs">
              <div className="bg-slate-900 text-white font-bold p-2 text-center text-[11px] uppercase tracking-wide">
                ESPECIFICACIÓN DE LA PRENDA / DOTACIÓN MILITAR
              </div>
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-200">
                  <tr className="bg-white">
                    <td className="p-2 font-bold text-slate-600 w-1/3">Tipo de Uniforme:</td>
                    <td className="p-2 font-bold text-slate-900">{selectedUniformeForAcuse?.tipo || 'Uniforme Naval Reglamentario'}</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-2 font-bold text-slate-600">Talla Reglamentaria:</td>
                    <td className="p-2">{selectedUniformeForAcuse?.talla || '38R'}</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-2 font-bold text-slate-600">Código de Lote Maestranza:</td>
                    <td className="p-2 font-mono">{selectedUniformeForAcuse?.codigoLote || 'LOTE-UNIF-2026-A1'}</td>
                  </tr>
                  <tr className="bg-slate-50">
                    <td className="p-2 font-bold text-slate-600">Naturaleza de la Asignación:</td>
                    <td className="p-2 font-bold">
                      {selectedUniformeForAcuse?.esExcedenteNomina ? (
                        <span className="text-amber-800">
                          PIEZA EXCEDENTE (CARGO A NÓMINA POR ${selectedUniformeForAcuse.deduccionNomina?.montoUnitarioMXN || 1450}.00 MXN - FOLIO {selectedUniformeForAcuse.deduccionNomina?.folioDescuento})
                        </span>
                      ) : (
                        <span className="text-emerald-800">
                          DOTACIÓN REGLAMENTARIA GRATUITA (DENTRO DEL LÍMITE DE 2 UNIFORMES POR PERIODO)
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="p-2 font-bold text-slate-600">Fecha y Hora de Sello:</td>
                    <td className="p-2">{formatFechaExacta(selectedUniformeForAcuse?.fechaAsignacion || new Date().toISOString())}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Clausulado Legal y Cadena Criptográfica */}
            <div className="text-[10px] text-slate-600 leading-relaxed border-t border-b border-slate-200 py-2.5 mb-6 text-justify">
              El suscrito militar declara bajo protesta de decir verdad haber recibido en entera satisfacción y conformidad la prenda arriba descrita, comprometiéndose a portarla con pulcritud conforme al Reglamento de Uniformes de la Armada de México. En caso de pieza excedente, se ratifica la autorización voluntaria para el descuento por nómina en la quincena correspondiente.
            </div>

            {/* Bloque de Firmas */}
            <div className="grid grid-cols-2 gap-8 text-center pt-2 mb-6">
              <div className="border-t border-slate-800 pt-2">
                <div className="text-xs font-bold">{personal.nombre}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">{personal.grado} — Mat. {personal.matricula}</div>
                <div className="text-[9px] text-slate-400 mt-1 font-mono">Firma Digital Estampada</div>
              </div>

              <div className="border-t border-slate-800 pt-2">
                <div className="text-xs font-bold">Cap. Corb. CG. Manuel E. Cárdenas</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">Jefe del Pañol de Intendencia Zonal</div>
                <div className="text-[9px] text-emerald-700 mt-1 font-mono">Sello Criptográfico Validado</div>
              </div>
            </div>

            {/* Sello SHA-256 */}
            <div className="p-2 bg-slate-100 rounded text-[9px] text-slate-500 break-all border border-slate-200 mb-4">
              <span className="font-bold text-slate-700">HASH DE CERTIFICACIÓN SHA-256: </span>
              {selectedUniformeForAcuse?.folioFirmaDigital || 'SHA256:8f4c2e91b7d3410a8c2d5e9f1a0b3c7d6e8f4a2b9c1d3e5f7a9b1c3d5e7f9a1b'}
            </div>

            {/* Buttons (hidden in print) */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 print:hidden">
              <button
                type="button"
                onClick={() => setShowPrintReceipt(false)}
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
                <span>Imprimir Documento Oficial</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
