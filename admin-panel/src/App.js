import React from 'react'
import EventsPage from './components/EventsPage';
import OfficersPage from './components/OfficersPage';
import { Tabs, Tab } from 'react-bootstrap'

function App() {


  return (
    <Tabs>
      <Tab eventKey="events" title="Events">
        <EventsPage />
      </Tab>
      <Tab eventKey="officers" title="Officers">
        <OfficersPage />
      </Tab>
    </Tabs>
  );
}

export default App;
