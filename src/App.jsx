import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import UserDashboard from "./pages/UserDashboard";
import MunicipalityDashboard from "./pages/MunicipalityDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PageNotFound from "./pages/PageNotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>|
        <Route path="/" element={<AuthPage/>}/>
        <Route path="*" element={<PageNotFound />} />
        <Route path="/user" element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        }/>
        <Route path="/municipality" element={
          <ProtectedRoute role="municipality">
            <MunicipalityDashboard />
          </ProtectedRoute>
        }/>
        <Route path="/superadmin" element={ 
          <ProtectedRoute role="superAdmin">
            <SuperAdminDashboard />
         </ProtectedRoute>
        }/>
      </Routes>
    </BrowserRouter>
 )
}

export default App