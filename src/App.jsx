import React, { useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TableView from './components/TableView'
import useTableStore from './store/tableStore'
import useBaseStore from './store/baseStore'
import { Toaster } from 'react-hot-toast'

function App() {
  const { currentTable } = useTableStore()
  const { fetchBases } = useBaseStore()

  useEffect(() => {
    fetchBases()
  }, [])

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-gray-100 p-6">
        {currentTable ? (
          <TableView tableId={currentTable.id} />
        ) : (
          <div className="text-center text-gray-500 mt-10">
            Select a base and table to get started
          </div>
        )}
      </main>
      <Toaster />
    </div>
  )
}

export default App
