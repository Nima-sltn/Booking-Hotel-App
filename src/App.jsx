import "./App.css";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header/Header";
import LocationList from "./components/LocationList/LocationList";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout/AppLayout";

function App() {
  return (
    <>
      <Toaster />
      <Header />
      <Routes>
        <Route path="/" element={<LocationList />} />
        <Route path="/hotels" element={<AppLayout />}>
          <Route index element={<div>Hotels</div>} />
          <Route path=":id" element={<div>Single Hotel</div>} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
