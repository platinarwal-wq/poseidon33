import { NavalSupplyItem, NavalZoneCenso, RequisitionPAA, BOMProduct, MilitaryCredential, SerializedItem, NavalVessel, SimulatedNavigation, InventoryDiscrepancy, ZonalAuditLog } from '../types/naval';

export const INITIAL_SUPPLIES: NavalSupplyItem[] = [
  {
    id: 'SUP-001',
    nsnCode: '8010-01-456-1192',
    name: 'Pintura Marina Epóxica Bicapa Anticorrosiva (Gris Naval Mil-Spec)',
    category: 'PINTURA_MARINA',
    unit: 'Tambor 200 Lts',
    unitCost: 18450,
    stockActual: 84,
    stockMinimo: 30,
    leadTimeDays: 14,
    partidaGasto: '29101',
    specDoc: 'NAV-SPEC-PNT-99A'
  },
  {
    id: 'SUP-002',
    nsnCode: '8010-01-382-7740',
    name: 'Pintura Anti-incrustante Antifouling Cobre/Silicón Libre de TBT',
    category: 'PINTURA_MARINA',
    unit: 'Cubeta 19 Lts',
    unitCost: 6850,
    stockActual: 142,
    stockMinimo: 50,
    leadTimeDays: 20,
    partidaGasto: '29101',
    specDoc: 'IMO-AFS-CONV-2001'
  },
  {
    id: 'SUP-003',
    nsnCode: '6850-01-209-4412',
    name: 'Desengrasante Biodegradable para Sentinas y Salas de Máquinas',
    category: 'QUIMICOS_SENTINA',
    unit: 'Tambor 208 Lts',
    unitCost: 9200,
    stockActual: 38,
    stockMinimo: 25,
    leadTimeDays: 10,
    partidaGasto: '25201',
    specDoc: 'MARPOL-ANNEX-I'
  },
  {
    id: 'SUP-004',
    nsnCode: '6810-01-523-9081',
    name: 'Inhibidor Químico de Corrosión para Circuitos de Refrigeración Marina',
    category: 'QUIMICOS_SENTINA',
    unit: 'Garrafa 20 Lts',
    unitCost: 4100,
    stockActual: 62,
    stockMinimo: 20,
    leadTimeDays: 12,
    partidaGasto: '25201',
    specDoc: 'MIL-DTL-8260'
  },
  {
    id: 'SUP-005',
    nsnCode: '7920-00-240-2555',
    name: 'Kit de Aseo de Dotación e Higiene Táctica para Misiones Prolongadas',
    category: 'ASEO_DOTACION',
    unit: 'Kit Individual',
    unitCost: 650,
    stockActual: 3400,
    stockMinimo: 1200,
    leadTimeDays: 7,
    partidaGasto: '27101',
    specDoc: 'DOT-LOG-INT-04'
  },
  {
    id: 'SUP-006',
    nsnCode: '7530-01-164-9812',
    name: 'Papelería Oficial Militar con Sello Seco y Folios Criptográficos',
    category: 'PAPELERIA_OFICIAL',
    unit: 'Millar',
    unitCost: 1480,
    stockActual: 180,
    stockMinimo: 60,
    leadTimeDays: 5,
    partidaGasto: '21101',
    specDoc: 'SEC-MAR-DOC-88'
  },
  {
    id: 'SUP-007',
    nsnCode: '7642-01-089-2231',
    name: 'Cartografía Náutica Hidrográfica Laminada Antirreflejo ZEE',
    category: 'PAPELERIA_OFICIAL',
    unit: 'Juego Folio',
    unitCost: 3200,
    stockActual: 95,
    stockMinimo: 40,
    leadTimeDays: 8,
    partidaGasto: '21501',
    specDoc: 'IHO-S57-NAV'
  },
  {
    id: 'SUP-008',
    nsnCode: '4010-01-311-6677',
    name: 'Cabos de Amarre Polipropileno Trenzado 8 Cordones 3 Pulgadas',
    category: 'CONSUMIBLES_CUBIERTA',
    unit: 'Carrete 220 mts',
    unitCost: 28500,
    stockActual: 19,
    stockMinimo: 15,
    leadTimeDays: 25,
    partidaGasto: '29601',
    specDoc: 'OCIMF-MEG4-ST'
  }
];

export const NAVAL_ZONES: NavalZoneCenso[] = [
  {
    id: 'RN-1',
    name: 'Primera Región Naval (Golfo Norte - Tuxpan/Veracruz)',
    location: 'Tuxpan, Ver.',
    personnelActive: 16800,
    vesselsAssigned: 18,
    annualBudgetApproved: 450000000,
    annualBudgetCommitted: 312000000
  },
  {
    id: 'RN-2',
    name: 'Segunda Región Naval (Pacífico Norte - Ensenada)',
    location: 'Ensenada, B.C.',
    personnelActive: 12400,
    vesselsAssigned: 14,
    annualBudgetApproved: 380000000,
    annualBudgetCommitted: 245000000
  },
  {
    id: 'RN-3',
    name: 'Tercera Región Naval (Caribe - Isla Mujeres/Chetumal)',
    location: 'Chetumal, Q.Roo',
    personnelActive: 14200,
    vesselsAssigned: 16,
    annualBudgetApproved: 410000000,
    annualBudgetCommitted: 289000000
  },
  {
    id: 'RN-4',
    name: 'Cuarta Región Naval (Pacífico Centro - Guaymas/Mazatlán)',
    location: 'Mazatlán, Sin.',
    personnelActive: 13500,
    vesselsAssigned: 15,
    annualBudgetApproved: 395000000,
    annualBudgetCommitted: 270000000
  },
  {
    id: 'RN-5',
    name: 'Quinta Región Naval (Pacífico Sur - Acapulco/Salina Cruz)',
    location: 'Salina Cruz, Oax.',
    personnelActive: 15100,
    vesselsAssigned: 19,
    annualBudgetApproved: 480000000,
    annualBudgetCommitted: 360000000
  },
  {
    id: 'RN-6',
    name: 'Sexta Región Naval (Sonda de Campeche - Carmen/Frontera)',
    location: 'Cd. del Carmen, Camp.',
    personnelActive: 6450,
    vesselsAssigned: 12,
    annualBudgetApproved: 260000000,
    annualBudgetCommitted: 195000000
  }
];

