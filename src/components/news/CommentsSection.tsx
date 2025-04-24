
import React, { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { useSocialStore, ReactionType, Comment as CommentType } from "@/stores/socialStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  Lightbulb,
  HelpCircle,
  Reply,
  User
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface CommentsSectionProps {
  postId: string;
  className?: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ postId, className }) => {
  const { address, isConnected, connect } = useWallet();
  const { toast } = useToast();
  const { 
    getCommentsForPost, 
    addComment,
    addReaction,
    removeReaction,
    hasReacted,
    getReactionCountsForPost
  } = useSocialStore();
  
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  const comments = getCommentsForPost(postId);
  const reactionCounts = getReactionCountsForPost(postId);
  
  // Get only top-level comments
  const topLevelComments = comments.filter(c => !c.parentId);
  
  // Get replies for a specific comment
  const getRepliesForComment = (commentId: string) => {
    return comments.filter(c => c.parentId === commentId);
  };
  
  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    
    if (!isConnected) {
      try {
        await connect();
      } catch (error) {
        toast({
          title: "Connection Failed",
          description: "Please connect your wallet to comment",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (!address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to comment",
        variant: "destructive",
      });
      return;
    }
    
    addComment(postId, address, commentText, replyingTo);
    setCommentText("");
    setReplyingTo(null);
    
    toast({
      description: "Comment posted successfully",
    });
  };
  
  const handleReaction = async (type: ReactionType) => {
    if (!isConnected) {
      try {
        await connect();
      } catch (error) {
        toast({
          title: "Connection Failed",
          description: "Please connect your wallet to react",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (!address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to react",
        variant: "destructive",
      });
      return;
    }
    
    if (hasReacted(postId, address, type)) {
      removeReaction(postId, address, type);
    } else {
      addReaction(postId, address, type);
    }
  };
  
  const getInitials = (userAddress: string) => {
    return userAddress.substring(0, 2).toUpperCase();
  };
  
  const formatShortAddress = (userAddress: string) => {
    return `${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}`;
  };
  
  const renderComment = (comment: CommentType, isReply = false) => {
    const replies = getRepliesForComment(comment.id);
    
    return (
      <div key={comment.id} className={cn("space-y-3", isReply && "ml-8 border-l-2 border-slate-100 pl-4")}>
        <div className="flex gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-newsweave-primary/10 text-newsweave-primary text-xs">
              {getInitials(comment.userId)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {formatShortAddress(comment.userId)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2 text-xs"
                onClick={() => setReplyingTo(comment.id)}
              >
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            </div>
          </div>
        </div>
        
        {replies.length > 0 && (
          <div className="space-y-3 mt-2">
            {replies.map(reply => renderComment(reply, true))}
          </div>
        )}
        
        {replyingTo === comment.id && (
          <div className="ml-8 mt-2">
            <Textarea
              placeholder="Write a reply..."
              className="mb-2 min-h-24"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setReplyingTo(null);
                  setCommentText("");
                }}
              >
                Cancel
              </Button>
              <Button 
                size="sm"
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
              >
                Reply
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments & Reactions
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Reactions Bar */}
        <div className="flex flex-wrap gap-2 pb-4 border-b">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleReaction('like')}
            className={cn(
              "h-9 gap-2",
              address && hasReacted(postId, address, 'like') && "bg-green-50 border-green-200 text-green-700"
            )}
          >
            <ThumbsUp className="h-4 w-4" />
            <span>{reactionCounts.like}</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleReaction('dislike')}
            className={cn(
              "h-9 gap-2",
              address && hasReacted(postId, address, 'dislike') && "bg-red-50 border-red-200 text-red-700"
            )}
          >
            <ThumbsDown className="h-4 w-4" />
            <span>{reactionCounts.dislike}</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleReaction('insightful')}
            className={cn(
              "h-9 gap-2",
              address && hasReacted(postId, address, 'insightful') && "bg-blue-50 border-blue-200 text-blue-700"
            )}
          >
            <Lightbulb className="h-4 w-4" />
            <span>{reactionCounts.insightful}</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleReaction('question')}
            className={cn(
              "h-9 gap-2",
              address && hasReacted(postId, address, 'question') && "bg-amber-50 border-amber-200 text-amber-700"
            )}
          >
            <HelpCircle className="h-4 w-4" />
            <span>{reactionCounts.question}</span>
          </Button>
        </div>
        
        {/* Comment Input */}
        <div className="space-y-3">
          <div className="flex gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-newsweave-primary/10 text-newsweave-primary text-xs">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Write a comment..."
                className="mb-2"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={replyingTo !== null}
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim() || replyingTo !== null}
                >
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Comments List */}
        {topLevelComments.length > 0 ? (
          <div className="space-y-4 mt-4">
            {topLevelComments.map(comment => renderComment(comment))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <MessageSquare className="h-8 w-8 mx-auto mb-2 text-slate-300" />
            <p>Be the first to comment</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
