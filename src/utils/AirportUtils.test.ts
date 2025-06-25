import { isValidAirportData, getCachedAirports } from "./AirportUtils";
import { mockAirports, validAirportCache } from "./airportMocks";
import { AIRPORT_CACHE_KEY } from "../constants/constants";

describe("isValidAirportData", () => {
  it("returns true for valid airport array", () => {
    expect(isValidAirportData(mockAirports)).toBe(true);
  });

  it("returns false for non-array", () => {
    expect(isValidAirportData(null)).toBe(false);
    expect(isValidAirportData({})).toBe(false);
  });

  it("returns false for array with missing fields", () => {
    const invalid = [{ airportCode: "SYD" }, { airportName: "Melbourne" }];
    expect(isValidAirportData(invalid)).toBe(false);
  });
});

describe("getCachedAirports", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null if no cache", () => {
    expect(getCachedAirports()).toBeNull();
  });

  it("returns parsed cache if valid", () => {
    localStorage.setItem(AIRPORT_CACHE_KEY, JSON.stringify(validAirportCache));
    expect(getCachedAirports()).toEqual(validAirportCache);
  });

  it("returns null for invalid cache structure", () => {
    localStorage.setItem(AIRPORT_CACHE_KEY, JSON.stringify({ foo: "bar" }));
    expect(getCachedAirports()).toBeNull();
  });

  it("returns null for invalid JSON", () => {
    localStorage.setItem(AIRPORT_CACHE_KEY, "not-json");
    expect(getCachedAirports()).toBeNull();
  });
});