export const INITIAL_REQUISITIONS: RequisitionPAA[] = [
  {
    id: 'REQ-2026-RN1-084',
    solicitante: 'Sector Naval Tuxpan / Jefatura de Abastecimiento',
    zoneId: 'RN-1',
    item: 'Pintura Marina Epóxica Bicapa Anticorrosiva',
    quantityRequested: 48,
    historicalPerCapitaNorm: 32,
    predictedDemand: 34,
    anomalyDetected: true,
    justification: 'Carenado anticipado de 2 patrullas interceptoras por alta salinidad en barra fluvial.',
    status: 'EN_REVISION',
    partidaGasto: '29101',
    totalCost: 885600,
    approvalChain: [
      { level: 1, role: 'Jefe Sección Logística', officerName: 'Cap. Corb. D. Treviño', signed: true, timestamp: '2026-10-28 08:30:12', digitalFingerprint: 'SHA256:88a7c901e...' },
      { level: 2, role: 'Comandante de Sector', officerName: 'Contralm. R. Villegas', signed: true, timestamp: '2026-10-29 11:15:40', digitalFingerprint: 'SHA256:f4e198b20...' },
      { level: 3, role: 'Estado Mayor General', officerName: 'Vicealm. G. Caraveo', signed: false },
      { level: 4, role: 'Oficial Mayor de Marina', officerName: 'Alm. C. Beltrán', signed: false }
    ]
  },
  {
    id: 'REQ-2026-RN3-042',
    solicitante: 'Zona Naval Chetumal / Intendencia Flotilla',
    zoneId: 'RN-3',
    item: 'Kit de Aseo de Dotación e Higiene Táctica',
    quantityRequested: 1400,
    historicalPerCapitaNorm: 1380,
    predictedDemand: 1395,
    anomalyDetected: false,
    justification: 'Reposición semestral ordinaria para personal operativo en destacamentos de frontera.',
    status: 'APROBADO_MANDO',
    partidaGasto: '27101',
    totalCost: 910000,
    approvalChain: [
      { level: 1, role: 'Jefe Sección Logística', officerName: 'Cap. Frag. M. Solís', signed: true, timestamp: '2026-10-15 09:00:00', digitalFingerprint: 'SHA256:1902ae44...' },
      { level: 2, role: 'Comandante de Región', officerName: 'Alm. J. Escobedo', signed: true, timestamp: '2026-10-16 14:22:18', digitalFingerprint: 'SHA256:b65103fc...' },
      { level: 3, role: 'Estado Mayor General', officerName: 'Vicealm. G. Caraveo', signed: true, timestamp: '2026-10-18 17:40:02', digitalFingerprint: 'SHA256:cc990231...' },
      { level: 4, role: 'Oficial Mayor de Marina', officerName: 'Alm. C. Beltrán', signed: true, timestamp: '2026-10-20 10:05:51', digitalFingerprint: 'SHA256:e14f997a...' }
    ]
  },
  {
    id: 'REQ-2026-RN5-119',
    solicitante: 'Astillero de Marina N° 1 Salina Cruz',
    zoneId: 'RN-5',
    item: 'Pintura Anti-incrustante Antifouling Cobre/Silicón',
    quantityRequested: 110,
    historicalPerCapitaNorm: 65,
    predictedDemand: 70,
    anomalyDetected: true,
    justification: 'Varada de gran calado para Buque de Aprovisionamiento Logístico Montes Azules (BAL-01).',
    status: 'EN_REVISION',
    partidaGasto: '29101',
    totalCost: 753500,
    approvalChain: [
      { level: 1, role: 'Jefe Sección Logística', officerName: 'Cap. Nav. E. Garza', signed: true, timestamp: '2026-10-30 16:10:00', digitalFingerprint: 'SHA256:91df0102...' },
      { level: 2, role: 'Comandante de Astillero', officerName: 'Vicealm. P. Monroy', signed: true, timestamp: '2026-10-31 09:44:20', digitalFingerprint: 'SHA256:3284aa59...' },
      { level: 3, role: 'Estado Mayor General', officerName: 'Vicealm. G. Caraveo', signed: false },
      { level: 4, role: 'Oficial Mayor de Marina', officerName: 'Alm. C. Beltrán', signed: false }
    ]
  }
];

