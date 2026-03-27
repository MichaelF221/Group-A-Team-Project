import { useState, useEffect } from "react";

function Kanban(){

    const [columns, setColumns] = useState({
      todo: {
        name: "Todo",
        items:[
          // {id: "1", content: "Research"},
          // {id: "2", content: "IT Projects"}
        ],
      },
      inProgress: {
        name: "In Progress",
        items:[
          // {id: "3", content: "Software Engineering"},
        ],
      },
      done: {
         name: "Done",
        items:[
          // {id: "4", content: "Set up repository"},
        ],
      },
    });

    const [newTask, setNewTask] = useState("");
    const [activeColumns, setActiveColumn] = useState("todo");
    const [draggedItem, setDraggedItem] = useState(null);

    useEffect(() => {
      fetch("http://localhost:3001/assignments")
      .then(res => res.json())
      .then(data => {
        const updated = {
          todo: { name: "Todo", items: [] },
          inProgress: { name: "In Progress", items: [] },
          done: { name: "Done", items: [] }
        };
        data.forEach(a => {
          if (updated[a.status]) {
            updated[a.status].items.push({ id: a._id, content: a.title });
          }
        });
        setColumns(updated);
      });
    }, []);


    const addNewTask = async () => {
  if(newTask.trim() === "") return;
  const res = await fetch("http://localhost:3001/assignments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: newTask, status: activeColumns, dueDate: new Date() })
  });
  const a = await res.json();
  const updatedColumns = {...columns};
  updatedColumns[activeColumns].items.push({ id: a._id, content: a.title });
  setColumns(updatedColumns);
  setNewTask("");
};

    const removeTask = (columnId, taskId) => {
        const updatedColumns = {... columns};

        updatedColumns[columnId].items = updatedColumns[columnId].items
        .filter((item => item.id !== taskId));

        setColumns(updatedColumns);
    };

    const handleDragStart = (columnId, item) => {
        setDraggedItem({columnId, item})
    }

      const handleDragover = (e) => {
        e.preventDefault();
    }

    const handleDrop = (e, columnId) => {
        e.preventDefault();

        if(!draggedItem) return;

        const {columnId: sourceColumnId, item} = draggedItem;

        if(sourceColumnId === columnId) return;

        const updatedColumns = {...columns};

        updatedColumns[sourceColumnId].items = updatedColumns
        [sourceColumnId].items.filter((i) => i.id != item.id);

        updatedColumns[columnId].items.push(item);

        setColumns(updatedColumns);
        setDraggedItem(null);
    }

    const columnStyles = {
        todo: {
          header: "bg-linear-to-r from-blue-600 to-blue-400",
          border: "border-blue-400",
        },
        inProgress:{
          header: "bg-linear-to-r from-yellow-600 to-yellow-400",
          border: "border-yellow-400",
        },
        done:{
          header: "bg-linear-to-r from-green-600 to-green-400",
            border: "border-green-400",
        }
    }

    return (
        <>
          <div id="kanban" className="p-6 w-full min-h-screen bg-linear-to-b
          from-zinc-900 to-zinc-800 flex items-center justify-center">
            <div className="flex items-center justify-center flex-col
            gap-4 w-full max-w-6xl">
              <h1 className="text-6xl font-bold pt-15 mb-4 text-transparent
              bg-clip-text bg-linear-to-r from-orange-400
              via-amber-500 to-rose-400">StudyFlow Kanban Board</h1>
              <div className="mb-8 flex w-full max-w-lg shadow-lg
              rounded-lg overflow-hidden">
                <input type="text" value={newTask} 
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                className="grow p-3 bg-zinc-700 text-white"
                onKeyDown={(e) => e.key === "Enter" && addNewTask()}
                />

                <select value={activeColumns}
                onChange={(e) => setActiveColumn(e.target.value)}
                className="p-3 bg-zinc-700 text-white border-zinc-600"
                >
                  {Object.keys(columns).map((columnId) => (
                    <option value={columnId} key={columnId}>
                      {columns[columnId].name}
                    </option>
                  ))}
                </select>

                <button onClick={addNewTask} className="px-6
                bg-linear-to-r from-orange-500 to-amber-300
                hover:from-yellow-500 hover:to-amber-500
                transition-all duration-200 font-medium cursor-pointer">Add</button>
              </div>

              <div className="flex gap-6 overflow-x-auto pb-6 w-full items-start justify-center">
                {Object.keys(columns).map((columnId) => (
                    <div key={columnId}
                    className={`shrink-0 w-80 bg-zinc-800 rounded-lg
                      shadow-xl border-t-4 ${columnStyles[columnId].border}
                      `}
                      onDragOver={(e) =>  handleDragover(e)}
                        onDrop={(e) => handleDrop(e, columnId)}
                    >
                        <div className={`p-4 text-white font-bold text-xl
                            rounded-t-md ${columnStyles[columnId].header}`}>
                              {columns[columnId].name}
                              <span className="ml-2 px-2 py-1 bg-zinc-800 bg-opacity-30 
                              rounded-full text-sm">{columns[columnId].items.length
                              }</span>
                      </div>
                      <div className="p-3 min-h-64">
                        {columns[columnId].items.length === 0 ?(
                            <div className="text-center py-10 text-zinc-500
                            italic text-sm">Drop tasks here</div>
                        ) : (
                          columns[columnId].items.map((item) =>(
                            <div
                              key={item.id}
                              className="p-4 mb-3 bg-zinc-700 text-white rounded-lg shadow-md cursor-move flex items-center justify-between transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
                              draggable
                              onDragStart={() => handleDragStart(columnId, item)}
                            >
                              <span className="mr-2">{item.content}</span>
                              <button onClick={() => removeTask(columnId, item.id)}
                                className="text-zinc-400 hover:text-red-400 transition-colors
                                duration-200 w-6 h-6 flex items-center justify-center rounded-full
                                hover:bg-zinc-600"
                                >
                                    <span className="text-lg cursor-pointer">x</span>
                                </button>
                            </div>
                          ))
                        
                        )}
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </>
    )
}

export default Kanban;