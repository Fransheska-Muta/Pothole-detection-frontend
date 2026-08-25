import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import UserDashboard from "./pages/UserDashboard";
import MunicipalityDashboard from "./pages/MunicipalityDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PageNotFound from "./pages/PageNotFound";
import Report from "./pages/Report"
import UpdateStatus from "./pages/UpdateStatus"
// import UpdateStatus from "./pages/UpdateStatus"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage/>}/>
        <Route path="*" element={<PageNotFound />} />
        <Route path="/user" element={
          <ProtectedRoute roles={["user","municipality", "superAdmin"]}>
            <UserDashboard />
          </ProtectedRoute>
        }/>
        <Route path="/municipality" element={
          <ProtectedRoute roles={["municipality", "superAdmin"]}>
            <MunicipalityDashboard />
          </ProtectedRoute>
        }/>
        <Route path="/superadmin" element={ 
          <ProtectedRoute roles={["superAdmin"]}>
            <SuperAdminDashboard />
         </ProtectedRoute>
        }/>
        <Route path="/report" element={ 
          <ProtectedRoute roles={["user","municipality", "superAdmin"]}>
            <Report />
         </ProtectedRoute>
        }/>

        <Route path="/update-status"element={
        <ProtectedRoute roles={["municipality", "superAdmin"]}>
          <UpdateStatus />
        </ProtectedRoute>
        }/>

      </Routes>
    </BrowserRouter>
 )
}

export default App