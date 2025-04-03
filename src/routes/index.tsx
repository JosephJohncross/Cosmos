import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApplicationRoutes } from './routes-constant';
import ApplyForJobPage from '../pages/freeelancer/apply-job';
import ClientDashboard from '../pages/client/client-dashbboard';
import FreelancerDashboard from '../pages/freeelancer/freelancer-dashboard';

const AppRouter = () => {
  return (
    <BrowserRouter>
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
          path={ApplicationRoutes.JOB_APPLY_WITH_ID}
          element={<ApplyForJobPage />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
