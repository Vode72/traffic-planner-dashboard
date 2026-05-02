export const transports = [
  {
    id: "FTL001",
    from: "Helsinki",
    to: "Tampere",
    status: "on_route",
    eta: "12:30",
    capacity: "80%",
    priority: "normal",
    trailer: "reefer",
    driverHoursLeft: 3.5,
    position: [60.1699, 24.9384]
  },
  {
    id: "FTL002",
    from: "Vantaa",
    to: "Turku",
    status: "loading",
    eta: "10:45",
    capacity: "60%",
    priority: "high",
    trailer: "box",
    driverHoursLeft: 6,
    position: [60.2934, 25.0378] // Vantaa
  },
  {
    id: "FTL003",
    from: "Lahti",
    to: "Oulu",
    status: "delayed",
    eta: "18:10",
    capacity: "95%",
    priority: "critical",
    trailer: "reefer",
    driverHoursLeft: 1.2,
    position: [60.9827, 25.6615] // Lahti
  }
]