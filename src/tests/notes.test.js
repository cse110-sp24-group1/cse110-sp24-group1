const puppeteer = require('puppeteer'); // Importing the Puppeteer library for browser automation

describe('Task List Functionality Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    // Launching the browser before all tests
    browser = await puppeteer.launch({
      headless: false, // Running the browser in headless mode
      slowMo: 50, // Slowing down each operation by 50ms for better visibility
    });
    page = await browser.newPage(); // Opening a new page
    await page.goto('http://127.0.0.1:5500/src/index.html'); // Navigating to the specified URL change based on your live server or pages when ready 
  });

  afterAll(async () => {
    await browser.close(); // Closing the browser after all tests
  });
  
  // Needed for delete test functionality 
  const delay = time => new Promise(res => setTimeout(res, time));

    test('should recognize that there are no notes', async () => {
      // Wait for the page to load and the HomeScript to initialize
      await page.waitForSelector('main');

      // Check if there are any notes rendered
      const notesCount = await page.$$eval('.note', notes => notes.length);

      expect(notesCount).toBe(0);
    }, 2000); // Set timeout for this test to 2 seconds

    it('should create a new note with a title and label', async () => {
      // Wait for the new note button to be available and click it
      await page.waitForSelector('#new-note-button');
      await page.click('#new-note-button');

      // Fill in the note title
      await page.waitForSelector('#note-title');
      await page.type('#note-title', 'Hello World Skeleton');

      // Select the label for the note
      await page.select('#note-label', 'code-snippets');

      // Submit the form to create the note
      await page.click('.create-button');

      // Wait for the note to be added to the DOM
      await page.waitForSelector('.note');

      // Check if the note is present in the DOM
      const noteTitle = await page.$eval('.note-title h3', el => el.innerText);
      const noteLabel = await page.$eval('.note-content', el => el.id);

      expect(noteTitle).toBe('Hello World Skeleton');
      expect(noteLabel).toBe('code-snippets');
  }, 20000); // Set timeout for this test to 20 seconds

  test('should edit an existing note title', async () => {
    // Increase timeout for this specific test
    jest.setTimeout(30000);

    // Open the note by clicking on it
    console.log('Opening the note for editing');
    await page.waitForSelector('.note');
    await page.click('.note');

    // Wait for the note modal to appear
    console.log('Waiting for the note modal to appear');
    await page.waitForSelector('.note-modal');

    // Edit the note title
    console.log('Editing the note title');
    const editTitle = await page.$('.edit-modal-title h2');
    await editTitle.click({ clickCount: 3 });
    await page.keyboard.press('Backspace');
    await editTitle.type('Hello World Skeleton C++');

    // Save the changes programmatically
    console.log('Saving the changes programmatically');
    await page.evaluate(() => {
        document.querySelector('.save-button').click();
    });

    // Wait for the note to be updated in the DOM
    console.log('Waiting for the note to be updated in the DOM');
    await page.waitForFunction(
        () => document.querySelector('.note-title h3').innerText.includes('Hello World Skeleton C++')
    );

    // Verify the note has been updated
    console.log('Verifying the note title');
    const noteTitle = await page.$eval('.note-title h3', el => el.innerText);
    expect(noteTitle).toBe('Hello World Skeleton C++');
  }, 30000); // Set timeout for this test to 30 seconds

test('should delete an existing note', async () => {
  // Increase timeout for this specific test
  jest.setTimeout(30000);

  // Open the delete confirmation for the first note
  console.log('Opening delete confirmation for the note');
  await page.waitForSelector('.note');

  // Hover over the note to make the delete button visible
  const noteElement = await page.$('.note');
  const boundingBox = await noteElement.boundingBox();
  const x = boundingBox.x + boundingBox.width / 2;
  const y = boundingBox.y + boundingBox.height / 2;

  // Move the mouse to the center of the note element to trigger hover effect
  console.log('Hovering over the note element');
  await page.mouse.move(x, y);
  await delay(1000); // Small delay to ensure hover effect

  // Directly manipulate DOM to ensure delete button is visible
  await page.evaluate(() => {
      const deleteButton = document.querySelector('.note .delete');
      if (deleteButton) {
          deleteButton.style.display = 'block';
      }
  });

  // Wait for the delete button to appear and click it
  const deleteButton = await page.$('.note .delete');
  if (!deleteButton) {
      console.log('Delete button not found');
  } else {
      const deleteButtonBox = await deleteButton.boundingBox();
      await page.mouse.move(deleteButtonBox.x + deleteButtonBox.width / 2, deleteButtonBox.y + deleteButtonBox.height / 2);
      await delay(500); // Ensure the delete button is fully hovered

      // Click the delete button
      await deleteButton.click();

      // Wait for the confirmation modal to appear and confirm deletion
      console.log('Confirming deletion');
      await page.waitForSelector('.yes-button');
      await page.click('.yes-button');

      // Verify the note has been deleted
      console.log('Verifying the note has been deleted');
      const notesCount = await page.$$eval('.note', notes => notes.length);
      expect(notesCount).toBe(0);
  }
}, 30000); // Set timeout for this test to 30 seconds

});
