import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

interface MockWaveformProps {
  height?: number;
  waveColor?: string;
  progressColor?: string;
  duration?: number;
}

const MockWaveform: React.FC<MockWaveformProps> = ({
  height = 128,
  waveColor = '#ff6b35',
  progressColor = '#8b5cf6',
  duration = 180
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number>();

  // 生成模拟波形数据
  const generateWaveformData = (points: number = 500): number[] => {
    const data: number[] = [];
    for (let i = 0; i < points; i++) {
      // 创建有节奏感的波形
      const base = Math.sin(i * 0.05) * 0.3;
      const beat = Math.sin(i * 0.2) * 0.2;
      const noise = (Math.random() - 0.5) * 0.3;
      const value = Math.abs(base + beat + noise) * 0.8 + 0.2;
      data.push(value);
    }
    return data;
  };

  // 绘制波形
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const data = generateWaveformData(width / 2);

    // 清空画布
    ctx.clearRect(0, 0, width, height);

    // 绘制波形
    const barWidth = 2;
    const barGap = 1;
    const barCount = data.length;

    data.forEach((value, index) => {
      const x = index * (barWidth + barGap);
      const barHeight = value * height;
      const y = (height - barHeight) / 2;

      // 根据进度设置颜色
      const progressX = (progress / 100) * width;
      ctx.fillStyle = x < progressX ? progressColor : waveColor;
      
      // 绘制上下对称的波形条
      ctx.fillRect(x, y, barWidth, barHeight);
    });
  }, [height, waveColor, progressColor, progress]);

  // 模拟播放进度
  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.5;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newProgress = (x / canvas.width) * 100;
    setProgress(newProgress);
  };

  return (
    <div className="space-y-3">

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-dj-text hover:text-dj-orange"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        
        <div className="flex-1 bg-dj-surface/30 rounded-lg p-2">
          <canvas
            ref={canvasRef}
            width={800}
            height={height}
            className="w-full cursor-pointer"
            onClick={handleCanvasClick}
            style={{ maxHeight: height }}
          />
        </div>
      </div>

      <div className="text-xs text-dj-text-muted">
        <p>• 点击波形跳转 • 这是模拟波形，仅用于演示</p>
      </div>
    </div>
  );
};

export default MockWaveform;