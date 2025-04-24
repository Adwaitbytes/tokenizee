
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TokenBid {
  id: string;         // Post ID
  bidder: string;     // User address
  amount: number;     // Bid amount in AR
  timestamp: string;  // When the bid was placed
  locked: boolean;    // Whether tokens are locked
  lockExpiry: string; // When the lock expires (24 hours from bid)
}

export interface TokenInfo {
  postId: string;        // Post ID
  currentPrice: number;  // Current token price
  initialPrice: number;  // Initial price
  totalBids: number;     // Number of bids
  verified: boolean;     // Whether post has been verified
}

interface TokenState {
  userBids: TokenBid[];
  tokenInfo: Record<string, TokenInfo>; // Map of postId to token info
  bidOnPost: (postId: string, amount: number, bidderAddress: string) => Promise<boolean>;
  getPostTokenInfo: (postId: string) => TokenInfo;
  getUserBidsForPost: (postId: string, address: string | null) => TokenBid[];
  resolveBid: (bidId: string) => void;
}

// Default initial token price
const DEFAULT_INITIAL_PRICE = 0.01;

export const useTokenStore = create<TokenState>()(
  persist(
    (set, get) => ({
      userBids: [],
      tokenInfo: {},
      
      bidOnPost: async (postId, amount, bidderAddress) => {
        if (!bidderAddress) return false;
        
        try {
          // Create token info if it doesn't exist
          if (!get().tokenInfo[postId]) {
            set((state) => ({
              tokenInfo: {
                ...state.tokenInfo,
                [postId]: {
                  postId,
                  currentPrice: DEFAULT_INITIAL_PRICE,
                  initialPrice: DEFAULT_INITIAL_PRICE,
                  totalBids: 0,
                  verified: false
                }
              }
            }));
          }
          
          // Calculate lock expiry (24 hours from now)
          const lockExpiry = new Date();
          lockExpiry.setHours(lockExpiry.getHours() + 24);
          
          // Create new bid
          const newBid: TokenBid = {
            id: crypto.randomUUID(),
            bidder: bidderAddress,
            amount,
            timestamp: new Date().toISOString(),
            locked: true,
            lockExpiry: lockExpiry.toISOString()
          };
          
          // Add bid to state
          set((state) => ({
            userBids: [...state.userBids, newBid],
            tokenInfo: {
              ...state.tokenInfo,
              [postId]: {
                ...state.tokenInfo[postId],
                currentPrice: state.tokenInfo[postId].currentPrice * 1.1, // Increase price by 10%
                totalBids: state.tokenInfo[postId].totalBids + 1
              }
            }
          }));
          
          return true;
        } catch (error) {
          console.error("Error bidding on post:", error);
          return false;
        }
      },
      
      getPostTokenInfo: (postId) => {
        return get().tokenInfo[postId] || {
          postId,
          currentPrice: DEFAULT_INITIAL_PRICE,
          initialPrice: DEFAULT_INITIAL_PRICE,
          totalBids: 0,
          verified: false
        };
      },
      
      getUserBidsForPost: (postId, address) => {
        if (!address) return [];
        return get().userBids.filter(
          bid => bid.bidder === address && bid.id === postId
        );
      },
      
      resolveBid: (bidId) => {
        set((state) => ({
          userBids: state.userBids.map(bid => 
            bid.id === bidId ? { ...bid, locked: false } : bid
          )
        }));
      }
    }),
    {
      name: "newsweave-tokens",
    }
  )
);
