import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import FlightsManagement from "../admin/FlightsManagement";
import FlightModal from "../admin/FlightModal";
import BookingsManagement from "../admin/BookingsManagement";
import "../../styles/AdminPage.scss";

function AdminPage() {
  const { showNotification } = useContext(AuthContext);
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [flightSearchTerm, setFlightSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [filterFlight, setFilterFlight] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editFlight, setEditFlight] = useState(null);
  const [activeTab, setActiveTab] = useState("flights");

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch("http://localhost:3000/flights", {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error("Failed to fetch flights");

        const data = await response.json();
        setFlights(data);
        setFilteredFlights(data);
      } catch (error) {
        showNotification({
          message: "Error fetching flights.",
          type: "warning",
        });
      }
    };
    fetchFlights();
  }, [showNotification]);

  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings(storedBookings);
    setFilteredBookings(storedBookings);
  }, []);

  useEffect(() => {
    const filtered = flights.filter((flight) => {
      const iata = flight?.flight?.iata?.toLowerCase() || "";
      const airline = flight?.flight?.airline?.toLowerCase() || "";
      const status = flight?.flight?.status || "";

      const matchesSearch =
        iata.includes(flightSearchTerm.toLowerCase()) ||
        airline.includes(flightSearchTerm.toLowerCase());

      const matchesStatus = !filterStatus || status === filterStatus;

      return matchesSearch && matchesStatus;
    });

    setFilteredFlights(filtered);
  }, [flights, flightSearchTerm, filterStatus]);

  useEffect(() => {
    const filtered = bookings.filter((booking) => {
      const name = booking?.passengerDetails?.name?.toLowerCase() || "";
      const bookingId = booking?.bookingId?.toLowerCase() || "";
      const flightIata =
        booking?.flightDetails?.flight?.iata?.toLowerCase() || "";

      const matchesSearch =
        name.includes(searchTerm.toLowerCase()) ||
        bookingId.includes(searchTerm.toLowerCase());

      const matchesFlight =
        !filterFlight || flightIata.includes(filterFlight.toLowerCase());

      return matchesSearch && matchesFlight;
    });

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, filterFlight]);

  const handleCloseModal = () => {
    setShowModal(false);
    setEditFlight(null);
  };

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-header">Admin Dashboard</h2>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "flights" ? "active" : ""}`}
          onClick={() => setActiveTab("flights")}
        >
          Manage Flights
        </button>
        <button
          className={`tab-button ${activeTab === "bookings" ? "active" : ""}`}
          onClick={() => setActiveTab("bookings")}
        >
          View Bookings
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "flights" && (
          <FlightsManagement
            flights={filteredFlights}
            flightSearchTerm={flightSearchTerm}
            filterStatus={filterStatus}
            onSearchChange={(e) => setFlightSearchTerm(e.target.value)}
            onStatusChange={(e) => setFilterStatus(e.target.value)}
            onAddFlight={() => setShowModal(true)}
            setFlights={setFlights}
            setShowModal={setShowModal}
            setEditFlight={setEditFlight}
          />
        )}

        {activeTab === "bookings" && (
          <BookingsManagement
            bookings={filteredBookings}
            searchTerm={searchTerm}
            filterFlight={filterFlight}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onFlightChange={(e) => setFilterFlight(e.target.value)}
          />
        )}
      </div>

      {showModal && (
        <FlightModal
          editFlight={editFlight}
          setFlights={setFlights}
          showNotification={showNotification}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default AdminPage;
