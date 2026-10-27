require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB Serverless Connection
let isConnected = false;
const connectDB = async () => {
    if (isConnected) return;
    if (!process.env.MONGODB_URI) {
        console.warn("MONGODB_URI is not defined.");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log("MongoDB Connected (Admin)");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

// Mongoose Schema (Shared with index.js)
const appointmentSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    preferredDoctor: { type: String, required: true },
    preferredDate: { type: String, required: true },
    preferredTime: { type: String, required: true },
    treatment: { type: String, required: true },
    notes: { type: String, default: '' },
    status: { type: String, default: 'Pending' },
    createdAt: { type: Date, default: Date.now }
});
const Appointment = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);

// Admin APIs
app.get('/admin/api/appointments', async (req, res) => {
    await connectDB();
    try {
        const appointments = await Appointment.find().sort({ createdAt: -1 });
        res.json({ success: true, data: appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/admin/api/appointments/:id', async (req, res) => {
    await connectDB();
    try {
        const { status } = req.body;
        const updated = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/admin/api/appointments/:id', async (req, res) => {
    await connectDB();
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Admin Dashboard HTML
const adminHtmlTemplate = `
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | SmileCare</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root[data-theme="light"] {
            --bg: #F4F8FB;
            --text-main: #2C3E50;
            --text-muted: #7F8C8D;
            --card-bg: #FFFFFF;
            --clay-bg: #F4F8FB;
            --clay-shadow: 8px 8px 16px rgba(166, 180, 200, 0.5), -8px -8px 16px #FFFFFF, inset 4px 4px 8px rgba(255,255,255,0.6), inset -4px -4px 8px rgba(166, 180, 200, 0.2);
            --border-color: #E2E8F0;
            --primary: #2D9CDB;
            --success: #6FCF97;
            --warning: #F2C94C;
            --danger: #EB5757;
        }
        :root[data-theme="dark"] {
            --bg: #1A202C;
            --text-main: #F7FAFC;
            --text-muted: #A0AEC0;
            --card-bg: #2D3748;
            --clay-bg: #2D3748;
            --clay-shadow: 8px 8px 16px #1a202c, -8px -8px 16px #3a475d, inset 4px 4px 8px rgba(255,255,255,0.05), inset -4px -4px 8px rgba(0,0,0,0.5);
            --border-color: #4A5568;
            --primary: #56CCF2;
            --success: #6FCF97;
            --warning: #F2C94C;
            --danger: #FC8181;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }
        body { background: var(--bg); color: var(--text-main); transition: 0.3s; min-height: 100vh; padding: 20px; }
        
        .container { max-width: 1400px; margin: 0 auto; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .theme-toggle, .btn { padding: 10px 20px; border-radius: 12px; border: none; cursor: pointer; font-weight: 600; transition: 0.3s; outline: none; }
        .theme-toggle { background: var(--card-bg); color: var(--text-main); box-shadow: var(--clay-shadow); }
        .btn-primary { background: var(--primary); color: white; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .stat-card { background: var(--clay-bg); border-radius: 20px; padding: 20px; box-shadow: var(--clay-shadow); display: flex; flex-direction: column; animation: slideUp 0.5s ease; }
        .stat-card h3 { color: var(--text-muted); font-size: 14px; font-weight: 500; }
        .stat-card .value { font-size: 32px; font-weight: 700; color: var(--primary); margin-top: 10px; }

        .dashboard-section { background: var(--clay-bg); border-radius: 24px; padding: 30px; box-shadow: var(--clay-shadow); margin-bottom: 30px; animation: slideUp 0.6s ease; }
        .toolbar { display: flex; justify-content: space-between; flex-wrap: wrap; gap: 15px; margin-bottom: 20px; }
        .search-input, .filter-select { padding: 12px 20px; border-radius: 12px; border: none; background: var(--card-bg); color: var(--text-main); box-shadow: inset 4px 4px 8px rgba(0,0,0,0.1), inset -4px -4px 8px rgba(255,255,255,0.05); outline: none; }
        .search-input { min-width: 300px; }

        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 15px; text-align: left; border-bottom: 1px solid var(--border-color); }
        th { font-weight: 600; color: var(--text-muted); }
        
        .status-badge { padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .status-Pending { background: rgba(242, 201, 76, 0.2); color: var(--warning); }
        .status-Confirmed { background: rgba(45, 156, 219, 0.2); color: var(--primary); }
        .status-Completed { background: rgba(111, 207, 151, 0.2); color: var(--success); }
        .status-Cancelled { background: rgba(235, 87, 87, 0.2); color: var(--danger); }

        .action-select { padding: 5px; border-radius: 8px; border: 1px solid var(--border-color); background: var(--card-bg); color: var(--text-main); }
        .btn-delete { background: var(--danger); color: white; padding: 6px 12px; border: none; border-radius: 8px; cursor: pointer; }
        
        /* Animations */
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        /* Loading */
        #loader { text-align: center; padding: 50px; font-size: 20px; color: var(--primary); font-weight: bold; }
        
        /* Responsive */
        @media (max-width: 1024px) {
            .search-input { width: 100%; }
            .table-container { overflow-x: auto; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h2>🦷 SmileCare Admin Panel</h2>
            <div>
                <button class="theme-toggle" onclick="toggleTheme()">🌓 Toggle Theme</button>
                <button class="btn btn-primary" onclick="exportData()">📥 Export JSON</button>
            </div>
        </header>

        <div class="stats-grid">
            <div class="stat-card"><h3>Total Appointments</h3><div class="value" id="stat-total">0</div></div>
            <div class="stat-card"><h3>Pending</h3><div class="value" id="stat-pending" style="color: var(--warning);">0</div></div>
            <div class="stat-card"><h3>Confirmed</h3><div class="value" id="stat-confirmed" style="color: var(--primary);">0</div></div>
            <div class="stat-card"><h3>Completed</h3><div class="value" id="stat-completed" style="color: var(--success);">0</div></div>
        </div>

        <div class="dashboard-section">
            <div class="toolbar">
                <input type="text" id="searchInput" class="search-input" placeholder="Search by name, phone, or email..." onkeyup="filterTable()">
                <select id="filterStatus" class="filter-select" onchange="filterTable()">
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            <div class="table-container">
                <div id="loader">Loading Appointments...</div>
                <table id="appointmentsTable" style="display:none;">
                    <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Contact</th>
                            <th>Doctor & Treatment</th>
                            <th>Date & Time</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody"></tbody>
                </table>
            </div>
        </div>
    </div>

    <script>
        let appointments = [];

        // Theme Toggle
        function toggleTheme() {
            const html = document.documentElement;
            const current = html.getAttribute('data-theme');
            html.setAttribute('data-theme', current === 'light' ? 'dark' : 'light');
        }

        // Fetch Data
        async function fetchAppointments() {
            try {
                const res = await fetch('/admin/api/appointments');
                const result = await res.json();
                if(result.success) {
                    appointments = result.data;
                    updateDashboard();
                }
            } catch (err) {
                console.error("Failed to fetch", err);
            }
        }

        function updateDashboard() {
            document.getElementById('loader').style.display = 'none';
            document.getElementById('appointmentsTable').style.display = 'table';
            
            // Stats
            document.getElementById('stat-total').innerText = appointments.length;
            document.getElementById('stat-pending').innerText = appointments.filter(a => a.status === 'Pending').length;
            document.getElementById('stat-confirmed').innerText = appointments.filter(a => a.status === 'Confirmed').length;
            document.getElementById('stat-completed').innerText = appointments.filter(a => a.status === 'Completed').length;
            
            renderTable(appointments);
        }

        function renderTable(data) {
            const tbody = document.getElementById('tableBody');
            tbody.innerHTML = '';
            data.forEach(apt => {
                const tr = document.createElement('tr');
                tr.innerHTML = \`
                    <td>
                        <strong>\${apt.patientName}</strong><br>
                        <small style="color:var(--text-muted)">Age: \${apt.age} | \${apt.gender}</small>
                    </td>
                    <td>\${apt.phone}<br><small>\${apt.email}</small></td>
                    <td>\${apt.preferredDoctor}<br><small style="color:var(--primary)">\${apt.treatment}</small></td>
                    <td>\${apt.preferredDate}<br><small>\${apt.preferredTime}</small></td>
                    <td><span class="status-badge status-\${apt.status}">\${apt.status}</span></td>
                    <td>
                        <select class="action-select" onchange="updateStatus('\${apt._id}', this.value)">
                            <option value="Pending" \${apt.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Confirmed" \${apt.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="Completed" \${apt.status === 'Completed' ? 'selected' : ''}>Completed</option>
                            <option value="Cancelled" \${apt.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                        <button class="btn-delete" onclick="deleteAppointment('\${apt._id}')">🗑️</button>
                    </td>
                \`;
                tbody.appendChild(tr);
            });
        }

        async function updateStatus(id, newStatus) {
            try {
                await fetch('/admin/api/appointments/' + id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                });
                fetchAppointments(); // Refresh
            } catch (err) { alert('Error updating status'); }
        }

        async function deleteAppointment(id) {
            if(!confirm("Are you sure you want to delete this appointment?")) return;
            try {
                await fetch('/admin/api/appointments/' + id, { method: 'DELETE' });
                fetchAppointments(); // Refresh
            } catch (err) { alert('Error deleting appointment'); }
        }

        function filterTable() {
            const query = document.getElementById('searchInput').value.toLowerCase();
            const statusFilter = document.getElementById('filterStatus').value;
            
            const filtered = appointments.filter(apt => {
                const matchesText = apt.patientName.toLowerCase().includes(query) || apt.phone.includes(query) || apt.email.toLowerCase().includes(query);
                const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
                return matchesText && matchesStatus;
            });
            renderTable(filtered);
        }

        function exportData() {
            const blob = new Blob([JSON.stringify(appointments, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'smilecare_appointments.json';
            a.click();
        }

        // Init
        fetchAppointments();
    </script>
</body>
</html>
`;

// Catch-all admin routes to serve HTML
app.get('/admin', (req, res) => res.send(adminHtmlTemplate));
app.get('/admin/*', (req, res) => res.send(adminHtmlTemplate));

// Start locally (Vercel overrides this)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Admin App running on port ${PORT}`));

module.exports = app;
