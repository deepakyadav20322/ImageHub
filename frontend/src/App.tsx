import { Route, Routes } from "react-router";
import Home from "./Pages/Home";
import LoginPage from "@/Pages/LoginPage";
import SignUpPage from "./Pages/Signup";
import SidebarLayout from "./components/SidebarLayout";
import Settings from "./Pages/private/Settings";
import GetStarted from "./Pages/private/GetStarted";
import Welcome from "./Pages/private/Welcome";
import AuthLayout from "./Layouts/AuthLayout";
const App = () => {
  return (
    <Routes>
      <Route path="/" index element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* {here we define the sidebar layout for all dashboard pages} */}
      <Route element={<AuthLayout />}>
        <Route path="/welcome" element={<Welcome />} />
      </Route>
      <Route path="/dashboard" element={<SidebarLayout />}>
        <Route index element={<Settings />} />
        <Route path="getting-started" element={<GetStarted />} />
      </Route>
    </Routes>
  );
};

export default App;
