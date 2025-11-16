var express = require('express');
var router = express.Router();
// const { v4: uuidv4 } = require('uuid');

// Mock auction data - in production, this would come from MongoDB
const mockAuctions = [
  {
    id: 'auction-001',
    title: 'Premium Almonds',
    description: 'High-quality almonds from California',
    category: 'Nuts',
    imageUrl: '',
    startPrice: 500,
    currentPrice: 750,
    currentBidder: 'user123',
    totalBids: 12,
    endsAt: new Date(Date.now() + 10 * 60000).toISOString(), // 10 minutes from now
    remainingSeconds: 600,
    bidHistory: [
      { username: 'user1', amount: 500, timestamp: new Date(Date.now() - 300000).toISOString() },
      { username: 'user2', amount: 600, timestamp: new Date(Date.now() - 250000).toISOString() },
      { username: 'user3', amount: 750, timestamp: new Date(Date.now() - 100000).toISOString() }
    ]
  },
  {
    id: 'auction-002',
    title: 'Walnut Mix',
    description: 'Mixed walnuts from the Himalayas',
    category: 'Nuts',
    imageUrl: '',
    startPrice: 400,
    currentPrice: 650,
    currentBidder: 'user456',
    totalBids: 8,
    endsAt: new Date(Date.now() + 8 * 60000).toISOString(), // 8 minutes from now
    remainingSeconds: 480,
    bidHistory: [
      { username: 'user4', amount: 400, timestamp: new Date(Date.now() - 250000).toISOString() },
      { username: 'user5', amount: 550, timestamp: new Date(Date.now() - 150000).toISOString() },
      { username: 'user6', amount: 650, timestamp: new Date(Date.now() - 50000).toISOString() }
    ]
  },
  {
    id: 'auction-003',
    title: 'Cashews Deluxe',
    description: 'Premium cashews from Kerala',
    category: 'Nuts',
    imageUrl: '',
    startPrice: 600,
    currentPrice: 950,
    currentBidder: 'user789',
    totalBids: 15,
    endsAt: new Date(Date.now() + 12 * 60000).toISOString(), // 12 minutes from now
    remainingSeconds: 720,
    bidHistory: [
      { username: 'user7', amount: 600, timestamp: new Date(Date.now() - 400000).toISOString() },
      { username: 'user8', amount: 750, timestamp: new Date(Date.now() - 300000).toISOString() },
      { username: 'user9', amount: 950, timestamp: new Date(Date.now() - 50000).toISOString() }
    ]
  },
  {
    id: 'auction-004',
    title: 'Raisins Gold',
    description: 'Golden raisins from Gujarat',
    category: 'Dried Fruits',
    imageUrl: '',
    startPrice: 300,
    currentPrice: 520,
    currentBidder: 'user101',
    totalBids: 10,
    endsAt: new Date(Date.now() + 6 * 60000).toISOString(), // 6 minutes from now
    remainingSeconds: 360,
    bidHistory: [
      { username: 'user10', amount: 300, timestamp: new Date(Date.now() - 200000).toISOString() },
      { username: 'user11', amount: 420, timestamp: new Date(Date.now() - 120000).toISOString() },
      { username: 'user12', amount: 520, timestamp: new Date(Date.now() - 30000).toISOString() }
    ]
  },
  {
    id: 'auction-005',
    title: 'Dates Premium',
    description: 'Organic dates from Saudi Arabia',
    category: 'Dried Fruits',
    imageUrl: '',
    startPrice: 350,
    currentPrice: 580,
    currentBidder: 'user102',
    totalBids: 9,
    endsAt: new Date(Date.now() + 9 * 60000).toISOString(), // 9 minutes from now
    remainingSeconds: 540,
    bidHistory: [
      { username: 'user13', amount: 350, timestamp: new Date(Date.now() - 350000).toISOString() },
      { username: 'user14', amount: 480, timestamp: new Date(Date.now() - 200000).toISOString() },
      { username: 'user15', amount: 580, timestamp: new Date(Date.now() - 80000).toISOString() }
    ]
  }
];

// GET all auctions
router.get('/', function(req, res, next) {
  try {
    res.json(mockAuctions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch auctions' });
  }
});

// GET auction by ID
router.get('/:id', function(req, res, next) {
  try {
    const { id } = req.params;
    const auction = mockAuctions.find(a => a.id === id);
    
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    
    res.json(auction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch auction' });
  }
});

// POST subscribe to auction (for notifications)
router.post('/:id/subscribe', function(req, res, next) {
  try {
    const { id } = req.params;
    const { username, email } = req.body;
    
    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email required' });
    }
    
    const auction = mockAuctions.find(a => a.id === id);
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    
    // In production, save subscription to database
    // For now, just return success
    res.json({
      success: true,
      message: `Successfully subscribed to ${auction.title}`,
      auctionId: id,
      subscribedUser: { username, email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to subscribe to auction' });
  }
});

// POST place a bid
router.post('/:id/bid', function(req, res, next) {
  try {
    const { id } = req.params;
    const { username, bidAmount } = req.body;
    
    if (!username || !bidAmount) {
      return res.status(400).json({ error: 'Username and bid amount required' });
    }
    
    const auction = mockAuctions.find(a => a.id === id);
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    
    if (bidAmount <= auction.currentPrice) {
      return res.status(400).json({ error: 'Bid amount must be higher than current price' });
    }
    
    // Update auction
    auction.currentPrice = bidAmount;
    auction.currentBidder = username;
    auction.totalBids += 1;
    auction.bidHistory.push({
      username,
      amount: bidAmount,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: 'Bid placed successfully',
      auctionId: id,
      newPrice: bidAmount,
      bidCount: auction.totalBids
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to place bid' });
  }
});

module.exports = router;
