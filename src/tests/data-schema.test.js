describe('Data Schema Tests for Notes, folders, and tasks as of now', () => {
  // First visit our website
  beforeAll(async () => {
    // Can change based on who/when running
    await page.goto('http://127.0.0.1:5501/src/assets/scripts/tests/test.html')
  })

  beforeEach(async () => {
    // Clear localStorage before each test
    await page.evaluate(() => localStorage.clear())
  })

  // Tests for getMainFolder
  // First test: empty Mainfolder return
  it('should return an empty MainFolder object if mainFolder does not exist in localStorage', async () => {
    console.log('Checking it should return an empty MainFolder object if mainFolder does not exist in localStorage')
    // Start by removing or simulating the removal and store into result
    const result = await page.evaluate(() => {
      localStorage.removeItem('mainFolder')
      return window.getMainFolder()
    })
    // Expect the result to be an empty MainFolder object matching given format
    expect(result).toEqual({
      name: 'Main',
      folders: [],
      tasks: []
    })
  })

  // Second test: existing Mainfolder return
  it('should return the correct MainFolder object when mainFolder exists in localStorage', async () => {
    console.log('Checking it should return the correct MainFolder object when mainFolder exists in localStorage')
    // Set up the mainFolder in localStorage
    const mainFolder = {
      name: 'Main',
      folders: ['f2', 'f2'],
      tasks: ['t1', 't2']
    }
    await page.evaluate((mainFolder) => {
      localStorage.setItem('mainFolder', JSON.stringify(mainFolder))
    }, mainFolder)

    // Again call getMainFolder and store in result
    const result = await page.evaluate(() => {
      return window.getMainFolder()
    })

    // Expect the result to match the mainFolder
    expect(result).toEqual(mainFolder)
  })

  // Third test: Saving MainFolder
  it('should save the provided MainFolder object to localStorage', async () => {
    console.log('Checking it should save the provided MainFolder object to localStorage')
    // Description: Verify that saveMainFolder correctly saves the object to localStorage
    // Create MainFolder object
    const mainFolder = {
      name: 'Main',
      folders: ['f1', 'f2'],
      tasks: ['t1', 't2']
    }

    // Call the function to save the MainFolder
    await page.evaluate((mainFolder) => {
      window.saveMainFolder(mainFolder)
    }, mainFolder)

    // Retrieve the stored item from localStorage
    const storedMainFolder = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('mainFolder'))
    })

    // Expect the stored item to match the MainFolder object
    expect(storedMainFolder).toEqual(mainFolder)
  })

  // Tests for getTaskList
  // First test: empty taskList return
  it('should return an empty array if taskList does not exist in localStorage', async () => {
    console.log('Checking it should return an empty array if taskList does not exist in localStorage')
    // Start by removing or simulating the removal and store into result
    const result = await page.evaluate(() => {
      localStorage.removeItem('taskList')
      return window.getTaskList()
    })
    // Expect the result to be an empty array
    expect(result).toEqual([])
  })

  // Second test: correct taskList return
  it('should return the correct array of tasks when taskList exists in localStorage', async () => {
    console.log('Checking it should return the correct array of tasks when taskList exists in localStorage')
    // Set up the taskList in localStorage
    const taskList = ['t1', 't2', 't3']
    await page.evaluate((taskList) => {
      localStorage.setItem('taskList', JSON.stringify(taskList))
    }, taskList)

    // Call getTaskList and store in result
    const result = await page.evaluate(() => {
      return window.getTaskList()
    })

    // Expect the result to match the taskList
    expect(result).toEqual(taskList)
  })

  // Third test: Saving taskList
  it('should save the provided taskList array to localStorage', async () => {
    console.log('Checking it should save the provided taskList array to localStorage')
    // Define the taskList array
    const taskList = ['t1', 't2', 't4']

    // Call the function to save the taskList
    await page.evaluate((taskList) => {
      window.saveTaskList(taskList)
    }, taskList)

    // Retrieve the stored item from localStorage
    const storedTaskList = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('taskList'))
    })

    // Expect the stored item to match the taskList array
    expect(storedTaskList).toEqual(taskList)
  })

  // Tests for getNote
  // First test: empty getNote return
  it('should return an empty note object if the specified note does not exist in localStorage', async () => {
    console.log('Checking it should return an empty note object if the specified note does not exist in localStorage')
    // Simulate the absence of the note in localStorage and store into result
    const noteId = 'note1'
    const result = await page.evaluate((noteId) => {
      localStorage.removeItem(noteId)
      const note = window.getNote(noteId)
      return {
        ...note,
        date: new Date(note.date).toISOString().slice(0, -8) + 'Z' // Remove seconds and milliseconds because would not match otherwise 
      }
    }, noteId)

    // Expect the result to be an empty note object with default values
    expect(result).toEqual({
      id: '',
      title: '',
      date: new Date().toISOString().slice(0, -8) + 'Z', // Remove seconds and milliseconds here as well 
      labels: [],
      text: '',
      markdown: false
    })
  })

  // Second test: existing getNote return
  it('should return the correct note object when the specified note exists in localStorage', async () => {
    console.log('Checking it should return the correct note object when the specified note exists in localStorage')
    // Set up the note in localStorage
    const note = {
      id: 'note1',
      title: 'Test Note',
      date: new Date().toISOString(), // Store as ISO string
      labels: ['label1', 'label2'],
      text: 'This is a test note',
      markdown: true
    }
    await page.evaluate((note) => {
      localStorage.setItem(note.id, JSON.stringify(note))
    }, note)

    // Call getNote and store in result
    const result = await page.evaluate((noteId) => {
      return window.getNote(noteId)
    }, note.id)

    // Expect the result to match the note
    expect(result).toEqual(note)
  })

  // Third test: Saving getNote
  it('should save the provided note object to localStorage', async () => {
    console.log('Checking it should save the provided note object to localStorage')
    // Define the note object
    const note = {
      id: 'note1',
      title: 'Test Note',
      date: new Date().toISOString(), // Store as ISO string
      labels: ['label1', 'label2'],
      text: 'This is a test note',
      markdown: true
    }

    // Call the function to save the note
    await page.evaluate((note) => {
      window.saveNote(note)
    }, note)

    // Retrieve the stored item from localStorage
    const storedNote = await page.evaluate((noteId) => {
      return JSON.parse(localStorage.getItem(noteId))
    }, note.id)

    // Expect the stored item to match the note object
    expect(storedNote).toEqual(note)
  })
})