export const BOM_PRODUCTS: BOMProduct[] = [
  {
    id: 'BOM-UNIF-COMBAT',
    code: 'MFG-U-COMBAT-01',
    name: 'Uniforme de Combate Naval Camuflaje Marino (Camisola y Pantalón)',
    description: 'Confección militar de alta resistencia con tejido Ripstop 65/35, tratamiento IR y retardante de flama.',
    category: 'UNIFORMES',
    laborHoursPerUnit: 1.7, // 1.7 HH
    laborHourlyRate: 180, // $180 MXN / HH
    indirectCostRate: 0.12, // 12% costos indirectos
    defaultPartida: '27101',
    components: [
      {
        id: 'CMP-TELA-RIP',
        name: 'Tejido Técnico Ripstop Camuflaje Azul Naval (65% Poliéster / 35% Algodón)',
        netPerUnit: 3.3, // 3.3 metros lineales
        unit: 'm',
        technicalWastePercent: 6.0, // 6% merma corte
        unitCost: 145.00,
        partidaPresupuestal: '27101'
      },
      {
        id: 'CMP-HILO-MIL',
        name: 'Hilo de Poliamida de Alta Tenacidad Calibre 40 (Grado Mil-Spec)',
        netPerUnit: 0.5,
        unit: 'conos',
        technicalWastePercent: 3.5,
        unitCost: 88.00,
        partidaPresupuestal: '27101'
      },
      {
        id: 'CMP-BOTON-IGN',
        name: 'Botonadura Oculta Ignífuga de Melamina Naval (4 orificios reforzada)',
        netPerUnit: 11,
        unit: 'pzas',
        technicalWastePercent: 2.0,
        unitCost: 4.20,
        partidaPresupuestal: '27101'
      },
      {
        id: 'CMP-VELCRO-IR',
        name: 'Cierre y Velcro Táctico Antirreflejo Infrarrojo para Porta-Insignias',
        netPerUnit: 1.0,
        unit: 'juego',
        technicalWastePercent: 1.5,
        unitCost: 62.00,
        partidaPresupuestal: '27101'
      }
    ]
  },
  {
    id: 'BOM-UNIF-GALA',
    code: 'MFG-U-GALA-02',
    name: 'Uniforme de Gala Naval (Levita de Paño Azul Marino y Pantalón con Vivo)',
    description: 'Sastrería militar naval de etiqueta, confeccionada en 100% lana marina pura con botones de ancla en bajo relieve.',
    category: 'UNIFORMES',
    laborHoursPerUnit: 14.0,
    laborHourlyRate: 220,
    indirectCostRate: 0.15,
    defaultPartida: '27101',
    components: [
      {
        id: 'CMP-LANA-100',
        name: 'Paño 100% Lana Pura Azul Marino Noche 420 gr/m²',
        netPerUnit: 4.2,
        unit: 'm',
        technicalWastePercent: 4.5,
        unitCost: 680.00,
        partidaPresupuestal: '27101'
      },
      {
        id: 'CMP-FORRO-SEDA',
        name: 'Forro Antiestático de Tafetán Satinado Respirable',
        netPerUnit: 3.8,
        unit: 'm',
        technicalWastePercent: 3.0,
        unitCost: 110.00,
        partidaPresupuestal: '27101'
      },
      {
        id: 'CMP-BOTON-ORO',
        name: 'Botones Navales de Latón Dorado Pulido con Ancla y Corona de Laurel',
        netPerUnit: 14,
        unit: 'pzas',
        technicalWastePercent: 1.0,
        unitCost: 35.00,
        partidaPresupuestal: '27101'
      },
      {
        id: 'CMP-GALON-ORO',
        name: 'Galón Dorado Metalizado de Pasamanería Militar Oficial',
        netPerUnit: 2.5,
        unit: 'm',
        technicalWastePercent: 2.0,
        unitCost: 140.00,
        partidaPresupuestal: '27101'
      }
    ]
  },
  {
    id: 'BOM-LITERA-TACTICA',
    code: 'MFG-M-LITERA-03',
    name: 'Litera Táctica Naval Triple de Acero Estructural ASTM A36',
    description: 'Módulo naval de descanso para camarotes de tripulación, resistente a balanceo marítimo con amortiguadores sísmico-vibratorios.',
    category: 'MOBILIARIO_TACTICO',
    laborHoursPerUnit: 18.0,
    laborHourlyRate: 210,
    indirectCostRate: 0.14,
    defaultPartida: '52101',
    components: [
      {
        id: 'CMP-PERFIL-A36',
        name: 'Tubo Estructural Cuadrado 2" Calibre 14 Acero ASTM A36',
        netPerUnit: 28.0,
        unit: 'm',
        technicalWastePercent: 5.5,
        unitCost: 185.00,
        partidaPresupuestal: '52101'
      },
      {
        id: 'CMP-CHAPA-MAR',
        name: 'Chapa de Acero Rolado en Frío Calibre 16 Perforada Antihumedad',
        netPerUnit: 5.4,
        unit: 'm²',
        technicalWastePercent: 7.0,
        unitCost: 390.00,
        partidaPresupuestal: '52101'
      },
      {
        id: 'CMP-PINT-ELECTRO',
        name: 'Pintura Polvo Electrostática Epoxi-Poliéster Horno 200°C Gris Nieve',
        netPerUnit: 4.5,
        unit: 'kg',
        technicalWastePercent: 8.0,
        unitCost: 125.00,
        partidaPresupuestal: '52101'
      },
      {
        id: 'CMP-SOLD-MIG',
        name: 'Alambre de Soldadura ER70S-6 con Gas Argón/CO2',
        netPerUnit: 3.0,
        unit: 'kg',
        technicalWastePercent: 4.0,
        unitCost: 160.00,
        partidaPresupuestal: '52101'
      }
    ]
  },
  {
    id: 'BOM-TAQUILLA-ESTANCA',
    code: 'MFG-M-TAQUILLA-04',
    name: 'Taquilla Marinera Estanca de Acero Doble Compartimento y Caja Fuerte',
    description: 'Armario individual para marinería y oficiales con empaque de neopreno perimetral, pasador triple y bisagra continua inoxidable.',
    category: 'MOBILIARIO_TACTICO',
    laborHoursPerUnit: 12.0,
    laborHourlyRate: 210,
    indirectCostRate: 0.14,
    defaultPartida: '52101',
    components: [
      {
        id: 'CMP-CHAPA-CAL16',
        name: 'Chapa de Acero Galvanizado Galvanneal Calibre 16 Anticorrosión',
        netPerUnit: 6.8,
        unit: 'm²',
        technicalWastePercent: 6.5,
        unitCost: 410.00,
        partidaPresupuestal: '52101'
      },
      {
        id: 'CMP-BISAGRA-INOX',
        name: 'Bisagra Tipo Piano Acero Inoxidable Grado Marino AISI 316 (1.8m)',
        netPerUnit: 1.0,
        unit: 'pza',
        technicalWastePercent: 0.5,
        unitCost: 520.00,
        partidaPresupuestal: '52101'
      },
      {
        id: 'CMP-CERRADURA-TACT',
        name: 'Cerradura de Triple Pasador con Llave de Punto y Clave Numérica Mecánica',
        netPerUnit: 1.0,
        unit: 'kit',
        technicalWastePercent: 1.0,
        unitCost: 890.00,
        partidaPresupuestal: '52101'
      },
      {
        id: 'CMP-SELLO-NEOPRENO',
        name: 'Empaque de Neopreno Marino Celular Cerrado Estanco al Agua',
        netPerUnit: 7.2,
        unit: 'm',
        technicalWastePercent: 3.0,
        unitCost: 45.00,
        partidaPresupuestal: '52101'
      }
    ]
  }
];

export const MILITARY_PERSONNEL: MilitaryCredential[] = [
  {
    militaryId: 'SM-849201-B',
    nfcChipUid: '04:A2:3B:88:9C:12',
    rank: 'Cabo Infantería de Marina',
    fullName: 'Juan Manuel Arcos Salgado',
    unit: 'Batallón de Infantería de Marina N° 1 (BIM-1)',
    status: 'ACTIVO',
    photoPlaceholder: 'CABO ARCOS J.',
    entitlements: [
      {
        category: 'UNIFORMES',
        item: 'Uniforme de Combate Naval Camuflaje',
        lastDeliveredDate: '2026-08-10', // hace ~2.7 meses
        minCycleMonths: 6,
        currentCycleElapsedMonths: 2.7,
        status: 'BLOQUEADO_POR_TIEMPO'
      },
      {
        category: 'ASEO_PERSONAL',
        item: 'Kit de Aseo de Dotación e Higiene',
        lastDeliveredDate: '2026-05-02',
        minCycleMonths: 4,
        currentCycleElapsedMonths: 6.0,
        status: 'APTO_ENTREGA'
      },
      {
        category: 'MOBILIARIO_TACTICO',
        item: 'Taquilla Marinera Estanca Asignada',
        lastDeliveredDate: '2024-03-15',
        minCycleMonths: 36,
        currentCycleElapsedMonths: 31.5,
        status: 'BLOQUEADO_POR_TIEMPO'
      }
    ]
  },
  {
    militaryId: 'OF-392104-A',
    nfcChipUid: '04:C5:11:F2:44:80',
    rank: 'Teniente de Corbeta CG',
    fullName: 'Laura Elena Mendoza Rivas',
    unit: 'ARM Benito Juárez (Fragata F-214)',
    status: 'ACTIVO',
    photoPlaceholder: 'TNTE MENDOZA L.',
    entitlements: [
      {
        category: 'UNIFORMES',
        item: 'Uniforme de Combate Naval Camuflaje',
        lastDeliveredDate: '2026-02-14', // hace 8.5 meses
        minCycleMonths: 6,
        currentCycleElapsedMonths: 8.5,
        status: 'APTO_ENTREGA'
      },
      {
        category: 'UNIFORMES',
        item: 'Uniforme de Gala Naval',
        lastDeliveredDate: '2024-11-20',
        minCycleMonths: 24,
        currentCycleElapsedMonths: 23.4,
        status: 'BLOQUEADO_POR_TIEMPO'
      },
      {
        category: 'ASEO_PERSONAL',
        item: 'Kit de Aseo de Dotación e Higiene',
        lastDeliveredDate: '2026-06-12',
        minCycleMonths: 4,
        currentCycleElapsedMonths: 4.6,
        status: 'APTO_ENTREGA'
      }
    ]
  },
  {
    militaryId: 'MR-102934-F',
    nfcChipUid: '04:77:88:99:A1:33',
    rank: 'Marinero Cuartelero de Servicios',
    fullName: 'Carlos Peña Domínguez',
    unit: 'Cuartel General Primera Región Naval',
    status: 'ACTIVO',
    photoPlaceholder: 'MR PEÑA C.',
    entitlements: [
      {
        category: 'UNIFORMES',
        item: 'Uniforme de Combate Naval Camuflaje',
        lastDeliveredDate: '2026-01-05',
        minCycleMonths: 6,
        currentCycleElapsedMonths: 9.8,
        status: 'APTO_ENTREGA'
      },
      {
        category: 'MOBILIARIO_TACTICO',
        item: 'Taquilla Marinera Estanca Asignada',
        lastDeliveredDate: '2023-01-10',
        minCycleMonths: 36,
        currentCycleElapsedMonths: 45.7,
        status: 'APTO_ENTREGA'
      }
    ]
  }
];

