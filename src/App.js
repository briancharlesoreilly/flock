import "./style/sass/App.scss";
import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
// import {useParams} from 'react-router-dom'
// import axios from "axios";
import { getDatabase, ref, onValue } from "firebase/database";

import firebase from "./components/firebase";

// components
import AllEvents from "./components/AllEvents";
import EventDetails from "./components/EventDetails";
import PersonalHub from "./components/PersonalHub";
import PersonalEvent from "./components/PersonalEvent";
import DatePicker from "react-date-picker";


function App() {

  // Lets mutate the Date data immediately
  

  const [location, setLocation] = useState("New York")
  const [dateValue, setDateValue] = useState(new Date());
  const [dateEndValue, setDateEndValue] = useState(new Date());
  const [toggleApi, setToggleApi] = useState(false)
  const [status, setStatus] = useState([])
  const [eventType, setEventType] = useState("")


  const handleSubmit = (event) => {
    event.preventDefault();
    setToggleApi(!toggleApi);
  };

  useEffect(() => {
    const database = getDatabase(firebase);
    const dbRef = ref(database);
    onValue(dbRef, (response) => {
      const newState = [];
      const data = response.val();
      for (let key in data) {
        newState.push(data[key]);
      }
      setStatus(newState);
    });
  }, []);

  return (
    <div className="App">
      <header>
        <nav>
          <form className="form" onSubmit={handleSubmit}>
            <label>
              <p className="searchLabelText">Location</p>
              <input
                type="text"
                className="search"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="city, country, etc"
              />
            </label>

            <label>
              <p className="searchLabelText">Start Date</p>
              <DatePicker

              closeCalendar={false}
              name="datePicker"
              id="datePicker"
              value={dateValue}
              onChange={setDateValue}
              />
              <p>End Date</p>
              <DatePicker
              closeCalendar={false}
              name="datePicker"
              id="datePicker"
              value={dateEndValue}
              onChange={setDateEndValue}
              />
            </label>

            <label onChange={(e) => setEventType(e.target.value)}>
              <p>Event Type</p>
              <div className="radioEventList">
                <label htmlFor="allEvents">All Events</label>
                <input type="radio" name="eventChoice" id="allEvents" value=""/>

                <label htmlFor="sports">Sports</label>
                <input type="radio" name="eventChoice" id="sports" value="Sports"/>

                <label htmlFor="music">Music</label>
                <input type="radio" name="eventChoice" id="music" value="Music" />

                <label htmlFor="artsTheatre">Arts & Theatre</label>
                <input type="radio" name="eventChoice" id="artsTheatre" value="Art"/>
              </div>
            </label>

            <input className="submit" type="submit" />
          </form>
          <Link to="/">Home</Link>
          <Link to="/personalhub">
            <p>{status.length}</p>
          </Link>
        </nav>
      </header>
     
     <Routes>
        <Route path="/" 
        element={
        <AllEvents 
        location={location} 
        eventType={eventType}
        dateValue={dateValue}
        dateEndValue={dateEndValue}
        toggleApi={toggleApi} />} />

        <Route path="/event/:eventID" element={<EventDetails />} />
        <Route path="/personal/:personalID" element={<PersonalEvent />} />

        <Route path="/personalhub" element={<PersonalHub />} />
      </Routes>
    </div>
  );
}

export default App;
