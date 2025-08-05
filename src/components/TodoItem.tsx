import React, { useState } from 'react';
import { Check, Edit2, Trash2, Star } from 'lucide-react';
import type { Database } from '../lib/supabase';

type Todo = Database['public']['Tables']['todos']['Row'];

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, updates: Partial<Todo>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TodoItem({ todo, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description);
  const [showRating, setShowRating] = useState(false);

  const handleSave = async () => {
    await onUpdate(todo.id, {
      title: editedTitle,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  const handleStatusToggle = async () => {
    const newStatus = todo.status === 'pending' ? 'completed' : 'pending';
    await onUpdate(todo.id, { status: newStatus });
    
    if (newStatus === 'completed' && !todo.rating) {
      setShowRating(true);
    }
  };

  const handleRating = async (rating: number) => {
    await onUpdate(todo.id, { rating });
    setShowRating(false);
  };

  const renderStars = (rating: number | null, interactive = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={interactive ? () => handleRating(star) : undefined}
            className={`${
              interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
            } transition-transform`}
            disabled={!interactive}
          >
            <Star
              className={`w-4 h-4 ${
                rating && star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Todo title"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Description (optional)"
            rows={3}
          />
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedTitle(todo.title);
                setEditedDescription(todo.description);
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start space-x-3 flex-1">
              <button
                onClick={handleStatusToggle}
                className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  todo.status === 'completed'
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 hover:border-green-400'
                }`}
              >
                {todo.status === 'completed' && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </button>
              
              <div className="flex-1">
                <h3 className={`font-medium ${
                  todo.status === 'completed' 
                    ? 'text-gray-500 line-through' 
                    : 'text-gray-900'
                }`}>
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className={`text-sm mt-1 ${
                    todo.status === 'completed' 
                      ? 'text-gray-400' 
                      : 'text-gray-600'
                  }`}>
                    {todo.description}
                  </p>
                )}
                {todo.rating && (
                  <div className="mt-2">
                    {renderStars(todo.rating)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {showRating && todo.status === 'completed' && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-700 mb-3">Rate this completed task:</p>
              <div className="flex items-center space-x-2">
                {renderStars(null, true)}
                <button
                  onClick={() => setShowRating(false)}
                  className="ml-3 text-sm text-gray-500 hover:text-gray-700"
                >
                  Skip
                </button>
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>Created {new Date(todo.created_at).toLocaleDateString()}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              todo.status === 'completed' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {todo.status}
            </span>
          </div>
        </>
      )}
    </div>
  );
}