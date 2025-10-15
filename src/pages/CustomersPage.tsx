import { useState, useEffect } from "react";
import Modal from "../components/Modal";

function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [total, setTotal] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({
        first_name: "",
        last_name: "",
        email: "",
        store_id: 1,
        active: 1,
    });

    // Load customers (supports pagination + search)
    const loadCustomers = async (page = 1, q = "") => {
        const res = await fetch(
            `http://localhost:4000/api/customers?search=${encodeURIComponent(
                q
            )}&page=${page}&pageSize=${pageSize}`
        );
        const data = await res.json();
        setCustomers(data.results || []);
        setTotal(data.total || 0);
        setPage(data.page || 1);
    };

    useEffect(() => {
        loadCustomers(1);
    }, []);

    const totalPages = Math.ceil(total / pageSize);

    const viewCustomer = async (id: number) => {
        const res = await fetch(`http://localhost:4000/api/customers/${id}`);
        const data = await res.json();
        setSelectedCustomer(data);
    };

    const handleAdd = async () => {
        await fetch("http://localhost:4000/api/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        alert("✅ Customer added successfully!");
        setShowForm(false);
        setFormData({ first_name: "", last_name: "", email: "", store_id: 1, active: 1 });
        await loadCustomers(1, query);
    };

    const handleEdit = (customer: any) => {
        setFormData(customer);
        setIsEditing(true);
        setShowForm(true);
    };

    const handleSaveEdit = async () => {
        await fetch(`http://localhost:4000/api/customers/${formData.customer_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });
        alert("✏️ Customer updated successfully!");
        setShowForm(false);
        setIsEditing(false);
        await loadCustomers(page, query);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("🗑️ Delete this customer?")) return;

        try {
            const res = await fetch(`http://localhost:4000/api/customers/${id}`, {
                method: "DELETE",
            });

            const data = await res.json();
            alert(data.message || "Customer deleted!");

            // Force a complete reload of the current page with search query
            await loadCustomers(page, query);
            
        } catch (err) {
            console.error("Failed to delete customer:", err);
            alert("❌ Failed to delete customer.");
        }
    };

    const markReturn = async (rentalId: number) => {
        await fetch(`http://localhost:4000/api/customers/return/${rentalId}`, { method: "POST" });
        alert("🎬 Return marked successfully!");
        if (selectedCustomer) viewCustomer(selectedCustomer.customer_id);
    };

    return (
        <div className="container py-4">
            <h1 className="text-center mb-4 display-4 fw-bold" style={{ color: '#fff4e6' }}>
                Customers
            </h1>

            {/* Search Bar */}
            <div className="row justify-content-center mb-4">
                <div className="col-md-10">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by ID, first or last name"
                            style={{ backgroundColor: '#fff4e6', borderColor: '#be9b7b' }}
                        />
                        <button 
                            className="btn fw-bold"
                            style={{ backgroundColor: '#be9b7b', color: '#3c2f2f' }}
                            onClick={() => loadCustomers(1, query)}
                        >
                            Search
                        </button>
                        <button 
                            className="btn fw-bold"
                            style={{ backgroundColor: '#854442', color: 'white' }}
                            onClick={() => { setQuery(""); loadCustomers(1); }}
                        >
                            Reset
                        </button>
                        <button 
                            className="btn fw-bold"
                            style={{ backgroundColor: '#3c2f2f', color: '#fff4e6' }}
                            onClick={() => setShowForm(true)}
                        >
                            ➕ Add Customer
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
                <table className="table table-hover table-borderless">
                    <thead>
                        <tr style={{ backgroundColor: '#fff4e6', color: '#3c2f2f' }}>
                            <th className="ps-3">ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Active</th>
                            <th className="text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((c) => (
                            <tr key={c.customer_id} style={{ backgroundColor: '#fff4e6' }}>
                                <td className="ps-3 fw-bold text-dark">{c.customer_id}</td>
                                <td className="text-dark">
                                    <strong>{c.first_name} {c.last_name}</strong>
                                </td>
                                <td className="text-dark">{c.email}</td>
                                <td>
                                    <span 
                                        className="badge"
                                        style={{ 
                                            backgroundColor: c.active ? '#be9b7b' : '#854442', 
                                            color: 'white' 
                                        }}
                                    >
                                        {c.active ? "✅ Active" : "❌ Inactive"}
                                    </span>
                                </td>
                                <td className="text-center">
                                    <div className="btn-group btn-group-sm">
                                        <button 
                                            className="btn btn-sm fw-bold me-1"
                                            style={{ backgroundColor: '#be9b7b', color: '#3c2f2f' }}
                                            onClick={() => viewCustomer(c.customer_id)}
                                        >
                                            Details
                                        </button>
                                        <button 
                                            className="btn btn-sm fw-bold me-1"
                                            style={{ backgroundColor: '#3c2f2f', color: '#fff4e6' }}
                                            onClick={() => handleEdit(c)}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            className="btn btn-sm fw-bold"
                                            style={{ backgroundColor: '#854442', color: 'white' }}
                                            onClick={() => handleDelete(c.customer_id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-4">
                <div style={{ color: '#fff4e6' }}>
                    Showing page {page} of {totalPages}
                </div>
                <div className="btn-group">
                    <button 
                        className="btn fw-bold"
                        style={{ 
                            backgroundColor: page === 1 ? '#be9b7b' : '#854442', 
                            color: 'white',
                            opacity: page === 1 ? 0.6 : 1
                        }}
                        disabled={page === 1}
                        onClick={() => loadCustomers(page - 1, query)}
                    >
                        Previous
                    </button>
                    <button 
                        className="btn fw-bold"
                        style={{ 
                            backgroundColor: page === totalPages ? '#be9b7b' : '#854442', 
                            color: 'white',
                            opacity: page === totalPages ? 0.6 : 1
                        }}
                        disabled={page === totalPages}
                        onClick={() => loadCustomers(page + 1, query)}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Details Modal */}
            <Modal isOpen={!!selectedCustomer} onClose={() => setSelectedCustomer(null)}>
                {selectedCustomer && (
                    <div style={{ maxHeight: "70vh", overflowY: "auto", paddingRight: "10px" }}>
                        <h3 className="text-dark">{selectedCustomer.first_name} {selectedCustomer.last_name}</h3>
                        <p className="text-muted"><strong>Email:</strong> {selectedCustomer.email}</p>
                        <p className="text-muted"><strong>Active:</strong> {selectedCustomer.active ? "Yes" : "No"}</p>

                        {/* Separate rental lists */}
                        <div style={{ marginTop: "1rem" }}>
                            <h4 className="text-dark">🎬 Current Rentals</h4>
                            {selectedCustomer.rentals?.filter((r: any) => !r.return_date).length === 0 ? (
                                <p className="text-muted">No active rentals</p>
                            ) : (
                                <ul className="list-group">
                                    {selectedCustomer.rentals
                                        .filter((r: any) => !r.return_date)
                                        .map((r: any) => (
                                            <li key={r.rental_id} className="list-group-item d-flex justify-content-between align-items-center">
                                                <span>{r.title}</span>
                                                <button
                                                    className="btn btn-sm fw-bold"
                                                    style={{ backgroundColor: '#854442', color: 'white' }}
                                                    onClick={() => markReturn(r.rental_id)}
                                                >
                                                    Mark Returned
                                                </button>
                                            </li>
                                        ))}
                                </ul>
                            )}

                            <h4 className="text-dark mt-4">📜 Past Rentals</h4>
                            {selectedCustomer.rentals?.filter((r: any) => r.return_date).length === 0 ? (
                                <p className="text-muted">No past rentals</p>
                            ) : (
                                <ul className="list-group">
                                    {selectedCustomer.rentals
                                        .filter((r: any) => r.return_date)
                                        .map((r: any) => (
                                            <li key={r.rental_id} className="list-group-item">
                                                {r.title} — <span style={{ color: '#be9b7b' }}>Returned ✅</span>
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Add/Edit Form Modal */}
            <Modal
                isOpen={showForm}
                onClose={() => {
                    setShowForm(false);
                    setIsEditing(false);
                }}
            >
                <div>
                    <h3 className="text-dark mb-4">{isEditing ? "✏️ Edit Customer" : "➕ Add New Customer"}</h3>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            isEditing ? handleSaveEdit() : handleAdd();
                        }}
                    >
                        <div className="mb-3">
                            <label className="form-label text-dark">First Name</label>
                            <input
                                className="form-control"
                                value={formData.first_name}
                                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                required
                                style={{ backgroundColor: '#fff4e6', borderColor: '#be9b7b' }}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-dark">Last Name</label>
                            <input
                                className="form-control"
                                value={formData.last_name}
                                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                required
                                style={{ backgroundColor: '#fff4e6', borderColor: '#be9b7b' }}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label text-dark">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                style={{ backgroundColor: '#fff4e6', borderColor: '#be9b7b' }}
                            />
                        </div>

                        <div className="text-end">
                            <button 
                                type="submit" 
                                className="btn fw-bold"
                                style={{ backgroundColor: '#854442', color: 'white' }}
                            >
                                {isEditing ? "💾 Save Changes" : "Add Customer"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}

export default CustomersPage;