export type OperationalStatus = 
  | 'OPERATIVO' 
  | 'PREVENTIVO' 
  | 'EN_DIQUE' 
  | 'NO_OPERATIVO';

export type MissionCriticality = 'EXTREMA' | 'ALTA' | 'MEDIA' | 'RUTINARIA';

export interface NavalSupplyItem {
  id: string;
  nsnCode: string; // NATO Stock Number (Código OTAN)
  name: string;
  category: 'PINTURA_MARINA' | 'ASEO_DOTACION' | 'PAPELERIA_OFICIAL' | 'QUIMICOS_SENTINA' | 'CONSUMIBLES_CUBIERTA';
  unit: string;
  unitCost: number; // in MXN
  stockActual: number;
  stockMinimo: number;
  leadTimeDays: number;
  partidaGasto: string; // ej. 29101, 25201, 21101
  specDoc: string;
}

export interface NavalZoneCenso {
  id: string;
  name: string; // ej. "RN-1 Primera Región Naval (Golfo Norte)"
  location: string;
  personnelActive: number; // censo militar
  vesselsAssigned: number;
  annualBudgetApproved: number;
  annualBudgetCommitted: number;
}

export interface HierarchicalApproval {
  level: 1 | 2 | 3 | 4;
  role: string;
  officerName: string;
  signed: boolean;
  timestamp?: string;
  digitalFingerprint?: string; // SHA-256
}

export interface RequisitionPAA {
  id: string;
  solicitante: string;
  zoneId: string;
  item: string;
  quantityRequested: number;
  historicalPerCapitaNorm: number;
  predictedDemand: number;
  anomalyDetected: boolean;
  justification: string;
  status: 'BORRADOR' | 'EN_REVISION' | 'APROBADO_MANDO' | 'OBSERVADO';
  partidaGasto: string;
  totalCost: number;
  approvalChain: HierarchicalApproval[];
}

export interface BOMComponent {
  id: string;
  name: string;
  netPerUnit: number;
  unit: string;
  technicalWastePercent: number; // merma técnica %
  unitCost: number;
  partidaPresupuestal: string;
}

export interface BOMProduct {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'UNIFORMES' | 'MOBILIARIO_TACTICO' | 'EQUIPAMIENTO';
  components: BOMComponent[];
  laborHoursPerUnit: number; // HH por unidad
  laborHourlyRate: number; // Costo por HH
  indirectCostRate: number; // % sobre costo directo (ej. 0.12 para 12%)
  defaultPartida: string;
}

export interface ExplosionResult {
  productId: string;
  quantity: number;
  componentsExplosion: {
    name: string;
    unit: string;
    netRequired: number;
    wasteAmount: number;
    grossRequired: number;
    unitCost: number;
    totalCost: number;
    partida: string;
  }[];
  totalDirectMaterialCost: number;
  totalLaborHours: number;
  totalLaborCost: number;
  indirectCost: number;
  totalProductionCost: number;
  costPerUnit: number;
  partidaAfectada: string;
  executionDate: string;
}

export interface MilitaryCredential {
  militaryId: string; // ej. "SM-984321-B"
  nfcChipUid: string;
  rank: string; // ej. "Teniente de Fragata", "Cabo Infantería de Marina"
  fullName: string;
  unit: string; // ej. "ARM Benito Juárez (PO-166)"
  status: 'ACTIVO' | 'COMISIONADO' | 'LICENCIA';
  photoPlaceholder: string;
  entitlements: {
    category: string;
    item: string;
    lastDeliveredDate: string;
    minCycleMonths: number;
    currentCycleElapsedMonths: number;
    status: 'APTO_ENTREGA' | 'BLOQUEADO_POR_TIEMPO' | 'NO_AUTORIZADO';
  }[];
}

export interface CustodyStep {
  step: 1 | 2 | 3 | 4 | 5 | 6;
  name: 'Requisición' | 'Compra Licitación' | 'Fabricación Maestranza' | 'Almacén General' | 'Pañol de Unidad' | 'Elemento Naval';
  completed: boolean;
  officerInCharge?: string;
  timestamp?: string;
  location?: string;
  verificationHash?: string;
}

