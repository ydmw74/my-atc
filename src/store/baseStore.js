import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useBaseStore = create((set, get) => ({
  bases: [],
  currentBase: null,
  loading: false,
  error: null,

  fetchBases: async () => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('bases')
        .select('*')
      if (error) throw error
      set({ bases: data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  createBase: async (baseName) => {
    try {
      const { data, error } = await supabase
        .from('bases')
        .insert([{ name: baseName }])
        .select()
      if (error) throw error
      set(state => ({ bases: [...state.bases, data[0]] }))
      return data[0]
    } catch (error) {
      set({ error: error.message })
      return null
    }
  },

  setCurrentBase: (base) => {
    set({ currentBase: base })
  }
}))

export default useBaseStore
