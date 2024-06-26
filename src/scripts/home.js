/**
 * Main page folder ID.
 * @constant {string}
 */
const MAIN_ID = '0';

/**
 * Class representing the HomeScript for managing notes and folders.
 */
class HomeScript {
  /**
   * Create a HomeScript instance.
   */
  constructor() {
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
    this.newNoteButton.addEventListener('click', this.openCreateNoteModal.bind(this));
    this.newFolderButton.addEventListener('click', this.openCreateFolderModal.bind(this));
    // Add event listener to search the note and folder from the text input
    this.searchInput.addEventListener('input', this.searchNotesFolders.bind(this));
    // Add event listener to return to parent folder on click of back button
    this.folderBackButton.addEventListener('click', () => { this.visitFolder(this.parentFolderID); });

    // Within main folder hide back button, otherwise show it
    if (this.currentFolderID === MAIN_ID) {
      this.folderBackButton.classList.add('hide-notes');
    }
    else {
      this.folderBackButton.classList.remove('hide-notes');
    }

    // Render everything on main page
    this.render();
  }

  /**
   * Create a new note.
   * @param {string} title - The title of the note.
   * @param {string} body - The body content of the note.
   * @param {string} labelId - The label ID of the note.
   */
  createNote(title, body, labelId) {
    const defaultNoteTitle = 'New Note'; // Default note title

    if (!title) {
      title = defaultNoteTitle; // Assign default title if title is empty
    }

    const note = {
      title,
      body,
      id: `note-${Date.now()}`, // unique id for the note
      folderID: this.currentFolderID, // assign to current folder
      label: labelId
    };
    // Add note to the notes array
    this.notes.push(note);

    // Save to local storage
    saveNote(note);

    // Render the notes to the homepage
    this.render();
  }

  /**
   * Create a new folder.
   * @param {string} folderName - The name of the folder.
   */
  createFolder(folderName) {
    const defaultFolderName = 'New Folder'; // Default folder name

    if (folderName.length !== 0) {
      const folder = {
        name: folderName,
        id: `folder-${Date.now()}`, // unique id for the folder
        parentFolderID: this.currentFolderID
      };

      // Add folder to the folders array
      this.folders.push(folder);

      // Save to local storage
      saveFolder(folder);

      // Render the folders to the homepage
      this.render();
    }
    else {
      const folder = {
        name: defaultFolderName,
        id: `folder-${Date.now()}`, // unique id for the folder
        parentFolderID: this.currentFolderID
      };

      // Add folder to the folders array
      this.folders.push(folder);

      // Save to local storage
      saveFolder(folder);

      // Render the folders to the homepage
      this.render();
    };
  }

  /**
   * Render notes and folders to the homepage.
   */
  render() {
    // Clear main element
    this.mainElement.innerHTML = "";

    //Render PNG on empty folders and notes
    if (this.notes.length === 0 && this.folders.length === 0) {
      const box = document.createElement('div');
      box.classList.add('center-image');
      box.style.pointerEvents = 'none';
      this.mainElement.appendChild(box);

      const imgElement = document.createElement('div');
      imgElement.classList.add('bkg-image');
      box.appendChild(imgElement);

      return;
    }

    // Render all notes in current folder
    this.notes.forEach(note => {
      const noteElement = document.createElement('div');
      noteElement.classList.add('note');
      noteElement.setAttribute('data-note-id', note.id);
      noteElement.setAttribute('title', this.getLabelText(note.label)); // Set title attribute for tooltip
      noteElement.setAttribute('tabindex', '0'); // Make the note focusable
      noteElement.innerHTML = `
          <div class='note-content' id=${note.label}>
              <span class='delete'>&times;</span>
              <p>${note.body}</p>
          </div>
          <div class='note-title'>
              <h3>${note.title}</h3>
          </div>`;

      // Click the x button to delete the note
      noteElement.querySelector('.delete').addEventListener('click', (event) => {
        event.stopPropagation();
        this.openConfirmationDeleteModal(note.id, 'note');
      });

      // Click to open edit modal
      noteElement.addEventListener('click', () => {
        this.openEditNoteModal(this.notes.indexOf(note), note.title, note.body, note.label);
      });

      // Handle Enter key press for opening the edit modal
      noteElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          this.openEditNoteModal(this.notes.indexOf(note), note.title, note.body, note.label);
        }
      });

