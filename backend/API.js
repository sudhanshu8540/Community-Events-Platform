import { useEffect, useState } from 'react';

function EventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => setEvents(data));
  }, []);

  return (
    <div>
      {events.map(event => (
        <div key={event._id}>{event.title}</div>
      ))}
    </div>
  );
}