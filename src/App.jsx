import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "./components/navbar";
import { AdminNavbar } from "./components/admin-navbar";
import { Footer } from "./components/footer";
import HomePage from "./pages/Home.jsx";
import AboutPage from "./pages/About.jsx";
import CoursesPage from "./pages/Courses.jsx";
import CourseDetailPage from "./pages/CourseDetail.jsx";
import TeamPage from "./pages/Team.jsx";
import BookTutorialPage from "./pages/Book.jsx";
import ContactPage from "./pages/Contact.jsx";
import AdminPage from "./pages/Admin.jsx";
import PaymentSuccessPage from "./pages/PaymentSuccess.jsx";

export default function App() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col">
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:facultyId/:courseId" element={<CourseDetailPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/book" element={<BookTutorialPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin/*" element={<AdminPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
}
