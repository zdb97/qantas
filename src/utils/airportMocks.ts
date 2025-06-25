import { Airport, AirportCache } from "../types/airport";

export const mockAirports: Airport[] = [
  {
    airportCode: "SYD",
    airportName: "Sydney",
    city: { cityName: "Sydney", timeZoneName: "Australia/Sydney" },
    country: { countryName: "Australia" },
    region: { regionName: "Australia" },
    location: {
      latitude: -33.9461,
      latitudeDirection: "S",
      longitude: 151.1772,
      longitudeDirection: "E",
    },
  },
  {
    airportCode: "MEL",
    airportName: "Melbourne",
    city: { cityName: "Melbourne", timeZoneName: "Australia/Sydney" },
    country: { countryName: "Australia" },
    location: {
      latitude: 0,
      longitude: 0,
    },
  },
];

export const validAirportCache: AirportCache = {
  data: mockAirports,
  timestamp: 1710000000000,
};
