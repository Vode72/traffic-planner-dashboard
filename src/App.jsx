import { useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import { transports } from "./data/mockTransports"


function statusBadge(status){
  const colors = {
    on_route: "#16a34a",
    loading: "#f59e0b",
    delayed: "#ef4444"
  }

  return {
    backgroundColor: colors[status] || "#64748b",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase",
    display: "inline-block"
  }
}

function priorityBadge(priority){

  const colors = {
    normal: "#64748b",
    high: "#f59e0b",
    critical: "#ef4444"
  }

  return {
    backgroundColor: colors[priority] || "#64748b",
    color: "white",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase"
  }
}


function driverHoursColor(hours){
  if(hours < 2) return "red"
  if(hours < 4) return "orange"
  return "lightgreen"
}

function capacityWarning(capacity){
  const value = Number(capacity.replace("%", ""))

  if(value >= 90){
    return {
      color: "red",
      fontWeight: "bold"
    }
  }

  if(value >= 80){
    return {
      color: "orange",
      fontWeight: "bold"
    }
  }

  return {
    color: "lightgreen",
    fontWeight: "bold"
  }
}

function transportMarker(status){
  const colors = {
    on_route: "#16a34a",
    loading: "#f59e0b",
    delayed: "#ef4444"
  }

  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 18px;
        height: 18px;
        background: ${colors[status] || "#64748b"};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 8px rgba(0,0,0,0.4);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })
}

function App(){

  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  const activeCount = transports.length
  const delayedCount = transports.filter(t => t.status === "delayed").length
  const loadingCount = transports.filter(t => t.status === "loading").length

  const capacityAvg = Math.round(
    transports.reduce((sum, t) => sum + Number(t.capacity.replace("%", "")), 0) / transports.length
  )

  const lowDriverHoursCount = transports.filter(t => t.driverHoursLeft < 2).length

  const restRequiredCount = transports.filter(t => t.driverHoursLeft < 1.5).length

  const drivingRiskLevel =
    lowDriverHoursCount === 0 ? "Low" :
    lowDriverHoursCount === 1 ? "Medium" :
    "High"


  const filteredTransports = transports
    .filter(t => {
      if(filter === "all") return true
      if(filter === "delayed") return t.status === "delayed"
      if(filter === "high") return t.priority === "high"
      return true
    })
    .filter(t =>
      t.id.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div style={{padding:"40px", fontFamily:"Arial"}}>

      <h1>Traffic Planner Dashboard</h1>

      <div style={{marginBottom:"20px"}}>
        <button onClick={() => {
            setFilter("all")
            setSearch("")
          }}>
            All
        </button>
        <button onClick={() => {
            setFilter("delayed")
            setSearch("")
          }}>
            Delayed
        </button>
        <button onClick={() => {
            setFilter("high")
            setSearch("")
          }}>
            High priority
        </button>
      </div>

      <input
        type="text"
        placeholder="Search transport ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{marginBottom:"20px", padding:"8px", width:"200px"}}
      />

      <div style={{display:"flex", gap:"20px", marginBottom:"30px"}}>

        <div style={{background:"#1e293b", padding:"20px", borderRadius:"10px"}}>
          <h3>Active transports</h3>
          <p>{activeCount}</p>
        </div>

        <div style={{background:"#1e293b", padding:"20px", borderRadius:"10px"}}>
          <h3>Delayed</h3>
          <p style={{color:"red"}}>{delayedCount}</p>
        </div>

        <div style={{background:"#1e293b", padding:"20px", borderRadius:"10px"}}>
          <h3>Loading</h3>
          <p style={{color:"orange"}}>{loadingCount}</p>
        </div>

        <div style={{background:"#1e293b", padding:"20px", borderRadius:"10px"}}>
          <h3>Capacity avg</h3>
          <p>{capacityAvg}%</p>
        </div>

      </div>

      <div style={{
        background:"#111827",
        padding:"20px",
        borderRadius:"10px",
        marginBottom:"30px",
        border:"1px solid #374151"
      }}>

        <h2>EU Driving Time Check</h2>

        <p>
          Driver risk level: 
          <strong style={{
            color: drivingRiskLevel === "High" ? "red" : drivingRiskLevel === "Medium" ? "orange" : "lightgreen",
            marginLeft:"8px"
          }}>
            {drivingRiskLevel}
          </strong>
        </p>

        <p>Drivers below 2h remaining: {lowDriverHoursCount}</p>

        <p>Rest required soon: {restRequiredCount}</p>

      </div>

      <div style={{
            height: "400px",
            marginBottom: "30px",
            borderRadius: "10px",
            overflow: "hidden",
            border: "1px solid #374151"
          }}>

            <MapContainer 
              center={[61.0, 25.0]} 
              zoom={6} 
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {filteredTransports.map(t => (
                <Marker key={t.id} position={t.position} icon={transportMarker(t.status)}>
                  <Popup>
                    <strong>{t.id}</strong><br />
                    {t.from} → {t.to}<br />
                    Status: {t.status.replace("_", " ")}<br />
                    ETA: {t.eta}<br />
                    Capacity: {t.capacity}
                  </Popup>
                </Marker>
              ))}

            </MapContainer>

          </div>

      <h2>Today's transports</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
            <th>ETA</th>
            <th>Capacity</th>
            <th>Priority</th>
            <th>Trailer</th>
            <th>Driver hours</th>
          </tr>
        </thead>

        <tbody>
          {filteredTransports.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.from}</td>
              <td>{t.to}</td>

              <td>
                <span style={statusBadge(t.status)}>
                  {t.status.replace("_", " ")}
                </span>
              </td>

              <td>{t.eta}</td>
              <td style={capacityWarning(t.capacity)}>
                {t.capacity} {Number(t.capacity.replace("%", "")) >= 90 ? "⚠" : ""}
              </td>
              <td>
              <span style={priorityBadge(t.priority)}>
                {t.priority}
              </span>
              </td>
              <td>{t.trailer}</td>

              <td style={{color: driverHoursColor(t.driverHoursLeft)}}>
                {t.driverHoursLeft} h
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}

export default App