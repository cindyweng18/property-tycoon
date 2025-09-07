import './App.css'

function App() {
  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-sky-200 to-indigo-300 p-6">
      <h1 className="text-4xl font-extrabold text-center mb-8">
        Monopoly MVP
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-xl font-bold">Players</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-4 col-span-2">
          <h2 className="text-xl font-bold">Game Board</h2>
        </div>
      </div>
    </div>

    </>
  )
}

export default App
