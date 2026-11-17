export type EstadoArmamento = 'Activa' | 'En Custodia' | 'Devuelto';

export type CategoriaArmamentoMilitar = 
  | 'Marinería y Clases'
  | 'Oficiales y Subalternos'
  | 'Fuerzas Especiales'
  | 'Jefes y Almirantes';

export interface AsignacionArmamento {
  id: string;
  matricula: string;
  nombre: string;
  grado: string;
  categoriaJerarquica: CategoriaArmamentoMilitar;
  adscripcion: string;
  arma_asignada: string;
  numero_serie: string;
  calibre: string;
  municion_dotacion: string;
  fecha_asignacion: string; // Formato YYYY-MM-DD HH:mm
  estado: EstadoArmamento;
  observaciones: string;
  folioFirmaDigital?: string;
  armeroInspector?: string;
}

export interface ReglaArmamentoGrado {
  categoria: CategoriaArmamentoMilitar;
  descripcion: string;
  gradosAplicables: string[];
  armasPermitidas: {
    modelo: string;
    calibre: string;
    municionEstandar: string;
    tipo: 'Fusil de Asalto' | 'Pistola de Porte' | 'Carabina Táctica' | 'Subfusil Especial' | 'Fusil Antimaterial' | 'Escopeta Táctica';
  }[];
}
