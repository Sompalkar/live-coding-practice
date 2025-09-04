type TodoProps = {
    _id: string
    title: string
    onClick: (id: string) => void
    completed: boolean
  }
  
  export default function Todo({ _id, title, onClick }: TodoProps) {
    return (
      <div className="flex items-center justify-between rounded-2xl border p-4 shadow-sm hover:shadow-md transition">
        <h1 className="text-lg font-medium">{title}</h1>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-lg border text-sm hover:bg-gray-100">
            Edit
          </button>
          <button
            onClick={() => onClick(_id)}
            className="px-3 py-1 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    )
  }
  