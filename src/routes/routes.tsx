import { Route } from "react-router-dom";
import Home from "../pages/home";
import { ApplicationRoutes } from "./routes-constant";
import Dashboard from "../pages/dashboard";
import JoinPage from "../pages/join";
import FreelancerDasboard from "../pages/freeelancer/freelancer-dashboard";
import FreeLancerSetupSteps from "../components/freelancer/freelancer-setup";
import ClientDashboard from "../pages/client/client-dashbboard";
import FreeLancerProviderWrapper from "../pages/freeelancer/freelancer-provider";


export const CustomRoutes = () => {
  return [
    <Route>
      <Route element={<Home/>} path={ApplicationRoutes.HOME}></Route>
      <Route element={<JoinPage/>} path={ApplicationRoutes.JOIN}></Route>
      <Route element={<FreeLancerProviderWrapper/>} path={ApplicationRoutes.FREELANCER_DASHBOARD}></Route>
      <Route element={<FreeLancerSetupSteps/>} path={ApplicationRoutes.FREELANCER_SETUP}></Route>
      <Route element={<ClientDashboard/>} path={ApplicationRoutes.CLIENT_DASHBOARD}></Route>
    </Route>,
  ];
};
