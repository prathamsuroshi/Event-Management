import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../Utils/axiosConfig";
import CreateEventForm from "./CreateEventForm";
import EventItem from "./EventItem";
import Pagination from "./Pagination";

export default function Dashboard() {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [attendeesMap, setAttendeesMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
const [dateFilter, setDateFilter] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    axios
      .get("/api/protected")
      .then((res) => setMessage(res.data.message))
      .catch((err) => {
        setMessage("Unauthorized. Redirecting to login...");
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }, 2000);
      });

    fetchEvents();
  }, [navigate]);




const fetchEvents = ( page = 1, limit = 5) => {
  let query = `?search=${searchTerm}&page=${page}&limit=${limit}`;
  if (locationFilter) query += `&location=${locationFilter}`;
  if (dateFilter) query += `&date=${dateFilter}`;

  axios
    .get(`/api/events${query}`)
    .then((res) => {
      setEvents(res.data.events);           
      setCurrentPage(res.data.currentPage); 
      setTotalPages(res.data.totalPages);   
    })
    .catch((err) => {
      console.error("Error fetching events", err);
      setEvents([]);
    });
};


const fetchAttendees = async (eventId) => {
  try {
    const res = await axios.get(`/api/events/${eventId}/attendees`);
    setAttendeesMap((prev) => ({
      ...prev,
      [eventId]: res.data.attendees
    }));
  } catch (err) {
    console.error("Error fetching attendees", err);
    alert("Could not load attendees.");
  }
};


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (eventId) => {
  try {
    const res = await axios.post(`/api/events/${eventId}/register`);
    alert(res.data.message || "Registered successfully!");
    fetchEvents()
  } catch (err) {
    console.error("Error registering for event:", err);
    const msg = err?.response?.data?.message || "Failed to register.";
    alert(msg);
  }
};

useEffect(() => {
  // console.log("SearchTerm changed to:", searchTerm);
}, [searchTerm]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       const res = await axios.post("/api/events", formData);
    const newEvent = res.data.event;

setEvents((prevEvents) => Array.isArray(prevEvents) ? [...prevEvents, newEvent] : [newEvent]); 
    setFormData({ title: "", description: "", date: "" ,location: ""}); 
  } catch (err) {
    console.error("Error creating event", err);
  }
};


 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name || "User"}!
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </div>

      
      <CreateEventForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />

      
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchEvents(1);
        }}
        className="mb-6 bg-gray-50 p-4 rounded-lg shadow-inner space-y-3"
      >
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder="Filter by location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full transition"
        >
          Search
        </button>
      </form>

     
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">All Upcoming Events</h2>
        {Array.isArray(events) && events.length === 0 ? (
          <p className="text-gray-500">No matching events found.</p>
        ) : (
          <ul className="space-y-4">
            {events.map((event) => (
              <EventItem
                key={event._id}
                event={event}
                user={user}
                handleRegister={handleRegister}
                fetchAttendees={fetchAttendees}
                attendees={attendeesMap[event._id]}
              />
            ))}
          </ul>
        )}
      </div>

    
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) =>
          fetchEvents( page)
        }
      />
    </div>
  </div>
);
}