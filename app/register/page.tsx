'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AirBearLogo from '@/components/AirBearLogo'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, User, Chrome, Apple } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: ''
  })
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Force dark background on body
    document.body.style.backgroundColor = '#111827'
    document.body.style.color = '#ffffff'
    document.documentElement.style.backgroundColor = '#111827'
    
    return () => {
      // Cleanup on unmount
      document.body.style.backgroundColor = ''
      document.body.style.color = ''
      document.documentElement.style.backgroundColor = ''
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    if (!supabase) { setError('Authentication is not configured.'); setLoading(false); return }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (!acceptedTerms) {
      setError('Please accept the terms and conditions')
      setLoading(false)
      return
    }

    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              date_of_birth: formData.dateOfBirth
            }
          }
        })

        if (error) {
          setError(error.message)
        } else {
          router.push('/login?message=Registration successful! Please check your email.')
        }
      } else {
        // Mock registration - Supabase not configured
        localStorage.setItem('airbear_user', JSON.stringify({
          id: 'mock-user-id',
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName
        }))
        router.push('/book')
      }
    } catch (err) {
      setError('An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    setError('')

    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/book`
          }
        })

        if (error) {
          setError(error.message)
        }
      } else {
        // Mock Google signup
        localStorage.setItem('airbear_user', JSON.stringify({
          id: 'mock-google-user',
          email: 'user@gmail.com',
          first_name: 'Google',
          last_name: 'User'
        }))
        router.push('/book')
      }
    } catch (err) {
      setError('Google signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleAppleSignup = async () => {
    setLoading(true)
    setError('')

    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'apple',
          options: {
            redirectTo: `${window.location.origin}/book`
          }
        })

        if (error) {
          setError(error.message)
        }
      } else {
        // Mock Apple signup
        localStorage.setItem('airbear_user', JSON.stringify({
          id: 'mock-apple-user',
          email: 'user@icloud.com',
          first_name: 'Apple',
          last_name: 'User'
        }))
        router.push('/book')
      }
    } catch (err) {
      setError('Apple signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gray-900 px-4 py-12" style={{backgroundColor: '#111827', background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)', minHeight: '100vh', minWidth: '100vw'}}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <AirBearLogo size="xl" clickable={false} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Join AirBear
          </h2>
          <p className="text-sm text-green-400 font-medium">
            Start your eco-friendly journey today
          </p>
        </div>

        {/* Social Signup Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 shadow-sm hover:shadow-md"
          >
            <Chrome className="w-5 h-5 text-blue-500" />
            <span>Sign up with Google</span>
          </button>

          <button
            type="button"
            onClick={handleAppleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 bg-black hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            <Apple className="w-5 h-5" />
            <span>Sign up with Apple</span>
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">Or sign up with email</span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all placeholder-gray-400"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300 mb-1">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 mr-2 h-4 w-4 text-green-500 focus:ring-green-400 bg-gray-700 border-gray-600 rounded"
            />
            <label htmlFor="terms" className="text-sm text-gray-300">
              I agree to the{' '}
              <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                Terms and Conditions
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                Privacy Policy
              </Link>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}