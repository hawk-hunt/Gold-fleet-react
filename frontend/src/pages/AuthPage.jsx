import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useFormValidation } from '../hooks/useFormValidation'

const AuthPage = () => {
  const navigate = useNavigate()
  const { login, signup, token, isInitialized, loading: authLoading } = useAuth()
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Login validation
  const loginForm = useFormValidation(
    { email: '', password: '' },
    {
      email: {
        required: 'Email is required',
        email: 'Please enter a valid email address',
      },
      password: {
        required: 'Password is required',
        minLength: 'Password must be at least 8 characters',
      },
    }
  )

  // Signup validation
  const signupForm = useFormValidation(
    {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      company_name: '',
      company_email: '',
      company_phone: '',
      company_address: '',
    },
    {
      name: {
        required: 'Full name is required',
      },
      email: {
        required: 'Email is required',
        email: 'Please enter a valid email address',
      },
      password: {
        required: 'Password is required',
        minLength: 'Password must be at least 8 characters',
      },
      password_confirmation: {
        required: 'Please confirm your password',
      },
      company_name: {
        required: 'Company name is required',
      },
      company_email: {
        required: 'Company email is required',
        email: 'Please enter a valid company email address',
      },
    }
  )

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isInitialized && !authLoading && token) {
      navigate('/main', { replace: true })
    }
  }, [token, isInitialized, authLoading, navigate])

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!loginForm.isValid) {
      loginForm.setAllTouched()
      return
    }

    setError('')
    setLoading(true)

    try {
      const result = await login(loginForm.values.email, loginForm.values.password)
      
      // If login returns email_verified: false, show appropriate message
      if (!result.user?.email_verified) {
        setError('Please verify your email before logging in. Check your email for the verification link.')
        return
      }
      
      navigate('/main', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!signupForm.isValid) {
      signupForm.setAllTouched()
      return
    }

    setError('')
    setLoading(true)

    try {
      const signupData = {
        name: signupForm.values.name,
        email: signupForm.values.email,
        password: signupForm.values.password,
        password_confirmation: signupForm.values.password_confirmation,
        company_name: signupForm.values.company_name,
        company_email: signupForm.values.company_email,
        company_phone: signupForm.values.company_phone || undefined,
        company_address: signupForm.values.company_address || undefined,
      }

      await signup(signupData)
      // Ensure any existing token is cleared and do NOT auto-login.
      sessionStorage.removeItem('auth_token')
      setIsSignup(false)
      loginForm.resetForm()
      // Navigate explicitly to the login view and show a verification message
      setError('✓ Account created successfully! Please check your email for a verification link. Click the link in the email to activate your account.')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const activeForm = isSignup ? signupForm : loginForm

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Gold Fleet</h1>
          <p className="mt-2 text-gray-600">Fleet Management System</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setIsSignup(false)
                setError('')
              }}
              className={`flex-1 py-2 px-4 rounded-t-lg font-medium transition-colors ${
                !isSignup
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsSignup(true)
                setError('')
              }}
              className={`flex-1 py-2 px-4 rounded-t-lg font-medium transition-colors ${
                isSignup
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error/Success Message */}
          {error && (
            <div className={`mb-4 p-3 rounded border ${
              error.includes('✓') || error.includes('Account created')
                ? 'bg-green-100 border-green-400 text-green-700'
                : 'bg-red-100 border-red-400 text-red-700'
            }`}>
              {error}
            </div>
          )}

          {/* Login Form */}
          {!isSignup && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={loginForm.values.email}
                  onChange={loginForm.handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    loginForm.errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-yellow-600'
                  }`}
                  placeholder="you@example.com"
                />
                {loginForm.errors.email && (
                  <p className="mt-1 text-sm text-red-600">{loginForm.errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={loginForm.values.password}
                  onChange={loginForm.handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    loginForm.errors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-yellow-600'
                  }`}
                  placeholder="••••••••"
                />
                {loginForm.errors.password && (
                  <p className="mt-1 text-sm text-red-600">{loginForm.errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !loginForm.isValid}
                className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}

          {/* Signup Form */}
          {isSignup && (
            <form onSubmit={handleSignup} className="space-y-4 max-h-96 overflow-y-auto">
              {/* User Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={signupForm.values.name}
                  onChange={signupForm.handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    signupForm.errors.name
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-yellow-600'
                  }`}
                  placeholder="John Doe"
                />
                {signupForm.errors.name && (
                  <p className="mt-1 text-sm text-red-600">{signupForm.errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={signupForm.values.email}
                  onChange={signupForm.handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    signupForm.errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-yellow-600'
                  }`}
                  placeholder="you@example.com"
                />
                {signupForm.errors.email && (
                  <p className="mt-1 text-sm text-red-600">{signupForm.errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={signupForm.values.password}
                  onChange={signupForm.handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    signupForm.errors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-yellow-600'
                  }`}
                  placeholder="••••••••"
                />
                {signupForm.errors.password && (
                  <p className="mt-1 text-sm text-red-600">{signupForm.errors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={signupForm.values.password_confirmation}
                  onChange={signupForm.handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    signupForm.errors.password_confirmation
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-yellow-600'
                  }`}
                  placeholder="••••••••"
                />
                {signupForm.errors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-600">{signupForm.errors.password_confirmation}</p>
                )}
              </div>

              {/* Company Info */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Company Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    value={signupForm.values.company_name}
                    onChange={signupForm.handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      signupForm.errors.company_name
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-yellow-600'
                    }`}
                    placeholder="Acme Corp"
                  />
                  {signupForm.errors.company_name && (
                    <p className="mt-1 text-sm text-red-600">{signupForm.errors.company_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                    Company Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="company_email"
                    value={signupForm.values.company_email}
                    onChange={signupForm.handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      signupForm.errors.company_email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-yellow-600'
                    }`}
                    placeholder="company@example.com"
                  />
                  {signupForm.errors.company_email && (
                    <p className="mt-1 text-sm text-red-600">{signupForm.errors.company_email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                    Company Phone
                  </label>
                  <input
                    type="tel"
                    name="company_phone"
                    value={signupForm.values.company_phone}
                    onChange={signupForm.handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                    Company Address
                  </label>
                  <input
                    type="text"
                    name="company_address"
                    value={signupForm.values.company_address}
                    onChange={signupForm.handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                    placeholder="123 Main St, City, State 12345"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !signupForm.isValid}
                className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-4"
              >
                {loading ? 'Signing up...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthPage
