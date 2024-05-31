/**
 * Searches through the folder array in localStorage and returns
 * the folder with id as their id.
 * If nothing is found in localStorage for the folder, an empty array
 * is returned.
 * @param {string} id: The ID of the folder to get
 * @returns {Array<Object>} An array of folders found in localStorage
 * Data format: {
 *     id: string,
 *     name: string,
 *     parentFolderID: string
 * }
 */
function getFolderByID(id) {
    // Create empty string to store the folders with the folderID as their parentFolderID
    let folderWithID = null;
    // Get the folders from localStorage
    let folders = JSON.parse(localStorage.getItem('folders'));

    // If there are no folders in localStorage, return an empty array
    if(!folders) {
        return null;
    }

    // Otherwise, search through the folders array in localStorage
    // and add any folders with the folderID as their parentFolderID
    for(let i = 0; i < folders.length; i++) {
        if(folders[i].id === id) {
            folderWithID = folders[i];
        }
    }

    // Return the array of folders with the folderID as their parentFolderID
    return folderWithID;
  }

/**
 * Searches through the folder array in localStorage and returns
 * an array of folders that have the folderID as their parentFolderID.
 * If nothing is found in localStorage for the folder, an empty array
 * is returned.
 * @param {string} folderID: The ID of the folder to get the children of
 * @returns {Array<Object>} An array of folders found in localStorage
 * Data format: [{
 *     currFolderID: string,
 *     currFolderName: string,
 *     parentFolderID: string,
 *     parentFolderName: string,
 * }]
 */
function getFoldersByID(folderID) {
    // Create an array to store the folders with the folderID as their parentFolderID
    let foldersWithID = [];
    // Get the folders from localStorage
    let folders = JSON.parse(localStorage.getItem('folders'));

    // If there are no folders in localStorage, return an empty array
    if(!folders) {
        return [];
    }

    // Otherwise, search through the folders array in localStorage
    // and add any folders with the folderID as their parentFolderID
    for(let i = 0; i < folders.length; i++) {
        if(folders[i].parentFolderID === folderID) {
            foldersWithID.push(folders[i]);
        }
    }

    // Return the array of folders with the folderID as their parentFolderID
    return foldersWithID;
}

/**
 * Saves the folder to the folder array in localStorage
 * If the folder already exists in the folders array, it is updated
 * instead of added.
 * @param {Object} folder: The folder to save
 * Data format: [{
 *     id: string,
 *     name: string,
 *     parentFolderID: string,
 * }]
 */
function saveFolder(folder) {
    // Get the folders from localStorage
    let folders = JSON.parse(localStorage.getItem('folders'));
    // If there are no folders in localStorage, create a new array
    if(!folders) {
        folders = [];
    }

    // Check if the folder already exists in the folders array
    for(let i = 0; i < folders.length; i++) {
        if(folders[i].id === folder.id) {
            // If the folder already exists, update it in the folders array
            folders[i] = folder;
            // Save the updated folders array to localStorage
            localStorage.setItem('folders', JSON.stringify(folders));
            return;
        }
    }

    // If the folder does not already exist in the folders array,
    // add it to the folders array
    folders.push(folder);
    // Save the updated folders array to localStorage
    localStorage.setItem('folders', JSON.stringify(folders));
}

/**
 * Searches through the note array in localStorage and returns
 * an array of note that have the folderID as their folderID.
 * If nothing is found in localStorage for the folder, an empty array
 * is returned.
 * @param {string} folderID: The ID of the folder to get the notes of
 * @returns {Array<Object>} An array of notes found in localStorage
 * Data format: [{
 *    "id": "string", // This is a unique identifier for the note
 *    "folderID": "string", // The ID of the folder the note belongs to
 *    "title": "string",
 *    "label": "string",
 *    "text": "string",
 *    "markdown": "bool", // Whether the note is in markdown format or not
 * }]
 */
function getNotesByFolderID(folderID) {
    // Create an array to store the notes with the folderID as their folderID
    let notesWithID = [];
    // Get the notes from localStorage
    let notes = JSON.parse(localStorage.getItem('notes'));

    // If there are no notes in localStorage, return an empty array
    if(!notes) {
        return [];
    }

    // Otherwise, search through the notes array in localStorage
    // and add any notes with the folderID as their folderID
    for(let i = 0; i < notes.length; i++) {
        if(notes[i].folderID === folderID) {
            notesWithID.push(notes[i]);
        }
    }

    // Return the array of notes with the folderID as their folderID
    return notesWithID;
}

/**
 * Saves the note to the notes array in localStorage
 * If the note already exists in the notes array, it is updated
 * instead of added.
 * @param {Object} note: The note to save
 * Data format: [{
 *    "id": "string", // This is a unique identifier for the note
 *    "folderID": "string", // The ID of the folder the note belongs to
 *    "title": "string",
 *    "label": "string",
 *    "text": "string",
 *    "markdown": "bool", // Whether the note is in markdown format or not
 * }]
 */
function saveNote(note) {
    // Get the notes from localStorage
    let notes = JSON.parse(localStorage.getItem('notes'));
    // If there are no notes in localStorage, create a new array
    if(!notes) {
        notes = [];
    }

    // Check if the note already exists in the notes array
    for(let i = 0; i < notes.length; i++) {
        if(notes[i].id === note.id) {
            // If the note already exists, update it in the notes array
            notes[i] = note;
            // Save the updated notes array to localStorage
            localStorage.setItem('notes', JSON.stringify(notes));
            return;
        }
    }

    // If the note does not already exist in the notes array,
    // add it to the notes array
    notes.push(note);
    // Save the updated notes array to localStorage
    localStorage.setItem('notes', JSON.stringify(notes));
}

/**
 * Reads 'taskList' from localStorage and returns an array of
 * all of the tasks found (parsed, not in string form). If
 * nothing is found in localStorage for 'taskList', an empty array
 * is returned.
 * @returns {Array<data>} An array of tasks found in localStorage
 * Data format: {
 *    "tasks[]": "array[string]",
 * }
 */
function getTaskList() {
    // If there is no taskList in localStorage, return an empty array
    if(!localStorage.getItem('taskList')) {
        return [];
    }
    // Otherwise, return the taskList from localStorage
    return JSON.parse(localStorage.getItem('taskList'));
}

/**
 * Takes in an array of taskList and converts it to a string, and then
 * saves that string to 'taskList' in localStorage
 * @param {Array<data>} taskList: An array of tasks
 * Data format: {
 *    "tasks[]": "array[string]",
 * }
 */
function saveTaskList(taskList) {
    // Save the taskList to localStorage
    localStorage.setItem('taskList', JSON.stringify(taskList));
}