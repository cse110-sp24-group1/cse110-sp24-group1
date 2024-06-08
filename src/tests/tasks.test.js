describe('Task List Functionality Tests', () => {
  
  beforeAll(async () => {
    await page.goto('https://cse110-sp24-group1.github.io/cse110-sp24-group1/src/tasks.html');
  });

  it('Checking that no tasks are loaded initially', async () => {
    console.log('Checking it should have a length of zero'); // Logging a message to the console
    const tasks = await page.evaluate(() => {
      const taskListElement = document.querySelector('task-list'); // Finding the task-list custom element
      if (!taskListElement) {
        console.log('task-list element not found');
        return [];
      }
      const shadowRoot = taskListElement.shadowRoot; // Accessing the shadow DOM of the task-list element
      if (!shadowRoot) {
        console.log('shadow root not found');
        return [];
      }
      const taskContainer = shadowRoot.querySelector('.task-container'); // Finding the task container within the shadow root
      if (!taskContainer) {
        console.log('task container not found');
        return [];
      }
      const tasks = Array.from(taskContainer.querySelectorAll('.task-item')); // Returning the list of task items within the task container
      console.log('Tasks found:', tasks.length);
      return tasks;
    });
    console.log('Number of tasks:', tasks.length);
    console.log(tasks);
    expect(tasks.length).toBe(1); // Asserting that the task list is initially empty
  });

  it('Checking that user can add a new task', async () => {
    // Add a new task
    await page.type('#new-task-input', 'Groceries'); // Typing the task name into the input field
    await page.click('#task-form button[type="submit"]'); // Clicking the submit button on the task form
    await page.waitForSelector('#modal', { visible: true }); // Waiting for the modal to become visible
    await page.type('#task-description', 'Fruits and veggies'); // Typing the task description
    await page.evaluate(() => {
      document.querySelector('#task-due-date').value = '2024-05-20'; // Setting the due date
    });
    await page.select('#task-label', 'Personal'); // Selecting 'Personal' from the dropdown
    await page.click('.sub-button'); // Clicking the submit button within the modal
    await page.waitForSelector('#modal', { hidden: true }); // Waiting for the modal to be hidden

    // Wait for the task to be added to the DOM
    const taskExists = await page.evaluate(() => {
      const taskListElement = document.querySelector('task-list'); // Finding the task-list element
      if (!taskListElement) {
        console.log('task-list element not found after modal submission');
        return false;
      }
      const shadowRoot = taskListElement.shadowRoot; // Accessing the shadow DOM
      if (!shadowRoot) {
        console.log('shadowRoot not found after modal submission');
        return false;
      }
      const taskContainer = shadowRoot.querySelector('.task-container'); // Finding the task container
      if (!taskContainer) {
        console.log('task-container not found after modal submission');
        return false;
      }
      const taskItems = taskContainer.querySelectorAll('.task-item'); // Finding the task items
      console.log(`Task items found after modal submission: ${taskItems.length}`);
      return taskItems.length === 2; // Returning true if one task item is found
    });
    console.log('Task added to DOM:', taskExists); // Logging whether the task was added to the DOM
    expect(taskExists).toBeTruthy(); // Asserting that the task was added successfully
  }, 20000); // Setting a timeout of 20000ms for this test

  it('Check to make sure <task-list> is present and has data in it', async () => {
    const taskListPresent = await page.evaluate(() => {
      const taskListElement = document.querySelector('task-list'); // Finding the task-list element
      return taskListElement !== null; // Returning true if the element is found
    });
    expect(taskListPresent).toBeTruthy(); // Asserting that the task-list element is present

    const taskListData = await page.evaluate(() => {
      const taskListElement = document.querySelector('task-list'); // Finding the task-list element
      if (!taskListElement) {
        return null;
      }
      const shadowRoot = taskListElement.shadowRoot; // Accessing the shadow DOM
      if (!shadowRoot) {
        return null;
      }
      const taskContainer = shadowRoot.querySelector('.task-container'); // Finding the task container
      return taskContainer.innerHTML; // Returning the inner HTML of the task container
    });
    expect(taskListData).toContain('Groceries'); // Asserting that the task list contains the task 'Groceries'
  }, 20000); // Setting a timeout of 20000ms for this test

  it('Check to make sure there are the correct number of tasks', async () => {
    // Add another task
    await page.type('#new-task-input', 'Meeting'); // Typing the task name into the input field
    await page.click('#task-form button[type="submit"]'); // Clicking the submit button on the task form
    await page.waitForSelector('#modal', { visible: true }); // Waiting for the modal to become visible
    await page.type('#task-description', 'Important work meeting'); // Typing the task description
    await page.evaluate(() => {
      document.querySelector('#task-due-date').value = '2024-06-20'; // Setting the due date
    });
    await page.select('#task-label', 'Work'); // Selecting 'Work' from the dropdown
    await page.click('.sub-button'); // Clicking the submit button within the modal
    await page.waitForSelector('#modal', { hidden: true }); // Waiting for the modal to be hidden

    const taskCount = await page.evaluate(() => {
      const taskListElement = document.querySelector('task-list'); // Finding the task-list element
      const shadowRoot = taskListElement.shadowRoot; // Accessing the shadow DOM
      const taskContainer = shadowRoot.querySelector('.task-container'); // Finding the task container
      const taskItems = taskContainer.querySelectorAll('.task-item'); // Finding the task items
      return taskItems.length; // Returning the number of task items
    });
    expect(taskCount).toBe(3); // Asserting that there are two task items
  }, 20000); // Setting a timeout of 20000ms for this test

  it('Check to make sure tasks are being deleted', async () => {
    // Delete a task
    await page.evaluate(() => {
      const taskListElement = document.querySelector('task-list'); // Finding the task-list element
      const shadowRoot = taskListElement.shadowRoot; // Accessing the shadow DOM
      const deleteButton = shadowRoot.querySelector('.task-item .delete-btn'); // Finding the delete button within the task item
      deleteButton.click(); // Clicking the delete button
    });

    const taskCountAfterDeletion = await page.evaluate(() => {
      const taskListElement = document.querySelector('task-list'); // Finding the task-list element
      const shadowRoot = taskListElement.shadowRoot; // Accessing the shadow DOM
      const taskContainer = shadowRoot.querySelector('.task-container'); // Finding the task container
      const taskItems = taskContainer.querySelectorAll('.task-item'); // Finding the task items
      return taskItems.length; // Returning the number of task items
    });

    expect(taskCountAfterDeletion).toBe(2); // Asserting that there is one task item left

    await page.evaluate(() => {
      const taskListElement = document.querySelector('task-list'); // Finding the task-list element
      const shadowRoot = taskListElement.shadowRoot; // Accessing the shadow DOM
      const deleteButton = shadowRoot.querySelector('.task-item .delete-btn'); // Finding the delete button within the task item
      deleteButton.click(); // Clicking the delete button
    });

    const taskCountAfterDeletion2 = await page.evaluate(() => {
      const taskListElement = document.querySelector('task-list'); // Finding the task-list element
      const shadowRoot = taskListElement.shadowRoot; // Accessing the shadow DOM
      const taskContainer = shadowRoot.querySelector('.task-container'); // Finding the task container
      const taskItems = taskContainer.querySelectorAll('.task-item'); // Finding the task items
      return taskItems.length; // Returning the number of task items
    });
    expect(taskCountAfterDeletion2).toBe(1); // Asserting that there are no task items left
  });

  it('should add multiple tasks through with local storage', async () => {
    console.log('Checking the initial task count and then adding multiple tasks through the UI'); // Logging a message to the console

    // Retrieve the initial stored taskList from localStorage
    let initialStoredTaskList = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('taskList')) || []; // Getting the task list from local storage
    });

    // Expect the initial taskList to be empty
    expect(initialStoredTaskList.length).toBe(1); // Asserting that the initial task list is empty

    // Fill out the first task form and submit
    await page.type('#new-task-input', 'School reunion'); // Typing the task name into the input field
    await page.click('#task-form button[type="submit"]'); // Clicking the submit button on the task form

    // Fill out the first modal form and submit
    await page.waitForSelector('#modal', { visible: true }); // Waiting for the modal to become visible
    await page.type('#task-description', '10 year'); // Typing the task description
    
    // Instead of typing the date, set the value directly
    await page.evaluate(() => {
        document.querySelector('#task-due-date').value = '2024-05-20'; // Setting the due date
    });

    await page.select('#task-label', 'Social'); // Selecting 'Social' from the dropdown
    await page.click('.sub-button'); // Clicking the submit button within the modal

    // Retrieve the stored taskList from localStorage after adding the first task
    let storedTaskList = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('taskList')); // Getting the task list from local storage
    });

    // Expect the stored taskList to contain one task
    expect(storedTaskList.length).toBe(1); // Asserting that the task list contains one task

    // Expect the stored taskList to contain the first task
    expect(storedTaskList).toEqual([
      {
        id: expect.any(String), // id will be dynamically generated
        name: 'School reunion',
        description: '10 year',
        dueDate: '2024-05-20',
        label: 'Social',
        color: expect.any(String), // color will be selected from the color input
        checked: false // add the checked property
      }
    ]);

    // Add a second task
    await page.type('#new-task-input', 'Workout'); // Typing the task name into the input field
    await page.click('#task-form button[type="submit"]'); // Clicking the submit button on the task form

    // Fill out the second modal form and submit
    await page.waitForSelector('#modal', { visible: true }); // Waiting for the modal to become visible
    await page.type('#task-description', 'leg day'); // Typing the task description
    
    // Instead of typing the date, set the value directly
    await page.evaluate(() => {
        document.querySelector('#task-due-date').value = '2024-06-15'; // Setting the due date
    });

    await page.select('#task-label', 'Health and Fitness'); // Selecting 'Health and Fitness' from the dropdown
    await page.click('.sub-button'); // Clicking the submit button within the modal

    // Retrieve the stored taskList from localStorage after adding the second task
    storedTaskList = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('taskList')); // Getting the task list from local storage
    });

    // Expect the stored taskList to contain two tasks
    expect(storedTaskList.length).toBe(2); // Asserting that the task list contains two tasks

    // Expect the stored taskList to contain both tasks
    expect(storedTaskList).toEqual([
      {
        id: expect.any(String), // id will be dynamically generated
        name: 'School reunion',
        description: '10 year',
        dueDate: '2024-05-20',
        label: 'Social',
        color: expect.any(String), // color will be selected from the color input
        checked: false // add the checked property
      },
      {
        id: expect.any(String), // id will be dynamically generated
        name: 'Workout',
        description: 'leg day',
        dueDate: '2024-06-15',
        label: 'Health and Fitness',
        color: expect.any(String), // color will be selected from the color input
        checked: false // add the checked property
      }
    ]);
  }, 20000); // Setting a timeout of 20000ms for this test

  it('should delete tasks and check they are removed from localStorage', async () => {
    console.log('Deleting tasks and checking they are removed from localStorage'); // Logging a message to the console

    // Verify tasks were added
    let storedTaskList = await page.evaluate(() => {
      const tasks = localStorage.getItem('taskList'); // Getting the task list from local storage
      console.log('Stored task list before deletion:', tasks);
      return JSON.parse(tasks) || [];
    });
    console.log('Stored task list before deletion:', storedTaskList);
    expect(storedTaskList.length).toBe(1); // Asserting that the task list contains two tasks

    // Delete the first task
    await page.evaluate(() => {
      const taskListElement = document.querySelector('task-list'); // Finding the task-list element
      const shadowRoot = taskListElement.shadowRoot; // Accessing the shadow DOM
      const deleteButton = shadowRoot.querySelector('.task-item .delete-btn'); // Finding the delete button within the task item
      deleteButton.click(); // Clicking the delete button
    });

    // Retrieve the stored taskList from localStorage after deleting the first task
    storedTaskList = await page.evaluate(() => {
      const tasks = localStorage.getItem('taskList'); // Getting the task list from local storage
      console.log('Stored task list after deleting first task:', tasks);
      return JSON.parse(tasks) || [];
    });
    console.log('Stored task list after deleting first task:', storedTaskList);
    // Expect the stored taskList to contain one task
    expect(storedTaskList.length).toBe(1); // Asserting that the task list contains one task

    // Delete the second task
    await page.evaluate(() => {
      const taskListElement = document.querySelector('task-list'); // Finding the task-list element
      const shadowRoot = taskListElement.shadowRoot; // Accessing the shadow DOM
      const deleteButton = shadowRoot.querySelector('.task-item .delete-btn'); // Finding the delete button within the task item
      deleteButton.click(); // Clicking the delete button
    });

    // Retrieve the stored taskList from localStorage after deleting the second task
    storedTaskList = await page.evaluate(() => {
      const tasks = localStorage.getItem('taskList'); // Getting the task list from local storage
      console.log('Stored task list after deleting second task:', tasks);
      return JSON.parse(tasks) || [];
    });
    console.log('Stored task list after deleting second task:', storedTaskList);
    // Expect the stored taskList to be empty
    expect(storedTaskList.length).toBe(0); // Asserting that the task list is empty
  }, 20000); // Setting a timeout of 20000ms for this test

  // New Test: Edit a Task and Verify Changes in Local Storage */

  it('should create and edit a task', async () => {
    // Add a new task
    await page.type('#new-task-input', 'Pay bills'); // Typing the task name into the input field
    await page.click('#task-form button[type="submit"]'); // Clicking the submit button on the task form
    await page.waitForSelector('#modal', { visible: true }); // Waiting for the modal to become visible
    await page.type('#task-description', 'rent'); // Typing the task description
    await page.evaluate(() => {
      document.querySelector('#task-due-date').value = '2024-05-20'; // Setting the due date
    });
    await page.select('#task-label', 'Finance'); // Selecting 'Finance' from the dropdown
    await page.click('.sub-button'); // Clicking the submit button within the modal
    await page.waitForSelector('#modal', { hidden: true }); // Waiting for the modal to be hidden

    // Wait for the task to be added to the DOM
    const taskExists = await page.evaluate(() => {
      const taskListElement = document.querySelector('task-list'); // Finding the task-list element
      const shadowRoot = taskListElement.shadowRoot; // Accessing the shadow DOM
      const taskContainer = shadowRoot.querySelector('.task-container'); // Finding the task container
      const taskItems = taskContainer.querySelectorAll('.task-item'); // Finding the task items
      return taskItems.length === 2; // Returning true if one task item is found
    });
    expect(taskExists).toBeTruthy(); // Asserting that the task was added successfully

    // Click the edit button
    await page.evaluate(() => {
      const taskListElement = document.querySelector('task-list'); // Finding the task-list element
      const shadowRoot = taskListElement.shadowRoot; // Accessing the shadow DOM
      const editBtn = shadowRoot.querySelector('.task-item .edit-btn'); // Finding the edit button within the task item
      editBtn.click(); // Clicking the edit button
    });

    // Ensure edit inputs are visible before interacting
    await page.waitForFunction(() => {
      const taskListElement = document.querySelector('task-list'); // Finding the task-list element
      const shadowRoot = taskListElement.shadowRoot; // Accessing the shadow DOM
      return shadowRoot.querySelector('.task-desc-input') !== null; // Waiting for the edit inputs to be visible
    });

    // Edit the task details
    await page.evaluate(() => {
      const taskListElement = document.querySelector('task-list'); // Finding the task-list element
      const shadowRoot = taskListElement.shadowRoot; // Accessing the shadow DOM
      shadowRoot.querySelector('.task-desc-input').value = 'Rent and car bill.'; // Setting the new task description
      shadowRoot.querySelector('.task-date-input').value = '2024-11-30'; // Setting the new task due date
      shadowRoot.querySelector('#task-label').value = 'Finance'; // Setting the new task label
      shadowRoot.querySelector('.task-name-input').value = 'Two bills'; // Setting the new task name
    });

    await page.evaluate(() => {
      const taskListElement = document.querySelector('task-list'); // Finding the task-list element
      const shadowRoot = taskListElement.shadowRoot; // Accessing the shadow DOM
      const saveBtn = shadowRoot.querySelector('.save-btn'); // Finding the save button within the task item
      saveBtn.click(); // Clicking the save button
    });

    // Verify the task details have been updated
    const updatedTaskDetails = await page.evaluate(() => {
      const taskListElement = document.querySelector('task-list'); // Finding the task-list element
      const shadowRoot = taskListElement.shadowRoot; // Accessing the shadow DOM
      const taskItem = shadowRoot.querySelector('.task-item'); // Finding the task item
      const updatedTaskName = taskItem.querySelector('label[for]').textContent; // Getting the updated task name
      const updatedTaskDescription = taskItem.querySelector('.task-desc').textContent; // Getting the updated task description
      const updatedTaskDate = taskItem.querySelector('.task-date').textContent; // Getting the updated task due date
      const updatedTaskLabel = taskItem.querySelector('.task-label').textContent; // Getting the updated task label
      return {
        updatedTaskName,
        updatedTaskDescription,
        updatedTaskDate,
        updatedTaskLabel
      };
    });

    expect(updatedTaskDetails.updatedTaskName).toBe('Two bills'); // Asserting that the task name was updated
    expect(updatedTaskDetails.updatedTaskDescription).toBe('Rent and car bill.'); // Asserting that the task description was updated
    expect(updatedTaskDetails.updatedTaskDate).toContain('2024-11-30'); // Asserting that the task due date was updated
    expect(updatedTaskDetails.updatedTaskLabel).toBe('Finance'); // Asserting that the task label was updated
  }, 30000); // Setting a timeout of 30000ms for this test

  it('test reload', async () => {
    let initialStoredTaskList = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('taskList')) || []; // Getting the task list from local storage
    });
    // Expect the initial taskList to be empty
    expect(initialStoredTaskList.length).toBe(2); // Asserting that the initial task list contains one task
    await page.reload(); // Reloading the page

    let reloadedStoredTaskList = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('taskList')) || []; // Getting the task list from local storage
    });
    expect(reloadedStoredTaskList.length).toBe(initialStoredTaskList.length); // Asserting that the task list length is the same after reloading
  }, 30000); // Setting a timeout of 30000ms for this test

  it('should check and uncheck a task', async () => {
    // Wait for the task to be added to the DOM
    const taskExists = await page.evaluate(() => {
      const taskListElement = document.querySelector('task-list'); // Finding the task-list element
      const shadowRoot = taskListElement.shadowRoot; // Accessing the shadow DOM
      const taskContainer = shadowRoot.querySelector('.task-container'); // Finding the task container
      const taskItems = taskContainer.querySelectorAll('.task-item'); // Finding the task items
      return taskItems.length >= 1; // Returning true if there is at least one task item
    });
    expect(taskExists).toBeTruthy(); // Asserting that the task was added successfully

    // Click the checkbox to check the task
    await page.evaluate(() => {
      const taskListElement = document.querySelector('task-list'); // Finding the task-list element
      const shadowRoot = taskListElement.shadowRoot; // Accessing the shadow DOM
      const checkbox = shadowRoot.querySelector('.task-item .check'); // Finding the checkbox within the task item
      checkbox.click(); // Clicking the checkbox
    });

    // Verify the task is greyed out
    const taskChecked = await page.evaluate(() => {
      const taskListElement = document.querySelector('task-list'); // Finding the task-list element
      const shadowRoot = taskListElement.shadowRoot; // Accessing the shadow DOM
      const taskItem = shadowRoot.querySelector('.task-item'); // Finding the task item
      const isChecked = taskItem.querySelector('.check').checked; // Checking if the checkbox is checked
      const isGreyedOut = taskItem.style.opacity === '0.5' && taskItem.style.backgroundColor === 'lightgrey'; // Checking if the task item is greyed out
      return isChecked && isGreyedOut; // Returning true if the task item is checked and greyed out
    });

    expect(taskChecked).toBeTruthy(); // Asserting that the task item is checked and greyed out

    // Uncheck the checkbox
    await page.evaluate(() => {
      const taskListElement = document.querySelector('task-list'); // Finding the task-list element
      const shadowRoot = taskListElement.shadowRoot; // Accessing the shadow DOM
      const checkbox = shadowRoot.querySelector('.task-item .check'); // Finding the checkbox within the task item
      checkbox.click(); // Clicking the checkbox
    });

    // Verify the task is no longer greyed out
    const taskUnchecked = await page.evaluate(() => {
      const taskListElement = document.querySelector('task-list'); // Finding the task-list element
      const shadowRoot = taskListElement.shadowRoot; // Accessing the shadow DOM
      const taskItem = shadowRoot.querySelector('.task-item'); // Finding the task item
      const isChecked = taskItem.querySelector('.check').checked; // Checking if the checkbox is checked
      const isGreyedOut = taskItem.style.opacity === '' && taskItem.style.backgroundColor === ''; // Checking if the task item is no longer greyed out
      return !isChecked && isGreyedOut; // Returning true if the task item is unchecked and not greyed out
    });

    expect(taskUnchecked).toBeTruthy(); // Asserting that the task item is unchecked and not greyed out
  }, 30000); // Setting a timeout of 30000ms for this test
});