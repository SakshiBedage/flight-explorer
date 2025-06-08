import "../../styles/FlightResultsTable.scss";

function FlightResultsTable({ flights, onBookNow }) {
  return (
    <div className="results-column">
      <div className="flight-results">
        <h3>Search Results ({flights.length} flights)</h3>
        {flights.length === 0 ? (
          <p>No flights match your filters.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Flight</th>
                  <th>Airline</th>
                  <th>Departure</th>
                  <th>Arrival</th>
                  <th>Stops</th>
                  <th>Price</th>
                  <th>Seats Available</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight) => (
                  <tr key={flight.id}>
                    <td>{flight.flight.iata}</td>
                    <td>{flight.flight.airline}</td>
                    <td>
                      {new Date(flight.departure.scheduled).toLocaleString()} (
                      {flight.departure.iata})
                    </td>
                    <td>
                      {new Date(flight.arrival.scheduled).toLocaleString()} (
                      {flight.arrival.iata})
                    </td>
                    <td>
                      {flight.flight.stops === 0
                        ? "Non-stop"
                        : `${flight.flight.stops} Stop${
                            flight.flight.stops > 1 ? "s" : ""
                          } (${flight.flight.layovers?.join(", ")})`}
                    </td>
                    <td>${flight.price}</td>
                    <td>{flight.seats.available}</td>
                    <td>{flight.flight.status}</td>
                    <td>
                      <button
                        className="book-now-button"
                        onClick={() => onBookNow(flight.id)}
                        disabled={flight.seats.available === 0}
                      >
                        Book Now
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default FlightResultsTable;
