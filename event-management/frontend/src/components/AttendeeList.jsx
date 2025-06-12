export default function AttendeeList({ attendees }) {
  if (!attendees) return null;

  return (
    <div className="mt-4 p-3 bg-gray-100 rounded">
      <h3 className="font-semibold mb-2">Attendees:</h3>
      {attendees.length === 0 ? (
        <p>No attendees yet.</p>
      ) : (
        <ul className="list-disc ml-6">
          {attendees.map((a) => (
            <li key={a._id}>
              {a.name} ({a.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
