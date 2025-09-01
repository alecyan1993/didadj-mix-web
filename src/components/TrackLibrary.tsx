import { useState, useEffect } from "react";
import { Search, Filter, Music } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import TrackCard, { Track } from "./TrackCard";
import { demoAPI } from "@/lib/api";
import { toast } from "sonner";

interface TrackLibraryProps {
  onTrackDragStart?: (e: React.DragEvent, track: Track) => void;
}

const TrackLibrary = ({ onTrackDragStart }: TrackLibraryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTracks();
  }, []);

  const loadTracks = async () => {
    try {
      setLoading(true);
      const library = await demoAPI.getLibrary();
      
      // 转换API数据到Track格式
      const formattedTracks = library.tracks.map(track => ({
        id: track.id,
        title: track.title,
        artist: track.artist,
        duration: track.duration,
        bpm: track.bpm,
        genre: track.style || "Electronic",
        artwork: track.coverUrl || track.coverPath,
        audioUrl: track.audioUrl
      }));
      
      setTracks(formattedTracks);
    } catch (error) {
      console.error("Failed to load tracks:", error);
      toast.error("无法加载音乐库");
      // 使用默认数据作为后备
      setTracks([
        {
          id: "1",
          title: "混搭 LONELY SOBER",
          artist: "暗夜男孩",
          duration: "3:30",
          bpm: 128,
          genre: "Electronic",
          artwork: "/api/demo/music/covers/track1.jpg"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const genres = ["all", "Electronic", "Hip Hop", "House", "Synthwave", "Ambient", "Trap"];

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "all" || track.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="w-80 bg-dj-surface border-l border-dj-border h-screen max-h-screen flex flex-col">
      <div className="p-6 border-b border-dj-border">
        <div className="flex items-center gap-2 mb-4">
          <Music className="w-5 h-5 text-dj-orange" />
          <h2 className="text-lg font-semibold text-dj-text">曲目库</h2>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dj-text-muted" />
          <Input
            placeholder="搜索曲目或艺术家..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-dj-surface-hover border-dj-border text-dj-text"
          />
        </div>

        {/* Genre Filter */}
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Button
              key={genre}
              variant={selectedGenre === genre ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedGenre(genre)}
              className={`text-xs ${
                selectedGenre === genre
                  ? "bg-gradient-primary text-dj-dark hover:bg-gradient-primary"
                  : "border-dj-border text-dj-text-muted hover:text-dj-text hover:bg-dj-surface-hover"
              }`}
            >
              {genre === "all" ? "全部" : genre}
            </Button>
          ))}
        </div>
      </div>

      {/* Track List */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-dj-orange border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-dj-text-muted">加载音乐库中...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {filteredTracks.map((track) => (
                <TrackCard
                  key={track.id}
                  track={track}
                  onDragStart={onTrackDragStart}
                />
              ))}
            </div>

            {filteredTracks.length === 0 && (
              <div className="text-center py-8">
                <Music className="w-12 h-12 text-dj-text-muted mx-auto mb-3" />
                <p className="text-dj-text-muted">未找到匹配的曲目</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="p-4 border-t border-dj-border">
        <p className="text-xs text-dj-text-muted text-center">
          拖拽曲目到中央混音区域开始创作
        </p>
      </div>
    </div>
  );
};

export default TrackLibrary;