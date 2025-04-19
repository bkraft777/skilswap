
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from '@/hooks/useAuth';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

export const MessageList = ({ messages }: { messages: Message[] }) => {
  const { user } = useAuth();

  return (
    <ScrollArea className="h-[500px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {messages?.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
          >
            <Card className={`max-w-[80%] ${
              message.sender_id === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
            }`}>
              <CardContent className="p-3">
                <p className="text-sm">{message.content}</p>
                <span className="text-xs opacity-70">
                  {new Date(message.created_at).toLocaleTimeString()}
                </span>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
