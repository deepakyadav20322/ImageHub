import { Navigate, Route, Routes } from "react-router";
import Home from "./Pages/Home";
import LoginPage from "@/Pages/LoginPage";
import SignUpPage from "./Pages/Signup";
import SidebarLayout from "./components/SidebarLayout";
import Settings from "./Pages/private/Settings";
import GetStarted from "./Pages/private/GetStarted";
import Welcome from "./Pages/private/Welcome";
import AuthLayout from "./Layouts/AuthLayout";
import MediaHome from "./Pages/private/Media/MediaHome";
import MediaTopNavLayout from "./Layouts/MediaTopNavLayout";
import Folders from "./Pages/private/Media/Folders";
import Folders2 from "./Pages/private/Media/Folders2";
import {Toaster} from 'react-hot-toast'
const App = () => {
  return (
    <Routes>
      <Route path="/" index element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* {here we define the sidebar layout for all dashboard pages} */}
      <Route element={<AuthLayout />}>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/dashboard" element={<SidebarLayout />}>
          <Route index element={<Settings />} />
          <Route path="getting-started" element={<GetStarted />} />

          <Route element={<MediaTopNavLayout />}>
      <Route path="media">
      <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<MediaHome />} />
        <Route path="folders" element={<Folders2 />} />
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
