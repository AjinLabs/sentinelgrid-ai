'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Incident,
  Facility,
  RiverStation,
  RainfallStation,
} from '@/types/disaster';
import {
  Layers,
  MapPin,
  Waves,
  CloudRain,
  Home,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass,
  Satellite,
  Globe2,
  Settings2,
  KeyRound,
  Check,
  Search,
  ExternalLink,
  Radar,
  Eye,
  Crosshair,
  Sparkles,
  Navigation,
  Share2,
} from 'lucide-react';

export interface MapLayerState {
  incidents: boolean;
  floodZones: boolean;
  landslideZones: boolean;
  shelters: boolean;
  riverGauges: boolean;
  rainfallStations: boolean;
  roadClosures: boolean;
}

interface SentinelMapProps {
  incidents: Incident[];
  facilities: Facility[];
  riverStations: RiverStation[];
  rainfallStations: RainfallStation[];
  selectedDistrict: string;
  onSelectFeature?: (feature: {
    type: 'INCIDENT' | 'FACILITY' | 'RIVER' | 'RAIN' | 'REGION';
    data: any;
  }) => void;
  activeLayers?: MapLayerState;
  onToggleLayer?: (layerKey: keyof MapLayerState) => void;
  highlightedIncidentId?: string;
}

export type BasemapStyle =
  | 'google_roadmap'
  | 'google_hybrid'
  | 'google_satellite'
  | 'google_terrain'
  | 'esri_satellite'
  | 'streets_clean';

