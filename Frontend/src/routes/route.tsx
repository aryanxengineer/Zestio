import { Route, Routes } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import ProtectedRoute from "../components/ProtectedRoutes"
import PublicRoute from "../components/PublicRoutes"
import SelectRole from "../pages/SelectRole"
import Account from "../pages/Account"

const Routing = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/account" element={<Account />} />
      </Route>
    </Routes>
  )
}

export default Routing