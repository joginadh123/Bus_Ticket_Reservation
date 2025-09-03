import React, { useState, useEffect } from 'react';
import * as apiService from '../../services/apiService';
import Loader from '../../components/Loader';
import { FaTrash } from 'react-icons/fa';

export default function ManageRoutes() {
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({ source: '', destination: '', distance: '' });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const fetchRoutes = async () => {
    try {
      const response = await apiService.getAllRoutes();
      setRoutes(response.data);
    } catch (err) {
      setError('Failed to fetch routes.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');

    if (!form.source || !form.destination || !form.distance) {
      setError('All fields are required.');
      return;
    }

    try {
      await apiService.addRoute(form);
      setMsg('Route added successfully!');
      setForm({ source: '', destination: '', distance: '' }); // Clear form
      fetchRoutes(); // Refresh the list
    } catch (err) {
      setError('Failed to add route. Please try again.');
      console.error(err);
    }
  };

  const handleDelete = async (routeId) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await apiService.deleteRoute(routeId);
        setMsg('Route deleted successfully!');
        fetchRoutes(); // Refresh the list
      } catch (err) {
        setError('Failed to delete route.');
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-start">Manage Routes</h2>
      
      {msg && <div className="alert alert-success">{msg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card card-elev p-3 mb-4">
        <form onSubmit={handleSubmit} className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Source</label>
            <input type="text" name="source" value={form.source} onChange={handleChange} className="form-control" placeholder="e.g., Mumbai" required />
          </div>
          <div className="col-md-3">
            <label className="form-label">Destination</label>
            <input type="text" name="destination" value={form.destination} onChange={handleChange} className="form-control" placeholder="e.g., Pune" required />
          </div>
          <div className="col-md-3">
            <label className="form-label">Distance (km)</label>
            <input type="number" name="distance" value={form.distance} onChange={handleChange} className="form-control" placeholder="e.g., 150" required />
          </div>
          {/* 
            NOTE: Your backend Route model does not have a 'duration' field. 
            If you add it to the backend, you can uncomment this section.
            <div className="col-md-2">
              <label className="form-label">Duration (hrs)</label>
              <input type="number" name="duration" value={form.duration} onChange={handleChange} className="form-control" placeholder="e.g., 3" />
            </div>
          */}
          <div className="col-md-3">
            <button type="submit" className="btn btn-brand w-100">Add Route</button>
          </div>
        </form>
      </div>

      <div className="card card-elev p-3">
        {loading ? (
          <Loader text="Loading routes..." />
        ) : routes.length === 0 ? (
          <div className="text-center text-muted p-3">No routes available.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className='table-light'>
                <tr>
                  <th>ID</th>
                  <th>Source</th>
                  <th>Destination</th>
                  <th>Distance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.map(route => (
                  <tr key={route.id}>
                    <td><strong>#{route.id}</strong></td>
                    <td>{route.source}</td>
                    <td>{route.destination}</td>
                    <td>{route.distance} km</td>
                    <td>
                      <button onClick={() => handleDelete(route.id)} className="btn btn-outline-danger btn-sm">
                        <FaTrash />
                      </button>
                    </td>
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