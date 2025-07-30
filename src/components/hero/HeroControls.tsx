
import React from 'react';
import { Settings, Sliders } from 'lucide-react';

interface HeroControlsProps {
  animationSpeed: number;
  colorIntensity: number;
  shapeComplexity: number;
  onAnimationSpeedChange: (value: number) => void;
  onColorIntensityChange: (value: number) => void;
  onShapeComplexityChange: (value: number) => void;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

const HeroControls: React.FC<HeroControlsProps> = ({
  animationSpeed,
  colorIntensity,
  shapeComplexity,
  onAnimationSpeedChange,
  onColorIntensityChange,
  onShapeComplexityChange,
  isVisible,
  onToggleVisibility
}) => {
  return (
    <>
      {/* Toggle button */}
      <button
        onClick={onToggleVisibility}
        className="fixed top-24 right-6 z-50 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full p-3 hover:bg-white/20 transition-all duration-300 text-white"
        title="Animation Controls"
      >
        <Sliders className="w-5 h-5" />
      </button>

      {/* Control panel */}
      <div className={`fixed top-20 right-6 z-40 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
      }`}>
        <div className="flex items-center gap-2 mb-4 text-white">
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium">Animation Controls</span>
        </div>
        
        <div className="space-y-4 min-w-[240px]">
          {/* Animation Speed */}
          <div>
            <label className="block text-xs text-white/70 mb-2">
              Vitesse d'animation
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={animationSpeed}
              onChange={(e) => onAnimationSpeedChange(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-xs text-white/60 mt-1">{animationSpeed.toFixed(1)}x</div>
          </div>

          {/* Color Intensity */}
          <div>
            <label className="block text-xs text-white/70 mb-2">
              Intensité des couleurs
            </label>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={colorIntensity}
              onChange={(e) => onColorIntensityChange(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-xs text-white/60 mt-1">{Math.round(colorIntensity * 100)}%</div>
          </div>

          {/* Shape Complexity */}
          <div>
            <label className="block text-xs text-white/70 mb-2">
              Complexité des formes
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={shapeComplexity}
              onChange={(e) => onShapeComplexityChange(Number(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="text-xs text-white/60 mt-1">Niveau {shapeComplexity.toFixed(1)}</div>
          </div>
        </div>
      </div>

      {/* Custom slider styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #ec4899, #a855f7);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: linear-gradient(45deg, #ec4899, #a855f7);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </>
  );
};

export default HeroControls;
