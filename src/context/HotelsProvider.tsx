import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import axios from "axios";
import toast from "react-hot-toast";
import { Hotel } from "../types";

interface HotelContextType {
  isLoading: boolean;
  hotels: Hotel[];
  currentHotel: Hotel | null;
  getHotel: (id: string) => Promise<void>;
  isLoadingCurrHotel: boolean;
}

interface HotelsProviderProps {
  children: ReactNode;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);
const BASE_URL = "http://localhost:5000/hotels";

function HotelsProvider({ children }: HotelsProviderProps) {
  const [currentHotel, setCurrentHotel] = useState<Hotel | null>(null);
  const [isLoadingCurrHotel, setIsLoadingCurrHotel] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const destination = searchParams.get("destination");
  const room = JSON.parse(searchParams.get("options") || "{}")?.room;
  const { isLoading, data: hotels } = useFetch<Hotel>(
    BASE_URL,
    `q=${destination || ""}&accommodates_gte=${room || 1}`
  );

  async function getHotel(id: string): Promise<void> {
    setIsLoadingCurrHotel(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/${id}`);
      setCurrentHotel(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoadingCurrHotel(false);
    }
  }

  const hotelContextValue = useMemo(
    () => ({
      isLoading,
      hotels,
      currentHotel,
      getHotel,
      isLoadingCurrHotel,
    }),
    [isLoading, hotels, currentHotel, isLoadingCurrHotel]
  );

  return (
    <HotelContext.Provider value={hotelContextValue}>
      {children}
    </HotelContext.Provider>
  );
}
export default HotelsProvider;

export function useHotels(): HotelContextType {
  const context = useContext(HotelContext);
  if (context === undefined) {
    throw new Error("useHotels must be used within a HotelsProvider");
  }
  return context;
}
