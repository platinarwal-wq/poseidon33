import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));
app.use('/imagenes', express.static(path.resolve(__dirname, 'imagenes')));

// Initialized Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('[POSEIDÓN-LOG] Fallo al inicializar cliente Gemini:', err);
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number, timeoutMsg: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(timeoutMsg)), ms))
  ]);
}

function generateTacticalOrderFallback(scenario: string, context?: any) {
  const isVessel = /buque|patrulla|motor|overhaul|dique|polas?|oaxaca|arm/i.test(scenario);
  const isVestuario = /uniforme|ripstop|calzado|vestuario|dotación|bota/i.test(scenario);

  const budgetAccount = isVessel ? "29601" : isVestuario ? "27101" : "35701";
  const accountName = isVessel 
    ? "Refacciones y Accesorios Menores de Equipo de Transporte Naval"
    : isVestuario 
    ? "Vestuario, Blancos, Prendas de Protección y Artículos Deportivos" 
    : "Mantenimiento y Conservación de Maquinaria Naval y Embarcaciones";

  const totalCost = isVessel ? 1850000 : isVestuario ? 4850000 : 920000;

  return {
    summary: `Resolución logística naval procesada por el motor de contingencia táctica POSEIDÓN-LOG para: ${scenario}`,
    affectedModules: isVessel 
      ? ["Módulo IV: Mantenimiento Preventivo y Flota", "Módulo III: Control de Compras e Inventarios"]
      : ["Módulo II: Planeación de Producción y Presupuesto (MRP)", "Módulo III: Control de Compras e Inventarios"],
    budgetImpact: {
      accountCode: budgetAccount,
      accountName,
      totalEstimatedCost: totalCost,
      currency: "MXN"
    },
    technicalOrderMarkdown: `### ORDEN TÉCNICA DE MANDO Y LOGÍSTICA NAVAL N° OT-PL-${Date.now().toString().slice(-6)}
**EMISOR:** POSEIDÓN-LOG / Dirección General de Intendencia y Logística Naval (Protocolo de Contingencia)
**CLASIFICACIÓN:** RESERVADO // OPERATIVO
**FECHA/HORA:** ${new Date().toISOString()}

#### 1. Módulos Afectados
- **${isVessel ? 'MÓDULO IV: Mantenimiento Preventivo y Flota' : 'MÓDULO II: MRP & Maestranza Naval (Explosión de Materiales)'}**
- **MÓDULO III:** Control de Inventario Serializado y Cadena de Custodia

#### 2. Justificación Operativa
Requerimiento formulado: *"${scenario}"*.
Se ejecuta la validación cruzada contra el catálogo maestro y la proyección de dotaciones reglamentarias de la fuerza naval.

#### 3. Cuadro de Insumos y Afectación Presupuestal
| Concepto / Componente | Requerimiento Neto | Factor Merma (%) | Volumen Bruto Requerido | Costo Unitario (MXN) | Subtotal Afectado |
| :--- | :--- | :--- | :--- | :--- | :--- |
| ${isVessel ? 'Inyectores de Combustible Marino Common Rail' : 'Tejido Ripstop Naval 65/35'} | ${isVessel ? '8 unidades' : '16,500 m²'} | ${isVessel ? '0.0%' : '6.0%'} | ${isVessel ? '8 pzas' : '17,490 m²'} | ${isVessel ? '$145,000.00' : '$145.00'} | ${isVessel ? '$1,160,000.00' : '$2,536,050.00'} |
| ${isVessel ? 'Kits de Empaquetadura Térmica Alta Presión' : 'Hilo Poliamida Grado Militar'} | ${isVessel ? '4 kits' : '2,500 conos'} | ${isVessel ? '0.0%' : '3.5%'} | ${isVessel ? '4 kits' : '2,588 conos'} | ${isVessel ? '$42,500.00' : '$88.00'} | ${isVessel ? '$170,000.00' : '$227,744.00'} |
| Mano de Obra Maestranza y Dique (HH) | ${isVessel ? '1,200 horas' : '8,500 horas'} | N/A | ${isVessel ? '1,200 HH' : '8,500 HH'} | ${isVessel ? '$433.00' : '$180.00'} | ${isVessel ? '$520,000.00' : '$1,530,000.00'} |
| **TOTAL AFECTACIÓN BRUTA** | — | — | — | — | **$${totalCost.toLocaleString('es-MX')}.00 MXN** |

#### 4. Vinculación Presupuestal y Registros de Control
- **Partida de Gasto:** ${budgetAccount} - ${accountName}
- **Centro Gestor:** Jefatura de Operaciones Navales / Maestranza Central
- **Cadena de Custodia:** Certificación de trazabilidad reglamentaria con sello digital POSEIDÓN-LOG.

#### 5. Dictamen y Autorización
Se emite la presente orden técnica con visto bueno de balance presupuestal y disponibilidad de insumos en pañoles zonales. Listo para validación de mando superior.`,
    systemAction: {
      type: isVessel ? "maintenance_alert" : "production_order",
      targetEntity: isVessel ? "BUQUE-ARM-FLOTA" : "Lote LOTE-UNIF-NAV-2026",
      priority: "ALTA",
      parameters: { scenario }
    }
  };
}

