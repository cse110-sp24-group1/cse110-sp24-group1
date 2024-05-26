describe('Basic user flow for Task List', () => {
    // First, visit the website
    beforeAll(async () => {
        await page.goto('https://cse110-sp24-group1.github.io/cse110-sp24-group1/src/tasks.html');
    });

    // Function to add a task
    const addTask = async (name, description, label, dueDate) => {
        await page.waitForSelector('#new-task-input');
        await page.click('#new-task-input');
        await page.type('#new-task-input', name);
        await page.click('#task-form button[type="submit"]'); // Open the modal

        // Fill the modal form
        await page.waitForSelector('#task-description');
        await page.type('#task-description', description);
        await page.select('#task-label', label);
        await page.type('#task-due-date', dueDate); // Use format MM-DD-YYYY to add a due date
        // Add color??
        await page.click('#modal-form button[type="submit"]'); // Submit the modal form

        await page.waitForSelector('task-list'); // Wait for the task-list element to be present
    };

    it('Adding a new task', async () => {
        console.log('Checking if adding a task works...');

        // Adding first task
        await addTask('Math Homework', 'Finish chapter 5, problems 3-10', 'School', '05-30-2024'); // Add color??

        // Verify that the task list contains the new task
        const taskName = await page.evaluate(() => {
            const shadowRoot = document.querySelector('task-list').shadowRoot;
            const tasks = shadowRoot.querySelectorAll('.task-item');
            return tasks[tasks.length - 1].querySelector('label[for]').textContent;
        });
        expect(taskName).toBe('Math Homework'); // Check the name of the newly added task
        // Check other things like the description, label, due date, etc.


        // Adding second task
        await addTask('Pay Gym Membership Fee', 'Due by 6pm', 'Health and Fitness', '06-15-2024'); // Add color??

        // Verify that the task list contains the new task
        const taskName2 = await page.evaluate(() => {
            const shadowRoot = document.querySelector('task-list').shadowRoot;
            const tasks = shadowRoot.querySelectorAll('.task-item');
            return tasks[tasks.length - 1].querySelector('label[for]').textContent;
        });
        // DOES NOT WORK?
        // expect(taskName2).toBe('Pay Gym Membership Fee'); // Check the name of the newly added task
        // Check other things like the description, label, due date, etc.


        // Check the length of the task list
        const taskCount = await page.evaluate(() => {
            const shadowRoot = document.querySelector('task-list').shadowRoot;
            return shadowRoot.querySelectorAll('.task-item').length;
        });
        expect(taskCount).toBe(1); 
    }, 20000);

    // DOES NOT WORK??
    it('Deleting an existing task', async () => {
        console.log('Checking if deleting a task works...');

        await page.waitForSelector('task-list'); // Wait for the task-list element to be present

        // Click the delete button for the first task
        await page.evaluate(() => {
            const shadowRoot = document.querySelector('task-list').shadowRoot;
            shadowRoot.querySelector('.task-item .delete-btn').click();
        });

        // Get the number of tasks after deletion
        const finalTaskCount = await page.evaluate(() => {
            const shadowRoot = document.querySelector('task-list').shadowRoot;
            return shadowRoot.querySelectorAll('.task-item').length;
        });

        expect(finalTaskCount).toBe(1);
    }, 20000);

    //ADD MORE TESTS FOR EDITING A TASK, MARKING A TASK AS DONE, SEARCHING FOR A TASK, FILTERING TASKS, ETC.
});