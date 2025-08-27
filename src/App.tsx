import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages';
import About from './pages/About';
import Contact from './pages/Contact';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Offers from './pages/Offers';
import InstructorDashboard from './pages/instructor';
import AdminDashboard from './pages/admin';
import ManagerDashboard from './pages/manager';
import TutorDashboard from './pages/tutor';
import StudentDashboard from './pages/student';
import CourseViewer from './pages/student/CourseViewer';
import LessonViewer from './pages/student/LessonViewer';
import { ThemeProvider } from './components/theme-provider';
import { LanguageProvider } from './components/LanguageProvider';
import StudentPayment from './pages/student/StudentPayment';
import TutorPayment from './pages/tutor/TutorPayment';
import CourseReviewPage from '@/pages/admin/CourseReviewPage';
import OrganizationDashboard from './pages/organization';
import ModuleEditor from './components/admin/courses/ModuleEditor';
import CourseEditor from './components/admin/courses/CourseEditor';
import InstructorCourseEditor from './components/instructor/courses/InstructorCourseEditor';
import InstructorModuleEditor from './components/instructor/courses/InstructorModuleEditor';
import StudentProfile from './components/student/profile/StudentProfile';
import StudentSecurity from './components/student/profile/StudentSecurity';
import StudentSubscription from './components/student/profile/StudentSubscription';
import StudentNotifications from './components/student/profile/StudentNotifications';
import StudentInvoices from './components/student/profile/StudentInvoices';
import StudentCourseReview from './components/student/courses/StudentCourseReview';
import StudentWishlist from './components/student/courses/StudentWishlist';
import StudentCertificates from './components/student/profile/StudentCertificates';
import StudentDashboardIndex from './components/student/StudentDashboardIndex';
import InstructorProfile from './components/instructor/profile/InstructorProfile';
import InstructorSecurity from './components/instructor/profile/InstructorSecurity';
import InstructorNotifications from './components/instructor/profile/InstructorNotifications';
import InstructorDashboardIndex from './components/instructor/InstructorDashboardIndex';
import InstructorCourses from './components/instructor/courses/InstructorCourses';
import InstructorStudents from './components/instructor/students/InstructorStudents';
import InstructorAnalytics from './components/instructor/InstructorAnalytics';
import InstructorEarning from './components/instructor/InstructorEarning';
import InstructorSubscription from './components/instructor/InstructorSubscription';
import InstructorInvoices from './components/instructor/InstructorInvoices';
import InstructorCertificates from './components/instructor/profile/InstructorCertificates';
import TutorProfile from './components/tutor/profile/TutorProfile';
import TutorSecurity from './components/tutor/profile/TutorSecurity';
import TutorNotifications from './components/tutor/profile/TutorNotifications';
import TutorDashboardIndex from './components/tutor/TutorDashboardIndex';
import TutorCourses from './components/tutor/courses/TutorCourses';
import TutorStudents from './components/tutor/students/TutorStudents';
import TutorAnalytics from './components/tutor/TutorAnalytics';
import TutorEarning from './components/tutor/TutorEarning';
import TutorSubscription from './components/tutor/TutorSubscription';
import TutorInvoices from './components/tutor/TutorInvoices';
import ManagerProfile from './components/manager/profile/ManagerProfile';
import ManagerSecurity from './components/manager/profile/ManagerSecurity';
import ManagerNotifications from './components/manager/profile/ManagerNotifications';
import ManagerDashboardIndex from './components/manager/ManagerDashboardIndex';
import ManagerInstructors from './components/manager/instructors/ManagerInstructors';
import ManagerStudents from './components/manager/students/ManagerStudents';
import ManagerAnalytics from './components/manager/ManagerAnalytics';
import ManagerEarning from './components/manager/ManagerEarning';
import ManagerSubscription from './components/manager/ManagerSubscription';
import ManagerInvoices from './components/manager/ManagerInvoices';
import AdminDashboardIndex from './components/admin/AdminDashboardIndex';
import AdminInstructors from './components/admin/instructors/AdminInstructors';
import AdminStudents from './components/admin/students/AdminStudents';
import AdminOrganizations from './components/admin/organizations/AdminOrganizations';
import AdminAnalytics from './components/admin/AdminAnalytics';
import AdminEarning from './components/admin/AdminEarning';
import AdminSubscription from './components/admin/AdminSubscription';
import AdminInvoices from './components/admin/AdminInvoices';
import OrganizationProfile from './components/organization/profile/OrganizationProfile';
import OrganizationSecurity from './components/organization/profile/OrganizationSecurity';
import OrganizationNotifications from './components/organization/profile/OrganizationNotifications';
import OrganizationDashboardIndex from './components/organization/OrganizationDashboardIndex';
import OrganizationInstructors from './components/organization/instructors/OrganizationInstructors';
import OrganizationStudents from './components/organization/students/OrganizationStudents';
import OrganizationAnalytics from './components/organization/OrganizationAnalytics';
import OrganizationEarning from './components/organization/OrganizationEarning';
import OrganizationSubscription from './components/organization/OrganizationSubscription';
import OrganizationInvoices from './components/organization/OrganizationInvoices';
import OrganizationCourses from './components/organization/courses/OrganizationCourses';
import AdminCourseEditor from './components/admin/courses/AdminCourseEditor';
import AdminModuleEditor from './components/admin/courses/AdminModuleEditor';
import InstructorCourseReview from './components/instructor/courses/InstructorCourseReview';
import OrganizationCourseEditor from './components/organization/courses/OrganizationCourseEditor';
import OrganizationModuleEditor from './components/organization/courses/OrganizationModuleEditor';

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/instructors" element={<InstructorDashboard />} />
            <Route path="/dashboard/admin/*" element={<AdminDashboard />} />
            <Route path="/dashboard/instructor/*" element={<InstructorDashboard />} />
            <Route path="/dashboard/manager/*" element={<ManagerDashboard />} />
            <Route path="/dashboard/tuteur/*" element={<TutorDashboard />} />
            <Route path="/dashboard/tuteur/payment" element={<TutorPayment />} />
            <Route path="/dashboard/apprenant/*" element={<StudentDashboard />} />
            <Route path="/dashboard/apprenant/courses/:id" element={<CourseViewer />} />
            <Route path="/dashboard/apprenant/courses/:courseId/lessons/:lessonId" element={<LessonViewer />} />
            <Route path="/dashboard/apprenant/payment" element={<StudentPayment />} />
            <Route path="/dashboard/organization/*" element={<OrganizationDashboard />} />

            {/* Student Routes */}
            <Route path="/dashboard/apprenant" element={<StudentDashboardIndex />} />
            <Route path="/dashboard/apprenant/profile" element={<StudentProfile />} />
            <Route path="/dashboard/apprenant/security" element={<StudentSecurity />} />
            <Route path="/dashboard/apprenant/subscription" element={<StudentSubscription />} />
            <Route path="/dashboard/apprenant/notifications" element={<StudentNotifications />} />
            <Route path="/dashboard/apprenant/invoices" element={<StudentInvoices />} />
            <Route path="/dashboard/apprenant/review" element={<StudentCourseReview />} />
            <Route path="/dashboard/apprenant/wishlist" element={<StudentWishlist />} />
            <Route path="/dashboard/apprenant/certificates" element={<StudentCertificates />} />

            {/* Instructor Routes */}
            <Route path="/dashboard/instructor" element={<InstructorDashboardIndex />} />
            <Route path="/dashboard/instructor/profile" element={<InstructorProfile />} />
            <Route path="/dashboard/instructor/security" element={<InstructorSecurity />} />
            <Route path="/dashboard/instructor/notifications" element={<InstructorNotifications />} />
            <Route path="/dashboard/instructor/courses" element={<InstructorCourses />} />
            <Route path="/dashboard/instructor/courses/new" element={<InstructorCourseEditor />} />
            <Route path="/dashboard/instructor/courses/:courseId/edit" element={<InstructorCourseEditor />} />
            <Route path="/dashboard/instructor/courses/:courseId/modules/new" element={<InstructorModuleEditor />} />
            <Route path="/dashboard/instructor/courses/:courseId/modules/:moduleId/edit" element={<InstructorModuleEditor />} />
            <Route path="/dashboard/instructor/courses/:courseId/review" element={<InstructorCourseReview />} />
            <Route path="/dashboard/instructor/students" element={<InstructorStudents />} />
            <Route path="/dashboard/instructor/analytics" element={<InstructorAnalytics />} />
            <Route path="/dashboard/instructor/earning" element={<InstructorEarning />} />
            <Route path="/dashboard/instructor/subscription" element={<InstructorSubscription />} />
            <Route path="/dashboard/instructor/invoices" element={<InstructorInvoices />} />
             <Route path="/dashboard/instructor/certificates" element={<InstructorCertificates />} />

             {/* Tutor Routes */}
             <Route path="/dashboard/tuteur" element={<TutorDashboardIndex />} />
            <Route path="/dashboard/tuteur/profile" element={<TutorProfile />} />
            <Route path="/dashboard/tuteur/security" element={<TutorSecurity />} />
            <Route path="/dashboard/tuteur/notifications" element={<TutorNotifications />} />
            <Route path="/dashboard/tuteur/courses" element={<TutorCourses />} />
            <Route path="/dashboard/tuteur/students" element={<TutorStudents />} />
            <Route path="/dashboard/tuteur/analytics" element={<TutorAnalytics />} />
            <Route path="/dashboard/tuteur/earning" element={<TutorEarning />} />
            <Route path="/dashboard/tuteur/abonnements" element={<TutorSubscription />} />
            <Route path="/dashboard/tuteur/invoices" element={<TutorInvoices />} />

            {/* Manager Routes */}
            <Route path="/dashboard/manager" element={<ManagerDashboardIndex />} />
            <Route path="/dashboard/manager/profile" element={<ManagerProfile />} />
            <Route path="/dashboard/manager/security" element={<ManagerSecurity />} />
            <Route path="/dashboard/manager/notifications" element={<ManagerNotifications />} />
            <Route path="/dashboard/manager/instructors" element={<ManagerInstructors />} />
            <Route path="/dashboard/manager/students" element={<ManagerStudents />} />
            <Route path="/dashboard/manager/analytics" element={<ManagerAnalytics />} />
            <Route path="/dashboard/manager/earning" element={<ManagerEarning />} />
            <Route path="/dashboard/manager/subscription" element={<ManagerSubscription />} />
            <Route path="/dashboard/manager/invoices" element={<ManagerInvoices />} />

             {/* Admin Routes */}
             <Route path="/dashboard/admin" element={<AdminDashboardIndex />} />
            <Route path="/dashboard/admin/instructors" element={<AdminInstructors />} />
            <Route path="/dashboard/admin/students" element={<AdminStudents />} />
            <Route path="/dashboard/admin/organizations" element={<AdminOrganizations />} />
            <Route path="/dashboard/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/dashboard/admin/earning" element={<AdminEarning />} />
            <Route path="/dashboard/admin/subscription" element={<AdminSubscription />} />
            <Route path="/dashboard/admin/invoices" element={<AdminInvoices />} />
            <Route path="/dashboard/admin/courses/new" element={<AdminCourseEditor />} />
            <Route path="/dashboard/admin/courses/:courseId/edit" element={<AdminCourseEditor />} />
            <Route path="/dashboard/admin/courses/:courseId/modules/new" element={<AdminModuleEditor />} />
             <Route path="/dashboard/admin/courses/:courseId/modules/:moduleId/edit" element={<AdminModuleEditor />} />
             <Route path="/dashboard/admin/review" element={<CourseReviewPage />} />

             {/* Organization Routes */}
             <Route path="/dashboard/organization" element={<OrganizationDashboardIndex />} />
            <Route path="/dashboard/organization/profile" element={<OrganizationProfile />} />
            <Route path="/dashboard/organization/security" element={<OrganizationSecurity />} />
            <Route path="/dashboard/organization/notifications" element={<OrganizationNotifications />} />
            <Route path="/dashboard/organization/instructors" element={<OrganizationInstructors />} />
            <Route path="/dashboard/organization/students" element={<OrganizationStudents />} />
            <Route path="/dashboard/organization/analytics" element={<OrganizationAnalytics />} />
            <Route path="/dashboard/organization/earning" element={<OrganizationEarning />} />
            <Route path="/dashboard/organization/subscription" element={<OrganizationSubscription />} />
            <Route path="/dashboard/organization/invoices" element={<OrganizationInvoices />} />
             <Route path="/dashboard/organization/courses" element={<OrganizationCourses />} />
             <Route path="/dashboard/organization/courses/new" element={<OrganizationCourseEditor />} />
            <Route path="/dashboard/organization/courses/:courseId/edit" element={<OrganizationCourseEditor />} />
            <Route path="/dashboard/organization/courses/:courseId/modules/new" element={<OrganizationModuleEditor />} />
             <Route path="/dashboard/organization/courses/:courseId/modules/:moduleId/edit" element={<OrganizationModuleEditor />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;
