import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FlightSummary from "./FlightSummary";
import PassengerForm from "./PassengerForm";
import BookingPreview from "./BookingPreview";
import TotalPrice from "./TotalPrice";
import ActionButtons from "./ActionButtons";
import "../../styles/BookingDetails.scss";

function BookingDetails() {
  const { flightId } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);
  const [passengerData, setPassengerData] = useState({
    name: "",
    email: "",
    phone: "",
    passengers: 1,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/flights/${flightId}`
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error("Flight not found");
        }
        setFlight(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load flight details. Please try again.");
        setLoading(false);
      }
    };
    fetchFlight();
  }, [flightId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPassengerData({ ...passengerData, [name]: value });
    setError("");
  };

  const validateForm = () => {
    if (!passengerData.name.trim()) {
      return "Please enter your full name.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(passengerData.email)) {
      return "Please enter a valid email address.";
    }
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(passengerData.phone)) {
      return "Please enter a valid 10-digit phone number.";
    }
    if (
      passengerData.passengers < 1 ||
      passengerData.passengers > (flight?.seats.available || 0)
    ) {
      return `Number of passengers must be between 1 and ${
        flight?.seats.available || 0
      }.`;
    }
    return true;
  };

  const simulatePayment = () => {
    return Math.random() < 0.7;
  };

  const handlePayment = async () => {
    const validationResult = validateForm();
    if (validationResult !== true) {
      setError(validationResult);
      return;
    }

    setPaymentLoading(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const paymentSuccess = simulatePayment();

    if (paymentSuccess) {
      const bookingId = `BOOK-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;
      const bookingDetails = {
        bookingId,
        flightId,
        flightDetails: flight,
        passengerDetails: passengerData,
        totalPrice: flight.price * passengerData.passengers,
        bookingDate: new Date().toISOString(),
      };

      const existingBookings = JSON.parse(
        localStorage.getItem("bookings") || "[]"
      );
      localStorage.setItem(
        "bookings",
        JSON.stringify([...existingBookings, bookingDetails])
      );

      navigate(`/confirmation/${bookingId}`);
    } else {
      setError("Payment failed. Please try again.");
    }

    setPaymentLoading(false);
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel this booking? Your details will not be saved."
      )
    ) {
      navigate("/results");
    }
  };

  const calculateDuration = (departure, arrival) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diffMs = arr - dep;
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="booking-details-container">
        <div className="loading-spinner">Loading flight details...</div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="booking-details-container">
        <div className="error-message">Flight not found.</div>
      </div>
    );
  }

  const duration = calculateDuration(
    flight.departure.scheduled,
    flight.arrival.scheduled
  );

  return (
    <div className="booking-details-container">
      <h2 className="booking-header">Booking Details</h2>
      <div className="details-passenger-container">
        <FlightSummary flight={flight} duration={duration} />
        <PassengerForm
          passengerData={passengerData}
          flight={flight}
          error={error}
          onInputChange={handleInputChange}
          setPassengerData={setPassengerData}
        />
      </div>
      <BookingPreview passengerData={passengerData} flight={flight} />
      <TotalPrice price={flight.price} passengers={passengerData.passengers} />
      <ActionButtons
        onPay={handlePayment}
        onCancel={handleCancel}
        paymentLoading={paymentLoading}
      />
    </div>
  );
}

export default BookingDetails;
