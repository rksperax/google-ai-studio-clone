import { useState, useRef, useEffect } from 'react';
import { Send, Menu, ThumbsUp, ThumbsDown, Copy, MoreVertical, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatAreaProps {
  messages: Message[];
  onMessagesChange: (messages: Message[]) => void;
  sidebarCollapsed: boolean;
  onSidebarToggle: () => void;
}

const GEMINI_API_KEY = 'AIzaSyBgOs1chEizDAqKIIVhttsr9skzGvcEJD4';

export const ChatArea = ({ messages, onMessagesChange, sidebarCollapsed, onSidebarToggle }: ChatAreaProps) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    onMessagesChange(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: input.trim()
            }]
          }],
          generationConfig: {
            temperature: 0.9,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Gemini');
      }

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      onMessagesChange([...newMessages, assistantMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      toast.error('Failed to get response from AI. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Message copied to clipboard');
  };

  return (
    <div className="flex-1 flex flex-col bg-white relative">
      {/* Header */}
      <div className="border-b border-gray-200 px-3 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onSidebarToggle}
            className="p-1 hover:bg-gray-100 rounded transition-colors md:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>
          {sidebarCollapsed && (
            <button 
              onClick={onSidebarToggle}
              className="hidden md:block p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <div className="flex items-center space-x-2">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Chatbot Ready To Help</h2>
            <button className="hidden md:block p-1 hover:bg-gray-100 rounded">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setMobileSettingsOpen(!mobileSettingsOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button className="hidden md:block p-2 hover:bg-gray-100 rounded transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button className="hidden md:block p-2 hover:bg-gray-100 rounded transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
          <button className="hidden md:block p-2 hover:bg-gray-100 rounded transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4">
        {messages.map((message) => (
          <div key={message.id} className={cn(
            "mb-6 flex",
            message.role === 'user' ? "justify-end" : "justify-start"
          )}>
            <div className={cn(
              "max-w-full md:max-w-4xl",
              message.role === 'user' ? "ml-auto" : "mr-auto"
            )}>
              {message.role === 'assistant' && (
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">G</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Gemini</span>
                </div>
              )}
              
              <div className={cn(
                "prose prose-sm max-w-none",
                message.role === 'user' 
                  ? "bg-blue-500 text-white p-3 md:p-4 rounded-2xl rounded-br-sm" 
                  : "text-gray-900"
              )}>
                {message.content.split('\n').map((line, index) => (
                  <p key={index} className={cn(
                    message.role === 'user' ? "text-white m-0" : "m-0 mb-2 last:mb-0"
                  )}>
                    {line}
                  </p>
                ))}
              </div>

              {message.role === 'assistant' && (
                <div className="flex items-center space-x-2 mt-2">
                  <button 
                    onClick={() => copyMessage(message.content)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <ThumbsUp className="w-4 h-4 text-gray-500" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <ThumbsDown className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xs">G</span>
            </div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-3 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Start typing a prompt"
              className="w-full bg-transparent border-0 resize-none focus:ring-0 p-3 md:p-4 pr-12 placeholder-gray-500 text-gray-900 text-sm md:text-base"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="absolute bottom-2 md:bottom-3 right-2 md:right-3 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span className="hidden md:inline">⌘ + ↵</span>
            <span>Run</span>
          </div>
        </div>
      </div>

      {/* Mobile Settings Overlay */}
      {mobileSettingsOpen && (
        <div className="lg:hidden absolute inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="w-80 max-w-full bg-white h-full overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Run settings</h3>
              <button 
                onClick={() => setMobileSettingsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600">Settings panel content would go here on mobile devices.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
