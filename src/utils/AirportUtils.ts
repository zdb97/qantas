import { Airport, AirportCache } from "../types/airport";
import { AIRPORT_CACHE_KEY } from "../constants/constants";

export const isValidAirportData = (data: unknown): data is Airport[] => {
  if (!Array.isArray(data) || data.length === 0) return false;
  for (let i = 0; i < Math.min(3, data.length); i++) {
    const item = data[i];
    if (
      typeof item !== "object" ||
      item === null ||
      !("airportCode" in item) ||
      !("airportName" in item) ||
      typeof (item as any).city !== "object" ||
      (item as any).city === null ||
      !("cityName" in (item as any).city) ||
      typeof (item as any).country !== "object" ||
      (item as any).country === null ||
      !("countryName" in (item as any).country)
    ) {
      return false;
    }
  }
  return true;
};

export const getCachedAirports = (): AirportCache | null => {
  const cache = localStorage.getItem(AIRPORT_CACHE_KEY);
  if (!cache) return null;
  try {
    const parsed = JSON.parse(cache);
    if (Array.isArray(parsed.data) && typeof parsed.timestamp === "number") {
      return parsed;
    }
  } catch {}
  return null;
};
