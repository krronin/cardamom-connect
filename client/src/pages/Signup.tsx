import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Signup.css'

export default function Signup() {
  const navigate = useNavigate()
  const { login } = useUser()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccessMessage('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:3000/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ submit: data.error || 'Signup failed. Please try again.' })
        setLoading(false)
        return
      }

      // Use context to store user and token
      login(data.user, data.token || '')

      // Success - redirect to home
      setSuccessMessage('Account created successfully! Redirecting...')
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (err) {
      setErrors({ submit: 'Network error. Please try again.' })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider: 'gmail' | 'facebook') => {
    // Placeholder for OAuth integration
    console.log(`Sign up with ${provider}`)
    // In production, integrate with OAuth providers like Firebase, Auth0, or direct OAuth
    alert(`${provider.toUpperCase()} signup coming soon!`)
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-card">
        <div className="signup-header">
          <h1>NutriBid</h1>
          <p>Create Your Account</p>
        </div>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <form onSubmit={handleSubmit} className="signup-form">
          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              className={`form-input ${errors.username ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              disabled={loading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                disabled={loading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span>Or continue with</span>
        </div>

        {/* Social Login Buttons */}
        <div className="social-login">
          <button
            type="button"
            className="social-button gmail"
            onClick={() => handleSocialLogin('gmail')}
            disabled={loading}
          >
            <span className="social-icon">🔷</span>
            <span className="social-text">Google</span>
          </button>
          <button
            type="button"
            className="social-button facebook"
            onClick={() => handleSocialLogin('facebook')}
            disabled={loading}
          >
            <span className="social-icon">🔵</span>
            <span className="social-text">Facebook</span>
          </button>
        </div>

        {/* Login Link */}
        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              className="login-link"
              onClick={() => navigate('/login')}
              disabled={loading}
            >
              Login Here
            </button>
          </p>
          <p style={{ marginTop: '12px', marginBottom: '0' }}>
            <button
              type="button"
              className="home-link"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              ← Back to Home
            </button>
          </p>
        </div>

        {/* Terms */}
        <div className="terms">
          <p>
            By signing up, you agree to our{' '}
            <a href="#terms">Terms of Service</a> and{' '}
            <a href="#privacy">Privacy Policy</a>
          </p>
        </div>
      </div>
      </div>
    </div>
  )
}
