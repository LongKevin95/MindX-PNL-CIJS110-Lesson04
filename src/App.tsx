import searchIcon from "./assets/icon-search.svg";
import { tasks, taskStatus } from "./data";
import "./App.css";
import TasksColumn from "./components/TasksColumn";
import TaskModal from "./components/TaskModal";
import { useState } from "react";

type TaskItem = {
  taskId: number;
  title: string;
  description: string | null;
  assignedTo: number;
  attachments: number;
  deadline: string;
  flagId: number;
  statusId: number;
};

function App() {
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [taskList, setTaskList] = useState<TaskItem[]>([...tasks]);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const handleOpenEditModal = (task: TaskItem) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const handleSaveTask = (savedTask: TaskItem) => {
    setTaskList((previousTasks) => {
      const hasExistingTask = previousTasks.some(
        (task) => task.taskId === savedTask.taskId,
      );

      if (!hasExistingTask) {
        return [...previousTasks, savedTask];
      }

      return previousTasks.map((task) =>
        task.taskId === savedTask.taskId ? savedTask : task,
      );
    });

    const dataTaskIndex = tasks.findIndex(
      (task) => task.taskId === savedTask.taskId,
    );

    if (dataTaskIndex === -1) {
      tasks.push(savedTask);
    } else {
      tasks[dataTaskIndex] = savedTask;
    }

    handleCloseModal();
  };

  return (
    <>
      {showModal && (
        <TaskModal
          onClose={handleCloseModal}
          onSave={handleSaveTask}
          initialTask={editingTask}
        />
      )}
      <header className="header">
        <div className="search-box">
          <img src={searchIcon} alt="" className="search-icon" />
          <input
            type="text"
            placeholder="Search Items"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <button className="btn-new-card" onClick={handleOpenCreateModal}>
          New Item
        </button>
      </header>
      <main className="kanban-board">
        {taskStatus.map((status) => {
          const columnTasks = taskList.filter((task) => {
            const formatedSearch = searchText.toLowerCase();
            const matchedStatus = task.statusId === status.statusId;
            if (searchText.trim() === "") {
              return matchedStatus;
            }

            const matchedTitle = task.title
              .toLowerCase()
              .includes(formatedSearch);
            const matchedDescription = task.description
              ?.toLowerCase()
              .includes(formatedSearch);
            return matchedStatus && (matchedTitle || matchedDescription);
          });

          return (
            <TasksColumn
              key={status.statusId}
              status={{ name: status.name, id: status.statusId }}
              tasks={columnTasks}
              onEditTask={handleOpenEditModal}
            />
          );
        })}
      </main>
    </>
  );
}

export default App;
