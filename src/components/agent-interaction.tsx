// src/components/agent-interaction.tsx
'use client';

import { useState, useRef, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { processUserQuery, type AgentResponse } from '@/app/actions';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { ResponseCard } from '@/components/response-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

const initialState: AgentResponse | null = null;

type ConversationEntry = {
  id: string; // Unique ID for the entry (e.g., user_timestamp, agent_timestamp, loading_timestamp)
  isUser: boolean;
  data: AgentResponse; // data.id will be the server's ID for agent responses.
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="h-full bg-primary hover:bg-primary/90" disabled={pending}>
      {pending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
      <span className="sr-only">Send</span>
    </Button>
  );
}

export function AgentInteraction() {
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  // const [formState, formAction, isFormActionPending] = useActionState(processUserQuery, initialState);

  const [loading, setLoading] = useState<boolean>(false);
  const [formState, setFormState] = useState();

const handleConnect = async (event: React.FormEvent) => {
  event.preventDefault();
  const formData = new FormData(formRef.current!);
  const prompt = formData.get("prompt")?.toString() ?? "";

  setLoading(true);
  try {
    const res = await fetch("/api/respond", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, userId: "117250109947479230497" }) // or dynamically insert userId
    });

    const data: AgentResponse = await res.json();
    setConversation(prev => [...prev, { id: Date.now().toString(), isUser: false, data }]);
  } catch (err) {
    toast({ title: "Error", description: "Something went wrong." });
  } finally {
    setLoading(false);
  }
}
  const formRef = useRef<HTMLFormElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (formState && formState.id) {
      // Check if we've already processed this specific server response
      // This is important because formState persists until the next action.
      // We only want to update conversation if this formState.id is new to the conversation
      // or if it's updating a loading state.
      const isAlreadyProcessed = conversation.some(entry => !entry.isUser && entry.data.id === formState.id && entry.data.type !== 'loading');
      
      if (isAlreadyProcessed) return;

      setConversation(prevConversation => {
        const loadingMsgIndex = prevConversation.findIndex(
          entry => !entry.isUser && entry.data.type === 'loading' && entry.data.userQuery === formState.userQuery
        );

        if (loadingMsgIndex !== -1) {
          const updatedConversation = [...prevConversation];
          updatedConversation[loadingMsgIndex] = {
            id: formState.id, // Use server-provided ID for the actual response
            isUser: false,
            data: formState,
          };
          return updatedConversation;
        } else {
          // Fallback: if no loading message found (e.g., if it was cleared, or multiple responses for one query)
          // Add the new agent response. User message should have been added by handleSubmit.
          // Ensure we don't add duplicate agent responses if this effect somehow re-runs.
          if (!prevConversation.some(entry => !entry.isUser && entry.data.id === formState.id)) {
             // Find the related user query to display if something went unusual
            const userQueryEntry = prevConversation.find(entry => entry.isUser && entry.data.userQuery === formState.userQuery);
            const entriesToAdd = [];
            if (!userQueryEntry && formState.userQuery) { // If user query is not in conversation, add it (edge case)
                entriesToAdd.push({
                    id: `${formState.id}_user_fallback`,
                    isUser: true,
                    data: { id: `${formState.id}_user_fallback`, userQuery: formState.userQuery, type: 'text', content: formState.userQuery } as AgentResponse
                });
            }
            entriesToAdd.push({ id: formState.id, isUser: false, data: formState });
            return [...prevConversation, ...entriesToAdd];
          }
        }
        return prevConversation;
      });

      if (formState.type === 'error') {
        toast({
          variant: "destructive",
          title: "Error",
          description: formState.error || "An unexpected error occurred.",
        });
      }
    }
  }, [formState, toast, conversation]);


  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [conversation]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('query') as string;

    if (!query.trim()) return;

    const optimisticIdBase = Date.now().toString();
    
    setConversation(prev => [
      ...prev,
      {
        id: optimisticIdBase + "_user",
        isUser: true,
        data: { id: optimisticIdBase + "_user", userQuery: query, type: 'text', content: query } as AgentResponse,
      },
      {
        id: optimisticIdBase + "_agent_loading",
        isUser: false,
        data: { id: optimisticIdBase + "_agent_loading", userQuery: query, type: 'loading', content: 'Thinking...' } as AgentResponse,
      }
    ]);
    
    formAction(formData); // This triggers the server action
    formRef.current?.reset();
  };
  
  // isLoading for the form based on whether any message is currently in a loading state (optimistic UI)
  const isAnyMessageLoading = conversation.some(entry => !entry.isUser && entry.data.type === 'loading');
  const isInputDisabled = isAnyMessageLoading || isFormActionPending;

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] w-full bg-card p-4 rounded-xl shadow-xl">
      <ScrollArea className="flex-grow mb-4 pr-3" ref={scrollAreaRef}>
        <div className="flex flex-col space-y-4">
          {conversation.map((entry) => (
            <ResponseCard key={entry.id} response={entry.data} isUser={entry.isUser} />
          ))}
        </div>
      </ScrollArea>
      <form ref={formRef} onSubmit={handleSubmit} className="flex items-start space-x-2 border-t pt-4">
        <Textarea
          name="query"
          placeholder="Ask AgentFlow anything..."
          className="flex-grow resize-none focus:ring-primary focus:border-primary text-sm"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (formRef.current && !isInputDisabled) { 
                formRef.current.requestSubmit();
              }
            }
          }}
          disabled={isInputDisabled} 
        />
        <SubmitButton />
      </form>
    </div>
  );
}