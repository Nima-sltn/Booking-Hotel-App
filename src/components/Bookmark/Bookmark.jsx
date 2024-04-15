import Map from "../Map/Map";

function Bookmark() {
  return (
    <>
      <div className="appLayout">
        <div className="sidebar">{/* <Outlet /> */}</div>
        <Map markerLocations={[]} />
      </div>
    </>
  );
}

export default Bookmark;
