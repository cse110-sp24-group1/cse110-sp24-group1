// Main page folder 
const MAIN_ID = '0';

class HomeScript {
  constructor () {
    // Selects the new note button
    this.newNoteButton = document.getElementById('new-note-button');
    // Selects the new folder button
    this.newFolderButton = document.getElementById('new-folder-button');
    // Selects the top right buttons: new note and new folder
    this.topRightButtons = document.querySelector('.top-right-buttons');
    // Selects the search bar
    this.searchBar = document.querySelector('.search-container');
    // Selects the previous folder button
    this.folderBackButton = document.getElementById('folder-back-button');
    // Selects the journal header
    this.journalHeader = document.querySelector('.journal-header');
    // Selects the navigation bar
    this.navBar = document.querySelector('nav');
    // Select the main element of the html file where the notes will be displayed
    this.mainElement = document.querySelector('main');
    // A list of all of the notes in main home
    this.notes = getNotesByFolderID(MAIN_ID); 
    // A list of all of the folders in main home
    this.folders = getFoldersByID(MAIN_ID);
    // A const representing the current folder
    this.currentFolderID = MAIN_ID;
    // A const representing the parent folder
    this.parentFolderID = null;

    // Add event listener to open the modal on click of the new note button
    this.newNoteButton.addEventListener('click', this.openModal.bind(this));
    // Add event listener to create a new folder on click of the new folder button
    this.newFolderButton.addEventListener('click', this.createFolder.bind(this));
    // Add event listener to return to parent folder on click of back button
    this.folderBackButton.addEventListener('click', () => {this.visitFolder(this.parentFolderID);});
    
    // Within main folder hide back button, otherwise show it
    if(this.currentFolderID === MAIN_ID) {
      this.folderBackButton.classList.add('hide-notes');
    }
    else {
      this.folderBackButton.classList.remove('hide-notes');
    }
    
    // Render everything on main page
    this.render();
  }

  createNote (title, body) {
    const note = {
      title,
      body,
      id: `note-${Date.now()}`, // unique id for the note
      folderID: this.currentFolderID, // assign to current folder
      label: null // initially add no label
    };
    // Add note to the notes array
    this.notes.push(note);

    // Render the notes to the homepage
    this.render();
  }

