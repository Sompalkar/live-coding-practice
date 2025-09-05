type TodoProps = {
    _id: string
    title: string
    onClick: (id: string) => void
    onEdit: (id: string, title: string) => void
    completed: boolean
  }
  
  export default function Todo({ _id, title, onClick, onEdit, completed }: TodoProps) {
    return (
      <div className={`flex items-center justify-between rounded-xl border p-4 shadow-sm hover:shadow-md transition-all duration-200 ${
        completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center gap-3 flex-1">
          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
            completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
          }`}>
            {completed && (
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <h1 className={`text-lg font-medium flex-1 ${
            completed ? 'line-through text-gray-500' : 'text-gray-900'
          }`}>
            {title}
          </h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(_id, title)}
            className="px-3 py-1.5 rounded-lg border border-blue-300 text-blue-600 text-sm hover:bg-blue-50 hover:border-blue-400 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onClick(_id)}
            className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    )
  }
  