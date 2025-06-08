import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import DeleteConfirmation from "./DeleteConfirmation";
import Notification from "../Shared/Notification";

function FlightsManagement({
  flights,
  flightSearchTerm,
  filterStatus,
  onSearchChange,
  onStatusChange,
  onAddFlight,
  setFlights,
  setShowModal,
  setEditFlight,
}) {
  const { notification, showNotification, closeNotification } =
    useContext(AuthContext);
  const [flightToDelete, setFlightToDelete] = useState(null);
  const [deletingFlightId, setDeletingFlightId] = useState(null);

  const handleDeleteFlight = async (id) => {
    setDeletingFlightId(id);
    try {
      setFlights((prev) => prev.filter((f) => f.id !== id));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`http://localhost:3000/flights/${id}`, {
        method: "DELETE",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to delete flight");
      }
    } catch (error) {
      try {
        const response = await fetch("http://localhost:3000/flights");
        const data = await response.json();
        setFlights(data);
      } catch {}
      showNotification({
        message: "Error deleting flight.",
        type: "warning",
      });
    } finally {
      setDeletingFlightId(null);
    }
  };

  const handleEditFlight = (flight) => {
    setEditFlight(flight);
    setShowModal(true);
  };

  const handleRequestDelete = (flightId) => {
    setFlightToDelete(flightId);
  };

  const handleConfirmDelete = async () => {
    if (flightToDelete) {
      try {
        await handleDeleteFlight(flightToDelete);
        showNotification({
          message: "Flight deleted successfully.",
          type: "success",
        });
      } catch (error) {
        console.error("Error in handleConfirmDelete:", error);
      } finally {
        setFlightToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setFlightToDelete(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? "Invalid Date" : date.toLocaleString();
  };

  return (
    <div className="flights-section">
      <h3>Manage Flights</h3>

      {notification?.show && (
        <Notification
          notification={notification}
          closeNotification={closeNotification}
        />
      )}

      <div className="filters">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by flight number or airline"
            value={flightSearchTerm}
            onChange={onSearchChange}
          />
        </div>
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select value={filterStatus} onChange={onStatusChange}>
            <option value="">All</option>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="queued">Queued</option>
          </select>
        </div>
      </div>

      <button className="add-flight-button" onClick={onAddFlight}>
        Add Flight
      </button>

      <div className="table-wrapper">
        <table className="flights-table">
          <thead>
            <tr>
              <th>Flight Number</th>
              <th>Airline</th>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Price</th>
              <th>Seats Available</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.length > 0 ? (
              flights.map((flight) => (
                <tr key={flight.id}>
                  <td>{flight.flight.iata}</td>
                  <td>{flight.flight.airline}</td>
                  <td>
                    {formatDate(flight.departure.scheduled)} (
                    {flight.departure.iata})
                  </td>
                  <td>
                    {formatDate(flight.arrival.scheduled)} (
                    {flight.arrival.iata})
                  </td>
                  <td>${flight.price}</td>
                  <td>{flight.seats.available}</td>
                  <td>{flight.flight.status}</td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => handleEditFlight(flight)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleRequestDelete(flight.id)}
                      disabled={deletingFlightId === flight.id}
                    >
                      {deletingFlightId === flight.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No flights found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {flightToDelete && (
        <DeleteConfirmation
          flightId={flightToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}

export default FlightsManagement;
