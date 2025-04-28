import { Navigate, Route, Routes } from "react-router";
import Home from "./Pages/Home";
import LoginPage from "@/Pages/LoginPage";
import SignUpPage from "./Pages/Signup";
import SidebarLayout from "./components/SidebarLayout";
import ProductEnvironmentSetting from "./Pages/private/Settings/ProductEnvironmentSetting";
import GetStarted from "./Pages/private/GetStarted";
import Welcome from "./Pages/private/Welcome";
import AuthLayout from "./Layouts/AuthLayout";
import MediaHome from "./Pages/private/Media/MediaHome";
import MediaTopNavLayout from "./Layouts/MediaTopNavLayout";
import Folders from "./Pages/private/Media/Folders";
import Folders2 from "./Pages/private/Media/Folders2";
import AccountSetting from "./Pages/private/Settings/AccountSetting";
// import TestPage from '@/Pages/TestPage'
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import ResetPasswordPage from "./Pages/ResetPasswordPage";
import VerifyEmailPage from "./Pages/VerifyEmailPage";
import TransformationVisulizationPage from "./Pages/TransformVisulizationPage";
import AllAssetsManagerTable from "./components/AllAssetsTableComponents/AssetsTableList";
const App = () => {
  return (
    <Routes>
      <Route path="/" index element={<Home />} />

      {/* <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} /> */}

      {/* {here we define the sidebar layout for all dashboard pages} */}
      <Route element={<AuthLayout />}>
      {/* ****************- Here we attach auth pages in authlayout because it is not accessible after login-- */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/edit-vizulization" element={<TransformationVisulizationPage />} />

      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      {/* -***************------------------------------------- */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/dashboard" element={<SidebarLayout />}>
        <Route index element={<Navigate to="media" replace />} />
          <Route path="settings/product" element={<ProductEnvironmentSetting />} />
          <Route path="settings/account" element={<AccountSetting />} />
          <Route path="getting-started" element={<GetStarted />} />

          <Route element={<MediaTopNavLayout />}>
      <Route path="media">
      <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<MediaHome />} />
        <Route path="folders" element={<Folders2 />} />
        <Route path="assets" element={<AllAssetsManagerTable/>} />
        <Route path="folders/:folderId" element={<Folders />} />
        <Route path="*" element={<GetStarted />} />
      </Route>
    </Route>
        </Route>
      </Route>
 
    </Routes>
  );
};

export default App;





