import { Link } from "react-router-dom";
import { Music, Zap, Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-dj-dark">
      {/* Header */}
      <header className="bg-dj-surface border-b border-dj-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-dj-dark" />
              </div>
              <span className="text-xl font-bold text-dj-text">didaDJ</span>
            </div>
            
            <nav className="flex items-center gap-6">
              <Button variant="ghost" className="text-dj-text-muted hover:text-dj-text">
                发现
              </Button>
              <Button variant="ghost" className="text-dj-text-muted hover:text-dj-text">
                热门
              </Button>
              <Button variant="ghost" className="text-dj-text-muted hover:text-dj-text">
                播放列表
              </Button>
              <Button className="bg-gradient-primary text-dj-dark hover:bg-gradient-primary shadow-glow">
                登录
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-dj-text mb-6">
            AI 驱动的 DJ 混音平台
          </h1>
          <p className="text-xl text-dj-text-muted mb-8 max-w-3xl mx-auto">
            使用先进的人工智能技术，轻松创建专业级音乐混音。拖拽您喜欢的曲目，设置BPM，让AI为您处理剩下的一切。
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-12">
            <Link to="/mixer">
              <Button size="lg" className="bg-gradient-primary text-dj-dark hover:bg-gradient-primary shadow-glow text-lg px-8 py-3">
                <Zap className="w-5 h-5 mr-2" />
                开始混音
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-dj-border text-dj-text hover:bg-dj-surface-hover text-lg px-8 py-3"
            >
              <Play className="w-5 h-5 mr-2" />
              观看演示
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <Card className="p-8 bg-gradient-surface border-dj-border text-center">
              <div className="w-16 h-16 bg-dj-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-dj-orange" />
              </div>
              <h3 className="text-xl font-semibold text-dj-text mb-3">
                AI 智能混音
              </h3>
              <p className="text-dj-text-muted">
                先进的人工智能算法自动分析曲目特征，创建无缝的专业级混音效果
              </p>
            </Card>

            <Card className="p-8 bg-gradient-surface border-dj-border text-center">
              <div className="w-16 h-16 bg-dj-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music className="w-8 h-8 text-dj-orange" />
              </div>
              <h3 className="text-xl font-semibold text-dj-text mb-3">
                丰富曲库
              </h3>
              <p className="text-dj-text-muted">
                海量高质量音乐资源，涵盖电子、嘻哈、流行等多种风格，满足不同创作需求
              </p>
            </Card>

            <Card className="p-8 bg-gradient-surface border-dj-border text-center">
              <div className="w-16 h-16 bg-dj-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-8 h-8 text-dj-orange" />
              </div>
              <h3 className="text-xl font-semibold text-dj-text mb-3">
                一键下载
              </h3>
              <p className="text-dj-text-muted">
                混音完成后即可下载高品质音频文件，支持多种格式，方便分享和使用
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-dj-surface border-t border-dj-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-dj-text mb-4">
            准备开始您的音乐创作之旅吗？
          </h2>
          <p className="text-dj-text-muted mb-8">
            加入数千名音乐制作人的行列，使用AI技术释放您的创意潜能
          </p>
          <Link to="/mixer">
            <Button size="lg" className="bg-gradient-primary text-dj-dark hover:bg-gradient-primary shadow-glow text-lg px-8 py-3">
              <Zap className="w-5 h-5 mr-2" />
              立即体验
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-dj-border">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-dj-text-muted text-sm">
            © 2024 didaDJ. 保留所有权利。
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
