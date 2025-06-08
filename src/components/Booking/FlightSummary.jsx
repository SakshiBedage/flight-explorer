import "../../styles/BookingDetails.scss";

function FlightSummary({ flight, duration }) {
  return (
    <div className="flight-card">
      <h3>Flight Summary</h3>
      <div className="flight-info">
        <span className="icon">✈️</span>
        <p>
          <strong>Flight:</strong> {flight.flight.iata} ({flight.flight.airline}
          )
        </p>
      </div>
      <div className="flight-info">
        <span className="icon">🛫</span>
        <p>
          <strong>Departure:</strong>{" "}
          {new Date(flight.departure.scheduled).toLocaleString()} (
          {flight.departure.iata})
        </p>
      </div>
      <div className="flight-info">
        <span className="icon">🛬</span>
        <p>
          <strong>Arrival:</strong>{" "}
          {new Date(flight.arrival.scheduled).toLocaleString()} (
          {flight.arrival.iata})
        </p>
      </div>
      <div className="flight-info">
        <span className="icon">⏱️</span>
        <p>
          <strong>Duration:</strong> {duration}
        </p>
      </div>
      <div className="flight-info">
        <span className="icon">💵</span>
        <p>
          <strong>Price per Passenger:</strong> ${flight.price}
        </p>
      </div>
      <div className="flight-info seats-remaining">
        <span className="icon">🪑</span>
        <p>
          <strong>Seats Available:</strong> {flight.seats.available} left!
        </p>
      </div>
    </div>
  );
}

export default FlightSummary;
