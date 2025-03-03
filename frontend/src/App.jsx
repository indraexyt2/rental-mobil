import {BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/main-layout.jsx";
import HomePage from "@/pages/home-page.jsx";
import AuthPage from "@/pages/auth-page.jsx";
import AdminDashboard from "@/pages/admin-dashboard-page.jsx";


function App() {
  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path={'/'} element={<HomePage />} />
                </Route>

                <Route>
                    <Route path={'/auth'} element={<AuthPage />} />
                </Route>

                <Route path="/admin/*" element={
                        <Routes>
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="cars" element={<AdminDashboard />} />
                            <Route path="models" element={<AdminDashboard />} />
                            <Route path="features" element={<AdminDashboard />} />
                            <Route path="reservations" element={<AdminDashboard />} />
                            <Route path="customers" element={<AdminDashboard />} />
                            <Route path="payments" element={<AdminDashboard />} />
                            <Route path="reports/income" element={<AdminDashboard />} />
                            <Route path="reports/orders" element={<AdminDashboard />} />

                        </Routes>
                } />

            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
