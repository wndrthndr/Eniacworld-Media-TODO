import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Todo = Database['public']['Tables']['todos']['Row'];
type TodoInsert = Database['public']['Tables']['todos']['Insert'];
type TodoUpdate = Database['public']['Tables']['todos']['Update'];

export function useTodos(userId: string | undefined) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    if (!userId) {
      setTodos([]);
      setLoading(false);
      return;
    }

    fetchTodos();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('todos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos', filter: `user_id=eq.${userId}` },
        () => {
          fetchTodos(); // optional backup to keep in sync
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  const fetchTodos = async () => {
    if (!userId) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching todos:', error);
    } else {
      setTodos(data || []);
    }
    setLoading(false);
  };

  const addTodo = async (todo: Omit<TodoInsert, 'user_id'>) => {
    if (!userId) return { error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('todos')
      .insert({ ...todo, user_id: userId })
      .select()
      .single();

    if (!error && data) {
      setTodos(prev => [data, ...prev]); // ✅ Add to local state immediately
    }

    return { data, error };
  };

  const updateTodo = async (id: string, updates: TodoUpdate) => {
    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (!error && data) {
      setTodos(prev => prev.map(todo => (todo.id === id ? data : todo))); // ✅ Update local state
    }

    return { data, error };
  };

  const deleteTodo = async (id: string) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (!error) {
      setTodos(prev => prev.filter(todo => todo.id !== id)); // ✅ Remove from local state
    }

    return { error };
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    return todo.status === filter;
  });

  return {
    todos: filteredTodos,
    loading,
    filter,
    setFilter,
    addTodo,
    updateTodo,
    deleteTodo,
    refetch: fetchTodos,
  };
}
