import { useState, useRef } from "react";
import { Trash2, Download, Zap, Settings, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Track } from "./TrackCard";
import { toast } from "sonner";
import { demoAPI } from "@/lib/api";
import AudioPlayer from "./AudioPlayer";

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
    e.stopPropagation();
    setDragOverIndex(index);
  };

  // 处理曲目拖拽结束
  const handleTrackDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // 处理曲目拖放
  const handleTrackDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
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
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-dj-text mb-2">AI 混音工作室</h2>
        <p className="text-dj-text-muted">
          将 2-5 首曲目拖拽到下方区域，设置目标BPM，然后让AI为您创建完美的混音
        </p>
      </div>

      {/* Drop Zone */}
      <Card
        ref={dropZoneRef}
        className={`min-h-[300px] border-2 border-dashed ${
          droppedTracks.length > 0 ? "border-dj-orange bg-dj-surface" : "border-dj-border bg-dj-surface/50"
        } rounded-xl p-6 mb-6 transition-all duration-200`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {droppedTracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-dj-surface-hover rounded-full flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-dj-orange" />
            </div>
            <h3 className="text-lg font-semibold text-dj-text mb-2">
              拖拽曲目到这里开始混音
            </h3>
            <p className="text-dj-text-muted">
              支持 2-5 首曲目，AI将自动分析并创建无缝混音
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-dj-text">
                混音曲目 ({droppedTracks.length}/5)
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearAll}
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                清空所有
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {droppedTracks.map((track, index) => (
                <div
                  key={track.id}
                  draggable
                  onDragStart={() => handleTrackDragStart(index)}
                  onDragOver={(e) => handleTrackDragOver(e, index)}
                  onDragEnd={handleTrackDragEnd}
                  onDrop={(e) => handleTrackDrop(e, index)}
                  className={`bg-gradient-surface rounded-lg p-4 border group transition-all duration-200 cursor-move
                    ${draggedIndex === index ? 'opacity-50 scale-95' : ''} 
                    ${dragOverIndex === index && draggedIndex !== index ? 'border-dj-orange border-2' : 'border-dj-border hover:border-dj-orange'}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <GripVertical className="w-4 h-4 text-dj-text-muted mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-dj-text text-sm line-clamp-1">
                        {track.title}
                      </h4>
                      <p className="text-dj-text-muted text-xs line-clamp-1">
                        {track.artist}
                      </p>
                      <div className="mt-2">
                        <span className="text-xs text-dj-text-muted">
                          #{index + 1}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveTrack(track.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-surface border-dj-border">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-dj-orange" />
              <Label className="text-dj-text font-semibold">混音设置</Label>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label className="text-dj-text-muted text-sm">目标 BPM</Label>
                <Input
                  type="number"
                  value={targetBPM}
                  onChange={(e) => setTargetBPM(Number(e.target.value))}
                  min={60}
                  max={200}
                  className="bg-dj-surface border-dj-border text-dj-text mt-1"
                  placeholder="128"
                />
                <p className="text-xs text-dj-text-muted mt-1">
                  所有曲目将同步到此BPM
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-surface border-dj-border">
          <div className="space-y-4">
            <Label className="text-dj-text font-semibold">混音统计</Label>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-dj-text-muted">曲目数量:</span>
                <span className="text-dj-text">{droppedTracks.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dj-text-muted">预计时长:</span>
                <span className="text-dj-text">
                  {Math.ceil(droppedTracks.length * 3.5)} 分钟
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-dj-text-muted">目标BPM:</span>
                <span className="text-dj-orange font-semibold">{targetBPM}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-surface border-dj-border">
          <div className="space-y-4">
            <Label className="text-dj-text font-semibold">操作</Label>
            <div className="space-y-2">
              <Button
                onClick={handleAIMix}
                disabled={droppedTracks.length < 2 || isProcessing}
                className="w-full bg-gradient-primary hover:bg-gradient-primary text-dj-dark font-semibold shadow-glow"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-dj-dark border-t-transparent rounded-full animate-spin mr-2" />
                    处理中...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    AI 混音
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                className="w-full border-dj-border text-dj-text hover:bg-dj-surface-hover"
                disabled={!completedMixId}
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" />
                下载混音
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Audio Player - 显示在混音完成后 */}
      {completedMixId && (
        <div className="mt-6">
          <AudioPlayer
            audioUrl={demoAPI.getMixDownloadUrl(completedMixId)}
            mixId={completedMixId}
            duration={mixDuration}
            targetBPM={targetBPM}
            onDownload={handleDownload}
          />
        </div>
      )}
    </div>
  );
};

export default MixingStudio;