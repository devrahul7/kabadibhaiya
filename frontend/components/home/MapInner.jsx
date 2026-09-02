import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapInner() {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      // Fix leaflet default icon
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      const map = L.map('coverage-map').setView([27.69, 85.35], 11);
      mapRef.current = map;

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
      }).addTo(map);

      const cities = [
        { name: 'Kathmandu', lat: 27.7172, lng: 85.3240 },
        { name: 'Lalitpur', lat: 27.6644, lng: 85.3188 },
        { name: 'Bhaktapur', lat: 27.6715, lng: 85.4298 }
      ];

      const polygonCoords = cities.map(c => [c.lat, c.lng]);
      
      L.polygon(polygonCoords, {
        color: '#27ae60',
        fillColor: '#d4efdf',
        fillOpacity: 0.5,
        weight: 2
      }).addTo(map);

      cities.forEach(city => {
        L.marker([city.lat, city.lng]).addTo(map)
          .bindPopup(`<b>${city.name}</b><br/>Full Coverage Area<br/><a href="/schedule" style="color:#e67e22;font-weight:bold;">Schedule Pickup</a>`);
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div id="coverage-map" className="h-96 w-full rounded-2xl shadow-inner z-0 relative"></div>;
}
