import "./App.css";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header/Header";
import LocationList from "./components/LocationList/LocationList";

function App() {
  return (
    <>
      <Toaster />
      <Header />
      <LocationList />
    </>
  );
}

export default App;
