import { Route } from "react-router-dom";
import Home from "../pages/home";
import { ApplicationRoutes } from "./routes-constant";
import Dashboard from "../pages/dashboard";
import JoinPage from "../pages/join";


export const CustomRoutes = () => {
  return [
    <Route>
      <Route element={<Home/>} path={ApplicationRoutes.HOME}></Route>
      <Route element={<JoinPage/>} path={ApplicationRoutes.JOIN}></Route>
    </Route>,
  ];
};
