import "../../styles/Filters.scss";

function Filters({
  filters,
  airlines,
  stopsOptions,
  timeSlots,
  onFilterChange,
}) {
  const handleCheckboxChange = (filterKey, value, currentArray) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    onFilterChange(filterKey, newArray);
  };

  return (
    <div className="filters-column">
      <div className="filters">
        <h3>Filters</h3>
        <div className="filter-group">
          <label>Price Range ($)</label>
          <div className="price-range">
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) =>
                onFilterChange("priceRange", [
                  Number(e.target.value),
                  filters.priceRange[1],
                ])
              }
              placeholder="Min"
              min="0"
            />
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) =>
                onFilterChange("priceRange", [
                  filters.priceRange[0],
                  Number(e.target.value),
                ])
              }
              placeholder="Max"
              min="0"
            />
          </div>
        </div>
        <div className="filter-group">
          <label>Airlines</label>
          {airlines.map((airline, index) => (
            <label key={`airline-${index}`} className="checkbox-label">
              <input
                type="checkbox"
                id={`airline-${index}`}
                className={filters.airlines.includes(airline) ? "checked" : ""}
                checked={filters.airlines.includes(airline)}
                onChange={() =>
                  handleCheckboxChange("airlines", airline, filters.airlines)
                }
              />
              {airline}
            </label>
          ))}
        </div>
        <div className="filter-group">
          <label>Stops</label>
          {stopsOptions.map((stop, index) => (
            <label key={`stop-${index}`} className="checkbox-label">
              <input
                type="checkbox"
                id={`stop-${index}`}
                className={filters.stops.includes(stop) ? "checked" : ""}
                checked={filters.stops.includes(stop)}
                onChange={() =>
                  handleCheckboxChange("stops", stop, filters.stops)
                }
              />
              {stop === "0" ? "Non-stop" : stop === "1" ? "1 Stop" : "2+ Stops"}
            </label>
          ))}
        </div>
        <div className="filter-group">
          <label>Departure Time</label>
          {timeSlots.map((slot, index) => (
            <label key={`depTime-${index}`} className="checkbox-label">
              <input
                type="checkbox"
                id={`depTime-${index}`}
                className={filters.depTimeSlots.includes(slot) ? "checked" : ""}
                checked={filters.depTimeSlots.includes(slot)}
                onChange={() =>
                  handleCheckboxChange(
                    "depTimeSlots",
                    slot,
                    filters.depTimeSlots
                  )
                }
              />
              {slot.charAt(0).toUpperCase() + slot.slice(1)}
            </label>
          ))}
        </div>
        <div className="filter-group">
          <label>Arrival Time</label>
          {timeSlots.map((slot, index) => (
            <label key={`arrTime-${index}`} className="checkbox-label">
              <input
                type="checkbox"
                id={`arrTime-${index}`}
                className={filters.arrTimeSlots.includes(slot) ? "checked" : ""}
                checked={filters.arrTimeSlots.includes(slot)}
                onChange={() =>
                  handleCheckboxChange(
                    "arrTimeSlots",
                    slot,
                    filters.arrTimeSlots
                  )
                }
              />
              {slot.charAt(0).toUpperCase() + slot.slice(1)}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Filters;
