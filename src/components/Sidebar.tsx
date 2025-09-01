import { Music, Play, Radio, Disc3, Settings, Library, Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const menuItems = [
    { id: "discover", label: "发现", icon: Disc3 },
    { id: "new-music", label: "新的音乐", icon: Music },
    { id: "hot-music", label: "热门音乐", icon: Play },
    { id: "radio", label: "聚光灯", icon: Radio },
    { id: "flow", label: "流派", icon: Library },
    { id: "live", label: "播放列表", icon: Heart },
    { id: "names", label: "名人堂", icon: Clock },
    { id: "earn", label: "赚取积分", icon: Settings },
  ];

  return (
    <div className="w-64 bg-dj-surface border-r border-dj-border h-full">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Music className="w-5 h-5 text-dj-dark" />
          </div>
          <span className="text-xl font-bold text-dj-text">didaDJ</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={`w-full justify-start gap-3 text-left ${
                  activeSection === item.id
                    ? "bg-gradient-primary text-dj-dark hover:bg-gradient-primary"
                    : "text-dj-text-muted hover:text-dj-text hover:bg-dj-surface-hover"
                }`}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-dj-border">
          <div className="text-sm text-dj-text-muted mb-4">你的音乐</div>
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-dj-text-muted hover:text-dj-text hover:bg-dj-surface-hover">
              最近播放
            </Button>
            <Button variant="ghost" className="w-full justify-start text-dj-text-muted hover:text-dj-text hover:bg-dj-surface-hover">
              我的播放列表
            </Button>
            <Button variant="ghost" className="w-full justify-start text-dj-text-muted hover:text-dj-text hover:bg-dj-surface-hover">
              收藏夹
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;