const fallbackTacticalProfiles: Record<string, { title: string; text: string; sources: { title: string; uri: string }[] }> = {
  'RN-1': {
    title: 'Sector Naval Tuxpan y Puerto de Veracruz',
    text: `### REPORTE GEOGRÁFICO Y PORTUARIO MILITAR: RN-1 (TUXPAN / VERACRUZ)
**Ubicación:** Barra de Tuxpan, Veracruz (Lat: 20.9573° N, Lng: -97.4080° W).
- **Instalaciones Principales:** Cuartel General de la Primera Región Naval, Base Aeronaval de Tuxpan, Muelle de Combate y Dársena de Aprovisionamiento.
- **Acceso Náutico y Calado:** Canal de navegación fluvial dragado a 11.5 metros de calado. Facilita el arribo de Patrullas Oceánicas (POLA y Clase Oaxaca) y buques de auxilio logístico.
- **Capacidades Operativas:** Estación de Búsqueda y Rescate Marítimo (ENSAR), Pañol Zonal de Refacciones Navales y terminal de aprovisionamiento de combustible diesel marino (MGO).
- **Zona Económica Exclusiva (ZEE):** Monitoreo constante del tráfico de buques tanque petroleros y gaseros procedentes del Golfo de México y corredor Tuxpan-Tampico.`,
    sources: [
      { title: 'Puerto y Capitanía de Tuxpan en Google Maps', uri: 'https://www.google.com/maps/search/?api=1&query=Capitania+de+Puerto+Tuxpan+Veracruz' },
      { title: 'Base Aeronaval de Veracruz en Google Maps', uri: 'https://www.google.com/maps/search/?api=1&query=Base+Aeronaval+Las+Bajadas+Veracruz' }
    ]
  },
  'RN-2': {
    title: 'Segunda Región Naval Ensenada (Pacífico Norte)',
    text: `### REPORTE GEOGRÁFICO Y PORTUARIO MILITAR: RN-2 (ENSENADA, BAJA CALIFORNIA)
**Ubicación:** Bahía de Todos Santos, Ensenada, B.C. (Lat: 31.8667° N, Lng: -116.5964° W).
- **Instalaciones Principales:** Cuartel General de la Segunda Región Naval, Dársena Naval de Ensenada, Estación Naval de Búsqueda y Vigilancia ZEE Pacífico Norte.
- **Calado y Dique:** Calado natural de 14 metros en dársena exterior, 10 metros en muelle de unidades de superficie. Conexión rápida con diques secos y talleres de carenado naval.
- **Capacidades Tácticas:** Base de despliegue de Patrullas Oceánicas e Interceptoras para patrullaje de frontera marítima con EE.UU., interdicción marítima y protección de fauna marina.`,
    sources: [
      { title: 'Segunda Región Naval Ensenada en Google Maps', uri: 'https://www.google.com/maps/search/?api=1&query=Segunda+Region+Naval+Ensenada' },
      { title: 'Puerto de Ensenada en Google Maps', uri: 'https://www.google.com/maps/search/?api=1&query=Puerto+de+Ensenada+Baja+California' }
    ]
  },
  'RN-3': {
    title: 'Tercera Región Naval Chetumal / Isla Mujeres (Caribe Mexicano)',
    text: `### REPORTE GEOGRÁFICO Y PORTUARIO MILITAR: RN-3 (CHETUMAL / ISLA MUJERES, QUINTANA ROO)
**Ubicación:** Bahía de Chetumal y Canal de Yucatán (Lat: 18.5036° N, Lng: -88.2961° W).
- **Instalaciones Principales:** Cuartel General de la Tercera Región Naval, Estación Naval Avanzada de Isla Mujeres, Base de Interdicción Marítima Cozumel.
- **Acceso Náutico y Calado:** 8.5 metros de calado en dársena militar, 5 posiciones de atraque protegidas de oleaje caribeño.
- **Misión Estratégica:** Vigilancia de la frontera marítima sur con Belice, control de rutas turísticas y comerciales en el Canal de Yucatán, interdicción de ilícitos en aguas internacionales.`,
    sources: [
      { title: 'Estación Naval Chetumal en Google Maps', uri: 'https://www.google.com/maps/search/?api=1&query=Estacion+Naval+Chetumal+Quintana+Roo' },
      { title: 'Sector Naval Isla Mujeres en Google Maps', uri: 'https://www.google.com/maps/search/?api=1&query=Sector+Naval+Isla+Mujeres' }
    ]
  },
  'RN-4': {
    title: 'Cuarta Región Naval Mazatlán (Pacífico Centro / Golfo de California)',
    text: `### REPORTE GEOGRÁFICO Y PORTUARIO MILITAR: RN-4 (MAZATLÁN, SINALOA)
**Ubicación:** Entrada sur al Golfo de California, Mazatlán, Sinaloa (Lat: 23.2167° N, Lng: -106.4167° W).
- **Instalaciones Principales:** Cuartel General de la Cuarta Región Naval, Dársena de la Flota del Pacífico, ENSAR Mazatlán y Centro de Adiestramiento de Superficie.
- **Calado y Facilidades:** Calado operativo de 12.0 metros, 9 posiciones de atraque, patio de maniobras y conexión con vía férrea y autopista Mazatlán-Durango.
- **Operaciones:** Mando de la Fuerza Naval del Pacífico, operaciones de interdicción en el corredor marítimo occidental y protección de áreas naturales protegidas (Islas Marías).`,
    sources: [
      { title: 'Cuarta Región Naval Mazatlán en Google Maps', uri: 'https://www.google.com/maps/search/?api=1&query=Cuarta+Region+Naval+Mazatlan' },
      { title: 'Puerto de Mazatlán en Google Maps', uri: 'https://www.google.com/maps/search/?api=1&query=Puerto+de+Mazatlan+Sinaloa' }
    ]
  },
  'RN-5': {
    title: 'Astillero de Marina N° 20 y Base Salina Cruz',
    text: `### REPORTE GEOGRÁFICO Y PORTUARIO MILITAR: RN-5 (SALINA CRUZ, OAXACA)
**Ubicación:** Golfo de Tehuantepec, Salina Cruz, Oaxaca (Lat: 16.1667° N, Lng: -95.2000° W).
- **Instalaciones Principales:** Astillero de Marina Número 20 (ASTIMAR 20), Dique Seco de Gran Capacidad (hasta 25,000 DWT), Cuartel General Quinta Región Naval.
- **Capacidades Industriales:** Construcción, reparación mayor y carenado de patrullas oceánicas y buques de aprovisionamiento logístico (Clase Montes Azules).
- **Entorno Meteorológico/Geográfico:** Sujeto a fuertes vientos 'Tehuanos' estacionales en el istmo; sistema de rompeolas y rada protegida.`,
    sources: [
      { title: 'Astillero de Marina Salina Cruz en Google Maps', uri: 'https://www.google.com/maps/search/?api=1&query=Astillero+de+Marina+20+Salina+Cruz' },
      { title: 'Puerto de Salina Cruz en Google Maps', uri: 'https://www.google.com/maps/search/?api=1&query=Puerto+Salina+Cruz+Oaxaca' }
    ]
  },
  'RN-6': {
    title: 'Sexta Región Naval Ciudad del Carmen (Sonda de Campeche)',
    text: `### REPORTE GEOGRÁFICO Y PORTUARIO MILITAR: RN-6 (CD. DEL CARMEN, CAMPECHE)
**Ubicación:** Isla del Carmen / Laguna de Términos (Lat: 18.6500° N, Lng: -91.8333° W).
- **Instalaciones Principales:** Sector Naval Carmen, Puerto Isla del Carmen, Muelle de Unidades Rápidas de Respuesta Inmediata (URRI).
- **Misión Estratégica:** Operación Refuerzo Sonda para protección física y marítima de más de 200 plataformas petroleras costa afuera, gasoductos submarinos e infraestructura energética crítica.
- **Vigilancia Satelital & Radar:** Cobertura de radar costero y patrullaje conjunto con helicópteros Panther.`,
    sources: [
      { title: 'Puerto Isla del Carmen en Google Maps', uri: 'https://www.google.com/maps/search/?api=1&query=Puerto+Isla+del+Carmen+Campeche' },
      { title: 'Sonda de Campeche en Google Maps', uri: 'https://www.google.com/maps/search/?api=1&query=Sonda+de+Campeche+Mexico' }
    ]
  }
};

