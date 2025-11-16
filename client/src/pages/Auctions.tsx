import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../styles/Auctions.css'

interface BidHistory {
  username: string
  amount: number
  timestamp: string
}

interface AuctionItem {
  id: string
  title: string
  description?: string
  category?: string
  imageUrl?: string
  startPrice?: number
  currentPrice?: number
  currentBidder?: string
  totalBids?: number
  endsAt: string
  remainingSeconds?: number
  bidHistory?: BidHistory[]
}

export default function Auctions() {
  const { id: selectedAuctionId } = useParams()
  const [auctions, setAuctions] = useState<AuctionItem[]>([])
  const [selectedAuction, setSelectedAuction] = useState<AuctionItem | null>(null)
  const [detailedView, setDetailedView] = useState(false)
  const [bidAmount, setBidAmount] = useState('')
  const [bidError, setBidError] = useState('')
  const [subscribeError, setSubscribeError] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [bidding] = useState(false)
  const [subscribing] = useState(false)

  // Fetch auctions
  useEffect(() => {
    async function fetchAuctions() {
      try {
        const res = await fetch('http://localhost:3000/auctions')
        if (!res.ok) {
          setAuctions([])
          return
        }
        const list = await res.json()
        setAuctions(Array.isArray(list) ? list : [])

        // If there's a selected auction in URL params, fetch its details
        if (selectedAuctionId) {
          const selected = (Array.isArray(list) ? list : []).find(
            (a: AuctionItem) => a.id === selectedAuctionId
          )
          if (selected) {
            setSelectedAuction(selected)
            setDetailedView(true)
          }
        }
      } catch (err) {
        console.error('Failed to fetch auctions:', err)
        setAuctions([])
      }
    }

    fetchAuctions()
    const interval = window.setInterval(fetchAuctions, 20000)
    return () => clearInterval(interval)
  }, [selectedAuctionId])

  // Countdown timer
  useEffect(() => {
    const tick = window.setInterval(() => {
      setAuctions(prev =>
        prev.map(auction => ({
          ...auction,
          remainingSeconds: Math.max(0, (auction.remainingSeconds || 0) - 1)
        }))
      )

      if (selectedAuction) {
        setSelectedAuction(prev => {
          if (!prev) return prev
          return {
            ...prev,
            remainingSeconds: Math.max(0, (prev.remainingSeconds || 0) - 1)
          }
        })
      }
    }, 1000)

    return () => clearInterval(tick)
  }, [selectedAuction])

  function formatCountdown(seconds: number) {
    const mm = Math.floor(seconds / 60)
    const ss = seconds % 60
    return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
  }

  function formatCurrency(amount: number | undefined) {
    if (!amount) return '—'
    return `₹${amount.toLocaleString()}`
  }

  const handleSelectAuction = (auction: AuctionItem) => {
    setSelectedAuction(auction)
    setDetailedView(true)
    setBidError('')
    setSubscribeError('')
    setIsSubscribed(false)
    setBidAmount('')
  }

  const handleCloseDetail = () => {
    setDetailedView(false)
    setSelectedAuction(null)
    setDetailedView(false)
    setBidError('')
    setSubscribeError('')
    setIsSubscribed(false)
    setBidAmount('')
  }

  const handlePlaceBid = async () => {
    // ignore
  }

  return (
    <div className="auctions-page">
      
      {/* Header */}
      <div className="auctions-header">
        <h1>🔴 Live Auctions</h1>
        <p>Real-time bidding on premium dry fruits</p>
      </div>

      {/* Auctions Grid */}
      <div className="auctions-container">
        <div className="auctions-list">
          {auctions.length === 0 && (
            <div className="no-auctions">
              <p>No active auctions available</p>
            </div>
          )}

          {auctions.map(auction => (
            <div
              key={auction.id}
              className="auction-card-item"
              onClick={() => handleSelectAuction(auction)}
            >
              <div className="card-image">
                {auction.imageUrl ? (
                  <img src={auction.imageUrl} alt={auction.title} />
                ) : (
                  <div className="image-placeholder">🌰</div>
                )}
              </div>

              <div className="card-content">
                <h3>{auction.title}</h3>
                <p className="card-category">{auction.category || 'Dry Fruits'}</p>
                <p className="card-description">{auction.description}</p>

                <div className="card-stats">
                  <div className="stat">
                    <span className="label">Current Price:</span>
                    <span className="value">
                      {formatCurrency(auction.currentPrice)}
                    </span>
                  </div>
                  <div className="stat">
                    <span className="label">Bids:</span>
                    <span className="value">{auction.totalBids || 0}</span>
                  </div>
                </div>

                <div className="card-footer">
                  <div
                    className={`timer ${
                      (auction.remainingSeconds || 0) <= 60 ? 'critical' : ''
                    }`}
                  >
                    ⏱ {formatCountdown(auction.remainingSeconds || 0)}
                  </div>
                  <button className="btn-view">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed View Modal */}
      {detailedView && selectedAuction && (
        <div className="detail-modal-overlay" onClick={handleCloseDetail}>
          <div className="detail-modal" onClick={e => e.stopPropagation()}>
            {/* Close Button */}
            <button className="close-btn" onClick={handleCloseDetail}>
              ✕
            </button>

            {/* Modal Content */}
            <div className="modal-content">
              {/* Image Section */}
              <div className="detail-image">
                {selectedAuction.imageUrl ? (
                  <img src={selectedAuction.imageUrl} alt={selectedAuction.title} />
                ) : (
                  <div className="image-placeholder">🌰</div>
                )}
              </div>

              {/* Info Section */}
              <div className="detail-info">
                <h2>{selectedAuction.title}</h2>
                <p className="detail-category">
                  {selectedAuction.category || 'Dry Fruits'}
                </p>
                <p className="detail-description">{selectedAuction.description}</p>

                {/* Auction Stats */}
                <div className="auction-stats">
                  <div className="stat-box">
                    <label>Start Price</label>
                    <p>{formatCurrency(selectedAuction.startPrice)}</p>
                  </div>
                  <div className="stat-box">
                    <label>Current Price</label>
                    <p className="current-price">
                      {formatCurrency(selectedAuction.currentPrice)}
                    </p>
                  </div>
                  <div className="stat-box">
                    <label>Total Bids</label>
                    <p>{selectedAuction.totalBids || 0}</p>
                  </div>
                  <div className="stat-box">
                    <label>Time Remaining</label>
                    <p className={selectedAuction.remainingSeconds! <= 60 ? 'critical' : ''}>
                      {formatCountdown(selectedAuction.remainingSeconds || 0)}
                    </p>
                  </div>
                </div>

                {/* Current Bidder */}
                {selectedAuction.currentBidder && (
                  <div className="current-bidder">
                    <p>
                      <strong>Leading Bid:</strong> {selectedAuction.currentBidder}
                    </p>
                  </div>
                )}

                {/* Bid History */}
                {selectedAuction.bidHistory && selectedAuction.bidHistory.length > 0 && (
                  <div className="bid-history">
                    <h4>Recent Bids</h4>
                    <div className="bid-list">
                      {selectedAuction.bidHistory.slice(-5).map((bid, idx) => (
                        <div key={idx} className="bid-item">
                          <span className="bid-user">{bid.username}</span>
                          <span className="bid-amount">
                            {formatCurrency(bid.amount)}
                          </span>
                          <span className="bid-time">
                            {new Date(bid.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Section */}
                  <div className="action-section">
                    {/* Subscribe */}
                    <div className="subscribe-section">
                      <button
                        className={`btn-subscribe ${isSubscribed ? 'subscribed' : ''}`}
                        disabled={subscribing || isSubscribed}
                      >
                        {isSubscribed ? '🔔 Subscribed' : '🔔 Subscribe for Alerts'}
                      </button>
                      {subscribeError && (
                        <p className={`message ${isSubscribed ? 'success' : 'error'}`}>
                          {subscribeError}
                        </p>
                      )}
                    </div>

                    {/* Bid Section */}
                    <div className="bid-section">
                      <div className="bid-input-group">
                        <input
                          type="number"
                          className="bid-input"
                          placeholder={`Minimum: ₹${(selectedAuction.currentPrice || 0) + 1}`}
                          value={bidAmount}
                          onChange={e => {
                            setBidAmount(e.target.value)
                            setBidError('')
                          }}
                          disabled={bidding}
                          min={selectedAuction.currentPrice! + 1}
                        />
                        <button
                          className="btn-bid"
                          onClick={handlePlaceBid}
                          disabled={bidding || !bidAmount}
                        >
                          {bidding ? 'Placing Bid...' : 'Place Bid'}
                        </button>
                      </div>
                      {bidError && (
                        <p className={`message ${bidError.includes('successfully') ? 'success' : 'error'}`}>
                          {bidError}
                        </p>
                      )}
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
