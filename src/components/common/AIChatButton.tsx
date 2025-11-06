git 
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Bot, Zap } from 'lucide-react';

const AIChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Simulation de l'IA qui commence à écrire
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Window - Simple version for now */}
      {isOpen && (
        <div className="mb-4 bg-white rounded-lg shadow-xl border p-4 w-80 animate-scale-in">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium">Assistant IA</span>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="bg-gray-100 rounded-lg p-3 text-sm">
              Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider avec votre apprentissage aujourd'hui ?
            </div>
            {isTyping && (
              <div className="bg-gray-100 rounded-lg p-3 text-sm flex items-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="ml-2 text-gray-500">L'IA écrit...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Button */}
      <Button
        onClick={handleClick}
        className={`
          bg-gradient-to-r from-blue-500 to-purple-500 
          hover:from-blue-600 hover:to-purple-600
          text-white shadow-lg hover:shadow-xl
          rounded-full w-14 h-14
          transition-all duration-300 ease-in-out
          transform hover:scale-110
        `}
      >
        {isOpen ? (
          <div className="transform rotate-45">
            <MessageCircle className="w-6 h-6" />
          </div>
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <Zap className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300" />
          </div>
        )}
      </Button>
    </div>
  );
};

export default AIChatButton;
