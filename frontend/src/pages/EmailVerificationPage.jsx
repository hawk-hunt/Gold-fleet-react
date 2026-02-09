import React, { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const id = searchParams.get('id')
  const hash = searchParams.get('hash')

  const handleVerify = async () => {
    if (!id || !hash) {
      setError('Invalid verification link')
      return
    }

    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(`http://localhost:8000/api/email/verify/${id}/${hash}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('✓ Email verified successfully! Redirecting to login...')
        setTimeout(() => {
          navigate('/auth', { replace: true })
        }, 2000)
      } else {
        setError(data.message || 'Verification failed')
      }
    } catch (err) {
      setError('An error occurred during verification: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-amber-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Gold Fleet</h1>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-gray-600">Click the button below to complete email verification</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              {message}
            </div>
          )}

          {!message && (
            <div className="space-y-4">
              <button
                onClick={handleVerify}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-yellow-600 hover:bg-yellow-700'
                }`}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>

              <p className="text-center text-sm text-gray-600">
                Check your spam folder if you don't see our email.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmailVerificationPage
