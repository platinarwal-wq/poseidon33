import { useState, useEffect, useRef } from 'react';
import { TopNav, AppTab } from './components/TopNav';
import { AICommandCenter } from './components/AICommandCenter';
import { ModulePAA } from './components/ModulePAA';
import { ModuloUniformes } from './components/ModuloUniformes';
import { ModuloArmamento } from './components/ModuloArmamento';
import { ModuleMRP } from './components/ModuleMRP';
import { ModuleCustody } from './components/ModuleCustody';
import { ModuleFleet } from './components/ModuleFleet';
import { ModuleNavigations } from './components/ModuleNavigations';
import { ModuleDiscrepancyDashboard } from './components/ModuleDiscrepancyDashboard';
import { ExecutiveKPIDashboard } from './components/ExecutiveKPIDashboard';
import { NavalTacticalMap } from './components/NavalTacticalMap';
import { VesselNSNDetailModal } from './components/VesselNSNDetailModal';
import { ModalTechnicalOrder } from './components/ModalTechnicalOrder';
import { 
  INITIAL_SUPPLIES, 
  NAVAL_ZONES, 
  INITIAL_REQUISITIONS, 
  BOM_PRODUCTS, 
  MILITARY_PERSONNEL, 
  SERIALIZED_STOCK, 
  NAVAL_FLEET,
  SIMULATED_NAVIGATIONS,
  INITIAL_DISCREPANCIES,
  INITIAL_ZONAL_AUDIT_LOGS
} from './data/navalDatabase';
import { MOCK_ASIGNACIONES_UNIFORMES } from './data/mockUniformes';
import { MOCK_ASIGNACIONES_ARMAMENTO } from './data/mockArmamento';
import { 
  AICommandResponse, 
  ExplosionResult, 
  OperationalStatus,
  SimulatedNavigation,
  InventoryDiscrepancy,
  ZonalAuditLog,
  NavalVessel
} from './types/naval';
import { 
  Anchor, 
  Ship, 
  CheckCircle2, 
  Layers, 
  ShieldCheck,
  Building2,
  Compass,
  AlertTriangle,
  MapPin,
  Shirt,
  Crosshair,
  ArrowUp
} from 'lucide-react';

const TAB_HASH_ROUTES: Record<AppTab, string> = {
  paa: '#/paa',
  uniformes: '#/intendencia/uniformes',
  armamento: '#/intendencia/armamento',
  mapa: '#/mapa-tactico',
  auditoria: '#/auditoria',
  mando: '#/mando',
  mrp: '#/mrp',
  custodia: '#/custodia',
  mantenimiento: '#/mantenimiento',
  navegaciones: '#/navegaciones'
};

const TAB_SECTION_LABELS: Record<AppTab, string> = {
  paa: 'Necesidades & Programa Anual de Adquisiciones (PAA)',
  uniformes: 'Intendencia Naval · Vestuario y Uniformes',
  armamento: 'Dirección de Armamento y Balística Reglamentaria',
  mapa: 'Mapa Táctico Interactivo de Regiones Navales (ZEE)',
  auditoria: 'Auditoría Zonal & Conciliación de Discrepancias',
  mando: 'Consola de Mando y Directivas Tácticas',
  mrp: 'MRP · Explosión de Materiales y Maestranza',
  custodia: 'Cadena de Custodia NFC & Dotación Serializada',
  mantenimiento: 'Flota Naval & Dique Seco',
  navegaciones: 'Bitácora de 10 Navegaciones y Derrotas ZEE'
};

export default function App() {
  // 'paa' (Necesidades & PAA) is the primary first board displayed
  const [activeTab, setActiveTab] = useState<AppTab>('paa');
  const moduleSectionRef = useRef<HTMLElement | null>(null);
  const [supplies, setSupplies] = useState(INITIAL_SUPPLIES);
  const [zones, setZones] = useState(NAVAL_ZONES);
  const [requisitions, setRequisitions] = useState(INITIAL_REQUISITIONS);
  const [products] = useState(BOM_PRODUCTS);
  const [personnel, setPersonnel] = useState(MILITARY_PERSONNEL);
  const [serializedStock, setSerializedStock] = useState(SERIALIZED_STOCK);
  const [vessels, setVessels] = useState(NAVAL_FLEET);
  const [navigations] = useState<SimulatedNavigation[]>(SIMULATED_NAVIGATIONS);
  const [discrepancies, setDiscrepancies] = useState<InventoryDiscrepancy[]>(INITIAL_DISCREPANCIES);
  const [auditLogs, setAuditLogs] = useState<ZonalAuditLog[]>(INITIAL_ZONAL_AUDIT_LOGS);

  const [activeOrderModal, setActiveOrderModal] = useState<AICommandResponse | null>(null);
  const [globalVesselModal, setGlobalVesselModal] = useState<NavalVessel | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 6000);
  };

  const scrollToActiveModule = () => {
    requestAnimationFrame(() => {
      setTimeout(() => {
        moduleSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 40);
    });
  };

  const handleSelectTab = (tab: AppTab, shouldScroll = true) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', TAB_HASH_ROUTES[tab]);
    }
    if (shouldScroll) {
      scrollToActiveModule();
    }
  };

  const handleReturnToPortada = () => {
    setActiveTab('paa');
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Support URL hash navigation across all modules
  useEffect(() => {
    const resolveHashTab = (hash: string): AppTab | null => {
      const normalized = hash.toLowerCase();
      if (!normalized || normalized === '#' || normalized === '#portada') return null;
      if (normalized.includes('armamento')) return 'armamento';
      if (normalized.includes('uniformes')) return 'uniformes';
      if (normalized.includes('mapa')) return 'mapa';
      if (normalized.includes('auditoria')) return 'auditoria';
      if (normalized.includes('mando')) return 'mando';
      if (normalized.includes('mrp')) return 'mrp';
      if (normalized.includes('custodia')) return 'custodia';
      if (normalized.includes('mantenimiento') || normalized.includes('flota')) return 'mantenimiento';
      if (normalized.includes('navegaciones')) return 'navegaciones';
      if (normalized.includes('paa')) return 'paa';
      return null;
    };

    const handleHash = () => {
      const resolved = resolveHashTab(window.location.hash);
      if (resolved) {
        setActiveTab(resolved);
        scrollToActiveModule();
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Critical alerts count including fleet, overorders and physical discrepancies
  const criticalVesselsCount = vessels.filter((v) => v.status === 'NO_OPERATIVO' || v.status === 'PREVENTIVO').length;
  const overorderRequisitionsCount = requisitions.filter((r) => r.anomalyDetected).length;
  const criticalDiscrepanciesCount = discrepancies.filter((d) => d.status !== 'CONCILIADO' && d.severity === 'CRITICA').length;
  const pendingAlertsCount = criticalVesselsCount + overorderRequisitionsCount + criticalDiscrepanciesCount;

  // Handle action from AI Command Center
  const handleApplySystemAction = (
    action: AICommandResponse['systemAction'],
    budget?: AICommandResponse['budgetImpact']
  ) => {
    if (!action) return;

    if (action.type === 'production_order') {
      const newSerial = `UNIF-LOT-${Date.now().toString().slice(-4)}`;
      setSerializedStock((prev) => [
        {
          serialNumber: newSerial,
          itemType: 'Lote Uniformes de Combate Ripstop 65/35',
          lotNumber: `LOT-NAV-${new Date().getFullYear()}-AI`,
          manufactureDate: new Date().toISOString().slice(0, 10),
          assignedLocation: 'Maestranza Central / Taller de Corte',
          inspectionPassed: true,
          custodyChain: [
            { step: 1, name: 'Requisición', completed: true, timestamp: new Date().toISOString().slice(0, 10), officerInCharge: 'POSEIDON-LOG AI' },
            { step: 2, name: 'Compra Licitación', completed: true, timestamp: new Date().toISOString().slice(0, 10), officerInCharge: 'Oficial Mayor Marina' },
            { step: 3, name: 'Fabricación Maestranza', completed: true, timestamp: new Date().toISOString().slice(0, 10), officerInCharge: 'Taller N° 1' },
            { step: 4, name: 'Almacén General', completed: false },
            { step: 5, name: 'Pañol de Unidad', completed: false },
            { step: 6, name: 'Elemento Naval', completed: false }
          ]
        },
        ...prev
      ]);

      if (budget) {
        setZones((prev) =>
          prev.map((z) =>
            z.id === 'RN-1'
              ? { ...z, annualBudgetCommitted: z.annualBudgetCommitted + budget.totalEstimatedCost }
              : z
          )
        );
      }

      showNotification(`Orden de producción ejecutada. Lote ${newSerial} registrado en Maestranza y afectación presupuestal registrada.`);
    } else if (action.type === 'maintenance_alert') {
      setVessels((prev) =>
        prev.map((v) => {
          if (v.hullNumber === 'PO-161' || v.name.includes('Oaxaca')) {
            return {
              ...v,
              status: 'PREVENTIVO',
              criticalComponents: v.criticalComponents.map((c) =>
                c.name.includes('Turbo') ? { ...c, wearPercentage: 100, status: 'CRITICO' } : c
              )
            };
          }
          if (v.hullNumber === 'F-214' || v.name.includes('Benito')) {
            return {
              ...v,
              status: 'NO_OPERATIVO',
              criticalComponents: v.criticalComponents.map((c) =>
                c.name.includes('Turbo') ? { ...c, wearPercentage: 100, hoursRemaining: 0, status: 'CRITICO' } : c
              )
            };
          }
          return v;
        })
      );
      showNotification(`Alerta de mantenimiento aplicada. Estado de buque actualizado en tiempo real.`);
    } else {
      showNotification(`Directiva táctica procesada y sincronizada en el libro mayor de intendencia.`);
    }
  };

  // Handle MRP Production launch
  const handleExecuteProductionOrder = (result: ExplosionResult) => {
    setZones((prev) =>
      prev.map((z) =>
        z.id === 'RN-1'
          ? { ...z, annualBudgetCommitted: z.annualBudgetCommitted + result.totalProductionCost }
          : z
      )
    );

    const newLotCode = `MFG-LOT-${Date.now().toString().slice(-4)}`;
    setSerializedStock((prev) => [
      {
        serialNumber: newLotCode,
        itemType: `Lote ${result.quantity} Unidades de Manufactura Naval`,
        lotNumber: `LOT-${new Date().getFullYear()}`,
        manufactureDate: new Date().toISOString().slice(0, 10),
        assignedLocation: 'Maestranza Central / En Producción',
        inspectionPassed: true,
        custodyChain: [
          { step: 1, name: 'Requisición', completed: true, timestamp: new Date().toISOString().slice(0, 10), officerInCharge: 'Jefe de Operaciones' },
          { step: 2, name: 'Compra Licitación', completed: true, timestamp: new Date().toISOString().slice(0, 10), officerInCharge: 'Comité de Compras' },
          { step: 3, name: 'Fabricación Maestranza', completed: true, timestamp: new Date().toISOString().slice(0, 10), officerInCharge: 'Taller Naval' },
          { step: 4, name: 'Almacén General', completed: false },
          { step: 5, name: 'Pañol de Unidad', completed: false },
          { step: 6, name: 'Elemento Naval', completed: false }
        ]
      },
      ...prev
    ]);

    showNotification(`Lote de fabricación ${newLotCode} iniciado: ${result.quantity.toLocaleString('es-MX')} unidades programadas.`);
  };

  // Handle Requisition Signing
  const handleSignRequisition = (reqId: string, level: number) => {
    setRequisitions((prev) =>
      prev.map((r) => {
        if (r.id !== reqId) return r;
        const updatedChain = r.approvalChain.map((step) => {
          if (step.level === level) {
            return {
              ...step,
              signed: true,
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
              digitalFingerprint: `SHA256:${Math.random().toString(36).substring(2, 10)}...`
            };
          }
          return step;
        });

        const allSigned = updatedChain.every((c) => c.signed);
        return {
          ...r,
          approvalChain: updatedChain,
          status: allSigned ? 'APROBADO_MANDO' : 'EN_REVISION'
        };
      })
    );
    showNotification(`Firma de Nivel ${level} estampada con sello digital criptográfico para ${reqId}.`);
  };

  // Handle Supply Reorder
  const handleAddSupplyOrder = (supplyId: string, qty: number) => {
    setSupplies((prev) =>
      prev.map((s) => (s.id === supplyId ? { ...s, stockActual: s.stockActual + qty } : s))
    );
    showNotification(`Reabastecimiento registrado en catálogo para ${supplyId}: +${qty} unidades.`);
  };

  // Handle Entitlement Authorization
  const handleAuthorizeEntitlement = (militaryId: string, itemCategory: string) => {
    setPersonnel((prev) =>
      prev.map((p) => {
        if (p.militaryId !== militaryId) return p;
        return {
          ...p,
          entitlements: p.entitlements.map((e) => {
            if (e.category === itemCategory) {
              return {
                ...e,
                lastDeliveredDate: new Date().toISOString().slice(0, 10),
                currentCycleElapsedMonths: 0.1,
                status: 'BLOQUEADO_POR_TIEMPO'
              };
            }
            return e;
          })
        };
      })
    );
    showNotification(`Dotación nominal entregada a ${militaryId}. Registro biométrico sellado.`);
  };

  // Handle Vessel Status Change
  const handleUpdateVesselStatus = (vesselId: string, newStatus: OperationalStatus) => {
    setVessels((prev) =>
      prev.map((v) => (v.id === vesselId ? { ...v, status: newStatus } : v))
    );
    showNotification(`Estado de buque ${vesselId} actualizado a ${newStatus}.`);
  };

  // Handle Dry Dock Work Order
  const handleAddDryDockBudgetWorkOrder = (vesselId: string, totalCost: number) => {
    setVessels((prev) =>
      prev.map((v) => (v.id === vesselId ? { ...v, status: 'EN_DIQUE' } : v))
    );
    setZones((prev) =>
      prev.map((z) =>
        z.id === 'RN-5'
          ? { ...z, annualBudgetCommitted: z.annualBudgetCommitted + totalCost }
          : z
      )
    );
    showNotification(`Varada en dique seco y presupuesto de $${totalCost.toLocaleString('es-MX')} MXN afectado a Partida 35701.`);
  };

  // Handle Simulated Navigation Telemetry Sync
  const handleApplyNavigationTelemetry = (nav: SimulatedNavigation) => {
    setVessels((prev) =>
      prev.map((v) => {
        if (v.id === nav.vesselId || v.hullNumber === nav.hullNumber) {
          const updatedHours = v.mainEngineHours + nav.durationHours;
          const updatedComponents = v.criticalComponents.map((c) => {
            const newWear = Math.min(100, Math.round((c.wearPercentage + nav.engineWearDeltaPercent) * 10) / 10);
            return {
              ...c,
              wearPercentage: newWear,
              hoursRemaining: Math.max(0, c.hoursRemaining - nav.durationHours),
              status: (newWear >= 95 ? 'CRITICO' : newWear >= 80 ? 'ALERTA_PREVENTIVA' : 'OPTIMO') as 'OPTIMO' | 'ALERTA_PREVENTIVA' | 'CRITICO'
            };
          });
          return {
            ...v,
            mainEngineHours: updatedHours,
            status: nav.finalVesselStatus,
            criticalComponents: updatedComponents
          };
        }
        return v;
      })
    );

    // Commit fuel expense in budget
    setZones((prev) =>
      prev.map((z) =>
        z.id === 'RN-1'
          ? { ...z, annualBudgetCommitted: z.annualBudgetCommitted + nav.fuelCostMXN }
          : z
      )
    );

    showNotification(`Telemetría de derrota ${nav.id} sincronizada: +${nav.durationHours} hrs de motor para ${nav.vesselName} y $${nav.fuelCostMXN.toLocaleString('es-MX')} MXN afectados a Partida 26102.`);
  };

  // Handle Inventory Discrepancy Reconciliation
  const handleReconcileDiscrepancy = (discrepancyId: string, adjustedQty: number) => {
    setDiscrepancies((prev) =>
      prev.map((d) => {
        if (d.id !== discrepancyId) return d;
        return {
          ...d,
          physicalCount: adjustedQty,
          differenceQty: 0,
          financialImpactMXN: 0,
          status: 'CONCILIADO'
        };
      })
    );

    // Sincronizar catálogo maestro de intendencia
    const target = discrepancies.find((d) => d.id === discrepancyId);
    if (target) {
      setSupplies((prev) =>
        prev.map((s) => (s.nsnCode === target.nsnCode ? { ...s, stockActual: adjustedQty } : s))
      );
    }

    showNotification(`Discrepancia ${discrepancyId} conciliada satisfactoriamente. Stock físico sincronizado.`);
  };

  // Handle Raising Official Audit Minutes (Levantamiento de Acta de Hechos)
  const handleRaiseOfficialActa = (discrepancyId: string, notes: string) => {
    const target = discrepancies.find((d) => d.id === discrepancyId);
    const newFolio = `ACTA-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    setDiscrepancies((prev) =>
      prev.map((d) =>
        d.id === discrepancyId
          ? { ...d, status: 'ACTA_LEVANTADA', folioActa: newFolio, investigationNotes: notes }
          : d
      )
    );

    if (target) {
      const newAuditLog: ZonalAuditLog = {
        id: `LOG-DISC-${Date.now().toString().slice(-4)}`,
        zoneId: target.zoneId,
        zoneName: target.locationNode,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        auditorRank: 'Capitán de Corbeta CG.',
        auditorName: 'Carlos M. Villaseñor (Órgano Interno de Control)',
        actionTaken: `Levantamiento de Acta Administrativa por discrepancia física vs sistema de ${target.differenceQty} ${target.unit}. Folio: ${newFolio}. Notas: ${notes}`,
        affectedItem: target.itemName,
        resolutionType: 'CONCILIACION_ADMINISTRATIVA',
        status: 'EN_CURSO',
        shaHash: `SHA256:${Math.random().toString(36).substring(2, 12)}...`
      };
      setAuditLogs((prev) => [newAuditLog, ...prev]);
    }

    showNotification(`Acta ${newFolio} levantada y registrada en la bitácora zonal del Órgano Interno de Control.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar strictly conforming to Top Bar Contract */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        onOpenNewDirective={() => handleSelectTab('mando')}
        pendingAlertsCount={pendingAlertsCount}
        onLogoClick={handleReturnToPortada}
      />

      {/* PORTADA OFICIAL DEL SISTEMA (n2.jpg de la carpeta imagenes - Completa, sin cortes, sin texto encima ni difuminación) */}
      <div className="w-full bg-slate-950 border-b border-slate-300 flex justify-center items-center shadow-xs overflow-hidden">
        <img
          src="/imagenes/n2.jpg"
          alt="Portada Oficial POSEIDÓN - Sistema de Control Marítimo"
          className="w-full max-w-7xl h-auto object-contain block"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Franja Administrativa Institucional & Indicadores Clave */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-blue-900 font-bold uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-blue-800" />
                <span>DIRECCIÓN GENERAL DE LOGÍSTICA NAVAL // PLATAFORMA INTEGRAL DE GESTIÓN</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
                POSEIDÓN-LOG · Sistema Administrativo y Operativo
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Control presupuestal PAA, lista de materiales (MRP), trazabilidad nominal de inventarios y mantenimiento predictivo de la flota.
              </p>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs self-start md:self-center">
              <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700">
                Nodo Central: CG-NAV-01
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                SISTEMA OPERATIVO
              </span>
            </div>
          </div>

          {/* Operational Metrics Cards (Clean Professional Administrative Style) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mt-4 pt-3 border-t border-slate-100 text-xs font-mono">
            <button
              type="button"
              onClick={() => handleSelectTab('mantenimiento')}
              className="p-3 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center gap-3 text-left transition-colors cursor-pointer"
            >
              <div className="p-2 rounded bg-blue-100 text-blue-900">
                <Ship className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Flota Operativa</div>
                <div className="font-bold text-slate-900 tabular-nums text-sm">
                  {vessels.filter((v) => v.status === 'OPERATIVO').length} / {vessels.length} Unidades
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('mantenimiento')}
              className="p-3 rounded-md bg-slate-50 hover:bg-amber-50/60 border border-slate-200 flex items-center gap-3 text-left transition-colors cursor-pointer"
            >
              <div className="p-2 rounded bg-amber-100 text-amber-900">
                <Anchor className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">En Dique / Alerta</div>
                <div className="font-bold text-amber-800 tabular-nums text-sm">
                  {vessels.filter((v) => v.status !== 'OPERATIVO').length} Buques
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('custodia')}
              className="p-3 rounded-md bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 flex items-center gap-3 text-left transition-colors cursor-pointer"
            >
              <div className="p-2 rounded bg-emerald-100 text-emerald-900">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Lotes Maestranza</div>
                <div className="font-bold text-slate-900 tabular-nums text-sm">
                  {serializedStock.length} Serializados
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('uniformes')}
              className={`p-3 rounded-md border text-left transition-all flex items-center gap-3 group cursor-pointer ${
                activeTab === 'uniformes'
                  ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                  : 'bg-blue-50/60 hover:bg-blue-100/60 border-blue-200 text-slate-900'
              }`}
            >
              <div className={`p-2 rounded shadow-2xs ${
                activeTab === 'uniformes' ? 'bg-white text-blue-900' : 'bg-blue-900 text-white'
              }`}>
                <Shirt className="w-4 h-4" />
              </div>
              <div>
                <div className={`text-[10px] uppercase font-semibold ${
                  activeTab === 'uniformes' ? 'text-blue-100' : 'text-slate-500'
                }`}>
                  Uniformes & Cuotas
                </div>
                <div className={`font-bold tabular-nums text-sm ${
                  activeTab === 'uniformes' ? 'text-white' : 'text-blue-950'
                }`}>
                  30 Asignaciones
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectTab('armamento')}
              className={`p-3 rounded-md border text-left transition-all flex items-center gap-3 group cursor-pointer ${
                activeTab === 'armamento'
                  ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                  : 'bg-blue-50/60 hover:bg-blue-100/60 border-blue-200 text-slate-900'
              }`}
            >
              <div className={`p-2 rounded shadow-2xs ${
                activeTab === 'armamento' ? 'bg-white text-blue-900' : 'bg-blue-900 text-white'
              }`}>
                <Crosshair className="w-4 h-4" />
              </div>
              <div>
                <div className={`text-[10px] uppercase font-semibold ${
                  activeTab === 'armamento' ? 'text-blue-100' : 'text-slate-500'
                }`}>
                  Armamento
                </div>
                <div className={`font-bold tabular-nums text-sm ${
                  activeTab === 'armamento' ? 'text-white' : 'text-blue-950'
                }`}>
                  30 Registros (1:1)
                </div>
              </div>
            </button>

            {/* Discrepancy & Audit Card */}
            <button
              type="button"
              onClick={() => handleSelectTab('auditoria')}
              className={`p-3 rounded-md border text-left transition-all flex items-center gap-3 group cursor-pointer ${
                activeTab === 'auditoria'
                  ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                  : 'bg-amber-50/60 hover:bg-amber-100/60 border-amber-200 text-slate-900'
              }`}
            >
              <div className={`p-2 rounded shadow-2xs ${
                activeTab === 'auditoria' ? 'bg-white text-amber-900' : 'bg-amber-600 text-white'
              }`}>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className={`text-[10px] uppercase font-bold ${
                  activeTab === 'auditoria' ? 'text-amber-100' : 'text-amber-900'
                }`}>
                  Auditoría Zonal
                </div>
                <div className={`font-bold tabular-nums text-sm ${
                  activeTab === 'auditoria' ? 'text-white' : 'text-amber-800'
                }`}>
                  {discrepancies.filter((d) => d.status !== 'CONCILIADO').length} Discrepancias
                </div>
              </div>
            </button>

            {/* 10 Navigations Card */}
            <button
              type="button"
              onClick={() => handleSelectTab('navegaciones')}
              className={`p-3 rounded-md border text-left transition-all flex items-center gap-3 group cursor-pointer ${
                activeTab === 'navegaciones'
                  ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                  : 'bg-blue-50/70 hover:bg-blue-100/70 border-blue-200 text-slate-900'
              }`}
            >
              <div className={`p-2 rounded shadow-2xs ${
                activeTab === 'navegaciones' ? 'bg-white text-blue-900' : 'bg-blue-900 text-white'
              }`}>
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <div className={`text-[10px] uppercase font-bold ${
                  activeTab === 'navegaciones' ? 'text-blue-100' : 'text-blue-900'
                }`}>
                  10 Navegaciones
                </div>
                <div className={`font-bold tabular-nums text-sm ${
                  activeTab === 'navegaciones' ? 'text-white' : 'text-slate-900'
                }`}>
                  {navigations.length} Derrotas ZEE
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Global Alert Notification Toast */}
      {notification && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-2.5 text-xs font-mono text-blue-900 flex items-center justify-between transition-all shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
            <span className="font-medium">{notification}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-blue-700 hover:text-blue-900 font-mono text-xs font-semibold"
          >
            [Cerrar]
          </button>
        </div>
      )}

      {/* Main Content Area with Clean Professional Slate/White Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {/* Executive KPI Dashboard Panel: Real-time Budget Compliance & Fleet Availability with Modern Charts */}
        <ExecutiveKPIDashboard
          zones={zones}
          vessels={vessels}
          totalDiscrepanciesCount={discrepancies.filter((d) => d.status !== 'CONCILIADO').length}
          totalNavigationsCount={navigations.length}
          onNavigateToTab={(tab) => handleSelectTab(tab)}
        />

        {/* Active Selected Module Section (Direct Scroll Target on Top Tab Click) */}
        <section
          id="seccion-operativa-activa"
          ref={moduleSectionRef}
          className="scroll-mt-20 pt-2"
        >
          <div className="mb-4 px-3.5 py-2 rounded-lg bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 text-xs font-mono shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-slate-400 uppercase">Sección Activa:</span>
              <span className="font-bold text-white">{TAB_SECTION_LABELS[activeTab]}</span>
            </div>
            <button
              type="button"
              onClick={handleReturnToPortada}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1 transition-colors cursor-pointer text-[11px] font-semibold"
            >
              <ArrowUp className="w-3 h-3" />
              <span>Subir a Portada / KPIs</span>
            </button>
          </div>

          {activeTab === 'paa' && (
            <ModulePAA
              supplies={supplies}
              zones={zones}
              requisitions={requisitions}
              vessels={vessels}
              onSignRequisition={handleSignRequisition}
              onAddSupplyOrder={handleAddSupplyOrder}
            />
          )}

          {activeTab === 'uniformes' && (
            <ModuloUniformes
              initialPersonnel={MOCK_ASIGNACIONES_UNIFORMES}
              onOpenOrderModal={(res) => setActiveOrderModal(res)}
            />
          )}

          {activeTab === 'armamento' && (
            <ModuloArmamento
              initialAssignments={MOCK_ASIGNACIONES_ARMAMENTO}
              onOpenOrderModal={(res) => setActiveOrderModal(res)}
            />
          )}

          {activeTab === 'mapa' && (
            <NavalTacticalMap
              zones={zones}
              vessels={vessels}
              requisitions={requisitions}
              discrepancies={discrepancies}
              onSelectVessel={(vessel) => setGlobalVesselModal(vessel)}
              onNavigateToTab={(tab) => handleSelectTab(tab)}
            />
          )}

          {activeTab === 'auditoria' && (
            <ModuleDiscrepancyDashboard
              discrepancies={discrepancies}
              auditLogs={auditLogs}
              onReconcileDiscrepancy={handleReconcileDiscrepancy}
              onRaiseOfficialActa={handleRaiseOfficialActa}
            />
          )}

          {activeTab === 'mando' && (
            <AICommandCenter
              onApplySystemAction={handleApplySystemAction}
              onOpenOrderModal={(res) => setActiveOrderModal(res)}
            />
          )}

          {activeTab === 'mrp' && (
            <ModuleMRP
              products={products}
              onExecuteProductionOrder={handleExecuteProductionOrder}
            />
          )}

          {activeTab === 'custodia' && (
            <ModuleCustody
              personnel={personnel}
              serializedStock={serializedStock}
              onAuthorizeEntitlement={handleAuthorizeEntitlement}
            />
          )}

          {activeTab === 'mantenimiento' && (
            <ModuleFleet
              vessels={vessels}
              onUpdateVesselStatus={handleUpdateVesselStatus}
              onAddDryDockBudgetWorkOrder={handleAddDryDockBudgetWorkOrder}
            />
          )}

          {activeTab === 'navegaciones' && (
            <ModuleNavigations
              navigations={navigations}
              onApplyNavigationTelemetry={handleApplyNavigationTelemetry}
            />
          )}
        </section>
      </main>

      {/* Modal for Technical Orders & Official Minutes */}
      <ModalTechnicalOrder
        response={activeOrderModal}
        onClose={() => setActiveOrderModal(null)}
      />

      {/* Global Vessel Detail Modal (from map or direct trigger) */}
      <VesselNSNDetailModal
        vessel={globalVesselModal}
        supply={null}
        onClose={() => setGlobalVesselModal(null)}
        onNavigateToFleet={() => handleSelectTab('mantenimiento')}
      />

      {/* Clean Administrative Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 py-4 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-medium text-slate-600">
            POSEIDÓN-LOG // SISTEMA DE MANDO, CONTROL Y LOGÍSTICA NAVAL INTEGRAL
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>CLASIFICACIÓN: OFICIAL MILITAR</span>
            <span aria-hidden="true">·</span>
            <span>DIRECCIÓN GENERAL DE INTENDENCIA NAVAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
