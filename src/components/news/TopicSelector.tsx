
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type Topic = {
  id: string;
  name: string;
  count?: number;
};

interface TopicSelectorProps {
  topics: Topic[];
  onSelectTopic: (topicId: string) => void;
  selectedTopic?: string;
  className?: string;
}

export function TopicSelector({ topics, onSelectTopic, selectedTopic, className }: TopicSelectorProps) {
  // Add "All" as the first topic if not present
  const allTopics = [
    { id: "all", name: "All", count: topics.reduce((acc, topic) => acc + (topic.count || 0), 0) },
    ...topics,
  ];

  return (
    <ScrollArea className={cn("w-full pb-2", className)}>
      <div className="flex space-x-2 pb-4 px-1">
        {allTopics.map(topic => (
          <button
            key={topic.id}
            onClick={() => onSelectTopic(topic.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              "border",
              selectedTopic === topic.id 
                ? "bg-newsweave-primary text-white border-newsweave-primary" 
                : "bg-white text-newsweave-text hover:bg-slate-100 border-slate-200"
            )}
          >
            {topic.name}
            {topic.count !== undefined && (
              <span className={cn(
                "ml-1.5 px-1.5 py-0.5 text-xs rounded-full",
                selectedTopic === topic.id 
                  ? "bg-white/20 text-white" 
                  : "bg-slate-100 text-newsweave-muted"
              )}>
                {topic.count}
              </span>
            )}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
