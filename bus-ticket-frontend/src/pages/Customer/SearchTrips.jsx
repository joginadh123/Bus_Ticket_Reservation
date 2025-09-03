import React, { useState } from "react";
import * as apiService from "../../services/apiService.js"; // <-- Replaced mock with apiService
import TripCard from "../../components/TripCard.jsx";
import Loader from "../../components/Loader.jsx";

export default function SearchTrips() {
  const [form, setForm] = useState({ source: "", destination: "", date: "" });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null); // Will store the transformed trip data
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResults(null); // Clear previous results

    // Validation for source & destination (letters and spaces only)
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(form.source) || !nameRegex.test(form.destination)) {
      setError("Source and Destination should only contain letters.");
      return;
    }

    setLoading(true);
    try {
      // Call the new apiService to search for trips
      const response = await apiService.searchTrips(form);

      // IMPORTANT: The backend returns Trip objects with a nested Route object.
      // The TripCard component expects a flat structure with 'source' and 'destination'.
      // We need to transform the data to match what the component needs.
      const transformedResults = response.data.map(trip => ({
        ...trip,
        source: trip.route.source,         // <-- Flatten the data structure
        destination: trip.route.destination, // <-- Flatten the data structure
      }));

      setResults(transformedResults);

    } catch (err) {
      console.error("Search failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card card-elev p-3 mb-3">
        <h4 className="mb-3">Find Your Trip</h4>
        <form className="row g-3" onSubmit={onSubmit}>
          <div className="col-md-4">
            <label className="form-label">Source</label>
            <input
              className="form-control"
              name="source"
              placeholder="e.g., Mumbai"
              value={form.source}
              onChange={onChange}
              required
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Destination</label>
            <input
              className="form-control"
              name="destination"
              placeholder="e.g., Pune"
              value={form.destination}
              onChange={onChange}
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Date</label>
            <input
              className="form-control"
              type="date"
              name="date"
              value={form.date}
              onChange={onChange}
              // Making date optional for broader search
            />
          </div>
          <div className="col-md-1 d-flex align-items-end">
            <button className="btn btn-brand search-btn w-100" type="submit" disabled={loading}>
              Search
            </button>
          </div>
        </form>
      </div>

      {loading && <Loader text="Searching trips..." />}
      {error && <div className="alert alert-danger">{error}</div>}

      {results && (
        <div>
          <h5 className="mb-3">Search Results</h5>
          {results.length ? (
            results.map((trip) => <TripCard key={trip.id} trip={trip} />)
          ) : (
            <div className="alert alert-warning">No trips found for the selected route.</div>
          )}
        </div>
      )}
    </div>
  );
}