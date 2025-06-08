import "../../styles/BookingDetails.scss";

function BookingPreview({ passengerData, flight }) {
  return (
    <div className="booking-preview-card">
      <h3>Booking Preview</h3>
      <div className="preview-item">
        <span className="icon">👤</span>
        <p>
          <strong>Passenger Name:</strong>{" "}
          {passengerData.name || "Not provided"}
        </p>
      </div>
      <div className="preview-item">
        <span className="icon">📧</span>
        <p>
          <strong>Email:</strong> {passengerData.email || "Not provided"}
        </p>
      </div>
      <div className="preview-item">
        <span className="icon">👥</span>
        <p>
          <strong>Number of Passengers:</strong> {passengerData.passengers}
        </p>
      </div>
      <div className="preview-item">
        <span className="icon">✈️</span>
        <p>
          <strong>Flight:</strong> {flight.flight.iata} ({flight.departure.iata}{" "}
          to {flight.arrival.iata})
        </p>
      </div>
    </div>
  );
}

export default BookingPreview;
