import searchIcon from "./assets/icon-search.svg";
import { tasks, taskStatus } from "./data";
import "./App.css";
import TasksColumn from "./components/TasksColumn";
import TaskModal from "./components/TaskModal";
import { useState } from "react";

function App() {
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {showModal && <TaskModal onClose={() => setShowModal(false)} />}
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
        <button className="btn-new-card" onClick={() => setShowModal(true)}>
          New Item
        </button>
      </header>
      <main className="kanban-board">
        {taskStatus.map((status) => {
          const columnTasks = tasks.filter((task) => {
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
            />
          );
        })}
      </main>
    </>
  );
}

export default App;
