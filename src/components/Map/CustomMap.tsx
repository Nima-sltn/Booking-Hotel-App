import { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useNavigate } from "react-router-dom";
import useGeoLocation from "../../hooks/useGeoLocation";
import useUrlLocation from "../../hooks/useUrlLocation";
import { Hotel, Bookmark } from "../../types";
import { LeafletMouseEvent } from "leaflet";

interface CustomMapProps {
  markerLocations: Hotel[] | Bookmark[];
}

interface ChangeCenterProps {
  position: [number, number];
}

function CustomMap({ markerLocations }: CustomMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([50, 3]);
  const [lat, lng] = useUrlLocation();

  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeoLocation();

  useEffect(() => {
    if (lat && lng) setMapCenter([Number(lat), Number(lng)]);
  }, [lat, lng]);

  useEffect(() => {
    if (geoLocationPosition && 'lat' in geoLocationPosition && 'lng' in geoLocationPosition) {
      setMapCenter([geoLocationPosition.lat, geoLocationPosition.lng]);
    }
  }, [geoLocationPosition]);

  return (
    <div className="mapContainer">
      <MapContainer
        className="map"
        center={mapCenter}
        zoom={13}
        scrollWheelZoom={true}>
        <button onClick={getPosition} className="getLocation">
          {isLoadingPosition ? "Loading ..." : "Use Your Location"}
        </button>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        <DetectClick />
        <ChangeCenter position={mapCenter} />
        {markerLocations.map((item) => (
          <Marker key={item.id} position={[item.latitude, item.longitude]}>
            <Popup>{('host_location' in item) ? item.host_location : (item as Bookmark).cityName}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default CustomMap;

function ChangeCenter({ position }: ChangeCenterProps) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClick() {
  const navigate = useNavigate();
  useMapEvent('click', (e: LeafletMouseEvent) =>
    navigate(`/bookmark/add?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)
  );
  return null;
}
