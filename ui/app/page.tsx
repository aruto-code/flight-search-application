"use client";

import { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

type Flight = {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTimeIST: string;
  arrivalTimeIST: string;
  price: number;
};

export default function FlightSearch() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const searchFlights = async () => {
    if (!origin || !destination || !date) {
      alert("Please provide Origin, Destination, and Date.");
      return;
    }

    const formattedDate = format(date, "yyyy-MM-dd");

    try {
      const res = await fetch(
        `http://localhost:5050/api/flights/search?origin=${origin}&destination=${destination}&date=${formattedDate}`
      );
      const data = await res.json();
      setFlights(data);
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-center flex-1">Flight Search</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-sm dark:text-white ml-4"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <input
            className="w-full md:w-1/4 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
          <input
            className="w-full md:w-1/4 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <div className="w-full md:w-1/4">
            <ReactDatePicker
              selected={date}
              onChange={(date: Date | null) => setDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="Select Date"
              className="!w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
            onClick={searchFlights}
          >
            Search Flights
          </button>
        </div>

        {flights.length > 0 && (
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-left">
                  <th className="px-6 py-3">Flight</th>
                  <th className="px-6 py-3">Route</th>
                  <th className="px-6 py-3">Departure (IST)</th>
                  <th className="px-6 py-3">Arrival (IST)</th>
                  <th className="px-6 py-3">Price</th>
                </tr>
              </thead>
              <tbody>
                {flights.map((flight, index) => (
                  <tr
                    key={index}
                    className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-semibold">{flight.flightNumber}</span> - {flight.airline}
                    </td>
                    <td className="px-6 py-4">
                      {flight.origin} → {flight.destination}
                    </td>
                    <td className="px-6 py-4">{flight.departureTimeIST}</td>
                    <td className="px-6 py-4">{flight.arrivalTimeIST}</td>
                    <td className="px-6 py-4 font-medium text-green-600 dark:text-green-400">₹{flight.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}