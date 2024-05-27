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
  }
  
  async openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('imageDatabase', 1);
      request.onupgradeneeded = function(event) {
        var db = event.target.result;
        db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
      };
      request.onsuccess = function(event) {
        resolve(event.target.result);
      };
      request.onerror = function(event) {
        reject('Error opening database: ' + event.target.errorCode);
      };
    });
  }

  async storeImageInIndexedDB(imageBase64) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await this.openDatabase();
        const transaction = db.transaction('images', 'readwrite');
        const store = transaction.objectStore('images');
        const request = await store.add({ image: imageBase64 });
        request.onsuccess = function(event) {
          console.log('Image stored successfully!');
          resolve(event.target.result);
        };
        request.onerror = function(event) {
          console.log('Error storing image: ' + event.target.errorCode);
          reject(event.target.errorCode);
        };
      } catch (error) {
        console.error('Error: ', error);
        reject(error);
      }
    });
  }

  async getImageFromIndexedDB(id, imgElement) {
    try {
      const db = await this.openDatabase();
      const transaction = db.transaction('images', 'readonly');
      const store = transaction.objectStore('images');
      const request = store.get(id);
      request.onsuccess = function(event) {
        const record = event.target.result;
        if (record) {
          imgElement.src = record.image;
        } else {
          console.log('Image not found');
        }
      };
      request.onerror = function(event) {
        console.log('Error retrieving image: ' + event.target.errorCode);
      };
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  createNote (title, body, imageId) {
    const note = {
      title,
      body,
      id: `note-${Date.now()}`, // unique id for the note
      folderId: null, // initially not assigned to any folder
      imageId // initially empty
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

  renderNotes () {
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

      const notesInFolder = this.notes.filter(note => note.folderId === folder.id);
      notesInFolder.forEach(note => {
        this.appendNoteToFolder(note, folderElement);
      });
    });

    // Render notes not in any folder
    const unassignedNotes = this.notes.filter(note => note.folderId === null);
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
      this.editModal(this.notes.indexOf(note), note.title, note.body, note.imageId);
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
                          <input type="file" id="fileInput" style="display:none;" accept="image/*" ">
                          
                          <button type='button' class='input-button' name='input-Markdown'>MDown</button>
                      </div>
                    </div>
                    <div class='image-container'>
                      <img src="">
                    </div>
                    <button class='create-button' type='submit'>Create</button>
                </form>
            </div>
        `;
    // Append modal to main body
    document.body.appendChild(modal);
    // Hide the top right buttons
    this.topRightButtons.style.display = 'none';
    
    // upload image when clicking the image button
    const imageButton = modal.querySelector("button[name='input-Image']");
    const uploadFileInput = modal.querySelector("#fileInput");
    var imageSrc = modal.querySelector("img");


    // fileinput is hidden so clicking imagebutton will click fileinput
    imageButton.addEventListener('click', () => {
      uploadFileInput.click();
    });

    uploadFileInput.addEventListener('change', async (event) => {
      // assume that only one image is uploaded, change img source to 
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async function(event) {
          const imageBase64 = event.target.result;
          const imageId = await this.storeImageInIndexedDB(imageBase64);
          imageSrc.src = imageBase64;
          imageSrc.setAttribute('data-image-id', imageId);
        }.bind(this);
        reader.readAsDataURL(file);
      }
    });

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
      const imageId = imageSrc.getAttribute('data-image-id');

      // Create a new note
      // assets not /assets
      this.createNote(title, body, imageId);

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
  async editModal (index, title, body, imageId) {

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
                    <div class='image-container'>
                      <img src="">
                    </div>
                    <button class='save-button' type='submit'>Save</button>
                </form>
            </div>
        `;
    // Append modal to main body
    document.body.appendChild(modal);
    // Hide the top right buttons
    this.topRightButtons.style.display = 'none';

    await this.getImageFromIndexedDB(imageId, modal.querySelector('img'));

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

//     openDatabase() {
//       return new Promise((resolve, reject) => {
//           const request = indexedDB.open('imageDatabase', 1);
//           request.onupgradeneeded = function(event) {
//               const db = event.target.result;
//               db.createObjectStore('images', { keyPath: 'id', autoIncrement: true });
//           };
//           request.onsuccess = function(event) {
//               resolve(event.target.result);
//           };
//           request.onerror = function(event) {
//               reject('Error opening database: ' + event.target.errorCode);
//           };
//       });
// }

}


document.addEventListener('DOMContentLoaded', () => {
  new HomeScript();
});