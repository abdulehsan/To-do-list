import { useState } from "react";
import "./App.css";
import Modal from "react-modal";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { FcTodoList } from "react-icons/fc";
import { ImCancelCircle } from "react-icons/im";

function App() {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    success: false,
  });

  const openModal = (title, message, success) => {
    setModalContent({ title, message, success });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const addTask = () => {
    if (!taskText.trim() || !taskDesc.trim()) {
      openModal("Oops!", "Title or description is missing.", false);
      return;
    }
    if (new Date(taskDate) < new Date()) {
      openModal("Oops!", "Due date cannot be in the past.", false);
      return;
    }
    setTasks([
      ...tasks,
      {
        text: taskText,
        description: taskDesc,
        date: taskDate,
        day: new Date(taskDate).toLocaleDateString("en-US", {
          weekday: "long",
        }),
        checked: false,
      },
    ]);
    setTaskText("");
    setTaskDesc("");
    setTaskDate("");
    setShowForm(false);
    openModal("Success!", "Successfully added the task.", true);
  };

  const handleCheckboxChange = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, checked: !task.checked } : task
    );
    setTasks(newTasks);
  };

  const deleteTask = (index) => {
    if (tasks[index].checked) {
      const newTasks = tasks.filter((_, i) => i !== index);
      setTasks(newTasks);
    }
  };

  const editTask = (index) => {
    if (tasks[index].checked) {
      setEditingTask(index);
      setTaskText(tasks[index].text);
      setTaskDesc(tasks[index].description);
      setTaskDate(tasks[index].date);
      setShowForm(true);
    }
  };

  const saveTask = () => {
    if (!taskText.trim() || !taskDesc.trim()) {
      openModal("Ooops!", "Title or description is missing.", false);
      return;
    }
    if (new Date(taskDate) < new Date()) {
      openModal("Ooops!", "Due date cannot be in the past.", false);
      return;
    }
    const newTasks = tasks.map((task, i) =>
      i === editingTask
        ? {
            ...task,
            text: taskText,
            description: taskDesc,
            date: taskDate,
            day: new Date(taskDate).toLocaleDateString("en-US", {
              weekday: "long",
            }),
          }
        : task
    );
    setTasks(newTasks);
    setTaskText("");
    setTaskDesc("");
    setTaskDate("");
    setShowForm(false);
    setEditingTask(null);
    openModal("Success!", "Successfully updated the task.", true);
  };

  const toggleExpandTask = (index) => {
    setExpandedTask(expandedTask === index ? null : index);
  };

  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };
  return (
    <div className="App">
      <h1 className="title">
        Todo List
        <FcTodoList className="title-icon" />
      </h1>
      {showForm ? (
        <div className="task-form">
          <input
            type="text"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Task Title"
            className="task-input"
          />
          <input
            type="text"
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            placeholder="Task Description"
            className="task-input "
          />
          <input
            type="date"
            value={taskDate}
            min={getTodayDate()}
            onChange={(e) => setTaskDate(e.target.value)}
            className="task-input"
          />
          <div className="buttons">
            <button
              className="task-button"
              onClick={editingTask !== null ? saveTask : addTask}
            >
              <FaPlus className="task-button-icon" />
              {editingTask !== null ? "Save Task" : "Add Task"}
            </button>
            <button
              className="cancel-button"
              onClick={() => setShowForm(false)}
            >
              <ImCancelCircle className="cancel-button-icon" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button className="task-button" onClick={() => setShowForm(true)}>
          <FaPlus className="task-button-icon" />
          Add Tasks
        </button>
      )}
      <div className="tasks-container">
        {tasks.map((task, index) => (
          <div className="task" key={index}>
            <input
              type="checkbox"
              className="task-checkbox"
              checked={task.checked}
              onChange={() => handleCheckboxChange(index)}
            />
            <div
              className="task-content"
              onClick={() => toggleExpandTask(index)}
            >
              <span className="task-text">{task.text}</span>
              {expandedTask === index && (
                <>
                  <span className="task-desc">{task.description}</span>
                  <span className="task-date">
                    {task.date} {task.day}
                  </span>
                </>
              )}
            </div>
            <button
              className="edit-task-button"
              onClick={() => editTask(index)}
              disabled={!task.checked}
            >
              <FaEdit />
            </button>
            <button
              className="delete-task-button"
              onClick={() => deleteTask(index)}
              disabled={!task.checked}
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className={`modal ${
          modalContent.success ? "modal-success" : "modal-error"
        }`}
        overlayClassName="modal-overlay"
      >
        <div className="modal-content">
          <h2 className="modal-title">{modalContent.title}</h2>
          <p className="modal-message">{modalContent.message}</p>
          <button
            className={`modal-button ${
              modalContent.success
                ? "modal-button-success"
                : "modal-button-error"
            }`}
            onClick={closeModal}
          >
            {modalContent.success ? "Continue" : "Try Again"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
