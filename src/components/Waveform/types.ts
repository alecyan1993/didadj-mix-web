export interface WaveformMarker {
  id: string;
  time: number;
  label: string;
  color: string;
  type: 'intro' | 'outro' | 'cue' | 'beat';
}

export interface WaveformRegion {
  id: string;
  start: number;
  end: number;
  label: string;
  color: string;
  type: 'intro' | 'outro' | 'loop' | 'custom';
}

export interface WaveformProps {
  audioUrl: string;
  trackId: string;
  height?: number;
  waveColor?: string;
  progressColor?: string;
  onMarkerAdd?: (marker: WaveformMarker) => void;
  onMarkerUpdate?: (marker: WaveformMarker) => void;
  onMarkerDelete?: (markerId: string) => void;
  onRegionAdd?: (region: WaveformRegion) => void;
  onRegionUpdate?: (region: WaveformRegion) => void;
  onRegionDelete?: (regionId: string) => void;
  onReady?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (progress: number) => void;
}

export interface WaveformControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onPlayPause: () => void;
  onAddIntroMarker: () => void;
  onAddOutroMarker: () => void;
  isPlaying: boolean;
  zoomLevel: number;
}