// src/components/response-card.tsx
'use client';

import type { AgentResponse } from '@/app/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';

interface ResponseCardProps {
  response: AgentResponse;
  isUser: boolean;
}

const DownloadButton: React.FC<{ data: string; filename: string; contentType: string; children: React.ReactNode }> = ({ data, filename, contentType, children }) => {
  const handleDownload = () => {
    const blob = new Blob([data], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleDownload} variant="outline" size="sm">
      <Download className="mr-2 h-4 w-4" />
      {children}
    </Button>
  );
};

export function ResponseCard({ response, isUser }: ResponseCardProps) {
  const cardClasses = isUser ? "bg-secondary" : "bg-card shadow-md";
  const alignClasses = isUser ? "self-end" : "self-start";

  return (
    <Card className={`w-full max-w-2xl mb-4 ${cardClasses} ${alignClasses} rounded-xl`}>
      <CardHeader className="pb-3 pt-4 px-4">
        <CardTitle className={`text-sm font-semibold flex items-center ${isUser ? 'text-primary' : 'text-accent'}`}>
          {isUser ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
              </svg>
              You
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                 <path d="M12.378 1.602a.75.75 0 0 0-.756 0L3.032 6.042A.75.75 0 0 0 2.75 6.75v10.5c0 .246.14.467.36.603l8.75 4.75a.75.75 0 0 0 .78 0l8.75-4.75a.75.75 0 0 0 .36-.603V6.75a.75.75 0 0 0-.282-.708L12.378 1.602ZM12 3.207l7.968 4.22-4.412 2.395L12 7.728V3.207Zm-1.5 5.428 4.412 2.395-4.412 2.395v4.412l-4.412-2.395V8.635Zm.001 1.043L6.088 7.284l4.412-2.395L15.912 7.284l-4.412 2.395Z" />
              </svg>
              AgentFlow
            </>
          )}
        </CardTitle>
        {isUser && <CardDescription className="text-xs pt-1">{response.userQuery}</CardDescription>}
      </CardHeader>
      {!isUser && (
        <CardContent className="text-sm whitespace-pre-wrap px-4 pb-4">
          {response.type === 'loading' && (
            <div className="flex items-center text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}
          {response.type === 'text' && <p>{response.content}</p>}
          {response.type === 'documentOutline' && (
            <div>
              <h4 className="font-medium mb-2 text-accent">Document Outline:</h4>
              <pre className="bg-muted p-3 rounded-md text-xs overflow-x-auto">{response.content}</pre>
            </div>
          )}
          {response.type === 'error' && (
            <div className="text-destructive flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 shrink-0" />
              <div>
                <p className="font-medium">Error:</p>
                <p>{response.error || 'An unknown error occurred.'}</p>
              </div>
            </div>
          )}
        </CardContent>
      )}
      {!isUser && (response.type === 'csv' || response.type === 'documentOutline') && response.filename && (
        <CardFooter className="px-4 pb-3 pt-0">
          {response.type === 'csv' && (
            <DownloadButton data={response.content} filename={response.filename} contentType="text/csv">
              Download CSV ({response.filename})
            </DownloadButton>
          )}
          {response.type === 'documentOutline' && (
             <DownloadButton data={response.content} filename={response.filename} contentType="text/plain">
              Download Outline ({response.filename})
            </DownloadButton>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
