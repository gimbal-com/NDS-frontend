import { useRoutes } from "react-router-dom"
import AuthLayout from "./components/auth-layout";
import Redirect from "./components/common/redirect";
import RegisterPage from "./pages/auth/register";
import LoginPage from "./pages/auth/login";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { refresh } from "./store/user/userSlice";
import ClientLayout from "./components/client-layout";
import ClientJobListPage from "./pages/client/job-list";
import ClientJobNewPage from "./pages/client/job-new";
import ClientJobEditPage from "./pages/client/job-edit";
import PilotLayout from "./components/pilot-layout";
import PilotJobListPage from "./pages/pilot/job-list";
import PilotJobDetail from "./pages/pilot/job-detail";
import ClientClaimListPage from "./pages/client/claim-list";

const App = () => {

  const dispatch = useDispatch();

  let token = localStorage.getItem("token") || "";
  if (token) {
    dispatch(refresh(token));
  }

  return useRoutes([
    {
      path: '/auth',
      element: <AuthLayout />,
      children: [
        {
          path: '/auth/login',
          element: <LoginPage />
        },
        {
          path: '/auth/register',
          element: <RegisterPage />
        }
      ]
    },
    {
      path: '/client',
      element: <ClientLayout />,
      children: [
        {
          path: '/client/jobs',
          element: <ClientJobListPage />
        },
        {
          path: '/client/jobs/new',
          element: <ClientJobNewPage />
        },
        {
          path: '/client/jobs/:id',
          element: <ClientJobEditPage />
        },
        {
          path: '/client/claims',
          element: <ClientClaimListPage />
        },
      ]
    },
    {
      path: '/pilot',
      element: <PilotLayout />,
      children: [
        {
          path: '/pilot/jobs',
          element: <PilotJobListPage />
        },
        {
          path: '/pilot/jobs/:id',
          element: <PilotJobDetail />
        }
      ]
    },
    {
      path: '*',
      element: <Redirect to={'/auth/login'} />
    }
  ])
}

export default App;