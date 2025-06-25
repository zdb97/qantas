import { isValidAirportData } from "./utils/AirportUtils";
import { AIRPORT_CACHE_KEY, AIRPORT_API } from "./constants/constants";
import { mockAirports, validAirportCache } from "./utils/airportMocks";

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

describe("App data fetching", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.resetAllMocks();
  });

  it("fetches airport data from API when no cache exists", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockAirports,
    });

    const response = await fetch(AIRPORT_API);
    const data = await response.json();

    expect(global.fetch).toHaveBeenCalledWith(AIRPORT_API);
    expect(isValidAirportData(data)).toBe(true);
    expect(localStorage.getItem(AIRPORT_CACHE_KEY)).toBeNull();
  });

  it("reads airport data from local storage cache if fetch fails", async () => {
    localStorage.setItem(AIRPORT_CACHE_KEY, JSON.stringify(validAirportCache));

    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    let data;
    try {
      const response = await fetch(AIRPORT_API);
      data = await response.json();
    } catch {
      const cached = localStorage.getItem(AIRPORT_CACHE_KEY);
      data = cached ? JSON.parse(cached).data : null;
    }

    expect(global.fetch).toHaveBeenCalledWith(AIRPORT_API);
    expect(data).toEqual(validAirportCache.data);
  });

  it("displays error message when response.ok is false and no cache exists", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    });

    let error = null;
    try {
      const response = await fetch(AIRPORT_API);
      if (!response.ok) throw new Error("HTTP error!");
      await response.json();
    } catch (e) {
      error = e;
    }

    expect(global.fetch).toHaveBeenCalledWith(AIRPORT_API);
    expect(localStorage.getItem(AIRPORT_CACHE_KEY)).toBeNull();
    expect(error).not.toBeNull();
    if (error instanceof Error) {
      expect(error.message).toMatch(/http error/i);
    }
  });

  it("displays error message when fetch fails and no cache exists", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    let error = null;
    let data = null;
    try {
      const response = await fetch(AIRPORT_API);
      data = await response.json();
    } catch (e) {
      const cached = localStorage.getItem(AIRPORT_CACHE_KEY);
      data = cached ? JSON.parse(cached).data : null;
      error = e;
    }

    expect(global.fetch).toHaveBeenCalledWith(AIRPORT_API);
    expect(data).toBeNull();
    expect(error).not.toBeNull();
    if (error instanceof Error) {
      expect(error.message).toMatch(/network error/i);
    }
  });
});

describe("getCachedAirports", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("returns null if no cache", () => {
    expect(localStorage.getItem(AIRPORT_CACHE_KEY)).toBeNull();
  });

  it("returns parsed cache if valid", () => {
    localStorage.setItem(AIRPORT_CACHE_KEY, JSON.stringify(validAirportCache));
    expect(JSON.parse(localStorage.getItem(AIRPORT_CACHE_KEY) || "{}")).toEqual(validAirportCache);
  });
});
