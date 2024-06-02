// Define a custom element for a task list
class TaskList extends HTMLElement {
  constructor () {
    super();
   
    // Create a shadow DOM for encapsulation
    this.attachShadow({ mode: 'open' });
    
    // Set up the initial HTML structure for the task list
    this.shadowRoot.innerHTML = `
      <link rel="stylesheet" type="text/css" href="./styles/global.css" media="screen">
      <link rel="stylesheet" type="text/css" href="./styles/tasks.css" media="screen">
      <section class="task-container"></section>
    `;
 
    // Get a reference to the task container
    this.taskContainer = this.shadowRoot.querySelector('.task-container');
 
    // Event listener for when checkbox is checked to trigger confetti effect and to grey out the task and to remove greyed out when checkbox is unchecked
    this.taskContainer.addEventListener('change', (event) => {
      const checkbox = event.target;
      if (checkbox.tagName === 'INPUT' && checkbox.type === 'checkbox') {
        const taskItem = checkbox.closest('.task-item');
        if (checkbox.checked) {
          this.animateConfetti(taskItem);
          taskItem.style.opacity = '0.5';
          taskItem.style.backgroundColor = 'lightgrey';
        } else {
          taskItem.style.opacity = '';
          taskItem.style.backgroundColor = '';
        }
      }
    });
  }
 
  /**
   * Add a new task to the task list from the modal form.
   */
  addTaskFromModal () {
    // Get the necessary elements from the modal form
    const modalForm = document.querySelector('#modal-form');
    const taskDescriptionInput = modalForm.querySelector('#task-description');
    const newTaskText = taskDescriptionInput.value.trim();
    const taskDueDate = modalForm.querySelector('#task-due-date').value;
    const newTaskName = document.querySelector('#new-task-input').value;
    let taskLabel = modalForm.querySelector('#task-label').value;
    const taskColor = modalForm.querySelector('#task-color').value;
 
    // Validate the new task text
    if (newTaskText === '') return;
 
    // Handle the case where a new label is created
    if (taskLabel === 'createNew') {
      const newLabelInput = modalForm.querySelector('#new-label-input');
      const newLabel = newLabelInput.value.trim();
 
      // Validate the new label text
      if (newLabel === '') return;
      taskLabel = newLabel;
    }
 
    // Generate a unique task ID
    const taskId = `task${this.taskContainer.children.length + 1}`;
    // Create a new task element
    const newTask = document.createElement('section');
    newTask.classList.add('task-item');
    newTask.dataset.label = taskLabel;
    // Populate the task element with the new task data which incluudees checkbox, task name, desscription, due date, label, and label color using HTML content
    newTask.innerHTML = `
        <div class="task-main">
        <input type="checkbox" id="${taskId}">
        <label for="${taskId}">${newTaskName}</label>
        <button class="edit-btn">✏️</button>
        </div>
        <label class="task-desc">${newTaskText}</label>
        <div class="task-footer">
        <div class="date-label">
            <div class="task-label" style="background-color: ${taskColor}; ${this.calculateTextColor(taskColor)}">
            ${taskLabel}
            </div>
            ${
            taskDueDate 
                ? `
            <div class="task-date">
                <label>🗓️ ${taskDueDate}</label>
            </div>
            ` 
                : '<div class="task-date no-date"><label></label></div>'
            }
        </div>
        <div class="task-buttons">
            <button class="delete-btn">🗑️</button>
        </div>
        </div>
    `;

    // Add event listeners for the edit and delete buttons
    const editBtn = newTask.querySelector('.edit-btn');
    const deleteBtn = newTask.querySelector('.delete-btn');
    editBtn.addEventListener('click', () => this.editTask(newTask));
    deleteBtn.addEventListener('click', () => this.deleteTask(newTask));
 
    // Append the new task to the task container
    this.taskContainer.appendChild(newTask);
    // Reset the new task input and modal form
    document.querySelector('#new-task-input').value = '';
    modalForm.reset();
  }
 
  /**
   * Calculate the text color based on the background color.
   * @param {string} color - The background color in hexadecimal format.
   * @returns {string} - The appropriate text color style.
   */
  calculateTextColor (color) {
    const hex = color.substring(1);
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5 ? 'color: white;' : '';
  }
 
