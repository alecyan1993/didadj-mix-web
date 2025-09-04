import { useState, useRef } from "react";
import { Trash2, Download, Zap, Settings, GripVertical, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Track } from "./TrackCard";
import { toast } from "sonner";
import { demoAPI } from "@/lib/api";
import AudioPlayer from "./AudioPlayer";
import Waveform from "./Waveform";
import { WaveformRegion } from "./Waveform/types";

interface MixingStudioProps {
  droppedTracks: Track[];
  onRemoveTrack: (trackId: string) => void;
  onClearAll: () => void;
  onReorderTracks?: (tracks: Track[]) => void;
}

const MixingStudio = ({ droppedTracks, onRemoveTrack, onClearAll, onReorderTracks }: MixingStudioProps) => {
  const [targetBPM, setTargetBPM] = useState<number>(128);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMixId, setCurrentMixId] = useState<string | null>(null);
  const [completedMixId, setCompletedMixId] = useState<string | null>(null);
  const [mixDuration, setMixDuration] = useState<number>(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [showWaveforms, setShowWaveforms] = useState(false);
  const [trackRegions, setTrackRegions] = useState<Record<string, WaveformRegion[]>>({});
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // This will be handled by the parent component
  };

  const handleAIMix = async () => {
    if (droppedTracks.length < 2) {
      toast.error("需要至少2首曲目才能混音");
      return;
    }

    if (droppedTracks.length > 5) {
      toast.error("最多支持5首曲目混音");
      return;
    }

    setIsProcessing(true);
    
    try {
      // 提取track IDs
      const trackIds = droppedTracks.map(track => track.id);
      
      // 创建混音任务
      toast.info("正在创建混音任务...");
      const mixResponse = await demoAPI.createMix(trackIds, targetBPM);
      setCurrentMixId(mixResponse.mixId);
      
      // 轮询状态直到完成
      toast.info("AI正在处理混音...");
      const mixStatus = await demoAPI.waitForMixCompletion(mixResponse.mixId);
      
      if (mixStatus.status === 'completed') {
        toast.success("混音完成！可以播放试听");
        
        // 保存完成的混音信息
        setCompletedMixId(mixResponse.mixId);
        setMixDuration(mixStatus.duration || 0);
        setCurrentMixId(null);
      } else {
        toast.error(`混音失败: ${mixStatus.message}`);
        setCurrentMixId(null);
      }
      
    } catch (error) {
      console.error("Mix error:", error);
      toast.error("混音处理失败，请重试");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!completedMixId) return;
    
    try {
      await demoAPI.downloadMix(completedMixId, `AI_Mix_${targetBPM}BPM_${Date.now()}.mp3`);
      toast.success("下载成功！");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("下载失败，请重试");
    }
  };

  // 处理曲目拖拽开始
  const handleTrackDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  // 处理曲目拖拽经过
  const handleTrackDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  // 处理曲目拖拽进入
  const handleTrackDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  // 处理曲目拖拽结束
  const handleTrackDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // 处理曲目放置
  const handleTrackDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex || !onReorderTracks) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newTracks = [...droppedTracks];
    const [draggedTrack] = newTracks.splice(draggedIndex, 1);
    newTracks.splice(dropIndex, 0, draggedTrack);
    
    onReorderTracks(newTracks);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-gradient-to-br from-dj-surface/90 to-dj-surface/70 backdrop-blur-lg rounded-2xl border border-dj-border/50 p-6 shadow-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dj-text mb-2 flex items-center gap-2">
            <Zap className="w-6 h-6 text-dj-orange" />
            AI 混音工作室
          </h2>
          <p className="text-dj-text-muted">
            将 2-5 首曲目拖拽到下方区域，设置目标BPM，然后让AI为您创建完美的混音
          </p>
        </div>

        {/* Drop Zone */}
        <div
          ref={dropZoneRef}
          className={`min-h-[200px] border-2 border-dashed ${
            droppedTracks.length > 0 ? "border-dj-orange/50 bg-gradient-to-b from-purple-900/10 to-orange-900/10" : "border-dj-border/50 bg-gradient-to-b from-purple-900/5 to-orange-900/5"
          } rounded-xl p-6 mb-6 transition-all duration-200 hover:border-dj-orange/30`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {droppedTracks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-20 h-20 bg-gradient-primary/20 rounded-full flex items-center justify-center mb-4 animate-pulse">
                <GripVertical className="w-10 h-10 text-dj-orange" />
              </div>
              <h3 className="text-lg font-semibold text-dj-text mb-2">
                拖拽曲目到这里开始混音
              </h3>
              <p className="text-dj-text-muted text-sm">
                支持 2-5 首曲目，AI将自动分析并创建无缝混音
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-dj-text">
                  混音曲目 ({droppedTracks.length}/5)
                </h3>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowWaveforms(!showWaveforms);
                    }}
                    className="border-dj-border/50 text-dj-text hover:bg-dj-surface-hover"
                  >
                    <Music2 className="w-4 h-4 mr-1" />
                    {showWaveforms ? '隐藏波形' : '显示波形'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClearAll}
                    className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    清空所有
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {droppedTracks.map((track, index) => (
                  <div key={track.id} className="space-y-3">
                    {/* Track Card */}
                    <div
                      draggable
                      onDragStart={() => handleTrackDragStart(index)}
                      onDragOver={(e) => handleTrackDragOver(e, index)}
                      onDragEnd={handleTrackDragEnd}
                      onDrop={(e) => handleTrackDrop(e, index)}
                      className={`bg-gradient-to-r from-dj-surface/80 to-dj-surface/60 backdrop-blur rounded-lg p-4 border group transition-all duration-200 cursor-move
                        ${draggedIndex === index ? 'opacity-50 scale-95' : ''} 
                        ${dragOverIndex === index && draggedIndex !== index ? 'border-dj-orange border-2 scale-105' : 'border-dj-border/30 hover:border-dj-orange/50'}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <GripVertical className="w-4 h-4 text-dj-text-muted mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-dj-text text-sm line-clamp-1">
                            #{index + 1} - {track.title}
                          </h4>
                          <p className="text-dj-text-muted text-xs line-clamp-1">
                            {track.artist}
                          </p>
                          <div className="flex gap-4 mt-2 text-xs text-dj-text-muted">
                            <span className="flex items-center gap-1">
                              <span className="text-dj-orange">BPM</span> {track.bpm}
                            </span>
                            <span>{track.duration}</span>
                            <span className="text-dj-orange">{track.genre}</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveTrack(track.id)}
                          className="opacity-0 group-hover:opacity-100 transition-all hover:text-red-500 hover:scale-110"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Waveform */}
                    {showWaveforms && track.audioUrl && (
                      <div className="pl-8">
                        <Waveform
                          audioUrl={track.audioUrl}
                          trackId={track.id}
                          height={100}
                          waveColor="#ff6b35"
                          progressColor="#8b5cf6"
                          onRegionAdd={(region) => {
                            setTrackRegions(prev => ({
                              ...prev,
                              [track.id]: [...(prev[track.id] || []), region]
                            }));
                            toast.success(`添加${region.type}标记`);
                          }}
                          onRegionUpdate={(region) => {
                            setTrackRegions(prev => ({
                              ...prev,
                              [track.id]: prev[track.id]?.map(r => 
                                r.id === region.id ? region : r
                              ) || []
                            }));
                          }}
                          onRegionDelete={(regionId) => {
                            setTrackRegions(prev => ({
                              ...prev,
                              [track.id]: prev[track.id]?.filter(r => r.id !== regionId) || []
                            }));
                            toast.info('删除标记');
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* BPM Control */}
        <div className="bg-gradient-to-r from-dj-surface/80 to-dj-surface/60 backdrop-blur rounded-xl p-6 mb-6 border border-dj-border/30">
          <Label htmlFor="bpm" className="text-lg font-semibold text-dj-text mb-4 block">
            <Settings className="inline w-5 h-5 mr-2 text-dj-orange" />
            目标 BPM
          </Label>
          <div className="flex items-center gap-4">
            <Input
              id="bpm"
              type="number"
              min="60"
              max="200"
              value={targetBPM}
              onChange={(e) => setTargetBPM(parseInt(e.target.value) || 128)}
              className="w-32 bg-dj-dark/50 border-dj-border/50 text-dj-text"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setTargetBPM(120)}
                className="border-dj-border/50 text-dj-text hover:bg-dj-surface-hover hover:border-dj-orange/50 transition-all"
              >
                120
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setTargetBPM(128)}
                className="border-dj-border/50 text-dj-text hover:bg-dj-surface-hover hover:border-dj-orange/50 transition-all"
              >
                128
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setTargetBPM(140)}
                className="border-dj-border/50 text-dj-text hover:bg-dj-surface-hover hover:border-dj-orange/50 transition-all"
              >
                140
              </Button>
            </div>
          </div>
          
          {/* Show region info if any */}
          {showWaveforms && Object.keys(trackRegions).length > 0 && (
            <div className="mt-4 p-3 bg-dj-dark/30 rounded-lg">
              <p className="text-xs text-dj-text-muted mb-2">已标记区域：</p>
              {Object.entries(trackRegions).map(([trackId, regions]) => {
                const track = droppedTracks.find(t => t.id === trackId);
                if (!track || regions.length === 0) return null;
                return (
                  <div key={trackId} className="text-xs text-dj-text mb-1">
                    <span className="text-dj-orange">{track.title}:</span>
                    {regions.map(r => (
                      <span key={r.id} className="ml-2">
                        {r.type} ({Math.round(r.start)}s - {Math.round(r.end)}s)
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            size="lg"
            onClick={handleAIMix}
            className="w-full bg-gradient-primary text-dj-dark hover:bg-gradient-primary shadow-glow hover:scale-[1.02] transition-all"
            disabled={droppedTracks.length < 2 || isProcessing}
          >
            <Zap className="w-5 h-5 mr-2" />
            {isProcessing ? "AI 正在混音中..." : "开始 AI 混音"}
          </Button>
          
          {completedMixId && (
            <Button
              size="lg"
              variant="outline"
              className="w-full border-dj-border/50 text-dj-text hover:bg-dj-surface-hover hover:border-dj-orange/50 transition-all"
              onClick={handleDownload}
            >
              <Download className="w-5 h-5 mr-2" />
              下载混音 (MP3)
            </Button>
          )}
        </div>

        {/* Audio Player */}
        {completedMixId && (
          <div className="mt-6">
            <AudioPlayer
              src={demoAPI.getMixDownloadUrl(completedMixId)}
              title="AI Mix"
              artist={`${targetBPM} BPM • ${droppedTracks.length} Tracks`}
              duration={mixDuration}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MixingStudio;