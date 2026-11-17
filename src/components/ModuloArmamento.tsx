import React, { useState, useMemo } from 'react';
import { 
  AsignacionArmamento, 
  EstadoArmamento, 
  CategoriaArmamentoMilitar 
} from '../types/armamento';
import { 
  REGLAS_ARMAMENTO_JERARQUIA 
} from '../data/mockArmamento';
import { ModalExpedienteArmamento } from './ModalExpedienteArmamento';
import { 
  Crosshair, 
  Search, 
  Filter, 
  ShieldCheck, 
  ShieldAlert, 
  Award, 
  Printer, 
  FileText, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Hash, 
  Building2, 
  Layers,
  Wrench,
  Download
} from 'lucide-react';

interface ModuloArmamentoProps {
  initialAssignments: AsignacionArmamento[];
  onOpenOrderModal?: (res: any) => void;
}

export const ModuloArmamento: React.FC<ModuloArmamentoProps> = ({
  initialAssignments
}) => {
  const [asignaciones, setAsignaciones] = useState<AsignacionArmamento[]>(initialAssignments);
  const [selectedAsignacion, setSelectedAsignacion] = useState<AsignacionArmamento | null>(null);
  
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategoria, setFilterCategoria] = useState<string>('TODAS');
  const [filterEstado, setFilterEstado] = useState<string>('TODOS');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // New assignment modal state
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [newNombre, setNewNombre] = useState<string>('');
  const [newMatricula, setNewMatricula] = useState<string>('');
  const [newGrado, setNewGrado] = useState<string>('Marinero');
  const [newCategoria, setNewCategoria] = useState<CategoriaArmamentoMilitar>('Marinería y Clases');
  const [newAdscripcion, setNewAdscripcion] = useState<string>('RN-1 Veracruz (Batallón de Infantería de Marina N° 1)');
  const [newArmaIndex, setNewArmaIndex] = useState<number>(0);
  const [newSerie, setNewSerie] = useState<string>('');
  const [newObs, setNewObs] = useState<string>('Excelente - Revista de armamento aprobada para servicio naval.');

  // Notification Banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Hierarchy rules for current category in new modal
  const currentRegla = useMemo(() => {
    return REGLAS_ARMAMENTO_JERARQUIA.find(r => r.categoria === newCategoria) || REGLAS_ARMAMENTO_JERARQUIA[3];
  }, [newCategoria]);

  // Update selected weapon when category changes in modal
  const handleCategoriaChange = (cat: CategoriaArmamentoMilitar) => {
    setNewCategoria(cat);
    const regla = REGLAS_ARMAMENTO_JERARQUIA.find(r => r.categoria === cat);
    if (regla && regla.gradosAplicables.length > 0) {
      setNewGrado(regla.gradosAplicables[0]);
    }
    setNewArmaIndex(0);
  };

  // Filtered dataset
  const filteredAsignaciones = useMemo(() => {
    return asignaciones.filter(item => {
      const matchSearch = 
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.numero_serie.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.arma_asignada.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.adscripcion.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategoria = filterCategoria === 'TODAS' || item.categoriaJerarquica === filterCategoria;
      const matchEstado = filterEstado === 'TODOS' || item.estado === filterEstado;

      return matchSearch && matchCategoria && matchEstado;
    });
  }, [asignaciones, searchTerm, filterCategoria, filterEstado]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredAsignaciones.length / itemsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAsignaciones.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAsignaciones, currentPage, itemsPerPage]);

  // KPI Metrics
  const totalArmas = asignaciones.length;
  const totalActivas = asignaciones.filter(a => a.estado === 'Activa').length;
  const totalCustodia = asignaciones.filter(a => a.estado === 'En Custodia').length;
  const totalDevueltas = asignaciones.filter(a => a.estado === 'Devuelto').length;

  // Handle status update from modal
  const handleUpdateEstado = (id: string, nuevoEstado: EstadoArmamento, nuevasObservaciones?: string) => {
    setAsignaciones(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          estado: nuevoEstado,
          observaciones: nuevasObservaciones !== undefined ? nuevasObservaciones : item.observaciones
        };
      }
      return item;
    }));

    if (selectedAsignacion && selectedAsignacion.id === id) {
      setSelectedAsignacion(prev => prev ? {
        ...prev,
        estado: nuevoEstado,
        observaciones: nuevasObservaciones !== undefined ? nuevasObservaciones : prev.observaciones
      } : null);
    }

    showToast(`Estado de armamento actualizado a: ${nuevoEstado}`);
  };

  // Submit new weapon assignment
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newNombre.trim() || !newMatricula.trim()) {
      alert('Por favor ingrese el nombre y la matrícula militar.');
      return;
    }

    // Check strict rule: 1 weapon per person
    const alreadyAssigned = asignaciones.find(a => 
      a.matricula.trim().toUpperCase() === newMatricula.trim().toUpperCase() && a.estado !== 'Devuelto'
    );
    if (alreadyAssigned) {
      alert(`REGLA MILITAR INQUEBRANTABLE:\nEl militar con matrícula ${newMatricula} ya cuenta con un arma principal activa (${alreadyAssigned.arma_asignada}, Serie: ${alreadyAssigned.numero_serie}).\n\nPor doctrina naval de seguridad, cada elemento militar tiene derecho y autorización para exactamente una (1) arma principal.`);
      return;
    }

    const armaElegida = currentRegla.armasPermitidas[newArmaIndex] || currentRegla.armasPermitidas[0];
    const generatedSerie = newSerie.trim() || `SECMAR-${newCategoria.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-5)}`;

    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const fechaStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const nuevaAsignacion: AsignacionArmamento = {
      id: `ARM-${(asignaciones.length + 1).toString().padStart(3, '0')}`,
      matricula: newMatricula.trim().toUpperCase(),
      nombre: newNombre.trim(),
      grado: newGrado,
      categoriaJerarquica: newCategoria,
      adscripcion: newAdscripcion,
      arma_asignada: armaElegida.modelo,
      numero_serie: generatedSerie,
      calibre: armaElegida.calibre,
      municion_dotacion: armaElegida.municionEstandar,
      fecha_asignacion: fechaStr,
      estado: 'Activa',
      observaciones: newObs.trim() || 'Arma reglamentaria asignada formalmente bajo revista militar.',
      folioFirmaDigital: `SHA256:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      armeroInspector: 'Cap. Corb. CG. Manuel E. Cárdenas'
    };

    setAsignaciones([nuevaAsignacion, ...asignaciones]);
    setIsNewModalOpen(false);
    // Reset inputs
    setNewNombre('');
    setNewMatricula('');
    setNewSerie('');
    showToast(`Arma ${armaElegida.modelo} asignada con éxito al personal naval.`);
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Matricula', 'Nombre', 'Grado', 'Categoria', 'Adscripcion', 'Arma Asignada', 'Numero Serie', 'Calibre', 'Municion Dotacion', 'Fecha Asignacion', 'Estado', 'Observaciones'];
    const rows = asignaciones.map(a => [
      `"${a.id}"`,
      `"${a.matricula}"`,
      `"${a.nombre}"`,
      `"${a.grado}"`,
      `"${a.categoriaJerarquica}"`,
      `"${a.adscripcion}"`,
      `"${a.arma_asignada}"`,
      `"${a.numero_serie}"`,
      `"${a.calibre}"`,
      `"${a.municion_dotacion}"`,
      `"${a.fecha_asignacion}"`,
      `"${a.estado}"`,
      `"${a.observaciones.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Registro_Armamento_Armada_Mexico_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-950 text-white border border-slate-700 px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 font-mono text-xs animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 bg-blue-950 text-cyan-400 rounded-lg shadow-xs">
              <Crosshair className="w-5 h-5" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Dirección de Intendencia & Balística Naval
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Módulo de Control de Armamento Reglamentario
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl font-mono">
            Control balístico, asignación unitaria jerárquica (1 arma principal por elemento) y trazabilidad estricta de munición de dotación para la Armada de México.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors border border-slate-300 cursor-pointer"
            title="Exportar inventario de armamento a CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer active:translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Asignar Armamento</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Armamento Total Registrado</span>
            <Crosshair className="w-4 h-4 text-blue-800" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-2">{totalArmas}</div>
          <div className="text-[11px] text-blue-900 mt-1 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
            100% Dotación Unitaria Cumplida
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Activas en Servicio</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-2">{totalActivas}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Porte autorizado en unidades y buques
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">En Pañol / Custodia</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-700 mt-2">{totalCustodia}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Resguardadas bajo revista técnica
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Devueltas / Bajas</span>
            <RotateCcw className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-700 mt-2">{totalDevueltas}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Bajas de comisión o cambio de plaza
          </div>
        </div>
      </div>

      {/* Reglas de Negocio Doctrine Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 shadow-xs font-mono">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                Doctrina de Asignación por Jerarquía Naval (Regla Estricta: 1 Arma por Elemento)
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl pt-1">
              La dotación reglamentaria restringe a cada militar naval a portar una sola arma principal, categorizada según su responsabilidad operativa y grado jerárquico:
            </p>
          </div>
          <span className="hidden sm:inline-block text-[10px] bg-blue-950 text-cyan-400 px-2.5 py-1 rounded border border-blue-800 font-bold uppercase">
            Art. 42 LFM
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4 text-[11px]">
          <div className="bg-slate-800/80 p-3 rounded border border-slate-700">
            <div className="font-bold text-cyan-300 uppercase">1. Marinería y Clases</div>
            <div className="text-slate-400 text-[10px] mt-0.5">Marinero, Cabo, 3er/2do/1er Maestre</div>
            <div className="text-slate-200 mt-1 font-semibold">SIG Sauer SIG516 / FX-05 Xiuhcoatl</div>
            <div className="text-amber-400 text-[10px] mt-0.5">3 cargadores / 90 cartuchos 5.56mm</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded border border-slate-700">
            <div className="font-bold text-cyan-300 uppercase">2. Oficiales Subalternos</div>
            <div className="text-slate-400 text-[10px] mt-0.5">Tenientes y Capitán de Corbeta</div>
            <div className="text-slate-200 mt-1 font-semibold">SIG Sauer SP2022 / P226 / Colt M4</div>
            <div className="text-amber-400 text-[10px] mt-0.5">3 cargadores / 45 cartuchos 9mm</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded border border-slate-700">
            <div className="font-bold text-cyan-300 uppercase">3. Fuerzas Especiales (FES)</div>
            <div className="text-slate-400 text-[10px] mt-0.5">Infantería Especializada / OOMM</div>
            <div className="text-slate-200 mt-1 font-semibold">FN P90 / Barrett .50 / Benelli M4</div>
            <div className="text-amber-400 text-[10px] mt-0.5">Dotación táctica de alta precisión</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded border border-slate-700">
            <div className="font-bold text-cyan-300 uppercase">4. Jefes y Almirantes</div>
            <div className="text-slate-400 text-[10px] mt-0.5">Cap. Navío hasta Almirante</div>
            <div className="text-slate-200 mt-1 font-semibold">Beretta 92FS Inox / SIG Sauer P320</div>
            <div className="text-amber-400 text-[10px] mt-0.5">2 cargadores / 30 cartuchos 9mm</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Buscar por matrícula, nombre, serie..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-slate-900 focus:outline-hidden focus:border-blue-900 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 text-[11px] font-bold uppercase">Categoría:</span>
            <select
              value={filterCategoria}
              onChange={(e) => {
                setFilterCategoria(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-800 font-semibold text-xs"
            >
              <option value="TODAS">Todas las Categorías</option>
              <option value="Jefes y Almirantes">Jefes y Almirantes</option>
              <option value="Oficiales y Subalternos">Oficiales y Subalternos</option>
              <option value="Fuerzas Especiales">Fuerzas Especiales</option>
              <option value="Marinería y Clases">Marinería y Clases</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px] font-bold uppercase">Estado:</span>
            <select
              value={filterEstado}
              onChange={(e) => {
                setFilterEstado(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-800 font-semibold text-xs"
            >
              <option value="TODOS">Todos los Estados</option>
              <option value="Activa">Activa</option>
              <option value="En Custodia">En Custodia</option>
              <option value="Devuelto">Devuelto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table View */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Matrícula</th>
                <th className="py-3 px-4">Personal Militar Naval</th>
                <th className="py-3 px-4">Categoría / Adscripción</th>
                <th className="py-3 px-4">Arma Principal Asignada</th>
                <th className="py-3 px-4">Calibre & Balística</th>
                <th className="py-3 px-4">Dotación Munición</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 font-mono text-xs">
                    No se encontraron asignaciones de armamento que coincidan con los criterios de búsqueda.
                  </td>
                </tr>
              ) : (
                paginatedData.map((asig) => (
                  <tr 
                    key={asig.id} 
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Matrícula */}
                    <td className="py-3 px-4 font-bold text-slate-800 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Hash className="w-3.5 h-3.5 text-slate-400" />
                        <span>{asig.matricula}</span>
                      </div>
                    </td>

                    {/* Nombre y Grado (Clickable to open dossier) */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => setSelectedAsignacion(asig)}
                        className="text-left group/btn cursor-pointer block"
                        title="Abrir Expediente Individual de Armamento"
                      >
                        <div className="font-bold text-blue-900 group-hover/btn:text-blue-700 group-hover/btn:underline transition-colors flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                          <span>{asig.nombre}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {asig.grado}
                        </div>
                      </button>
                    </td>

                    {/* Jerarquía y Adscripción */}
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-semibold text-[11px]">
                        {asig.categoriaJerarquica}
                      </div>
                      <div className="text-slate-500 text-[10px] truncate max-w-xs" title={asig.adscripcion}>
                        {asig.adscripcion}
                      </div>
                    </td>

                    {/* Arma Asignada */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 text-xs">
                        {asig.arma_asignada}
                      </div>
                      <div className="text-[10px] font-mono text-blue-900 mt-0.5">
                        SERIE: <span className="font-bold">{asig.numero_serie}</span>
                      </div>
                    </td>

                    {/* Calibre */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-semibold text-[11px] border border-slate-200">
                        {asig.calibre}
                      </span>
                    </td>

                    {/* Dotación de Munición */}
                    <td className="py-3 px-4">
                      <div className="text-[11px] font-semibold text-amber-900">
                        {asig.municion_dotacion}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {asig.fecha_asignacion.split(' ')[0]}
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold ${
                        asig.estado === 'Activa'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : asig.estado === 'En Custodia'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-200 text-slate-800 border border-slate-300'
                      }`}>
                        {asig.estado === 'Activa' && <CheckCircle2 className="w-3 h-3 text-emerald-700" />}
                        {asig.estado === 'En Custodia' && <AlertCircle className="w-3 h-3 text-amber-700" />}
                        {asig.estado === 'Devuelto' && <RotateCcw className="w-3 h-3 text-slate-600" />}
                        <span>{asig.estado}</span>
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedAsignacion(asig)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded font-bold text-[11px] border border-blue-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Expediente</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
          <div className="text-slate-500">
            Mostrando <span className="font-bold text-slate-800">{paginatedData.length}</span> de <span className="font-bold text-slate-800">{filteredAsignaciones.length}</span> elementos registrados (Total armada: {asignaciones.length})
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded bg-white border border-slate-300 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer"
              title="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-slate-700 font-bold px-2">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded bg-white border border-slate-300 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors cursor-pointer"
              title="Página siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Nueva Asignación de Armamento con Validación Jerárquica */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 font-sans my-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 font-mono">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-900 text-cyan-400 rounded">
                  <Crosshair className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-900 uppercase">
                  Nueva Asignación de Armamento Principal
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4 pt-4 font-mono text-xs">
              
              {/* Alerta de restricción 1 arma */}
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Restricción Estricta de Balística y Custodia:</div>
                  <div className="text-[11px] text-amber-800">
                    Solo se autoriza 1 arma principal por persona. Si el elemento ya tiene un arma asignada no se permitirá una duplicidad.
                  </div>
                </div>
              </div>

              {/* Categoría y Grado */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Categoría Militar
                  </label>
                  <select
                    value={newCategoria}
                    onChange={(e) => handleCategoriaChange(e.target.value as CategoriaArmamentoMilitar)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded font-semibold text-xs"
                  >
                    <option value="Marinería y Clases">Marinería y Clases</option>
                    <option value="Oficiales y Subalternos">Oficiales y Subalternos</option>
                    <option value="Fuerzas Especiales">Fuerzas Especiales</option>
                    <option value="Jefes y Almirantes">Jefes y Almirantes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Grado Naval
                  </label>
                  <select
                    value={newGrado}
                    onChange={(e) => setNewGrado(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded font-semibold text-xs"
                  >
                    {currentRegla.gradosAplicables.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Matrícula y Nombre */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Matrícula Militar (Ej. SM-984021)
                  </label>
                  <input
                    type="text"
                    required
                    value={newMatricula}
                    onChange={(e) => setNewMatricula(e.target.value)}
                    placeholder="SM-000000"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs uppercase"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Nombre Completo del Elemento
                  </label>
                  <input
                    type="text"
                    required
                    value={newNombre}
                    onChange={(e) => setNewNombre(e.target.value)}
                    placeholder="Ej. Cabo IM. Juan Pérez Gómez"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              {/* Unidad / Adscripción */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                  Unidad Naval / Adscripción
                </label>
                <input
                  type="text"
                  required
                  value={newAdscripcion}
                  onChange={(e) => setNewAdscripcion(e.target.value)}
                  placeholder="Ej. Batallón de Infantería de Marina / Patrulla Oceánica"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
                />
              </div>

              {/* Selección de Arma (Filtro según categoría) */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                <label className="block text-[11px] font-bold text-blue-900 uppercase">
                  Armamento Autorizado para {newCategoria}
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {currentRegla.armasPermitidas.map((arma, idx) => (
                    <label 
                      key={arma.modelo}
                      className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${
                        newArmaIndex === idx 
                          ? 'bg-blue-100/70 border-blue-600 text-blue-950 font-bold' 
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="arma_seleccionada"
                          checked={newArmaIndex === idx}
                          onChange={() => setNewArmaIndex(idx)}
                          className="text-blue-900"
                        />
                        <div>
                          <div>{arma.modelo} ({arma.tipo})</div>
                          <div className="text-[10px] text-slate-500 font-normal">Calibre: {arma.calibre}</div>
                        </div>
                      </div>
                      <div className="text-[10px] text-amber-800 font-semibold text-right">
                        {arma.municionEstandar}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Número de Serie Manual u Opcional */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Número de Serie (Opcional - Auto si se deja vacío)
                  </label>
                  <input
                    type="text"
                    value={newSerie}
                    onChange={(e) => setNewSerie(e.target.value)}
                    placeholder="Ej. SIG-516-99000"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Observaciones Técnicas / Revista
                  </label>
                  <input
                    type="text"
                    value={newObs}
                    onChange={(e) => setNewObs(e.target.value)}
                    placeholder="Condición de entrega..."
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-900 hover:bg-blue-800 text-white rounded font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Confirmar Asignación</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal / Drawer Expediente Individual de Armamento */}
      {selectedAsignacion && (
        <ModalExpedienteArmamento
          asignacion={selectedAsignacion}
          onClose={() => setSelectedAsignacion(null)}
          onUpdateEstado={handleUpdateEstado}
        />
      )}
    </div>
  );
};
