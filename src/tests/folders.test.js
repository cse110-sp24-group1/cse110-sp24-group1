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
    await page.goto('https://cse110-sp24-group1.github.io/cse110-sp24-group1/src/'); // Navigating to the specified URL change based on your live server or pages when ready 
  });

  const delay = time => new Promise(res => setTimeout(res, time));

  it('should recognize that there are no folders', async () => {
    // Wait for the page to load and the HomeScript to initialize
    await page.waitForSelector('main');

    // Check if there are any folders rendered
    const foldersCount = await page.$$eval('.folder', folders => folders.length);

    expect(foldersCount).toBe(0);
  }, 2000);

  it('should create a new folder', async () => {
    // Wait for the new folder button to be available and click it
    await page.waitForSelector('#new-folder-button');
    await page.click('#new-folder-button');

    // Fill in the folder name
    await page.waitForSelector('#note-title');
    await page.type('#note-title', 'March Journals');

    // Submit the form to create the folder
    await page.click('.create-folder-button');

    // Wait for the folder to be added to the DOM
    await page.waitForSelector('.folder');

    // Check if the folder is present in the DOM
    const folderName = await page.$eval('.folder-title h3', el => el.innerText);

    expect(folderName).toBe('March Journals');
  }, 20000);

  test('should delete an existing folder', async () => {
    // Increase timeout for this specific test
    jest.setTimeout(30000);

    // Open the delete confirmation for the first folder
    console.log('Opening delete confirmation for the folder');
    await page.waitForSelector('.folder');

    // Hover over the folder to make the delete button visible
    const folderElement = await page.$('.folder');
    const boundingBox = await folderElement.boundingBox();
    const x = boundingBox.x + boundingBox.width / 2;
    const y = boundingBox.y + boundingBox.height / 2;

    // Move the mouse to the center of the folder element to trigger hover effect
    console.log('Hovering over the folder element');
    await page.mouse.move(x, y);
    await delay(1000); // Small delay to ensure hover effect

    // Directly manipulate DOM to ensure delete button is visible
    await page.evaluate(() => {
      const deleteButton = document.querySelector('.folder .delete-folder');
      if (deleteButton) {
        deleteButton.style.display = 'block';
      }
    });

    // Wait for the delete button to appear and click it
    const deleteButton = await page.$('.folder .delete-folder');
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

      // Verify the folder has been deleted
      console.log('Verifying the folder has been deleted');
      const foldersCount = await page.$$eval('.folder', folders => folders.length);
      expect(foldersCount).toBe(0);
    }
  }, 30000); // Set timeout for this test to 30 seconds

  test('should persist a created folder after refreshing the page', async () => {
    // Wait for the new folder button to be available and click it
    await page.waitForSelector('#new-folder-button');
    await page.click('#new-folder-button');

    // Fill in the folder name
    await page.waitForSelector('#note-title');
    await page.type('#note-title', 'Work Journal');

    // Submit the form to create the folder
    await page.click('.create-folder-button');

    // Wait for the folder to be added to the DOM
    await page.waitForSelector('.folder');

    // Refresh the page
    await page.reload();

    // Wait for the page to load and the HomeScript to initialize
    await page.waitForSelector('main');

    // Check if the folder is still present in the DOM
    const folderName = await page.$eval('.folder-title h3', el => el.innerText);

    expect(folderName).toBe('Work Journal');
  }, 30000); // Set timeout for this test to 30 seconds

  it('should create a folder within another folder', async () => {

    // Open the parent folder
    const parentFolder = await page.$('.folder');
    await parentFolder.click();

    // Create a new folder within the parent folder
    await page.waitForSelector('#new-folder-button');
    await page.click('#new-folder-button');
    await page.waitForSelector('#note-title');
    await page.type('#note-title', 'Client Information');
    await page.click('.create-folder-button');

    // Wait for the child folder to be added to the DOM
    await page.waitForSelector('.folder');

    // Check if the child folder is present in the DOM
    const folderName = await page.$$eval('.folder-title h3', folders => folders.some(folder => folder.innerText === 'Client Information'));

    expect(folderName).toBe(true);
  }, 30000); // Set timeout for this test to 30 seconds

  test('should add a note within the parent folder', async () => {
    // Wait for the new note button to be available and click it
    await page.waitForSelector('#new-note-button');
    await page.click('#new-note-button');

    // Fill in the note title
    await page.waitForSelector('#note-title');
    await page.type('#note-title', 'Potential Client List');

    // Submit the form to create the note
    await page.click('.create-button');

    // Wait for the note to be added to the DOM
    await page.waitForSelector('.note');

    // Check if the note is present in the DOM
    const noteTitle = await page.$eval('.note-title h3', el => el.innerText);

    expect(noteTitle).toBe('Potential Client List');
  }, 30000); // Set timeout for this test to 30 seconds
});
