import { useEffect, useRef, useState } from "react";
import { flags, taskStatus, tasks, users } from "../data";
import { formatDate } from "../utils/formatDate";
const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0");
const day = String(date.getDate()).padStart(2, "0");
const today = `${year}-${month}-${day}`;

function TaskModal({ onClose, onSave, initialTask }) {
  const [title, setTitle] = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(
    initialTask?.description ?? "",
  );
  const [endDate, setEndDate] = useState(initialTask?.deadline ?? today);
  const [assignedTo, setAssignedTo] = useState(
    initialTask?.assignedTo ?? users[0]?.userId ?? 0,
  );
  const [statusId, setStatusId] = useState(
    initialTask?.statusId ?? taskStatus[0]?.statusId ?? 1,
  );
  const defaultLowFlagId =
    flags.find((flag) => flag.name.toLowerCase() === "low")?.flagId ??
    flags[0]?.flagId ??
    1;
  const [selectedFlagId, setSelectedFlagId] = useState(
    initialTask?.flagId ?? defaultLowFlagId,
  );
  const [isFlagMenuOpen, setIsFlagMenuOpen] = useState(false);
  const [showTitleError, setShowTitleError] = useState(false);
  const flagPickerRef = useRef(null);
  const dateInputRef = useRef(null);

  const selectedFlag =
    flags.find((flag) => flag.flagId === selectedFlagId) || flags[0];

  // ngăn không cho cuộn trang khi modal đang mở
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  // đảm bảo khi click ra ngoài flag picker thì đóng menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        flagPickerRef.current &&
        !flagPickerRef.current.contains(event.target)
      ) {
        setIsFlagMenuOpen(false);
      }
    };

    if (isFlagMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFlagMenuOpen]);

  const handleSave = (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setShowTitleError(true);
      return;
    }

    const nextTaskId =
      tasks.length > 0 ? Math.max(...tasks.map((task) => task.taskId)) + 1 : 1;

    const newTask = {
      taskId: initialTask?.taskId ?? nextTaskId,
      title: trimmedTitle,
      description: description.trim() || null,
      statusId,
      flagId: selectedFlagId,
      assignedTo,
      deadline: endDate,
      attachments: initialTask?.attachments ?? 0,
    };

    if (typeof onSave === "function") {
      onSave(newTask);
      return;
    }

    onClose();
  };

  return (
    <div className="modal-overlay" role="presentation">
      <div className="task-modal" onClick={(event) => event.stopPropagation()}>
        <div className="task-modal-top">
          <div className="modal-flag-picker" ref={flagPickerRef}>
            <button
              type="button"
              className="flag-badge-btn"
              onClick={() => setIsFlagMenuOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={isFlagMenuOpen}
              aria-label="Choose flag"
              title={selectedFlag?.name || "Low"}
            >
              <svg
                width="15"
                height="17"
                viewBox="0 0 15 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M9.4 2L9 0H0V17H2V10H7.6L8 12H15V2H9.4Z"
                  fill={selectedFlag?.color || "#00FF00"}
                />
              </svg>
            </button>

            {isFlagMenuOpen && (
              <ul
                className="modal-flag-menu"
                role="listbox"
                aria-label="Flag options"
              >
                {flags.map((flag) => (
                  <li key={flag.flagId}>
                    <button
                      type="button"
                      className={
                        selectedFlagId === flag.flagId
                          ? "modal-flag-option is-active"
                          : "modal-flag-option"
                      }
                      onClick={() => {
                        setSelectedFlagId(flag.flagId);
                        setIsFlagMenuOpen(false);
                      }}
                    >
                      <span
                        className="modal-flag-dot"
                        style={{ backgroundColor: flag.color }}
                        aria-hidden="true"
                      />
                      {flag.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <h2 className="task-modal-title">
          {initialTask ? "Edit task" : "Save task"}
        </h2>

        <form className="task-form" onSubmit={handleSave} noValidate>
          <div className="task-form-grid">
            <div className="task-field title-field">
              <label htmlFor="task-title">
                Title <span className="required-mark">*</span>
              </label>
              <input
                id="task-title"
                className="task-input"
                type="text"
                placeholder="Type title of task"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  if (event.target.value.trim()) {
                    setShowTitleError(false);
                  }
                }}
              />
              {showTitleError && (
                <p className="field-error">Title is required</p>
              )}
            </div>

            <div className="task-field end-date-field">
              <label htmlFor="task-end-date">End Date</label>
              <div className="date-input-wrapper">
                <input
                  className="task-input date-display"
                  type="text"
                  value={formatDate(endDate)}
                  readOnly
                  onClick={() => dateInputRef.current?.showPicker()}
                />
                <button
                  type="button"
                  className="date-picker-trigger"
                  onClick={() => dateInputRef.current?.showPicker()}
                  aria-label="Open date picker"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M7 2V5M17 2V5M3 9H21M6 4H18C19.1046 4 20 4.89543 20 6V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V6C4 4.89543 4.89543 4 6 4Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <input
                  id="task-end-date"
                  ref={dateInputRef}
                  className="date-hidden"
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </div>
            </div>

            <div className="task-field description-field">
              <label htmlFor="task-description">Description</label>
              <textarea
                id="task-description"
                className="task-textarea"
                placeholder="Type description..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="task-field assign-field">
              <label htmlFor="task-assign">Assign</label>
              <select
                id="task-assign"
                className="task-select"
                value={`${assignedTo}`}
                onChange={(event) => setAssignedTo(Number(event.target.value))}
              >
                {users.map((user) => (
                  <option key={user.userId} value={user.userId}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="task-field status-field">
              <label htmlFor="task-status">Status</label>
              <select
                id="task-status"
                className="task-select"
                value={statusId}
                onChange={(event) => setStatusId(Number(event.target.value))}
              >
                {taskStatus.map((status) => (
                  <option key={status.statusId} value={status.statusId}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