      this.mainElement.prepend(noteElement);
    });

    // Render all folders in current folder
    this.folders.forEach(folder => {
      const folderElement = document.createElement('div');
      folderElement.classList.add('folder');
      folderElement.setAttribute('data-folder-id', folder.id);
      folderElement.setAttribute('tabindex', '0'); 
      folderElement.innerHTML = `
        <div class='folder-content' id=${folder.label}>
          <span class='delete-folder'>&times;</span>
        </div>
        <div class='folder-title'>
          <h3>${folder.name}</h3>
        </div>`;

      // Click the x button to delete the folder
      folderElement.querySelector('.delete-folder').addEventListener('click', (event) => {
        event.stopPropagation();
        this.openConfirmationDeleteModal(folder.id, 'folder');
      });

      // Click to open folder
      folderElement.addEventListener('click', () => {
        this.visitFolder(folder.id);
      });

      // Handle Enter key press for opening the folder
      folderElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          this.visitFolder(folder.id);
        }
      });

      this.mainElement.prepend(folderElement);
    });
  };

  /**
   * Get label text based on label ID.
   * @param {string} labelId - The label ID.
   * @returns {string} - The label text.
   */
  getLabelText(labelId) {
    const labelMap = {
      'code-snippets': 'Code Snippets',
      'stand-up': 'Stand-Up Notes',
      'bug-reports': 'Bug Reports',
      'learning-notes': 'Learning Notes',
      'newsletter': 'Newsletters',
      'performance': 'Performance Metrics',
      'feature-ideas': 'Feature Ideas'
    };
    return labelMap[labelId] || 'Note';
  }

  /**
   * Open the modal to reassure with the user that they want to delete this note.
   */
  openConfirmationDeleteModal(Id, type) {
    const modal = document.createElement('div');
    // Modal class for css design
    modal.classList.add('modal');
    // Append modal to main body
    document.body.appendChild(modal);

    // Modal content
    modal.innerHTML = `
            <div class='confirmation-modal'>
                <div class='modal-title'>
                    <h3>Are you sure you want to delete this ${type}?</h3>
                </div>
                <div class='confirmation-buttons'> 
                    <button class='no-button' type='submit'>NOPE</button>
                    <button class='yes-button' type='submit'>YES</button>
                </div>
            </div>
        `;

    // Close modal when clicking the close button or saying no
    const noButton = modal.querySelector('.no-button');
    noButton.addEventListener('click', () => {
      this.closeModal(modal);
    });

    // Deletes note when yes is selected
    const yesButton = modal.querySelector('.yes-button');
    yesButton.addEventListener('click', (event) => {
      // Prevent default form submission
      event.preventDefault();
      if (type === 'folder') {
        deleteFolderByID(Id);
      }
      if (type === 'note') {
        deleteNoteByID(Id);
      }
      this.closeModal(modal);
      location.reload();
    });
  }

  /**
   * Get all child folders of a given folder.
   * @param {string} parentFolderID - The ID of the parent folder.
   * @returns {Array} - An array of child folders.
   */
  getChildFolders(parentFolderID) {
    let childFolders = this.folders.filter(folder => folder.parentFolderID === parentFolderID);
    childFolders.forEach(childFolder => {
      childFolders = childFolders.concat(this.getChildFolders(childFolder.id));
    });
    return childFolders;
  }

  /**
   * Get all child notes of a given folder.
   * @param {string} folderID - The ID of the folder.
   * @returns {Array} - An array of child notes.
   */
  getChildNotes(folderID) {
    return this.notes.filter(note => note.folderID === folderID);
  }

  /**
   * Open the modal to create a new note.
   */
  openCreateNoteModal() {
    const modal = this.openModal();
    // Modal content
    modal.innerHTML = `
            <div class='note-modal'>
                <button class=obj-container>
                  <span class='close-modal' title='Close'>&times;</span>
                </button>
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
                            <option value='code-snippets'>Code Snippets</option>
                            <option value='stand-up'>Stand-Up Notes</option>
                            <option value='bug-reports'>Bug Reports</option>
                            <option value='learning-notes'>Learning Notes</option>
                            <option value='newsletter'>Newsletters</option>
                            <option value='performance'>Performance Metrics</option>
                            <option value='feature-ideas'>Feature Ideas</option>
                        </select>
                    </div>
                    <div class='modal-input'>
                        <textarea id='note-body' name='note-body'></textarea>
                    </div>
                    <div class='new-note-foot'> 
                        <button class='create-button' type='submit' title='Create'>Create</button>
                    </div>
                </form>
            </div>
        `;

    enableModalTabTrap(modal, true);

    // Initialize SimpleMDE
    const simplemde = new SimpleMDE({
      element: document.getElementById("note-body"),
      forceSync: true,
      hideIcons: ['quote'],
      renderingConfig: {
        codeSyntaxHighlighting: true
      },
      spellChecker: false,
      toolbar: [
        'bold', 'italic', 'strikethrough', 'code', 'unordered-list', 'ordered-list', 'link', {
          name: "image",
          action: function customImageHandler(editor) {
            const cm = editor.codemirror;
            const doc = cm.getDoc();
            const cursor = doc.getCursor();
            doc.replaceRange(`![](https://)`, cursor);
          },
          className: "fa fa-picture-o",
          title: "Insert Image",
        }, '|', 'preview', 'side-by-side', 'fullscreen', '|', 'guide'
      ],
      shortcuts: {
        'toggleBold': 'Cmd-B',
        'toggleItalic': 'Cmd-I',
        'drawLink': 'Cmd-K',
        'togglePreview': 'Cmd-P',
        'toggleUnorderedList': 'Cmd-L',
        'toggleCodeBlock': 'Cmd-Alt-C',
        'drawImage': 'Cmd-Alt-I',
        'toggleOrderedList': 'Cmd-Alt-L',
        'toggleHeadingBigger': 'Shift-Cmd-H',
        'toggleHeadingSmaller': 'Cmd-H',
        'toggleSideBySide': 'F9',
        'toggleFullScreen': 'F11'
      }
    });

    // Override tab behavior to move focus out of SimpleMDE
    simplemde.codemirror.options.extraKeys.Tab = false;
    simplemde.codemirror.on('keydown', (cm, event) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        const formElements = Array.from(modal.querySelectorAll('input, textarea, button, select, [contenteditable="true"]'));
        const currentIndex = formElements.indexOf(document.activeElement);
        if (event.shiftKey) {
          const prevIndex = (currentIndex - 1 + formElements.length) % formElements.length;
          formElements[prevIndex].focus();
        } else {
          const nextIndex = (currentIndex + 1) % formElements.length;
          formElements[nextIndex].focus();
        }
      }
    });

    // Close modal when clicking the close button
    const closeButton = modal.querySelector('.obj-container:has(.close-modal)');
    closeButton.addEventListener('click', () => {
      this.closeModal(modal);
    });

    // Create modal when clicking the create new note button
    const createButton = modal.querySelector('.create-button');
    createButton.addEventListener('click', (event) => {
      // Prevent default form submission
      event.preventDefault();
      // Take the values inputted from the modal form
      let title = modal.querySelector('#note-title').value;
      const body = modal.querySelector('#note-body').value;
      const labelId = modal.querySelector('#note-label').value;

      // Create a new note
      this.createNote(title, body, labelId);

      this.closeModal(modal);
    });
  }

  /**
   * Open the modal to edit an existing note.
   * @param {number} index - The index of the note in the notes array.
   * @param {string} title - The title of the note.
   * @param {string} body - The body content of the note.
   * @param {string} label - The label ID of the note category.
   */
  openEditNoteModal(index, title, body, label) {
    const modal = this.openModal();

    const noteIdValues = ['', 'code-snippets', 'stand-up', 'bug-reports', 'learning-notes', 'newsletter', 'performance', 'feature-ideas'];
    const noteIdText = ['', 'Code Snippets', 'Stand-Up Notes', 'Bug Reports', 'Learning Notes', 'Newsletters', 'Performance Metrics', 'Feature Ideas'];
    const noteIdColor = ['', '#e1322f', '#e14083', '#b351e0', '#6661e0', '#459de0', '#53e091', '#e07e37'];

    let noteLabel, noteColor;

    for (let i = 0; i < noteIdValues.length; i++) {
      if (noteIdValues[i] === label) {
        noteLabel = noteIdText[i];
        noteColor = noteIdColor[i];
      }
    }

    // Modal content
    modal.innerHTML = `
            <div class='note-modal'>
                <div class='edit-modal-title'>
                    <h2 contenteditable='true'>${title}</h2>
                </div>
                <form id='note-modal-form'>
                    <button class='back-button' type='submit' title='Back'></button>
                    <div>
                        <textarea id='edit-note-body' name='note-body'>${body}</textarea>
                    </div>
                    <div class='edit-note-footer'> 
                        <div class='edit-note-label'>${noteLabel}</div>
                        <button class='save-button' type='submit' title='Save'>Save</button>
                    </div>
                </form>
            </div>
        `;

    // Color of label
    const nLabel = modal.querySelector('.edit-note-label');
    nLabel.style.backgroundColor = noteColor;

    if (label === '') {
      nLabel.style.display = 'none';
    }

    // Initialize SimpleMDE
    const simplemde = new SimpleMDE({
      element: document.getElementById("edit-note-body"),
      forceSync: true,
      hideIcons: ['quote'],
      renderingConfig: {
        codeSyntaxHighlighting: true
      },
      spellChecker: false,
      toolbar: [
        'bold', 'italic', 'strikethrough', 'code', 'unordered-list', 'ordered-list', 'link', {
          name: "image",
          action: function customImageHandler(editor) {
            const cm = editor.codemirror;
            const doc = cm.getDoc();
            const cursor = doc.getCursor();
            doc.replaceRange(`![](https://)`, cursor);
          },
          className: "fa fa-picture-o",
          title: "Insert Image",
        }, '|', 'preview', 'side-by-side', 'fullscreen', '|', 'guide'
      ],
      shortcuts: {
        'toggleBold': 'Cmd-B',
        'toggleItalic': 'Cmd-I',
        'drawLink': 'Cmd-K',
        'togglePreview': 'Cmd-P',
        'toggleUnorderedList': 'Cmd-L',
        'toggleCodeBlock': 'Cmd-Alt-C',
        'drawImage': 'Cmd-Alt-I',
        'toggleOrderedList': 'Cmd-Alt-L',
        'toggleHeadingBigger': 'Shift-Cmd-H',
        'toggleHeadingSmaller': 'Cmd-H',
        'toggleSideBySide': 'F9',
        'toggleFullScreen': 'F11'
      }
    });

    // Override tab behavior to move focus out of SimpleMDE
    simplemde.codemirror.options.extraKeys.Tab = false;
    simplemde.codemirror.on('keydown', (cm, event) => {
      if (event.key === 'Tab') {
        event.preventDefault();
        const formElements = Array.from(modal.querySelectorAll('input, textarea, button, select, [contenteditable="true"]'));
        const currentIndex = formElements.indexOf(document.activeElement);
        if (event.shiftKey) {
          const prevIndex = (currentIndex - 1 + formElements.length) % formElements.length;
          formElements[prevIndex].focus();
        } else {
          const nextIndex = (currentIndex + 1) % formElements.length;
          formElements[nextIndex].focus();
        }
      }
    });

    enableModalTabTrap(modal, true);

    // Append modal to main body
    document.body.appendChild(modal);
    // Hide the top right buttons
    this.topRightButtons.style.display = 'none';

    // Close modal when clicking the back button
    const backButton = modal.querySelector('.back-button');
    backButton.addEventListener('click', () => {
      this.closeModal(modal);
    });

    // Close modal when clicking save, also update the note accordingly
    const saveButton = modal.querySelector('.save-button');
    saveButton.addEventListener('click', (event) => {
      // Prevent default form submission
      event.preventDefault();
      // Take the values inputted from the modal form
      const newTitle = modal.querySelector('.edit-modal-title h2').innerText;
      const newBody = modal.querySelector('#edit-note-body').value;

      // Edit the note with updated title and body
      this.notes[index].title = newTitle;
      this.notes[index].body = newBody;
      saveNote(this.notes[index]);
      this.render();

      this.closeModal(modal);
    });
  }

  /**
   * Open the modal to create a new folder.
   */
  openCreateFolderModal() {
    const modal = document.createElement('div');
    // Modal class for css design
    modal.classList.add('modal');
    // Append modal to main body
    document.body.appendChild(modal);

    // Modal content
    modal.innerHTML = `
            <div class='folder-modal'>
              <button class=obj-container>
                <span class='close-modal' title='Close'>&times;</span>
              </button>
                <div class='modal-title'>
                    <h2>New Folder</h2>
                </div>
                <form id='modal-form'>
                    <div class='modal-input'>
                        <input type='text' id='note-title' name='note-title' placeholder='Folder Name'>
                    </div>
                    <button class='create-folder-button' type='submit' title='Create'>Create</button>
                </form>
            </div>
        `;

    enableModalTabTrap(modal, true);
    // Close modal when clicking the close button
    const closeButton = modal.querySelector('.obj-container:has(.close-modal)');
    closeButton.addEventListener('click', () => {
      this.closeModal(modal);
    });

    // Create modal when clicking the create new folder button
    const createButton = modal.querySelector('.create-folder-button');
    createButton.addEventListener('click', (event) => {
      // Prevent default form submission
      event.preventDefault();
      // Take the values inputted from the modal form
      let folderName = modal.querySelector('#note-title').value;

      // Create a new folder
      this.createFolder(folderName);

      this.closeModal(modal);
    });
  }

  /**
   * Open a modal.
   * @returns {HTMLElement} - The created modal element.
   */
  openModal() {
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
    // Append modal to main body
    document.body.appendChild(modal);
    // Hide the top right buttons
    this.topRightButtons.style.display = 'none';

    return modal;
  }

  /**
   * Close a modal.
   * @param {HTMLElement} modal - The modal element to close.
   */
  closeModal(modal) {
    document.body.removeChild(modal);
    // Show the top right buttons again
    this.topRightButtons.style.display = 'flex';
    // Show the search bar again
    this.searchBar.style.display = 'flex';
    // Remove the blur class from the navigation bar
    this.navBar.classList.remove('blur');
    // Unhide the notes from display
    this.mainElement.classList.remove('hide-notes');
    // Unhide the journal header from display
    this.journalHeader.classList.remove('hide-notes');

    enableModalTabTrap(modal, false);
  }

  /**
   * Visit a folder.
   * @param {string} newFolderId - The ID of the folder to visit.
   */
  visitFolder(newFolderId) {
    //calling temp method
    let newFolder = getFolderByID(newFolderId);

    // if folder not found, must be main
    if (!newFolder) {
      this.currentFolderID = MAIN_ID;
      this.parentFolderID = null;
    }
    else {
      this.currentFolderID = newFolderId;
      this.parentFolderID = newFolder.parentFolderID;
    }

    // Set folders / notes list
    this.folders = getFoldersByID(this.currentFolderID);
    this.notes = getNotesByFolderID(this.currentFolderID);

    // If within main folder hide back button, otherwise show it
    if (this.currentFolderID === MAIN_ID) {
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

  /**
   * Filter the exist note with title of the note.
   * @param {Event} event - The input event from the search bar.
   */
  searchNotesFolders(event) {
    const searchQuery = event.target.value.toLowerCase(); // check the lower character
    const filteredNotes = this.notes.filter(note => note.title.toLowerCase().includes(searchQuery));
    const filteredFolders = this.folders.filter(folder => folder.name.toLowerCase().includes(searchQuery));
    this.renderNotesFolders(filteredNotes, filteredFolders);
  }

  /**
   * Render notes and folders to the homepage.
   * @param {Array} [filteredNotes=this.notes] - The notes to render.
   * @param {Array} [filteredFolders=this.folders] - The folders to render.
   */
  renderNotesFolders(filteredNotes = this.notes, filteredFolders = this.folders) {
    this.mainElement.innerHTML = '';

    // Render all notes in current folder
    filteredNotes.forEach(note => {
      const noteElement = document.createElement('div');
      noteElement.classList.add('note');
      noteElement.setAttribute('data-note-id', note.id);
      noteElement.setAttribute('title', this.getLabelText(note.label)); // Set title attribute for tooltip
      noteElement.setAttribute('tabindex', '0'); // Make the note focusable
      noteElement.innerHTML = `
        <div class='note-content' id=${note.label}>
            <span class='delete'>&times;</span>
            <p>${note.body}</p>
        </div>
        <div class='note-title'>
            <h3>${note.title}</h3>
        </div>`;

      // Click the x button to delete the note
      noteElement.querySelector('.delete').addEventListener('click', (event) => {
        event.stopPropagation();
        this.openConfirmationDeleteModal(note.id, 'note');
      });

      // Click to open edit modal
      noteElement.addEventListener('click', () => {
        this.openEditNoteModal(this.notes.indexOf(note), note.title, note.body, note.label);
      });

      // Handle Enter key press for opening the edit modal
      noteElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          this.openEditNoteModal(this.notes.indexOf(note), note.title, note.body, note.label);
        }
      });

      this.mainElement.prepend(noteElement);
    });

    // Render all notes in current folder
    filteredFolders.forEach(folder => {
      const folderElement = document.createElement('div');
      folderElement.classList.add('folder');
      folderElement.setAttribute('data-folder-id', folder.id);
      folderElement.setAttribute('tabindex', '0'); // Make the folder focusable
      folderElement.innerHTML = `
        <div class='folder-content' id=${folder.label}>
          <span class='delete-folder'>&times;</span>
        </div>
        <div class='folder-title'>
          <h3>${folder.name}</h3>
        </div>
      `;

      // Click the x button to delete the folder
      folderElement.querySelector('.delete-folder').addEventListener('click', (event) => {
        event.stopPropagation();
        this.openConfirmationDeleteModal(folder.id, 'folder');
      });

      // Click to open folder
      folderElement.addEventListener('click', () => {
        this.visitFolder(folder.id);
      });

      // Handle Enter key press for opening the folder
      folderElement.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          this.visitFolder(folder.id);
        }
      });

      this.mainElement.prepend(folderElement);
    });
  }
};

/**
 * Initialize HomeScript when the DOM content is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  new HomeScript();
});
