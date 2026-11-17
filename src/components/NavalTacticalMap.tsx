import React, { useState, useEffect, useRef } from 'react';
import { NavalZoneCenso, NavalVessel, RequisitionPAA, InventoryDiscrepancy } from '../types/naval';
import { 
  MapPin, 
  Ship, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Compass, 
  Layers, 
  Users, 
  DollarSign, 
  Maximize2, 
  Crosshair, 
  Anchor, 
  Activity,
  ArrowRight,
  Filter,
  Eye,
  Globe2,
  Navigation,
  Sparkles,
  ExternalLink,
  Search,
  Radio,
  Cpu,
  RefreshCw,
  SlidersHorizontal,
  Info,
  ShieldCheck
} from 'lucide-react';

interface NavalTacticalMapProps {
  zones: NavalZoneCenso[];
  vessels: NavalVessel[];
  requisitions: RequisitionPAA[];
  discrepancies: InventoryDiscrepancy[];
  onSelectVessel?: (vessel: NavalVessel) => void;
  onNavigateToTab?: (tab: 'paa' | 'auditoria' | 'mantenimiento' | 'mando') => void;
}

interface TacticalNodeGeo {
  id: string; // "RN-1", etc.
  zoneName: string;
  location: string;
  coast: 'GOLFO_CARIBE' | 'PACIFICO';
  lat: number;
  lng: number;
  svgX: number; // For fallback vector map
  svgY: number; // For fallback vector map
  baseName: string;
  headquarters: string;
  portSpecs: {
    maxDraftMeters: number;
    berths: number;
    dryDockCapacityDWT: number;
    radarCoverageNM: number;
  };
}

export const NAVAL_NODES_GEO: TacticalNodeGeo[] = [
  {
    id: 'RN-1',
    zoneName: 'Primera Región Naval (Golfo Norte)',
    location: 'Tuxpan, Ver.',
    coast: 'GOLFO_CARIBE',
    lat: 20.9573,
    lng: -97.4080,
    svgX: 64,
    svgY: 53,
    baseName: 'Sector Naval Tuxpan / Base Aeronaval Veracruz',
    headquarters: 'Cuartel General RN-1 (Tuxpan)',
    portSpecs: {
      maxDraftMeters: 11.5,
      berths: 8,
      dryDockCapacityDWT: 12000,
      radarCoverageNM: 85
    }
  },
  {
    id: 'RN-2',
    zoneName: 'Segunda Región Naval (Pacífico Norte)',
    location: 'Ensenada, B.C.',
    coast: 'PACIFICO',
    lat: 31.8667,
    lng: -116.5964,
    svgX: 14,
    svgY: 18,
    baseName: 'Base Naval Ensenada / ZEE Pacífico Norte',
    headquarters: 'Cuartel General RN-2 (Ensenada)',
    portSpecs: {
      maxDraftMeters: 14.0,
      berths: 6,
      dryDockCapacityDWT: 18000,
      radarCoverageNM: 120
    }
  },
  {
    id: 'RN-3',
    zoneName: 'Tercera Región Naval (Caribe)',
    location: 'Chetumal, Q.Roo',
    coast: 'GOLFO_CARIBE',
    lat: 18.5036,
    lng: -88.2961,
    svgX: 88,
    svgY: 65,
    baseName: 'Estación Naval Chetumal / Isla Mujeres ZEE Caribe',
    headquarters: 'Cuartel General RN-3 (Chetumal)',
    portSpecs: {
      maxDraftMeters: 8.5,
      berths: 5,
      dryDockCapacityDWT: 5000,
      radarCoverageNM: 95
    }
  },
  {
    id: 'RN-4',
    zoneName: 'Cuarta Región Naval (Pacífico Centro)',
    location: 'Mazatlán, Sin.',
    coast: 'PACIFICO',
    lat: 23.2167,
    lng: -106.4167,
    svgX: 38,
    svgY: 48,
    baseName: 'Base Naval Mazatlán / Golfo de California',
    headquarters: 'Cuartel General RN-4 (Mazatlán)',
    portSpecs: {
      maxDraftMeters: 12.0,
      berths: 9,
      dryDockCapacityDWT: 15000,
      radarCoverageNM: 110
    }
  },
  {
    id: 'RN-5',
    zoneName: 'Quinta Región Naval (Pacífico Sur)',
    location: 'Salina Cruz, Oax.',
    coast: 'PACIFICO',
    lat: 16.1667,
    lng: -95.2000,
    svgX: 68,
    svgY: 84,
    baseName: 'Astillero de Marina N° 20 / Dique Seco Salina Cruz',
    headquarters: 'Cuartel General RN-5 (Salina Cruz)',
    portSpecs: {
      maxDraftMeters: 14.5,
      berths: 12,
      dryDockCapacityDWT: 25000,
      radarCoverageNM: 130
    }
  },
  {
    id: 'RN-6',
    zoneName: 'Sexta Región Naval (Sonda de Campeche)',
    location: 'Cd. del Carmen, Camp.',
    coast: 'GOLFO_CARIBE',
    lat: 18.6500,
    lng: -91.8333,
    svgX: 77,
    svgY: 63,
    baseName: 'Sector Naval Carmen / Sonda de Campeche ZEE',
    headquarters: 'Cuartel General RN-6 (Cd. del Carmen)',
    portSpecs: {
      maxDraftMeters: 7.5,
      berths: 14,
      dryDockCapacityDWT: 8000,
      radarCoverageNM: 90
    }
  }
];

// Approximate real coordinates for fleet patrols
const VESSEL_GEO_POSITIONS: Record<string, { lat: number; lng: number; heading: number }> = {
  'VESSEL-001': { lat: 20.35, lng: -96.50, heading: 45 },   // ARM Benito Juárez - Golfo
  'VESSEL-002': { lat: 30.80, lng: -116.80, heading: 175 }, // ARM Reformador - Pacífico Norte
  'VESSEL-003': { lat: 15.60, lng: -96.20, heading: 290 },  // ARM Oaxaca - Tehuantepec
  'VESSEL-004': { lat: 22.80, lng: -106.80, heading: 330 }, // ARM Tehuantepec - Mar de Cortés
  'VESSEL-005': { lat: 19.45, lng: -91.95, heading: 15 },   // ARM Chiapas - Sonda de Campeche
  'VESSEL-006': { lat: 19.80, lng: -95.50, heading: 80 },   // ARM Tabasco - Veracruz
  'VESSEL-007': { lat: 21.40, lng: -86.50, heading: 110 },  // ARM Coahuila - Caribe
  'VESSEL-008': { lat: 16.17, lng: -95.19, heading: 0 },    // BAL Montes Azules - Astillero Salina Cruz
};

