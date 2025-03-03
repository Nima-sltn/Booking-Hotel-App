import { Outlet } from "react-router-dom";
import CustomMap from "../Map/CustomMap";
import { useHotels } from "../../context/HotelsProvider";

function AppLayout() {
  const { hotels } = useHotels();
  return (
    <div className="appLayout">
      <div className="sidebar">
        <Outlet />
      </div>
      <CustomMap markerLocations={hotels} />
    </div>
  );
}

export default AppLayout;
