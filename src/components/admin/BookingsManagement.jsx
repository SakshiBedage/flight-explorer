import "../../styles/AdminPage.scss";

function BookingsManagement({
  bookings,
  searchTerm,

  filterFlight,
  onSearchChange,

  onFlightChange,
}) {
  return (
    <div className="bookings-section">
      <h3>View Bookings</h3>
      <div className="filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by passenger name or booking ID"
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>

        <div className="filter-group">
          <label>Filter by Flight (IATA):</label>
          <input
            type="text"
            placeholder="e.g., UA789"
            value={filterFlight}
            onChange={onFlightChange}
          />
        </div>
      </div>
      <div className="table-wrapper">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Passenger Name</th>
              <th>Flight</th>
              <th>Total Price</th>
              <th>Booking Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.bookingId}>
                  <td>{booking.bookingId}</td>
                  <td>{booking.passengerDetails.name}</td>
                  <td>
                    {booking.flightDetails.flight.iata} (
                    {booking.flightDetails.departure.iata} to{" "}
                    {booking.flightDetails.arrival.iata})
                  </td>
                  <td>${booking.totalPrice}</td>
                  <td>{new Date(booking.bookingDate).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No bookings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BookingsManagement;
