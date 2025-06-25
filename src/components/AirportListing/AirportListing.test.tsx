import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AirportListing from "./AirportListing";
import { mockAirports } from "../../utils/airportMocks";

describe("AirportListing", () => {
  let utils;
  beforeEach(() => {
    utils = render(
      <MemoryRouter>
        <AirportListing airports={mockAirports} />
      </MemoryRouter>
    );
  });

  it("sets the document title to 'Airports' on render", () => {
    expect(document.title).toMatch(/Airports/i);
  });

  it("renders the airport list and section headers", () => {
    expect(screen.getByRole("heading", { name: /airports/i })).toBeInTheDocument();

    expect(screen.getAllByText(/Sydney/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Melbourne/i).length).toBeGreaterThan(0);

    expect(screen.getByRole("heading", { level: 2, name: "S" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "M" })).toBeInTheDocument();
  });

  it("renders airport links", () => {
    expect(screen.getByRole("link", { name: /Sydney/i })).toHaveAttribute("href", "/airport/SYD");
    expect(screen.getByRole("link", { name: /Melbourne/i })).toHaveAttribute(
      "href",
      "/airport/MEL"
    );
  });

  it("renders alphabet index buttons", () => {
    expect(
      screen.queryByRole("button", { name: /Jump to airports starting with S/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Jump to airports starting with M/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Jump to airports starting with A/i })
    ).not.toBeInTheDocument();
  });
});