export const SERIALIZED_STOCK: SerializedItem[] = [
  {
    serialNumber: 'LIT-NAV-2026-0042',
    itemType: 'Litera Táctica Naval Triple ASTM A36',
    lotNumber: 'LOT-LIT-2026-B',
    manufactureDate: '2026-04-12',
    assignedLocation: 'Camarote B-04 / ARM Oaxaca (PO-161)',
    inspectionPassed: true,
    custodyChain: [
      { step: 1, name: 'Requisición', completed: true, officerInCharge: 'Cap. Corb. M. Treviño', timestamp: '2026-03-01' },
      { step: 2, name: 'Compra Licitación', completed: true, officerInCharge: 'Oficial Mayor Marina', timestamp: '2026-03-10' },
      { step: 3, name: 'Fabricación Maestranza', completed: true, officerInCharge: 'Ing. Nav. Taller N° 2', timestamp: '2026-04-12' },
      { step: 4, name: 'Almacén General', completed: true, officerInCharge: 'Almacén General Central', timestamp: '2026-04-18' },
      { step: 5, name: 'Pañol de Unidad', completed: true, officerInCharge: 'Jefe de Pañol PO-161', timestamp: '2026-05-02' },
      { step: 6, name: 'Elemento Naval', completed: true, officerInCharge: 'Contramaestre Dotación', timestamp: '2026-05-05', verificationHash: 'SHA256:4a88f01b...' }
    ]
  },
  {
    serialNumber: 'TAQ-NAV-2026-0118',
    itemType: 'Taquilla Marinera Estanca Calibre 16',
    lotNumber: 'LOT-TAQ-2026-A',
    manufactureDate: '2026-06-20',
    assignedLocation: 'Pañol Central Almacén RN-1 Tuxpan',
    inspectionPassed: true,
    custodyChain: [
      { step: 1, name: 'Requisición', completed: true, officerInCharge: 'Cap. Frag. D. Reyes', timestamp: '2026-05-10' },
      { step: 2, name: 'Compra Licitación', completed: true, officerInCharge: 'Dirección Adquisiciones', timestamp: '2026-05-22' },
      { step: 3, name: 'Fabricación Maestranza', completed: true, officerInCharge: 'Taller Estructuras Navales', timestamp: '2026-06-20' },
      { step: 4, name: 'Almacén General', completed: true, officerInCharge: 'Subteniente Almacenes', timestamp: '2026-06-28' },
      { step: 5, name: 'Pañol de Unidad', completed: false },
      { step: 6, name: 'Elemento Naval', completed: false }
    ]
  },
  {
    serialNumber: 'UNIF-LOT-5000-089',
    itemType: 'Lote 100 Uniformes Combate Naval',
    lotNumber: 'LOTE-UNIF-NAV-2026',
    manufactureDate: '2026-09-02',
    assignedLocation: 'Pañol Intendencia ARM Benito Juárez',
    inspectionPassed: true,
    custodyChain: [
      { step: 1, name: 'Requisición', completed: true, officerInCharge: 'Comandancia Flotilla', timestamp: '2026-07-15' },
      { step: 2, name: 'Compra Licitación', completed: true, officerInCharge: 'Comité Técnico Compras', timestamp: '2026-07-28' },
      { step: 3, name: 'Fabricación Maestranza', completed: true, officerInCharge: 'Fábrica de Vestuario SEMAR', timestamp: '2026-09-02' },
      { step: 4, name: 'Almacén General', completed: true, officerInCharge: 'Almacén Central', timestamp: '2026-09-10' },
      { step: 5, name: 'Pañol de Unidad', completed: true, officerInCharge: 'Jefe Intendencia Buque', timestamp: '2026-09-25' },
      { step: 6, name: 'Elemento Naval', completed: false }
    ]
  }
];

