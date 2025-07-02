import React, { memo, useState, useCallback, useEffect } from "react";
import { AIRPORT_SEARCH_API } from "../../constants/constants";
import { Link } from "react-router-dom";
import "./Search.scss";

const debounce_delay = 500; // milliseconds

const Search: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = `Airport Search`;
  }, []);

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: number;
    // let timer: ReturnType<typeof setTimeout>;
    // let timeout: NodeJS.Timeout | number | null = null;

    return (...args: any[]) => {
      console.log("args: ", args);
      clearTimeout(timer);
      timer = window.setTimeout(() => func(...args), delay);
    };
  };

  const fetchAirports = useCallback(
    debounce(async (search: string) => {
      if (!search || search.length < 3) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(AIRPORT_SEARCH_API + encodeURIComponent(search));
        const data = await res.json();
        setResults(data.airports || []);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, debounce_delay),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    fetchAirports(value.toUpperCase());
  };

  return (
    <div className="search-container" role="region" aria-labelledby="search-heading">
      <h1>Search Airports</h1>
      <p>
        <Link to="/" className="back-btn" aria-label="Back to airport list">
          Back
        </Link>
      </p>
      <input
        type="text"
        placeholder="Search airports..."
        value={query}
        onChange={handleChange}
        aria-label="Search airports"
      />
      {loading && <div>Loading...</div>}
      <ul>
        {results.map((airport, idx) => (
          <li key={idx}>{airport.airportName || airport.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default memo(Search);
