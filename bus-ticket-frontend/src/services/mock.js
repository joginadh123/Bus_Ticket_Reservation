// Minimal mock store
let USERS = [
  { id: 1, name: "Admin User", email: "admin@bus.com", role: "ADMIN" },
  { id: 2, name: "Customer One", email: "user@bus.com", role: "CUSTOMER" },
];

const PASSWORDS = {
  "admin@bus.com": "admin123",
  "user@bus.com": "user123",
};

let BUSES = [
  { id: 1, busNumber: "TS09 AB 1234", busType: "AC", totalSeats: 32, operatorName: "CityExpress" },
  { id: 2, busNumber: "TS09 XY 5678", busType: "Sleeper", totalSeats: 28, operatorName: "NightRider" },
];

let TRIPS = [
  {
    id: 101, busId: 1, routeId: 1001,
    source: "Hyderabad", destination: "Vijayawada",
    departureTime: "2025-09-01T07:00:00", arrivalTime: "2025-09-01T11:30:00",
    fare: 650
  },
  {
    id: 102, busId: 2, routeId: 1002,
    source: "Hyderabad", destination: "Bangalore",
    departureTime: "2025-09-01T21:30:00", arrivalTime: "2025-09-02T05:30:00",
    fare: 1200
  },
];

let SEATS = {
  101: { total: 32, booked: new Set([3, 7, 18]) },
  102: { total: 28, booked: new Set([1, 2, 9, 10, 11]) },
};

let TICKETS = {}; // ticketId -> ticket data
let TICKET_SEQ = 10000;

// Helpers
const sleep = (ms=400) => new Promise(res => setTimeout(res, ms));

const makeToken = (user) =>
  // NOTE: this is NOT a real JWT; it just lets jwt-decode not crash if you try
  // Using base64 sections to mimic a token-like shape
  `mock.${btoa(JSON.stringify({ sub: user.id, name: user.name, role: user.role }))}.token`;

export async function login(email, password){
  await sleep();
  const u = USERS.find(x => x.email === email);
  if(!u || PASSWORDS[email] !== password) throw new Error("Invalid credentials");
  return { accessToken: makeToken(u), user: u };
}

export async function register({ name, email, password }){
  await sleep();
  if(USERS.some(u => u.email === email)) throw new Error("Email already registered");
  const id = USERS.length + 1;
  USERS.push({ id, name, email, role: role || "CUSTOMER" });
  PASSWORDS[email] = password;
  return { ok: true };
}

export async function searchTrips({ source, destination, date }){
  await sleep();
  // super-simplified filter
  const results = TRIPS.filter(t =>
    t.source.toLowerCase().includes(source.toLowerCase()) &&
    t.destination.toLowerCase().includes(destination.toLowerCase()) &&
    (!date || t.departureTime.startsWith(date))
  );
  return results;
}

export async function getTripSeats(tripId){
  await sleep();
  const s = SEATS[tripId];
  if(!s) throw new Error("Trip not found");
  return { total: s.total, booked: Array.from(s.booked) };
}

export async function holdSeats(tripId, seatNumbers){
  await sleep();
  const s = SEATS[tripId];
  if(!s) throw new Error("Trip not found");

  // check conflicts
  for(const n of seatNumbers){
    if(s.booked.has(n)) {
      const err = new Error(`Seat ${n} already booked`);
      err.code = 409;
      throw err;
    }
  }
  // "hold" means we just pass through in mock
  return { holdId: `HOLD-${tripId}-${Date.now()}`, expiresInSec: 180 };
}

export async function checkout({ tripId, seatNumbers, holdId }){
  await sleep();
  // Mark seats booked in mock
  const s = SEATS[tripId];
  seatNumbers.forEach(n => s.booked.add(n));

  const ticketId = String(++TICKET_SEQ);
  TICKETS[ticketId] = {
    ticketId,
    tripId,
    seatNumbers,
    qr: `MOCK-QR-${ticketId}`,
    issuedAt: new Date().toISOString(),
  };
  return { ticketId };
}

export async function getTicket(ticketId){
  await sleep();
  const t = TICKETS[ticketId];
  if(!t) throw new Error("Ticket not found");
  return t;
}

export async function listBuses(){
  await sleep();
  return BUSES;
}

export async function addBus(payload){
  await sleep();
  const id = BUSES.length ? Math.max(...BUSES.map(b => b.id))+1 : 1;
  BUSES.push({ id, ...payload });
  return { id };
}

export async function updateBus(id, payload){
  await sleep();
  const idx = BUSES.findIndex(b => b.id === id);
  if(idx === -1) throw new Error("Bus not found");
  BUSES[idx] = { ...BUSES[idx], ...payload };
  return { ok: true };
}

export async function listTickets(){
  await sleep();
  return Object.values(TICKETS);
}
