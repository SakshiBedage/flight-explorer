import "../../styles/BookingDetails.scss";

function PassengerForm({
  passengerData,
  flight,
  error,
  onInputChange,
  setPassengerData,
}) {
  return (
    <div className="passenger-form-card">
      <h3>Passenger Details</h3>
      {error && <div className="error-message">{error}</div>}
      <div className="form-grid">
        <div className="form-group">
          <label>
            <span className="form-icon">👤</span> Full Name
          </label>
          <input
            type="text"
            name="name"
            value={passengerData.name}
            onChange={onInputChange}
            placeholder="Enter your full name"
          />
        </div>
        <div className="form-group">
          <label>
            <span className="form-icon">📧</span> Email
          </label>
          <input
            type="email"
            name="email"
            value={passengerData.email}
            onChange={onInputChange}
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label>
            <span className="form-icon">📞</span> Phone Number
          </label>
          <input
            type="text"
            name="phone"
            value={passengerData.phone}
            onChange={onInputChange}
            placeholder="Enter your 10-digit phone number"
          />
        </div>
        <div className="form-group">
          <label>
            <span className="form-icon">👥</span> Number of Passengers
          </label>
          <input
            type="number"
            name="passengers"
            value={passengerData.passengers}
            onChange={(e) =>
              setPassengerData({
                ...passengerData,
                passengers: Number(e.target.value),
              })
            }
            min="1"
            max={flight.seats.available}
          />
        </div>
      </div>
    </div>
  );
}

export default PassengerForm;
