# Aurelia House MongoDB backend

## Setup

1. Copy `.env.example` to `.env` and replace every placeholder.
2. Run `npm install` inside this `backend` folder.
3. Run `npm run seed` once to create the hotel settings, three sample rooms, and your first admin user.
4. Run `npm run dev` to start the API at `http://localhost:5000`.

## Collections

`src/server.js` starts the API. `src/routes` defines endpoints, `src/controllers` contains business logic, `src/models` contains MongoDB schemas, and `src/middleware` protects restricted routes.

## Important

The API validates dates, capacity, room availability, and overlapping bookings on the server before saving. WhatsApp requests are stored as queued notifications; connect a verified WhatsApp Business provider before sending any messages.