export const NAVAL_FLEET: NavalVessel[] = [
  {
    id: 'VESSEL-PO-161',
    hullNumber: 'PO-161',
    name: 'ARM Oaxaca',
    vesselClass: 'PATRULLA_OCEANICA',
    displacementTons: 1680,
    assignedRegion: 'RN-1 Primera Región Naval (Golfo)',
    status: 'PREVENTIVO',
    tacticalCriticality: 'ALTA',
    currentMission: 'Patrullaje Soberanía ZEE Plataformas Petroleras',
    propulsionType: '2x Diesel Marino MTU 16V 1163 TB93 (10,400 kW)',
    mainEngineHours: 8420,
    auxEngineHours: 11200,
    overhaulLimitHours: 8500, // a 80 horas de límite
    daysInLastDryDock: 480,
    lastDryDockDate: '2025-07-10',
    criticalComponents: [
      { name: 'Turbocompresor Principal Estribor', wearPercentage: 98, hoursRemaining: 80, status: 'CRITICO' },
      { name: 'Toberas de Inyección Common Rail', wearPercentage: 86, hoursRemaining: 240, status: 'ALERTA_PREVENTIVA' },
      { name: 'Retén de Bocina y Eje Portahélice', wearPercentage: 74, hoursRemaining: 520, status: 'OPTIMO' },
      { name: 'Ánodos de Zinc Protección Catódica', wearPercentage: 92, hoursRemaining: 110, status: 'CRITICO' }
    ]
  },
  {
    id: 'VESSEL-PO-162',
    hullNumber: 'PO-162',
    name: 'ARM Veracruz',
    vesselClass: 'PATRULLA_OCEANICA',
    displacementTons: 1680,
    assignedRegion: 'RN-3 Tercera Región Naval (Caribe)',
    status: 'OPERATIVO',
    tacticalCriticality: 'ALTA',
    currentMission: 'Interdicción Marítima de Narcotráfico y Salvaguarda',
    propulsionType: '2x Diesel Marino MTU 16V 1163 TB93 (10,400 kW)',
    mainEngineHours: 4210,
    auxEngineHours: 6300,
    overhaulLimitHours: 8500,
    daysInLastDryDock: 210,
    lastDryDockDate: '2026-04-05',
    criticalComponents: [
      { name: 'Turbocompresor Principal Estribor', wearPercentage: 49, hoursRemaining: 4290, status: 'OPTIMO' },
      { name: 'Toberas de Inyección Common Rail', wearPercentage: 42, hoursRemaining: 4900, status: 'OPTIMO' },
      { name: 'Retén de Bocina y Eje Portahélice', wearPercentage: 35, hoursRemaining: 5500, status: 'OPTIMO' },
      { name: 'Ánodos de Zinc Protección Catódica', wearPercentage: 45, hoursRemaining: 4600, status: 'OPTIMO' }
    ]
  },
  {
    id: 'VESSEL-F-214',
    hullNumber: 'F-214',
    name: 'ARM Benito Juárez',
    vesselClass: 'FRAGATA',
    displacementTons: 2570,
    assignedRegion: 'RN-2 Segunda Región Naval (Pacífico)',
    status: 'NO_OPERATIVO',
    tacticalCriticality: 'EXTREMA',
    currentMission: 'Fondeado en Muelle Militar - Espera de Turbocompresor Babor',
    propulsionType: 'CODAG (Turbina Gas GE LM2500 + 2x Diesel MTU 20V)',
    mainEngineHours: 6890,
    auxEngineHours: 8900,
    overhaulLimitHours: 9000,
    daysInLastDryDock: 320,
    lastDryDockDate: '2025-12-15',
    criticalComponents: [
      { name: 'Turbocompresor Babor Turbo-Lag 03', wearPercentage: 100, hoursRemaining: 0, status: 'CRITICO' },
      { name: 'Enfriador de Aceite y Aire de Carga', wearPercentage: 88, hoursRemaining: 180, status: 'ALERTA_PREVENTIVA' },
      { name: 'Girocompás Náutico Láser', wearPercentage: 20, hoursRemaining: 7200, status: 'OPTIMO' },
      { name: 'Ánodos de Casco y Quilla de Balance', wearPercentage: 60, hoursRemaining: 1200, status: 'OPTIMO' }
    ]
  },
  {
    id: 'VESSEL-BAL-01',
    hullNumber: 'BAL-01',
    name: 'ARM Montes Azules',
    vesselClass: 'BUQUE_APROVISIONAMIENTO',
    displacementTons: 3666,
    assignedRegion: 'RN-5 Quinta Región Naval (Salina Cruz)',
    status: 'EN_DIQUE',
    tacticalCriticality: 'MEDIA',
    currentMission: 'Carenado y Mantenimiento Mayor en Dique Seco N° 1',
    propulsionType: '2x Diesel Marino Caterpillar 3516B (3,280 kW)',
    mainEngineHours: 12450,
    auxEngineHours: 15800,
    overhaulLimitHours: 12000,
    daysInLastDryDock: 14,
    lastDryDockDate: '2026-10-18',
    criticalComponents: [
      { name: 'Casco y Obra Viva (Chorro Abrasivo Grit SA 2.5)', wearPercentage: 90, hoursRemaining: 0, status: 'CRITICO' },
      { name: 'Línea de Ejes y Arbotantes', wearPercentage: 85, hoursRemaining: 120, status: 'ALERTA_PREVENTIVA' },
      { name: 'Válvulas de Fondo y Tomas de Mar', wearPercentage: 95, hoursRemaining: 20, status: 'CRITICO' },
      { name: 'Generadores Auxiliares Diesel N° 1 y 2', wearPercentage: 78, hoursRemaining: 450, status: 'OPTIMO' }
    ]
  },
  {
    id: 'VESSEL-PI-1102',
    hullNumber: 'PI-1102',
    name: 'ARM Polaris II',
    vesselClass: 'PATRULLA_INTERCEPTORA',
    displacementTons: 28,
    assignedRegion: 'RN-4 Cuarta Región Naval (Mazatlán)',
    status: 'OPERATIVO',
    tacticalCriticality: 'MEDIA',
    currentMission: 'Vigilancia Ribereña y Rescate Marítimo ENSAR',
    propulsionType: '2x Waterjet Kamewa con Diesel Volvo Penta D13 (1,600 HP)',
    mainEngineHours: 1940,
    auxEngineHours: 2100,
    overhaulLimitHours: 3500,
    daysInLastDryDock: 110,
    lastDryDockDate: '2026-07-14',
    criticalComponents: [
      { name: 'Impulsores Hidrojet Waterjet', wearPercentage: 30, hoursRemaining: 1800, status: 'OPTIMO' },
      { name: 'Sellos Mecánicos de Eje', wearPercentage: 25, hoursRemaining: 2100, status: 'OPTIMO' },
      { name: 'Sistemas Hidráulicos de Timón Deflector', wearPercentage: 28, hoursRemaining: 1950, status: 'OPTIMO' }
    ]
  }
];

