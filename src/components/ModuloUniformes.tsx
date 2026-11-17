import React, { useState, useMemo } from 'react';
import { 
  PersonalMilitar, 
  UniformeAsignado, 
  CategoriaJerarquica, 
  TipoUniformeNaval, 
  EstatusEntregaUniforme 
} from '../types/uniformes';
import { ModalExpedientePersonal } from './ModalExpedientePersonal';
import { 
  Shirt, 
  Search, 
  Filter, 
  Plus, 
  DollarSign, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  UserCheck, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Printer, 
  Eye, 
  Building2, 
  Award,
  Hash,
  Scissors,
  Truck,
  FileCheck2,
  X
} from 'lucide-react';

interface ModuloUniformesProps {
  initialPersonnel?: PersonalMilitar[];
  onOpenOrderModal?: (info: any) => void;
}

const TIPOS_UNIFORME: TipoUniformeNaval[] = [
  'Blanco de Gala',
  'Azul Marino de Servicios / Faena',
  'Camuflaje Táctico de Selva / Árido',
  'Marina de Guerra / Cubierta',
  'Caqui de Oficial de Guardia',
  'Overol Ignífugo Operativo'
];

const TALLAS_DISPONIBLES = ['34R', '36R', '38R', '38L', '40R', '40L', '42R', '42L', '44R'];

