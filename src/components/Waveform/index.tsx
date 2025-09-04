import React, { useEffect, useRef, useState, useCallback } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.js';
import { Button } from '@/components/ui/button';
import { WaveformProps, WaveformMarker, WaveformRegion } from './types';
import WaveformControls from './WaveformControls';
import MockWaveform from './MockWaveform';
import { toast } from 'sonner';

const Waveform: React.FC<WaveformProps> = ({
  audioUrl,
  trackId,
  height = 128,
  waveColor = '#ff6b35',
  progressColor = '#8b5cf6',
  onMarkerAdd,
  onMarkerUpdate,
  onMarkerDelete,
  onRegionAdd,
  onRegionUpdate,
  onRegionDelete,
  onReady,
  onPlay,
  onPause,
  onSeek
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const regionsRef = useRef<RegionsPlugin | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(50);
  const [isLoading, setIsLoading] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loadError, setLoadError] = useState(false);

  // Initialize WaveSurfer
  useEffect(() => {
    if (!containerRef.current || !timelineRef.current) return;
    
    // Reset error state when audioUrl changes
    setLoadError(false);
    setIsLoading(true);

    // Create regions plugin
    const regions = RegionsPlugin.create();
    regionsRef.current = regions;

    // Create WaveSurfer instance
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      waveColor: waveColor,
      progressColor: progressColor,
      cursorColor: '#ffffff',
      barWidth: 2,
      barRadius: 3,
      cursorWidth: 1,
      height: height,
      barGap: 1,
      responsive: true,
      normalize: true,
      minPxPerSec: zoomLevel,
      fillParent: true,
      scrollParent: true,
      hideScrollbar: false,
      autoScroll: true,
      autoCenter: true,
      sampleRate: 48000,
      plugins: [
        regions,
        TimelinePlugin.create({
          container: timelineRef.current,
          primaryLabelInterval: 1,
          secondaryLabelInterval: 0.25,
          style: {
            fontSize: '10px',
            color: '#6B7280'
          }
        })
      ]
    });

    wavesurferRef.current = wavesurfer;

    // Load audio
    wavesurfer.load(audioUrl);

    // Event listeners
    wavesurfer.on('ready', () => {
      setIsLoading(false);
      setDuration(wavesurfer.getDuration());
      onReady?.();
      toast.success('波形加载完成');
    });

    wavesurfer.on('play', () => {
      setIsPlaying(true);
      onPlay?.();
    });

    wavesurfer.on('pause', () => {
      setIsPlaying(false);
      onPause?.();
    });

    wavesurfer.on('seeking', (progress) => {
      onSeek?.(progress);
    });

    wavesurfer.on('timeupdate', (time) => {
      setCurrentTime(time);
    });

    wavesurfer.on('error', (error) => {
      console.error('WaveSurfer error:', error);
      toast.error('加载音频失败，使用模拟波形');
      setIsLoading(false);
      setLoadError(true);
    });

    // Region events
    regions.on('region-created', (region) => {
      console.log('Region created:', region);
    });

    regions.on('region-updated', (region) => {
      console.log('Region updated:', region);
    });

    regions.on('region-clicked', (region, e) => {
      e.stopPropagation();
      // Play the region if the method exists
      if (region.play && typeof region.play === 'function') {
        region.play();
      } else if (wavesurfer) {
        // Fallback: seek to region start and play
        wavesurfer.setTime(region.start);
        wavesurfer.play();
      }
    });

    return () => {
      wavesurfer.destroy();
    };
  }, [audioUrl, trackId]);

  // Update zoom level
  useEffect(() => {
    if (wavesurferRef.current && !loadError) {
      try {
        wavesurferRef.current.setOptions({
          minPxPerSec: zoomLevel
        });
      } catch (error) {
        console.error('Error updating zoom:', error);
      }
    }
  }, [zoomLevel, loadError]);

  // Control functions
  const handlePlayPause = useCallback(() => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
    }
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 50, 1000));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 50, 10));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoomLevel(50);
  }, []);

  const handleAddIntroMarker = useCallback(() => {
    if (!regionsRef.current || !wavesurferRef.current) return;
    
    const currentTime = wavesurferRef.current.getCurrentTime();
    const region = regionsRef.current.addRegion({
      start: currentTime,
      end: currentTime + 0.5,
      color: 'rgba(34, 197, 94, 0.3)',
      drag: true,
      resize: true,
      id: `intro-${Date.now()}`
    });

    const regionData: WaveformRegion = {
      id: region.id,
      start: region.start,
      end: region.end,
      label: 'Intro',
      color: 'green',
      type: 'intro'
    };

    onRegionAdd?.(regionData);
    toast.success('添加 Intro 标记');
  }, [onRegionAdd]);

  const handleAddOutroMarker = useCallback(() => {
    if (!regionsRef.current || !wavesurferRef.current) return;
    
    const currentTime = wavesurferRef.current.getCurrentTime();
    const region = regionsRef.current.addRegion({
      start: currentTime,
      end: currentTime + 0.5,
      color: 'rgba(239, 68, 68, 0.3)',
      drag: true,
      resize: true,
      id: `outro-${Date.now()}`
    });

    const regionData: WaveformRegion = {
      id: region.id,
      start: region.start,
      end: region.end,
      label: 'Outro',
      color: 'red',
      type: 'outro'
    };

    onRegionAdd?.(regionData);
    toast.success('添加 Outro 标记');
  }, [onRegionAdd]);

  // Format time display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // If audio failed to load, show MockWaveform
  if (loadError) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
          <p className="text-xs text-yellow-500">
            ⚠️ 音频加载失败，显示模拟波形
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setLoadError(false);
              setIsLoading(true);
            }}
            className="text-xs border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20"
          >
            重试加载
          </Button>
        </div>
        <MockWaveform
          height={height}
          waveColor={waveColor}
          progressColor={progressColor}
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* Controls */}
      <WaveformControls
        onPlayPause={handlePlayPause}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        onAddIntroMarker={handleAddIntroMarker}
        onAddOutroMarker={handleAddOutroMarker}
        isPlaying={isPlaying}
        zoomLevel={zoomLevel}
      />

      {/* Waveform Container */}
      <div className="relative bg-dj-surface/30 rounded-lg border border-dj-border/30 p-4">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-dj-surface/80 backdrop-blur-sm rounded-lg z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-2 border-dj-orange border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-dj-text-muted">加载波形中...</span>
            </div>
          </div>
        )}

        {/* Time Display */}
        <div className="flex justify-between mb-2 text-xs text-dj-text-muted">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Waveform */}
        <div 
          ref={containerRef}
          className="w-full overflow-hidden rounded"
          style={{ minHeight: height }}
        />

        {/* Timeline */}
        <div 
          ref={timelineRef}
          className="w-full mt-2"
          style={{ height: '20px' }}
        />
      </div>

      {/* Instructions */}
      <div className="text-xs text-dj-text-muted space-y-1">
        <p>• 点击波形跳转 • 空格键播放/暂停 • 滚轮缩放</p>
        <p>• 点击 Intro/Outro 按钮在当前位置添加标记</p>
        <p>• 拖拽标记边缘调整范围 • 点击标记播放该区域</p>
      </div>
    </div>
  );
};

export default Waveform;