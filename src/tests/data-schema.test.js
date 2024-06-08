describe('Data Schema Tests for Notes, folders, and tasks as of now', () => {
  // First visit our website
  beforeAll(async () => {
    // When running link your own live server of test-until-pages.html then replace here and run "npm test -- data-schema.test.js"
    await page.goto('https://cse110-sp24-group1.github.io/cse110-sp24-group1/src/');
  });

  beforeEach(async () => {
    // Clear localStorage before each test
    await page.evaluate(() => localStorage.clear());
  });

   /**
   * Tests for getFoldersByID
   * 1. No folders in localStorage.
   * 2. Folders present in localStorage but none with the matching parentFolderID.
   * 3. Folders present in localStorage with some having the matching parentFolderID.
   * 4. Ensuring the data is consistent after a page reload.
   */

    // First test: empty folders return
    it('should return an empty array if no folders exist in localStorage', async () => {
      console.log('Checking it should return an empty array if no folders exist in localStorage');

      // Using this puppeteer so that you can use js in browser and returns a promise 
      const result = await page.evaluate(() => {
        return window.getFoldersByID('folder1');
      });

      // Expect the result to be an empty array
      expect(result).toEqual([]);
    });

    // Second test: return empty array when no folders match parentFolderID
    it('should return an empty array if no folders have the matching parentFolderID', async () => {
      console.log('Checking it should return an empty array if no folders have the matching parentFolderID');

      // Set up the folders in localStorage
      const folders = [
        {
          currFolderID: 'folder1',
          currFolderName: 'Folder 1',
          parentFolderID: 'parent2',
          parentFolderName: 'Parent Folder 2'
        },
        {
          currFolderID: 'folder2',
          currFolderName: 'Folder 2',
          parentFolderID: 'parent2',
          parentFolderName: 'Parent Folder 2'
        }
      ];
      await page.evaluate((folders) => {
        localStorage.setItem('folders', JSON.stringify(folders));
      }, folders);

      // Call getFoldersByID and store in result
      const result = await page.evaluate(() => {
        return window.getFoldersByID('parent1');
      });

      // Expect the result to be an empty array
      expect(result).toEqual([]);
    });

    // Third test: return folders with matching parentFolderID no page reload
    it('should return the correct folders with matching parentFolderID', async () => {
      console.log('Checking it should return the correct folders with matching parentFolderID after a page reload');

      // Set up the folders in localStorage
      const folders = [
        {
          currFolderID: 'folder1',
          currFolderName: 'Folder 1',
          parentFolderID: 'parent1',
          parentFolderName: 'Parent Folder 1'
        },
        {
          currFolderID: 'folder2',
          currFolderName: 'Folder 2',
          parentFolderID: 'parent1',
          parentFolderName: 'Parent Folder 1'
        },
        {
          currFolderID: 'folder3',
          currFolderName: 'Folder 3',
          parentFolderID: 'parent2',
          parentFolderName: 'Parent Folder 2'
        }
      ];

      await page.evaluate((folders) => {
        localStorage.setItem('folders', JSON.stringify(folders));
      }, folders);
      

      // Call getFoldersByID and store in result
      const result = await page.evaluate(() => {
        return window.getFoldersByID('parent1');
      });

      // Expect the result to match the folders with parentFolderID 'parent1'
      expect(result).toEqual([
        {
          currFolderID: 'folder1',
          currFolderName: 'Folder 1',
          parentFolderID: 'parent1',
          parentFolderName: 'Parent Folder 1'
        },
        {
          currFolderID: 'folder2',
          currFolderName: 'Folder 2',
          parentFolderID: 'parent1',
          parentFolderName: 'Parent Folder 1'
        }
      ]);
    });

    // Fourth test: Exact same as third but with a page reload 
    it('should return the correct folders with matching parentFolderID', async () => {
      console.log('Checking it should return the correct folders with matching parentFolderID');

      // Set up the folders in localStorage
      const folders = [
        {
          currFolderID: 'folder1',
          currFolderName: 'Folder 1',
          parentFolderID: 'parent1',
          parentFolderName: 'Parent Folder 1'
        },
        {
          currFolderID: 'folder2',
          currFolderName: 'Folder 2',
          parentFolderID: 'parent1',
          parentFolderName: 'Parent Folder 1'
        },
        {
          currFolderID: 'folder3',
          currFolderName: 'Folder 3',
          parentFolderID: 'parent2',
          parentFolderName: 'Parent Folder 2'
        }
      ];

      await page.evaluate((folders) => {
        localStorage.setItem('folders', JSON.stringify(folders));
      }, folders);
      
      // Reload the page
      await page.reload();

      // Call getFoldersByID and store in result
      const result = await page.evaluate(() => {
        return window.getFoldersByID('parent1');
      });

      // Expect the result to match the folders with parentFolderID 'parent1'
      expect(result).toEqual([
        {
          currFolderID: 'folder1',
          currFolderName: 'Folder 1',
          parentFolderID: 'parent1',
          parentFolderName: 'Parent Folder 1'
        },
        {
          currFolderID: 'folder2',
          currFolderName: 'Folder 2',
          parentFolderID: 'parent1',
          parentFolderName: 'Parent Folder 1'
        }
      ]);
    });

  /**
   * Tests for saveFolder
   * 1. Saving a new folder to localStorage.
   * 2. Updating an existing folder in localStorage.
   * 3. Ensuring that multiple folders are correctly saved and retrieved from localStorage.
   */
  
    // First test: saving a new folder
    it('should save a new folder to localStorage', async () => {
      console.log('Checking it should save a new folder to localStorage');

      const newFolder = {
        currFolderID: 'folder1',
        currFolderName: 'Folder 1',
        parentFolderID: 'parent1',
        parentFolderName: 'Parent Folder 1'
      };

      // Call saveFolder
      await page.evaluate((folder) => {
        window.saveFolder(folder);
      }, newFolder);

      // Retrieve the stored folders from localStorage
      const storedFolders = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('folders'));
      });

      // Expect the stored folders to contain the new folder
      expect(storedFolders).toEqual([newFolder]);
    });

    // Second test: updating an existing folder
    it('should update an existing folder in localStorage', async () => {
      console.log('Checking it should update an existing folder in localStorage');

      const initialFolder = {
        currFolderID: 'folder1',
        currFolderName: 'Folder 1',
        parentFolderID: 'parent1',
        parentFolderName: 'Parent Folder 1'
      };

      const updatedFolder = {
        currFolderID: 'folder1',
        currFolderName: 'Updated Folder 1',
        parentFolderID: 'parent1',
        parentFolderName: 'Parent Folder 1'
      };

      // Save the initial folder
      await page.evaluate((folder) => {
        window.saveFolder(folder);
      }, initialFolder);

      // Update the folder with the same currFolderID
      await page.evaluate((folder) => {
        window.saveFolder(folder);
      }, updatedFolder);

      // Retrieve the stored folders from localStorage
      const storedFolders = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('folders'));
      });

      // Expect the stored folders to contain the updated folder
      expect(storedFolders).toEqual([updatedFolder]);
    });

    // Third test: ensuring folders are correctly saved and retrieved
    it('should save and retrieve multiple folders correctly', async () => {
      console.log('Checking it should save and retrieve multiple folders correctly');
    
      const folder1 = {
        id: 'folder1',
        name: 'Folder 1',
        parentFolderID: 'parent1',
        parentFolderName: 'Parent Folder 1'
      };
    
      const folder2 = {
        id: 'folder2',
        name: 'Folder 2',
        parentFolderID: 'parent1',
        parentFolderName: 'Parent Folder 1'
      };
    
      // Save the first folder
      await page.evaluate((folder) => {
        window.saveFolder(folder);
      }, folder1);
    
      // Save the second folder
      await page.evaluate((folder) => {
        window.saveFolder(folder);
      }, folder2);
    
      // Retrieve the stored folders from localStorage
      const storedFolders = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('folders'));
      });
    
      // Expect the stored folders to contain both folders
      expect(storedFolders).toEqual(expect.arrayContaining([folder1, folder2]));
    });

   /**
   * Tests for getNotesByFolderID
   * 1. Empty array if no notes exist in localStorage.
   * 2. Notes matching folderID from localStorage.
   * 3. Notes matching folderID from localStorage after page reload. 
   */

    // First test: empty notes return
    it('should return an empty array if no notes exist in localStorage', async () => {
      console.log('Checking it should return an empty array if no notes exist in localStorage');

      // Call getNotesByFolderID and store in result
      const result = await page.evaluate(() => {
        return window.getNotesByFolderID('folder1');
      });

      // Expect the result to be an empty array
      expect(result).toEqual([]);
    });
    
    // Second test: return notes with matching folderID
    it('should return the correct notes with matching folderID', async () => {
      console.log('Checking it should return the correct notes with matching folderID');
      // Set up the notes in localStorage
      const notes = [
        {
          id: 'note1',
          folderID: 'folder1',
          title: 'Note 1',
          label: 'Label 1',
          text: 'This is note 1',
          markdown: false
        },
        {
          id: 'note2',
          folderID: 'folder1',
          title: 'Note 2',
          label: 'Label 2',
          text: 'This is note 2',
          markdown: true
        },
        {
          id: 'note3',
          folderID: 'folder2',
          title: 'Note 3',
          label: 'Label 3',
          text: 'This is note 3',
          markdown: false
        }
      ];
      await page.evaluate((notes) => {
        localStorage.setItem('notes', JSON.stringify(notes));
      }, notes);

      // Call getNotesByFolderID and store in result
      const result = await page.evaluate(() => {
        return window.getNotesByFolderID('folder1');
      });

      // Expect the result to match the notes with folderID 'folder1'
      expect(result).toEqual([
        {
          id: 'note1',
          folderID: 'folder1',
          title: 'Note 1',
          label: 'Label 1',
          text: 'This is note 1',
          markdown: false
        },
        {
          id: 'note2',
          folderID: 'folder1',
          title: 'Note 2',
          label: 'Label 2',
          text: 'This is note 2',
          markdown: true
        }
      ]);
    });

    // Third test:  Exact same as second but with a page reload 
    it('should return the correct notes with matching folderID after page reload', async () => {
      console.log('Checking it should return the correct notes with matching folderID after page reload');
      // Set up the notes in localStorage
      const notes = [
        {
          id: 'note1',
          folderID: 'folder1',
          title: 'Note 1',
          label: 'Label 1',
          text: 'This is note 1',
          markdown: false
        },
        {
          id: 'note2',
          folderID: 'folder1',
          title: 'Note 2',
          label: 'Label 2',
          text: 'This is note 2',
          markdown: true
        },
        {
          id: 'note3',
          folderID: 'folder2',
          title: 'Note 3',
          label: 'Label 3',
          text: 'This is note 3',
          markdown: false
        }
      ];
      await page.evaluate((notes) => {
        localStorage.setItem('notes', JSON.stringify(notes));
      }, notes);

      // Reload the page
      await page.reload();

      // Call getNotesByFolderID and store in result
      const result = await page.evaluate(() => {
        return window.getNotesByFolderID('folder1');
      });

      // Expect the result to match the notes with folderID 'folder1'
      expect(result).toEqual([
        {
          id: 'note1',
          folderID: 'folder1',
          title: 'Note 1',
          label: 'Label 1',
          text: 'This is note 1',
          markdown: false
        },
        {
          id: 'note2',
          folderID: 'folder1',
          title: 'Note 2',
          label: 'Label 2',
          text: 'This is note 2',
          markdown: true
        }
      ]);
    });

  /**
   * Tests for saveNote
   * 1. saveNote correctly saves a new note to localStorage
   * 2. saveNote correctly updates an existing note in localStorage
   * 3.saveNote correctly saves a new note without affecting existing notes in localStorage. 
   */

    // First test: save a new note
    it('should save a new note to localStorage', async () => {
      console.log('Checking it should save a new note to localStorage');

      const newNote = {
        id: 'note1',
        folderID: 'folder1',
        title: 'New Note',
        label: 'Label 1',
        text: 'This is a new note',
        markdown: false
      };

      // Save the new note
      await page.evaluate((note) => {
        window.saveNote(note);
      }, newNote);

      // Retrieve the stored notes from localStorage
      const storedNotes = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('notes'));
      });

      // Expect the stored notes to contain the new note
      expect(storedNotes).toEqual([newNote]);
    });

    // Second test: update an existing note
    it('should update an existing note in localStorage', async () => {
      console.log('Checking it should update an existing note in localStorage');

      const initialNote = {
        id: 'note1',
        folderID: 'folder1',
        title: 'Initial Note',
        label: 'Label 1',
        text: 'This is the initial note',
        markdown: false
      };

      const updatedNote = {
        id: 'note1',
        folderID: 'folder1',
        title: 'Updated Note',
        label: 'Label 1',
        text: 'This is the updated note',
        markdown: true
      };

      // Save the initial note
      await page.evaluate((note) => {
        window.saveNote(note);
      }, initialNote);

      // Update the note
      await page.evaluate((note) => {
        window.saveNote(note);
      }, updatedNote);

      // Retrieve the stored notes from localStorage
      const storedNotes = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('notes'));
      });

      // Expect the stored notes to contain the updated note
      expect(storedNotes).toEqual([updatedNote]);
    });
    
    // Third test: save a new note without affecting existing notes
    it('should save a new note without affecting existing notes in localStorage', async () => {
      console.log('Checking it should save a new note without affecting existing notes in localStorage');

      const existingNote = {
        id: 'note1',
        folderID: 'folder1',
        title: 'Existing Note',
        label: 'Label 1',
        text: 'This is an existing note',
        markdown: false
      };

      const newNote = {
        id: 'note2',
        folderID: 'folder2',
        title: 'New Note',
        label: 'Label 2',
        text: 'This is a new note',
        markdown: true
      };

      // Save the existing note
      await page.evaluate((note) => {
        window.saveNote(note);
      }, existingNote);

      // Save the new note
      await page.evaluate((note) => {
        window.saveNote(note);
      }, newNote);

      // Retrieve the stored notes from localStorage
      const storedNotes = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('notes'));
      });

      // Expect the stored notes to contain both the existing and new notes
      expect(storedNotes).toEqual([existingNote, newNote]);
    });

  /**
   * Tests for getTaskList
   * 1. returns an empty array when taskList is not present in localStorage
   * 2. returns the correct array from localStorage when taskList exists
   * 3. maintains the task list after a page reload
   */
    
    // First test: empty taskList return
    it('should return an empty array if no taskList exists in localStorage', async () => {
      console.log('Checking it should return an empty array if no taskList exists in localStorage');

      // Call getTaskList and store in result
      const result = await page.evaluate(() => {
        return window.getTaskList();
      });

      // Expect the result to be an empty array
      expect(result).toEqual([]);
    });
  
    // Second test: return taskList from localStorage
    it('should return the correct taskList from localStorage', async () => {
      console.log('Checking it should return the correct taskList from localStorage');
      // Set up the taskList in localStorage
      const taskList = ['task1', 'task2', 'task3'];
      await page.evaluate((taskList) => {
        localStorage.setItem('taskList', JSON.stringify(taskList));
      }, taskList);

      // Call getTaskList and store in result
      const result = await page.evaluate(() => {
        return window.getTaskList();
      });

      // Expect the result to match the taskList
      expect(result).toEqual(taskList);
    });

    // Third test: same as second test but with page reload 
    it('should maintain the taskList after a page reload', async () => {
      console.log('Checking it should maintain the taskList after a page reload');
      // Set up the taskList in localStorage
      const taskList = ['task1', 'task2', 'task3'];
      await page.evaluate((taskList) => {
        localStorage.setItem('taskList', JSON.stringify(taskList));
      }, taskList);

      // Reload the page
      await page.reload();

      // Call getTaskList and store in result
      const result = await page.evaluate(() => {
        return window.getTaskList();
      });

      // Expect the result to match the taskList
      expect(result).toEqual(taskList);
    });

    /**
     * Tests for saveTask
     * 1. Saves a new task to localStorage
     * 2. Updates an existing task in localStorage
     * 3. Adds a new task to the taskList array in localStorage when other tasks already exist
     */

    // First test: save a new task
    it('should save a new task to localStorage', async () => {
      console.log('Checking it should save a new task to localStorage');

      const newTask = {
        id: 'task1',
        name: 'New Task',
        description: 'Task Description',
        dueDate: '2024-05-20',
        label: 'Work',
        color: 'red'
      };

      // Save the new task
      await page.evaluate((task) => {
        window.saveTask(task);
      }, newTask);

      // Retrieve the stored taskList from localStorage
      const storedTaskList = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('taskList'));
      });

      // Expect the stored taskList to contain the new task
      expect(storedTaskList).toEqual([newTask]);
    });

    // Second test: update an existing task
    it('should update an existing task in localStorage', async () => {
      console.log('Checking it should update an existing task in localStorage');

      const initialTask = {
        id: 'task1',
        name: 'Initial Task',
        description: 'Initial Description',
        dueDate: '2024-05-20',
        label: 'Work',
        color: 'blue'
      };

      const updatedTask = {
        id: 'task1',
        name: 'Updated Task',
        description: 'Updated Description',
        dueDate: '2024-05-21',
        label: 'Personal',
        color: 'green'
      };

      // Save the initial task
      await page.evaluate((task) => {
        window.saveTask(task);
      }, initialTask);

      // Update the task
      await page.evaluate((task) => {
        window.saveTask(task);
      }, updatedTask);

      // Retrieve the stored taskList from localStorage
      const storedTaskList = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('taskList'));
      });

      // Expect the stored taskList to contain the updated task
      expect(storedTaskList).toEqual([updatedTask]);
    });

    // Third test: add a task when others exist
    it('should add a task to the taskList array in localStorage', async () => {
      console.log('Checking it should add a task to the taskList array in localStorage');

      const existingTask = {
        id: 'task1',
        name: 'Existing Task',
        description: 'Existing Description',
        dueDate: '2024-05-20',
        label: 'Work',
        color: 'blue'
      };

      const newTask = {
        id: 'task2',
        name: 'New Task',
        description: 'New Description',
        dueDate: '2024-05-21',
        label: 'Personal',
        color: 'green'
      };

      // Save the existing task
      await page.evaluate((task) => {
        window.saveTask(task);
      }, existingTask);

      // Add the new task
      await page.evaluate((task) => {
        window.saveTask(task);
      }, newTask);

      // Retrieve the stored taskList from localStorage
      const storedTaskList = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('taskList'));
      });

      // Expect the stored taskList to contain both tasks
      expect(storedTaskList).toEqual([existingTask, newTask]);
    });

    /**
     * Tests for deleteFolderByID
     * 1. Delete a folder when only one exits
     * 2. Delete when multiple exist
     * 3. Deletes child folders 
     * 4. Deletes all notes when inside a folder 
     */

    // Test: Delete a folder by ID when only one folder exists
    it('should delete a folder by ID when only one folder exists', async () => {
      console.log('Checking it should delete a folder by ID when only one folder exists');

      // Save a folder to localStorage
      const folder = { id: 'folder1', name: 'Folder 1', parentFolderID: 'parent1', parentFolderName: 'Parent Folder 1' };
      await page.evaluate((folder) => {
        window.saveFolder(folder);
      }, folder);

      // Delete the folder by ID
      await page.evaluate(() => {
        window.deleteFolderByID('folder1');
      });

      // Retrieve the stored folders from localStorage
      const storedFolders = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('folders'));
      });

      // Expect the stored folders to be an empty array
      expect(storedFolders).toEqual([]);
    });

    // Test: Delete a folder by ID when multiple folders exist
    it('should delete a folder by ID when multiple folders exist', async () => {
      console.log('Checking it should delete a folder by ID when multiple folders exist');

      // Save multiple folders to localStorage
      const folders = [
        { id: 'folder1', name: 'Folder 1', parentFolderID: 'parent1', parentFolderName: 'Parent Folder 1' },
        { id: 'folder2', name: 'Folder 2', parentFolderID: 'parent1', parentFolderName: 'Parent Folder 1' }
      ];
      await page.evaluate((folders) => {
        folders.forEach(folder => window.saveFolder(folder));
      }, folders);

      // Delete one folder by ID
      await page.evaluate(() => {
        window.deleteFolderByID('folder1');
      });

      // Retrieve the stored folders from localStorage
      const storedFolders = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('folders'));
      });

      // Expect the stored folders to contain only the second folder
      expect(storedFolders).toEqual([
        { id: 'folder2', name: 'Folder 2', parentFolderID: 'parent1', parentFolderName: 'Parent Folder 1' }
      ]);
    });

    // Test: Recursively delete all child folders
    it('should recursively delete all child folders', async () => {
      console.log('Checking it should recursively delete all child folders');

      // Save a parent folder and its child folder to localStorage
      const folders = [
        { id: 'folder1', name: 'Folder 1', parentFolderID: 'parent1', parentFolderName: 'Parent Folder 1' },
        { id: 'folder2', name: 'Folder 2', parentFolderID: 'folder1', parentFolderName: 'Folder 1' }
      ];
      await page.evaluate((folders) => {
        folders.forEach(folder => window.saveFolder(folder));
      }, folders);

      // Delete the parent folder by ID
      await page.evaluate(() => {
        window.deleteFolderByID('folder1');
      });

      // Retrieve the stored folders from localStorage
      const storedFolders = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('folders'));
      });

      // Expect the stored folders to be an empty array
      expect(storedFolders).toEqual([]);
    });

    // Test: Delete associated notes when deleting a folder
    it('should delete associated notes when deleting a folder', async () => {
      console.log('Checking it should delete associated notes when deleting a folder');

      // Save a folder and its associated note to localStorage
      const folder = { id: 'folder1', name: 'Folder 1', parentFolderID: 'parent1', parentFolderName: 'Parent Folder 1' };
      const note = { id: 'note1', folderID: 'folder1', title: 'Note 1', label: 'Label 1', text: 'This is note 1', markdown: false };
      await page.evaluate((folder, note) => {
        window.saveFolder(folder);
        window.saveNote(note);
      }, folder, note);

      // Delete the folder by ID
      await page.evaluate(() => {
        window.deleteFolderByID('folder1');
      });

      // Retrieve the stored notes from localStorage
      const storedNotes = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('notes'));
      });

      // Expect the stored notes to be an empty array
      expect(storedNotes).toEqual([]);
    });

    /**
     * Tests for deleteNoteByID
     * 1. Delete a note when only one exists
     * 2. Delete a note when multiple notes exist
     */

    // Test: Delete a note by ID when only one note exists
    it('should delete a note by ID when only one note exists', async () => {
      console.log('Checking it should delete a note by ID when only one note exists');

      // Save a note to localStorage
      const note = { id: 'note1', folderID: 'folder1', title: 'Note 1', label: 'Label 1', text: 'This is note 1', markdown: false };
      await page.evaluate((note) => {
        window.saveNote(note);
      }, note);

      // Delete the note by ID
      await page.evaluate(() => {
        window.deleteNoteByID('note1');
      });

      // Retrieve the stored notes from localStorage
      const storedNotes = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('notes'));
      });

      // Expect the stored notes to be an empty array
      expect(storedNotes).toEqual([]);
    });

    // Test: Delete a note by ID when multiple notes exist
    it('should delete a note by ID when multiple notes exist', async () => {
      console.log('Checking it should delete a note by ID when multiple notes exist');

      // Save multiple notes to localStorage
      const notes = [
        { id: 'note1', folderID: 'folder1', title: 'Note 1', label: 'Label 1', text: 'This is note 1', markdown: false },
        { id: 'note2', folderID: 'folder1', title: 'Note 2', label: 'Label 2', text: 'This is note 2', markdown: true }
      ];
      await page.evaluate((notes) => {
        notes.forEach(note => window.saveNote(note));
      }, notes);

      // Delete one note by ID
      await page.evaluate(() => {
        window.deleteNoteByID('note1');
      });

      // Retrieve the stored notes from localStorage
      const storedNotes = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('notes'));
      });

      // Expect the stored notes to contain only the second note
      expect(storedNotes).toEqual([
        { id: 'note2', folderID: 'folder1', title: 'Note 2', label: 'Label 2', text: 'This is note 2', markdown: true }
      ]);
    });

    /**
     * Tests for deleteNotesByFolderID
     * 1. Delete all notes within a folder
     */

    // Test: Delete all notes associated with a specific folder ID
    it('should delete all notes associated with a specific folder ID', async () => {
      console.log('Checking it should delete all notes associated with a specific folder ID');

      // Save multiple notes to localStorage
      const notes = [
        { id: 'note1', folderID: 'folder1', title: 'Note 1', label: 'Label 1', text: 'This is note 1', markdown: false },
        { id: 'note2', folderID: 'folder1', title: 'Note 2', label: 'Label 2', text: 'This is note 2', markdown: true },
        { id: 'note3', folderID: 'folder2', title: 'Note 3', label: 'Label 3', text: 'This is note 3', markdown: false }
      ];
      await page.evaluate((notes) => {
        notes.forEach(note => window.saveNote(note));
      }, notes);

      // Delete all notes associated with a specific folder ID
      await page.evaluate(() => {
        window.deleteNotesByFolderID('folder1');
      });

      // Retrieve the stored notes from localStorage
      const storedNotes = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('notes'));
      });

      // Expect the stored notes to contain only the notes not associated with the deleted folder ID
      expect(storedNotes).toEqual([
        { id: 'note3', folderID: 'folder2', title: 'Note 3', label: 'Label 3', text: 'This is note 3', markdown: false }
      ]);
    });

    /**
     * Tests for deleteTask
     * 1. Delete a task by ID when only one task exists
     * 2. Delete a task by ID when multiple tasks exist
     */

    // Test: Delete a task by ID when only one task exists
    it('should delete a task by ID when only one task exists', async () => {
      console.log('Checking it should delete a task by ID when only one task exists');

      // Save a task to localStorage
      const task = { id: 'task1', name: 'Task 1', description: 'Task Description', dueDate: '2024-05-20', label: 'Work', color: 'red' };
      await page.evaluate((task) => {
        window.saveTask(task);
      }, task);

      // Delete the task by ID
      await page.evaluate(() => {
        window.deleteTask('task1');
      });

      // Retrieve the stored taskList from localStorage
      const storedTaskList = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('taskList'));
      });

      // Expect the stored taskList to be an empty array
      expect(storedTaskList).toEqual([]);
    });

    // Test: Delete a task by ID when multiple tasks exist
    it('should delete a task by ID when multiple tasks exist', async () => {
      console.log('Checking it should delete a task by ID when multiple tasks exist');

      // Save multiple tasks to localStorage
      const tasks = [
        { id: 'task1', name: 'Task 1', description: 'Task Description', dueDate: '2024-05-20', label: 'Work', color: 'red' },
        { id: 'task2', name: 'Task 2', description: 'Task 2 Description', dueDate: '2024-05-21', label: 'Personal', color: 'blue' }
      ];
      await page.evaluate((tasks) => {
        tasks.forEach(task => window.saveTask(task));
      }, tasks);

      // Delete one task by ID
      await page.evaluate(() => {
        window.deleteTask('task1');
      });

      // Retrieve the stored taskList from localStorage
      const storedTaskList = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('taskList'));
      });

      // Expect the stored taskList to contain only the second task
      expect(storedTaskList).toEqual([
        { id: 'task2', name: 'Task 2', description: 'Task 2 Description', dueDate: '2024-05-21', label: 'Personal', color: 'blue' }
      ]);
    });
});