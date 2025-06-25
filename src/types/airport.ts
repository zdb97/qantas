export interface Location {
  latitude: number;
  latitudeDirection?: string;
  longitude: number;
  longitudeDirection?: string;
}

export interface City {
  cityName: string;
  timeZoneName?: string;
}

export interface Country {
  countryName: string;
}

export interface Region {
  regionName: string;
}

export interface Airport {
  airportCode: string;
  airportName: string;
  city: City;
  country: Country;
  region?: Region;
  location?: Location;
}

export type GroupedAirports = {
  [key: string]: Airport[];
};

export type AlphabetIndex = {
  [key: string]: number;
};

export interface FlattenedAirportItem {
  type: "header" | "airport";
  letter?: string;
  airportCode?: string;
  airportName?: string;
  city?: City;
  country?: Country;
  region?: Region;
  location?: Location;
}

export type AirportCache = {
  data: Airport[];
  timestamp: number;
};