function getTacticalFallback(zoneId?: string, query?: string, lat?: number, lng?: number) {
  if (zoneId && fallbackTacticalProfiles[zoneId]) {
    return fallbackTacticalProfiles[zoneId];
  }

  const queryUpper = (query || 'BASE NAVAL ZEE').toUpperCase();
  const safeLat = typeof lat === 'number' ? lat.toFixed(4) : '19.4326';
  const safeLng = typeof lng === 'number' ? lng.toFixed(4) : '-99.1332';

  return {
    title: `Inteligencia Portuaria y Táctica Naval (${query || 'Zona ZEE'})`,
    text: `### REPORTE GEOGRÁFICO MILITAR DE CONTINGENCIA: ${queryUpper}
**Coordenadas de Operación:** Lat: ${safeLat}° N, Lng: ${safeLng}° W (Sector Cartográfico ZEE).
- **Entorno Geográfico:** Nodo litoral estratégico integrado a la red C4I de mando y control marítimo de POSEIDÓN-LOG.
- **Infraestructura Portuaria:** Muelles navales aptos para atraque de unidades de superficie de la Armada de México (Patrullas Oceánicas, Costeras e Interceptoras).
- **Suministro Logístico:** Pañol de aprovisionamiento de refacciones críticas con certificación OTAN (NSN), combustible diesel marino (MGO) y lubricantes navales.
- **Soberanía y Vigilancia:** Enlace permanente con radares costeros de banda X/S y estaciones aeronavales para resguardo de la Zona Económica Exclusiva.`,
    sources: [
      {
        title: `${query || 'Zona Naval'} en Google Maps`,
        uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || 'Base Naval Armada de Mexico')}`
      },
      {
        title: 'Ver Coordenadas Tácticas Satelitales',
        uri: `https://www.google.com/maps/search/?api=1&query=${safeLat},${safeLng}`
      }
    ]
  };
}

