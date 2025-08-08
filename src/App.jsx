// src/App.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/app/Layout'
import Home from './components/Home'
import Login from './components/Login'
import Signup from './components/Signup'
import Dashboard from './components/app/Dashboard'
import Customers from './components/app/Customers'
import Logs from './components/app/Logs'
import Enquiry from './components/app/Enquiry'
import { AuthProvider } from './context/AuthContext'
import { ToastContainer } from 'react-toastify'
import '@ant-design/v5-patch-for-react-19';

function App() {
  return (
    <AuthProvider>
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="logs" element={<Logs />} />
            <Route path="enquiries" element={<Enquiry />} />
          </Route>
        </Route>

        <Route path="*" element={<h1>Not Found | 404</h1>} />
      </Routes>
      <ToastContainer />
    </AuthProvider>
  )
}

export default App   
