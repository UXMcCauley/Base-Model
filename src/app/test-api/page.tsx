'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';

export default function NewPage() {
  const [accessToken, setAccessToken] = useState('');
  const [baseURL, setBaseURL] = useState('');
  const [objectId, setObjectId] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle submission logic here, e.g., storing values or making an API call
    console.log('Access Token:', accessToken);
    console.log('Base URL:', baseURL);
    console.log('Object ID:', objectId);

    toast({
      title: 'Submitted!',
      description: 'Your inputs have been logged to the console.',
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>Enter your access token, base URL, and object ID.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="accessToken">Access Token</Label>
                <Input
                  id="accessToken"
                  placeholder="Enter your access token"
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="baseURL">Base URL</Label>
                <Input
                  id="baseURL"
                  placeholder="Enter your base URL"
                  value={baseURL}
                  onChange={(e) => setBaseURL(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="objectId">Object ID</Label>
                <Input
                  id="objectId"
                  placeholder="Enter your object ID"
                  value={objectId}
                  onChange={(e) => setObjectId(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit">Submit</Button>
          </CardFooter>
        </form>
      </Card>
      <Toaster />
    </main>
  );
}