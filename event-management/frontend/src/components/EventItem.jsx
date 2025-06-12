import { useState } from "react";
import AttendeeList from "./AttendeeList";

export default function EventItem({
  event,
  user,
  handleRegister,
  fetchAttendees,
  attendees
}) {
  const isOwner = String(event.user?._id || event.user) === String(user?._id);
  const [showAttendees, setShowAttendees] = useState(false);

  const handleToggleAttendees = () => {
    if (!showAttendees && !attendees) {
      fetchAttendees(event._id);
    }
    setShowAttendees(!showAttendees);
  };

  return (
    <li className="p-4 border rounded shadow-md bg-white">
      <h3 className="text-lg font-bold text-gray-800">{event.title}</h3>
      <p className="text-gray-700">{event.description}</p>
      <p className="text-sm text-gray-500">
        📅 Date: {new Date(event.date).toLocaleDateString('en-GB')}
      </p>
      <p className="text-sm text-gray-500">📍 Location: {event.location}</p>
      <p className="text-sm text-gray-600">
        🎟️ {event.attendees?.length || 0} attendees
      </p>

      {/* Button Row with spacing */}
      <div className="flex gap-3 mt-3 flex-wrap">
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
          onClick={handleToggleAttendees}
        >
          {showAttendees ? "Hide Attendees" : "View Attendees"}
        </button>

        {!isOwner && (
          <button
            onClick={() => handleRegister(event._id)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
          >
            Register
          </button>
        )}
      </div>

      {showAttendees && attendees && (
        <div className="mt-2">
          <AttendeeList attendees={attendees} />
        </div>
      )}
    </li>
  );
}
