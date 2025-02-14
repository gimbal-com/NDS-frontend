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


const App = () => {

  const dispatch = useDispatch();

  let token = localStorage.getItem("token") || "";
  if(token) {
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
          element: <h1>Claim List</h1>
        },
      ]
    },
    {
      path: '*',
      element: <Redirect to={'/auth/login'} />
    }
  ])
}

export default App;