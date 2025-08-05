import React from 'react';
import { LogOut, User, ListTodo } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTodos } from '../hooks/useTodos';
import { TodoItem } from './TodoItem';
import { AddTodoForm } from './AddTodoForm';
import { FilterTabs } from './FilterTabs';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const { todos: allTodos, loading, filter, setFilter, addTodo, updateTodo, deleteTodo } = useTodos(user?.id);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleAddTodo = async (title: string, description: string) => {
    await addTodo({ title, description });
  };

  const handleUpdateTodo = async (id: string, updates: any) => {
    await updateTodo(id, updates);
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteTodo(id);
  };

  // Filter todos based on current filter
  const filteredTodos = allTodos.filter(todo => {
    if (filter === 'all') return true;
    return todo.status === filter;
  });

  const counts = {
    all: allTodos.length,
    pending: allTodos.filter(t => t.status === 'pending').length,
    completed: allTodos.filter(t => t.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Todos</h1>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Add Todo Form */}
          <AddTodoForm onAdd={handleAddTodo} loading={loading} />

          {/* Filter Tabs */}
          <FilterTabs
            filter={filter}
            onFilterChange={setFilter}
            counts={counts}
          />

          {/* Todos List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : allTodos.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ListTodo className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'No todos yet' : `No ${filter} todos`}
              </h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'Create your first todo to get started!'
                  : `You don't have any ${filter} todos.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onUpdate={handleUpdateTodo}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}