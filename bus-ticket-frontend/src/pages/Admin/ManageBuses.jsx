import React, { useEffect, useState } from "react";
import * as apiService from "../../services/apiService.js";

export default function ManageBuses() {
  const [buses, setBuses] = useState([]);
  const [form, setForm] = useState({ busNumber: "", type: "AC", capacity: 32 }); // <<-- Changed totalSeats to capacity, busType to type
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchBuses = async () => {
    try {
      const response = await apiService.getAllBuses();
      setBuses(response.data);
    } catch (err) {
      console.error("Failed to fetch buses:", err);
      setMsg("Failed to fetch buses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      if (editingId) {
        // You'll need to add a PUT /buses/{id} endpoint in your backend BusController
        // for this to truly work with the backend. For now, apiService.updateBus is a mock.
        await apiService.updateBus(editingId, form);
        setMsg("Bus updated successfully!");
      } else {
        await apiService.addBus(form);
        setMsg("Bus added successfully!");
      }
      setForm({ busNumber: "", type: "AC", capacity: 32 }); // Reset form
      setEditingId(null);
      await fetchBuses(); // Re-fetch buses to update the list
    } catch (err) {
      console.error("Bus operation failed:", err.response?.data || err.message);
      setMsg(err.response?.data || "Operation failed.");
    }
  };

  const onEdit = (b) => {
    setEditingId(b.id);
    setForm({ busNumber: b.busNumber, type: b.type, capacity: b.capacity }); // <<-- Changed totalSeats to capacity, busType to type
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bus?")) return;
    setMsg("");
    try {
      await apiService.deleteBus(id);
      setMsg("Bus deleted successfully!");
      await fetchBuses();
    } catch (err) {
      console.error("Bus deletion failed:", err.response?.data || err.message);
      setMsg(err.response?.data || "Deletion failed.");
    }
  };

  return (
    <div>
      <h4>Manage Buses</h4>
      {msg && (
        <div className={`alert ${msg.includes("successfully") ? "alert-success" : "alert-danger"}`}>
          {msg}
        </div>
      )}
      <div className="card p-3 mb-3">
        <form onSubmit={onSubmit} className="row g-2">
          <div className="col-md-6">
            <label className="form-label">Bus Number</label>
            <input className="form-control" name="busNumber" value={form.busNumber} onChange={onChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Type</label>
            <select className="form-select" name="type" value={form.type} onChange={onChange}> {/* <<-- Changed busType to type */}
              <option>AC</option>
              <option>Non-AC</option>
              <option>Sleeper</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Capacity</label> {/* <<-- Changed Total Seats to Capacity */}
            <input type="number" className="form-control" name="capacity" value={form.capacity} onChange={onChange} required /> {/* <<-- Changed totalSeats to capacity */}
          </div>
          {/* Your backend Bus model doesn't have operatorName, remove if not needed */}
          {/* <div className="col-md-6">
            <label className="form-label">Operator</label>
            <input className="form-control" name="operatorName" value={form.operatorName} onChange={onChange} required />
          </div> */}
          <div className="col-12">
            <button className="btn btn-brand">{editingId ? "Update" : "Add"}</button>
            {editingId && (
              <button type="button" className="btn btn-secondary ms-2" onClick={() => { setEditingId(null); setForm({ busNumber: "", type: "AC", capacity: 32 }); }}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      <div>
        <h5>Existing Buses</h5>
        {loading ? (
          <div className="text-center text-muted">Loading buses...</div>
        ) : buses.length === 0 ? (
          <div className="text-muted">No buses added yet.</div>
        ) : (
          <div className="list-group">
            {buses.map(b => (
              <div key={b.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{b.busNumber}</strong> - {b.type} ({b.capacity} seats) {/* <<-- Changed busType to type, totalSeats to capacity */}
                </div>
                <div>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(b)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(b.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}