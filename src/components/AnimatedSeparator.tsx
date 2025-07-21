import React from 'react';

const AnimatedSeparator = () => {
  return (
    <div className="py-12 bg-gradient-to-r from-background via-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Animated line */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary to-primary/0 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/80 to-transparent animate-slide-in-right"></div>
          </div>
          
          {/* Central icon */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse shadow-lg">
              <div className="w-3 h-3 bg-primary-foreground rounded-full"></div>
            </div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2">
            <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <div className="absolute right-1/4 top-1/2 transform -translate-y-1/2">
            <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedSeparator;