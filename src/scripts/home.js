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
    // Selects the search bar input
    this.searchInput = document.getElementById('search-bar');
    // Selects the journal header
    this.journalHeader = document.querySelector('.journal-header');
    // Selects the navigation bar
    this.navBar = document.querySelector('nav');
    // Select the main element of the html file where the notes will be displayed
    this.mainElement = document.querySelector('main');
    // A list of all of the notes
    this.notes = [];
    // A list of all of the folders
    this.folders = [];

    // Add event listener to open the modal on click of the new note button
    this.newNoteButton.addEventListener('click', this.openModal.bind(this));
    // Add event listener to create a new folder on click of the new folder button
    this.newFolderButton.addEventListener('click', this.createFolder.bind(this));
    // Add event listener to search the note and folder from the text input
    this.searchInput.addEventListener('input', this.searchNotes.bind(this));
  }

  createNote (title, body) {
    const note = {
      title,
      body,
      id: `note-${Date.now()}`, // unique id for the note
      folderId: null // initially not assigned to any folder
    };
    // Add note to the notes array
    this.notes.push(note);

    // Render the notes to the homepage
    this.renderNotes();
  }

  createFolder () {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      const folder = {
        name: folderName,
        id: `folder-${Date.now()}` // unique id for the folder
      };
      // Add folder to the folders array
      this.folders.push(folder);

      // Render the folders to the homepage
      this.renderFolders();
    };
  }

  renderNotes (filteredNotes = this.notes) { // filteredNotes to render a specific subset of notes  
    // Clear existing notes
    this.mainElement.innerHTML = '';

    // Loop through each folder and render its notes
    this.folders.forEach(folder => {
      const folderElement = document.createElement('div');
      folderElement.classList.add('folder');
      folderElement.setAttribute('data-folder-id', folder.id);
      folderElement.innerHTML = `<h3>${folder.name}</h3>`;
      folderElement.addEventListener('dragover', this.onDragOver.bind(this));
      folderElement.addEventListener('drop', this.onDrop.bind(this));
      this.mainElement.appendChild(folderElement);

      const notesInFolder = filteredNotes.filter(note => note.folderId === folder.id);
      notesInFolder.forEach(note => {
        this.appendNoteToFolder(note, folderElement);
      });
    });

    // Render notes not in any folder
    const unassignedNotes = filteredNotes.filter(note => note.folderId === null);
    unassignedNotes.forEach(note => {
      this.appendNoteToFolder(note, this.mainElement);
    });
  }

  renderFolders () {
    // Clear existing notes to re-render them with folders
    this.mainElement.innerHTML = '';
    this.renderNotes();
  }

  appendNoteToFolder (note, container) {
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
    noteElement.addEventListener('click', () => {
      this.editModal(this.notes.indexOf(note), note.title, note.body);
    });
    container.appendChild(noteElement);
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
                        <select id='note-folder' name='note-folder'>
                            <option value='' disabled selected>Select Folder</option>
                            ${this.folders.map(folder => `<option value='${folder.id}'>${folder.name}</option>`).join('')}
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
      const folderId = modal.querySelector('#note-folder').value;

      // Create a new note
      this.createNote(title, body);

      // Assign note to folder if selected
      if (folderId) {
        this.notes[this.notes.length - 1].folderId = folderId;
      }

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
      this.renderNotes();

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
      this.renderNotes();
    };
  }

  // Filter the exist note with title of the note
  searchNotes(event) {
    const searchQuery = event.target.value.toLowerCase(); // check the lower character
    const filteredNotes = this.notes.filter(note => note.title.toLowerCase().includes(searchQuery));
    // const filteredFolder = this.folders.filter(folder => folder.title.toLowerCase().includes(searchQuery));
    this.renderNotes(filteredNotes);
    // this.renderNotes(filteredFolder);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new HomeScript();
});