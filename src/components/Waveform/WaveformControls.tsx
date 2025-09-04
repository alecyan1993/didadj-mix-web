import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Flag,
  FlagOff
} from 'lucide-react';
import { WaveformControlsProps } from './types';

const WaveformControls: React.FC<WaveformControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onPlayPause,
  onAddIntroMarker,
  onAddOutroMarker,
  isPlaying,
  zoomLevel
}) => {
  return (
    <div className="flex items-center gap-4 p-3 bg-dj-surface/50 rounded-lg border border-dj-border/30">
      {/* Play/Pause */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onPlayPause}
        className="text-dj-text hover:text-dj-orange hover:bg-dj-surface-hover"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>

      <div className="h-6 w-px bg-dj-border/50" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomOut}
          className="text-dj-text hover:text-dj-orange hover:bg-dj-surface-hover"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        
        <div className="w-24">
          <Slider
            value={[zoomLevel]}
            onValueChange={([value]) => {
              if (value > zoomLevel) onZoomIn();
              else if (value < zoomLevel) onZoomOut();
            }}
            min={10}
            max={1000}
            step={10}
            className="cursor-pointer"
          />
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomIn}
          className="text-dj-text hover:text-dj-orange hover:bg-dj-surface-hover"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onZoomReset}
          className="text-dj-text hover:text-dj-orange hover:bg-dj-surface-hover"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>

      <div className="h-6 w-px bg-dj-border/50" />

      {/* Marker Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onAddIntroMarker}
          className="text-xs border-green-500/50 text-green-500 hover:bg-green-500/10"
        >
          <Flag className="w-3 h-3 mr-1" />
          Intro
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onAddOutroMarker}
          className="text-xs border-red-500/50 text-red-500 hover:bg-red-500/10"
        >
          <FlagOff className="w-3 h-3 mr-1" />
          Outro
        </Button>
      </div>

      {/* Zoom Level Display */}
      <div className="ml-auto text-xs text-dj-text-muted">
        Zoom: {Math.round(zoomLevel)}x
      </div>
    </div>
  );
};

export default WaveformControls;