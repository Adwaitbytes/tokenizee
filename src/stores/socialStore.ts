
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

export type ReactionType = 'like' | 'dislike' | 'insightful' | 'question';

export interface Reaction {
  id: string;
  postId: string;
  userId: string;
  type: ReactionType;
  timestamp: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  timestamp: string;
  parentId?: string;
  reactions: Reaction[];
}

interface SocialState {
  reactions: Reaction[];
  comments: Comment[];
  
  // Add a reaction to a post
  addReaction: (postId: string, userId: string, type: ReactionType) => void;
  // Remove a reaction from a post
  removeReaction: (postId: string, userId: string, type: ReactionType) => void;
  // Check if user has already reacted with specific type
  hasReacted: (postId: string, userId: string, type: ReactionType) => boolean;
  // Get all reactions for a post
  getReactionsForPost: (postId: string) => Reaction[];
  // Get reaction counts by type for a post
  getReactionCountsForPost: (postId: string) => Record<ReactionType, number>;
  
  // Add a comment to a post
  addComment: (postId: string, userId: string, content: string, parentId?: string) => void;
  // Get all comments for a post
  getCommentsForPost: (postId: string) => Comment[];
  // Add a reaction to a comment
  addCommentReaction: (commentId: string, userId: string, type: ReactionType) => void;
  // Remove a reaction from a comment
  removeCommentReaction: (commentId: string, userId: string, type: ReactionType) => void;
}

export const useSocialStore = create<SocialState>()(
  persist(
    (set, get) => ({
      reactions: [],
      comments: [],
      
      addReaction: (postId, userId, type) => {
        // First check if the user has already reacted with this type
        if (get().hasReacted(postId, userId, type)) {
          return;
        }
        
        const newReaction: Reaction = {
          id: nanoid(),
          postId,
          userId,
          type,
          timestamp: new Date().toISOString(),
        };
        
        set((state) => ({
          reactions: [...state.reactions, newReaction]
        }));
      },
      
      removeReaction: (postId, userId, type) => {
        set((state) => ({
          reactions: state.reactions.filter(
            r => !(r.postId === postId && r.userId === userId && r.type === type)
          )
        }));
      },
      
      hasReacted: (postId, userId, type) => {
        return get().reactions.some(
          r => r.postId === postId && r.userId === userId && r.type === type
        );
      },
      
      getReactionsForPost: (postId) => {
        return get().reactions.filter(r => r.postId === postId);
      },
      
      getReactionCountsForPost: (postId) => {
        const reactions = get().getReactionsForPost(postId);
        const counts: Record<ReactionType, number> = {
          like: 0,
          dislike: 0,
          insightful: 0,
          question: 0
        };
        
        reactions.forEach(r => {
          counts[r.type]++;
        });
        
        return counts;
      },
      
      addComment: (postId, userId, content, parentId) => {
        const newComment: Comment = {
          id: nanoid(),
          postId,
          userId,
          content,
          timestamp: new Date().toISOString(),
          parentId,
          reactions: []
        };
        
        set((state) => ({
          comments: [...state.comments, newComment]
        }));
      },
      
      getCommentsForPost: (postId) => {
        return get().comments.filter(c => c.postId === postId);
      },
      
      addCommentReaction: (commentId, userId, type) => {
        set((state) => ({
          comments: state.comments.map(comment => {
            if (comment.id === commentId) {
              // Check if user already reacted with this type
              const hasReacted = comment.reactions.some(
                r => r.userId === userId && r.type === type
              );
              
              if (hasReacted) {
                return comment;
              }
              
              return {
                ...comment,
                reactions: [
                  ...comment.reactions,
                  {
                    id: nanoid(),
                    postId: comment.postId,
                    userId,
                    type,
                    timestamp: new Date().toISOString()
                  }
                ]
              };
            }
            return comment;
          })
        }));
      },
      
      removeCommentReaction: (commentId, userId, type) => {
        set((state) => ({
          comments: state.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                reactions: comment.reactions.filter(
                  r => !(r.userId === userId && r.type === type)
                )
              };
            }
            return comment;
          })
        }));
      },
    }),
    {
      name: "newsweave-social",
    }
  )
);
