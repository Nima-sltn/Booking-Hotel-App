import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import CustomMap from "../Map/CustomMap";
import Loader from "../Loader/Loader";
import { useHotels } from "../../context/HotelsContext";

/**
 * Split layout for hotel routes: scrollable results panel + full map.
 * Flex column on small screens, side-by-side from `lg` up.
 *
 * The `Suspense` boundary wraps **only the outlet**: a lazy child page can
 * never hide the map subtree (react-leaflet re-attaches its ref when a
 * subtree re-appears, which would initialise an already-initialised map).
 */
function AppLayout() {
  const { hotels } = useHotels();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 p-4 lg:flex-row lg:p-6">
      <aside className="panel scrollbar-thin min-h-0 flex-1 overflow-y-auto p-4 lg:w-2/5 lg:flex-none xl:w-[38%]">
        <Suspense fallback={<Loader label="Loading page…" />}>
          <Outlet />
        </Suspense>
      </aside>

      <div className="relative h-[45vh] overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-800 lg:h-auto lg:min-h-0 lg:flex-1">
        <CustomMap markerLocations={hotels} />
      </div>
    </div>
  );
}

export default AppLayout;