  createFolder () {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      const folder = {
        name: folderName,
        id: `folder-${Date.now()}`, // unique id for the folder
        parentFolderID: this.currentFolderID
      };
      // Add folder to the folders array
      this.folders.push(folder);

      saveFolder(folder);

      // Render the folders to the homepage
      this.render();
    };
  }

  render () {
    console.log(this.currentFolderID + ' ' + this.parentFolderID);
    // Clear main element
    this.mainElement.innerHTML = '';

    // Render all folders in current folder
    this.folders.forEach(folder => {
      const folderElement = document.createElement('div');
      folderElement.classList.add('folder');
      folderElement.setAttribute('data-folder-id', folder.id);
      folderElement.innerHTML = `<h3>${folder.name}</h3>`;
      folderElement.addEventListener('dragover', this.onDragOver.bind(this));
      folderElement.addEventListener('drop', this.onDrop.bind(this));

      // Click to open folder
      folderElement.addEventListener('click', () => {
        this.visitFolder(folder.id);
      });

      this.mainElement.appendChild(folderElement);
    });

    // Render all notes in current folder
    this.notes.forEach(note => {
      const noteElement = document.createElement('div');
      noteElement.classList.add('note');
      noteElement.setAttribute('draggable', 'true');
      noteElement.setAttribute('data-note-id', note.id);
      noteElement.innerHTML = `
        <div class='note-content'>
            <p>${note.body}</p>
        </div>
        <div class='note-title'>
            <h3>${note.title}</h3>
        </div>`;
      noteElement.addEventListener('dragstart', this.onDragStart.bind(this));

      // Click to open edit modal
      noteElement.addEventListener('click', () => {
        this.editModal(this.notes.indexOf(note), note.title, note.body);
      });
      this.mainElement.appendChild(noteElement);
    });
  }

  openModal () {
    // Add blur class to navigation bar
    this.navBar.classList.add('blur');
    // Remove the display of notes with the open modal
    this.mainElement.classList.add('hide-notes');
    // Remove the display of search bar with the open modal
    this.searchBar.style.display = 'none';
    // Remove the display of journal header with the open modal
    this.journalHeader.classList.add('hide-notes');
    // Create modal element for 'div' of home html
    const modal = document.createElement('div');
    // Modal class for css design
    modal.classList.add('modal');
    // Modal content
    modal.innerHTML = `
            <div class='note-modal'>
                <span class='close-modal'>&times;</span>
                <div class='modal-title'>
                    <h2>New Note</h2>
                </div>
                <form id='modal-form'>
                    <div class='modal-input'>
                        <input type='text' id='note-title' name='note-title' placeholder='Page Title'>
                    </div>
                    <div class='modal-input'>
                        <select id='note-label' name='note-label'>
                            <option value='' disabled selected>Select Label</option>
                            <!-- Need to add labels -->
                        </select>
                    </div>
                    <div class='modal-input'>
                      <div class='textarea-container'>
                        <textarea id='note-body' name='note-body'></textarea>
                        <div class='modal-buttons'>
                          <button type='button' class='input-button' name='input-Text'>Textt</button>
                          <button type='button' class='input-button' name='input-Image'>Image</button>
                          <button type='button' class='input-button' name='input-Markdown'>MDown</button>
                      </div>
                    </div>
                    <button class='create-button' type='submit'>Create</button>
                </form>
            </div>
        `;
    // Append modal to main body
    document.body.appendChild(modal);
    // Hide the top right buttons
    this.topRightButtons.style.display = 'none';

    // Close modal when clicking the close button
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
      document.body.removeChild(modal);
      // Show the top right buttons again
      this.topRightButtons.style.display = 'flex';
      // Show the search bar again
      this.searchBar.style.display = 'flex';
      // Remove the blur class from the navigation bar
      this.navBar.classList.remove('blur');
      // Unhide the notes from display
      this.mainElement.classList.remove('hide-notes');
      // Unhide the search bar from display
      this.journalHeader.classList.remove('hide-notes');
    });

    // Close modal when clicking the create new note button
    const createButton = modal.querySelector('.create-button');
    createButton.addEventListener('click', (event) => {
      // Prevent default form submission
      event.preventDefault();
      // Take the values inputted from the modal form
      const title = modal.querySelector('#note-title').value;
      const body = modal.querySelector('#note-body').value;
      const labelId = modal.querySelector('#note-label').value;

      // Create a new note
      this.createNote(title, body);

      // Assign note to label if selected
      if (labelId) {
        this.notes[this.notes.length - 1].labelId = labelId;
      }

      //save to local storage
      saveNote(this.notes[this.notes.length - 1]);

      document.body.removeChild(modal);
      // Show the top right buttons again
      this.topRightButtons.style.display = 'flex';
      // Remove the blur class from the navigation bar
      this.navBar.classList.remove('blur');
      // Unhide the notes from display
      this.mainElement.classList.remove('hide-notes');
      // Unhide the search bar from display
      this.searchBar.style.display = 'flex';
      // Unhide the journal header from display
      this.journalHeader.classList.remove('hide-notes');
    });
  }

  // Opens the modal to the existing note
  editModal (index, title, body) {
    // Add blur class to navigation bar
    this.navBar.classList.add('blur');
    // Remove the display of notes with the open modal
    this.mainElement.classList.add('hide-notes');
    // Remove the display of search bar with the open modal
    this.searchBar.style.display = 'none';
    // Remove the display of journal header with the open modal
    this.journalHeader.classList.add('hide-notes');
    // Create modal element for 'div' of home html
    const modal = document.createElement('div');
    // Modal class for css design
    modal.classList.add('modal');

    // Modal content
    modal.innerHTML = `
            <div class='note-modal'>
                <div class='edit-modal-title'>
                    <h2 contenteditable='true'>${title}</h2>
                </div>
                <form id='note-modal-form'>
                    <button class='back-button' type='submit'>Back</button>
                    <div>
                        <textarea id='edit-note-body' name='note-body'>${body}</textarea>
                        <div class='exist-modal-buttons'>
                          <button type='button' class='exist-input-button' name='exist-input-Text'>Textt</button>
                          <button type='button' class='exist-input-button' name='exist-input-Image'>Image</button>
                          <button type='button' class='exist-input-button' name='exist-input-Markdown'>MDown</button>
                        </div>
                    </div>
                    <button class='save-button' type='submit'>Save</button>
                </form>
            </div>
        `;
    // Append modal to main body
    document.body.appendChild(modal);
    // Hide the top right buttons
    this.topRightButtons.style.display = 'none';

    // Close modal when clicking the back button
    const backButton = modal.querySelector('.back-button');
    backButton.addEventListener('click', () => {
      document.body.removeChild(modal);
      // Show the top right buttons again
      this.topRightButtons.style.display = 'flex';
      // Remove the blur class from the navigation bar
      this.navBar.classList.remove('blur');
      // Unhide the notes from display
      this.mainElement.classList.remove('hide-notes');
      // Unhide the search bar from display
      this.searchBar.style.display = 'flex';
      // Unhide the journal header from display
      this.journalHeader.classList.remove('hide-notes');
    });

    // Close modal when clicking save, also update the note accordingly
    const saveButton = modal.querySelector('.save-button');
    saveButton.addEventListener('click', (event) => {
      // Prevent default form submission
      event.preventDefault();
      // Take the values inputted from the modal form
      const newTitle = modal.querySelector('.edit-modal-title h2').innerText;
      const newBody = modal.querySelector('.edit-note-body').value;

      // Edit the note with updated title and body
      this.notes[index].title = newTitle;
      this.notes[index].body = newBody;
      this.render();

      document.body.removeChild(modal);
      // Show the top right buttons again
      this.topRightButtons.style.display = 'flex';
      // Remove the blur class from the navigation bar
      this.navBar.classList.remove('blur');
      // Unhide the notes from display
      this.mainElement.classList.remove('hide-notes');
      // Unhide the search bar from display
      this.searchBar.style.display = 'flex';
      // Unhide the journal header from display
      this.journalHeader.classList.remove('hide-notes');
    });
  }

  onDragStart (event) {
    event.dataTransfer.setData('text/plain', event.target.getAttribute('data-note-id'));
  }

  onDragOver (event) {
    event.preventDefault();
  }

  onDrop (event) {
    event.preventDefault();
    const noteId = event.dataTransfer.getData('text/plain');
    const folderId = event.target.closest('.folder').getAttribute('data-folder-id');

    const note = this.notes.find(note => note.id === noteId);
    if (note) {
      note.folderId = folderId;
      this.render();
    };
  }
  
  //backend method, temporarily in frontend for testing
  getFolderByID(id) {
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

  visitFolder(newFolderId) {
    //calling temp method
    let newFolder = this.getFolderByID(newFolderId);

    // if folder not found, must be main
    if(!newFolder) {
      this.currentFolderID = MAIN_ID;
      this.parentFolderID = null;
      console.log('hi');
    }
    else {
      this.currentFolderID = newFolderId;
      this.parentFolderID = newFolder.parentFolderID;
    }

    // Set folders / notes list
    this.folders = getFoldersByID(this.currentFolderID);
    this.notes = getNotesByFolderID(this.currentFolderID);

    // If within main folder hide back button, otherwise show it
    if(this.currentFolderID === MAIN_ID) {
      this.folderBackButton.classList.add('hide-notes');
      this.journalHeader.innerText = 'My Journal';
    }
    else {
      this.folderBackButton.classList.remove('hide-notes');
      this.journalHeader.innerText = 'My Journal (' + newFolder.name + ')';
    }

    //render folders / notes
    this.render();
  }



}

document.addEventListener('DOMContentLoaded', () => {
  new HomeScript();
});