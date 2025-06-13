
import { X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SettingsPanelProps {
  onClose: () => void;
}

export const SettingsPanel = ({ onClose }: SettingsPanelProps) => {
  const [selectedModel, setSelectedModel] = useState('Gemini 2.5 Pro Preview');
  const [temperature, setTemperature] = useState(1);
  const [thinkingMode, setThinkingMode] = useState(false);
  const [thinkingBudget, setThinkingBudget] = useState(false);
  const [structuredOutput, setStructuredOutput] = useState(false);
  const [codeExecution, setCodeExecution] = useState(false);
  const [functionCalling, setFunctionCalling] = useState(false);
  const [grounding, setGrounding] = useState(false);

  const models = [
    'Gemini 2.5 Pro Preview',
    'Gemini 1.5 Pro',
    'Gemini 1.5 Flash',
    'Gemini 1.0 Pro'
  ];

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Run settings</h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Settings */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Model Selection */}
        <div>
          <div className="relative">
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg appearance-none bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
            >
              {models.map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Token Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Token count</label>
          <div className="text-sm text-gray-600">1,360 / 1,048,576</div>
        </div>

        {/* Temperature */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Temperature</label>
          <div className="px-3">
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span className="font-medium">{temperature}</span>
              <span>2</span>
            </div>
          </div>
        </div>

        {/* Thinking Section */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Thinking</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Thinking mode</label>
              <div className="relative">
                <button
                  onClick={() => setThinkingMode(!thinkingMode)}
                  className={cn(
                    "w-8 h-4 rounded-full transition-colors",
                    thinkingMode ? "bg-blue-500" : "bg-gray-300"
                  )}
                >
                  <div className={cn(
                    "w-3 h-3 bg-white rounded-full transition-transform",
                    thinkingMode ? "translate-x-4" : "translate-x-0.5"
                  )} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Set thinking budget</label>
              <div className="relative">
                <button
                  onClick={() => setThinkingBudget(!thinkingBudget)}
                  className={cn(
                    "w-8 h-4 rounded-full transition-colors",
                    thinkingBudget ? "bg-blue-500" : "bg-gray-300"
                  )}
                >
                  <div className={cn(
                    "w-3 h-3 bg-white rounded-full transition-transform",
                    thinkingBudget ? "translate-x-4" : "translate-x-0.5"
                  )} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Tools</h4>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-gray-700">Structured output</label>
                <div className="text-xs text-blue-600 cursor-pointer">Edit</div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setStructuredOutput(!structuredOutput)}
                  className={cn(
                    "w-8 h-4 rounded-full transition-colors",
                    structuredOutput ? "bg-blue-500" : "bg-gray-300"
                  )}
                >
                  <div className={cn(
                    "w-3 h-3 bg-white rounded-full transition-transform",
                    structuredOutput ? "translate-x-4" : "translate-x-0.5"
                  )} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Code execution</label>
              <div className="relative">
                <button
                  onClick={() => setCodeExecution(!codeExecution)}
                  className={cn(
                    "w-8 h-4 rounded-full transition-colors",
                    codeExecution ? "bg-blue-500" : "bg-gray-300"
                  )}
                >
                  <div className={cn(
                    "w-3 h-3 bg-white rounded-full transition-transform",
                    codeExecution ? "translate-x-4" : "translate-x-0.5"
                  )} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm text-gray-700">Function calling</label>
                <div className="text-xs text-blue-600 cursor-pointer">Edit</div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setFunctionCalling(!functionCalling)}
                  className={cn(
                    "w-8 h-4 rounded-full transition-colors",
                    functionCalling ? "bg-blue-500" : "bg-gray-300"
                  )}
                >
                  <div className={cn(
                    "w-3 h-3 bg-white rounded-full transition-transform",
                    functionCalling ? "translate-x-4" : "translate-x-0.5"
                  )} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-700">Grounding with Google Search</label>
              <div className="relative">
                <button
                  onClick={() => setGrounding(!grounding)}
                  className={cn(
                    "w-8 h-4 rounded-full transition-colors",
                    grounding ? "bg-blue-500" : "bg-gray-300"
                  )}
                >
                  <div className={cn(
                    "w-3 h-3 bg-white rounded-full transition-transform",
                    grounding ? "translate-x-4" : "translate-x-0.5"
                  )} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
