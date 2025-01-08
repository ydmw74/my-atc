import React, { useEffect, useState } from 'react'
import useColumnStore from '../store/columnStore'
import useRecordStore from '../store/recordStore'
import TableGrid from './TableGrid'
import SchemaPanel from './SchemaPanel'

export default function TableView({ tableId }) {
  const { fetchColumns } = useColumnStore()
  const { fetchRecords } = useRecordStore()
  const [selectedColumn, setSelectedColumn] = useState(null)

  useEffect(() => {
    if (tableId) {
      fetchColumns(tableId)
      fetchRecords(tableId)
    }
  }, [tableId])

  return (
    <div className="h-full flex">
      <div className="flex-1 overflow-hidden">
        <TableGrid
          tableId={tableId}
          onSchemaEdit={setSelectedColumn}
        />
      </div>
      <SchemaPanel
        column={selectedColumn}
        onClose={() => setSelectedColumn(null)}
        tableId={tableId}
      />
    </div>
  )
}