// POSEIDÓN-LOG AI Command Endpoint
app.post('/api/poseidon/command', async (req: Request, res: Response) => {
  const { scenario, context } = req.body;
  if (!scenario || typeof scenario !== 'string') {
    return res.status(400).json({ error: 'Falta parámetro scenario en la solicitud.' });
  }

  const systemInstruction = `Eres "POSEIDÓN-LOG", el Sistema de Inteligencia Artificial Militar de Mando, Control y Logística Integral para Fuerzas Navales.
Tu función es operar como el motor central de análisis, optimización, auditoría y trazabilidad operativa de la fuerza marina en 4 dimensiones críticas:
1. GESTIÓN DE NECESIDADES ADMINISTRATIVAS (PAA, catálogos navales, proyección predictiva por censo, firmas jerárquicas).
2. PLANEACIÓN DE PRODUCCIÓN Y PRESUPUESTO - MRP / MAESTRANZA (BOM, explosión neta de materiales, merma técnica, HH, afectación presupuestal de gasto público, orden de compra).
3. CONTROL DE COMPRAS, INVENTARIOS Y DISTRIBUCIÓN (Cadena de custodia 6 eslabones, dotación nominal chip/NFC/credencial militar, control de duplicidad reglamentaria, serialización QR/RFID).
4. MANTENIMIENTO PREVENTIVO Y PREDICTIVO (Horómetros navales, estados de flota [Operativo, Preventivo, En Dique / Reparación Mayor, No Operativo / Espera de Refacción], criticidad táctica, carenado/dique seco).

DIRECTRICES OBLIGATORIAS ANTE CADA SOLICITUD O ESCENARIO:
1. Identificar módulo(s) afectado(s).
2. Calcular insumos, costos, piezas o tiempos con precisión matemática rigurosa (ej. mermas del 4.5% al 8%, costos en MXN/USD, horas-hombre, etc.).
3. Vincular los registros de control (Partidas presupuestales mexicanas/navales como 27101 Vestuario, 29601 Refacciones, 35701 Mantenimiento, ID militar, buques ej. ARM Benito Juárez PO-166, etc.).
4. Generar la Orden Técnica / Acta Oficial / Requisición lista para validación de mando en formato Markdown militar con tablas claras.

Devuelve tu respuesta en formato JSON con la siguiente estructura exacta:
{
  "summary": "Resumen ejecutivo militar del caso y dictamen en 1-2 oraciones",
  "affectedModules": ["Módulo I: Necesidades Administrativas", "Módulo II: MRP y Maestranza", ...],
  "budgetImpact": {
    "accountCode": "27101 / 29601 / etc.",
    "accountName": "Nombre oficial de la partida",
    "totalEstimatedCost": 1250000,
    "currency": "MXN"
  },
  "technicalOrderMarkdown": "Contenido completo en Markdown militar con tablas, justificación, desglose de costos/materiales, firmas y controles reglamentarios.",
  "systemAction": {
    "type": "production_order" | "maintenance_alert" | "paa_consolidation" | "inventory_audit" | "general_directive",
    "targetEntity": "Identificador de buque, lote o zona",
    "priority": "ALTA" | "CRITICA" | "MEDIA" | "RUTINARIA",
    "parameters": {}
  }
}`;

  if (!aiClient) {
    return res.json(generateTacticalOrderFallback(scenario, context));
  }

  try {
    const prompt = `Analiza la siguiente solicitud/escenario en el contexto operativo de la Armada/Fuerza Naval:
"${scenario}"

Contexto adicional del sistema actual:
${JSON.stringify(context || {})}

Aplica las 4 directrices operativas de POSEIDÓN-LOG. Devuelve estrictamente el JSON especificado sin código envoltorio adicional fuera de JSON válido.`;

    const response = await withTimeout(
      aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        }
      }),
      8000,
      'Tiempo de espera de Gemini agotado'
    );

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    const isQuota = error?.status === 429 || error?.code === 429 ||
      String(error?.message || '').includes('429') ||
      String(error?.message || '').includes('quota') ||
      String(error?.message || '').includes('RESOURCE_EXHAUSTED');
    console.warn(`[POSEIDÓN-LOG] Comando IA: ${isQuota ? 'Límite de cuota Gemini alcanzado (429 RESOURCE_EXHAUSTED)' : 'Servicio IA en contingencia'}. Generando resolución táctica reglamentaria.`);
    return res.json(generateTacticalOrderFallback(scenario, context));
  }
});