export const ModuloUniformes: React.FC<ModuloUniformesProps> = ({
  initialPersonnel = []
}) => {
  const [personalList, setPersonalList] = useState<PersonalMilitar[]>(initialPersonnel);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategoria, setFilterCategoria] = useState<string>('ALL');
  const [filterCargoNomina, setFilterCargoNomina] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Selected militar for Drawer / Modal
  const [selectedMilitar, setSelectedMilitar] = useState<PersonalMilitar | null>(null);

  // New Assignment Modal state
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [assignSearchTerm, setAssignSearchTerm] = useState<string>('');
  const [assignModalError, setAssignModalError] = useState<string | null>(null);
  const [assignTargetMilitarId, setAssignTargetMilitarId] = useState<string>('');
  const [newUniformType, setNewUniformType] = useState<TipoUniformeNaval>('Azul Marino de Servicios / Faena');
  const [newUniformTalla, setNewUniformTalla] = useState<string>('38R');
  const [newUniformStatus, setNewUniformStatus] = useState<EstatusEntregaUniforme>('Entregado');
  const [authorizePayrollDeduction, setAuthorizePayrollDeduction] = useState<boolean>(false);
  const [assignmentNotice, setAssignmentNotice] = useState<string | null>(null);

  const normalizeText = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

  // Filtered personnel inside "Asignación de Prenda Naval" modal
  const filteredAssignPersonnel = useMemo(() => {
    const query = normalizeText(assignSearchTerm.trim());
    if (!query) return personalList;
    return personalList.filter((p) =>
      normalizeText(`${p.matricula} ${p.grado} ${p.nombre} ${p.categoriaJerarquica} ${p.adscripcion}`).includes(query)
    );
  }, [personalList, assignSearchTerm]);

  // Target element when assigning
  const targetMilitarForAssignment = useMemo(() => {
    if (filteredAssignPersonnel.length === 0) return null;
    return (
      filteredAssignPersonnel.find((p) => p.id === assignTargetMilitarId) ||
      filteredAssignPersonnel[0] ||
      null
    );
  }, [filteredAssignPersonnel, assignTargetMilitarId]);

  // Check if adding this will exceed the 2 free reglamentary limit
  const willBeExceedingReglamentary = useMemo(() => {
    if (!targetMilitarForAssignment) return false;
    const currentGratuitos = targetMilitarForAssignment.asignaciones.filter(a => !a.esExcedenteNomina).length;
    return currentGratuitos >= 2;
  }, [targetMilitarForAssignment]);

  const unitDeductibleAmount = newUniformType === 'Blanco de Gala' ? 1850 : 1450;

  // KPI Calculations
  const totalPersonal = personalList.length;
  const totalPiezasAsignadas = personalList.reduce((acc, p) => acc + p.asignaciones.length, 0);
  const personalConCargoNomina = personalList.filter(p => p.cargoNomina).length;
  const personalDotacionExacta = personalList.filter(p => !p.cargoNomina && p.cantidadTotal === 2).length;
  
  const totalMontoNominaMXN = personalList.reduce((acc, p) => {
    const sumMilitar = p.asignaciones
      .filter(a => a.esExcedenteNomina && a.deduccionNomina)
      .reduce((s, curr) => s + (curr.deduccionNomina?.montoUnitarioMXN || 0), 0);
    return acc + sumMilitar;
  }, 0);

  const piezasEnSastreriaOTransito = personalList.reduce((acc, p) => {
    return acc + p.asignaciones.filter(a => a.estatus === 'En Sastrería' || a.estatus === 'En Tránsito' || a.estatus === 'Pendiente de Sastrería').length;
  }, 0);

  // Filtered list
  const filteredList = useMemo(() => {
    return personalList.filter(p => {
      const matchSearch = 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.grado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.adscripcion.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCat = filterCategoria === 'ALL' || p.categoriaJerarquica === filterCategoria;
      const matchNomina = 
        filterCargoNomina === 'ALL' || 
        (filterCargoNomina === 'NOMINA' && p.cargoNomina) ||
        (filterCargoNomina === 'REGLAMENTARIO' && !p.cargoNomina);

      return matchSearch && matchCat && matchNomina;
    });
  }, [personalList, searchTerm, filterCategoria, filterCargoNomina]);

  // Pagination
  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage, pageSize]);

  // Handle open assign modal
  const handleOpenAssignModalFor = (militar: PersonalMilitar) => {
    setAssignTargetMilitarId(militar.id);
    setAssignSearchTerm('');
    setAssignModalError(null);
    setAuthorizePayrollDeduction(false);
    setShowAssignModal(true);
  };

  // Submit new uniform assignment
  const handleSaveUniformAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetMilitarForAssignment) {
      setAssignModalError('Seleccione un elemento militar válido de la lista filtrada.');
      return;
    }

    if (willBeExceedingReglamentary && !authorizePayrollDeduction) {
      setAssignModalError('Debe marcar la casilla "Cargar excedente a nómina" para autorizar la asignación de un 3er uniforme conforme al reglamento militar.');
      return;
    }
    setAssignModalError(null);

    const folioDesc = `DESC-NOM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newId = `UNIF-${targetMilitarForAssignment.matricula.replace('SM-', '')}-${Date.now().toString().slice(-4)}`;

    const newAssignment: UniformeAsignado = {
      idUniforme: newId,
      tipo: newUniformType,
      talla: newUniformTalla,
      fechaAsignacion: new Date().toISOString(),
      esExcedenteNomina: willBeExceedingReglamentary,
      estatus: newUniformStatus,
      codigoLote: `LOTE-UNIF-2026-${newUniformType.includes('Gala') ? 'GALA' : 'NAV'}`,
      folioFirmaDigital: `SHA256:${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
      ...(willBeExceedingReglamentary ? {
        deduccionNomina: {
          folioDescuento: folioDesc,
          montoUnitarioMXN: unitDeductibleAmount,
          estadoDeduccion: 'Aplicado en Nómina',
          fechaAplicacion: new Date().toISOString(),
          quincenaAplicacion: '1a Quincena Noviembre 2026'
        }
      } : {})
    };

    setPersonalList(prev => prev.map(p => {
      if (p.id !== targetMilitarForAssignment.id) return p;
      const updatedAsignaciones = [...p.asignaciones, newAssignment];
      const newTotal = updatedAsignaciones.length;
      const hasNomina = updatedAsignaciones.some(a => a.esExcedenteNomina) || newTotal >= 3;
      return {
        ...p,
        cantidadTotal: newTotal,
        cargoNomina: hasNomina,
        fechaUltimaDotacion: newAssignment.fechaAsignacion,
        asignaciones: updatedAsignaciones
      };
    }));

    setAssignmentNotice(
      willBeExceedingReglamentary
        ? `¡Prenda excedente asignada a ${targetMilitarForAssignment.nombre}! Folio de deducción ${folioDesc} registrado por $${unitDeductibleAmount}.00 MXN.`
        : `¡Dotación oficial asignada a ${targetMilitarForAssignment.nombre} satisfactoriamente dentro de la cuota reglamentaria!`
    );

    setTimeout(() => setAssignmentNotice(null), 6000);
    setShowAssignModal(false);
  };

  // Export full table to CSV
  const handleExportCSV = () => {
    const headers = 'ID,Matricula,Grado,Nombre,Categoria,Adscripcion,Total_Uniformes,Cargo_Nomina,Fecha_Ultima_Dotacion\n';
    const rows = personalList.map(p => 
      `"${p.id}","${p.matricula}","${p.grado}","${p.nombre}","${p.categoriaJerarquica}","${p.adscripcion}",${p.cantidadTotal},"${p.cargoNomina ? 'SI' : 'NO'}","${p.fechaUltimaDotacion}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CENSO_VESTUARIO_NAVAL_POSEIDON_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* PORTADA OFICIAL DE LA PESTAÑA DE UNIFORMES (/imagenes/uniformes.jpg - Completa, sin recortes ni texto superpuesto) */}
      <div className="rounded-xl bg-slate-950 border border-slate-800 shadow-lg overflow-hidden">
        <div className="w-full flex justify-center items-center bg-slate-950">
          <img
            src="/imagenes/uniformes.jpg"
            alt="Portada Oficial Asignación de Uniformes - POSEIDÓN-LOG"
            className="w-full h-auto object-contain block"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="px-5 py-3 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-2.5 text-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
            <span className="font-bold tracking-wider uppercase text-cyan-300">
              Intendencia Naval · Asignación de Uniformes
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-300">
              {totalPersonal} Elementos en Censo · {totalPiezasAsignadas} Prendas Registradas
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                document.getElementById('censo-uniformes-tabla')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer font-semibold"
            >
              Ver Censo y Filtros
            </button>
            <button
              type="button"
              onClick={() => {
                setAssignTargetMilitarId(personalList[0]?.id || '');
                setAssignSearchTerm('');
                setAssignModalError(null);
                setAuthorizePayrollDeduction(false);
                setShowAssignModal(true);
              }}
              className="px-3.5 py-1.5 rounded bg-blue-700 hover:bg-blue-600 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Asignar Prenda Naval</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Banner & Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-blue-900 uppercase tracking-widest font-bold">
            <Shirt className="w-4 h-4 text-blue-800" />
            <span>INTENDENCIA NAVAL // CONTROL DE VESTUARIO & DOTACIONES</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight mt-0.5">
            Módulo de Uniformes y Regulación de Cuotas de Vestuario
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl">
            Gestión nominal de prendas militares conforme a la Directiva de Vestuario Naval: derecho a un máximo de dos (2) uniformes gratuitos por periodo reglamentario. Asignaciones excedentes (3ª pieza o más) sujetas a autorización y deducción de nómina.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-semibold rounded bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer font-mono"
          >
            <Download className="w-3.5 h-3.5 text-blue-900" />
            <span>Exportar Censo CSV</span>
          </button>

          <button
            onClick={() => {
              setAssignTargetMilitarId(personalList[0]?.id || '');
              setAssignSearchTerm('');
              setAssignModalError(null);
              setAuthorizePayrollDeduction(false);
              setShowAssignModal(true);
            }}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer font-mono"
          >
            <Plus className="w-4 h-4" />
            <span>Asignar Prenda</span>
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      {assignmentNotice && (
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs font-mono text-emerald-900 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{assignmentNotice}</span>
          </div>
          <button 
            onClick={() => setAssignmentNotice(null)} 
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Military KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-100 text-blue-900 shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Personal Censado</div>
            <div className="text-lg font-bold text-slate-900 tabular-nums">
              {totalPersonal} <span className="text-xs font-normal text-slate-500">Elementos</span>
            </div>
            <div className="text-[10px] text-slate-400">100% Identificados</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-900 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Dotación Reglamentaria</div>
            <div className="text-lg font-bold text-emerald-800 tabular-nums">
              {personalDotacionExacta} <span className="text-xs font-normal text-slate-500">Elementos</span>
            </div>
            <div className="text-[10px] text-emerald-700">2/2 Uniformes Oficiales</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-100 text-amber-900 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Cargo a Nómina</div>
            <div className="text-lg font-bold text-amber-800 tabular-nums">
              {personalConCargoNomina} <span className="text-xs font-normal text-slate-500">Excedentes</span>
            </div>
            <div className="text-[10px] text-amber-700">3er Uniforme Adicional</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-slate-100 text-slate-800 shrink-0">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Sastrería / Tránsito</div>
            <div className="text-lg font-bold text-slate-900 tabular-nums">
              {piezasEnSastreriaOTransito} <span className="text-xs font-normal text-slate-500">Prendas</span>
            </div>
            <div className="text-[10px] text-slate-400">En Confección o Ruta</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="p-2.5 rounded-lg bg-cyan-100 text-cyan-900 shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-bold">Total Retenido Nómina</div>
            <div className="text-lg font-bold text-cyan-950 tabular-nums">
              ${totalMontoNominaMXN.toLocaleString('es-MX')}.00
            </div>
            <div className="text-[10px] text-cyan-700">Deducciones Autorizadas</div>
          </div>
        </div>
      </div>

      {/* Regla de Negocio Militar Explicativa */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs text-blue-950 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-blue-900 text-white rounded-md shrink-0">
            <Shirt className="w-4 h-4" />
          </span>
          <div>
            <span className="font-bold uppercase text-blue-900">Normativa de Intendencia Naval: </span>
            <span>Cada militar recibe un límite de <b>2 uniformes reglamentarios gratuitos</b> por ciclo. Si se requiere una 3ª prenda, se activa la deducción de nómina con folio oficial de descuento.</span>
          </div>
        </div>
        <span className="bg-white border border-blue-300 text-blue-900 font-bold px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap shrink-0">
          Partida 27101 / Gasto Personal
        </span>
      </div>

      {/* Search & Filter Toolbar */}
      <div id="censo-uniformes-tabla" className="scroll-mt-20 bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3 font-mono">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Buscar por matrícula (ej. SM-849201), nombre o adscripción naval..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Filter by Category */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-500">Grado:</span>
              <select
                value={filterCategoria}
                onChange={(e) => {
                  setFilterCategoria(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">Todas las Categorías</option>
                <option value="Almirantes">Almirantes</option>
                <option value="Capitanes">Capitanes</option>
                <option value="Oficiales">Oficiales</option>
                <option value="Tropa y Marinería">Tropa y Marinería</option>
              </select>
            </div>

            {/* Filter by Payroll / Dotación */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-xs">
              <span className="text-slate-500">Dotación:</span>
              <select
                value={filterCargoNomina}
                onChange={(e) => {
                  setFilterCargoNomina(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">Todos los Estados</option>
                <option value="REGLAMENTARIO">Reglamentaria (2 prendas)</option>
                <option value="NOMINA">Con Cargo a Nómina (3 prendas)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results summary counter */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span>Mostrando {filteredList.length} registros de personal militar</span>
          <span>Página {currentPage} de {totalPages}</span>
        </div>
      </div>

      {/* Main Personnel Uniforms Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-900 text-white font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Matrícula</th>
                <th className="py-3 px-4">Grado y Nombre Completo</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Adscripción / Zona</th>
                <th className="py-3 px-4 text-center">Total Prendas</th>
                <th className="py-3 px-4 text-center">Naturaleza Dotación</th>
                <th className="py-3 px-4">Última Asignación</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-mono text-xs">
                    No se encontraron registros de vestuario que coincidan con los criterios de búsqueda.
                  </td>
                </tr>
              ) : (
                paginatedList.map((militar) => {
                  const hasNomina = militar.cargoNomina;
                  return (
                    <tr 
                      key={militar.id} 
                      className="hover:bg-blue-50/40 transition-colors"
                    >
                      {/* Matrícula */}
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-950 whitespace-nowrap">
                        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {militar.matricula}
                        </span>
                      </td>

                      {/* Nombre con link al Expediente */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => setSelectedMilitar(militar)}
                          className="text-left font-bold text-blue-900 hover:text-blue-700 hover:underline flex items-center gap-1.5 cursor-pointer group"
                        >
                          <span className="font-semibold text-slate-900 group-hover:text-blue-900">
                            {militar.nombre}
                          </span>
                        </button>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {militar.grado}
                        </div>
                      </td>

                      {/* Categoría */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        {militar.categoriaJerarquica}
                      </td>

                      {/* Adscripción */}
                      <td className="py-3.5 px-4 font-mono text-xs text-slate-700 max-w-xs truncate">
                        <div className="truncate font-medium">{militar.adscripcion}</div>
                        <div className="text-[10px] text-slate-400">Base: {militar.zonaId}</div>
                      </td>

                      {/* Total Prendas */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold">
                        <span className={`px-2 py-0.5 rounded text-xs inline-block ${
                          militar.cantidadTotal >= 3
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-blue-100 text-blue-950 border border-blue-300'
                        }`}>
                          {militar.cantidadTotal} piezas
                        </span>
                      </td>

                      {/* Naturaleza Dotación Badge */}
                      <td className="py-3.5 px-4 text-center font-mono">
                        {hasNomina ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                              <DollarSign className="w-3 h-3 text-amber-700" />
                              Cargo a Nómina
                            </span>
                            <span className="text-[9px] text-amber-700 mt-0.5">
                              Excedente Deducido
                            </span>
                          </div>
                        ) : (
                          <div className="inline-flex flex-col items-center">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-700" />
                              Dotación Oficial
                            </span>
                            <span className="text-[9px] text-emerald-700 mt-0.5">
                              Reglamentario (Gratuito)
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Última Asignación */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        <div>{new Date(militar.fechaUltimaDotacion).toLocaleDateString('es-MX')}</div>
                        <div className="text-[10px] text-slate-400">
                          {militar.asignaciones[militar.asignaciones.length - 1]?.tipo || 'Uniforme'}
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5 font-mono">
                          <button
                            onClick={() => setSelectedMilitar(militar)}
                            className="px-2.5 py-1 text-xs font-semibold text-blue-900 hover:text-blue-800 bg-white border border-slate-300 rounded shadow-2xs hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Ver expediente individual"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Expediente</span>
                          </button>

                          <button
                            onClick={() => handleOpenAssignModalFor(militar)}
                            className="px-2 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors cursor-pointer"
                            title="Asignar nueva prenda"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-600">
          <div>
            Mostrando página <span className="font-bold text-slate-900">{currentPage}</span> de <span className="font-bold text-slate-900">{totalPages}</span> ({filteredList.length} elementos)
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-bold flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-7 h-7 rounded text-xs font-bold transition-colors ${
                  currentPage === page
                    ? 'bg-blue-900 text-white'
                    : 'bg-white border border-slate-300 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-bold flex items-center gap-1"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal / Expediente Individual Component */}
      <ModalExpedientePersonal
        personal={selectedMilitar}
        onClose={() => setSelectedMilitar(null)}
      />

      {/* Modal for Assigning New Uniform Piece */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 font-sans my-auto">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Shirt className="w-5 h-5 text-blue-900" />
                <h3 className="text-base font-bold text-slate-900 uppercase font-mono">
                  Asignación de Prenda Naval
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUniformAssignment} className="space-y-4">
              
              {/* Search Bar for Military Element inside Asignación de Prenda Naval */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold font-mono text-blue-950 uppercase flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-blue-800" />
                    <span>Buscar Personal Naval</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-500">
                    {filteredAssignPersonnel.length} de {personalList.length} elementos
                  </span>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={assignSearchTerm}
                    onChange={(e) => {
                      const nextQuery = e.target.value;
                      setAssignSearchTerm(nextQuery);
                      setAssignModalError(null);
                      const norm = normalizeText(nextQuery.trim());
                      const matches = !norm
                        ? personalList
                        : personalList.filter((p) =>
                            normalizeText(`${p.matricula} ${p.grado} ${p.nombre} ${p.categoriaJerarquica} ${p.adscripcion}`).includes(norm)
                          );
                      if (matches.length > 0 && !matches.some((m) => m.id === assignTargetMilitarId)) {
                        setAssignTargetMilitarId(matches[0].id);
                        setAuthorizePayrollDeduction(false);
                      }
                    }}
                    placeholder="Buscar por matrícula (ej. SM-849201), nombre, grado o adscripción..."
                    className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  {assignSearchTerm && (
                    <button
                      type="button"
                      onClick={() => {
                        setAssignSearchTerm('');
                        setAssignModalError(null);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                      title="Limpiar búsqueda"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Quick clickable search results when typing */}
                {assignSearchTerm.trim().length > 0 && filteredAssignPersonnel.length > 0 && (
                  <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 bg-white border border-slate-200 rounded-lg shadow-2xs">
                    {filteredAssignPersonnel.map((p) => {
                      const isSelected = targetMilitarForAssignment?.id === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setAssignTargetMilitarId(p.id);
                            setAuthorizePayrollDeduction(false);
                            setAssignModalError(null);
                          }}
                          className={`w-full px-3 py-2 text-left text-xs font-mono flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-blue-900 text-white'
                              : 'hover:bg-blue-50 text-slate-800'
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="font-bold truncate">
                              [{p.matricula}] {p.nombre}
                            </div>
                            <div className={`text-[10px] truncate ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>
                              {p.grado} · {p.adscripcion}
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : p.cantidadTotal >= 2
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            {p.cantidadTotal} prendas
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {filteredAssignPersonnel.length === 0 && (
                  <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-900 text-xs font-mono flex items-center justify-between gap-2">
                    <span>Sin coincidencias para «{assignSearchTerm}».</span>
                    <button
                      type="button"
                      onClick={() => setAssignSearchTerm('')}
                      className="underline font-bold text-rose-800 hover:text-rose-950 cursor-pointer shrink-0"
                    >
                      Mostrar todos
                    </button>
                  </div>
                )}
              </div>

              {/* Select Militar Target */}
              <div>
                <label className="text-xs font-bold font-mono text-slate-700 uppercase block mb-1">
                  Elemento Militar Receptor Seleccionado
                </label>
                <select
                  value={targetMilitarForAssignment?.id || ''}
                  onChange={(e) => {
                    setAssignTargetMilitarId(e.target.value);
                    setAuthorizePayrollDeduction(false);
                    setAssignModalError(null);
                  }}
                  disabled={filteredAssignPersonnel.length === 0}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {filteredAssignPersonnel.length === 0 ? (
                    <option value="">Sin elementos disponibles con el filtro actual</option>
                  ) : (
                    filteredAssignPersonnel.map(p => (
                      <option key={p.id} value={p.id}>
                        [{p.matricula}] {p.grado} {p.nombre} ({p.cantidadTotal} prendas)
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Status Banner based on current allocation */}
              {targetMilitarForAssignment && (
                <div className={`p-3 rounded-lg border text-xs font-mono ${
                  willBeExceedingReglamentary
                    ? 'bg-amber-50 border-amber-300 text-amber-950'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-950'
                }`}>
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    {willBeExceedingReglamentary ? (
                      <>
                        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>LÍMITE REGLAMENTARIO CUBIERTO ({targetMilitarForAssignment.cantidadTotal} PRENDAS ACTUALES)</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>DOTACIÓN OFICIAL REGLAMENTARIA (GRATUITA)</span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {willBeExceedingReglamentary 
                      ? `El elemento ya cuenta con 2 uniformes reglamentarios gratuitos. Esta solicitud será procesada como 3ª pieza adicional con Cargo a Nómina por un importe de $${unitDeductibleAmount}.00 MXN.`
                      : `El elemento cuenta con ${targetMilitarForAssignment.cantidadTotal} de 2 uniformes reglamentarios. Esta pieza se suministra al 100% sin costo a cargo de la partida presupuestal 27101.`
                    }
                  </p>
                </div>
              )}

              {/* Uniform Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold font-mono text-slate-700 uppercase block mb-1">
                    Tipo de Uniforme
                  </label>
                  <select
                    value={newUniformType}
                    onChange={(e) => setNewUniformType(e.target.value as TipoUniformeNaval)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    {TIPOS_UNIFORME.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold font-mono text-slate-700 uppercase block mb-1">
                    Talla Reglamentaria
                  </label>
                  <select
                    value={newUniformTalla}
                    onChange={(e) => setNewUniformTalla(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    {TALLAS_DISPONIBLES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Delivery Status */}
              <div>
                <label className="text-xs font-bold font-mono text-slate-700 uppercase block mb-1">
                  Estatus Inicial de Entrega
                </label>
                <select
                  value={newUniformStatus}
                  onChange={(e) => setNewUniformStatus(e.target.value as EstatusEntregaUniforme)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Entregado">Entregado Inmediato (Almacén Zonal)</option>
                  <option value="En Sastrería">En Sastrería (Ajuste de Medidas)</option>
                  <option value="En Tránsito">En Tránsito (Desde Maestranza Central)</option>
                  <option value="Pendiente de Sastrería">Pendiente de Sastrería</option>
                </select>
              </div>

              {/* MANDATORY CHECKBOX IF EXCEEDING REGLAMENTARY LIMIT */}
              {targetMilitarForAssignment && willBeExceedingReglamentary && (
                <div className="bg-amber-100/70 border border-amber-300 p-3.5 rounded-lg space-y-2 font-mono">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={authorizePayrollDeduction}
                      onChange={(e) => {
                        setAuthorizePayrollDeduction(e.target.checked);
                        if (e.target.checked) setAssignModalError(null);
                      }}
                      className="mt-0.5 w-4 h-4 rounded text-blue-900 border-slate-400 focus:ring-blue-600 cursor-pointer"
                      required
                    />
                    <div className="text-xs text-amber-950 font-bold">
                      Cargar excedente a nómina
                      <span className="block text-[11px] font-normal text-amber-900 mt-0.5">
                        Autorizo formalmente la deducción quincenal de <b>${unitDeductibleAmount}.00 MXN</b> correspondiente a la 3ª pieza de vestuario conforme a las reglas de intendencia militar.
                      </span>
                    </div>
                  </label>

                  <div className="pt-2 border-t border-amber-200/80 grid grid-cols-2 gap-2 text-[11px] text-slate-700">
                    <div>
                      <span className="text-slate-500">Monto Deducible: </span>
                      <span className="font-bold text-amber-900">${unitDeductibleAmount}.00 MXN</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Estado de Deducción: </span>
                      <span className="font-bold text-emerald-800">Aplicado en Nómina</span>
                    </div>
                  </div>
                </div>
              )}

              {assignModalError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs font-mono">
                  {assignModalError}
                </div>
              )}

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 font-mono">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!targetMilitarForAssignment}
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
                >
                  Confirmar Asignación Militar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
