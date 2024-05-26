describe('Basic user flow for Task List', () => {
  // First, visit the website
  beforeAll(async () => {
    await page.goto('https://cse110-sp24-group1.github.io/cse110-sp24-group1/src/tasks.html');
  });

  // Close the browser after all tests are done
  afterAll(async () => {
    await browser.close();
  });

  it('Adding a new task', async () => {
    await page.click('#new-task-input');
    await page.type('#new-task-input', 'Test Task');

    await page.click('#task-form button[type="submit"]'); // Open the modal

    // Fill the modal form
    await page.type('#task-description', 'This is a test task description.');
    await page.select('#task-label', 'Work');
    await page.type('#task-due-date', '2024-05-30');

    await page.click('#modal-form button[type="submit"]'); // Submit the modal form

    const taskName = await page.$eval('.task-item label[for]', el => el.textContent);
    expect(taskName).toBe('Test Task');
  }, 10000);

  it('Editing an existing task', async () => {
    // Click the edit button of the first task
    await page.click('.task-item .edit-btn');

    // Fill the edit form
    await page.$eval('.task-desc-input', input => input.value = 'Updated task description');
    await page.$eval('.task-name-input', input => input.value = 'Updated Task');

    await page.click('.task-item button[type="submit"]'); // Click the save button

    const taskName = await page.$eval('.task-item label[for]', el => el.textContent);
    const taskDesc = await page.$eval('.task-item .task-desc', el => el.textContent);
    expect(taskName).toBe('Updated Task');
    expect(taskDesc).toBe('Updated task description');
  }, 10000);

  it('Deleting an existing task', async () => {
    const initialTaskCount = await page.$$eval('.task-item', tasks => tasks.length);

    // Click the delete button of the first task
    await page.click('.task-item .delete-btn');

    const finalTaskCount = await page.$$eval('.task-item', tasks => tasks.length);
    expect(finalTaskCount).toBe(initialTaskCount - 1);
  }, 10000);
});
