import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ThemeProvider } from './context/ThemeContext';
import RoleSelection from './pages/auth/RoleSelection';
import LandingPage from './pages/landing/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ParentDashboard from './pages/parent/ParentDashboard';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderAIInsightsView from './pages/provider/ProviderAIInsightsView';
import ProviderCenterStatusView from './pages/provider/ProviderCenterStatusView';
import ProviderStaffStatusView from './pages/provider/ProviderStaffStatusView';
import ProviderParentStatusView from './pages/provider/ProviderParentStatusView';
import ProviderDailyNotesView from './pages/provider/ProviderDailyNotesView';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReportsView from './pages/admin/AdminReportsView';
import AdminCareCentersView from './pages/admin/AdminCareCentersView';
import AdminManagementView from './pages/admin/AdminManagementView';
import AdminPendingApprovalsView from './pages/admin/AdminPendingApprovalsView';
import AdminAIEfficiencyView from './pages/admin/AdminAIEfficiencyView';
import AdminCapacityView from './pages/admin/AdminCapacityView';
import AdminLiveBookingsView from './pages/admin/AdminLiveBookingsView';
import AdminBookingsView from './pages/admin/AdminBookingsView';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ProviderCategoryListView from './pages/discovery/ProviderCategoryListView';
import ProfileView from './pages/profile/ProfileView';
import ChildrenTabView from './pages/parent/ChildrenTabView';
import RegisterChildView from './pages/parent/RegisterChildView';
import DailyTimelineView from './pages/parent/DailyTimelineView';
import ProviderDetailView from './pages/discovery/ProviderDetailView';
import BookingFormView from './pages/discovery/BookingFormView';
import SidebarLayout from './components/layout/SidebarLayout';
import OnboardingView from './pages/onboarding/OnboardingView';
import NotificationsView from './pages/notifications/NotificationsView';
import SplashView from './pages/auth/SplashView';
import WelcomeCarousel from './pages/auth/WelcomeCarousel';
import MessagesView from './pages/messages/MessagesView';
import AIRecommendationDetailView from './pages/onboarding/AIRecommendationDetailView';
import SettingsView from './pages/settings/SettingsView';
import AppearanceView from './pages/settings/AppearanceView';
import TermsAndConditionsView from './pages/settings/TermsAndConditionsView';
import PrivacyPolicyView from './pages/settings/PrivacyPolicyView';
import HelpSupportView from './pages/settings/HelpSupportView';
import ChildProfileView from './pages/parent/ChildProfileView';
import BookingsView from './pages/parent/BookingsView';
function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/roles" element={<RoleSelection />} />
          <Route path="/login/:role" element={<Login />} />
          <Route path="/register/:role" element={<Register />} />
          <Route 
            path="/discovery/:category" 
            element={
              <SidebarLayout>
                <ProviderCategoryListView />
              </SidebarLayout>
            } 
          />
          <Route 
            path="/provider/:id" 
            element={
              <SidebarLayout>
                <ProviderDetailView />
              </SidebarLayout>
            } 
          />
          <Route 
            path="/booking/:id" 
            element={
              <SidebarLayout>
                <BookingFormView />
              </SidebarLayout>
            } 
          />
          <Route 
            path="/ai-recommendation/:id" 
            element={
              <SidebarLayout>
                <ProviderDetailView />
              </SidebarLayout>
            } 
          />
          <Route 
            path="/child/:childId/daily-report" 
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <SidebarLayout>
                  <DailyTimelineView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-child" 
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <SidebarLayout>
                  <RegisterChildView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/children" 
            element={
              <ProtectedRoute allowedRoles={['parent', 'preschool', 'daycare']}>
                <SidebarLayout>
                  <ChildrenTabView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/child/:id" 
            element={
              <ProtectedRoute allowedRoles={['parent', 'preschool', 'daycare']}>
                <SidebarLayout>
                  <ChildProfileView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <SidebarLayout>
                  <ProfileView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SidebarLayout>
                  <SettingsView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/settings/appearance" 
            element={
              <ProtectedRoute>
                <SidebarLayout>
                  <AppearanceView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/settings/terms" 
            element={
              <SidebarLayout>
                <TermsAndConditionsView />
              </SidebarLayout>
            } 
          />

          <Route 
            path="/settings/privacy" 
            element={
              <SidebarLayout>
                <PrivacyPolicyView />
              </SidebarLayout>
            } 
          />

          <Route 
            path="/settings/support" 
            element={
              <SidebarLayout>
                <HelpSupportView />
              </SidebarLayout>
            } 
          />

          <Route 
            path="/bookings" 
            element={
              <ProtectedRoute allowedRoles={['parent', 'preschool', 'daycare']}>
                <SidebarLayout>
                  <BookingsView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <SidebarLayout>
                  <OnboardingView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute>
                <SidebarLayout>
                  <NotificationsView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/messages" 
            element={
              <ProtectedRoute>
                <SidebarLayout>
                  <MessagesView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/parent/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <SidebarLayout>
                  <ParentDashboard />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/preschool/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['preschool']}>
                <SidebarLayout>
                  <ProviderDashboard />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/daycare/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['daycare']}>
                <SidebarLayout>
                  <ProviderDashboard />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/provider/insights" 
            element={
              <ProtectedRoute allowedRoles={['preschool', 'daycare']}>
                <SidebarLayout>
                  <ProviderAIInsightsView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/provider/status" 
            element={
              <ProtectedRoute allowedRoles={['preschool', 'daycare']}>
                <SidebarLayout>
                  <ProviderCenterStatusView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/provider/staff" 
            element={
              <ProtectedRoute allowedRoles={['preschool', 'daycare']}>
                <SidebarLayout>
                  <ProviderStaffStatusView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/provider/parents" 
            element={
              <ProtectedRoute allowedRoles={['preschool', 'daycare']}>
                <SidebarLayout>
                  <ProviderParentStatusView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/provider/notes" 
            element={
              <ProtectedRoute allowedRoles={['preschool', 'daycare']}>
                <SidebarLayout>
                  <ProviderDailyNotesView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/dashboard"  
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SidebarLayout>
                  <AdminDashboard />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SidebarLayout>
                  <AdminReportsView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
        
          <Route 
            path="/admin/care-centers"  
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SidebarLayout>
                  <AdminCareCentersView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/management"  
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SidebarLayout>
                  <AdminManagementView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/pending-approvals"  
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SidebarLayout>
                  <AdminPendingApprovalsView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/ai-efficiency"  
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SidebarLayout>
                  <AdminAIEfficiencyView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/capacity"  
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SidebarLayout>
                  <AdminCapacityView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/live-bookings"  
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SidebarLayout>
                  <AdminLiveBookingsView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/bookings"  
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SidebarLayout>
                  <AdminBookingsView />
                </SidebarLayout>
              </ProtectedRoute>
            } 
          />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  </UserProvider>
  </ThemeProvider>
);
}

export default App;
