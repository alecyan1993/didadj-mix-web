import { useState } from "react";
import { Play, Pause, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  bpm: number;
  genre: string;
  artwork: string;
  audioUrl?: string;
}

interface TrackCardProps {
  track: Track;
  onDragStart?: (e: React.DragEvent, track: Track) => void;
  isPlaying?: boolean;
  onPlayToggle?: () => void;
}

const TrackCard = ({ track, onDragStart, isPlaying = false, onPlayToggle }: TrackCardProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("application/json", JSON.stringify(track));
    if (onDragStart) {
      onDragStart(e, track);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={`bg-gradient-surface rounded-xl p-4 cursor-grab border border-dj-border hover:border-dj-orange transition-all duration-200 shadow-card hover:shadow-elevated group ${
        isDragging ? "opacity-50 scale-95" : ""
      }`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="relative mb-3">
        <img
          src={track.artwork}
          alt={track.title}
          className="w-full aspect-square object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 rounded-lg flex items-center justify-center">
          <Button
            size="sm"
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-dj-orange hover:bg-dj-orange-glow text-dj-dark p-2 rounded-full"
            onClick={onPlayToggle}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-dj-text text-sm line-clamp-1">
          {track.title}
        </h3>
        <div className="flex items-center gap-1 text-dj-text-muted text-xs">
          <User className="w-3 h-3" />
          <span className="line-clamp-1">{track.artist}</span>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-dj-text-muted">
          <Clock className="w-3 h-3" />
          <span>{track.duration}</span>
        </div>
        
        <div className="text-xs text-dj-text-muted">
          <span className="bg-dj-surface-hover px-2 py-1 rounded-full">
            {track.genre}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrackCard;