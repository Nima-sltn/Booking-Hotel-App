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
import "leaflet/dist/leaflet.css";
import useGeoLocation from "../../hooks/useGeoLocation";
import useUrlLocation from "../../hooks/useUrlLocation";

const DEFAULT_CENTER = [50, 3];

/**
 * Interactive map: shows marker locations, click-to-bookmark,
 * URL-driven centering and a "use my location" control.
 *
 * @param {{ markerLocations: Array<object> }} props
 */
function CustomMap({ markerLocations }) {
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
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
    if (geoLocationPosition?.lat && geoLocationPosition?.lng) {
      setMapCenter([geoLocationPosition.lat, geoLocationPosition.lng]);
    }
  }, [geoLocationPosition]);

  return (
    <div className="relative h-full w-full">
      <MapContainer className="h-full w-full" center={mapCenter} zoom={13} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        <DetectClick />
        <ChangeCenter position={mapCenter} />

        {markerLocations.map((item) => (
          <Marker
            key={item.id}
            position={[Number(item.latitude), Number(item.longitude)]}>
            <Popup>
              <div className="min-w-36">
                <p className="text-sm font-semibold">
                  {item.name ?? item.cityName}
                </p>
                <p className="text-xs opacity-70">
                  {item.host_location ?? item.country}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Sibling of the leaflet container on purpose: clicks on it must
          never trigger the map's click-to-bookmark handler. */}
      <button
        type="button"
        onClick={getPosition}
        className="absolute bottom-4 left-4 z-[1000] rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-lg ring-1 ring-slate-200 transition hover:bg-indigo-600 hover:text-white hover:ring-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700">
        {isLoadingPosition ? "Locating…" : "Use my location"}
      </button>
    </div>
  );
}

CustomMap.propTypes = {
  markerLocations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      latitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      longitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      host_location: PropTypes.string,
      name: PropTypes.string,
      cityName: PropTypes.string,
      country: PropTypes.string,
    }),
  ).isRequired,
};

export default CustomMap;

/** Keep the view centered on `position` without mutating during render. */
function ChangeCenter({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position);
  }, [map, position]);

  return null;
}

ChangeCenter.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
};

/** Clicking the map starts the "add bookmark at this spot" flow. */
function DetectClick() {
  const navigate = useNavigate();

  useMapEvent("click", (e) => {
    navigate(`/bookmark/add?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
  });

  return null;
}
