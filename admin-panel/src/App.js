import React, { useState, useEffect } from 'react'
import axios from 'axios';

function App() {

  const [events, setEvents] = useState(null)

  useEffect(() => {
    axios
      .get("/api/events")
      .then((events) => { console.log(events); return events })
      .then((events) => setEvents(events.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      {events === null ? (
        <p>Loading...</p>
      ) : (
          events.map((event, index) => {
            return (
              <div key={index}>
                <h1>
                  {event.title}
                </h1>
                <h3 >
                  {event.date}
                </h3>
                <div>
                  <p>{event.description}</p>
                </div>
              </div>
            )
          }
          ))}
    </div>
  );
}

export default App;
