import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchForm from "../Shared/SearchForm";
import SearchBar from "../Search/SearchBar";
import Filters from "../Search/Filters";
import FlightResultsTable from "../Search/FlightResultsTable";
import "../../styles/FlightResults.scss";

const iataToPlace = {
  LAX: "Los Angeles (LAX)",
  JFK: "New York (JFK)",
  PNQ: "Pune (PNQ)",
  BOM: "Mumbai (BOM)",
  DEL: "Delhi (DEL)",
  SIN: "Singapore (SIN)",
  ATL: "Atlanta (ATL)",
  LHR: "London (LHR)",
  FRA: "Frankfurt (FRA)",
  DOH: "Doha (DOH)",
  CDG: "Paris (CDG)",
};

const airlines = [
  "United Airlines",
  "Delta Air Lines",
  "Air India",
  "Singapore Airlines",
  "British Airways",
  "Emirates",
  "American Airlines",
  "Lufthansa",
  "Qatar Airways",
  "Air France",
  "Japan Airlines",
];
const stopsOptions = ["0", "1", "2+"];
const timeSlots = ["morning", "afternoon", "evening", "night"];

function FlightResults({ flights, formData, searchType, onToggleSearch }) {
  const [filters, setFilters] = useState({
    priceRange: [0, 2000],
    airlines: [],
    stops: [],
    depTimeSlots: [],
    arrTimeSlots: [],
  });
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [currentFlights, setCurrentFlights] = useState(flights);
  const [currentFormData, setCurrentFormData] = useState(formData);
  const [currentSearchType, setCurrentSearchType] = useState(searchType);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getTimeSlot = (time) => {
    const hour = new Date(time).getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    if (hour < 21) return "evening";
    return "night";
  };

  const filterFlights = (data) => {
    return data.filter((flight) => {
      const matchesPrice =
        flight.price >= filters.priceRange[0] &&
        flight.price <= filters.priceRange[1];
      const matchesAirline =
        filters.airlines.length === 0 ||
        filters.airlines.includes(flight.flight.airline);
      const stopsStr =
        flight.flight.stops >= 2 ? "2+" : flight.flight.stops.toString();
      const matchesStops =
        filters.stops.length === 0 || filters.stops.includes(stopsStr);
      const depTimeSlot = getTimeSlot(flight.departure.scheduled);
      const arrTimeSlot = getTimeSlot(flight.arrival.scheduled);
      const matchesDepTime =
        filters.depTimeSlots.length === 0 ||
        filters.depTimeSlots.includes(depTimeSlot);
      const matchesArrTime =
        filters.arrTimeSlots.length === 0 ||
        filters.arrTimeSlots.includes(arrTimeSlot);

      return (
        matchesPrice &&
        matchesAirline &&
        matchesStops &&
        matchesDepTime &&
        matchesArrTime
      );
    });
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [filterName]: value };
      console.log(`Updated filters: `, updatedFilters);
      return updatedFilters;
    });
  };

  const handleBookNow = (flightId) => {
    navigate(`/booking/${flightId}`);
  };

  const getSearchSummary = () => {
    const segmentsSummary = currentFormData.segments
      .map(
        (segment) =>
          `${iataToPlace[segment.departure]} - ${iataToPlace[segment.arrival]}`
      )
      .join(" | ");
    return { route: segmentsSummary };
  };

  const handleSearch = (result) => {
    if (result.error) {
      setError(result.error);
      setCurrentFlights([]);
      setCurrentFormData({
        segments: [{ departure: "", arrival: "", date: "" }],
      });
      setCurrentSearchType("one-way");
    } else {
      setError("");
      setCurrentFlights(result.flights);
      setCurrentFormData(result.formData);
      setCurrentSearchType(result.searchType);
    }
    setShowSearchForm(false);
  };

  const filteredFlights = filterFlights(currentFlights);
  const { route } = getSearchSummary();

  return (
    <div className="flight-results-page">
      <div className="results-header">
        <h2>Flights</h2>
      </div>
      <SearchBar
        route={route}
        showSearchForm={showSearchForm}
        onToggle={() => setShowSearchForm(!showSearchForm)}
      />
      {showSearchForm && (
        <SearchForm
          onSearch={handleSearch}
          onToggleSearch={() => {}}
          showInResults={true}
        />
      )}
      {error && <div className="error-message">{error}</div>}
      <div className="main-container">
        <Filters
          filters={filters}
          airlines={airlines}
          stopsOptions={stopsOptions}
          timeSlots={timeSlots}
          onFilterChange={handleFilterChange}
        />
        <FlightResultsTable
          flights={filteredFlights}
          onBookNow={handleBookNow}
        />
      </div>
    </div>
  );
}

export default FlightResults;
