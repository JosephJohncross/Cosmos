import { ReactNode, useEffect } from "react"
import { useLocation, useNavigate, matchPath } from "react-router-dom"
import { ApplicationRoutes } from "./routes/routes-constant"
import { useAuth } from "./context/auth-context"

export const privateRoutes: string[] = [
    // ApplicationRoutes.DASHBOARD,
]

const isPrivateRoute = (path: string) => {
  return privateRoutes.some((route) => matchPath(route, path));
};

const MiddlewareProvider = ({children}: {children: ReactNode}) => {
    const navigate = useNavigate()
    const location = useLocation()
    const {isLoggedIn} = useAuth()

    useEffect(() => {
      const currentPath = location.pathname;
  
      if (isPrivateRoute(currentPath) && !isLoggedIn) {
        navigate(ApplicationRoutes.HOME);
      }
    }, [location, isLoggedIn, navigate]);
  

    return children

}

export default MiddlewareProvider