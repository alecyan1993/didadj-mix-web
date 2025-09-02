import { useState } from "react";
import MixingStudio from "@/components/MixingStudio";
import TrackLibrary from "@/components/TrackLibrary";
import { Track } from "@/components/TrackCard";
import { Music, Sparkles } from "lucide-react";

const DJMixer = () => {
  const [droppedTracks, setDroppedTracks] = useState<Track[]>([]);

  const handleTrackDragStart = (e: React.DragEvent, track: Track) => {
    // Drag start is handled by the TrackCard component
  };

  const handleTrackDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const trackData = e.dataTransfer.getData("application/json");
    
    if (trackData) {
      try {
        const track: Track = JSON.parse(trackData);
        
        // Check if track is already in the mix
        if (droppedTracks.some(t => t.id === track.id)) {
          return;
        }
        
        // Limit to 5 tracks
        if (droppedTracks.length >= 5) {
          return;
        }
        
        setDroppedTracks(prev => [...prev, track]);
      } catch (error) {
        console.error("Failed to parse track data:", error);
      }
    }
  };

  const handleRemoveTrack = (trackId: string) => {
    setDroppedTracks(prev => prev.filter(track => track.id !== trackId));
  };

  const handleClearAll = () => {
    setDroppedTracks([]);
  };

  const handleReorderTracks = (newTracks: Track[]) => {
    setDroppedTracks(newTracks);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dj-dark via-purple-950/20 to-dj-dark">
      {/* Header */}
      <header className="bg-dj-surface/80 backdrop-blur-md border-b border-dj-border sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <Music className="w-6 h-6 text-dj-dark" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-dj-text flex items-center gap-2">
                  didaDJ <Sparkles className="w-5 h-5 text-dj-orange" />
                </h1>
                <p className="text-xs text-dj-text-muted">AI-Powered Music Mixer</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-dj-text-muted">
                {droppedTracks.length > 0 && (
                  <span className="bg-dj-orange/20 text-dj-orange px-3 py-1 rounded-full">
                    {droppedTracks.length} 首曲目已选择
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div 
        className="flex gap-6 p-6 max-w-[1600px] mx-auto"
        onDrop={handleTrackDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <div className="flex-1">
          <MixingStudio
            droppedTracks={droppedTracks}
            onRemoveTrack={handleRemoveTrack}
            onClearAll={handleClearAll}
            onReorderTracks={handleReorderTracks}
          />
        </div>
        
        <div className="w-[450px]">
          <TrackLibrary onTrackDragStart={handleTrackDragStart} />
        </div>
      </div>
    </div>
  );
};

export default DJMixer;