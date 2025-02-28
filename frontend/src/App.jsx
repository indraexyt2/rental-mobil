import {BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "@/components/layout/main-layout.jsx";
import HomePage from "@/pages/home-page.jsx";
import AuthPage from "@/pages/auth-page.jsx";
import DashboardPage from "@/pages/dashboard-page.jsx";


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

                <Route>
                    <Route path={'/dashboard'} element={<DashboardPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
