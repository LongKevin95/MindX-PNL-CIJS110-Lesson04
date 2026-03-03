import TaskCard from "./TaskCard";

function TasksColumn({
  status,
  tasks,
  onEditTask,
}: {
  status: { name: string; id: number };
  tasks: {
    taskId: number;
    title: string;
    description: string | null;
    assignedTo: number;
    attachments: number;
    deadline: string;
    flagId: number;
    statusId: number;
  }[];
  onEditTask: (task: {
    taskId: number;
    title: string;
    description: string | null;
    assignedTo: number;
    attachments: number;
    deadline: string;
    flagId: number;
    statusId: number;
  }) => void;
}) {
  return (
    <>
      <div className="card-column">
        <div className="column-header">
          <div className="column-title">
            <span>{status.name}</span>
            <span className="task-count">{tasks.length}</span>
          </div>
          <div className="column-actions">
            <button className="icon-btn" aria-label="Thêm">
              +
            </button>
            <button className="icon-btn" aria-label="Tùy chọn">
              ⋯
            </button>
          </div>
        </div>
        <div className="column-cards">
          {tasks.map((task) => (
            <TaskCard key={task.taskId} task={task} onEditTask={onEditTask} />
          ))}
        </div>
      </div>
    </>
  );
}

export default TasksColumn;
