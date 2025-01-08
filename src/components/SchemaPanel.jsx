import React, { useState, useEffect } from 'react'
import useColumnStore from '../store/columnStore'
import { XMarkIcon } from '@heroicons/react/24/outline'

const COLUMN_TYPES = [
  { id: 'text', name: 'Text' },
  { id: 'number', name: 'Number' },
  { id: 'date', name: 'Date' },
  { id: 'boolean', name: 'Checkbox' }
]

export default function SchemaPanel({ column, onClose, tableId }) {
  const { addColumn } = useColumnStore()
  const [name, setName] = useState(column?.name || '')
  const [type, setType] = useState(column?.type || 'text')

  useEffect(() => {
    if (column) {
      setName(column.name || '')
      setType(column.type || 'text')
    }
  }, [column])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (column?.isNew) {
      await addColumn(tableId, { name, type })
    } else {
      // Handle column update
    }
    onClose()
  }

  if (!column) return null

  return (
    <div className="w-80 border-l bg-white p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">
          {column.isNew ? 'New Column' : 'Edit Column'}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Column Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Column Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              {COLUMN_TYPES.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {column.isNew ? 'Create Column' : 'Update Column'}
          </button>
        </div>
      </form>
    </div>
  )
}