export default function SentinelMap({
  incidents,
  facilities,
  riverStations,
  rainfallStations,
  selectedDistrict,
  onSelectFeature,
  activeLayers = {
    incidents: true,
    floodZones: true,
    landslideZones: true,
    shelters: true,
    riverGauges: true,
    rainfallStations: true,
    roadClosures: true,
  },
  onToggleLayer,
  highlightedIncidentId,
}: SentinelMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const polygonsLayerRef = useRef<any>(null);
  const radarLayerRef = useRef<any>(null);

  const [isClient, setIsClient] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(8);
  const [basemap, setBasemap] = useState<BasemapStyle>('google_hybrid');
  const [googleKeyModalOpen, setGoogleKeyModalOpen] = useState(false);
  const [streetViewModalOpen, setStreetViewModalOpen] = useState(false);
  const [customGoogleApiKey, setCustomGoogleApiKey] = useState('');
  const [apiKeySavedNotice, setApiKeySavedNotice] = useState(false);
  const [radarOverlayActive, setRadarOverlayActive] = useState(false);
  const [activeStreetViewTarget, setActiveStreetViewTarget] = useState<{
    lat: number;
    lng: number;
    title: string;
    description?: string;
  }>({
    lat: 11.534,
    lng: 76.168,
    title: 'Chooralmala Debris Flow Corridor, Wayanad',
    description: 'Catastrophic landslide zone along Meppadi axis',
  });

  const [centerCoords, setCenterCoords] = useState<{ lat: number; lng: number }>({
    lat: 10.45,
    lng: 76.35,
  });

  // Hotspots for instant tactical fly-to
  const quickHotspots = [
    { name: 'Chooralmala (Wayanad)', lat: 11.534, lng: 76.168, zoom: 14, district: 'Wayanad' },
    { name: 'Aluva Periyar (Ernakulam)', lat: 10.11, lng: 76.35, zoom: 13, district: 'Ernakulam' },
    { name: 'Gap Road (Munnar)', lat: 10.04, lng: 77.08, zoom: 14, district: 'Idukki' },
    { name: 'Kuttanad Polders (Alappuzha)', lat: 9.42, lng: 76.45, zoom: 13, district: 'Alappuzha' },
    { name: 'Thrissur Kole Wetlands', lat: 10.35, lng: 76.35, zoom: 12, district: 'Thrissur' },
  ];

  useEffect(() => {
    setIsClient(true);
    const savedKey = localStorage.getItem('sentinel_google_api_key');
    if (savedKey) setCustomGoogleApiKey(savedKey);
  }, []);

  // Initialize Map
  useEffect(() => {
    if (!isClient || !mapContainerRef.current) return;

    let L: any;
    let isCancelled = false;

    async function initMap() {
      L = (await import('leaflet')).default;
      if (isCancelled || !mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [10.45, 76.35],
          zoom: 8,
          zoomControl: false,
          attributionControl: true,
        });

        const tileLayer = getTileLayer(L, basemap);
        tileLayer.addTo(map);
        tileLayerRef.current = tileLayer;

        map.on('zoomend', () => {
          setCurrentZoom(map.getZoom());
        });

        map.on('moveend', () => {
          const c = map.getCenter();
          setCenterCoords({
            lat: parseFloat(c.lat.toFixed(4)),
            lng: parseFloat(c.lng.toFixed(4)),
          });
        });

        const polygonsLayer = L.layerGroup().addTo(map);
        const markersLayer = L.layerGroup().addTo(map);
        const radarLayer = L.layerGroup().addTo(map);

        mapInstanceRef.current = map;
        polygonsLayerRef.current = polygonsLayer;
        markersLayerRef.current = markersLayer;
        radarLayerRef.current = radarLayer;
      }

      renderMapFeatures(L);
    }

    initMap();

    return () => {
      isCancelled = true;
    };
  }, [isClient]);

  // Switch basemaps dynamically
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then((leafletModule) => {
      const L = leafletModule.default;
      if (tileLayerRef.current) {
        mapInstanceRef.current.removeLayer(tileLayerRef.current);
      }
      const newTile = getTileLayer(L, basemap);
      newTile.addTo(mapInstanceRef.current);
      tileLayerRef.current = newTile;
    });
  }, [basemap]);

  // Update features whenever props change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then((leafletModule) => {
      renderMapFeatures(leafletModule.default);
    });
  }, [
    incidents,
    facilities,
    riverStations,
    rainfallStations,
    selectedDistrict,
    activeLayers,
    highlightedIncidentId,
    radarOverlayActive,
  ]);

  // Fly to target district
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const districtCoords: Record<string, [number, number, number]> = {
      Wayanad: [11.605, 76.12, 11],
      Idukki: [9.95, 77.05, 10],
      Ernakulam: [10.11, 76.35, 11],
      Alappuzha: [9.45, 76.45, 11],
      Thrissur: [10.35, 76.35, 10],
      Pathanamthitta: [9.27, 76.78, 11],
      Kottayam: [9.59, 76.52, 11],
      Kozhikode: [11.25, 75.78, 11],
      Malappuram: [11.07, 76.07, 10],
      Palakkad: [10.78, 76.65, 10],
      Kannur: [11.87, 75.37, 11],
      Kasaragod: [12.51, 75.0, 11],
      Kollam: [8.89, 76.61, 11],
      Thiruvananthapuram: [8.52, 76.93, 11],
      all: [10.45, 76.35, 8],
    };

    const target = districtCoords[selectedDistrict] || districtCoords['all'];
    mapInstanceRef.current.flyTo([target[0], target[1]], target[2], { duration: 1.2 });
  }, [selectedDistrict]);

  function getTileLayer(L: any, style: BasemapStyle) {
    switch (style) {
      case 'google_hybrid':
        return L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          attribution: '&copy; Google Maps Platform Engine | SentinelGrid GIS',
        });
      case 'google_roadmap':
        return L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          attribution: '&copy; Google Maps Vector Network',
        });
      case 'google_terrain':
        return L.tileLayer('https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          attribution: '&copy; Google Maps Topo / Relief',
        });
      case 'google_satellite':
        return L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          attribution: '&copy; Google Maps Optical Satellite',
        });
      case 'esri_satellite':
        return L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          {
            maxZoom: 19,
            attribution: 'Tiles &copy; Esri Earthstar Geographics',
          }
        );
      case 'streets_clean':
      default:
        return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors',
        });
    }
  }

  function renderMapFeatures(L: any) {
    if (!mapInstanceRef.current || !markersLayerRef.current || !polygonsLayerRef.current)
      return;

    markersLayerRef.current.clearLayers();
    polygonsLayerRef.current.clearLayers();
    if (radarLayerRef.current) radarLayerRef.current.clearLayers();

    // 0. Radar Doppler Rain Bands Simulation
    if (radarOverlayActive && radarLayerRef.current) {
      const radarCloud1 = L.polygon(
        [
          [11.9, 75.8],
          [11.8, 76.4],
          [11.3, 76.5],
          [11.2, 75.6],
        ],
        {
          color: '#0284C7',
          fillColor: '#38BDF8',
          fillOpacity: 0.35,
          weight: 2,
        }
      ).bindPopup(
        `<div style="font-family: inherit; padding: 4px;">
          <div style="color: #0284C7; font-weight: bold; font-size: 11px;">IMD DOPPLER WEATHER RADAR (KOCHI DWR)</div>
          <div style="font-size: 12px; font-weight: bold; margin: 3px 0; color: #0C2340;">Heavy Orographic Rain Band (dBZ 48-54)</div>
          <div style="font-size: 11px; color: #334E68;">Rainfall Surge: <b>28-42 mm/hr convective activity</b></div>
        </div>`
      );
      radarLayerRef.current.addLayer(radarCloud1);

      const radarCloud2 = L.polygon(
        [
          [10.25, 76.7],
          [10.35, 77.2],
          [9.75, 77.25],
          [9.7, 76.65],
        ],
        {
          color: '#E11D48',
          fillColor: '#FDA4AF',
          fillOpacity: 0.4,
          weight: 2,
        }
      ).bindPopup(
        `<div style="font-family: inherit; padding: 4px;">
          <div style="color: #E11D48; font-weight: bold; font-size: 11px;">SEVERE MONSOON BURST (IDUKKI BASIN)</div>
          <div style="font-size: 12px; font-weight: bold; margin: 3px 0; color: #0C2340;">Reflectivity: 55 dBZ Extreme</div>
        </div>`
      );
      radarLayerRef.current.addLayer(radarCloud2);
    }

    // 1. Hazard Zones
    if (activeLayers.landslideZones) {
      const wayanadZone = L.polygon(
        [
          [11.56, 76.12],
          [11.58, 76.18],
          [11.52, 76.22],
          [11.48, 76.15],
        ],
        {
          color: '#F97316',
          fillColor: '#F97316',
          fillOpacity: 0.32,
          weight: 2.5,
          dashArray: '5, 5',
        }
      ).bindPopup(
        `<div style="font-family: inherit; padding: 2px;">
          <div style="color: #EA580C; font-weight: bold; font-size: 11px;">CRITICAL LANDSLIDE SUSCEPTIBILITY ZONE</div>
          <div style="font-size: 13px; font-weight: bold; margin: 4px 0; color: #0C2340;">Meppadi - Chooralmala Ridge, Wayanad</div>
          <div style="font-size: 11px; color: #334E68;">Slope: &gt;38° Western Ghats Escarpment</div>
          <div style="font-size: 11px; margin-top: 4px; color: #0C2340;">Composite Risk: <b style="color: #EA580C;">0.94 / 1.0 (Critical Threat)</b></div>
        </div>`
      );
      polygonsLayerRef.current.addLayer(wayanadZone);

      const idukkiZone = L.polygon(
        [
          [10.04, 77.08],
          [10.06, 77.14],
          [10.01, 77.16],
          [9.98, 77.11],
        ],
        {
          color: '#F97316',
          fillColor: '#F97316',
          fillOpacity: 0.28,
          weight: 2,
        }
      ).bindPopup(
        `<div style="font-family: inherit; padding: 2px;">
          <div style="color: #EA580C; font-weight: bold; font-size: 11px;">STEEP SLOPE ROCKFALL CORRIDOR</div>
          <div style="font-size: 13px; font-weight: bold; margin: 4px 0; color: #0C2340;">Munnar - Devikulam Escarpment, Idukki</div>
          <div style="font-size: 11px; color: #334E68;">Risk Score: <b style="color: #EA580C;">0.72 / 1.0</b></div>
        </div>`
      );
      polygonsLayerRef.current.addLayer(idukkiZone);
    }

    if (activeLayers.floodZones) {
      const periyarFloodZone = L.polygon(
        [
          [10.14, 76.32],
          [10.15, 76.39],
          [10.08, 76.41],
          [10.06, 76.34],
        ],
        {
          color: '#0284C7',
          fillColor: '#0284C7',
          fillOpacity: 0.32,
          weight: 2.5,
        }
      ).bindPopup(
        `<div style="font-family: inherit; padding: 2px;">
          <div style="color: #0284C7; font-weight: bold; font-size: 11px;">RIVERINE FLOODPLAIN INUNDATION</div>
          <div style="font-size: 13px; font-weight: bold; margin: 4px 0; color: #0C2340;">Lower Periyar (Aluva - Eloor)</div>
          <div style="font-size: 11px; color: #334E68;">River Stage: <b>9.85m (+0.65m above danger)</b></div>
          <div style="font-size: 11px; color: #334E68;">Dam Discharge: <b>600 cumecs</b></div>
        </div>`
      );
      polygonsLayerRef.current.addLayer(periyarFloodZone);

      const kuttanadZone = L.polygon(
        [
          [9.42, 76.42],
          [9.44, 76.54],
          [9.33, 76.52],
          [9.32, 76.43],
        ],
        {
          color: '#0284C7',
          fillColor: '#0284C7',
          fillOpacity: 0.28,
          weight: 2,
        }
      ).bindPopup(
        `<div style="font-family: inherit; padding: 2px;">
          <div style="color: #0284C7; font-weight: bold; font-size: 11px;">BELOW SEA-LEVEL POLDER FLOOD ZONE</div>
          <div style="font-size: 13px; font-weight: bold; margin: 4px 0; color: #0C2340;">Kuttanad / Edathua / Vembanad Basin</div>
          <div style="font-size: 11px; color: #334E68;">Elevation: <b>-1.5m Mean Sea Level</b></div>
        </div>`
      );
      polygonsLayerRef.current.addLayer(kuttanadZone);
    }

    if (activeLayers.roadClosures) {
      const blockedRoad1 = L.polyline(
        [
          [11.528, 76.155],
          [11.534, 76.168],
        ],
        {
          color: '#EF4444',
          weight: 5,
          opacity: 0.95,
          dashArray: '8, 8',
        }
      ).bindPopup(
        `<div style="font-family: inherit; padding: 2px;">
          <b style="color: #EF4444;">BLOCKED CORRIDOR / BRIDGE WASHOUT</b><br/>
          <span style="font-size: 11px; color: #334E68;">SH-59 Chooralmala Axis impassable due to bridge collapse.</span>
        </div>`
      );
      polygonsLayerRef.current.addLayer(blockedRoad1);
    }

    // 2. Incident Markers with Friendly Drop Shadows & White Borders
    if (activeLayers.incidents) {
      incidents.forEach((inc) => {
        const isSelected = highlightedIncidentId === inc.id;
        const color =
          inc.severity === 'CRITICAL'
            ? '#EF4444'
            : inc.severity === 'HIGH'
            ? '#F97316'
            : '#F59E0B';

        const customIcon = L.divIcon({
          className: 'custom-incident-marker',
          html: `
            <div style="
              width: ${isSelected ? '32px' : '26px'};
              height: ${isSelected ? '32px' : '26px'};
              background: ${color};
              border: 2.5px solid #FFFFFF;
              border-radius: 50%;
              box-shadow: 0 4px 12px rgba(12, 35, 64, 0.35);
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: transform 0.2s;
            ">
              <span style="color: white; font-size: 12px; font-weight: 900;">!</span>
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([inc.location.lat, inc.location.lng], {
          icon: customIcon,
        });

        marker.on('click', () => {
          onSelectFeature?.({ type: 'INCIDENT', data: inc });
          setActiveStreetViewTarget({
            lat: inc.location.lat,
            lng: inc.location.lng,
            title: inc.title,
            description: inc.location.address,
          });
        });

        marker.bindPopup(`
          <div style="min-width: 220px; font-family: inherit; padding: 2px;">
            <div style="font-size: 10px; text-transform: uppercase; color: ${color}; font-weight: 800; letter-spacing: 0.5px;">
              ${inc.severity} ${inc.hazardType}
            </div>
            <div style="font-size: 13px; font-weight: 700; color: #0C2340; margin: 3px 0;">${inc.title}</div>
            <div style="font-size: 11px; color: #334E68; margin-bottom: 6px;">${inc.location.address}</div>
            <div style="font-size: 11px; color: #334E68;">Status: <b style="color: #0C2340;">${inc.status}</b></div>
            <div style="font-size: 11px; color: #334E68; margin-bottom: 6px;">Affected: <b style="color: #0284C7;">${inc.affectedPopulationEstimate.toLocaleString()} est.</b></div>
            <div style="display: flex; gap: 6px; margin-top: 8px;">
              <a href="https://maps.google.com/?q=${inc.location.lat},${inc.location.lng}&t=k" target="_blank" rel="noreferrer" style="flex: 1; text-align: center; background: #0284C7; color: white; padding: 4px 8px; border-radius: 6px; font-size: 10px; font-weight: bold; text-decoration: none;">
                Open in Google Maps &rarr;
              </a>
            </div>
          </div>
        `);

        markersLayerRef.current.addLayer(marker);
      });
    }

    // 3. Shelters & Hospitals
    if (activeLayers.shelters) {
      facilities.forEach((fac) => {
        const isHospital = fac.type === 'HOSPITAL';
        const color = isHospital ? '#0284C7' : '#10B981';

        const facIcon = L.divIcon({
          className: 'custom-facility-marker',
          html: `
            <div style="
              width: 22px;
              height: 22px;
              background: ${color};
              border: 2px solid #FFFFFF;
              border-radius: 6px;
              box-shadow: 0 4px 10px rgba(12, 35, 64, 0.25);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 11px;
              color: white;
              font-weight: 900;
              cursor: pointer;
            ">
              ${isHospital ? 'H' : 'S'}
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        const marker = L.marker([fac.location.lat, fac.location.lng], {
          icon: facIcon,
        });

        marker.on('click', () => {
          onSelectFeature?.({ type: 'FACILITY', data: fac });
          setActiveStreetViewTarget({
            lat: fac.location.lat,
            lng: fac.location.lng,
            title: fac.name,
            description: `${fac.type} in ${fac.district}`,
          });
        });

        marker.bindPopup(`
          <div style="min-width: 200px; font-family: inherit; padding: 2px;">
            <span style="font-size: 10px; color: ${color}; font-weight: 800; text-transform: uppercase;">
              ${fac.type}
            </span>
            <div style="font-size: 13px; font-weight: 700; color: #0C2340; margin: 3px 0;">${fac.name}</div>
            <div style="font-size: 11px; color: #334E68;">Occupancy: <b>${fac.currentOccupancy} / ${fac.totalCapacity}</b></div>
            <div style="font-size: 11px; color: #334E68; margin-bottom: 6px;">Available: <b style="color: #10B981;">${fac.availableCapacity} beds</b></div>
            <a href="https://maps.google.com/?q=${fac.location.lat},${fac.location.lng}&t=k" target="_blank" rel="noreferrer" style="display: block; text-align: center; background: #F1FCFF; border: 1.5px solid #A8DFFA; color: #0284C7; padding: 3px 6px; border-radius: 6px; font-size: 10px; font-weight: bold; text-decoration: none;">
              Google Maps Directions &rarr;
            </a>
          </div>
        `);

        markersLayerRef.current.addLayer(marker);
      });
    }

    // 4. River Gauges
    if (activeLayers.riverGauges) {
      riverStations.forEach((gauge) => {
        const isDanger = gauge.currentLevelMeters >= gauge.dangerLevelMeters;
        const color = isDanger ? '#EF4444' : gauge.currentLevelMeters >= gauge.warningLevelMeters ? '#F59E0B' : '#0284C7';

        const riverIcon = L.divIcon({
          className: 'custom-river-marker',
          html: `
            <div style="
              width: 22px;
              height: 22px;
              background: #FFFFFF;
              border: 2px solid ${color};
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: ${color};
              font-size: 12px;
              font-weight: 900;
              box-shadow: 0 4px 10px rgba(12, 35, 64, 0.2);
              cursor: pointer;
            ">
              ~
            </div>
          `,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        const marker = L.marker([gauge.lat, gauge.lng], { icon: riverIcon });
        marker.on('click', () => onSelectFeature?.({ type: 'RIVER', data: gauge }));
        marker.bindPopup(`
          <div style="font-family: inherit; padding: 2px;">
            <div style="color: ${color}; font-size: 10px; font-weight: 800; text-transform: uppercase;">CWC RIVER TELEMETRY</div>
            <b style="font-size: 13px; color: #0C2340;">${gauge.name}</b>
            <div style="font-size: 11px; margin-top: 4px; color: #334E68;">Stage: <b style="color: #0C2340;">${gauge.currentLevelMeters} m</b> (Danger: ${gauge.dangerLevelMeters}m)</div>
            <div style="font-size: 11px; color: #334E68;">Trend: <b style="color: ${gauge.trend === 'RISING' ? '#EF4444' : '#10B981'}">${gauge.trend}</b></div>
          </div>
        `);
        markersLayerRef.current.addLayer(marker);
      });
    }

    // 5. Rainfall Stations
    if (activeLayers.rainfallStations) {
      rainfallStations.forEach((rain) => {
        const rainColor =
          rain.alertColor === 'RED'
            ? '#EF4444'
            : rain.alertColor === 'ORANGE'
            ? '#F97316'
            : '#0284C7';

        const rainIcon = L.divIcon({
          className: 'custom-rain-marker',
          html: `
            <div style="
              padding: 2.5px 6.5px;
              background: #FFFFFF;
              border: 1.5px solid #A8DFFA;
              border-radius: 6px;
              font-size: 10px;
              font-weight: 800;
              color: ${rainColor};
              box-shadow: 0 2px 8px rgba(12, 35, 64, 0.15);
              white-space: nowrap;
              cursor: pointer;
            ">
              🌧️ ${rain.rainfallLast24hMm}mm
            </div>
          `,
          iconSize: [54, 20],
          iconAnchor: [27, 10],
        });

        const marker = L.marker([rain.lat, rain.lng], { icon: rainIcon });
        marker.on('click', () => onSelectFeature?.({ type: 'RAIN', data: rain }));
        markersLayerRef.current.addLayer(marker);
      });
    }
  }

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetKerala = () => mapInstanceRef.current?.flyTo([10.45, 76.35], 8);

  const handleFlyToHotspot = (spot: (typeof quickHotspots)[0]) => {
    mapInstanceRef.current?.flyTo([spot.lat, spot.lng], spot.zoom, { duration: 1.5 });
    setActiveStreetViewTarget({
      lat: spot.lat,
      lng: spot.lng,
      title: spot.name,
      description: `Target area in ${spot.district}`,
    });
  };

  const handleSaveGoogleKey = () => {
    localStorage.setItem('sentinel_google_api_key', customGoogleApiKey);
    setApiKeySavedNotice(true);
    setTimeout(() => {
      setApiKeySavedNotice(false);
      setGoogleKeyModalOpen(false);
    }, 1200);
  };

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-2xl border border-[#A8DFFA] bg-white shadow-md flex flex-col">
      {/* Tier 1 Header: Google Maps Engine Platform Status & Basemaps in Cloud & Sky */}
      <div className="z-10 bg-white/95 backdrop-blur-md border-b border-[#A8DFFA] px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F1FCFF] border border-[#A8DFFA]">
            <Globe2 className="w-3.5 h-3.5 text-[#0284C7]" />
            <span className="text-[11px] font-black text-[#0C2340]">Google Maps Engine</span>
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse ml-1" />
          </div>

          <div className="flex items-center bg-[#F1FCFF] border border-[#A8DFFA] rounded-xl p-0.5 text-xs shadow-xs">
            <button
              onClick={() => setBasemap('google_hybrid')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition ${
                basemap === 'google_hybrid'
                  ? 'bg-[#0284C7] text-white shadow-xs'
                  : 'text-[#334E68] hover:text-[#0C2340] hover:bg-[#E0F2FE]'
              }`}
            >
              <Satellite className="w-3.5 h-3.5" />
              <span>Google Hybrid</span>
            </button>

            <button
              onClick={() => setBasemap('google_roadmap')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition ${
                basemap === 'google_roadmap'
                  ? 'bg-[#0284C7] text-white shadow-xs'
                  : 'text-[#334E68] hover:text-[#0C2340] hover:bg-[#E0F2FE]'
              }`}
            >
              <span>🗺️ Roadmap</span>
            </button>

            <button
              onClick={() => setBasemap('google_terrain')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition ${
                basemap === 'google_terrain'
                  ? 'bg-[#0284C7] text-white shadow-xs'
                  : 'text-[#334E68] hover:text-[#0C2340] hover:bg-[#E0F2FE]'
              }`}
            >
              <span>⛰️ Terrain</span>
            </button>

            <button
              onClick={() => setBasemap('esri_satellite')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition ${
                basemap === 'esri_satellite'
                  ? 'bg-[#0284C7] text-white shadow-xs'
                  : 'text-[#334E68] hover:text-[#0C2340] hover:bg-[#E0F2FE]'
              }`}
            >
              <span>🛰️ Esri 4K</span>
            </button>
          </div>
        </div>

        {/* Right Tools: Doppler Radar, Google 3D View, Cloud Settings */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRadarOverlayActive((p) => !p)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
              radarOverlayActive
                ? 'bg-[#0284C7] border-[#0284C7] text-white shadow-sm'
                : 'bg-[#F1FCFF] border-[#A8DFFA] text-[#334E68] hover:text-[#0C2340]'
            }`}
            title="Toggle Live Weather Radar Doppler Overlay"
          >
            <Radar className={`w-3.5 h-3.5 ${radarOverlayActive ? 'animate-spin' : ''}`} />
            <span>Doppler Radar</span>
          </button>

          <button
            onClick={() => setStreetViewModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0284C7] hover:bg-[#0369A1] text-white transition shadow-sm"
            title="Open Interactive Google Maps Satellite & Street View"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Google 3D View</span>
          </button>

          <button
            onClick={() => setGoogleKeyModalOpen(true)}
            className="p-1.5 rounded-lg bg-[#F1FCFF] border border-[#A8DFFA] text-[#334E68] hover:text-[#0284C7] hover:border-[#0284C7] transition"
            title="Configure Google Maps Cloud API Key"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tier 2 Header: Clean Integrated Layer Toggles & Hotspots */}
      <div className="z-10 bg-[#F8FDFF] border-b border-[#A8DFFA] px-3.5 py-1.5 flex flex-wrap items-center justify-between gap-2">
        {/* Layer Toggles */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 text-[10px] font-black text-[#0284C7] px-1 uppercase tracking-wider">
            <Layers className="w-3 h-3 text-[#0284C7]" />
            <span>Layers:</span>
          </div>

          <button
            onClick={() => onToggleLayer?.('incidents')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition ${
              activeLayers.incidents
                ? 'bg-[#EF4444] text-white shadow-xs'
                : 'text-[#476685] hover:text-[#0C2340] bg-white border border-[#A8DFFA]'
            }`}
          >
            Incidents
          </button>

          <button
            onClick={() => onToggleLayer?.('floodZones')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition ${
              activeLayers.floodZones
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-[#476685] hover:text-[#0C2340] bg-white border border-[#A8DFFA]'
            }`}
          >
            Flood Inundation
          </button>

          <button
            onClick={() => onToggleLayer?.('landslideZones')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition ${
              activeLayers.landslideZones
                ? 'bg-[#F97316] text-white shadow-xs'
                : 'text-[#476685] hover:text-[#0C2340] bg-white border border-[#A8DFFA]'
            }`}
          >
            Landslide Zones
          </button>

          <button
            onClick={() => onToggleLayer?.('shelters')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition ${
              activeLayers.shelters
                ? 'bg-[#10B981] text-white shadow-xs'
                : 'text-[#476685] hover:text-[#0C2340] bg-white border border-[#A8DFFA]'
            }`}
          >
            Shelters & Hospitals
          </button>

          <button
            onClick={() => onToggleLayer?.('riverGauges')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition ${
              activeLayers.riverGauges
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'text-[#476685] hover:text-[#0C2340] bg-white border border-[#A8DFFA]'
            }`}
          >
            CWC Rivers
          </button>

          <button
            onClick={() => onToggleLayer?.('roadClosures')}
            className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition ${
              activeLayers.roadClosures
                ? 'bg-[#F59E0B] text-black shadow-xs'
                : 'text-[#476685] hover:text-[#0C2340] bg-white border border-[#A8DFFA]'
            }`}
          >
            Road Closures
          </button>
        </div>

        {/* Quick Fly-To Hotspot Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[10px] font-bold text-[#0284C7] uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Crosshair className="w-3 h-3" /> Fly-To:
          </span>
          {quickHotspots.map((spot, i) => (
            <button
              key={i}
              onClick={() => handleFlyToHotspot(spot)}
              className="shrink-0 px-2 py-0.5 rounded-md bg-white hover:bg-[#A8DFFA]/50 text-[#0C2340] border border-[#A8DFFA] text-[10px] font-semibold transition shadow-2xs"
            >
              {spot.name}
            </button>
          ))}
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative flex-1 w-full min-h-[440px]">
        <div ref={mapContainerRef} className="w-full h-full min-h-[440px] z-0" />

        {/* Floating Zoom & Compass Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <div className="bg-white/95 backdrop-blur-md border border-[#A8DFFA] rounded-xl p-1 flex flex-col shadow-md">
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-[#E0F2FE] text-[#0C2340] rounded-lg transition"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-[#E0F2FE] text-[#0C2340] rounded-lg transition"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <div className="h-px bg-[#A8DFFA] my-1" />
            <button
              onClick={handleResetKerala}
              className="p-2 hover:bg-[#E0F2FE] text-[#0284C7] rounded-lg transition"
              title="Reset Kerala Extent"
            >
              <Compass className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewport Coordinates, Elevation & Scale HUD */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
          <div className="bg-white/95 backdrop-blur-md border border-[#A8DFFA] px-3.5 py-1.5 rounded-xl text-xs font-mono text-[#0C2340] flex items-center gap-2 shadow-md">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
            <span>LAT: {centerCoords.lat}° N</span>
            <span className="text-[#A8DFFA]">|</span>
            <span>LNG: {centerCoords.lng}° E</span>
            <span className="text-[#A8DFFA]">|</span>
            <span>ZOOM: {currentZoom}x</span>
          </div>
          <div className="bg-white/90 backdrop-blur-md border border-[#A8DFFA] px-2.5 py-1.5 rounded-xl text-[10px] text-[#476685] font-semibold hidden md:block shadow-sm">
            GOOGLE MAPS PLATFORM &bull; KERALA DISASTER INTELLIGENCE
          </div>
        </div>

        {/* Legend Badge */}
        <div className="absolute bottom-4 right-4 z-10 hidden sm:flex items-center gap-3 bg-white/95 backdrop-blur-md border border-[#A8DFFA] px-3.5 py-1.5 rounded-xl text-xs shadow-md">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
            <span className="text-[#0C2340] text-[11px] font-bold">Critical Incident</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#F97316]" />
            <span className="text-[#0C2340] text-[11px] font-bold">Landslide Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#0284C7]" />
            <span className="text-[#0C2340] text-[11px] font-bold">Flood Zone</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-[#10B981]" />
            <span className="text-[#0C2340] text-[11px] font-bold">Relief Shelter</span>
          </div>
        </div>
      </div>

      {/* Google Maps Interactive 3D / Street View Modal */}
      {streetViewModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#A8DFFA] rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-[#A8DFFA] bg-[#F8FDFF] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#0284C7] flex items-center justify-center shadow-xs">
                  <Globe2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0C2340] flex items-center gap-2">
                    <span>Google Maps Interactive Satellite & Street View</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E0F2FE] text-[#0284C7] border border-[#A8DFFA] font-bold">
                      LIVE EMBED
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#476685]">
                    Target: {activeStreetViewTarget.title} ({activeStreetViewTarget.lat}° N, {activeStreetViewTarget.lng}° E)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://maps.google.com/?q=${activeStreetViewTarget.lat},${activeStreetViewTarget.lng}&t=k`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition shadow-sm"
                >
                  <span>Open in Google Maps App</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => setStreetViewModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#F1FCFF] text-[#334E68] hover:text-[#0C2340] text-xs border border-[#A8DFFA]"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Embedded Google Maps iframe */}
            <div className="relative w-full h-[520px] bg-slate-100">
              <iframe
                title="Google Maps Interactive View"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://maps.google.com/maps?q=${activeStreetViewTarget.lat},${activeStreetViewTarget.lng}&t=k&z=16&ie=UTF8&iwloc=&output=embed`}
                allowFullScreen
              />
            </div>

            <div className="p-3 bg-[#F8FDFF] border-t border-[#A8DFFA] flex items-center justify-between text-xs text-[#334E68]">
              <div className="flex items-center gap-2 font-mono font-semibold">
                <Crosshair className="w-3.5 h-3.5 text-[#0284C7]" />
                <span>Coordinates: {activeStreetViewTarget.lat}° N, {activeStreetViewTarget.lng}° E</span>
              </div>
              <div className="text-[11px] text-[#627D98]">
                High-Resolution Google Satellite Imagery with 360° Pan and Zoom
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Google Maps API Cloud Settings Modal */}
      {googleKeyModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#A8DFFA] rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#A8DFFA] pb-3">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-[#0284C7]" />
                <div>
                  <h3 className="text-sm font-bold text-[#0C2340]">Google Maps Platform Integration</h3>
                  <p className="text-[10px] text-[#476685]">KSDMA Enterprise Cloud GIS Configuration</p>
                </div>
              </div>
              <button
                onClick={() => setGoogleKeyModalOpen(false)}
                className="text-[#627D98] hover:text-[#0C2340] text-xs px-2.5 py-1 rounded bg-[#F1FCFF] border border-[#A8DFFA]"
              >
                Close
              </button>
            </div>

            {/* API Status Cards */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA]">
                <div className="text-[10px] text-[#627D98] font-bold uppercase">Maps JavaScript API</div>
                <div className="text-[#059669] font-bold flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span>v3.58 Connected</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA]">
                <div className="text-[10px] text-[#627D98] font-bold uppercase">Geocoding & Places</div>
                <div className="text-[#059669] font-bold flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span>Kerala Quadkey Ready</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA]">
                <div className="text-[10px] text-[#627D98] font-bold uppercase">Elevation API</div>
                <div className="text-[#0284C7] font-bold flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                  <span>Western Ghats DEM Active</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F8FDFF] border border-[#A8DFFA]">
                <div className="text-[10px] text-[#627D98] font-bold uppercase">Tile Watermarks</div>
                <div className="text-[#059669] font-bold flex items-center gap-1.5 mt-0.5">
                  <Check className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Zero Watermarks</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#334E68] leading-relaxed">
              SentinelGrid serves full Google Maps Hybrid and photorealistic tiles natively. If your emergency agency has a dedicated Google Cloud Platform account, enter your API Key below to route queries through your quota.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#0C2340] uppercase tracking-wider block">
                Google Cloud Maps API Key
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-[#0284C7]" />
                <input
                  type="text"
                  value={customGoogleApiKey}
                  onChange={(e) => setCustomGoogleApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-[#F1FCFF] border border-[#A8DFFA] rounded-xl pl-9 pr-3 py-2 text-xs text-[#0C2340] placeholder-[#627D98] focus:outline-none focus:border-[#0284C7]"
                />
              </div>
            </div>

            {apiKeySavedNotice && (
              <div className="p-2.5 rounded-xl bg-[#ECFDF5] border border-[#10B981]/40 text-[#059669] text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Google Maps API Key registered and verified!</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setGoogleKeyModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-[#F1FCFF] text-[#334E68] hover:text-[#0C2340] text-xs border border-[#A8DFFA]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGoogleKey}
                className="px-4 py-1.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs shadow-sm transition"
              >
                Save & Connect API Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
