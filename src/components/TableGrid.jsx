import React, { useState } from 'react'
import useColumnStore from '../store/columnStore'
import useRecordStore from '../store/recordStore'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Menu } from '@headlessui/react'
import toast from 'react-hot-toast'

export default function TableGrid({ tableId, onSchemaEdit }) {
  const { columns } = useColumnStore()
  const { records, addRecord, updateRecord } = useRecordStore()
  const [newColumnName, setNewColumnName] = useState('')

  const handleAddRecord = async () => {
    await addRecord(tableId)
  }

  const handleCellChange = async (recordId, columnName, value) => {
    const record = records.find(r => r.id === recordId)
    const newData = { ...record.data, [columnName]: value }
    await updateRecord(recordId, newData)
  }

  const renderCell = (record, column) => {
    const value = record.data[column.name] || ''

    switch (column.type) {
      case 'boolean':
        return (
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => handleCellChange(record.id, column.name, e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded"
          />
        )
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleCellChange(record.id, column.name, e.target.value)}
            className="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        )
      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleCellChange(record.id, column.name, e.target.value)}
            className="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        )
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleCellChange(record.id, column.name, e.target.value)}
            className="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        )
    }
  }

  const ColumnMenu = ({ column }) => (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="inline-flex items-center">
        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
      </Menu.Button>
      <Menu.Items className="absolute z-10 mt-1 w-56 origin-top-right bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <Menu.Item>
          {({ active }) => (
            <button
              className={`${
                active ? 'bg-gray-100' : ''
              } group flex w-full items-center px-4 py-2 text-sm`}
              onClick={() => onSchemaEdit(column)}
            >
              Edit column
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  )

  return (
    <div className="h-full overflow-auto">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border group"
              >
                <div className="flex items-center gap-2">
                  <span>{column.name}</span>
                  <ColumnMenu column={column} />
                </div>
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border">
              <input
                type="text"
                placeholder="+ Add Column"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newColumnName.trim()) {
                    onSchemaEdit({ name: newColumnName, isNew: true })
                    setNewColumnName('')
                  }
                }}
                className="w-full bg-transparent focus:outline-none"
              />
            </th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {records.map((record) => (
            <tr key={record.id}>
              {columns.map((column) => (
                <td
                  key={`${record.id}-${column.id}`}
                  className="px-6 py-4 whitespace-nowrap border"
                >
                  {renderCell(record, column)}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap border"></td>
            </tr>
          ))}
          <tr>
            <td
              colSpan={columns.length + 1}
              className="px-6 py-4 whitespace-nowrap border hover:bg-gray-50 cursor-pointer"
              onClick={handleAddRecord}
            >
              <span className="text-gray-400">+ Add record</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