export const SIMULATED_NAVIGATIONS: SimulatedNavigation[] = [
  {
    id: 'NAV-2026-001',
    vesselId: 'VESSEL-PO-161',
    vesselName: 'ARM Oaxaca',
    hullNumber: 'PO-161',
    missionName: 'Operación Escudo ZEE Plataformas Sonda de Campeche',
    missionType: 'PATRULLAJE_ZEE',
    originPort: 'Veracruz, Ver.',
    destinationPort: 'Cayo Arcas / Coatzacoalcos',
    departureDate: '2026-10-24 06:00',
    arrivalDate: '2026-10-27 06:00',
    durationHours: 72,
    distanceNauticalMiles: 980,
    avgSpeedKnots: 13.6,
    fuelConsumedLiters: 38400,
    fuelCostMXN: 844800,
    crewOnboard: 78,
    rationsConsumed: 560,
    freshWaterTons: 24,
    engineWearDeltaPercent: 3.5,
    seaConditions: 'Mar 3 (Douglas) · Viento ESE 18 nudos',
    finalVesselStatus: 'PREVENTIVO',
    incidentReport: 'Alerta térmica en turbocompresor principal estribor a las 64 hrs de navegación. Horómetro motor acumuló 8,420 hrs. Se recomienda programación de dique seco.'
  },
  {
    id: 'NAV-2026-002',
    vesselId: 'VESSEL-PO-162',
    vesselName: 'ARM Veracruz',
    hullNumber: 'PO-162',
    missionName: 'Operación de Interdicción y Vigilancia ZEE Caribe Norte',
    missionType: 'INTERDICCION_MARITIMA',
    originPort: 'Isla Mujeres, Q. Roo',
    destinationPort: 'Banco Chinchorro / Chetumal',
    departureDate: '2026-10-28 08:00',
    arrivalDate: '2026-10-30 08:00',
    durationHours: 48,
    distanceNauticalMiles: 650,
    avgSpeedKnots: 13.5,
    fuelConsumedLiters: 25600,
    fuelCostMXN: 563200,
    crewOnboard: 78,
    rationsConsumed: 374,
    freshWaterTons: 18,
    engineWearDeltaPercent: 1.8,
    seaConditions: 'Mar 2 (Douglas) · Viento NE 12 nudos',
    finalVesselStatus: 'OPERATIVO',
    incidentReport: 'Navegación nominal sin incidencias mecánicas. Parámetros de presión de combustible y temperaturas de toberas en rango óptimo.'
  },
  {
    id: 'NAV-2026-003',
    vesselId: 'VESSEL-F-214',
    vesselName: 'ARM Benito Juárez',
    hullNumber: 'F-214',
    missionName: 'Patrullaje de Disuasión y Soberanía Archipiélago Revillagigedo',
    missionType: 'PATRULLAJE_ZEE',
    originPort: 'Manzanillo, Col.',
    destinationPort: 'Isla Socorro / Manzanillo',
    departureDate: '2026-10-18 12:00',
    arrivalDate: '2026-10-22 12:00',
    durationHours: 96,
    distanceNauticalMiles: 1420,
    avgSpeedKnots: 14.8,
    fuelConsumedLiters: 68000,
    fuelCostMXN: 1496000,
    crewOnboard: 124,
    rationsConsumed: 1190,
    freshWaterTons: 45,
    engineWearDeltaPercent: 5.2,
    seaConditions: 'Mar 4 (Douglas) · Oleaje 2.8m · Viento NW 24 nudos',
    finalVesselStatus: 'NO_OPERATIVO',
    incidentReport: 'Falla crítica por sobretemperatura y vibración axial en turbocompresor babor Turbo-Lag 03. Buque fondeado en muelle en espera de refacción mayor.'
  },
  {
    id: 'NAV-2026-004',
    vesselId: 'VESSEL-BAL-01',
    vesselName: 'ARM Montes Azules',
    hullNumber: 'BAL-01',
    missionName: 'Puente Logístico y Transporte Pesado Salina Cruz - Lázaro Cárdenas',
    missionType: 'REABASTECIMIENTO',
    originPort: 'Salina Cruz, Oax.',
    destinationPort: 'Lázaro Cárdenas, Mich.',
    departureDate: '2026-10-12 10:00',
    arrivalDate: '2026-10-17 10:00',
    durationHours: 120,
    distanceNauticalMiles: 1180,
    avgSpeedKnots: 9.8,
    fuelConsumedLiters: 74500,
    fuelCostMXN: 1639000,
    crewOnboard: 95,
    rationsConsumed: 1425,
    freshWaterTons: 80,
    engineWearDeltaPercent: 4.0,
    seaConditions: 'Mar 3 (Douglas) · Viento Norte 16 nudos',
    finalVesselStatus: 'EN_DIQUE',
    incidentReport: 'Descarga exitosa de 420 tons de víveres y pertrechos. Arribo directo a Astillero de Marina N° 1 para carenado programado y sustitución de ánodos de zinc.'
  },
  {
    id: 'NAV-2026-005',
    vesselId: 'VESSEL-PI-1102',
    vesselName: 'ARM Polaris II',
    hullNumber: 'PI-1102',
    missionName: 'Operación Búsqueda y Rescate ENSAR Barra de Piaxtla',
    missionType: 'PLAN_MARINA',
    originPort: 'Mazatlán, Sin.',
    destinationPort: 'Zona Costera Piaxtla / Mazatlán',
    departureDate: '2026-10-29 04:00',
    arrivalDate: '2026-10-29 18:00',
    durationHours: 14,
    distanceNauticalMiles: 310,
    avgSpeedKnots: 22.1,
    fuelConsumedLiters: 6800,
    fuelCostMXN: 149600,
    crewOnboard: 6,
    rationsConsumed: 24,
    freshWaterTons: 2,
    engineWearDeltaPercent: 1.1,
    seaConditions: 'Mar 2 (Douglas) · Viento OSO 10 nudos',
    finalVesselStatus: 'OPERATIVO',
    incidentReport: 'Rescate efectivo de embarcación menor ribereña con 4 tripulantes a salvo. Sistema hidrojet Kamewa con parámetros normales.'
  },
  {
    id: 'NAV-2026-006',
    vesselId: 'VESSEL-PO-161',
    vesselName: 'ARM Oaxaca',
    hullNumber: 'PO-161',
    missionName: 'Escolta Táctica de Convoy Marítimo Estratégico Tuxpan - Dos Bocas',
    missionType: 'ESCOLTA_TACTICA',
    originPort: 'Tuxpan, Ver.',
    destinationPort: 'Dos Bocas, Tab.',
    departureDate: '2026-10-05 07:00',
    arrivalDate: '2026-10-06 19:00',
    durationHours: 36,
    distanceNauticalMiles: 470,
    avgSpeedKnots: 13.0,
    fuelConsumedLiters: 19200,
    fuelCostMXN: 422400,
    crewOnboard: 74,
    rationsConsumed: 296,
    freshWaterTons: 15,
    engineWearDeltaPercent: 1.9,
    seaConditions: 'Mar 3 (Douglas) · Viento Este 15 nudos',
    finalVesselStatus: 'OPERATIVO',
    incidentReport: 'Escolta de dos buques tanque petroleros completada con éxito. Telemetría de radares de superficie y enlace de datos sin discrepancias.'
  },
  {
    id: 'NAV-2026-007',
    vesselId: 'VESSEL-PO-162',
    vesselName: 'ARM Veracruz',
    hullNumber: 'PO-162',
    missionName: 'Patrullaje y Control de Frontera Marítima ZEE Banco Chinchorro',
    missionType: 'PATRULLAJE_ZEE',
    originPort: 'Chetumal, Q. Roo',
    destinationPort: 'Arrecife Alacranes / Progreso',
    departureDate: '2026-10-10 09:00',
    arrivalDate: '2026-10-12 19:00',
    durationHours: 58,
    distanceNauticalMiles: 760,
    avgSpeedKnots: 13.1,
    fuelConsumedLiters: 30900,
    fuelCostMXN: 679800,
    crewOnboard: 78,
    rationsConsumed: 452,
    freshWaterTons: 20,
    engineWearDeltaPercent: 2.4,
    seaConditions: 'Mar 2 (Douglas) · Viento ENE 14 nudos',
    finalVesselStatus: 'OPERATIVO',
    incidentReport: 'Inspección de 3 embarcaciones pesqueras en aguas jurisdiccionales. Verificación de permisos y bitácoras cumplida al 100%.'
  },
  {
    id: 'NAV-2026-008',
    vesselId: 'VESSEL-F-214',
    vesselName: 'ARM Benito Juárez',
    hullNumber: 'F-214',
    missionName: 'Maniobras Navales de Guerra Electrónica Golfo de California',
    missionType: 'ESCOLTA_TACTICA',
    originPort: 'Guaymas, Son.',
    destinationPort: 'La Paz, B.C.S.',
    departureDate: '2026-09-22 08:00',
    arrivalDate: '2026-09-25 00:00',
    durationHours: 64,
    distanceNauticalMiles: 890,
    avgSpeedKnots: 13.9,
    fuelConsumedLiters: 45300,
    fuelCostMXN: 996600,
    crewOnboard: 118,
    rationsConsumed: 755,
    freshWaterTons: 35,
    engineWearDeltaPercent: 3.1,
    seaConditions: 'Mar 1 (Douglas) · Mar en calma · Viento N 8 nudos',
    finalVesselStatus: 'OPERATIVO',
    incidentReport: 'Pruebas de tiro y calibración de sistemas de guerra antisubmarina completadas. Calentamiento leve en toberas de bancada 2 mitigado.'
  },
  {
    id: 'NAV-2026-009',
    vesselId: 'VESSEL-PI-1102',
    vesselName: 'ARM Polaris II',
    hullNumber: 'PI-1102',
    missionName: 'Reconocimiento y Vigilancia Costera Bahía de Topolobampo',
    missionType: 'INTERDICCION_MARITIMA',
    originPort: 'Topolobampo, Sin.',
    destinationPort: 'Canal Principal / Mazatlán',
    departureDate: '2026-10-15 05:00',
    arrivalDate: '2026-10-15 23:00',
    durationHours: 18,
    distanceNauticalMiles: 380,
    avgSpeedKnots: 21.1,
    fuelConsumedLiters: 8200,
    fuelCostMXN: 180400,
    crewOnboard: 6,
    rationsConsumed: 36,
    freshWaterTons: 2.5,
    engineWearDeltaPercent: 1.4,
    seaConditions: 'Mar 2 (Douglas) · Viento W 12 nudos',
    finalVesselStatus: 'OPERATIVO',
    incidentReport: 'Interdicción preventiva sin hallazgos ilícitos. Sellos mecánicos de eje inspeccionados a la arribada sin filtraciones.'
  },
  {
    id: 'NAV-2026-010',
    vesselId: 'VESSEL-BAL-01',
    vesselName: 'ARM Montes Azules',
    hullNumber: 'BAL-01',
    missionName: 'Misión Humanitaria de Apoyo Logístico Plan Marina Golfo Norte',
    missionType: 'PLAN_MARINA',
    originPort: 'Coatzacoalcos, Ver.',
    destinationPort: 'Tampico, Tamps.',
    departureDate: '2026-09-08 06:00',
    arrivalDate: '2026-09-11 14:00',
    durationHours: 80,
    distanceNauticalMiles: 820,
    avgSpeedKnots: 10.2,
    fuelConsumedLiters: 49800,
    fuelCostMXN: 1095600,
    crewOnboard: 110,
    rationsConsumed: 880,
    freshWaterTons: 60,
    engineWearDeltaPercent: 2.8,
    seaConditions: 'Mar 4 (Douglas) · Viento de temporal NE 28 nudos',
    finalVesselStatus: 'OPERATIVO',
    incidentReport: 'Transporte de plantas potabilizadoras móviles y 3,000 despensas de intendencia naval para la población afectada. Misión cumplida con honores.'
  }
];

