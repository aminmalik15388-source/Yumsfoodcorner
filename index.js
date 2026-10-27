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
        console.log("MongoDB Connected (Public)");
    } catch (error) {
        console.error("MongoDB connection error:", error);
    }
};

// Mongoose Schema
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

// API Route: Book Appointment
app.post('/api/book', async (req, res) => {
    await connectDB();
    try {
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        res.status(201).json({ success: true, message: 'Appointment booked successfully!' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// HTML Frontend (Premium Claymorphism)
const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SmileCare Dental Clinic | Premium Dental Services</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #2D9CDB;
            --secondary: #56CCF2;
            --accent: #6FCF97;
            --bg: #F4F8FB;
            --text-dark: #2C3E50;
            --text-light: #7F8C8D;
            --clay-bg: #F4F8FB;
            --clay-shadow: 12px 12px 24px rgba(166, 180, 200, 0.6), -12px -12px 24px #FFFFFF, inset 4px 4px 8px rgba(255, 255, 255, 0.8), inset -4px -4px 8px rgba(166, 180, 200, 0.2);
            --clay-shadow-hover: 8px 8px 16px rgba(166, 180, 200, 0.5), -8px -8px 16px #FFFFFF, inset 6px 6px 12px rgba(255, 255, 255, 0.9), inset -6px -6px 12px rgba(166, 180, 200, 0.3);
            --clay-card: #FFFFFF;
        }
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Poppins', sans-serif; }
        body { background: var(--bg); color: var(--text-dark); overflow-x: hidden; scroll-behavior: smooth; }
        
        /* Animations */
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
        @keyframes blob { 0% { border-radius: 40% 60% 70% 30% / 40% 40% 60% 50%; } 50% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; } 100% { border-radius: 40% 60% 70% 30% / 40% 40% 60% 50%; } }
        .reveal { opacity: 0; transform: translateY(40px); transition: all 0.8s cubic-bezier(0.5, 0, 0, 1); }
        .reveal.active { opacity: 1; transform: translateY(0); }

        /* Typography & Layout */
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
        h1, h2, h3 { color: var(--primary); margin-bottom: 15px; }
        p { color: var(--text-light); line-height: 1.6; }
        
        /* Navigation */
        nav { position: fixed; width: 100%; top: 0; z-index: 1000; background: rgba(244, 248, 251, 0.8); backdrop-filter: blur(15px); padding: 15px 0; transition: 0.3s; }
        nav .container { display: flex; justify-content: space-between; align-items: center; }
        .logo { font-size: 24px; font-weight: 700; color: var(--primary); text-decoration: none; display: flex; align-items: center; gap: 10px; }
        .nav-links { display: flex; gap: 25px; }
        .nav-links a { text-decoration: none; color: var(--text-dark); font-weight: 500; transition: 0.3s; }
        .nav-links a:hover { color: var(--primary); }
        .mobile-menu-btn { display: none; background: none; border: none; font-size: 28px; cursor: pointer; color: var(--primary); }

        /* Buttons & Claymorphism */
        .btn { display: inline-block; padding: 12px 30px; border-radius: 30px; font-weight: 600; text-decoration: none; transition: 0.3s; cursor: pointer; border: none; font-size: 16px; }
        .btn-primary { background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; box-shadow: 0 10px 20px rgba(45, 156, 219, 0.3); }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 15px 25px rgba(45, 156, 219, 0.4); }
        .clay-box { background: var(--clay-bg); border-radius: 24px; box-shadow: var(--clay-shadow); padding: 30px; transition: 0.4s; }
        .clay-box:hover { box-shadow: var(--clay-shadow-hover); transform: translateY(-5px); }

        /* Hero Section */
        .hero { min-height: 100vh; display: flex; align-items: center; position: relative; overflow: hidden; padding-top: 80px; }
        .hero-content { position: relative; z-index: 2; max-width: 600px; }
        .hero h1 { font-size: 3.5rem; line-height: 1.2; background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-buttons { display: flex; gap: 20px; margin-top: 30px; }
        .hero-graphics { position: absolute; right: 5%; top: 50%; transform: translateY(-50%); width: 500px; height: 500px; z-index: 1; }
        .blob { position: absolute; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(86,204,242,0.3), rgba(45,156,219,0.3)); animation: blob 8s infinite ease-in-out, float 6s infinite ease-in-out; backdrop-filter: blur(10px); }
        
        /* Sections */
        section { padding: 100px 0; }
        .section-title { text-align: center; margin-bottom: 50px; font-size: 2.5rem; }
        
        /* Grid Layouts */
        .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px; }
        .grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 40px; align-items: center; }

        /* Cards */
        .service-card { text-align: center; }
        .service-icon { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 20px; box-shadow: 0 10px 20px rgba(45,156,219,0.3); }
        
        .doctor-card img { width: 100%; height: 300px; object-fit: cover; border-radius: 16px; margin-bottom: 15px; }
        
        /* Stats */
        .stats-container { display: flex; justify-content: space-around; flex-wrap: wrap; gap: 30px; text-align: center; }
        .stat-item h3 { font-size: 3rem; color: var(--accent); margin-bottom: 5px; }

        /* Gallery Masonry */
        .gallery-masonry { column-count: 3; column-gap: 20px; }
        .gallery-item { margin-bottom: 20px; border-radius: 16px; overflow: hidden; break-inside: avoid; display: inline-block; width: 100%; }
        .gallery-item img { width: 100%; display: block; transition: 0.5s; }
        .gallery-item:hover img { transform: scale(1.1); }

        /* Form styling */
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: 500; color: var(--text-dark); }
        .form-control { width: 100%; padding: 15px; border-radius: 12px; border: none; background: #E8F0F7; box-shadow: inset 4px 4px 8px rgba(166, 180, 200, 0.4), inset -4px -4px 8px #FFFFFF; color: var(--text-dark); outline: none; font-family: inherit; transition: 0.3s; }
        .form-control:focus { box-shadow: inset 6px 6px 12px rgba(166, 180, 200, 0.5), inset -6px -6px 12px #FFFFFF; background: #EDF3F9; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

        /* Footer */
        footer { background: white; padding: 60px 0 30px; box-shadow: 0 -10px 30px rgba(0,0,0,0.02); }
        .footer-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; margin-bottom: 40px; }
        .footer-bottom { text-align: center; padding-top: 20px; border-top: 1px solid #EEE; color: var(--text-light); }

        /* Loading */
        #loader { position: fixed; top:0; left:0; width: 100%; height: 100%; background: var(--bg); z-index: 9999; display: flex; justify-content: center; align-items: center; transition: 0.5s; }
        .spinner { width: 50px; height: 50px; border: 5px solid rgba(45, 156, 219, 0.2); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s infinite linear; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        /* Responsive */
        @media (max-width: 768px) {
            .nav-links { display: none; position: absolute; top: 70px; left: 0; width: 100%; background: var(--bg); flex-direction: column; text-align: center; padding: 20px; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
            .nav-links.active { display: flex; }
            .mobile-menu-btn { display: block; }
            .hero h1 { font-size: 2.5rem; }
            .hero-graphics { display: none; }
            .form-grid { grid-template-columns: 1fr; }
            .gallery-masonry { column-count: 1; }
        }
    </style>
</head>
<body>

    <!-- Loader -->
    <div id="loader"><div class="spinner"></div></div>

    <!-- Nav -->
    <nav id="navbar">
        <div class="container">
            <a href="#" class="logo">🦷 SmileCare</a>
            <div class="nav-links" id="navLinks">
                <a href="#home">Home</a>
                <a href="#about">About</a>
                <a href="#services">Services</a>
                <a href="#doctors">Doctors</a>
                <a href="#appointment">Appointment</a>
                <a href="/admin" target="_blank" style="color: var(--accent);">Admin Panel</a>
            </div>
            <button class="mobile-menu-btn" id="menuBtn">☰</button>
        </div>
    </nav>

    <!-- Hero -->
    <section id="home" class="hero">
        <div class="container">
            <div class="hero-content reveal">
                <h1>Creating Healthy Smiles Every Day</h1>
                <p style="margin-top: 20px; font-size: 1.2rem;">Experience world-class dental care with our premium facilities, expert specialists, and painless treatments.</p>
                <div class="hero-buttons">
                    <a href="#appointment" class="btn btn-primary">Book Appointment</a>
                    <a href="#services" class="btn clay-box" style="padding: 12px 30px; box-shadow: none; border: 2px solid var(--primary); color: var(--primary);">View Services</a>
                </div>
            </div>
            <div class="hero-graphics reveal">
                <div class="blob"></div>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 150px; z-index: 2; animation: float 5s infinite ease-in-out;">✨😁</div>
            </div>
        </div>
    </section>

    <!-- Stats -->
    <section class="container reveal">
        <div class="clay-box stats-container">
            <div class="stat-item"><h3 class="counter" data-target="5000">0</h3><p>Happy Patients</p></div>
            <div class="stat-item"><h3 class="counter" data-target="20">0</h3><p>Years Experience</p></div>
            <div class="stat-item"><h3 class="counter" data-target="15">0</h3><p>Specialists</p></div>
            <div class="stat-item"><h3 class="counter" data-target="99">0</h3><p>Satisfaction (%)</p></div>
        </div>
    </section>

    <!-- About -->
    <section id="about" class="container reveal">
        <div class="grid-2">
            <div class="clay-box" style="height: 400px; display: flex; align-items: center; justify-content: center; font-size: 100px;">
                🏥
            </div>
            <div>
                <h2>Welcome to SmileCare Dental Clinic</h2>
                <p style="margin-bottom: 20px;">We are dedicated to providing comprehensive dental care for you and your family in a comfortable and modern environment. Our state-of-the-art facility uses the latest technology to ensure painless and effective treatments.</p>
                <ul style="list-style-type: none; line-height: 2;">
                    <li>✅ 10+ years of professional experience</li>
                    <li>✅ Certified & friendly dentists</li>
                    <li>✅ Advanced painless equipment</li>
                    <li>✅ Emergency dental care 24/7</li>
                </ul>
            </div>
        </div>
    </section>

    <!-- Services -->
    <section id="services">
        <div class="container">
            <h2 class="section-title reveal">Our Premium Services</h2>
            <div class="grid-3">
                <div class="clay-box service-card reveal">
                    <div class="service-icon">✨</div>
                    <h3>Teeth Whitening</h3>
                    <p>Get a bright, stunning smile with our advanced laser whitening technology.</p>
                </div>
                <div class="clay-box service-card reveal">
                    <div class="service-icon">🦷</div>
                    <h3>Dental Implants</h3>
                    <p>Permanent and natural-looking solutions for missing teeth.</p>
                </div>
                <div class="clay-box service-card reveal">
                    <div class="service-icon">😬</div>
                    <h3>Orthodontics</h3>
                    <p>Clear aligners and modern braces for perfect teeth alignment.</p>
                </div>
                <div class="clay-box service-card reveal">
                    <div class="service-icon">🔬</div>
                    <h3>Root Canal</h3>
                    <p>Painless endodontic therapy to save and restore damaged teeth.</p>
                </div>
                <div class="clay-box service-card reveal">
                    <div class="service-icon">🧸</div>
                    <h3>Pediatric Dentistry</h3>
                    <p>Gentle and fun dental care designed specifically for children.</p>
                </div>
                <div class="clay-box service-card reveal">
                    <div class="service-icon">🚑</div>
                    <h3>Emergency Care</h3>
                    <p>Immediate dental assistance for severe pain or accidents.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Doctors -->
    <section id="doctors" class="container">
        <h2 class="section-title reveal">Meet Our Specialists</h2>
        <div class="grid-3">
            <div class="clay-box doctor-card reveal">
                <div style="width:100%; height:300px; background:#E8F0F7; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:80px; margin-bottom:15px;">👩‍⚕️</div>
                <h3>Dr. Emily Johnson</h3>
                <p style="color: var(--primary); font-weight: 500;">Orthodontist</p>
                <p>12 Years Exp. | ⭐ 4.9/5</p>
            </div>
            <div class="clay-box doctor-card reveal">
                <div style="width:100%; height:300px; background:#E8F0F7; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:80px; margin-bottom:15px;">👨‍⚕️</div>
                <h3>Dr. Michael Brown</h3>
                <p style="color: var(--primary); font-weight: 500;">Dental Surgeon</p>
                <p>15 Years Exp. | ⭐ 4.8/5</p>
            </div>
            <div class="clay-box doctor-card reveal">
                <div style="width:100%; height:300px; background:#E8F0F7; border-radius:16px; display:flex; align-items:center; justify-content:center; font-size:80px; margin-bottom:15px;">👩‍⚕️</div>
                <h3>Dr. Sophia Williams</h3>
                <p style="color: var(--primary); font-weight: 500;">Cosmetic Dentist</p>
                <p>8 Years Exp. | ⭐ 5.0/5</p>
            </div>
        </div>
    </section>

    <!-- Gallery -->
    <section id="gallery" class="container">
        <h2 class="section-title reveal">Clinic Gallery</h2>
        <div class="gallery-masonry reveal">
            <div class="gallery-item clay-box" style="padding:10px;"><div style="height:250px; background:linear-gradient(45deg, #2D9CDB, #56CCF2); border-radius:12px; display:flex; align-items:center; justify-content:center; color:white; font-size:40px;">🏢 Clinic</div></div>
            <div class="gallery-item clay-box" style="padding:10px;"><div style="height:350px; background:linear-gradient(45deg, #6FCF97, #2D9CDB); border-radius:12px; display:flex; align-items:center; justify-content:center; color:white; font-size:40px;">💺 Equipment</div></div>
            <div class="gallery-item clay-box" style="padding:10px;"><div style="height:200px; background:linear-gradient(45deg, #F2C94C, #F2994A); border-radius:12px; display:flex; align-items:center; justify-content:center; color:white; font-size:40px;">😁 Smiles</div></div>
            <div class="gallery-item clay-box" style="padding:10px;"><div style="height:300px; background:linear-gradient(45deg, #BB6BD9, #9B51E0); border-radius:12px; display:flex; align-items:center; justify-content:center; color:white; font-size:40px;">👨‍👩‍👧‍👦 Team</div></div>
        </div>
    </section>

    <!-- Appointment -->
    <section id="appointment">
        <div class="container">
            <h2 class="section-title reveal">Book an Appointment</h2>
            <div class="clay-box reveal" style="max-width: 800px; margin: 0 auto;">
                <form id="bookingForm">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Patient Name *</label>
                            <input type="text" class="form-control" name="patientName" required placeholder="John Doe">
                        </div>
                        <div class="form-group">
                            <label>Phone *</label>
                            <input type="tel" class="form-control" name="phone" required placeholder="+1 234 567 8900">
                        </div>
                        <div class="form-group">
                            <label>Email *</label>
                            <input type="email" class="form-control" name="email" required placeholder="john@example.com">
                        </div>
                        <div class="form-group">
                            <label>Age *</label>
                            <input type="number" class="form-control" name="age" required placeholder="30">
                        </div>
                        <div class="form-group">
                            <label>Gender *</label>
                            <select class="form-control" name="gender" required>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Preferred Doctor *</label>
                            <select class="form-control" name="preferredDoctor" required>
                                <option value="Any">Any Available Doctor</option>
                                <option value="Dr. Emily Johnson">Dr. Emily Johnson (Orthodontist)</option>
                                <option value="Dr. Michael Brown">Dr. Michael Brown (Surgeon)</option>
                                <option value="Dr. Sophia Williams">Dr. Sophia Williams (Cosmetic)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Treatment *</label>
                            <select class="form-control" name="treatment" required>
                                <option value="Consultation">General Consultation</option>
                                <option value="Cleaning">Teeth Cleaning</option>
                                <option value="Whitening">Teeth Whitening</option>
                                <option value="Root Canal">Root Canal</option>
                                <option value="Implants">Dental Implants</option>
                                <option value="Braces">Braces/Orthodontics</option>
                                <option value="Emergency">Emergency Care</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Preferred Date *</label>
                            <input type="date" class="form-control" name="preferredDate" required>
                        </div>
                        <div class="form-group">
                            <label>Preferred Time *</label>
                            <input type="time" class="form-control" name="preferredTime" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Additional Notes</label>
                        <textarea class="form-control" name="notes" rows="4" placeholder="Any symptoms or specific requests..."></textarea>
                    </div>
                    <div id="formMsg" style="margin-bottom:15px; font-weight:bold; text-align:center;"></div>
                    <button type="submit" class="btn btn-primary" style="width:100%;">Confirm Appointment</button>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-grid">
                <div>
                    <h3>🦷 SmileCare</h3>
                    <p>Creating healthy, beautiful smiles with state-of-the-art technology and compassionate care.</p>
                </div>
                <div>
                    <h3>Contact Us</h3>
                    <p>📍 123 Healthcare Avenue, NY</p>
                    <p>📞 +1 (555) 123-4567</p>
                    <p>✉️ info@smilecareclinic.com</p>
                </div>
                <div>
                    <h3>Working Hours</h3>
                    <p>Mon-Fri: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 4:00 PM</p>
                    <p>Sunday: Closed</p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2026 SmileCare Dental Clinic. All Rights Reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        // Loader
        window.addEventListener('load', () => {
            document.getElementById('loader').style.opacity = '0';
            setTimeout(() => document.getElementById('loader').style.display = 'none', 500);
        });

        // Mobile Menu
        document.getElementById('menuBtn').addEventListener('click', () => {
            document.getElementById('navLinks').classList.toggle('active');
        });

        // Scroll Reveal Animation
        const reveals = document.querySelectorAll('.reveal');
        const revealOnScroll = () => {
            const windowHeight = window.innerHeight;
            reveals.forEach(reveal => {
                const revealTop = reveal.getBoundingClientRect().top;
                if (revealTop < windowHeight - 50) reveal.classList.add('active');
            });
        };
        window.addEventListener('scroll', revealOnScroll);
        revealOnScroll(); // Trigger on load

        // Number Counters
        const counters = document.querySelectorAll('.counter');
        const runCounters = () => {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const updateCount = () => {
                    const count = +counter.innerText;
                    const speed = 200;
                    const inc = target / speed;
                    if(count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 10);
                    } else {
                        counter.innerText = target + (target === 99 ? '' : '+');
                    }
                };
                updateCount();
            });
        };
        // Simple Intersection Observer for Counters
        const statsSection = document.querySelector('.stats-container');
        let counterStarted = false;
        window.addEventListener('scroll', () => {
            if (counterStarted) return;
            if (statsSection.getBoundingClientRect().top < window.innerHeight) {
                runCounters();
                counterStarted = true;
            }
        });

        // Form Submission
        document.getElementById('bookingForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = e.target.querySelector('button');
            const msg = document.getElementById('formMsg');
            btn.innerHTML = 'Processing...';
            btn.disabled = true;

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/book', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if(result.success) {
                    msg.style.color = 'var(--accent)';
                    msg.innerText = result.message + " You can view it in the Admin Panel.";
                    e.target.reset();
                } else {
                    msg.style.color = 'red';
                    msg.innerText = result.message;
                }
            } catch (err) {
                msg.style.color = 'red';
                msg.innerText = 'Failed to connect to server.';
            }
            btn.innerHTML = 'Confirm Appointment';
            btn.disabled = false;
        });
    </script>
</body>
</html>
`;

app.get('/', (req, res) => {
    res.send(htmlTemplate);
});

// Start locally (Vercel overrides this)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Public App running on port ${PORT}`));

module.exports = app;
