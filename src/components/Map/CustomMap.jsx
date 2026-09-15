import { useEffect, useState } from "react";
import PropTypes from "prop-types";

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

function CustomMap({ markerLocations }) {
  const [mapCenter, setMapCenter] = useState([50, 3]);

  const [lat, lng] = useUrlLocation();

  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeoLocation();

  useEffect(() => {
    if (lat && lng) {
      setMapCenter([lat, lng]);
    }
  }, [lat, lng]);

  useEffect(() => {
    if (geoLocationPosition?.lat && geoLocationPosition?.lng) {
      setMapCenter([geoLocationPosition.lat, geoLocationPosition.lng]);
    }
  }, [geoLocationPosition]);

  return (
    <div className="mapContainer">
      <MapContainer
        className="map"
        center={mapCenter}
        zoom={13}
        scrollWheelZoom>
        <button type="button" onClick={getPosition} className="getLocation">
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
            <Popup>{item.host_location}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

CustomMap.propTypes = {
  markerLocations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
      host_location: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default CustomMap;

function ChangeCenter({ position }) {
  const map = useMap();

  map.setView(position);

  return null;
}

ChangeCenter.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
};

function DetectClick() {
  const navigate = useNavigate();

  useMapEvent("click", (e) => {
    navigate(`/bookmark/add?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
  });

  return null;
}
