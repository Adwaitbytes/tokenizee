
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Topic {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  followersCount: number;
  postsCount: number;
}

interface TopicStore {
  topics: Topic[];
  followedTopics: string[];
  addTopic: (topic: Omit<Topic, 'id' | 'followersCount' | 'postsCount'>) => Topic;
  followTopic: (topicId: string) => void;
  unfollowTopic: (topicId: string) => void;
  isFollowing: (topicId: string) => boolean;
}

// Initial topics
const initialTopics: Topic[] = [
  {
    id: '1',
    name: 'Technology',
    description: 'Latest in tech, programming, AI, and digital trends',
    imageUrl: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b',
    followersCount: 1243,
    postsCount: 89
  },
  {
    id: '2',
    name: 'Web3',
    description: 'Blockchain technology, DeFi, NFTs, and decentralized applications',
    imageUrl: 'https://images.unsplash.com/photo-1639322537504-6427a16b0a28',
    followersCount: 952,
    postsCount: 62
  },
  {
    id: '3',
    name: 'Business',
    description: 'Entrepreneurship, startups, finance, and market trends',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf',
    followersCount: 722,
    postsCount: 41
  }
];

export const useTopicStore = create<TopicStore>()(
  persist(
    (set, get) => ({
      topics: initialTopics,
      followedTopics: [],
      
      addTopic: (topicData) => {
        const newTopic: Topic = {
          id: crypto.randomUUID(),
          ...topicData,
          followersCount: 1,
          postsCount: 0
        };
        
        set((state) => ({
          topics: [...state.topics, newTopic],
          followedTopics: [...state.followedTopics, newTopic.id]
        }));
        
        return newTopic;
      },
      
      followTopic: (topicId) => {
        if (!get().isFollowing(topicId)) {
          set((state) => ({
            followedTopics: [...state.followedTopics, topicId],
            topics: state.topics.map(topic => 
              topic.id === topicId 
                ? { ...topic, followersCount: topic.followersCount + 1 }
                : topic
            )
          }));
        }
      },
      
      unfollowTopic: (topicId) => {
        if (get().isFollowing(topicId)) {
          set((state) => ({
            followedTopics: state.followedTopics.filter(id => id !== topicId),
            topics: state.topics.map(topic => 
              topic.id === topicId 
                ? { ...topic, followersCount: Math.max(0, topic.followersCount - 1) }
                : topic
            )
          }));
        }
      },
      
      isFollowing: (topicId) => {
        return get().followedTopics.includes(topicId);
      }
    }),
    {
      name: "newsweave-topics",
    }
  )
);
