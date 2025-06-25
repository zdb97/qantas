import React, { useEffect, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Airport } from "../../types/airport";
import "./AirportDetails.scss";

interface AirportDetailsProps {
  airports: Airport[];
}

const AirportDetails: React.FC<AirportDetailsProps> = ({ airports }) => {
  const { airportCode } = useParams<{ airportCode: string }>();
  const navigate = useNavigate();

  const airport =
    airports.find((airport) => airport.airportCode.toLowerCase() === airportCode?.toLowerCase()) ||
    null;

  const hasRegionData = (airport: Airport): boolean => !!airport.region?.regionName;
  const hasTimezoneData = (airport: Airport): boolean => !!airport.city?.timeZoneName;
  const hasLocationData = (airport: Airport): boolean =>
    !!airport.location &&
    airport.location.latitude !== undefined &&
    airport.location.latitude !== null &&
    !!airport.location.latitudeDirection &&
    airport.location.longitude !== undefined &&
    airport.location.longitude !== null &&
    !!airport.location.longitudeDirection;

  const getLocationDetails = (coordinate: number, direction: string): string =>
    `${coordinate}° ${direction}`;

  useEffect(() => {
    document.title = `Airport Details - ${airportCode}`;
  }, [airportCode]);

  if (!airport) {
    return (
      <div className="airport-details" role="alert" aria-live="assertive">
        <button
          className="back-btn"
          onClick={() => navigate("/")}
          aria-label="Back to airport list"
        >
          &larr; Back
        </button>
        <h2>Airport not found</h2>
        <p>
          The airport with code <span aria-label="Airport code">{airportCode?.toUpperCase()}</span>{" "}
          could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="airport-details" role="region" aria-labelledby="airport-details-heading">
      <button
        className="back-btn"
        onClick={() => navigate(`/#id=${airport.airportCode}`)}
        aria-label="Back to airport list"
      >
        &larr; Back
      </button>
      <h2>{airport.airportName}</h2>
      <ul className="airport-details-list">
        <li>
          <strong>Code:</strong> <span aria-label="Airport code">{airport.airportCode}</span>
        </li>
        <li>
          <strong>City:</strong> <span aria-label="City name">{airport.city.cityName}</span>
        </li>
        <li>
          <strong>Country:</strong>{" "}
          <span aria-label="Country name">{airport.country.countryName}</span>
        </li>
        {hasRegionData(airport) && (
          <li>
            <strong>Region:</strong>{" "}
            <span aria-label="Region name">{airport.region!.regionName}</span>
          </li>
        )}
        {hasTimezoneData(airport) && (
          <li>
            <strong>Timezone:</strong>{" "}
            <span aria-label="Timezone">{airport.city.timeZoneName}</span>
          </li>
        )}
        {hasLocationData(airport) && (
          <>
            <li>
              <strong>Latitude:</strong>
              <span aria-label="Latitude">
                {getLocationDetails(
                  airport.location!.latitude,
                  airport.location!.latitudeDirection ?? ""
                )}
              </span>
            </li>
            <li>
              <strong>Longitude:</strong>
              <span aria-label="Longitude">
                {getLocationDetails(
                  airport.location!.longitude,
                  airport.location!.longitudeDirection ?? ""
                )}
              </span>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default memo(AirportDetails);
