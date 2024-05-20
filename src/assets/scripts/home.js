class HomeScript {
  constructor () {
    // Selects the new note button
    this.newNoteButton = document.getElementById('new-note-button')
    // Selects the top right buttons: new note and new folder
    this.topRightButtons = document.querySelector('.top-right-buttons')
    // Selects the navigation bar
    // this.navBar = document.querySelector('nav')
    // Select the main element of the html file where the notes will be displayed
    this.mainElement = document.querySelector('main')
    // A list of all of the notes
    this.notes = []

    // Add event listener to open the modal on click of the new note button
    this.newNoteButton.addEventListener('click', this.openModal.bind(this))
  }

  createNote (title, body) {
    const note = {
      title,
      body
    }
    // Add note to the notes array
    this.notes.push(note)

    // Render the notes to the homepage
    this.renderNotes()
  }

  // Renders the notes on the home page
  renderNotes () {
    // Remove the existing main element to render new notes
    this.mainElement.innerHTML = ''

    // Loop through each note to create HTML elements for each note
    this.notes.forEach((note, index) => {
      // Create a new note element
      const noteElement = document.createElement('div')
      // Add html for new notes html to be displayed on home page
      noteElement.classList.add('note')
      noteElement.innerHTML = `
                <h3>${note.title}</h3>
                <p>${note.body}</p>`
      // Open the note when clicking on it
      noteElement.addEventListener('click', () => {
        this.editModal(index, note.title, note.body)
      })

      // Append the note element to the main element
      this.mainElement.appendChild(noteElement)
    })
  }

  // Opens the modal to the new note button
  openModal () {
    // Add blur class to navigation bar
    // this.navBar.classList.add('blur')
    // Remove the display of notes with the open modal
    this.mainElement.classList.add('hide-notes')
    // Create modal element for 'div' of home html
    const modal = document.createElement('div')
    // Modal class for css design
    modal.classList.add('modal')

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
                        </select>
                    </div>
                    <div class='modal-input'>
                      <div class='textarea-container'>
                        <textarea id='note-body' name='note-body'></textarea>
                        <!-- #TODO 3 buttons for input Text, Image, and Markdown -->
                        <div class='modal-buttons'>
                          <button type='button' class='input-button' name='input-Text'>Text</button>
                          <button type='button' class='input-button' name='input-Image'>Image</button>
                          <button type='button' class='input-button' name='input-Markdown'>Markdown</button>
                      </div>
                    </div>
                    <button class='create-button' type='submit'>Create</button>
                </form>
            </div>
        `
    // Append modal to main body
    document.body.appendChild(modal)
    // Hide the top right buttons
    this.topRightButtons.style.display = 'none'

    // Close modal when clicking the close button
    const closeButton = modal.querySelector('.close-modal')
    closeButton.addEventListener('click', () => {
      document.body.removeChild(modal)
      // Show the top right buttons again
      this.topRightButtons.style.display = 'flex'
      // Remove the blur class from the navigation bar
      // this.navBar.classList.remove('blur')
      // Unhide the notes from display
      this.mainElement.classList.remove('hide-notes')
    })

    // Close modal when clicking the create new note button
    const createButton = modal.querySelector('.create-button')
    createButton.addEventListener('click', (event) => {
      // Prevent default form submission
      event.preventDefault()
      // Take the values inputted from the modal form
      const title = modal.querySelector('#note-title').value
      const body = modal.querySelector('#note-body').value

      // Create a new note
      this.createNote(title, body)

      document.body.removeChild(modal)
      // Show the top right buttons again
      this.topRightButtons.style.display = 'flex'
      // Remove the blur class from the navigation bar
      // this.navBar.classList.remove('blur')
      // Unhide the notes from display
      this.mainElement.classList.remove('hide-notes')
    })
  }

  // Opens the modal to the existing note
  editModal (index, title, body) {
    // Add blur class to navigation bar
    // this.navBar.classList.add('blur')
    // Remove the display of notes with the open modal
    this.mainElement.classList.add('hide-notes')
    // Create modal element for 'div' of home html
    const modal = document.createElement('div')
    // Modal class for css design
    modal.classList.add('modal')

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
                        <!-- #TODO 3 buttons for input Text, Image, and Markdown -->
                        <div class='exist-modal-buttons'>
                          <button type='button' class='exist-input-button' name='exist-input-Text'>Text</button>
                          <button type='button' class='exist-input-button' name='exist-input-Image'>Image</button>
                          <button type='button' class='exist-input-button' name='exist-input-Markdown'>Markdown</button>
                        </div>
                    </div>
                    <button class='save-button' type='submit'>Save</button>
                </form>
            </div>
        `
    // Append modal to main body
    document.body.appendChild(modal)
    // Hide the top right buttons
    this.topRightButtons.style.display = 'none'

    // Close modal when clicking the back button
    const backButton = modal.querySelector('.back-button')
    backButton.addEventListener('click', () => {
      document.body.removeChild(modal)
      // Show the top right buttons again
      this.topRightButtons.style.display = 'flex'
      // Remove the blur class from the navigation bar
      // this.navBar.classList.remove('blur')
      // Unhide the notes from display
      this.mainElement.classList.remove('hide-notes')
    })

    // Close modal when clicking save, also udpate the note accordingly
    const saveButton = modal.querySelector('.save-button')
    saveButton.addEventListener('click', (event) => {
      // Prevent default form submission
      event.preventDefault()
      // Take the values inputted from the modal form
      const newTitle = modal.querySelector('.edit-modal-title h2').innerText
      const newBody = modal.querySelector('#edit-note-body').value

      // Edit the note with updated title and body
      this.notes[index].title = newTitle
      this.notes[index].body = newBody
      this.renderNotes()

      document.body.removeChild(modal)
      // Show the top right buttons again
      this.topRightButtons.style.display = 'flex'
      // Remove the blur class from the navigation bar
      // this.navBar.classList.remove('blur')
      // Unhide the notes from display
      this.mainElement.classList.remove('hide-notes')
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new HomeScript()
})
