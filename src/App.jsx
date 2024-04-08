import "./App.css";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header/Header";
import LocationList from "./components/LocationList/LocationList";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Toaster />
      <Header />
      <Routes>
        <Route path="/" element={<LocationList />} />
      </Routes>
    </>
  );
}

export default App;
