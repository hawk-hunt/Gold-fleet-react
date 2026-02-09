import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { token, loading, isInitialized } = useAuth()

  // Wait for auth to fully initialize
  if (loading || !isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If no token, redirect to landing page (not authenticated)
  if (!token) {
    return <Navigate to="/" replace />
  }

  // User is authenticated, render children
  return children
}

export default ProtectedRoute
