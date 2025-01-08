import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useTableStore = create((set, get) => ({
  tables: [],
  currentTable: null,
  loading: false,
  error: null,

  fetchTables: async (baseId) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('tables')
        .select('*')
        .eq('base_id', baseId)
      if (error) throw error
      set({ tables: data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  createTable: async (tableName, baseId) => {
    try {
      const { data, error } = await supabase
        .from('tables')
        .insert([{ name: tableName, base_id: baseId }])
        .select()
      if (error) throw error
      set(state => ({ tables: [...state.tables, data[0]] }))
    } catch (error) {
      set({ error: error.message })
    }
  },

  setCurrentTable: (table) => {
    set({ currentTable: table })
  },

  clearTables: () => {
    set({ tables: [], currentTable: null })
  }
}))

export default useTableStore
