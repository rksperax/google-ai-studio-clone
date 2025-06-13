
import { MessageSquare, Radio, Image, Hammer, History, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const sidebarItems = [
  { id: 'chat', icon: MessageSquare, label: 'Chat' },
  { id: 'stream', icon: Radio, label: 'Stream' },
  { id: 'media', icon: Image, label: 'Generate Media' },
  { id: 'build', icon: Hammer, label: 'Build' },
  { id: 'history', icon: History, label: 'History' },
];

export const Sidebar = ({ collapsed, onToggle, activeTab, onTabChange }: SidebarProps) => {
  return (
    <div className={cn(
      "bg-gray-50 border-r border-gray-200 transition-all duration-300 flex flex-col",
      "md:relative absolute md:translate-x-0 z-40",
      collapsed ? "w-0 md:w-16 -translate-x-full md:translate-x-0" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <h1 className="font-semibold text-gray-900 text-sm md:text-base">Google AI Studio</h1>
          </div>
        )}
        <button 
          onClick={onToggle}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors mb-1",
              activeTab === item.id 
                ? "bg-blue-50 text-blue-700 border border-blue-200" 
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium text-sm md:text-base">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span className="text-xs md:text-sm">Enable saving</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This model is not stable and may not be suitable for production use.
          </p>
        </div>
      )}
    </div>
  );
};
