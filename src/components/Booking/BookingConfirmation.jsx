import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/BookingConfirmation.scss";

function BookingConfirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    const foundBooking = bookings.find((b) => b.bookingId === bookingId);
    if (foundBooking) {
      setBooking(foundBooking);
    } else {
      navigate("/search");
    }
  }, [bookingId, navigate]);

  const handleDownloadPDF = () => {
    console.log("Downloading PDF for booking:", bookingId);
    alert("PDF download simulated! Check console for details.");
  };

  if (!booking) {
    return (
      <div className="confirmation-container">Loading confirmation...</div>
    );
  }

  const { flightDetails, passengerDetails, totalPrice, bookingDate } = booking;

  return (
    <div className="confirmation-container">
      <h2 className="confirmation-header">Booking Confirmation</h2>
      <div className="confirmation-message">
        <p>Your booking is confirmed! Thank you for choosing us.</p>
      </div>
      <div className="confirmation-details-card">
        <h3>Booking ID: {bookingId}</h3>
        <p>
          <strong>Booking Date:</strong>{" "}
          {new Date(bookingDate).toLocaleString()}
        </p>
        <hr className="section-divider" />
        <h3>Flight Details</h3>
        <div className="flight-info">
          <span className="icon">✈️</span>
          <p>
            <strong>Flight:</strong> {flightDetails.flight.iata} (
            {flightDetails.flight.airline})
          </p>
        </div>
        <div className="flight-info">
          <span className="icon">🛫</span>
          <p>
            <strong>Departure:</strong>{" "}
            {new Date(flightDetails.departure.scheduled).toLocaleString()} (
            {flightDetails.departure.iata})
          </p>
        </div>
        <div className="flight-info">
          <span className="icon">🛬</span>
          <p>
            <strong>Arrival:</strong>{" "}
            {new Date(flightDetails.arrival.scheduled).toLocaleString()} (
            {flightDetails.arrival.iata})
          </p>
        </div>
        <div className="flight-info">
          <span className="icon">📊</span>
          <p>
            <strong>Status:</strong> {flightDetails.flight.status}
          </p>
        </div>
        <hr className="section-divider" />
        <h3>Passenger Details</h3>
        <div className="passenger-info">
          <span className="icon">👤</span>
          <p>
            <strong>Name:</strong> {passengerDetails.name}
          </p>
        </div>
        <div className="passenger-info">
          <span className="icon">📧</span>
          <p>
            <strong>Email:</strong> {passengerDetails.email}
          </p>
        </div>
        <div className="passenger-info">
          <span className="icon">📞</span>
          <p>
            <strong>Phone:</strong> {passengerDetails.phone}
          </p>
        </div>
        <div className="passenger-info">
          <span className="icon">👥</span>
          <p>
            <strong>Number of Passengers:</strong> {passengerDetails.passengers}
          </p>
        </div>
        <hr className="section-divider" />
        <h3>Total Price: ${totalPrice}</h3>
      </div>
      <div className="action-buttons">
        <button className="download-pdf-button" onClick={handleDownloadPDF}>
          Download PDF
        </button>
        <button
          className="back-to-search-button"
          onClick={() => navigate("/search")}
        >
          Back to Search
        </button>
      </div>
    </div>
  );
}

export default BookingConfirmation;
