import React, { useEffect, useRef, useMemo, memo } from "react";
import { Link } from "react-router-dom";
import { FixedSizeList as List } from "react-window";
import { Airport, GroupedAirports, AlphabetIndex, FlattenedAirportItem } from "../../types/airport";
import { ALPHABET } from "../../constants/constants";
import "./AirportListing.scss";

interface AirportListingProps {
  airports: Airport[];
}

interface RowProps {
  index: number;
  style: React.CSSProperties;
}

const alphabet = ALPHABET.split("");

const AirportListing: React.FC<AirportListingProps> = ({ airports }) => {
  const listRef = useRef<List>(null);

  // Group airports by first letter of airport code
  const { groupedAirports, alphabetIndex } = useMemo(() => {
    const grouped: GroupedAirports = {};
    const index: AlphabetIndex = {};

    airports.forEach((airport) => {
      const firstLetter = airport.airportCode.charAt(0).toUpperCase();
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
        index[firstLetter] = airports.findIndex(
          (a) => a.airportCode.charAt(0).toUpperCase() === firstLetter
        );
      }
      grouped[firstLetter].push(airport);
    });
    return { groupedAirports: grouped, alphabetIndex: index };
  }, [airports]);

  // Flatten the grouped airports with section headers
  const flattenedAirports = useMemo(() => {
    const result: FlattenedAirportItem[] = [];

    alphabet.forEach((letter) => {
      if (groupedAirports[letter]) {
        // Add section header
        result.push({
          type: "header",
          letter,
        });
        // Add airports for this letter
        groupedAirports[letter].forEach((airport) => {
          result.push({ type: "airport", ...airport });
        });
      }
    });
    return result;
  }, [groupedAirports]);

  useEffect(() => {
    document.title = `Airports`;

    const hash = window.location.hash;
    if (hash && hash.startsWith("#id=")) {
      const airportCode = hash.substring(4).toUpperCase();
      if (airportCode) {
        const index = flattenedAirports.findIndex(
          (item) => item.type === "airport" && item.airportCode === airportCode
        );

        if (index !== -1 && listRef.current) {
          listRef.current.scrollToItem(index, "start");
        }
      }
    }
  }, [flattenedAirports]);

  const scrollToSection = (letter: string) => {
    const index = flattenedAirports.findIndex(
      (item) => item.type === "header" && item.letter === letter
    );
    if (index !== -1 && listRef.current) {
      listRef.current.scrollToItem(index, "start");
    }
  };

  const Row: React.FC<RowProps> = ({ index, style }) => {
    const item = flattenedAirports[index];

    if (item.type === "header") {
      return (
        <li style={style}>
          <div className="section-header">
            <h2>{item.letter}</h2>
          </div>
        </li>
      );
    }

    return (
      <li style={style} id={item.airportCode}>
        <div className="airport-card">
          <Link
            to={`/airport/${item.airportCode}`}
            className="airport-link"
            aria-label={`View details for ${item.airportName} (${item.airportCode})`}
          >
            <div className="airport-info">
              <strong>{item.airportName}</strong>
              <span className="airport-code">{item.airportCode}</span>
            </div>
            <div className="airport-location">
              {item.city?.cityName}, {item.country?.countryName}
            </div>
          </Link>
        </div>
      </li>
    );
  };

  return (
    <div className="airport-list">
      <h1>Airports</h1>

      {/* Alphabet Index */}
      <nav className="alphabet-index" aria-label="Airport Alphabet Navigation">
        {Object.keys(alphabetIndex)
          .sort()
          .map((letter) => (
            <button
              key={letter}
              className="alphabet-button"
              onClick={() => scrollToSection(letter)}
              aria-label={`Jump to airports starting with ${letter}`}
              aria-controls={`section-${letter}`}
            >
              {letter}
            </button>
          ))}
      </nav>

      <List
        ref={listRef}
        height={window.innerHeight - 200}
        itemCount={flattenedAirports.length}
        itemSize={70}
        width={"100%"}
        innerElementType="ul"
        aria-labelledby="airports-heading"
      >
        {Row}
      </List>
    </div>
  );
};

export default memo(AirportListing);
