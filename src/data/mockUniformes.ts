import { PersonalMilitar } from '../types/uniformes';

export const MOCK_ASIGNACIONES_UNIFORMES: PersonalMilitar[] = [
  // =========================================================================
  // ALMIRANTES (3 registros)
  // =========================================================================
  {
    id: 'MIL-ALM-001',
    matricula: 'SM-100291',
    nombre: 'Alm. Raymundo Pedro Morales Ángeles',
    grado: 'Almirante',
    categoriaJerarquica: 'Almirantes',
    adscripcion: 'Cuartel General del Alto Mando (CDMX)',
    zonaId: 'CG-NAV',
    cantidadTotal: 3,
    cargoNomina: true,
    fechaUltimaDotacion: '2026-10-18T10:30:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-ALM-01',
        tipo: 'Blanco de Gala',
        talla: '42R',
        fechaAsignacion: '2026-06-12T09:15:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-GALA-2026-A1',
        folioFirmaDigital: 'SHA256:8f4c2e91b7d3410a8c2d5e9f1a0b3c7d6e8f4a2b',
      },
      {
        idUniforme: 'UNIF-ALM-02',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '42R',
        fechaAsignacion: '2026-07-20T11:45:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-B3',
        folioFirmaDigital: 'SHA256:3a1b5c7d9e2f4a6b8c0d1e3f5a7b9c1d3e5f7a9b',
      },
      {
        idUniforme: 'UNIF-ALM-03',
        tipo: 'Blanco de Gala',
        talla: '42R',
        fechaAsignacion: '2026-10-18T10:30:00Z',
        esExcedenteNomina: true,
        estatus: 'Entregado',
        codigoLote: 'LOTE-GALA-2026-C2',
        folioFirmaDigital: 'SHA256:d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5',
        deduccionNomina: {
          folioDescuento: 'DESC-NOM-2026-0192',
          montoUnitarioMXN: 1850.00,
          estadoDeduccion: 'Aplicado en Nómina',
          fechaAplicacion: '2026-10-31T00:00:00Z',
          quincenaAplicacion: '2a Quincena Octubre 2026'
        }
      }
    ]
  },
  {
    id: 'MIL-ALM-002',
    matricula: 'SM-104820',
    nombre: 'Valm. Héctor Daniel López Camacho',
    grado: 'Vicealmirante',
    categoriaJerarquica: 'Almirantes',
    adscripcion: 'Primera Región Naval (Tuxpan, Ver.)',
    zonaId: 'RN-1',
    cantidadTotal: 2,
    cargoNomina: false,
    fechaUltimaDotacion: '2026-08-14T08:00:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-VALM-01',
        tipo: 'Blanco de Gala',
        talla: '40R',
        fechaAsignacion: '2026-06-05T12:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-GALA-2026-A1',
        folioFirmaDigital: 'SHA256:7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c',
      },
      {
        idUniforme: 'UNIF-VALM-02',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '40R',
        fechaAsignacion: '2026-08-14T08:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-B3',
        folioFirmaDigital: 'SHA256:1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      }
    ]
  },
  {
    id: 'MIL-ALM-003',
    matricula: 'SM-119302',
    nombre: 'Calm. Fernando Guillermo Silva Mier',
    grado: 'Contralmirante',
    categoriaJerarquica: 'Almirantes',
    adscripcion: 'Segunda Región Naval (Ensenada, B.C.)',
    zonaId: 'RN-2',
    cantidadTotal: 3,
    cargoNomina: true,
    fechaUltimaDotacion: '2026-10-02T14:15:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-CALM-01',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '40L',
        fechaAsignacion: '2026-05-22T10:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-A2',
        folioFirmaDigital: 'SHA256:9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
      },
      {
        idUniforme: 'UNIF-CALM-02',
        tipo: 'Camuflaje Táctico de Selva / Árido',
        talla: '40L',
        fechaAsignacion: '2026-07-11T13:30:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-TACT-2026-M1',
        folioFirmaDigital: 'SHA256:5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
      },
      {
        idUniforme: 'UNIF-CALM-03',
        tipo: 'Blanco de Gala',
        talla: '40L',
        fechaAsignacion: '2026-10-02T14:15:00Z',
        esExcedenteNomina: true,
        estatus: 'Entregado',
        codigoLote: 'LOTE-GALA-2026-B2',
        folioFirmaDigital: 'SHA256:8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c',
        deduccionNomina: {
          folioDescuento: 'DESC-NOM-2026-0244',
          montoUnitarioMXN: 1850.00,
          estadoDeduccion: 'Aplicado en Nómina',
          fechaAplicacion: '2026-10-15T00:00:00Z',
          quincenaAplicacion: '1a Quincena Octubre 2026'
        }
      }
    ]
  },

  // =========================================================================
  // CAPITANES (6 registros)
  // =========================================================================
  {
    id: 'MIL-CAP-004',
    matricula: 'SM-205119',
    nombre: 'Cap. Nav. CG. DEM. Alejandro Morales Viveros',
    grado: 'Capitán de Navío',
    categoriaJerarquica: 'Capitanes',
    adscripcion: 'Cuarta Región Naval (Mazatlán, Sin.)',
    zonaId: 'RN-4',
    cantidadTotal: 2,
    cargoNomina: false,
    fechaUltimaDotacion: '2026-08-25T09:20:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-CN-01',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '38R',
        fechaAsignacion: '2026-06-10T11:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-B1',
        folioFirmaDigital: 'SHA256:4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b',
      },
      {
        idUniforme: 'UNIF-CN-02',
        tipo: 'Camuflaje Táctico de Selva / Árido',
        talla: '38R',
        fechaAsignacion: '2026-08-25T09:20:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-TACT-2026-N2',
        folioFirmaDigital: 'SHA256:1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
      }
    ]
  },
  {
    id: 'MIL-CAP-005',
    matricula: 'SM-218490',
    nombre: 'Cap. Nav. IM. DEM. Sergio Arturo Trejo Guzmán',
    grado: 'Capitán de Navío',
    categoriaJerarquica: 'Capitanes',
    adscripcion: 'Tercera Región Naval (Chetumal / Isla Mujeres)',
    zonaId: 'RN-3',
    cantidadTotal: 3,
    cargoNomina: true,
    fechaUltimaDotacion: '2026-10-22T16:00:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-CN-03',
        tipo: 'Camuflaje Táctico de Selva / Árido',
        talla: '42R',
        fechaAsignacion: '2026-05-18T08:30:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-TACT-2026-M1',
        folioFirmaDigital: 'SHA256:3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e',
      },
      {
        idUniforme: 'UNIF-CN-04',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '42R',
        fechaAsignacion: '2026-07-29T10:15:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-C2',
        folioFirmaDigital: 'SHA256:7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a',
      },
      {
        idUniforme: 'UNIF-CN-05',
        tipo: 'Camuflaje Táctico de Selva / Árido',
        talla: '42R',
        fechaAsignacion: '2026-10-22T16:00:00Z',
        esExcedenteNomina: true,
        estatus: 'Entregado',
        codigoLote: 'LOTE-TACT-2026-P3',
        folioFirmaDigital: 'SHA256:0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d',
        deduccionNomina: {
          folioDescuento: 'DESC-NOM-2026-0311',
          montoUnitarioMXN: 1450.00,
          estadoDeduccion: 'Aplicado en Nómina',
          fechaAplicacion: '2026-10-31T00:00:00Z',
          quincenaAplicacion: '2a Quincena Octubre 2026'
        }
      }
    ]
  },
  {
    id: 'MIL-CAP-006',
    matricula: 'SM-230914',
    nombre: 'Cap. Frag. CG. Rodrigo Vargas Benítez',
    grado: 'Capitán de Fragata',
    categoriaJerarquica: 'Capitanes',
    adscripcion: 'Quinta Región Naval (Astillero 20 Salina Cruz)',
    zonaId: 'RN-5',
    cantidadTotal: 2,
    cargoNomina: false,
    fechaUltimaDotacion: '2026-07-15T09:45:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-CF-01',
        tipo: 'Marina de Guerra / Cubierta',
        talla: '38R',
        fechaAsignacion: '2026-05-30T10:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-CUB-2026-A1',
        folioFirmaDigital: 'SHA256:2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c',
      },
      {
        idUniforme: 'UNIF-CF-02',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '38R',
        fechaAsignacion: '2026-07-15T09:45:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-B2',
        folioFirmaDigital: 'SHA256:6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
      }
    ]
  },
  {
    id: 'MIL-CAP-007',
    matricula: 'SM-245802',
    nombre: 'Cap. Frag. ANPA. DEM. Patricia Orozco Salgado',
    grado: 'Capitán de Fragata',
    categoriaJerarquica: 'Capitanes',
    adscripcion: 'Base Aeronaval de Veracruz (RN-1)',
    zonaId: 'RN-1',
    cantidadTotal: 3,
    cargoNomina: true,
    fechaUltimaDotacion: '2026-11-01T11:00:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-CF-03',
        tipo: 'Overol Ignífugo Operativo',
        talla: '36R',
        fechaAsignacion: '2026-06-19T08:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-AVIA-2026-O1',
        folioFirmaDigital: 'SHA256:9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
      },
      {
        idUniforme: 'UNIF-CF-04',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '36R',
        fechaAsignacion: '2026-08-03T12:30:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-C1',
        folioFirmaDigital: 'SHA256:1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c',
      },
      {
        idUniforme: 'UNIF-CF-05',
        tipo: 'Blanco de Gala',
        talla: '36R',
        fechaAsignacion: '2026-11-01T11:00:00Z',
        esExcedenteNomina: true,
        estatus: 'En Sastrería',
        codigoLote: 'LOTE-GALA-2026-D1',
        folioFirmaDigital: 'SHA256:5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
        deduccionNomina: {
          folioDescuento: 'DESC-NOM-2026-0418',
          montoUnitarioMXN: 1850.00,
          estadoDeduccion: 'Pendiente de Descuento',
          quincenaAplicacion: '1a Quincena Noviembre 2026'
        }
      }
    ]
  },
  {
    id: 'MIL-CAP-008',
    matricula: 'SM-259104',
    nombre: 'Cap. Corb. CG. Manuel Enrique Cárdenas Gil',
    grado: 'Capitán de Corbeta',
    categoriaJerarquica: 'Capitanes',
    adscripcion: 'Sexta Región Naval (Cd. del Carmen, Camp.)',
    zonaId: 'RN-6',
    cantidadTotal: 2,
    cargoNomina: false,
    fechaUltimaDotacion: '2026-09-08T15:10:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-CC-01',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '40R',
        fechaAsignacion: '2026-06-25T14:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-B3',
        folioFirmaDigital: 'SHA256:8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d',
      },
      {
        idUniforme: 'UNIF-CC-02',
        tipo: 'Marina de Guerra / Cubierta',
        talla: '40R',
        fechaAsignacion: '2026-09-08T15:10:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-CUB-2026-B1',
        folioFirmaDigital: 'SHA256:2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e',
      }
    ]
  },
  {
    id: 'MIL-CAP-009',
    matricula: 'SM-267812',
    nombre: 'Cap. Corb. IM. Luis Ignacio Santamaría Peña',
    grado: 'Capitán de Corbeta',
    categoriaJerarquica: 'Capitanes',
    adscripcion: 'Fuerza de Reacción Inmediata ZEE Pacífico',
    zonaId: 'RN-2',
    cantidadTotal: 3,
    cargoNomina: true,
    fechaUltimaDotacion: '2026-10-15T11:45:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-CC-03',
        tipo: 'Camuflaje Táctico de Selva / Árido',
        talla: '38L',
        fechaAsignacion: '2026-05-14T09:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-TACT-2026-M1',
        folioFirmaDigital: 'SHA256:4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a',
      },
      {
        idUniforme: 'UNIF-CC-04',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '38L',
        fechaAsignacion: '2026-07-21T10:20:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-C2',
        folioFirmaDigital: 'SHA256:9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c',
      },
      {
        idUniforme: 'UNIF-CC-05',
        tipo: 'Camuflaje Táctico de Selva / Árido',
        talla: '38L',
        fechaAsignacion: '2026-10-15T11:45:00Z',
        esExcedenteNomina: true,
        estatus: 'Entregado',
        codigoLote: 'LOTE-TACT-2026-P2',
        folioFirmaDigital: 'SHA256:6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f',
        deduccionNomina: {
          folioDescuento: 'DESC-NOM-2026-0509',
          montoUnitarioMXN: 1450.00,
          estadoDeduccion: 'Aplicado en Nómina',
          fechaAplicacion: '2026-10-31T00:00:00Z',
          quincenaAplicacion: '2a Quincena Octubre 2026'
        }
      }
    ]
  },

  // =========================================================================
  // OFICIALES (9 registros)
  // =========================================================================
  {
    id: 'MIL-OFI-010',
    matricula: 'SM-310492',
    nombre: 'Ten. Nav. CG. Guillermo E. Zúñiga Rangel',
    grado: 'Teniente de Navío',
    categoriaJerarquica: 'Oficiales',
    adscripcion: 'ARM Benito Juárez (PO-166) / RN-1',
    zonaId: 'RN-1',
    cantidadTotal: 2,
    cargoNomina: false,
    fechaUltimaDotacion: '2026-08-10T10:00:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-TN-01',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '38R',
        fechaAsignacion: '2026-06-01T09:30:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-B1',
        folioFirmaDigital: 'SHA256:1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b',
      },
      {
        idUniforme: 'UNIF-TN-02',
        tipo: 'Marina de Guerra / Cubierta',
        talla: '38R',
        fechaAsignacion: '2026-08-10T10:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-CUB-2026-A2',
        folioFirmaDigital: 'SHA256:2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c',
      }
    ]
  },
  {
    id: 'MIL-OFI-011',
    matricula: 'SM-321855',
    nombre: 'Ten. Nav. SIA. Ing. Sofía Paulina Almonte Ruiz',
    grado: 'Teniente de Navío',
    categoriaJerarquica: 'Oficiales',
    adscripcion: 'Dirección de Comunicaciones C4I (CDMX)',
    zonaId: 'CG-NAV',
    cantidadTotal: 3,
    cargoNomina: true,
    fechaUltimaDotacion: '2026-10-28T09:15:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-TN-03',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '36R',
        fechaAsignacion: '2026-05-11T12:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-A1',
        folioFirmaDigital: 'SHA256:3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d',
      },
      {
        idUniforme: 'UNIF-TN-04',
        tipo: 'Blanco de Gala',
        talla: '36R',
        fechaAsignacion: '2026-07-16T14:40:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-GALA-2026-B1',
        folioFirmaDigital: 'SHA256:4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e',
      },
      {
        idUniforme: 'UNIF-TN-05',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '36R',
        fechaAsignacion: '2026-10-28T09:15:00Z',
        esExcedenteNomina: true,
        estatus: 'En Tránsito',
        codigoLote: 'LOTE-SERV-2026-D3',
        folioFirmaDigital: 'SHA256:5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f',
        deduccionNomina: {
          folioDescuento: 'DESC-NOM-2026-0612',
          montoUnitarioMXN: 1450.00,
          estadoDeduccion: 'Pendiente de Descuento',
          quincenaAplicacion: '1a Quincena Noviembre 2026'
        }
      }
    ]
  },
  {
    id: 'MIL-OFI-012',
    matricula: 'SM-334901',
    nombre: 'Ten. Frag. CG. Daniel Alberto Montesinos Lara',
    grado: 'Teniente de Fragata',
    categoriaJerarquica: 'Oficiales',
    adscripcion: 'ARM Oaxaca (PO-161) / RN-1',
    zonaId: 'RN-1',
    cantidadTotal: 2,
    cargoNomina: false,
    fechaUltimaDotacion: '2026-09-03T11:25:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-TF-01',
        tipo: 'Marina de Guerra / Cubierta',
        talla: '40R',
        fechaAsignacion: '2026-06-08T10:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-CUB-2026-A1',
        folioFirmaDigital: 'SHA256:6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a',
      },
      {
        idUniforme: 'UNIF-TF-02',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '40R',
        fechaAsignacion: '2026-09-03T11:25:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-C1',
        folioFirmaDigital: 'SHA256:7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b',
      }
    ]
  },
  {
    id: 'MIL-OFI-013',
    matricula: 'SM-348120',
    nombre: 'Ten. Frag. IM. Javier Orlando Peñaloza Cano',
    grado: 'Teniente de Fragata',
    categoriaJerarquica: 'Oficiales',
    adscripcion: 'Batallón de Infantería de Marina N° 12 (RN-3)',
    zonaId: 'RN-3',
    cantidadTotal: 3,
    cargoNomina: true,
    fechaUltimaDotacion: '2026-10-14T15:30:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-TF-03',
        tipo: 'Camuflaje Táctico de Selva / Árido',
        talla: '38R',
        fechaAsignacion: '2026-05-29T08:15:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-TACT-2026-M1',
        folioFirmaDigital: 'SHA256:8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c',
      },
      {
        idUniforme: 'UNIF-TF-04',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '38R',
        fechaAsignacion: '2026-07-22T13:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-B2',
        folioFirmaDigital: 'SHA256:9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d',
      },
      {
        idUniforme: 'UNIF-TF-05',
        tipo: 'Camuflaje Táctico de Selva / Árido',
        talla: '38R',
        fechaAsignacion: '2026-10-14T15:30:00Z',
        esExcedenteNomina: true,
        estatus: 'Entregado',
        codigoLote: 'LOTE-TACT-2026-P1',
        folioFirmaDigital: 'SHA256:0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e',
        deduccionNomina: {
          folioDescuento: 'DESC-NOM-2026-0731',
          montoUnitarioMXN: 1450.00,
          estadoDeduccion: 'Aplicado en Nómina',
          fechaAplicacion: '2026-10-31T00:00:00Z',
          quincenaAplicacion: '2a Quincena Octubre 2026'
        }
      }
    ]
  },
  {
    id: 'MIL-OFI-014',
    matricula: 'SM-359021',
    nombre: 'Ten. Corb. CG. Brenda Mariel Covarrubias Paz',
    grado: 'Teniente de Corbeta',
    categoriaJerarquica: 'Oficiales',
    adscripcion: 'ARM Chiapas (PO-165) / RN-4 Mazatlán',
    zonaId: 'RN-4',
    cantidadTotal: 2,
    cargoNomina: false,
    fechaUltimaDotacion: '2026-08-19T10:40:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-TC-01',
        tipo: 'Marina de Guerra / Cubierta',
        talla: '36R',
        fechaAsignacion: '2026-06-15T09:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-CUB-2026-A1',
        folioFirmaDigital: 'SHA256:1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f',
      },
      {
        idUniforme: 'UNIF-TC-02',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '36R',
        fechaAsignacion: '2026-08-19T10:40:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-C2',
        folioFirmaDigital: 'SHA256:2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a',
      }
    ]
  },
  {
    id: 'MIL-OFI-015',
    matricula: 'SM-367410',
    nombre: 'Ten. Corb. Serv. Nav. Med. Esteban Téllez Girón',
    grado: 'Teniente de Corbeta',
    categoriaJerarquica: 'Oficiales',
    adscripcion: 'Hospital Naval Regional de Veracruz (RN-1)',
    zonaId: 'RN-1',
    cantidadTotal: 3,
    cargoNomina: true,
    fechaUltimaDotacion: '2026-11-03T08:20:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-TC-03',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '40R',
        fechaAsignacion: '2026-06-03T11:15:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-B1',
        folioFirmaDigital: 'SHA256:3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b',
      },
      {
        idUniforme: 'UNIF-TC-04',
        tipo: 'Blanco de Gala',
        talla: '40R',
        fechaAsignacion: '2026-07-30T16:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-GALA-2026-B2',
        folioFirmaDigital: 'SHA256:4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c',
      },
      {
        idUniforme: 'UNIF-TC-05',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '40R',
        fechaAsignacion: '2026-11-03T08:20:00Z',
        esExcedenteNomina: true,
        estatus: 'En Sastrería',
        codigoLote: 'LOTE-SERV-2026-D2',
        folioFirmaDigital: 'SHA256:5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d',
        deduccionNomina: {
          folioDescuento: 'DESC-NOM-2026-0840',
          montoUnitarioMXN: 1450.00,
          estadoDeduccion: 'Pendiente de Descuento',
          quincenaAplicacion: '1a Quincena Noviembre 2026'
        }
      }
    ]
  },
  {
    id: 'MIL-OFI-016',
    matricula: 'SM-378904',
    nombre: '1er. Mtre. CG. Cond. Eloy Santillán Godínez',
    grado: 'Primer Maestre',
    categoriaJerarquica: 'Oficiales',
    adscripcion: 'Estación Naval de Búsqueda y Rescate ENSAR Ensenada',
    zonaId: 'RN-2',
    cantidadTotal: 2,
    cargoNomina: false,
    fechaUltimaDotacion: '2026-07-25T14:10:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-1M-01',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '38R',
        fechaAsignacion: '2026-05-19T09:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-A2',
        folioFirmaDigital: 'SHA256:6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e',
      },
      {
        idUniforme: 'UNIF-1M-02',
        tipo: 'Marina de Guerra / Cubierta',
        talla: '38R',
        fechaAsignacion: '2026-07-25T14:10:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-CUB-2026-B1',
        folioFirmaDigital: 'SHA256:7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f',
      }
    ]
  },
  {
    id: 'MIL-OFI-017',
    matricula: 'SM-389101',
    nombre: '1er. Mtre. Maq. Héctor Rolando Ceballos',
    grado: 'Primer Maestre',
    categoriaJerarquica: 'Oficiales',
    adscripcion: 'ARM Montes Azules (BAL-01) / RN-5 Salina Cruz',
    zonaId: 'RN-5',
    cantidadTotal: 3,
    cargoNomina: true,
    fechaUltimaDotacion: '2026-10-11T12:00:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-1M-03',
        tipo: 'Overol Ignífugo Operativo',
        talla: '42R',
        fechaAsignacion: '2026-05-15T08:30:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-OVER-2026-A1',
        folioFirmaDigital: 'SHA256:8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a',
      },
      {
        idUniforme: 'UNIF-1M-04',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '42R',
        fechaAsignacion: '2026-07-18T10:50:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-C1',
        folioFirmaDigital: 'SHA256:9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b',
      },
      {
        idUniforme: 'UNIF-1M-05',
        tipo: 'Overol Ignífugo Operativo',
        talla: '42R',
        fechaAsignacion: '2026-10-11T12:00:00Z',
        esExcedenteNomina: true,
        estatus: 'Entregado',
        codigoLote: 'LOTE-OVER-2026-C1',
        folioFirmaDigital: 'SHA256:0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c',
        deduccionNomina: {
          folioDescuento: 'DESC-NOM-2026-0955',
          montoUnitarioMXN: 1450.00,
          estadoDeduccion: 'Aplicado en Nómina',
          fechaAplicacion: '2026-10-15T00:00:00Z',
          quincenaAplicacion: '1a Quincena Octubre 2026'
        }
      }
    ]
  },
  {
    id: 'MIL-OFI-018',
    matricula: 'SM-399420',
    nombre: '1er. Mtre. IM. Tir. Esp. Mario Alberto Zepeda',
    grado: 'Primer Maestre',
    categoriaJerarquica: 'Oficiales',
    adscripcion: 'Sector Naval de Tuxpan (RN-1)',
    zonaId: 'RN-1',
    cantidadTotal: 2,
    cargoNomina: false,
    fechaUltimaDotacion: '2026-08-29T16:20:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-1M-06',
        tipo: 'Camuflaje Táctico de Selva / Árido',
        talla: '40R',
        fechaAsignacion: '2026-06-20T08:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-TACT-2026-N1',
        folioFirmaDigital: 'SHA256:1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d',
      },
      {
        idUniforme: 'UNIF-1M-07',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '40R',
        fechaAsignacion: '2026-08-29T16:20:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-C3',
        folioFirmaDigital: 'SHA256:2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e',
      }
    ]
  },

  // =========================================================================
  // TROPA / CLASES Y MARINERÍA (12 registros)
  // =========================================================================
  {
    id: 'MIL-TRP-019',
    matricula: 'SM-410921',
    nombre: '2do. Mtre. IM. FUS. Víctor Hugo Salcedo Nava',
    grado: 'Segundo Maestre',
    categoriaJerarquica: 'Tropa y Marinería',
    adscripcion: 'Fuerza Naval del Golfo (RN-1 Veracruz)',
    zonaId: 'RN-1',
    cantidadTotal: 2,
    cargoNomina: false,
    fechaUltimaDotacion: '2026-07-14T09:10:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-2M-01',
        tipo: 'Camuflaje Táctico de Selva / Árido',
        talla: '38R',
        fechaAsignacion: '2026-05-18T10:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-TACT-2026-M1',
        folioFirmaDigital: 'SHA256:3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f',
      },
      {
        idUniforme: 'UNIF-2M-02',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '38R',
        fechaAsignacion: '2026-07-14T09:10:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-B1',
        folioFirmaDigital: 'SHA256:4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a',
      }
    ]
  },
  {
    id: 'MIL-TRP-020',
    matricula: 'SM-421034',
    nombre: '2do. Mtre. Mot. Armando Esquivel Paredes',
    grado: 'Segundo Maestre',
    categoriaJerarquica: 'Tropa y Marinería',
    adscripcion: 'Patrulla Interceptora ARM Algol (PI-1102) / RN-2',
    zonaId: 'RN-2',
    cantidadTotal: 3,
    cargoNomina: true,
    fechaUltimaDotacion: '2026-10-19T13:40:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-2M-03',
        tipo: 'Marina de Guerra / Cubierta',
        talla: '40R',
        fechaAsignacion: '2026-06-05T09:20:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-CUB-2026-A1',
        folioFirmaDigital: 'SHA256:5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b',
      },
      {
        idUniforme: 'UNIF-2M-04',
        tipo: 'Overol Ignífugo Operativo',
        talla: '40R',
        fechaAsignacion: '2026-08-07T11:30:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-OVER-2026-B1',
        folioFirmaDigital: 'SHA256:6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c',
      },
      {
        idUniforme: 'UNIF-2M-05',
        tipo: 'Overol Ignífugo Operativo',
        talla: '40R',
        fechaAsignacion: '2026-10-19T13:40:00Z',
        esExcedenteNomina: true,
        estatus: 'Entregado',
        codigoLote: 'LOTE-OVER-2026-D1',
        folioFirmaDigital: 'SHA256:7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d',
        deduccionNomina: {
          folioDescuento: 'DESC-NOM-2026-1019',
          montoUnitarioMXN: 1450.00,
          estadoDeduccion: 'Aplicado en Nómina',
          fechaAplicacion: '2026-10-31T00:00:00Z',
          quincenaAplicacion: '2a Quincena Octubre 2026'
        }
      }
    ]
  },
  {
    id: 'MIL-TRP-021',
    matricula: 'SM-432810',
    nombre: '3er. Mtre. Eléct. Gonzalo Dávila Monroy',
    grado: 'Tercer Maestre',
    categoriaJerarquica: 'Tropa y Marinería',
    adscripcion: 'Astillero de Marina N° 20 (RN-5 Salina Cruz)',
    zonaId: 'RN-5',
    cantidadTotal: 2,
    cargoNomina: false,
    fechaUltimaDotacion: '2026-09-12T10:15:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-3M-01',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '38R',
        fechaAsignacion: '2026-06-18T14:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-B2',
        folioFirmaDigital: 'SHA256:8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e',
      },
      {
        idUniforme: 'UNIF-3M-02',
        tipo: 'Marina de Guerra / Cubierta',
        talla: '38R',
        fechaAsignacion: '2026-09-12T10:15:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-CUB-2026-B1',
        folioFirmaDigital: 'SHA256:9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f',
      }
    ]
  },
  {
    id: 'MIL-TRP-022',
    matricula: 'SM-445109',
    nombre: '3er. Mtre. IM. COM. César Augusto Beltrán',
    grado: 'Tercer Maestre',
    categoriaJerarquica: 'Tropa y Marinería',
    adscripcion: 'Sector Naval de Cozumel (RN-3)',
    zonaId: 'RN-3',
    cantidadTotal: 3,
    cargoNomina: true,
    fechaUltimaDotacion: '2026-10-25T11:10:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-3M-03',
        tipo: 'Camuflaje Táctico de Selva / Árido',
        talla: '36R',
        fechaAsignacion: '2026-05-24T08:30:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-TACT-2026-M1',
        folioFirmaDigital: 'SHA256:0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a',
      },
      {
        idUniforme: 'UNIF-3M-04',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '36R',
        fechaAsignacion: '2026-07-19T12:40:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-B3',
        folioFirmaDigital: 'SHA256:1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b',
      },
      {
        idUniforme: 'UNIF-3M-05',
        tipo: 'Camuflaje Táctico de Selva / Árido',
        talla: '36R',
        fechaAsignacion: '2026-10-25T11:10:00Z',
        esExcedenteNomina: true,
        estatus: 'En Tránsito',
        codigoLote: 'LOTE-TACT-2026-P3',
        folioFirmaDigital: 'SHA256:2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c',
        deduccionNomina: {
          folioDescuento: 'DESC-NOM-2026-1125',
          montoUnitarioMXN: 1450.00,
          estadoDeduccion: 'Pendiente de Descuento',
          quincenaAplicacion: '1a Quincena Noviembre 2026'
        }
      }
    ]
  },
  {
    id: 'MIL-TRP-023',
    matricula: 'SM-459203',
    nombre: 'Cabo IM. FUS. Jorge Luis Tenorio Galván',
    grado: 'Cabo',
    categoriaJerarquica: 'Tropa y Marinería',
    adscripcion: 'Operación Refuerzo Sonda (RN-6 Cd. del Carmen)',
    zonaId: 'RN-6',
    cantidadTotal: 2,
    cargoNomina: false,
    fechaUltimaDotacion: '2026-08-14T09:00:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-CAB-01',
        tipo: 'Camuflaje Táctico de Selva / Árido',
        talla: '38R',
        fechaAsignacion: '2026-06-11T10:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-TACT-2026-N1',
        folioFirmaDigital: 'SHA256:3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d',
      },
      {
        idUniforme: 'UNIF-CAB-02',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '38R',
        fechaAsignacion: '2026-08-14T09:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-C1',
        folioFirmaDigital: 'SHA256:4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e',
      }
    ]
  },
  {
    id: 'MIL-TRP-024',
    matricula: 'SM-468112',
    nombre: 'Cabo CG. Maniob. Francisco Javier Rendón',
    grado: 'Cabo',
    categoriaJerarquica: 'Tropa y Marinería',
    adscripcion: 'ARM Sonora (PO-162) / RN-4 Mazatlán',
    zonaId: 'RN-4',
    cantidadTotal: 3,
    cargoNomina: true,
    fechaUltimaDotacion: '2026-10-09T15:20:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-CAB-03',
        tipo: 'Marina de Guerra / Cubierta',
        talla: '40R',
        fechaAsignacion: '2026-05-20T08:30:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-CUB-2026-A1',
        folioFirmaDigital: 'SHA256:5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f',
      },
      {
        idUniforme: 'UNIF-CAB-04',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '40R',
        fechaAsignacion: '2026-07-28T11:45:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-B3',
        folioFirmaDigital: 'SHA256:6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a',
      },
      {
        idUniforme: 'UNIF-CAB-05',
        tipo: 'Marina de Guerra / Cubierta',
        talla: '40R',
        fechaAsignacion: '2026-10-09T15:20:00Z',
        esExcedenteNomina: true,
        estatus: 'Entregado',
        codigoLote: 'LOTE-CUB-2026-C1',
        folioFirmaDigital: 'SHA256:7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b',
        deduccionNomina: {
          folioDescuento: 'DESC-NOM-2026-1209',
          montoUnitarioMXN: 1450.00,
          estadoDeduccion: 'Aplicado en Nómina',
          fechaAplicacion: '2026-10-15T00:00:00Z',
          quincenaAplicacion: '1a Quincena Octubre 2026'
        }
      }
    ]
  },
  {
    id: 'MIL-TRP-025',
    matricula: 'SM-479201',
    nombre: 'Cabo Serv. Intend. Naval Lucía Mendoza Arcos',
    grado: 'Cabo',
    categoriaJerarquica: 'Tropa y Marinería',
    adscripcion: 'Pañol General de Intendencia (RN-1 Veracruz)',
    zonaId: 'RN-1',
    cantidadTotal: 2,
    cargoNomina: false,
    fechaUltimaDotacion: '2026-08-31T11:00:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-CAB-06',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '36R',
        fechaAsignacion: '2026-06-04T09:15:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-B1',
        folioFirmaDigital: 'SHA256:8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c',
      },
      {
        idUniforme: 'UNIF-CAB-07',
        tipo: 'Blanco de Gala',
        talla: '36R',
        fechaAsignacion: '2026-08-31T11:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-GALA-2026-C1',
        folioFirmaDigital: 'SHA256:9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d',
      }
    ]
  },
  {
    id: 'MIL-TRP-026',
    matricula: 'SM-489033',
    nombre: 'Cabo Maq. Aux. Ricardo Pineda Sotomayor',
    grado: 'Cabo',
    categoriaJerarquica: 'Tropa y Marinería',
    adscripcion: 'ARM Guanajuato (PO-163) / RN-1 Tuxpan',
    zonaId: 'RN-1',
    cantidadTotal: 3,
    cargoNomina: true,
    fechaUltimaDotacion: '2026-10-30T10:15:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-CAB-08',
        tipo: 'Overol Ignífugo Operativo',
        talla: '38R',
        fechaAsignacion: '2026-05-17T08:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-OVER-2026-A1',
        folioFirmaDigital: 'SHA256:0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a2b4c6d8e',
      },
      {
        idUniforme: 'UNIF-CAB-09',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '38R',
        fechaAsignacion: '2026-07-23T14:30:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-B3',
        folioFirmaDigital: 'SHA256:1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f',
      },
      {
        idUniforme: 'UNIF-CAB-10',
        tipo: 'Overol Ignífugo Operativo',
        talla: '38R',
        fechaAsignacion: '2026-10-30T10:15:00Z',
        esExcedenteNomina: true,
        estatus: 'Pendiente de Sastrería',
        codigoLote: 'LOTE-OVER-2026-D1',
        folioFirmaDigital: 'SHA256:2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a',
        deduccionNomina: {
          folioDescuento: 'DESC-NOM-2026-1330',
          montoUnitarioMXN: 1450.00,
          estadoDeduccion: 'Pendiente de Descuento',
          quincenaAplicacion: '1a Quincena Noviembre 2026'
        }
      }
    ]
  },
  {
    id: 'MIL-TRP-027',
    matricula: 'SM-501844',
    nombre: 'Mno. IM. Fusilero Mateo Alejandro Barrios',
    grado: 'Marinero',
    categoriaJerarquica: 'Tropa y Marinería',
    adscripcion: 'Tercera Brigada de Infantería de Marina (RN-3)',
    zonaId: 'RN-3',
    cantidadTotal: 2,
    cargoNomina: false,
    fechaUltimaDotacion: '2026-07-09T08:45:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-MNO-01',
        tipo: 'Camuflaje Táctico de Selva / Árido',
        talla: '38R',
        fechaAsignacion: '2026-05-12T10:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-TACT-2026-M1',
        folioFirmaDigital: 'SHA256:3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b',
      },
      {
        idUniforme: 'UNIF-MNO-02',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '38R',
        fechaAsignacion: '2026-07-09T08:45:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-B1',
        folioFirmaDigital: 'SHA256:4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c',
      }
    ]
  },
  {
    id: 'MIL-TRP-028',
    matricula: 'SM-512930',
    nombre: 'Mno. CG. Cub. Brayan Alexis Quintana Mora',
    grado: 'Marinero',
    categoriaJerarquica: 'Tropa y Marinería',
    adscripcion: 'ARM Coahuila (PO-164) / RN-3 Chetumal',
    zonaId: 'RN-3',
    cantidadTotal: 3,
    cargoNomina: true,
    fechaUltimaDotacion: '2026-10-17T14:50:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-MNO-03',
        tipo: 'Marina de Guerra / Cubierta',
        talla: '38L',
        fechaAsignacion: '2026-06-02T08:20:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-CUB-2026-A1',
        folioFirmaDigital: 'SHA256:5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d',
      },
      {
        idUniforme: 'UNIF-MNO-04',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '38L',
        fechaAsignacion: '2026-08-11T13:10:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-C2',
        folioFirmaDigital: 'SHA256:6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e',
      },
      {
        idUniforme: 'UNIF-MNO-05',
        tipo: 'Marina de Guerra / Cubierta',
        talla: '38L',
        fechaAsignacion: '2026-10-17T14:50:00Z',
        esExcedenteNomina: true,
        estatus: 'Entregado',
        codigoLote: 'LOTE-CUB-2026-C2',
        folioFirmaDigital: 'SHA256:7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f',
        deduccionNomina: {
          folioDescuento: 'DESC-NOM-2026-1417',
          montoUnitarioMXN: 1450.00,
          estadoDeduccion: 'Aplicado en Nómina',
          fechaAplicacion: '2026-10-31T00:00:00Z',
          quincenaAplicacion: '2a Quincena Octubre 2026'
        }
      }
    ]
  },
  {
    id: 'MIL-TRP-029',
    matricula: 'SM-523812',
    nombre: 'Mno. Serv. San. Camila Guadalupe Terán',
    grado: 'Marinero',
    categoriaJerarquica: 'Tropa y Marinería',
    adscripcion: 'Sanidad Naval Sector Tuxpan (RN-1)',
    zonaId: 'RN-1',
    cantidadTotal: 2,
    cargoNomina: false,
    fechaUltimaDotacion: '2026-09-21T10:00:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-MNO-06',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '34R',
        fechaAsignacion: '2026-06-22T09:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-B3',
        folioFirmaDigital: 'SHA256:8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c0d2e4f6a',
      },
      {
        idUniforme: 'UNIF-MNO-07',
        tipo: 'Blanco de Gala',
        talla: '34R',
        fechaAsignacion: '2026-09-21T10:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-GALA-2026-C2',
        folioFirmaDigital: 'SHA256:9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b',
      }
    ]
  },
  {
    id: 'MIL-TRP-030',
    matricula: 'SM-534901',
    nombre: 'Mno. Chofer Transp. Emiliano Ibarra Coss',
    grado: 'Marinero',
    categoriaJerarquica: 'Tropa y Marinería',
    adscripcion: 'Batallón de Apoyo Logístico Naval (RN-2 Ensenada)',
    zonaId: 'RN-2',
    cantidadTotal: 3,
    cargoNomina: true,
    fechaUltimaDotacion: '2026-11-04T12:30:00Z',
    asignaciones: [
      {
        idUniforme: 'UNIF-MNO-08',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '40R',
        fechaAsignacion: '2026-05-30T11:00:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-SERV-2026-A3',
        folioFirmaDigital: 'SHA256:0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e2f4a6b8c',
      },
      {
        idUniforme: 'UNIF-MNO-09',
        tipo: 'Camuflaje Táctico de Selva / Árido',
        talla: '40R',
        fechaAsignacion: '2026-08-04T09:30:00Z',
        esExcedenteNomina: false,
        estatus: 'Entregado',
        codigoLote: 'LOTE-TACT-2026-N2',
        folioFirmaDigital: 'SHA256:1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d',
      },
      {
        idUniforme: 'UNIF-MNO-10',
        tipo: 'Azul Marino de Servicios / Faena',
        talla: '40R',
        fechaAsignacion: '2026-11-04T12:30:00Z',
        esExcedenteNomina: true,
        estatus: 'En Sastrería',
        codigoLote: 'LOTE-SERV-2026-D3',
        folioFirmaDigital: 'SHA256:2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2a4b6c8d0e',
        deduccionNomina: {
          folioDescuento: 'DESC-NOM-2026-1504',
          montoUnitarioMXN: 1450.00,
          estadoDeduccion: 'Pendiente de Descuento',
          quincenaAplicacion: '1a Quincena Noviembre 2026'
        }
      }
    ]
  }
];
