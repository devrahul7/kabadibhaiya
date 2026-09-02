'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom SVG Pin for Leaflet Map — 100% offline & reliable
const createCustomIcon = (cityName) => L.divIcon({
  className: 'custom-map-marker',
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
      <div style="background:#e67e22;color:white;font-weight:800;font-size:11px;padding:2px 8px;border-radius:12px;box-shadow:0 2px 6px rgba(0,0,0,0.3);white-space:nowrap;margin-bottom:2px;border:1.5px solid white;">
        📍 ${cityName}
      </div>
      <div style="width:14px;height:14px;background:#27ae60;border:2.5px solid white;border-radius:50%;box-shadow:0 2px 4px rgba(0,0,0,0.4);"></div>
    </div>
  `,
  iconSize: [80, 40],
  iconAnchor: [40, 36],
  popupAnchor: [0, -36]
});

export default function MapInner() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    try {
      const map = L.map(containerRef.current, {
        center: [27.695, 85.34],
        zoom: 12,
        scrollWheelZoom: false,
      });
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      // Invalidate size after short delay to prevent grey tiles
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 300);

      // Kathmandu Valley Coverage Zone
      const coverageAreas = [
        { name: 'Kathmandu (काठमाडौं)', lat: 27.7172, lng: 85.3240, hub: 'Central Hub', phone: '97426869215' },
        { name: 'Lalitpur / Patan (ललितपुर)', lat: 27.6644, lng: 85.3188, hub: 'South Hub', phone: '97426869215' },
        { name: 'Bhaktapur (भक्तपुर)', lat: 27.6715, lng: 85.4298, hub: 'East Hub', phone: '97426869215' },
        { name: 'Kirtipur (कीर्तिपुर)', lat: 27.6798, lng: 85.2754, hub: 'West Coverage', phone: '97426869215' },
        { name: 'Boudha / Chabahil (बौद्ध)', lat: 27.7215, lng: 85.3620, hub: 'North-East Hub', phone: '97426869215' },
        { name: 'Kalanki (कलंकी)', lat: 27.6934, lng: 85.2818, hub: 'Highway Pickup Hub', phone: '97426869215' },
      ];

      // Valley Coverage Polygon
      const valleyBoundary = [
        [27.76, 85.33],
        [27.73, 85.40],
        [27.68, 85.46],
        [27.63, 85.38],
        [27.63, 85.28],
        [27.68, 85.25],
        [27.74, 85.28],
      ];

      L.polygon(valleyBoundary, {
        color: '#27ae60',
        fillColor: '#2ecc71',
        fillOpacity: 0.15,
        weight: 2.5,
        dashArray: '6, 6',
      }).addTo(map).bindPopup('<b>🌿 100% Free Doorstep Pickup Zone</b><br/>Kathmandu Valley (KTM, Lalitpur, Bhaktapur)');

      coverageAreas.forEach(area => {
        const marker = L.marker([area.lat, area.lng], { icon: createCustomIcon(area.name.split(' ')[0]) }).addTo(map);
        marker.bindPopup(`
          <div style="font-family:sans-serif;padding:4px;min-width:180px;">
            <div style="font-weight:bold;font-size:14px;color:#1e293b;margin-bottom:2px;">${area.name}</div>
            <div style="color:#27ae60;font-weight:700;font-size:11px;margin-bottom:6px;">✓ Active Free Pickup Hub</div>
            <div style="font-size:12px;color:#64748b;margin-bottom:8px;">Call/WhatsApp: <b>${area.phone}</b></div>
            <a href="/schedule" style="display:block;background:#e67e22;color:white;text-align:center;padding:6px 12px;border-radius:8px;font-weight:bold;font-size:12px;text-decoration:none;">Book Pickup Here</a>
          </div>
        `);
      });
    } catch (err) {
      console.error('Error initializing Leaflet map:', err);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-96 w-full rounded-2xl shadow-inner z-0 relative overflow-hidden border border-gray-200"
    />
  );
}

