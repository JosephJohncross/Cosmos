import { ReactNode } from 'react';
import MiddlewareProvider, { privateRoutes } from './middleware';
import AuthProvider from './context/auth-context';
import FreelancerProvider from './context/freelancer-context';
import { Toaster } from './components/ui/toaster';
import DashboardLayout from './components/layout/dashbpard-layout';
import { matchPath, matchRoutes, useLocation } from 'react-router-dom';
import { Toaster as Toast } from './components/ui/sonner';
import HeaderMain from './components/header/header-main';
import FooterMain from './components/footer/footer-main';
import { ApplicationRoutes } from './routes/routes-constant';
import { XionWalletProvider } from './context/xion-context';

const isPrivateRoute = (path: string) => {
  return privateRoutes.some((route) => matchPath(route, path));
};

const routesWithFooter = [ApplicationRoutes.HOME];

export const hasFooter = (path: string) => {
  return routesWithFooter.some((route) => matchPath(route, path));
};

const Provider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <XionWalletProvider>
      <AuthProvider>
        <FreelancerProvider>
          <MiddlewareProvider>
            <HeaderMain />

            {isPrivateRoute(currentPath) ? (
              <DashboardLayout>{children}</DashboardLayout>
            ) : (
              <>{children}</>
            )}

            {hasFooter(currentPath) && <FooterMain />}
          </MiddlewareProvider>
          <Toaster />
          <Toast />
        </FreelancerProvider>
      </AuthProvider>
    </XionWalletProvider>
  );
};

export default Provider;