export const INITIAL_DISCREPANCIES: InventoryDiscrepancy[] = [
  {
    id: 'DISC-2026-001',
    nsnCode: '8010-01-456-1192',
    itemName: 'Pintura Marina Epóxica Bicapa Anticorrosiva (Tambor 200 Lts)',
    zoneId: 'RN-1',
    zoneName: 'Primera Región Naval (Golfo Norte)',
    locationNode: 'Pañol Central de Mantenimiento / Tuxpan',
    systemStock: 84,
    physicalCount: 76,
    differenceQty: -8,
    unit: 'Tambor 200 Lts',
    unitCost: 18450,
    financialImpactMXN: 147600,
    partidaGasto: '29101',
    severity: 'ALTA',
    status: 'EN_INVESTIGACION',
    lastAuditDate: '2026-10-30',
    auditorOfficer: 'Cap. Frag. CG Auditor M. Trejo',
    investigationNotes: 'Diferencia de 8 tambores detectada en auditoría sorpresiva. Posible suministro de emergencia a ARM Oaxaca (PO-161) no registrado en el sistema.',
    folioActa: 'ACTA-AUD-RN1-2026-88'
  },
  {
    id: 'DISC-2026-002',
    nsnCode: '8010-01-382-7740',
    itemName: 'Pintura Anti-incrustante Antifouling Cobre/Silicón Libre de TBT',
    zoneId: 'RN-5',
    zoneName: 'Quinta Región Naval (Pacífico Sur)',
    locationNode: 'Almacén de Dique Astillero N° 1 / Salina Cruz',
    systemStock: 142,
    physicalCount: 128,
    differenceQty: -14,
    unit: 'Cubeta 19 Lts',
    unitCost: 6850,
    financialImpactMXN: 95900,
    partidaGasto: '29101',
    severity: 'CRITICA',
    status: 'ACTA_LEVANTADA',
    lastAuditDate: '2026-10-28',
    auditorOfficer: 'Cap. Nav. IM Auditor H. Salcedo',
    investigationNotes: 'Faltante físico en bodega de varada. Se levantó Acta de Hechos N° 104 por presunto retiro irregular de material sin vale de salida.',
    folioActa: 'ACTA-AUD-RN5-2026-104'
  },
  {
    id: 'DISC-2026-003',
    nsnCode: '7920-00-240-2555',
    itemName: 'Kit de Aseo de Dotación e Higiene Táctica',
    zoneId: 'RN-3',
    zoneName: 'Tercera Región Naval (Caribe)',
    locationNode: 'Pañol General de Intendencia / Chetumal',
    systemStock: 3400,
    physicalCount: 3120,
    differenceQty: -280,
    unit: 'Kit Individual',
    unitCost: 650,
    financialImpactMXN: 182000,
    partidaGasto: '27101',
    severity: 'ALTA',
    status: 'EN_INVESTIGACION',
    lastAuditDate: '2026-10-25',
    auditorOfficer: 'Ten. Nav. Logístico R. Armenta',
    investigationNotes: 'Discrepancia en remisión de recepción con proveedor de intendencia. Pendiente cotejo con factura SAT y sello de garita.',
    folioActa: 'ACTA-AUD-RN3-2026-042'
  },
  {
    id: 'DISC-2026-004',
    nsnCode: '7530-01-164-9812',
    itemName: 'Papelería Oficial Militar con Sello Seco y Folios Criptográficos',
    zoneId: 'RN-2',
    zoneName: 'Segunda Región Naval (Pacífico Norte)',
    locationNode: 'Cuartel General / Ensenada',
    systemStock: 180,
    physicalCount: 195,
    differenceQty: 15,
    unit: 'Millar',
    unitCost: 1480,
    financialImpactMXN: 22200,
    partidaGasto: '21101',
    severity: 'MODERADA',
    status: 'CONCILIADO',
    lastAuditDate: '2026-10-20',
    auditorOfficer: 'Cap. Corb. Adm. E. Zúñiga',
    investigationNotes: 'Sobrante físico por remesa consolidada de Cuartel General no ingresada a tiempo en el sistema. Inventario conciliado y regularizado.',
    folioActa: 'ACTA-AUD-RN2-2026-019'
  },
  {
    id: 'DISC-2026-005',
    nsnCode: '4010-01-311-6677',
    itemName: 'Cabos de Amarre Polipropileno Trenzado 8 Cordones 3 Pulgadas',
    zoneId: 'RN-4',
    zoneName: 'Cuarta Región Naval (Pacífico Centro)',
    locationNode: 'Pañol de Maniobras / Mazatlán',
    systemStock: 19,
    physicalCount: 17,
    differenceQty: -2,
    unit: 'Carrete 220 mts',
    unitCost: 28500,
    financialImpactMXN: 57000,
    partidaGasto: '29601',
    severity: 'ALTA',
    status: 'JUSTIFICADO_MERMA',
    lastAuditDate: '2026-10-15',
    auditorOfficer: 'Cap. Frag. CG Auditor M. Trejo',
    investigationNotes: 'Merma operativa por rotura de amarra en temporal invernal de la patrulla interceptora PI-1102. Dictamen técnico de desecho aprobado.',
    folioActa: 'ACTA-AUD-RN4-2026-031'
  },
  {
    id: 'DISC-2026-006',
    nsnCode: '6850-01-209-4412',
    itemName: 'Desengrasante Biodegradable para Sentinas y Salas de Máquinas',
    zoneId: 'RN-6',
    zoneName: 'Sexta Región Naval (Sonda de Campeche)',
    locationNode: 'Almacén Costero / Cd. del Carmen',
    systemStock: 38,
    physicalCount: 34,
    differenceQty: -4,
    unit: 'Tambor 208 Lts',
    unitCost: 9200,
    financialImpactMXN: 36800,
    partidaGasto: '25201',
    severity: 'MODERADA',
    status: 'ACTA_LEVANTADA',
    lastAuditDate: '2026-10-22',
    auditorOfficer: 'Ten. Frag. Químico J. Morales',
    investigationNotes: 'Derrame accidental en bodega por fisura en estiba. Se levantó Acta de Daños y se aisló el área conforme a protocolo ambiental MARPOL.',
    folioActa: 'ACTA-AUD-RN6-2026-007'
  }
];

