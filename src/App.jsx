import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import HomePage from "./pages/Home.jsx";
import AboutPage from "./pages/About.jsx";
import CoursesPage from "./pages/Courses.jsx";
import CourseDetailPage from "./pages/CourseDetail.jsx";
import TeamPage from "./pages/Team.jsx";
import BookTutorialPage from "./pages/Book.jsx";
import ContactPage from "./pages/Contact.jsx";

export default function App() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
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
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
