
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
  fromUser: string;
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
  getUserTokens: (userId: string) => { postId: string; amount: number }[];
  // Get transactions for a specific user
  getUserTransactions: (userId: string) => TokenTransaction[];
}

export const useTokenStore = create<TokenState>()(
  persist(
    (set, get) => ({
      bids: [],
      transactions: [],
      currentPrices: {},
      
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
        
        // Recalculate price
        const newPrice = get().calculateNewPrice(postId);
        set((state) => ({
          currentPrices: {
            ...state.currentPrices,
            [postId]: newPrice
          }
        }));
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
          }
        }));
      },
      
      calculateNewPrice: (postId) => {
        // Simple price increase algorithm:
        // New price = base price * (1 + 0.05 * number of bids)
        // This creates a 5% increase for each new bid
        const bidsForPost = get().getBidsForPost(postId);
        const basePrice = get().currentPrices[postId] || 0.01;
        const newPrice = basePrice * (1 + 0.05 * bidsForPost.length);
        
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
        
        return Object.entries(userTokens).map(([postId, amount]) => ({
          postId,
          amount
        }));
      },
      
      getUserTransactions: (userId) => {
        return get().transactions.filter(tx => 
          tx.fromUser === userId || tx.toUser === userId
        );
      },
    }),
    {
      name: "newsweave-tokens",
    }
  )
);