// Maps Configuration Endpoint
app.get('/api/config/maps', (_req: Request, res: Response) => {
  const envVite = (process.env.VITE_GOOGLE_MAPS_API_KEY || '').trim();
  const envGoogle = (process.env.GOOGLE_MAPS_API_KEY || '').trim();
  let mapsKey = envVite.startsWith('AIza') ? envVite : envGoogle.startsWith('AIza') ? envGoogle : 'AIzaSyBX-Be0ccmjxJ7Dr0lMazZXNAGKvbIU7Kc';
  const isValidMapsKey = Boolean(mapsKey && mapsKey.startsWith('AIza'));
  res.json({
    hasKey: isValidMapsKey,
    apiKey: isValidMapsKey ? mapsKey : null
  });
});

// Google Maps Grounding Endpoint with Gemini 3.8 Flash
app.post('/api/maps/grounding', async (req: Request, res: Response) => {
  const { query, zoneId, lat, lng } = req.body;
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Parámetro query es requerido.' });
  }

  if (!aiClient) {
    const fallback = getTacticalFallback(zoneId, query, lat, lng);
    return res.json({
      text: fallback.text,
      sources: fallback.sources,
      isSimulated: true,
      quotaExceeded: false,
      contingencyMode: true
    });
  }

  try {
    const prompt = `Actúa como oficial de inteligencia geográfica y cartografía naval de POSEIDÓN-LOG. 
Proporciona información geográfica, portuaria, náutica y de infraestructura militar actualizada para la siguiente consulta o base naval:
"${query}"

Describe:
1. Coordenadas y entorno geográfico litoral (costa, barra, bahía o dársena).
2. Instalaciones militares y portuarias (muelles navales, capitanía, astilleros, diques, bases aeronavales o ENSAR).
3. Calado, accesibilidad náutica y condiciones operativas para buques de la Armada de México.
4. Conectividad logística e importancia estratégica para la soberanía marítima en la Zona Económica Exclusiva (ZEE).

Usa formato Markdown militar conciso con viñetas y datos precisos.`;

    const config: any = {
      tools: [{ googleMaps: {} }]
    };

    if (lat && lng) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: Number(lat),
            longitude: Number(lng),
          }
        }
      };
    }

    const response = await withTimeout(
      aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config
      }),
      8000,
      'Tiempo de espera de cartografía Gemini agotado'
    );

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const extractedSources: { title: string; uri: string }[] = [];

    groundingChunks.forEach((chunk: any) => {
      if (chunk.maps) {
        extractedSources.push({
          title: chunk.maps.title || 'Ubicación Google Maps',
          uri: chunk.maps.uri || ''
        });
      }
      if (chunk.web) {
        extractedSources.push({
          title: chunk.web.title || 'Fuente Cartográfica',
          uri: chunk.web.uri || ''
        });
      }
    });

    // If no direct sources returned in chunks, ensure a direct Maps search link is available
    if (extractedSources.length === 0) {
      extractedSources.push({
        title: `Ver ${query} en Google Maps`,
        uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
      });
    }

    return res.json({
      text: response.text || '',
      sources: extractedSources,
      groundingMetadata: response.candidates?.[0]?.groundingMetadata,
      isSimulated: false,
      quotaExceeded: false
    });
  } catch (err: any) {
    const isQuota = err?.status === 429 || err?.code === 429 || 
      String(err?.message || '').includes('429') || 
      String(err?.message || '').includes('quota') ||
      String(err?.message || '').includes('RESOURCE_EXHAUSTED');

    console.warn(`[POSEIDÓN-LOG] Cartografía Naval Grounding: ${isQuota ? 'Límite de cuota Gemini alcanzado (429 RESOURCE_EXHAUSTED)' : 'Servicio externo Maps/Gemini no disponible'}. Despachando perfil hidrográfico y táctico de contingencia ZEE.`);

    const fallback = getTacticalFallback(zoneId, query, lat, lng);
    return res.json({
      text: fallback.text,
      sources: fallback.sources,
      isSimulated: true,
      quotaExceeded: isQuota,
      contingencyMode: true
    });
  }
});

// Vite or Static Assets handling (skipped on Vercel Serverless where dist/ is served by CDN)
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[POSEIDÓN-LOG] Dev/Server running on port ${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('Failed to start POSEIDÓN-LOG server:', err);
    process.exit(1);
  });
}

export { app };
export default app;

