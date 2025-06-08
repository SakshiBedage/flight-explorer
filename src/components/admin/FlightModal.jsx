import { useState } from "react";

function FlightModal({ editFlight, setFlights, showNotification, onClose }) {
  const [newFlight, setNewFlight] = useState(
    editFlight
      ? {
          flight: {
            iata: editFlight.flight.iata,
            airline: editFlight.flight.airline,
            status: editFlight.flight.status,
          },
          departure: {
            iata: editFlight.departure.iata,
            scheduled: editFlight.departure.scheduled,
          },
          arrival: {
            iata: editFlight.arrival.iata,
            scheduled: editFlight.arrival.scheduled,
          },
          price: editFlight.price,
          seats: { available: editFlight.seats.available },
        }
      : {
          flight: { iata: "", airline: "", status: "Scheduled" },
          departure: { iata: "", scheduled: "" },
          arrival: { iata: "", scheduled: "" },
          price: "",
          seats: { available: "" },
        }
  );

  const handleInputChange = (e, nestedKey, subKey) => {
    const { name, value } = e.target;
    if (nestedKey && subKey) {
      setNewFlight((prev) => ({
        ...prev,
        [nestedKey]: { ...prev[nestedKey], [subKey]: value },
      }));
    } else {
      setNewFlight((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveFlight = async () => {
    const flightData = {
      flight: {
        iata: newFlight.flight.iata,
        airline: newFlight.flight.airline,
        status: newFlight.flight.status,
      },
      departure: {
        iata: newFlight.departure.iata,
        scheduled: newFlight.departure.scheduled,
      },
      arrival: {
        iata: newFlight.arrival.iata,
        scheduled: newFlight.arrival.scheduled,
      },
      price: parseFloat(newFlight.price),
      seats: {
        available: parseInt(newFlight.seats.available),
      },
    };

    try {
      if (editFlight) {
        const response = await fetch(
          `http://localhost:3000/flights/${editFlight.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(flightData),
          }
        );
        if (response.ok) {
          setFlights((prev) =>
            prev.map((f) =>
              f.id === editFlight.id ? { ...flightData, id: editFlight.id } : f
            )
          );
          showNotification({
            message: "Flight updated successfully.",
            type: "success",
          });
        } else {
          throw new Error("Failed to update flight");
        }
      } else {
        const response = await fetch("http://localhost:3000/flights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(flightData),
        });
        if (!response.ok) {
          throw new Error("Failed to add flight");
        }
        const addedFlight = await response.json();
        setFlights((prev) => [...prev, addedFlight]);
        showNotification({
          message: "Flight added successfully.",
          type: "success",
        });
      }
    } catch (error) {
      console.error("Error saving flight:", error);
      showNotification({
        message: "Error saving flight.",
        type: "warning",
      });
    } finally {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{editFlight ? "Edit Flight" : "Add Flight"}</h3>
        <div className="modal-form">
          <div className="form-group">
            <label>Flight Number (IATA)</label>
            <input
              type="text"
              name="iata"
              value={newFlight.flight.iata}
              onChange={(e) => handleInputChange(e, "flight", "iata")}
              placeholder="e.g., UA789"
            />
          </div>
          <div className="form-group">
            <label>Airline</label>
            <input
              type="text"
              name="airline"
              value={newFlight.flight.airline}
              onChange={(e) => handleInputChange(e, "flight", "airline")}
              placeholder="e.g., United Airlines"
            />
          </div>
          <div className="form-group">
            <label>Departure Airport (IATA)</label>
            <input
              type="text"
              name="iata"
              value={newFlight.departure.iata}
              onChange={(e) => handleInputChange(e, "departure", "iata")}
              placeholder="e.g., PNQ"
            />
          </div>
          <div className="form-group">
            <label>Departure Time</label>
            <input
              type="datetime-local"
              name="scheduled"
              value={newFlight.departure.scheduled}
              onChange={(e) => handleInputChange(e, "departure", "scheduled")}
            />
          </div>
          <div className="form-group">
            <label>Arrival Airport (IATA)</label>
            <input
              type="text"
              name="iata"
              value={newFlight.arrival.iata}
              onChange={(e) => handleInputChange(e, "arrival", "iata")}
              placeholder="e.g., BOM"
            />
          </div>
          <div className="form-group">
            <label>Arrival Time</label>
            <input
              type="datetime-local"
              name="scheduled"
              value={newFlight.arrival.scheduled}
              onChange={(e) => handleInputChange(e, "arrival", "scheduled")}
            />
          </div>
          <div className="form-group">
            <label>Price ($)</label>
            <input
              type="number"
              name="price"
              value={newFlight.price}
              onChange={handleInputChange}
              placeholder="e.g., 300"
            />
          </div>
          <div className="form-group">
            <label>Seats Available</label>
            <input
              type="number"
              name="available"
              value={newFlight.seats.available}
              onChange={(e) => handleInputChange(e, "seats", "available")}
              placeholder="e.g., 5"
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={newFlight.flight.status}
              onChange={(e) => handleInputChange(e, "flight", "status")}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Delayed">Delayed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="modal-buttons">
          <button className="save-button" onClick={handleSaveFlight}>
            Save
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default FlightModal;
