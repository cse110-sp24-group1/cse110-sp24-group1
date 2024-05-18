class HomeScript {
  constructor () {
    // Selects the new note button
    this.newNoteButton = document.getElementById('new-note-button')
    // Selects the top right buttons: new note and new folder
    this.topRightButtons = document.querySelector('.top-right-buttons')
    // Selects the navigation bar
    this.navBar = document.querySelector('nav')

    // Add event listener to open the modal on click of the new note button
    this.newNoteButton.addEventListener('click', this.openModal.bind(this))
  }

  // Opens the modal to the new note button
  openModal () {
    // Add blur class to navigation bar
    this.navBar.classList.add('blur')
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
                        <textarea id='note-body' name='note-body'></textarea>
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
      this.navBar.classList.remove('blur')
    })
    const createButton = modal.querySelector('#saveNoteButton')
  }
}
document.addEventListener('DOMContentLoaded', () => {
  new HomeScript()
})
