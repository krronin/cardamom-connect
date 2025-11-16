import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Login.css'

export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ identifier: '', password: '' })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.identifier || !formData.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:3000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      // Use context to store user and token
      // login(data.user, data.token)

      // Redirect to home or dashboard
      navigate('/')
    } catch (err) {
      setError('Network error. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSignupClick = () => {
    navigate('/signup')
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
        <div className="login-header">
          <h1>NutriBid</h1>
          <p>Welcome Back</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">

          <div className="form-group">
            <label htmlFor="identifier">Email or Username</label>
            <input
              id="identifier"
              type="text"
              name="identifier"
              placeholder="Enter your email or username"
              value={formData.identifier}
              onChange={handleChange}
              className="form-input"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
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
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account?</p>
          <button
            type="button"
            className="signup-link"
            onClick={handleSignupClick}
            disabled={loading}
          >
            Sign Up Here
          </button>
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

        <div className="demo-credentials">
          <p className="demo-label">Demo Credentials:</p>
          <code>Username: user1 | Password: pass1</code>
        </div>
      </div>
      </div>
    </div>
  )
}
