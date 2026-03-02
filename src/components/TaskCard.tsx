import { flags, users } from "../data";
import editPencilIcon from "../assets/edit-pencil.svg";
import paperclipIcon from "../assets/attachment-paperclip.svg";
import paperclipLightIcon from "../assets/attachment-paperclip-light.svg";
import clockIcon from "../assets/icon-clock.svg";
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
}

function TaskCard({
  task,
}: {
  task: {
    title: string;
    description: string | null;
    assignedTo: number;
    attachments: number;
    deadline: string;
    flagId: number;
    statusId: number;
  };
}) {
  const flagColor =
    flags.find((flag) => flag.flagId === task.flagId)?.color || "#C4C4C4";
  const assignedUser =
    users.find((user) => user.userId === task.assignedTo)?.name ||
    "Not assigned";

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3>{task.title}</h3>
        <button className="icon-btn">
          <img src={editPencilIcon} alt="pencil-image" />
        </button>
      </div>
      {task.description ? <p>{task.description}</p> : null}
      <div
        className={
          assignedUser === "Not assigned"
            ? "task-assigned not-assigned"
            : "task-assigned"
        }
      >
        {assignedUser}
      </div>

      <div className="task-footer">
        <span className="attachments">
          <img
            className="card-icon"
            src={task.attachments > 0 ? paperclipIcon : paperclipLightIcon}
            alt="attachment-image"
          />
          {task.attachments}
        </span>
        <svg
          className="card-icon"
          width="15"
          height="17"
          viewBox="0 0 15 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="card-flag"
            d="M9.4 2L9 0H0V17H2V10H7.6L8 12H15V2H9.4Z"
            fill={flagColor}
          />
        </svg>
        <span className="deadline">
          <img className=" card-icon" src={clockIcon} alt="clock-image" />
          {formatDate(task.deadline)}
        </span>
      </div>
    </div>
  );
}

export default TaskCard;
