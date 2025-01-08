import React, { useEffect } from 'react'
import useTableStore from '../store/tableStore'
import useBaseStore from '../store/baseStore'
import BaseSelector from './BaseSelector'
import { PlusIcon } from '@heroicons/react/24/outline'

export default function Sidebar() {
  const { tables, currentTable, setCurrentTable, createTable, fetchTables, clearTables } = useTableStore()
  const { currentBase } = useBaseStore()
  const [newTableName, setNewTableName] = React.useState('')

  useEffect(() => {
    if (currentBase) {
      fetchTables(currentBase.id)
    } else {
      clearTables()
    }
  }, [currentBase])

  const handleCreateTable = (e) => {
    e.preventDefault()
    if (newTableName.trim() && currentBase) {
      createTable(newTableName, currentBase.id)
      setNewTableName('')
    }
  }

  return (
    <div className="w-64 bg-gray-800 h-screen flex flex-col">
      <BaseSelector />
      
      {currentBase && (
        <div className="flex-1 p-4">
          <div className="mb-4">
            <form onSubmit={handleCreateTable}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="New table name"
                  className="flex-1 px-3 py-2 rounded bg-gray-700 text-white text-sm"
                />
                <button
                  type="submit"
                  className="p-2 rounded bg-gray-700 hover:bg-gray-600"
                >
                  <PlusIcon className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </form>
          </div>
          <div className="space-y-1">
            {tables.map((table) => (
              <button
                key={table.id}
                onClick={() => setCurrentTable(table)}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  currentTable?.id === table.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {table.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
