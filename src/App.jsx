import { useState, useEffect } from "react";

function BusService({ busArrivalData }) {
  return (
    <ul>
      {busArrivalData.services.map((service) => { // loop out selected API data for display
        const result = service.next_bus_mins < 0 ? 'Arrived' : `${service.next_bus_mins} minutes`;
        return (
          <li key={service.bus_no}>
            Bus {service.bus_no}: {result}
          </li>
        );
      })}
    </ul>
  )
}

// Function to fetch bus arrival data using the provided API

async function fetchBusArrival(busStopId) {
  const response = await fetch(`https://sg-bus-arrival.sigma-schoolsc1.repl.co/?id=${busStopId}`)
  const data = await response.json()
  return data
}

function App() {
  const [busStopId, setBusStopId] = useState('');
  const [busArrivalData, setBusArrivalData] = useState(null);
  const [loading, setLoading] = useState(false);

  const option = [
    "18131",
    "18141",
  ];

  const onOptionChangeHandler = (e) => {
    setBusStopId(e.target.value);
  }

  // function handleInputChange(e) {
  //   setBusStopId(e.target.value);
  // }

  // Use useEffect as an live event listener, only run when busStopId changes
  useEffect(() => {
    if (busStopId) {
      setLoading(true);
      fetchBusArrival(busStopId)
        .then((data) => setBusArrivalData(data))
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }
  }, [busStopId])


  return (
    <div>
      <img src="./src/bus.png" alt="Bus Icon" height="100px" />
      <h1>Bus Arrival App</h1>

      {/* <input
        type="text"
        value={busStopId}
        onChange={handleInputChange}
        placeholder="Enter Bus Stop ID: 18141"
      /> */}

      {/* selector for bus stop id */}
      <select onChange={onOptionChangeHandler}> 
        <option>Please choose a bus stop ID</option>
        {option.map((option, index) => {
          return (
            <option key={index}>{option}</option>
          )
        })}
      </select>

      {loading && <p>Loading...</p>}

      {/* check if the data available before run to avoid crash */}
      {busArrivalData && busArrivalData.services && (
        <>
          <h2>Bus Stop {busArrivalData.bus_stop_id}</h2>
          <BusService busArrivalData={busArrivalData} />
        </>
      )}
    </div>
  )
}

export default App;