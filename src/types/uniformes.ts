export type GradoJerarquicoNaval = 
  // Almirantes
  | 'Almirante'
  | 'Vicealmirante'
  | 'Contralmirante'
  // Capitanes
  | 'Capitán de Navío'
  | 'Capitán de Fragata'
  | 'Capitán de Corbeta'
  // Oficiales
  | 'Teniente de Navío'
  | 'Teniente de Fragata'
  | 'Teniente de Corbeta'
  | 'Primer Maestre'
  // Tropa / Clases y Marinería
  | 'Segundo Maestre'
  | 'Tercer Maestre'
  | 'Cabo'
  | 'Marinero';

export type CategoriaJerarquica = 
  | 'Almirantes'
  | 'Capitanes'
  | 'Oficiales'
  | 'Tropa y Marinería';

export type TipoUniformeNaval = 
  | 'Blanco de Gala'
  | 'Azul Marino de Servicios / Faena'
  | 'Camuflaje Táctico de Selva / Árido'
  | 'Marina de Guerra / Cubierta'
  | 'Caqui de Oficial de Guardia'
  | 'Overol Ignífugo Operativo';

export type EstatusEntregaUniforme = 
  | 'Entregado'
  | 'En Sastrería'
  | 'En Tránsito'
  | 'Pendiente de Sastrería';

export interface DeduccionNomina {
  folioDescuento: string; // ej. "DESC-NOM-2026-8812"
  montoUnitarioMXN: number; // ej. 1450.00
  estadoDeduccion: 'Aplicado en Nómina' | 'Pendiente de Descuento';
  fechaAplicacion?: string;
  quincenaAplicacion: string; // ej. "1a Quincena Noviembre 2026"
}

export interface UniformeAsignado {
  idUniforme: string;
  tipo: TipoUniformeNaval | string;
  talla: string; // ej. "38R", "40R", "36R", "42L"
  fechaAsignacion: string; // Formato ISO ej. "2026-10-14T09:30:00Z"
  esExcedenteNomina: boolean;
  estatus: EstatusEntregaUniforme;
  codigoLote: string; // ej. "LOTE-UNIF-2026-A1"
  folioFirmaDigital?: string; // Hash SHA-256
  deduccionNomina?: DeduccionNomina;
}

export interface PersonalMilitar {
  id: string;
  matricula: string; // ej. "SM-849201"
  nombre: string;
  grado: GradoJerarquicoNaval;
  categoriaJerarquica: CategoriaJerarquica;
  adscripcion: string; // ej. "RN-1 Tuxpan, Ver."
  zonaId: string; // "RN-1", etc.
  cantidadTotal: number; // 2 o 3 (o más)
  cargoNomina: boolean; // true si solicitó 3er uniforme (o más)
  fechaUltimaDotacion: string;
  asignaciones: UniformeAsignado[];
}

export interface ExpedienteVestuario {
  personal: PersonalMilitar;
  resumenReglamentario: {
    totalAsignados: number;
    gratuitosOficiales: number; // max 2
    excedentesNomina: number;
    montoTotalRetenidoMXN: number;
    cumplimientoNorma: 'DOTACION_COMPLETA' | 'EXCEDENTE_AUTORIZADO' | 'PENDIENTE_DOTACION';
  };
}
