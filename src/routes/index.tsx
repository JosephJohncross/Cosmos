import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApplicationRoutes } from './routes-constant';
import ApplyForJobPage from '../pages/freelancer/apply-job';
import ClientDashboard from '../pages/client/client-dashbboard';
import FreelancerDashboard from '../pages/freeelancer/freelancer-dashboard';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route
          path={ApplicationRoutes.CLIENT_DASHBOARD}
          element={<ClientDashboard />}
        />
        <Route
          path={ApplicationRoutes.FREELANCER_DASHBOARD}
          element={<FreelancerDashboard />}
        />
        <Route
          path={ApplicationRoutes.JOB_APPLY} // Use the constant from routes-constant.ts
          element={<ApplyForJobPage />}
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