export const INITIAL_ZONAL_AUDIT_LOGS: ZonalAuditLog[] = [
  {
    id: 'AUD-LOG-RN1-001',
    zoneId: 'RN-1',
    zoneName: 'Primera Región Naval (Golfo Norte)',
    timestamp: '2026-10-30 14:22:15',
    auditorName: 'Capitán de Fragata CG Manuel Trejo',
    auditorRank: 'Auditor Regional Militar',
    actionTaken: 'Inspección física ocular por muestreo aleatorio en Pañol Central de Tuxpan.',
    affectedItem: 'Pintura Marina Epóxica Bicapa Anticorrosiva',
    resolutionType: 'CONCILIACION_ADMINISTRATIVA',
    status: 'EN_CURSO',
    shaHash: 'SHA256:d8a9e102bc45...'
  },
  {
    id: 'AUD-LOG-RN5-002',
    zoneId: 'RN-5',
    zoneName: 'Quinta Región Naval (Pacífico Sur)',
    timestamp: '2026-10-28 11:05:40',
    auditorName: 'Capitán de Navío IM Héctor Salcedo',
    auditorRank: 'Inspector General de Intendencia',
    actionTaken: 'Apertura de expediente militar por faltante no justificado de 14 cubetas de antifouling.',
    affectedItem: 'Pintura Anti-incrustante Antifouling Cobre/Silicón',
    resolutionType: 'SANCION_DISCIPLINARIA',
    status: 'RATIFICADA_MANDO',
    shaHash: 'SHA256:44b029ff10ce...'
  },
  {
    id: 'AUD-LOG-RN3-003',
    zoneId: 'RN-3',
    zoneName: 'Tercera Región Naval (Caribe)',
    timestamp: '2026-10-25 16:40:02',
    auditorName: 'Teniente de Navío Rodrigo Armenta',
    auditorRank: 'Jefe de Control de Abastecimiento',
    actionTaken: 'Confronta de remisión N° 4410 con entrada en almacén general de Chetumal.',
    affectedItem: 'Kit de Aseo de Dotación e Higiene Táctica',
    resolutionType: 'CONCILIACION_ADMINISTRATIVA',
    status: 'EN_CURSO',
    shaHash: 'SHA256:a18c09192fed...'
  },
  {
    id: 'AUD-LOG-RN2-004',
    zoneId: 'RN-2',
    zoneName: 'Segunda Región Naval (Pacífico Norte)',
    timestamp: '2026-10-20 09:30:18',
    auditorName: 'Capitán de Corbeta Eduardo Zúñiga',
    auditorRank: 'Auditor Delegado',
    actionTaken: 'Regularización de remesa de papelería oficial con dictamen favorable de Oficial Mayor.',
    affectedItem: 'Papelería Oficial Militar con Sello Seco',
    resolutionType: 'CONCILIACION_ADMINISTRATIVA',
    status: 'CERRADA',
    shaHash: 'SHA256:f9021a88bb33...'
  },
  {
    id: 'AUD-LOG-RN4-005',
    zoneId: 'RN-4',
    zoneName: 'Cuarta Región Naval (Pacífico Centro)',
    timestamp: '2026-10-15 13:10:55',
    auditorName: 'Capitán de Fragata CG Manuel Trejo',
    auditorRank: 'Auditor Regional Militar',
    actionTaken: 'Validación de desecho de cabos dañados en operaciones de interdicción ENSAR.',
    affectedItem: 'Cabos de Amarre Polipropileno 8 Cordones',
    resolutionType: 'AJUSTE_POR_MERMA',
    status: 'CERRADA',
    shaHash: 'SHA256:77bc0928aa11...'
  },
  {
    id: 'AUD-LOG-RN6-006',
    zoneId: 'RN-6',
    zoneName: 'Sexta Región Naval (Sonda de Campeche)',
    timestamp: '2026-10-22 17:50:30',
    auditorName: 'Teniente de Fragata Jorge Morales',
    auditorRank: 'Oficial de Seguridad Marina',
    actionTaken: 'Dictamen de siniestro menor en tambores químicos y notificación a capitanía de puerto.',
    affectedItem: 'Desengrasante Biodegradable para Sentinas',
    resolutionType: 'AJUSTE_POR_MERMA',
    status: 'RATIFICADA_MANDO',
    shaHash: 'SHA256:32ffaa881023...'
  }
];


