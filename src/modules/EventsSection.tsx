import React from 'react';

const mockEvents = [
  { id: 1, title: 'Live: Lobster Boil with Chef Freddie', time: 'Tomorrow 6pm' },
  { id: 2, title: 'Q&A: Chowder Secrets', time: 'Saturday 2pm' },
];

const EventsSection = () => (
  <div className="events-section bg-weatheredWhite p-4 rounded shadow mb-6">
    <h3 className="font-bold text-lg mb-2 text-maineBlue">Upcoming Events</h3>
    <ul className="space-y-2">
      {mockEvents.map(e => (
        <li key={e.id} className="flex flex-col bg-sand p-2 rounded">
          <span className="font-semibold">{e.title}</span>
          <span className="text-xs text-gray-500">{e.time}</span>
          <button className="mt-1 w-max bg-seafoam text-maineBlue px-3 py-1 rounded text-xs font-bold">RSVP</button>
        </li>
      ))}
    </ul>
  </div>
);

export default EventsSection;