export interface SerializedItem {
  serialNumber: string; // DataMatrix/RFID code
  itemType: string;
  lotNumber: string;
  manufactureDate: string;
  custodyChain: CustodyStep[];
  assignedToMilitaryId?: string;
  assignedLocation: string;
  inspectionPassed: boolean;
}

export interface NavalVessel {
  id: string;
  hullNumber: string; // ej. "PO-161"
  name: string; // ej. "ARM Oaxaca"
  vesselClass: 'PATRULLA_OCEANICA' | 'FRAGATA' | 'PATRULLA_INTERCEPTORA' | 'BUQUE_APROVISIONAMIENTO' | 'VEHICULO_TACTICO_ANFIBIO';
  displacementTons: number;
  assignedRegion: string;
  status: OperationalStatus;
  tacticalCriticality: MissionCriticality;
  currentMission: string;
  propulsionType: string;
  mainEngineHours: number; // Horómetro motor principal
  auxEngineHours: number; // Horómetro auxiliares
  overhaulLimitHours: number; // Límite para dique o overhaul
  daysInLastDryDock: number;
  lastDryDockDate: string;
  criticalComponents: {
    name: string;
    wearPercentage: number; // 0 - 100%
    hoursRemaining: number;
    status: 'OPTIMO' | 'ALERTA_PREVENTIVA' | 'CRITICO';
  }[];
}

export interface AICommandResponse {
  summary: string;
  affectedModules: string[];
  budgetImpact: {
    accountCode: string;
    accountName: string;
    totalEstimatedCost: number;
    currency: string;
  };
  technicalOrderMarkdown: string;
  systemAction?: {
    type: 'production_order' | 'maintenance_alert' | 'paa_consolidation' | 'inventory_audit' | 'general_directive';
    targetEntity: string;
    priority: MissionCriticality;
    parameters: Record<string, any>;
  };
}

export interface SimulatedNavigation {
  id: string;
  vesselId: string;
  vesselName: string;
  hullNumber: string;
  missionName: string;
  missionType: 'PATRULLAJE_ZEE' | 'INTERDICCION_MARITIMA' | 'PLAN_MARINA' | 'ESCOLTA_TACTICA' | 'HIDROGRAFIA' | 'REABASTECIMIENTO';
  originPort: string;
  destinationPort: string;
  departureDate: string;
  arrivalDate: string;
  durationHours: number;
  distanceNauticalMiles: number;
  avgSpeedKnots: number;
  fuelConsumedLiters: number;
  fuelCostMXN: number;
  crewOnboard: number;
  rationsConsumed: number;
  freshWaterTons: number;
  engineWearDeltaPercent: number;
  seaConditions: string;
  finalVesselStatus: OperationalStatus;
  incidentReport: string;
}

export interface InventoryDiscrepancy {
  id: string; // ej. "DISC-2026-081"
  nsnCode: string;
  itemName: string;
  zoneId: string; // "RN-1", "RN-2", etc.
  zoneName: string;
  locationNode: string; // ej. "Pañol Central Almacén Tuxpan"
  systemStock: number;
  physicalCount: number;
  differenceQty: number; // physical - system
  unit: string;
  unitCost: number;
  financialImpactMXN: number;
  partidaGasto: string;
  severity: 'CRITICA' | 'ALTA' | 'MODERADA' | 'LEVE';
  status: 'EN_INVESTIGACION' | 'ACTA_LEVANTADA' | 'CONCILIADO' | 'JUSTIFICADO_MERMA';
  lastAuditDate: string;
  auditorOfficer: string;
  investigationNotes: string;
  folioActa: string;
}

export interface ZonalAuditLog {
  id: string; // ej. "AUD-LOG-RN1-44"
  zoneId: string;
  zoneName: string;
  timestamp: string;
  auditorName: string;
  auditorRank: string;
  actionTaken: string;
  affectedItem: string;
  resolutionType: 'CONCILIACION_ADMINISTRATIVA' | 'SANCION_DISCIPLINARIA' | 'AJUSTE_POR_MERMA' | 'TRANSFERENCIA_INTERZONAL';
  status: 'CERRADA' | 'EN_CURSO' | 'RATIFICADA_MANDO';
  shaHash: string;
}

export * from './uniformes';

