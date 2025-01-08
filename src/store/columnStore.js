import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useColumnStore = create((set, get) => ({
  columns: [],
  loading: false,
  error: null,

  fetchColumns: async (tableId) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('table_columns')
        .select('*')
        .eq('table_id', tableId)
        .order('order_index')
      if (error) throw error
      set({ columns: data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  addColumn: async (tableId, { name, type }) => {
    try {
      const { data: maxOrder } = await supabase
        .from('table_columns')
        .select('order_index')
        .eq('table_id', tableId)
        .order('order_index', { ascending: false })
        .limit(1)

      const newOrder = maxOrder?.[0]?.order_index + 1 || 0

      const { data, error } = await supabase
        .from('table_columns')
        .insert([{
          table_id: tableId,
          name,
          type,
          order_index: newOrder
        }])
        .select()

      if (error) throw error
      set(state => ({ columns: [...state.columns, data[0]] }))
    } catch (error) {
      set({ error: error.message })
    }
  }
}))

export default useColumnStore
