import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import MixingStudio from "@/components/MixingStudio";
import TrackLibrary from "@/components/TrackLibrary";
import { Track } from "@/components/TrackCard";

const DJMixer = () => {
  const [activeSection, setActiveSection] = useState("new-music");
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
    <div className="min-h-screen bg-dj-dark flex">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <div 
        className="flex-1 flex"
        onDrop={handleTrackDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <MixingStudio
          droppedTracks={droppedTracks}
          onRemoveTrack={handleRemoveTrack}
          onClearAll={handleClearAll}
          onReorderTracks={handleReorderTracks}
        />
        
        <TrackLibrary onTrackDragStart={handleTrackDragStart} />
      </div>
    </div>
  );
};

export default DJMixer;