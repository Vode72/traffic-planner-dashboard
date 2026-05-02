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
    driverHoursLeft: 3.5
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
    driverHoursLeft: 6
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
    driverHoursLeft: 1.2
  }
]