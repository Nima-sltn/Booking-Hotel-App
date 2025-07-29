// Common types used across the application

export interface Position {
  lat: number;
  lng: number;
}

export interface Hotel {
  id: string;
  name: string;
  host_location: string;
  latitude: number;
  longitude: number;
  accommodates: number;
  picture_url: {
    url: string;
  };
  price: number;
  smart_location: string;
  number_of_reviews?: number;
  xl_picture_url?: string;
}

export interface Bookmark {
  id: string;
  cityName: string;
  country: string;
  countryCode: string;
  host_location: string;
  latitude: number;
  longitude: number;
}

export interface User {
  name: string;
  email: string;
}

export interface SearchOptions {
  destination: string;
  options: {
    adult: number;
    children: number;
    room: number;
  };
  date: {
    startDate: Date;
    endDate: Date;
  };
}