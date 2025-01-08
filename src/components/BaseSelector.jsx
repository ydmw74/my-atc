import React, { useState } from 'react'
import useBaseStore from '../store/baseStore'
import { PlusIcon } from '@heroicons/react/24/outline'

export default function BaseSelector() {
  const { bases, currentBase, setCurrentBase, createBase } = useBaseStore()
  const [isCreating, setIsCreating] = useState(false)
  const [newBaseName, setNewBaseName] = useState('')

  const handleCreateBase = async (e) => {
    e.preventDefault()
    if (newBaseName.trim()) {
      await createBase(newBaseName)
      setNewBaseName('')
      setIsCreating(false)
    }
  }

  return (
    <div className="p-4 bg-gray-900">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-white font-semibold">Bases</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1 rounded hover:bg-gray-700"
        >
          <PlusIcon className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreateBase} className="mb-2">
          <input
            type="text"
            value={newBaseName}
            onChange={(e) => setNewBaseName(e.target.value)}
            placeholder="New base name"
            className="w-full px-3 py-2 rounded bg-gray-700 text-white text-sm"
            autoFocus
          />
        </form>
      )}

      <div className="space-y-1">
        {bases.map((base) => (
          <button
            key={base.id}
            onClick={() => setCurrentBase(base)}
            className={`w-full text-left px-3 py-2 rounded text-sm ${
              currentBase?.id === base.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {base.name}
          </button>
        ))}
      </div>
    </div>
  )
}
