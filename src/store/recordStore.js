import { create } from 'zustand'
import { supabase } from '../lib/supabase'

const useRecordStore = create((set, get) => ({
  records: [],
  loading: false,
  error: null,

  fetchRecords: async (tableId) => {
    set({ loading: true })
    try {
      const { data, error } = await supabase
        .from('table_records')
        .select('*')
        .eq('table_id', tableId)
      if (error) throw error
      set({ records: data, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  addRecord: async (tableId) => {
    try {
      const { data, error } = await supabase
        .from('table_records')
        .insert([{
          table_id: tableId,
          data: {}
        }])
        .select()
      if (error) throw error
      set(state => ({ records: [...state.records, data[0]] }))
    } catch (error) {
      set({ error: error.message })
    }
  },

  updateRecord: async (recordId, data) => {
    try {
      const { data: updatedRecord, error } = await supabase
        .from('table_records')
        .update({ data })
        .eq('id', recordId)
        .select()
      if (error) throw error
      set(state => ({
        records: state.records.map(record =>
          record.id === recordId ? updatedRecord[0] : record
        )
      }))
    } catch (error) {
      set({ error: error.message })
    }
  }
}))

export default useRecordStore
