import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AirportDetails from "./AirportDetails";
import { mockAirports } from "../../utils/airportMocks";

describe("AirportDetails", () => {
  function renderWithRouter(airportCode: string) {
    return render(
      <MemoryRouter initialEntries={[`/airport/${airportCode}`]}>
        <Routes>
          <Route
            path="/airport/:airportCode"
            element={<AirportDetails airports={mockAirports} />}
          />
        </Routes>
      </MemoryRouter>
    );
  }

  it("renders airport details for a valid airport", () => {
    renderWithRouter("SYD");
    expect(screen.getByRole("heading", { name: /Sydney/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Airport code")).toHaveTextContent("SYD");
    expect(screen.getByLabelText("Country name")).toHaveTextContent("Australia");
    expect(screen.getByLabelText("City name")).toHaveTextContent("Sydney");
    expect(screen.getByLabelText("Region name")).toHaveTextContent("Australia");
    expect(screen.getByLabelText("Timezone")).toHaveTextContent("Australia/Sydney");
    expect(screen.queryByLabelText("Latitude")).toBeInTheDocument();
    expect(screen.queryByLabelText("Longitude")).toBeInTheDocument();
    expect(screen.getByText(/-33.9461° S/)).toBeInTheDocument();
    expect(screen.getByText(/151.1772° E/)).toBeInTheDocument();
    expect(document.title).toMatch(/Airport Details - SYD/i);
  });

  it("renders airport details for a valid airport without location data", () => {
    renderWithRouter("MEL");
    expect(screen.getByRole("heading", { name: /Melbourne/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Airport code")).toHaveTextContent("MEL");
    expect(screen.getByLabelText("Country name")).toHaveTextContent("Australia");
    expect(screen.getByLabelText("City name")).toHaveTextContent("Melbourne");
    expect(screen.getByLabelText("Timezone")).toHaveTextContent("Australia/Sydney");
    expect(screen.queryByLabelText("Region name")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Latitude")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Longitude")).not.toBeInTheDocument();
  });

  it("shows not found message for invalid airport code", () => {
    renderWithRouter("ZZZ");
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/Airport not found/i)).toBeInTheDocument();
    expect(screen.getByText(/ZZZ/)).toBeInTheDocument();
  });
});
