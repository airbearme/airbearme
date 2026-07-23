'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AirBearLogo from '@/components/AirBearLogo'
import { supabase } from '@/lib/supabase'
import { Mail, Lock, Chrome, Apple } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setError(error.message)
        } else if (data.user) {
          router.push('/book')
        }
      } else {
        // Mock authentication - Supabase not configured
        if (email && password) {
          // Accept any email/password combination for demo
          localStorage.setItem('airbear_user', JSON.stringify({
            id: 'mock-user-id',
            email,
            first_name: 'Demo',
            last_name: 'User'
          }))
          router.push('/book')
        } else {
          setError('Please enter both email and password')
        }
      }
    } catch (err) {
      setError('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
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
        // Mock Google login
        localStorage.setItem('airbear_user', JSON.stringify({
          id: 'mock-google-user',
          email: 'user@gmail.com',
          first_name: 'Google',
          last_name: 'User'
        }))
        router.push('/book')
      }
    } catch (err) {
      setError('Google login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleAppleLogin = async () => {
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
        // Mock Apple login
        localStorage.setItem('airbear_user', JSON.stringify({
          id: 'mock-apple-user',
          email: 'user@icloud.com',
          first_name: 'Apple',
          last_name: 'User'
        }))
        router.push('/book')
      }
    } catch (err) {
      setError('Apple login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-gray-900 px-4" style={{backgroundColor: '#111827', background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)', minHeight: '100vh', minWidth: '100vw'}}>
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <AirBearLogo size="xl" clickable={false} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome to AirBear
            </h2>
            <p className="text-sm text-green-400 font-medium">
              🌱 Ride Green, Snack Smart – AirBear the Eco Way!
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300 shadow-sm hover:shadow-md"
            >
              <Chrome className="w-5 h-5 text-blue-500" />
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={handleAppleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 bg-black hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              <Apple className="w-5 h-5" />
              <span>Continue with Apple</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Or continue with email</span>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all placeholder-gray-400"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all placeholder-gray-400"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Don&apos;t have an account?{' '}
                <Link
                  href="/register"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  New User
                </Link>
              </p>
            </div>
          </form>
        </div>
    </div>
  )
}