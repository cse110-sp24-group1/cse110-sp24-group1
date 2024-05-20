/*
* Reads 'mainFolder' from localStorage and returns the main folder
* found (parsed, not in string form). If nothing is found in localStorage
* for 'mainFolder', an empty MainFolder is returned.
* @returns {Object} The main folder found in localStorage
* Data format: {
*    "name": "string",
*    "folders": "array[string]",
*    "tasks": "array[string]",
* }
*/
function getMainFolder () {
  // If there is no mainFolder in localStorage, return an empty MainFolder
  if (!localStorage.getItem('mainFolder')) {
    return {
      name: 'Main',
      folders: [],
      tasks: []
    }
  }
  // Otherwise, return the mainFolder from localStorage
  return JSON.parse(localStorage.getItem('mainFolder'))
}

/*
* Takes in a mainFolder and converts it to a string, and then
* saves that string to 'mainFolder' in localStorage
* @param {Object} mainFolder: The main folder
* Data format: {
*    "name": "string",
*    "folders": "array[string]",
*    "tasks": "array[string]",
* }
*/
function saveMainFolder (mainFolder) {
  // Save the mainFolder to localStorage
  localStorage.setItem('mainFolder', JSON.stringify(mainFolder))
}

/*
* Reads a folder from localStorage and returns the folder found
* (parsed, not in string form). If nothing is found in localStorage
* for the folder, an empty folder is returned.
* @param {string} folder: The name of the folder to get
* @returns {Object} The folder found in localStorage
* Data format: {
*    "name": "string",
*    "folders": "array[string]",
*    "tasks": "array[string]",
* }
*/
function getFolder (folder) {
  // If there is no folder in localStorage, return an empty folder
  // Shouldn't occur as folder names are loaded from storage already
  // TODO: Discuss with frontend team if this, null, or an error should be returned
  if (!localStorage.getItem(folder)) {
    return {
      name: folder,
      folders: [],
      tasks: []
    }
  }
  // Otherwise, return the folder from localStorage
  return JSON.parse(localStorage.getItem(folder))
}

/*
* Takes in a folder and converts it to a string, and then
* saves that string to the folder in localStorage
* @param {Object} folder: The folder to save
* Data format: {
*    "name": "string",
*    "folders": "array[string]",
*    "tasks": "array[string]",
* }
*/
function saveFolder (folder) {
  // Save the folder to localStorage
  localStorage.setItem(folder.name, JSON.stringify(folder))
}

/*
* Reads 'taskList' from localStorage and returns an array of
* all of the tasks found (parsed, not in string form). If
* nothing is found in localStorage for 'taskList', an empty array
* is returned.
* @returns {Array<data>} An array of tasks found in localStorage
* Data format: {
*    "taskIDs[]": "array[string]",
* }
*/
function getTaskList () {
  // If there is no taskList in localStorage, return an empty array
  if (!localStorage.getItem('taskList')) {
    return []
  }
  // Otherwise, return the taskList from localStorage
  return JSON.parse(localStorage.getItem('taskList'))
}

/*
* Takes in an array of taskList and converts it to a string, and then
* saves that string to 'taskList' in localStorage
* @param {Array<data>} taskList: An array of tasks
* Data format: {
*    "taskIDs[]": "array[string]",
* }
*/
function saveTaskList (taskList) {
  // Save the taskList to localStorage
  localStorage.setItem('taskList', JSON.stringify(taskList))
}

/*
* Reads 'note' from localStorage and returns the note found
* (parsed, not in string form). If nothing is found in localStorage
* for the note, an empty note is returned.
* @param {string} note: The id of the note to get
* @returns {Object} The note found in localStorage
* Data format: {
*    "id": "string",
*    "title": "string",
*    "date": "Date",
*    "labels[]": "array[string]",
*    "text": "string",
*    "markdown": "bool",
* }
*/
function getNote (note) {
  // If there is no note in localStorage, return an empty note
  // Shouldn't occur as note IDs are loaded from storage already
  // TODO: Discuss with frontend team if this, null, or an error should be returned
  if (!localStorage.getItem(note)) {
    return {
      id: '',
      title: '',
      date: new Date(),
      labels: [],
      text: '',
      markdown: false
    }
  }
  // Otherwise, return the note from localStorage
  return JSON.parse(localStorage.getItem(note))
}

/*
* Takes in a note and converts it to a string, and then
* saves that string to 'note' in localStorage
* @param {Object} note: The note to save
* Data format: {
*    "id": "string",
*    "title": "string",
*    "date": "Date",
*    "labels[]": "array[string]",
*    "text": "string",
*    "markdown": "bool",
* }
*/
function saveNote (note) {
  // Save the note to localStorage
  localStorage.setItem(note.id, JSON.stringify(note))
}
