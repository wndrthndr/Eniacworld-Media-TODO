import React from 'react';
import { ListTodo, Clock, CheckCircle } from 'lucide-react';

interface FilterTabsProps {
  filter: 'all' | 'pending' | 'completed';
  onFilterChange: (filter: 'all' | 'pending' | 'completed') => void;
  counts: {
    all: number;
    pending: number;
    completed: number;
  };
}

export function FilterTabs({ filter, onFilterChange, counts }: FilterTabsProps) {
  const tabs = [
    { key: 'all' as const, label: 'All', icon: ListTodo, count: counts.all },
    { key: 'pending' as const, label: 'Pending', icon: Clock, count: counts.pending },
    { key: 'completed' as const, label: 'Completed', icon: CheckCircle, count: counts.completed },
  ];

  return (
    <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
      {tabs.map(({ key, label, icon: Icon, count }) => (
        <button
          key={key}
          onClick={() => onFilterChange(key)}
          className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
            filter === key
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            filter === key
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-200 text-gray-500'
          }`}>
            {count}
          </span>
        </button>
      ))}
    </div>
  );
}