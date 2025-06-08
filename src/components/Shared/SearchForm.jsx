import { useState } from "react";
import "../../styles/Search.scss";

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

function SearchForm({ onSearch, onToggleSearch, showInResults = false }) {
  const [searchType, setSearchType] = useState("one-way");
  const [formData, setFormData] = useState({
    segments: [{ departure: "", arrival: "", date: "" }],
    returnDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 

  const addSegment = () => {
    if (formData.segments.length < 3) {
      setFormData({
        ...formData,
        segments: [
          ...formData.segments,
          { departure: "", arrival: "", date: "" },
        ],
      });
    }
  };

  const removeSegment = (index) => {
    setFormData({
      ...formData,
      segments: formData.segments.filter((_, i) => i !== index),
    });
  };

  const handleSegmentChange = (index, field, value) => {
    const newSegments = [...formData.segments];
    const iataValue = value.match(/\(([^)]+)\)/)?.[1] || value.toUpperCase();
    newSegments[index][field] = iataValue;
    setFormData({ ...formData, segments: newSegments });
    setError(""); 
  };

  const validateSegment = (segment, index) => {
    const iataRegex = /^[A-Z]{3}$/;
    if (!segment.departure || !segment.arrival || !segment.date) {
      return `Please fill in all fields for segment ${
        index + 1
      } (From, To, Departure Date).`;
    }
    if (
      !iataRegex.test(segment.departure) ||
      !iataRegex.test(segment.arrival)
    ) {
      return `Please select a valid airport for segment ${index + 1}.`;
    }
    const selectedDate = new Date(segment.date);
    const minDate = new Date("2025-06-17");
    if (selectedDate < minDate) {
      return `Departure date for segment ${
        index + 1
      } must be on or after June 17, 2025.`;
    }
    if (segment.departure === segment.arrival) {
      return `Departure and arrival airports for segment ${
        index + 1
      } must be different.`;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { segments } = formData;

    for (let i = 0; i < segments.length; i++) {
      const validationResult = validateSegment(segments[i], i);
      if (validationResult !== true) {
        setError(validationResult);
        return;
      }
    }

    setError(""); 
    setLoading(true);
    try {
      let results = [];
      for (const segment of segments) {
        const queryParams = new URLSearchParams({
          "departure.iata": segment.departure,
          "arrival.iata": segment.arrival,
          "departure.scheduled_like": segment.date,
        });
        const response = await fetch(
          `http://localhost:3000/flights?${queryParams}`
        );
        const data = await response.json();
        if (!response.ok) {
          if (response.status === 404) {
            onSearch({
              error: `No flights found for the route ${
                iataToPlace[segment.departure]
              } to ${iataToPlace[segment.arrival]} on ${segment.date}.`,
            });
            return;
          }
          throw new Error(`API error: ${response.status}`);
        }
        results = [...results, ...data];
      }

      if (results.length === 0) {
        onSearch({
          error:
            "No flights found matching your criteria. Please try different dates or routes.",
        });
      } else {
        results.sort((a, b) => a.price - b.price);
        onSearch({ flights: results, formData, searchType });
        if (!showInResults) {
          onToggleSearch(false);
        }
      }
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        onSearch({
          error:
            "Network error: Unable to connect to the flight server. Please check your internet connection.",
        });
      } else {
        onSearch({
          error:
            "An unexpected error occurred while fetching flights. Please try again later.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setError(""); 
    if (type === "multi-city") {
      setFormData({
        segments: [
          { departure: "", arrival: "", date: "" },
          { departure: "", arrival: "", date: "" },
        ],
        returnDate: "",
      });
    } else {
      setFormData({
        segments: [{ departure: "", arrival: "", date: "" }],
        returnDate: "",
      });
    }
  };

  return (
    <div
      className={`search-form-container ${showInResults ? "in-results" : ""}`}
    >
      <h2>Flight Search</h2>
      <div className="search-tabs">
        {searchType === "one-way" ? (
          <span onClick={() => handleSearchTypeChange("multi-city")}>
            Create Multi-City Route
          </span>
        ) : (
          <span onClick={() => handleSearchTypeChange("one-way")}>
            Switch to One-Way Trip
          </span>
        )}
      </div>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="search-form">
        {formData.segments.map((segment, index) => (
          <div key={index} className="segment">
            <div className="form-group">
              <label>From</label>
              <select
                value={iataToPlace[segment.departure] || ""}
                onChange={(e) =>
                  handleSegmentChange(index, "departure", e.target.value)
                }
              >
                <option value="">Select Departure</option>
                {Object.values(iataToPlace).map((place, idx) => (
                  <option key={idx} value={place}>
                    {place}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>To</label>
              <select
                value={iataToPlace[segment.arrival] || ""}
                onChange={(e) =>
                  handleSegmentChange(index, "arrival", e.target.value)
                }
              >
                <option value="">Select Arrival</option>
                {Object.values(iataToPlace).map((place, idx) => (
                  <option key={idx} value={place}>
                    {place}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Departure Date</label>
              <input
                type="date"
                value={segment.date}
                onChange={(e) =>
                  handleSegmentChange(index, "date", e.target.value)
                }
                min="2025-06-17"
              />
            </div>
            {searchType === "multi-city" && formData.segments.length >= 3 && (
              <button
                type="button"
                className="remove-segment"
                onClick={() => removeSegment(index)}
              >
                Delete
              </button>
            )}
          </div>
        ))}
        {searchType === "multi-city" && formData.segments.length < 3 && (
          <button type="button" className="add-segment" onClick={addSegment}>
            Add Another Flight
          </button>
        )}
        <button type="submit" className="search-button" disabled={loading}>
          {loading ? "Searching..." : "Search Flights"}
        </button>
      </form>
    </div>
  );
}

export default SearchForm;
