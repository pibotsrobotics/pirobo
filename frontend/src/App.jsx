import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ui/ScrollToTop';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Internship from './pages/Internship';
import Workshops from './pages/Workshops';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ManageCourses from './pages/admin/ManageCourses';
import ManageEvents from './pages/admin/ManageEvents';
import ManageGallery from './pages/admin/ManageGallery';
import ManageEnquiries from './pages/admin/ManageEnquiries';

import ManageRegistrations from './pages/admin/ManageRegistrations';
import ManageInternships from './pages/admin/ManageInternships';
import ManageTeam from './pages/admin/ManageTeam';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/internship" element={<Internship />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="courses" element={<ManageCourses />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="gallery" element={<ManageGallery />} />
            <Route path="enquiries" element={<ManageEnquiries />} />
            <Route path="enquiries" element={<ManageEnquiries />} />
            <Route path="registrations" element={<ManageRegistrations />} />
            <Route path="internships" element={<ManageInternships />} />
            <Route path="team" element={<ManageTeam />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
