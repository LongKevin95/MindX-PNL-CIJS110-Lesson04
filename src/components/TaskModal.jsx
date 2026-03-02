import { useEffect, useRef, useState } from "react";
import { flags, taskStatus, users } from "../data";
const formattedDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const newDate = `${year}-${month}-${day}`;
  return newDate;
};

function TaskModal({ onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endDate, setEndDate] = useState(formattedDate(new Date()));
  const [assignedTo, setAssignedTo] = useState(users[0]?.userId ?? 0);
  const [statusId, setStatusId] = useState("");
  const [showTitleError, setShowTitleError] = useState(false);
  const [selectedFlagId, setSelectedFlagId] = useState(0);
  const [isFlagMenuOpen, setIsFlagMenuOpen] = useState(false);
  const flagPickerRef = useRef(null);

  const flagOptions = [
    { flagId: 0, name: "Not assigned", color: "gray" },
    ...flags,
  ];
  const selectedFlag =
    flagOptions.find((flag) => flag.flagId === selectedFlagId) ||
    flagOptions[0];

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

    if (!title.trim()) {
      setShowTitleError(true);
      return;
    }

    onClose();
  };

  return (
    <div className="modal-overlay" role="presentation">
      <div className="task-modal" onClick={(event) => event.stopPropagation()}>
        <div className="task-modal-top">
          <div className="flag-picker" ref={flagPickerRef}>
            <button
              type="button"
              className="flag-trigger"
              onClick={() => setIsFlagMenuOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={isFlagMenuOpen}
              title={selectedFlag.name}
            >
              <svg
                width="15"
                height="17"
                viewBox="0 0 15 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.4 2L9 0H0V17H2V10H7.6L8 12H15V2H9.4Z"
                  fill={selectedFlag.color}
                />
              </svg>
            </button>

            {isFlagMenuOpen && (
              <ul className="flag-menu" role="listbox" aria-label="Choose flag">
                {flagOptions.map((flag) => (
                  <li key={flag.flagId}>
                    <button
                      type="button"
                      className={
                        selectedFlagId === flag.flagId
                          ? "flag-option is-active"
                          : "flag-option"
                      }
                      onClick={() => {
                        setSelectedFlagId(flag.flagId);
                        setIsFlagMenuOpen(false);
                      }}
                    >
                      <span
                        className="flag-dot"
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

        <h2 className="task-modal-title">Save task</h2>

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
              <input
                id="task-end-date"
                className="task-input"
                type="date"
                value={formattedDate(endDate)}
                onChange={(event) => setEndDate(event.target.value)}
              />
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
                value={assignedTo}
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
                onChange={(event) => setStatusId(event.target.value)}
              >
                <option value="">Choose status</option>
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
