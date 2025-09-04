import { Track } from "@/components/TrackCard";

// 使用更可靠的音频URL或本地文件
// 注意：这些是示例URL，实际使用时应替换为你自己的音频文件
const AUDIO_BASE_URL = "https://www.mfiles.co.uk/mp3-downloads/";
const LOCAL_AUDIO_BASE = "/audio/";

export const mockTracks: Track[] = [
  {
    id: "track1",
    title: "心墙",
    artist: "郭静",
    duration: "3:45",
    bpm: 128,
    genre: "Electronic",
    artwork: "https://picsum.photos/seed/track1/200/200",
    audioUrl: `${AUDIO_BASE_URL}brahms-st-anthony-chorale-theme-two-pianos.mp3`
  },
  {
    id: "track2", 
    title: "大城小爱",
    artist: "王力宏",
    duration: "4:10",
    bpm: 130,
    genre: "Electronic",
    artwork: "https://picsum.photos/seed/track2/200/200",
    audioUrl: `${AUDIO_BASE_URL}chopin-nocturne-op9-no2.mp3`
  },
  {
    id: "track3",
    title: "不得不爱",
    artist: "潘玮柏、弦子",
    duration: "3:32",
    bpm: 126,
    genre: "Electronic",
    artwork: "https://picsum.photos/seed/track3/200/200",
    audioUrl: `${AUDIO_BASE_URL}beethoven-symphony-5-1st-movement.mp3`
  },
  {
    id: "track4",
    title: "Divided",
    artist: "Aycan",
    duration: "3:55",
    bpm: 125,
    genre: "Electronic",
    artwork: "https://picsum.photos/seed/track4/200/200",
    audioUrl: `${AUDIO_BASE_URL}mozart-symphony-no-40-1st-movement.mp3`
  },
  {
    id: "track5",
    title: "Satisfaction",
    artist: "Benny Benassi",
    duration: "4:20",
    bpm: 132,
    genre: "Electronic",
    artwork: "https://picsum.photos/seed/track5/200/200",
    audioUrl: `${AUDIO_BASE_URL}vivaldi-spring-1st-movement.mp3`
  },
  {
    id: "track6",
    title: "Summer Vibes",
    artist: "DJ Mixer",
    duration: "3:28",
    bpm: 124,
    genre: "House",
    artwork: "https://picsum.photos/seed/track6/200/200",
    audioUrl: `${AUDIO_BASE_URL}bach-invention-no-1.mp3`
  },
  {
    id: "track7",
    title: "Night Drive",
    artist: "Synthwave Master",
    duration: "4:05",
    bpm: 118,
    genre: "Synthwave",
    artwork: "https://picsum.photos/seed/track7/200/200",
    audioUrl: `${AUDIO_BASE_URL}grieg-peer-gynt-morning-mood.mp3`
  },
  {
    id: "track8",
    title: "Urban Dreams",
    artist: "Beat Maker",
    duration: "3:15",
    bpm: 140,
    genre: "Hip Hop",
    artwork: "https://picsum.photos/seed/track8/200/200",
    audioUrl: `${AUDIO_BASE_URL}debussy-clair-de-lune.mp3`
  }
];

// 用于waveform测试的额外数据
export const mockWaveformData = {
  // 模拟的波形数据点（0-1之间的值）
  generateWaveform: (length: number = 200): number[] => {
    return Array.from({ length }, () => Math.random() * 0.8 + 0.2);
  },
  
  // 模拟的频谱数据
  generateSpectrum: (bands: number = 32): number[] => {
    return Array.from({ length: bands }, (_, i) => 
      Math.max(0.1, Math.random() * (1 - i / bands))
    );
  },
  
  // 模拟的节拍标记（秒）
  generateBeatMarkers: (duration: number, bpm: number): number[] => {
    const beatInterval = 60 / bpm; // 每拍的秒数
    const beats: number[] = [];
    for (let time = 0; time < duration; time += beatInterval) {
      beats.push(time);
    }
    return beats;
  }
};

// 获取单个轨道的详细信息
export const getTrackById = (id: string): Track | undefined => {
  return mockTracks.find(track => track.id === id);
};

// 按风格筛选轨道
export const getTracksByGenre = (genre: string): Track[] => {
  if (genre === "all") return mockTracks;
  return mockTracks.filter(track => track.genre === genre);
};

// 搜索轨道
export const searchTracks = (query: string): Track[] => {
  const lowerQuery = query.toLowerCase();
  return mockTracks.filter(track => 
    track.title.toLowerCase().includes(lowerQuery) ||
    track.artist.toLowerCase().includes(lowerQuery) ||
    track.genre.toLowerCase().includes(lowerQuery)
  );
};