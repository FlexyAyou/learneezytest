
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage = ({ 
  title = "Une erreur s'est produite", 
  message, 
  onRetry, 
  className = '' 
}: ErrorMessageProps) => {
  return (
    <Card className={`border-red-200 ${className}`}>
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-600 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ErrorMessage;
