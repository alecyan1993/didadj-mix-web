import { useState, useRef, useEffect } from "react";
import { Play, Pause, Download, Music2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface AudioPlayerProps {
  audioUrl: string;
  mixId: string;
  duration?: number;
  targetBPM?: number;
  onDownload: () => void;
}

const AudioPlayer = ({ audioUrl, mixId, duration = 0, targetBPM = 128, onDownload }: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(duration);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setAudioDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;

  return (
    <Card className="p-6 bg-gradient-surface border-dj-border">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-dj-orange/20 rounded-full flex items-center justify-center">
              <Music2 className="w-5 h-5 text-dj-orange" />
            </div>
            <div>
              <h3 className="text-dj-text font-semibold">混音完成</h3>
              <p className="text-dj-text-muted text-sm">
                {targetBPM} BPM · {formatTime(audioDuration)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={togglePlayPause}
              className="bg-dj-orange hover:bg-dj-orange-glow text-dj-dark font-semibold px-4"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-1" />
                  暂停
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  播放
                </>
              )}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={onDownload}
              className="border-dj-border text-dj-text hover:bg-dj-surface-hover"
            >
              <Download className="w-4 h-4 mr-1" />
              下载
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[currentTime]}
            onValueChange={handleSeek}
            max={audioDuration}
            step={0.1}
            className="w-full"
          />
          
          <div className="flex justify-between text-xs text-dj-text-muted">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(audioDuration)}</span>
          </div>
        </div>

        {/* Visual Progress Indicator */}
        <div className="h-1 bg-dj-surface-hover rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-primary transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Card>
  );
};

export default AudioPlayer;