
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

export interface TokenBid {
  id: string;
  postId: string;
  userId: string;
  bidAmount: number;
  timestamp: string;
}

export interface TokenTransaction {
  id: string;
  postId: string;
  fromUser: string | null;
  toUser: string | null;
  amount: number;
  price: number;
  type: 'buy' | 'sell' | 'reward';
  timestamp: string;
}

interface TokenState {
  bids: TokenBid[];
  transactions: TokenTransaction[];
  currentPrices: Record<string, number>;
  tokenLocks: Record<string, Record<string, string>>; // postId -> userId -> unlock timestamp
  redeemableTokens: Record<string, Record<string, number>>; // postId -> userId -> amount
  lastPriceUpdate: Record<string, string>; // postId -> timestamp
  
  // Add a bid to a post
  addBid: (postId: string, userId: string, amount: number) => void;
  // Get bids for a specific post
  getBidsForPost: (postId: string) => TokenBid[];
  // Get current price for a post
  getCurrentPrice: (postId: string) => number;
  // Set initial price for a post
  setInitialPrice: (postId: string, price: number) => void;
  // Calculate new price based on bids
  calculateNewPrice: (postId: string) => number;
  // Add a transaction
  addTransaction: (transaction: Omit<TokenTransaction, 'id' | 'timestamp'>) => void;
  // Get user's token balance
  getUserTokens: (userId: string) => { postId: string; amount: number; locked: boolean; unlockTime?: string }[];
  // Get transactions for a specific user
  getUserTransactions: (userId: string) => TokenTransaction[];
  // Check if tokens are locked
  areTokensLocked: (postId: string, userId: string) => boolean;
  // Get unlock time for tokens
  getUnlockTime: (postId: string, userId: string) => string | null;
  // Redeem tokens after lock period
  redeemTokens: (postId: string, userId: string) => number;
  // Check if tokens are redeemable
  areTokensRedeemable: (postId: string, userId: string) => boolean;
  // Calculate rewards for early supporters
  calculateRewards: (postId: string, userId: string) => number;
  // Automatically increase token price over time
  increasePrice: (postId: string, percentage: number) => void;
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set, get) => ({
      bids: [],
      transactions: [],
      currentPrices: {},
      tokenLocks: {},
      redeemableTokens: {},
      lastPriceUpdate: {},
      
      addBid: (postId, userId, amount) => {
        const currentPrice = get().getCurrentPrice(postId);
        
        // Add the bid
        const newBid: TokenBid = {
          id: nanoid(),
          postId,
          userId,
          bidAmount: amount,
          timestamp: new Date().toISOString(),
        };
        
        set((state) => ({ bids: [...state.bids, newBid] }));
        
        // Record the transaction
        get().addTransaction({
          postId,
          fromUser: userId,
          toUser: null, // System/pool
          amount,
          price: currentPrice,
          type: 'buy',
        });
        
        // Lock tokens for 24 hours
        const unlockTime = new Date();
        unlockTime.setHours(unlockTime.getHours() + 24);
        
        set((state) => {
          const newTokenLocks = { ...state.tokenLocks };
          if (!newTokenLocks[postId]) {
            newTokenLocks[postId] = {};
          }
          newTokenLocks[postId][userId] = unlockTime.toISOString();
          
          return { 
            tokenLocks: newTokenLocks,
            currentPrices: {
              ...state.currentPrices,
              [postId]: get().calculateNewPrice(postId)
            },
            lastPriceUpdate: {
              ...state.lastPriceUpdate,
              [postId]: new Date().toISOString()
            }
          };
        });
      },
      
      getBidsForPost: (postId) => {
        return get().bids.filter(bid => bid.postId === postId);
      },
      
      getCurrentPrice: (postId) => {
        return get().currentPrices[postId] || 0.01; // Default price
      },
      
      setInitialPrice: (postId, price) => {
        set((state) => ({
          currentPrices: {
            ...state.currentPrices,
            [postId]: price
          },
          lastPriceUpdate: {
            ...state.lastPriceUpdate,
            [postId]: new Date().toISOString()
          }
        }));
      },
      
      increasePrice: (postId, percentage) => {
        const currentPrice = get().getCurrentPrice(postId);
        const newPrice = currentPrice * (1 + percentage / 100);
        
        set((state) => ({
          currentPrices: {
            ...state.currentPrices,
            [postId]: parseFloat(newPrice.toFixed(4))
          },
          lastPriceUpdate: {
            ...state.lastPriceUpdate,
            [postId]: new Date().toISOString()
          }
        }));
      },
      
      calculateNewPrice: (postId) => {
        // Enhanced price algorithm: 
        // Base price * (1 + 0.05 * number of bids) * (1 + 0.02 * total token amount)
        const bidsForPost = get().getBidsForPost(postId);
        const basePrice = get().currentPrices[postId] || 0.01;
        const bidCount = bidsForPost.length;
        
        const totalTokenAmount = bidsForPost.reduce((sum, bid) => sum + bid.bidAmount, 0);
        const newPrice = basePrice * (1 + 0.05 * bidCount) * (1 + 0.02 * totalTokenAmount);
        
        return parseFloat(newPrice.toFixed(4)); // Round to 4 decimal places
      },
      
      addTransaction: (transaction) => {
        const newTransaction: TokenTransaction = {
          ...transaction,
          id: nanoid(),
          timestamp: new Date().toISOString(),
        };
        
        set((state) => ({
          transactions: [...state.transactions, newTransaction]
        }));
      },
      
      getUserTokens: (userId) => {
        const transactions = get().transactions;
        const userTokens: Record<string, number> = {};
        const tokenLocks = get().tokenLocks;
        const result = [];
        
        // Calculate net tokens from transactions
        transactions.forEach(tx => {
          if (tx.fromUser === userId && tx.type === 'buy') {
            userTokens[tx.postId] = (userTokens[tx.postId] || 0) + tx.amount;
          }
          
          if (tx.toUser === userId) {
            userTokens[tx.postId] = (userTokens[tx.postId] || 0) + tx.amount;
          }
          
          if (tx.fromUser === userId && tx.type === 'sell') {
            userTokens[tx.postId] = (userTokens[tx.postId] || 0) - tx.amount;
          }
        });
        
        // Convert to array with lock information
        for (const postId in userTokens) {
          if (userTokens[postId] > 0) {
            const locked = get().areTokensLocked(postId, userId);
            result.push({
              postId,
              amount: userTokens[postId],
              locked,
              unlockTime: locked ? tokenLocks[postId]?.[userId] : undefined
            });
          }
        }
        
        return result;
      },
      
      getUserTransactions: (userId) => {
        return get().transactions.filter(tx => 
          tx.fromUser === userId || tx.toUser === userId
        );
      },
      
      areTokensLocked: (postId, userId) => {
        const locks = get().tokenLocks;
        if (!locks[postId] || !locks[postId][userId]) return false;
        
        const unlockTime = new Date(locks[postId][userId]);
        const now = new Date();
        
        return unlockTime > now;
      },
      
      getUnlockTime: (postId, userId) => {
        const locks = get().tokenLocks;
        if (!locks[postId] || !locks[postId][userId]) return null;
        
        return locks[postId][userId];
      },
      
      redeemTokens: (postId, userId) => {
        if (get().areTokensLocked(postId, userId)) {
          return 0; // Cannot redeem locked tokens
        }
        
        // Calculate how many tokens user has
        const userTokens = get().getUserTokens(userId);
        const tokenForPost = userTokens.find(t => t.postId === postId);
        
        if (!tokenForPost || tokenForPost.amount <= 0) {
          return 0;
        }
        
        const amount = tokenForPost.amount;
        const reward = get().calculateRewards(postId, userId);
        const currentPrice = get().getCurrentPrice(postId);
        
        // Record the sell transaction
        get().addTransaction({
          postId,
          fromUser: userId,
          toUser: null, // System/pool
          amount,
          price: currentPrice,
          type: 'sell',
        });
        
        // If there's a reward, record that too
        if (reward > 0) {
          get().addTransaction({
            postId,
            fromUser: null, // System/pool
            toUser: userId,
            amount: reward,
            price: currentPrice,
            type: 'reward',
          });
        }
        
        // Small price increase when tokens are redeemed
        get().increasePrice(postId, 0.5); // 0.5% increase
        
        const totalReturn = amount * currentPrice + reward;
        
        return parseFloat(totalReturn.toFixed(4));
      },
      
      areTokensRedeemable: (postId, userId) => {
        return !get().areTokensLocked(postId, userId) && 
               get().getUserTokens(userId).some(t => t.postId === postId && t.amount > 0);
      },
      
      calculateRewards: (postId, userId) => {
        // Rewards are based on how early you invested
        const bids = get().getBidsForPost(postId);
        if (bids.length === 0) return 0;
        
        // Sort bids by timestamp
        const sortedBids = [...bids].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        // Find user's earliest bid position
        const userEarliestBidIndex = sortedBids.findIndex(bid => bid.userId === userId);
        if (userEarliestBidIndex === -1) return 0;
        
        // Calculate reward factor (earlier = higher reward)
        const positionFactor = 1 - (userEarliestBidIndex / sortedBids.length);
        const totalBidAmount = sortedBids.reduce((sum, bid) => sum + bid.bidAmount, 0);
        const userBidAmount = sortedBids
          .filter(bid => bid.userId === userId)
          .reduce((sum, bid) => sum + bid.bidAmount, 0);
        
        const userBidPercentage = userBidAmount / totalBidAmount;
        const currentPrice = get().getCurrentPrice(postId);
        
        // Enhanced reward calculation:
        // Base reward: position factor * user bid percentage * current price * user bid amount * 0.1
        // Time bonus: The longer tokens are held, the bigger the bonus (up to 50%)
        const baseReward = positionFactor * userBidPercentage * currentPrice * userBidAmount * 0.1;
        
        // Find user's first bid to calculate holding time
        const userFirstBid = sortedBids.find(bid => bid.userId === userId);
        if (!userFirstBid) return baseReward;
        
        const firstBidTime = new Date(userFirstBid.timestamp).getTime();
        const currentTime = new Date().getTime();
        const hoursDiff = (currentTime - firstBidTime) / (1000 * 60 * 60);
        
        // Max time bonus is 50% after 72 hours (3 days)
        const timeBonus = Math.min(hoursDiff / 72 * 0.5, 0.5);
        const totalReward = baseReward * (1 + timeBonus);
        
        return parseFloat(totalReward.toFixed(4));
      }
    }),
    {
      name: "newsweave-tokens",
    }
  )
);
