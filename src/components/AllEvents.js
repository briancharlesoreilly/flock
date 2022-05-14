import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import failedEventCall from "./failedEventCall";


const AllEvents = ({location, toggleApi, eventType, dateValue, dateEndValue}) => {

  const [events, setEvents] = useState([])

  const dateFunction = (userDate, defaultTime) => {
    const todaysDate = userDate
    const altDate = todaysDate.toISOString();
    const newDate = altDate.replace(/[/]/g, "-");
    const shortDate = newDate.substring(0,newDate.indexOf("T"));
    const finalDate = `${shortDate}${defaultTime}`; 
    return finalDate.toString();
  }
  useEffect(() => {
  
  const ourStart = dateFunction(dateValue, "T23:00:00Z")
  const ourEnd = dateFunction(dateEndValue, "T23:59:59Z")

  console.log("Event Type", eventType)


    const configTicket = {
      method: "get",
      url: `https://app.ticketmaster.com/discovery/v2/events`,
      params: {
        apikey: "NJCKlZmMAiwCVsFMlf33AlMF11d5iusP",
        city: location,
        classificationName: eventType,
        startDateTime: ourStart,
        endDateTime: ourEnd,
        size: "100",
        sort: "random"
      },
    };
    axios(configTicket)
      .then(function (response) {
        const results = response.data._embedded.events;
        console.log("results", results);
        setEvents(response.data._embedded.events);
      })
      .catch(function (error) {
        console.log(error);
        // if we catch an error, clear events array
        setEvents([]);        
      });
  }, [toggleApi]);

    // if events array is cleared from error, return search suggestions.
    if(events.length === 0) {
      console.log("failed call", failedEventCall)
      return (
          <main>
            <li className="error">
              <div className="errorMessage">
                <h1>Oops! No events match your search</h1>
              </div>
              <img 
                src={failedEventCall[0].images[0].url}
                alt={"A child using a laptop"}
              />
              <div className="errorHints">
                <h3>Search Suggestions</h3>
                <ul>
                  <li>
                    <p>Try updating your location</p>
                  </li>
                  <li>
                    <p>Try expanding your date range</p>
                  </li>
                  <li>
                    <p>Try searching for all event types</p>
                  </li>
                  <li>
                    <p>Check your spelling</p>
                  </li>
                </ul>
              </div>
            </li>
          </main>
      )
    }

    return (
        <ul className="catalogue">
        { events.map((event) => {

          // filter through images available and save index position of the largest for display

          const imagesArray = event.images;
          const largeWidthPhoto = Math.max(...imagesArray.map(function(i) {return i.width}));
          const largePhotoIndex = imagesArray.map(e => e.width).indexOf(largeWidthPhoto);

            return (
                  <li key={event.id}>
                    <Link to={`/event/${event.id}`}>
                        <img 
                          src={event.images[largePhotoIndex].url} 
                          alt={`Placeholder`} />
                    </Link>
                  </li>
            )
        })}
      </ul>

    )

  return (
    <ul className="catalogue">
      {events.map((event) => {
        return (
          <li key={event.id}>
            <Link to={`/event/${event.id}`}>
              <div className="imgContainer">
                <img src={event.images[0].url} alt={`Placeholder`} />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
export default AllEvents;
