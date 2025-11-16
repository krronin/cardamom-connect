import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Header.css'
import type { User } from '../context/UserContext'

interface HeaderProps {
  user: User | null
  onLogout: () => void
}

export default function Header({ user, onLogout }: HeaderProps) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [saveMessage, setSaveMessage] = useState('')

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen)
    setProfileOpen(false)
  }

  const handleProfileToggle = () => {
    setProfileOpen(!profileOpen)
    setMenuOpen(false)
  }

  const handleCloseMenus = () => {
    setMenuOpen(false)
    setProfileOpen(false)
  }

  const handleNavigate = (path: string) => {
    navigate(path)
    handleCloseMenus()
  }

  const handleEditProfile = () => {
    setEditingProfile(true)
    setFormErrors({})
    setSaveMessage('')
  }

  const handleCancelEdit = () => {
    setEditingProfile(false)
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
    })
    setFormErrors({})
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.username.trim()) {
      errors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveProfile = () => {
    if (!validateForm()) return

    setSaveMessage('Profile updated successfully! ✅')
    setEditingProfile(false)

    // Clear message after 2 seconds
    setTimeout(() => {
      setSaveMessage('')
    }, 2000)
  }

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo */}
        <div className="header-logo">
          <button
            className="logo-btn"
            onClick={() => handleNavigate('/')}
            title="Go to Home"
          >
            🌰 <span className="logo-text">NutriBid</span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav-desktop">
          <a href="#" onClick={() => handleNavigate('/')}>Home</a>
          <a href="#" onClick={() => handleNavigate('/auctions')}>Auctions</a>
          <a href="#" onClick={() => handleNavigate('/bids')}>My Bids</a>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {user ? (
            <>
              {/* Mobile Menu Toggle */}
              <button
                className="menu-toggle"
                onClick={handleMenuToggle}
                title="Toggle menu"
              >
                ☰
              </button>

              {/* Profile Avatar */}
              <div className="profile-container">
                <button
                  className="profile-avatar"
                  onClick={handleProfileToggle}
                  title="Open profile menu"
                >
                  <div className="avatar">
                    {getInitials(user.username)}
                  </div>
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-header">
                      <div className="profile-info">
                        <p className="profile-username">{user.username}</p>
                        <p className="profile-email">{user.email}</p>
                      </div>
                    </div>

                    {!editingProfile ? (
                      <>
                        <button
                          className="profile-menu-item"
                          onClick={() => {
                            handleNavigate('/profile')
                            setEditingProfile(false)
                          }}
                        >
                          👤 My Profile
                        </button>
                        <button
                          className="profile-menu-item"
                          onClick={handleEditProfile}
                        >
                          ✏️ Edit Profile
                        </button>
                        <button
                          className="profile-menu-item"
                          onClick={() => handleNavigate('/settings')}
                        >
                          ⚙️ Settings
                        </button>
                        <div className="profile-divider"></div>
                        <button
                          className="profile-menu-item logout"
                          onClick={() => {
                            onLogout()
                            handleCloseMenus()
                          }}
                        >
                          🚪 Logout
                        </button>
                      </>
                    ) : (
                      <div className="edit-profile-form">
                        <h4>Edit Profile</h4>

                        {saveMessage && (
                          <div className="message success">{saveMessage}</div>
                        )}

                        <div className="form-group">
                          <label htmlFor="username">Username</label>
                          <input
                            id="username"
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleFormChange}
                            className={formErrors.username ? 'error' : ''}
                          />
                          {formErrors.username && (
                            <span className="error-text">
                              {formErrors.username}
                            </span>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="email">Email</label>
                          <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleFormChange}
                            className={formErrors.email ? 'error' : ''}
                          />
                          {formErrors.email && (
                            <span className="error-text">{formErrors.email}</span>
                          )}
                        </div>

                        <div className="form-actions">
                          <button
                            className="btn-save"
                            onClick={handleSaveProfile}
                          >
                            Save
                          </button>
                          <button
                            className="btn-cancel"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="header-auth">
              <button
                className="btn-login"
                onClick={() => handleNavigate('/login')}
              >
                Login
              </button>
              <button
                className="btn-signup"
                onClick={() => handleNavigate('/signup')}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && user && (
        <nav className="mobile-menu">
          <a href="#" onClick={() => handleNavigate('/')}>
            🏠 Home
          </a>
          <a href="#" onClick={() => handleNavigate('/auctions')}>
            🔴 Live Auctions
          </a>
          <a href="#" onClick={() => handleNavigate('/bids')}>
            📊 My Bids
          </a>
          <a href="#" onClick={() => handleNavigate('/notifications')}>
            🔔 Notifications
          </a>
        </nav>
      )}

      {/* Overlay for closing menus */}
      {(menuOpen || profileOpen) && (
        <div className="header-overlay" onClick={handleCloseMenus}></div>
      )}
    </header>
  )
}
