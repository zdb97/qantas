import React, { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loader from "./components/loader/Loader";
import { Airport } from "./types/airport";
import { isValidAirportData, getCachedAirports } from "./utils/AirportUtils";
import { AIRPORT_API, AIRPORT_CACHE_KEY, AIRPORT_CACHE_TTL } from "./constants/constants";
import "./styles/global.scss";

const AirportListing = lazy(() => import("./components/airportListing/AirportListing"));
const AirportDetails = lazy(() => import("./components/airportDetails/AirportDetails"));
const PageNotFound = lazy(() => import("./components/notFound/NotFound"));
const Search = lazy(() => import("./components/search/Search"));

const App: React.FC = () => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const cached = getCachedAirports();

    // load airport data from cached data if it's still valid
    if (cached && Date.now() - cached.timestamp < AIRPORT_CACHE_TTL) {
      setAirports(cached.data);
      setLoading(false);
      return;
    }

    fetch(AIRPORT_API, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("HTTP error!");
        return response.json();
      })
      .then((data: unknown) => {
        if (isValidAirportData(data)) {
          localStorage.setItem(AIRPORT_CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
          setAirports(data as Airport[]);
          setError(null);
        } else {
          throw new Error("API returned unexpected data format.");
        }
      })
      .catch((error: Error) => {
        // if fetch fails, use cached data
        if (cached) {
          setAirports(cached.data);
        } else if (error.name !== "AbortError") {
          setError(error.message || "Failed to fetch airport data.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="error-message">
        <h1>Unable to load airports</h1>
        <p>{error}</p>
        <p>Please try again later.</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loader />}>
              <AirportListing airports={airports} />
            </Suspense>
          }
        />
        <Route
          path="airport/:airportCode"
          element={
            <Suspense fallback={<Loader />}>
              <AirportDetails airports={airports} />
            </Suspense>
          }
        />
        <Route
          path="search"
          element={
            <Suspense fallback={<Loader />}>
              <Search />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<Loader />}>
              <PageNotFound />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