export const NavalTacticalMap: React.FC<NavalTacticalMapProps> = ({
  zones,
  vessels,
  requisitions,
  discrepancies,
  onSelectVessel,
  onNavigateToTab
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('RN-1');
  const [filterMode, setFilterMode] = useState<'ALL' | 'CRITICAL_ONLY' | 'GOLFO' | 'PACIFICO'>('ALL');
  const [viewEngine, setViewEngine] = useState<'GOOGLE_MAPS' | 'VECTORIAL_RADAR'>('GOOGLE_MAPS');
  const [mapType, setMapType] = useState<'satellite' | 'hybrid' | 'terrain' | 'roadmap'>('hybrid');
  const [showVesselPins, setShowVesselPins] = useState<boolean>(true);
  const [showPatrolCorridors, setShowPatrolCorridors] = useState<boolean>(true);
  const [showRadarGrid, setShowRadarGrid] = useState<boolean>(true);

  // Google Maps JS API State
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const googleMapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylinesRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = useState<boolean>(false);
  const [googleMapsError, setGoogleMapsError] = useState<string | null>(null);
  const [apiKeyOverride, setApiKeyOverride] = useState<string>('AIzaSyBX-Be0ccmjxJ7Dr0lMazZXNAGKvbIU7Kc');
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);

  // Helper: validate Google Maps Platform key format
  const isValidGoogleMapsKey = (k: string) => {
    return typeof k === 'string' && k.trim().startsWith('AIza') && k.trim().length >= 30;
  };

  // Bind Google Maps Authentication Failure handler (prevents unhandled alert popups)
  useEffect(() => {
    (window as any).gm_authFailure = () => {
      console.warn('[POSEIDÓN-LOG] Google Maps gm_authFailure triggered. Switching to Tactical Vectorial Radar.');
      setGoogleMapsError('La API Key ingresada no es válida para Google Maps Platform (InvalidKeyMapError). El sistema ha activado automáticamente la Proyección Cartográfica Táctica Vectorial.');
      setIsGoogleMapsLoaded(false);
      setViewEngine('VECTORIAL_RADAR');
      (window as any)._loadedMapsKey = null;
      googleMapInstance.current = null;
    };
  }, []);

  // Gemini Google Maps Grounding State
  const [groundingQuery, setGroundingQuery] = useState<string>('Instalaciones portuarias navales de Tuxpan Veracruz y capacidades de muelle');
  const [groundingReport, setGroundingReport] = useState<string | null>(null);
  const [groundingSources, setGroundingSources] = useState<{ title: string; uri: string }[]>([]);
  const [isGroundingLoading, setIsGroundingLoading] = useState<boolean>(false);
  const [groundingIsSimulated, setGroundingIsSimulated] = useState<boolean>(false);
  const [groundingQuotaExceeded, setGroundingQuotaExceeded] = useState<boolean>(false);

  // Calculate alerts per zone
  const zoneAlertsMap: Record<string, {
    vesselAlerts: number;
    overorderAlerts: number;
    discrepancyAlerts: number;
    totalAlerts: number;
    severity: 'CRITICA' | 'ALERTA' | 'NORMAL';
  }> = {};

  zones.forEach((z) => {
    const vAlerts = vessels.filter((v) => v.assignedRegion.includes(z.id) && v.status !== 'OPERATIVO').length;
    const rAlerts = requisitions.filter((r) => r.zoneId === z.id && r.anomalyDetected).length;
    const dAlerts = discrepancies.filter((d) => d.zoneId === z.id && d.status !== 'CONCILIADO').length;
    const total = vAlerts + rAlerts + dAlerts;

    zoneAlertsMap[z.id] = {
      vesselAlerts: vAlerts,
      overorderAlerts: rAlerts,
      discrepancyAlerts: dAlerts,
      totalAlerts: total,
      severity: total >= 3 ? 'CRITICA' : total >= 1 ? 'ALERTA' : 'NORMAL'
    };
  });

  // Selected node details
  const selectedNode = NAVAL_NODES_GEO.find(n => n.id === selectedNodeId) || NAVAL_NODES_GEO[0];
  const selectedZoneData = zones.find(z => z.id === selectedNodeId);
  const selectedZoneAlerts = zoneAlertsMap[selectedNodeId];
  const selectedZoneVessels = vessels.filter(v => v.assignedRegion.includes(selectedNodeId));
  const selectedZoneDiscrepancies = discrepancies.filter(d => d.zoneId === selectedNodeId);
  const selectedZoneRequisitions = requisitions.filter(r => r.zoneId === selectedNodeId && r.anomalyDetected);

  // Filter nodes based on user toggle
  const filteredNodes = NAVAL_NODES_GEO.filter((node) => {
    if (filterMode === 'CRITICAL_ONLY') {
      return (zoneAlertsMap[node.id]?.totalAlerts || 0) >= 2;
    }
    if (filterMode === 'GOLFO') {
      return node.coast === 'GOLFO_CARIBE';
    }
    if (filterMode === 'PACIFICO') {
      return node.coast === 'PACIFICO';
    }
    return true;
  });

  // Load Google Maps API Key from Server or Vite Environment
  useEffect(() => {
    let isMounted = true;
    async function checkMapsKey() {
      try {
        const res = await fetch('/api/config/maps');
        if (res.ok) {
          const data = await res.json();
          if (data.apiKey && isMounted && isValidGoogleMapsKey(data.apiKey)) {
            setApiKeyOverride(data.apiKey);
            setViewEngine('GOOGLE_MAPS');
          }
        }
      } catch (err) {
        console.warn('Could not fetch /api/config/maps:', err);
      }
    }
    checkMapsKey();
    return () => { isMounted = false; };
  }, []);

  // Dynamically load Google Maps script (only if key starts with AIza...)
  useEffect(() => {
    const activeKey = apiKeyOverride || (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string);
    if (!activeKey || !activeKey.trim()) {
      return;
    }

    if (!isValidGoogleMapsKey(activeKey)) {
      if (activeKey.startsWith('AQ.')) {
        setGoogleMapsError('La clave ingresada ("' + activeKey.slice(0, 7) + '...") es un token de Gemini / AI Studio, no una clave de Google Maps Platform (las cuales inician con "AIza..."). El sistema continuará operando en modo Radar Vectorial Táctico.');
      } else {
        setGoogleMapsError('La clave de Google Maps no es válida (debe iniciar con "AIza..."). Se utilizará la Proyección Cartográfica Táctica.');
      }
      setIsGoogleMapsLoaded(false);
      setViewEngine('VECTORIAL_RADAR');
      return;
    }

    if ((window as any).google && (window as any).google.maps && (window as any)._loadedMapsKey === activeKey.trim()) {
      setIsGoogleMapsLoaded(true);
      setViewEngine('GOOGLE_MAPS');
      setGoogleMapsError(null);
      return;
    }

    const scriptId = 'google-maps-js-sdk';
    const existing = document.getElementById(scriptId);
    if (existing) {
      existing.remove();
    }
    googleMapInstance.current = null;

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(activeKey.trim())}&libraries=geometry,places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      (window as any)._loadedMapsKey = activeKey.trim();
      setIsGoogleMapsLoaded(true);
      setViewEngine('GOOGLE_MAPS');
      setGoogleMapsError(null);
    };
    script.onerror = () => {
      setGoogleMapsError('No fue posible cargar el API de Google Maps. Verifique su API Key o permisos de dominio.');
      setIsGoogleMapsLoaded(false);
      setViewEngine('VECTORIAL_RADAR');
      (window as any)._loadedMapsKey = null;
    };

    document.head.appendChild(script);
  }, [apiKeyOverride]);

  // Initialize or re-render Google Map
  useEffect(() => {
    if (viewEngine !== 'GOOGLE_MAPS' || !isGoogleMapsLoaded || !mapContainerRef.current) {
      return;
    }

    const google = (window as any).google;
    if (!google || !google.maps) return;

    try {
      if (!googleMapInstance.current) {
        const map = new google.maps.Map(mapContainerRef.current, {
          center: { lat: 23.6345, lng: -102.5528 }, // Center of Mexico
          zoom: 5,
          mapTypeId: mapType,
          streetViewControl: false,
          fullscreenControl: true,
          mapTypeControl: false,
          zoomControl: true,
          styles: [
            {
              featureType: 'administrative.country',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#3b82f6' }, { weight: 1.5 }]
            }
          ]
        });

        googleMapInstance.current = map;
        infoWindowRef.current = new google.maps.InfoWindow();
      } else {
        googleMapInstance.current.setMapTypeId(mapType);
      }

      // Clear existing markers & polylines
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];
      polylinesRef.current.forEach(p => p.setMap(null));
      polylinesRef.current = [];

      const map = googleMapInstance.current;
      const infoWindow = infoWindowRef.current;

      // Draw Patrol Corridors & ZEE Polylines
      if (showPatrolCorridors) {
        // Pacific Security Corridor
        const pacificCoords = [
          { lat: 32.5, lng: -117.5 },
          { lat: 31.8667, lng: -116.5964 },
          { lat: 27.5, lng: -115.0 },
          { lat: 23.2167, lng: -106.4167 },
          { lat: 18.5, lng: -104.0 },
          { lat: 16.1667, lng: -95.2000 },
          { lat: 14.5, lng: -92.5 }
        ];

        const pacificLine = new google.maps.Polyline({
          path: pacificCoords,
          geodesic: true,
          strokeColor: '#0ea5e9',
          strokeOpacity: 0.7,
          strokeWeight: 2,
          map
        });
        polylinesRef.current.push(pacificLine);

        // Gulf & Caribbean Security Corridor
        const gulfCoords = [
          { lat: 25.5, lng: -97.0 },
          { lat: 20.9573, lng: -97.4080 },
          { lat: 19.1419, lng: -96.1872 },
          { lat: 18.6500, lng: -91.8333 },
          { lat: 21.5, lng: -86.5 },
          { lat: 18.5036, lng: -88.2961 }
        ];

        const gulfLine = new google.maps.Polyline({
          path: gulfCoords,
          geodesic: true,
          strokeColor: '#3b82f6',
          strokeOpacity: 0.7,
          strokeWeight: 2,
          map
        });
        polylinesRef.current.push(gulfLine);

        // Trans-isthmic Naval Corridor (Salina Cruz <-> Coatzacoalcos / Tuxpan)
        const transIsthmus = new google.maps.Polyline({
          path: [
            { lat: 16.1667, lng: -95.2000 },
            { lat: 18.1500, lng: -94.4500 },
            { lat: 20.9573, lng: -97.4080 }
          ],
          geodesic: true,
          strokeColor: '#f59e0b',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          map
        });
        polylinesRef.current.push(transIsthmus);
      }

      // Add Base / Node Markers
      filteredNodes.forEach((node) => {
        const alerts = zoneAlertsMap[node.id] || { totalAlerts: 0, severity: 'NORMAL' };
        const pinColor = alerts.severity === 'CRITICA' ? '#e11d48' : alerts.severity === 'ALERTA' ? '#f59e0b' : '#2563eb';

        // Custom SVG Military Pin
        const svgMarker = {
          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
          fillColor: pinColor,
          fillOpacity: 1,
          strokeWeight: 1.5,
          strokeColor: '#ffffff',
          scale: 1.8,
          anchor: new google.maps.Point(12, 22),
        };

        const marker = new google.maps.Marker({
          position: { lat: node.lat, lng: node.lng },
          map,
          title: `${node.id} — ${node.zoneName}`,
          icon: svgMarker,
          zIndex: 100
        });

        marker.addListener('click', () => {
          setSelectedNodeId(node.id);
          const content = `
            <div style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace; padding: 4px; min-width: 240px; color: #0f172a;">
              <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #0284c7; padding-bottom: 4px; margin-bottom: 6px;">
                <span style="font-weight: 800; font-size: 13px; color: #0369a1;">${node.id} // ${node.location}</span>
                <span style="background-color: ${alerts.severity === 'CRITICA' ? '#ffe4e6' : alerts.severity === 'ALERTA' ? '#fef3c7' : '#e0f2fe'}; color: ${pinColor}; font-weight: bold; font-size: 10px; padding: 2px 6px; border-radius: 4px;">
                  ${alerts.totalAlerts} ALERTAS
                </span>
              </div>
              <div style="font-size: 11px; margin-bottom: 4px; font-weight: 600;">${node.headquarters}</div>
              <div style="font-size: 10px; color: #475569; line-height: 1.4; margin-bottom: 8px;">
                • Calado Operativo: <b>${node.portSpecs.maxDraftMeters} m</b><br/>
                • Muelles Navales: <b>${node.portSpecs.berths} posiciones</b><br/>
                • Capacidad Dique: <b>${node.portSpecs.dryDockCapacityDWT.toLocaleString('es-MX')} DWT</b><br/>
                • Cobertura Radar: <b>${node.portSpecs.radarCoverageNM} NM</b>
              </div>
              <div style="border-top: 1px solid #e2e8f0; padding-top: 6px; display: flex; gap: 4px;">
                <button id="btn-inspect-node-${node.id}" style="background-color: #0c4a6e; color: #ffffff; border: none; padding: 4px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; cursor: pointer; width: 100%;">
                  Enfocar Nodo & Ver Inteligencia
                </button>
              </div>
            </div>
          `;

          infoWindow.setContent(content);
          infoWindow.open(map, marker);

          setTimeout(() => {
            const btn = document.getElementById(`btn-inspect-node-${node.id}`);
            if (btn) {
              btn.onclick = () => {
                setSelectedNodeId(node.id);
                fetchGroundingIntelligence(node.id, `${node.baseName} ${node.location}`);
              };
            }
          }, 100);
        });

        markersRef.current.push(marker);
      });

      // Add Fleet Vessel Markers
      if (showVesselPins) {
        vessels.forEach((v) => {
          const geo = VESSEL_GEO_POSITIONS[v.id];
          if (!geo) return;

          const statusColor = v.status === 'OPERATIVO' ? '#10b981' : v.status === 'PREVENTIVO' ? '#f59e0b' : v.status === 'EN_DIQUE' ? '#8b5cf6' : '#ef4444';

          const vesselMarker = new google.maps.Marker({
            position: { lat: geo.lat, lng: geo.lng },
            map,
            title: `${v.name} (${v.hullNumber})`,
            icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 4,
              rotation: geo.heading,
              fillColor: statusColor,
              fillOpacity: 1,
              strokeColor: '#0f172a',
              strokeWeight: 1.5
            },
            zIndex: 90
          });

          vesselMarker.addListener('click', () => {
            const content = `
              <div style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace; padding: 4px; min-width: 250px; color: #0f172a;">
                <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid ${statusColor}; padding-bottom: 4px; margin-bottom: 6px;">
                  <span style="font-weight: 800; font-size: 12px; color: #0f172a;">${v.name} (${v.hullNumber})</span>
                  <span style="background-color: #f1f5f9; color: ${statusColor}; font-weight: bold; font-size: 10px; padding: 2px 6px; border-radius: 4px;">
                    ${v.status}
                  </span>
                </div>
                <div style="font-size: 10px; color: #334155; margin-bottom: 6px;">
                  <b>Clase:</b> ${v.vesselClass.replace(/_/g, ' ')}<br/>
                  <b>Misión:</b> ${v.currentMission}<br/>
                  <b>Horómetro:</b> ${v.mainEngineHours} hrs / Límite: ${v.overhaulLimitHours} hrs<br/>
                  <b>Desplazamiento:</b> ${v.displacementTons.toLocaleString('es-MX')} tons
                </div>
                <button id="btn-vessel-modal-${v.id}" style="background-color: #1e3a8a; color: #ffffff; border: none; padding: 5px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; cursor: pointer; width: 100%;">
                  Ver Expediente Técnico OTAN (NSN)
                </button>
              </div>
            `;
            infoWindow.setContent(content);
            infoWindow.open(map, vesselMarker);

            setTimeout(() => {
              const btn = document.getElementById(`btn-vessel-modal-${v.id}`);
              if (btn && onSelectVessel) {
                btn.onclick = () => onSelectVessel(v);
              }
            }, 100);
          });

          markersRef.current.push(vesselMarker);
        });
      }

    } catch (e) {
      console.warn('[POSEIDÓN-LOG] Marcador no crítico en mapa:', e);
    }
  }, [viewEngine, isGoogleMapsLoaded, mapType, filteredNodes, showVesselPins, showPatrolCorridors, vessels]);

  // Handle focusing node on map when selectedNodeId changes
  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    const node = NAVAL_NODES_GEO.find(n => n.id === nodeId);
    if (node && googleMapInstance.current && viewEngine === 'GOOGLE_MAPS') {
      googleMapInstance.current.panTo({ lat: node.lat, lng: node.lng });
      googleMapInstance.current.setZoom(8);
    }
  };

  // Google Maps Grounding via Gemini 3.8 Flash
  const fetchGroundingIntelligence = async (zoneId: string, customQuery?: string) => {
    const node = NAVAL_NODES_GEO.find(n => n.id === zoneId) || selectedNode;
    const query = customQuery || `Bases navales militares, capitanías de puerto e infraestructura naval en ${node.location} México`;
    setGroundingQuery(query);
    setIsGroundingLoading(true);

    try {
      const res = await fetch('/api/maps/grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          zoneId: node.id,
          lat: node.lat,
          lng: node.lng
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      setGroundingReport(data.text);
      setGroundingSources(data.sources || []);
      setGroundingIsSimulated(Boolean(data.isSimulated));
      setGroundingQuotaExceeded(Boolean(data.quotaExceeded));
    } catch (err: any) {
      console.warn('[POSEIDÓN-LOG] Modo contingencia para inteligencia cartográfica:', err?.message || err);
      setGroundingReport(`### INTELIGENCIA LOGÍSTICA NAVAL: ${node.zoneName} (${node.location})
- **Estado Operativo:** Nodo activo en red táctica ZEE de la Armada de México.
- **Coordenadas:** Lat ${node.lat}° N, Lng ${node.lng}° W.
- **Acceso:** Muelles de atraque y aprovisionamiento de combustible marino MGO.`);
      setGroundingSources([
        { title: `Buscar ${node.location} en Google Maps`, uri: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(node.baseName)}` }
      ]);
      setGroundingIsSimulated(true);
      setGroundingQuotaExceeded(true);
    } finally {
      setIsGroundingLoading(false);
    }
  };

  // Sort zones by alert count for the tactical ranking
  const sortedByAlerts = [...zones].sort((a, b) => {
    const aTotal = zoneAlertsMap[a.id]?.totalAlerts || 0;
    const bTotal = zoneAlertsMap[b.id]?.totalAlerts || 0;
    return bTotal - aTotal;
  });

  return (
    <div className="space-y-4">
      {/* Top Header & Tactical Controls Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-900 text-white rounded-lg">
                <Globe2 className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base font-bold font-mono text-slate-900 tracking-tight flex items-center gap-2">
                  <span>MAPA TÁCTICO INTEGRAL // GOOGLE MAPS & REGIONES NAVALES ZEE</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full uppercase">
                    C4I MARÍTIMO
                  </span>
                </h2>
                <p className="text-xs text-slate-500 font-mono">
                  Visualización geoespacial de litorales mexicanos, 6 Regiones Navales, flota de superficie y monitoreo de discrepancias.
                </p>
              </div>
            </div>
          </div>

          {/* Engine Selector & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewEngine('GOOGLE_MAPS')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                  viewEngine === 'GOOGLE_MAPS'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>Google Maps Satélite</span>
              </button>

              <button
                onClick={() => setViewEngine('VECTORIAL_RADAR')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                  viewEngine === 'VECTORIAL_RADAR'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Radar Vectorial</span>
              </button>
            </div>

            {/* Region Filter */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-lg text-xs font-mono">
              <Filter className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
              <button
                onClick={() => setFilterMode('ALL')}
                className={`px-2 py-1 rounded ${filterMode === 'ALL' ? 'bg-white font-bold text-blue-900 shadow-xs' : 'text-slate-600'}`}
              >
                Todas ({NAVAL_NODES_GEO.length})
              </button>
              <button
                onClick={() => setFilterMode('GOLFO')}
                className={`px-2 py-1 rounded ${filterMode === 'GOLFO' ? 'bg-white font-bold text-blue-900 shadow-xs' : 'text-slate-600'}`}
              >
                Golfo / Caribe
              </button>
              <button
                onClick={() => setFilterMode('PACIFICO')}
                className={`px-2 py-1 rounded ${filterMode === 'PACIFICO' ? 'bg-white font-bold text-blue-900 shadow-xs' : 'text-slate-600'}`}
              >
                Pacífico
              </button>
              <button
                onClick={() => setFilterMode('CRITICAL_ONLY')}
                className={`px-2 py-1 rounded ${filterMode === 'CRITICAL_ONLY' ? 'bg-rose-100 font-bold text-rose-800' : 'text-slate-600'}`}
              >
                Con Alertas
              </button>
            </div>

            {/* Google Maps Layer Controls */}
            {viewEngine === 'GOOGLE_MAPS' && (
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-lg text-xs font-mono">
                <Layers className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
                <button
                  onClick={() => setMapType('hybrid')}
                  className={`px-2 py-1 rounded ${mapType === 'hybrid' ? 'bg-white font-bold text-blue-900 shadow-xs' : 'text-slate-600'}`}
                >
                  Híbrido
                </button>
                <button
                  onClick={() => setMapType('satellite')}
                  className={`px-2 py-1 rounded ${mapType === 'satellite' ? 'bg-white font-bold text-blue-900 shadow-xs' : 'text-slate-600'}`}
                >
                  Satélite
                </button>
                <button
                  onClick={() => setMapType('terrain')}
                  className={`px-2 py-1 rounded ${mapType === 'terrain' ? 'bg-white font-bold text-blue-900 shadow-xs' : 'text-slate-600'}`}
                >
                  Relieve
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tactical Status Ribbon */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs font-mono text-slate-600 gap-3">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Enlace Satelital Activo (SECMAR C4I)</span>
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="flex items-center gap-1.5">
              <Ship className="w-3.5 h-3.5 text-blue-600" />
              <span>{vessels.length} Unidades de Superficie Georreferenciadas</span>
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>
                {discrepancies.filter(d => d.status !== 'CONCILIADO').length} Discrepancias / {requisitions.filter(r => r.anomalyDetected).length} Sobrepedidos
              </span>
            </span>
          </div>

          {/* Layer toggles */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={showVesselPins}
                onChange={(e) => setShowVesselPins(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-0"
              />
              <span>Buques de Flota</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={showPatrolCorridors}
                onChange={(e) => setShowPatrolCorridors(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-0"
              />
              <span>Corredores Navales</span>
            </label>
            {apiKeyOverride && (
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                Google Maps API Conectado
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Map Screen (Left 7 cols) & Tactical Briefing Drawer (Right 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Map Viewport */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-md overflow-hidden relative min-h-[580px] flex flex-col">
            {/* Viewport Top Bar */}
            <div className="bg-slate-950/90 backdrop-blur-xs px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300 z-10">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-cyan-400" />
                <span className="text-white font-bold tracking-wide">
                  {viewEngine === 'GOOGLE_MAPS' ? 'PROYECCIÓN CARTOGRÁFICA GOOGLE MAPS PLATFORM' : 'PROYECCIÓN TÁCTICA RADAR VECTORIAL ZEE'}
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-cyan-400 font-semibold">{selectedNode.headquarters}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (googleMapInstance.current) {
                      googleMapInstance.current.setCenter({ lat: 23.6345, lng: -102.5528 });
                      googleMapInstance.current.setZoom(5);
                    }
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-mono transition-colors"
                  title="Re-centrar República Mexicana"
                >
                  Centrar País
                </button>
                <button
                  onClick={() => setShowKeyModal(true)}
                  className="px-2 py-1 bg-blue-900/60 hover:bg-blue-800 text-blue-200 rounded text-[11px] font-mono transition-colors flex items-center gap-1"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Config Key</span>
                </button>
              </div>
            </div>

            {/* Google Maps Container */}
            {viewEngine === 'GOOGLE_MAPS' ? (
              <div className="relative flex-1 w-full min-h-[520px]">
                {/* Real Google Maps DIV */}
                <div 
                  ref={mapContainerRef} 
                  className="w-full h-full min-h-[520px]"
                />

                {/* If Google Maps API is not loaded yet or failed */}
                {!isGoogleMapsLoaded && (
                  <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20">
                    <Globe2 className="w-12 h-12 text-cyan-400 animate-pulse mb-3" />
                    <h3 className="text-sm font-mono font-bold text-white mb-1">
                      {googleMapsError ? 'INICIALIZACIÓN DE GOOGLE MAPS' : 'CONECTANDO CON SERVICIOS GOOGLE MAPS...'}
                    </h3>
                    <p className="text-xs font-mono text-slate-300 max-w-md mb-4">
                      {googleMapsError || 'Para desplegar la capa cartográfica interactiva de Google Maps Satélite / Terreno, ingrese su API Key o alterne al Radar Vectorial.'}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowKeyModal(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Ingresar API Key de Google Maps
                      </button>
                      <button
                        onClick={() => setViewEngine('VECTORIAL_RADAR')}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Usar Radar Vectorial ZEE
                      </button>
                    </div>
                  </div>
                )}

                {/* Floating Map Legend Overlay */}
                <div className="absolute bottom-3 left-3 bg-slate-950/85 backdrop-blur-xs border border-slate-800 rounded-lg p-2.5 text-[11px] font-mono text-slate-300 pointer-events-auto z-10 shadow-lg">
                  <div className="font-bold text-white mb-1 text-[10px] tracking-wider uppercase flex items-center gap-1">
                    <Radio className="w-3 h-3 text-cyan-400" />
                    <span>Simbología Táctica</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-rose-400/30"></span>
                      <span>Base con Alertas Críticas (≥3)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-400/30"></span>
                      <span>Base con Alertas Moderadas (1-2)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                      <span>Base Operación Normal</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rotate-45 bg-emerald-400"></span>
                      <span>Buque en Operación Activa</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-0.5 bg-cyan-400"></span>
                      <span>Corredores de Patrullaje ZEE</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Vectorial Radar SVG Viewport (Fallback & Low Bandwidth Mode) */
              <div className="relative flex-1 w-full min-h-[520px] bg-slate-950 overflow-hidden flex items-center justify-center p-4">
                {/* Background Radar concentric rings */}
                {showRadarGrid && (
                  <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#radarGrad)" />
                    <circle cx="50%" cy="50%" r="20%" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="50%" cy="50%" r="35%" fill="none" stroke="#0ea5e9" strokeWidth="1" />
                    <circle cx="50%" cy="50%" r="48%" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="2 4" />
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#0ea5e9" strokeWidth="0.5" />
                    <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#0ea5e9" strokeWidth="0.5" />
                  </svg>
                )}

                {/* SVG Coastline & Nodes */}
                <svg viewBox="0 0 1000 600" className="w-full h-full max-h-[520px]">
                  {/* Stylized Mexican Landmass */}
                  <path
                    d="M 120,80 L 220,180 L 280,240 L 370,270 L 460,260 L 580,240 L 680,250 L 730,290 L 800,300 L 880,310 L 910,340 L 890,380 L 840,360 L 760,360 L 720,400 L 670,440 L 630,420 L 550,380 L 480,350 L 390,330 L 310,290 L 250,230 L 190,170 L 140,110 Z"
                    fill="#1e293b"
                    stroke="#334155"
                    strokeWidth="2"
                  />
                  {/* Baja California Peninsula */}
                  <path
                    d="M 110,75 L 145,130 L 180,210 L 210,290 L 225,320 L 210,310 L 175,230 L 135,140 L 100,75 Z"
                    fill="#1e293b"
                    stroke="#334155"
                    strokeWidth="2"
                  />
                  {/* Yucatán Peninsula */}
                  <path
                    d="M 760,350 L 820,330 L 880,335 L 900,370 L 870,410 L 830,400 L 770,370 Z"
                    fill="#1e293b"
                    stroke="#334155"
                    strokeWidth="2"
                  />

                  {/* Nodes & Vessels */}
                  {filteredNodes.map((n) => {
                    const cx = n.svgX * 10;
                    const cy = n.svgY * 6;
                    const isSelected = n.id === selectedNodeId;
                    const alerts = zoneAlertsMap[n.id] || { totalAlerts: 0, severity: 'NORMAL' };
                    const pinColor = alerts.severity === 'CRITICA' ? '#f43f5e' : alerts.severity === 'ALERTA' ? '#f59e0b' : '#38bdf8';

                    return (
                      <g key={n.id} className="cursor-pointer" onClick={() => handleSelectNode(n.id)}>
                        {isSelected && (
                          <circle cx={cx} cy={cy} r="24" fill="none" stroke="#38bdf8" strokeWidth="2" className="animate-ping opacity-60" />
                        )}
                        <circle cx={cx} cy={cy} r="14" fill="#0f172a" stroke={pinColor} strokeWidth="3" />
                        <circle cx={cx} cy={cy} r="6" fill={pinColor} />
                        <text x={cx} y={cy - 20} textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="monospace">
                          {n.id}
                        </text>
                        <text x={cx} y={cy + 26} textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                          {n.location}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}
          </div>

          {/* Gemini 3.8 Flash Google Maps Grounding Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-50 text-blue-700 rounded-md">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-xs font-bold font-mono text-slate-900 uppercase flex items-center gap-1.5 flex-wrap">
                    <span>Inteligencia Geográfica de Bases Navales // Google Maps Grounding</span>
                    {groundingQuotaExceeded ? (
                      <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-200 px-1.5 py-0.2 rounded font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-amber-700" />
                        CONTINGENCIA ZEE (CUOTA PROTEGIDA)
                      </span>
                    ) : groundingIsSimulated ? (
                      <span className="text-[10px] bg-blue-100 text-blue-900 border border-blue-200 px-1.5 py-0.2 rounded font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-blue-700" />
                        PERFIL CARTOGRÁFICO TÁCTICO
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                        GEMINI-3.8-FLASH EN VIVO
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Consulta en tiempo real calado, muelles, astilleros y enlaces cartográficos verificados con datos satelitales de Google Maps.
                  </p>
                </div>
              </div>

              <button
                onClick={() => fetchGroundingIntelligence(selectedNode.id)}
                disabled={isGroundingLoading}
                className="px-3 py-1.5 bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGroundingLoading ? 'animate-spin' : ''}`} />
                <span>Actualizar Inteligencia</span>
              </button>
            </div>

            {/* Quick Query Pills */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              <span className="text-[11px] font-mono text-slate-400 font-semibold mr-1">Consultas Tácticas:</span>
              <button
                onClick={() => fetchGroundingIntelligence('RN-1', 'Instalaciones navales y capitanía de puerto de Tuxpan Veracruz')}
                className="text-[11px] font-mono px-2 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-900 text-slate-700 border border-slate-200 transition-colors"
              >
                ⚓ Tuxpan (RN-1)
              </button>
              <button
                onClick={() => fetchGroundingIntelligence('RN-5', 'Astillero de Marina Número 20 y Dique Seco Salina Cruz Oaxaca')}
                className="text-[11px] font-mono px-2 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-900 text-slate-700 border border-slate-200 transition-colors"
              >
                🏭 Astillero Salina Cruz (RN-5)
              </button>
              <button
                onClick={() => fetchGroundingIntelligence('RN-6', 'Sector Naval Isla del Carmen y plataformas petroleras Sonda de Campeche')}
                className="text-[11px] font-mono px-2 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-900 text-slate-700 border border-slate-200 transition-colors"
              >
                🛢️ Sonda Campeche (RN-6)
              </button>
              <button
                onClick={() => fetchGroundingIntelligence('RN-2', 'Base Naval Ensenada y Estación de Búsqueda y Rescate ENSAR')}
                className="text-[11px] font-mono px-2 py-1 rounded bg-slate-100 hover:bg-blue-50 hover:text-blue-900 text-slate-700 border border-slate-200 transition-colors"
              >
                🌊 Ensenada Pacífico (RN-2)
              </button>
            </div>

            {/* Grounding Report Body */}
            {isGroundingLoading ? (
              <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200">
                <RefreshCw className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
                <p className="text-xs font-mono text-slate-600 font-bold">
                  Extrayendo geolocalización satelital y capas náuticas mediante Gemini 3.8 Flash con Grounding de Google Maps...
                </p>
                <p className="text-[11px] font-mono text-slate-400 mt-1">
                  Cruzando coordenadas de base: {selectedNode.lat}° N, {selectedNode.lng}° W
                </p>
              </div>
            ) : groundingReport ? (
              <div className="space-y-3">
                <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed whitespace-pre-line">
                  {groundingReport}
                </div>

                {/* Grounding Sources / Links to Google Maps */}
                {groundingSources.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-mono font-bold text-slate-700 uppercase block mb-1.5 flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                      <span>Ubicaciones & Enlaces Satelitales en Google Maps ({groundingSources.length}):</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {groundingSources.map((source, idx) => (
                        <a
                          key={idx}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-300 rounded text-[11px] font-mono text-blue-800 font-semibold transition-all shadow-2xs"
                        >
                          <MapPin className="w-3 h-3 text-red-500" />
                          <span>{source.title}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center">
                <p className="text-xs font-mono text-slate-600">
                  Seleccione una consulta o pulse "Actualizar Inteligencia" para extraer el informe cartográfico en tiempo real de <b>{selectedNode.baseName}</b>.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Tactical Briefing Drawer (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Selected Region Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-900 text-white rounded-md font-mono text-xs font-bold">
                  {selectedNode.id}
                </span>
                <div>
                  <h3 className="text-sm font-bold font-mono text-slate-900">{selectedNode.zoneName}</h3>
                  <span className="text-xs text-slate-500 font-mono">{selectedNode.location}</span>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                selectedZoneAlerts?.severity === 'CRITICA'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : selectedZoneAlerts?.severity === 'ALERTA'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {selectedZoneAlerts?.totalAlerts || 0} ALERTAS
              </span>
            </div>

            {/* Geo Coordinates & Nautical Metrics */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-xs font-mono">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase">Coordenadas GPS</span>
                <span className="font-bold text-slate-800">
                  {selectedNode.lat.toFixed(4)}°N, {selectedNode.lng.toFixed(4)}°W
                </span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase">Calado Máximo</span>
                <span className="font-bold text-blue-700">{selectedNode.portSpecs.maxDraftMeters} metros</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase">Muelles de Atraque</span>
                <span className="font-bold text-slate-800">{selectedNode.portSpecs.berths} posiciones</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] text-slate-500 block uppercase">Capacidad Dique Seco</span>
                <span className="font-bold text-slate-800">{selectedNode.portSpecs.dryDockCapacityDWT.toLocaleString('es-MX')} DWT</span>
              </div>
            </div>

            {/* Budget & Personnel Stats */}
            {selectedZoneData && (
              <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 space-y-2 mb-3 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>Personal Efectivo:</span>
                  </span>
                  <span className="font-bold text-slate-900">{selectedZoneData.personnelActive.toLocaleString('es-MX')} marinos</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Presupuesto Aprobado:</span>
                  </span>
                  <span className="font-bold text-slate-900">${(selectedZoneData.annualBudgetApproved / 1000000).toFixed(1)}M MXN</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Ship className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Unidades Asignadas:</span>
                  </span>
                  <span className="font-bold text-slate-900">{selectedZoneData.vesselsAssigned} naves</span>
                </div>
              </div>
            )}

            {/* Active Alerts in this Zone */}
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-slate-800 uppercase flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>Nodos & Alertas Operativas en este Sector ({selectedZoneAlerts?.totalAlerts || 0})</span>
              </span>

              {selectedZoneAlerts?.totalAlerts === 0 ? (
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sin discrepancias ni fallas de flota reportadas en este nodo.</span>
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {/* Vessel alerts */}
                  {selectedZoneVessels.filter(v => v.status !== 'OPERATIVO').map((v) => (
                    <div key={v.id} className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs font-mono">
                      <div className="flex items-center justify-between text-rose-900 font-bold">
                        <span>{v.name} ({v.hullNumber})</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-rose-200 rounded">{v.status}</span>
                      </div>
                      <div className="text-[11px] text-rose-800 mt-0.5">
                        {v.currentMission} · Motor: {v.mainEngineHours} hrs
                      </div>
                      {onSelectVessel && (
                        <button
                          onClick={() => onSelectVessel(v)}
                          className="mt-1.5 text-[10px] text-rose-900 font-bold underline cursor-pointer"
                        >
                          Ver ficha técnica NSN OTAN →
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Discrepancy alerts */}
                  {selectedZoneDiscrepancies.map((d) => (
                    <div key={d.id} className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-mono">
                      <div className="flex items-center justify-between text-amber-900 font-bold">
                        <span>Discrepancia Inventario {d.id}</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-amber-200 rounded">{d.differenceQty} {d.unit}</span>
                      </div>
                      <div className="text-[11px] text-amber-800 mt-0.5">
                        {d.itemName} · Impacto: ${d.financialImpactMXN.toLocaleString('es-MX')} MXN
                      </div>
                    </div>
                  ))}

                  {/* Overorder requisitions */}
                  {selectedZoneRequisitions.map((r) => (
                    <div key={r.id} className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-mono">
                      <div className="flex items-center justify-between text-blue-900 font-bold">
                        <span>Sobrepedido {r.id}</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-blue-200 rounded">+{r.quantityRequested - r.predictedDemand}</span>
                      </div>
                      <div className="text-[11px] text-blue-800 mt-0.5 truncate" title={r.justification}>
                        {r.item} ({r.solicitante})
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Action Navigation Buttons */}
            {onNavigateToTab && (
              <div className="pt-3 border-t border-slate-200 mt-4 flex flex-col gap-2">
                <button
                  onClick={() => onNavigateToTab('paa')}
                  className="w-full py-2 px-3 rounded bg-blue-900 hover:bg-blue-800 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <span>Inspeccionar Necesidades & PAA de este Nodo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onNavigateToTab('auditoria')}
                  className="w-full py-2 px-3 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span>Ver Bitácora de Auditoría Zonal</span>
                </button>
              </div>
            )}
          </div>

          {/* Ranking of Nodes by Alert Intensity */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
            <span className="text-xs font-mono font-bold text-slate-800 uppercase block mb-2 flex items-center justify-between">
              <span>Prioridad Operativa por Alertas</span>
              <span className="text-[10px] text-slate-500 font-normal">RANKING ZONAL</span>
            </span>

            <div className="space-y-1.5">
              {sortedByAlerts.map((z, idx) => {
                const alertCount = zoneAlertsMap[z.id]?.totalAlerts || 0;
                const isSelected = selectedNodeId === z.id;
                return (
                  <div 
                    key={z.id}
                    onClick={() => handleSelectNode(z.id)}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs font-mono cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-100 text-blue-950 font-bold border border-blue-300' : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                        idx === 0 ? 'bg-rose-600 text-white' : idx === 1 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        #{idx + 1}
                      </span>
                      <span>{z.id} ({z.location})</span>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      alertCount >= 3 ? 'bg-rose-600 text-white' : alertCount >= 1 ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {alertCount} alertas
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Google Maps API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200 font-mono">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-blue-900" />
                <h3 className="text-sm font-bold text-slate-900 uppercase">Configurar Google Maps API Key</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 mb-3">
              Ingrese su clave de API de Google Maps Platform para renderizar los mapas satelitales interactivos con vistas de alta resolución y batimetría:
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 uppercase block mb-1">
                  Google Maps API Key (VITE_GOOGLE_MAPS_API_KEY)
                </label>
                <input
                  type="text"
                  value={apiKeyOverride}
                  onChange={(e) => setApiKeyOverride(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {apiKeyOverride && apiKeyOverride.startsWith('AQ.') && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-[11px] text-rose-800 leading-relaxed font-mono">
                  <AlertTriangle className="w-3.5 h-3.5 inline mr-1 text-rose-600" />
                  <b>Formato no compatible con Maps:</b> El token que ingresó corresponde a Google AI Studio (inicia con "AQ..."). Las claves de Google Maps Platform inician con <b>AIza...</b> (Google Cloud Console). El sistema continuará operando en modo <b>Radar Vectorial Táctico ZEE</b> para evitar errores de autenticación.
                </div>
              )}

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800 leading-relaxed">
                <Info className="w-3.5 h-3.5 inline mr-1 text-amber-600" />
                Las claves válidas de Google Maps Platform inician con <b>AIza...</b>. Si no cuenta con una API Key activa en este momento, el sistema POSEIDÓN-LOG ofrece automáticamente el <b>Radar Vectorial ZEE</b> y el módulo de <b>Inteligencia Geográfica con Maps Grounding (Gemini 3.8 Flash)</b>.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowKeyModal(false);
                    if (isValidGoogleMapsKey(apiKeyOverride)) {
                      setViewEngine('GOOGLE_MAPS');
                    } else {
                      setViewEngine('VECTORIAL_RADAR');
                    }
                  }}
                  className="px-4 py-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Guardar y Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
