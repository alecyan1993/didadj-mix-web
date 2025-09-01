/**
 * API服务层 - 与后端通信
 */

// 使用相对路径，让Vite的代理处理跨域问题
const API_BASE_URL = '/api/v1/demo';

export interface Track {
  id: string;
  title: string;
  artist: string;
  audioPath: string;
  audioUrl?: string;
  coverPath: string;
  coverUrl?: string;
  bpm: number;
  key: string;
  duration: string;
  style: string;
}

export interface MusicLibrary {
  tracks: Track[];
}

export interface MixRequest {
  trackIds: string[];
  targetBPM: number;
}

export interface MixResponse {
  mixId: string;
  status: string;
  message: string;
}

export interface MixStatus {
  mixId: string;
  status: 'processing' | 'completed' | 'failed';
  message: string;
  duration?: number;
}

class DemoAPI {
  /**
   * 获取音乐库
   */
  async getLibrary(): Promise<MusicLibrary> {
    try {
      const response = await fetch(`${API_BASE_URL}/library`);
      if (!response.ok) {
        throw new Error(`Failed to fetch library: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching library:', error);
      throw error;
    }
  }

  /**
   * 创建混音任务
   */
  async createMix(trackIds: string[], targetBPM: number = 128): Promise<MixResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/mix`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trackIds,
          targetBPM,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create mix');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating mix:', error);
      throw error;
    }
  }

  /**
   * 获取混音任务状态
   */
  async getMixStatus(mixId: string): Promise<MixStatus> {
    try {
      const response = await fetch(`${API_BASE_URL}/mix/${mixId}/status`);
      if (!response.ok) {
        throw new Error(`Failed to get mix status: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting mix status:', error);
      throw error;
    }
  }

  /**
   * 轮询混音状态直到完成
   */
  async waitForMixCompletion(mixId: string, maxAttempts: number = 30): Promise<MixStatus> {
    for (let i = 0; i < maxAttempts; i++) {
      const status = await this.getMixStatus(mixId);
      
      if (status.status === 'completed' || status.status === 'failed') {
        return status;
      }
      
      // 等待2秒后再次检查
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error('Mix processing timeout');
  }

  /**
   * 获取混音下载链接
   */
  getMixDownloadUrl(mixId: string): string {
    return `${API_BASE_URL}/mix/${mixId}/download`;
  }

  /**
   * 下载混音文件
   */
  async downloadMix(mixId: string, filename?: string): Promise<void> {
    try {
      const url = this.getMixDownloadUrl(mixId);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to download mix: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || `AI_Mix_${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading mix:', error);
      throw error;
    }
  }
}

export const demoAPI = new DemoAPI();