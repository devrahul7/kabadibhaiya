'use client';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom Animated Leaflet Pin
const createPickupPin = () => L.divIcon({
  className: 'custom-pickup-pin',
  html: `
    <div style="display:flex;flex-direction:column;align-items:center;cursor:grab;">
      <div style="background:#e67e22;color:white;font-weight:900;font-size:11px;padding:3px 10px;border-radius:20px;box-shadow:0 3px 8px rgba(0,0,0,0.35);white-space:nowrap;margin-bottom:2px;border:2px solid white;animation:bounce 1.5s infinite;">
        📍 PICKUP SPOT
      </div>
      <div style="width:16px;height:16px;background:#c0392b;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.5);"></div>
    </div>
  `,
  iconSize: [110, 48],
  iconAnchor: [55, 42],
  popupAnchor: [0, -42]
});

export default function PickupMapInner({ lat, lng, onLocationChange }) {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const initialLat = lat || 27.7172;
    const initialLng = lng || 85.3240;

    try {
      const map = L.map(containerRef.current, {
        center: [initialLat, initialLng],
        zoom: 15,
        scrollWheelZoom: false,
      });
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Invalidate size shortly after mount to ensure proper tile rendering
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 300);

      // Create Draggable Marker with custom DivIcon
      const marker = L.marker([initialLat, initialLng], {
        draggable: true,
        icon: createPickupPin(),
      }).addTo(map);
      markerRef.current = marker;

      marker.bindPopup(`
        <div style="font-family:sans-serif;padding:2px;text-align:center;">
          <b style="color:#e67e22;">📍 Pickup Location</b>
          <div style="font-size:11px;color:#64748b;margin-top:2px;">Drag this pin or click anywhere on map to refine your gate</div>
        </div>
      `).openPopup();

      // Drag event
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        map.panTo(position);
        if (onLocationChange) {
          onLocationChange(position.lat, position.lng);
        }
      });

      // Map click event: moves marker to clicked position
      map.on('click', (e) => {
        marker.setLatLng(e.latlng);
        map.panTo(e.latlng);
        if (onLocationChange) {
          onLocationChange(e.latlng.lat, e.latlng.lng);
        }
      });
    } catch (err) {
      console.error('Error initializing pickup map:', err);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update marker position when lat / lng props change externally
  useEffect(() => {
    if (mapRef.current && markerRef.current && lat && lng) {
      const newLatLng = new L.LatLng(lat, lng);
      markerRef.current.setLatLng(newLatLng);
      mapRef.current.setView(newLatLng, 15, { animate: true });
    }
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      className="h-64 sm:h-72 w-full rounded-2xl overflow-hidden border border-gray-200 z-0 relative shadow-inner"
    />
  );
}