  /**
   * Edit a task in the task list.
   * @param {HTMLElement} taskElement - The task element to be edited.
   */
  editTask (taskElement) {
    const taskDesc = taskElement.querySelector('.task-desc');
    const taskLabel = taskElement.querySelector('.task-label');
    const taskDate = taskElement.querySelector('.task-date');
    const taskName = taskElement.querySelector('label[for]');
    const editBtn = taskElement.querySelector('.edit-btn');

    taskElement.classList.toggle("editing-task");
    
    // Create an input element for task description
    const taskDescInput = document.createElement('input');
    taskDescInput.type = 'text';
    taskDescInput.value = taskDesc.textContent;
    taskDescInput.classList.add('task-desc-input');
 
    const taskLabelSelect = document.createElement('select');
    taskLabelSelect.id = 'task-label';
    taskLabelSelect.name = 'task-label';
    const labels = ['Default', 'Work', 'Personal', 'Health and Fitness', 'Finance', 'Social', 'Travel', 'School', 'Create New Label'];
    for (const label of labels) {
      const option = document.createElement('option');
      option.value = label === 'Create New Label' ? 'createNew' : label;
      // HOW TO DO CREATE NEW LABEL?
      option.textContent = label;
      if (label === taskLabel.textContent) {
        option.selected = true;
      }
      taskLabelSelect.appendChild(option);
    }
 
    // Create an input element for task date
    const taskDateInput = document.createElement('input');
    taskDateInput.type = 'date';
    taskDateInput.value = taskDate.textContent.substring(2);
    taskDateInput.classList.add('task-date-input');
 
    // Create an input element for task name
    const taskNameInput = document.createElement('input');
    taskNameInput.type = 'text';
    taskNameInput.value = taskName.textContent;
    taskNameInput.classList.add('task-name-input');
 
    // Create a save button
    const saveBtn = document.createElement('button');
    saveBtn.classList.add('save-btn');
    saveBtn.textContent = 'Save';
 
    // Replace the task content with the input elements
    taskDesc.replaceWith(taskDescInput);
    taskLabel.replaceWith(taskLabelSelect);
    taskDate.replaceWith(taskDateInput);
    taskName.replaceWith(taskNameInput);
    editBtn.replaceWith(saveBtn);
 
    // Add event listener to the save button
    saveBtn.addEventListener('click', () => {
      // Update the task content with the input values
      taskDesc.textContent = taskDescInput.value;
      taskLabel.textContent = taskLabelSelect.value;
      taskDate.textContent = taskDateInput.value ? `🗓️ ${taskDateInput.value}` : '';
      if (taskDateInput.value === '') {
        taskDate.classList.add('no-date');
      } else {
        taskDate.classList.remove('no-date');
      }      
      taskName.textContent = taskNameInput.value;

      taskElement.classList.toggle("editing-task");
 
      // Replace the input elements with the original elements
      taskDescInput.replaceWith(taskDesc);
      taskLabelSelect.replaceWith(taskLabel);
      taskDateInput.replaceWith(taskDate);
      taskNameInput.replaceWith(taskName);
      saveBtn.replaceWith(editBtn);
    });
  }
 
  /**
   * Delete a task from the task list.
   * @param {HTMLElement} taskElement - The task element to be deleted.
   */
  deleteTask (taskElement) {
    taskElement.remove();
  }
 
  /**
   * Search for tasks based on the search query.
   * @param {string} query - The search query.
   */
  searchTasks (query) {
    const tasks = this.shadowRoot.querySelectorAll('.task-item');
    tasks.forEach(task => {
      const taskName = task.querySelector('label[for]').textContent.toLowerCase();
      const taskDesc = task.querySelector('.task-desc').textContent.toLowerCase();
      const taskLabel = task.querySelector('.task-label').textContent.toLowerCase();
      if (taskName.includes(query) || taskDesc.includes(query) || taskLabel.includes(query)) {
        task.style.display = 'block';
      } else {
        task.style.display = 'none';
      }
    });
  }
 
  /**
   * Animate confetti effect for the given target element.
   * @param {HTMLElement} target - The target element to animate confetti.
   */
  animateConfetti (target) {
    const confettiCount = 100;
    const fragment = document.createDocumentFragment();
 
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('i');
      confetti.classList.add('confetti');
 
      const xPos = Math.random() * 500 - 250;
      const yPos = Math.random() * 200 - 150;
      const rotation = Math.random() * 360;
 
      confetti.style.transform = `translate3d(${xPos}px, ${yPos}px, 0) rotate(${rotation}deg)`;
      confetti.style.backgroundColor = `hsla(${Math.random() * 360}, 100%, 50%, 1)`;
      confetti.style.animation = 'bang 700ms ease-out forwards';
      confetti.style.opacity = '0';
 
      fragment.appendChild(confetti);
    }
 
    target.appendChild(fragment);
  }
}
 
// Define the custom element 'task-list'
customElements.define('task-list', TaskList);
 
// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get the necessary elements from the DOM
  const taskForm = document.getElementById('task-form');
  const newTaskInput = document.getElementById('new-task-input');
  const modal = document.getElementById('modal');
  const modalForm = document.getElementById('modal-form');
  const closeModalBtn = document.querySelector('.close-modal');
  const taskLabelSelect = document.getElementById('task-label');
  const newLabelInput = document.getElementById('new-label-input');
  const taskContainer = document.querySelector('.task-container');
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-bar');
 
  // Open the modal when the task form is submitted
  taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    openModal();
  });
 
  // Close the modal when the close button is clicked
  closeModalBtn.addEventListener('click', closeModal);
 
  // Add a new task when the modal form is submitted
  modalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const taskList = document.createElement('task-list');
    taskContainer.appendChild(taskList);
    taskList.addTaskFromModal();
    closeModal();
  });
 
  // Show or hide the new label input based on the selected value
  taskLabelSelect.addEventListener('change', () => {
    if (taskLabelSelect.value === 'createNew') {
      newLabelInput.style.display = 'inline-block';
    } else {
      newLabelInput.style.display = 'none';
    }
  });
 
  // Search functionality for the task list
  searchBtn.addEventListener('click', () => {
    const taskList = document.querySelector('.task-list');
    const searchQuery = searchInput.value.trim().toLowerCase();
    taskList.searchTasks(searchQuery);
  });
 
  /**
   * Open the modal for adding a new task.
   */
  function openModal () {
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
    const modalTitle = document.querySelector('.modal-title');
    const newTaskInputValue = newTaskInput.value.trim();
    if (newTaskInputValue) {
      modalTitle.textContent = newTaskInputValue;
    } else {
      modalTitle.textContent = 'New Task';
    }
  }
 
  /**
   * Close the modal.
   */
  function closeModal () {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
});
