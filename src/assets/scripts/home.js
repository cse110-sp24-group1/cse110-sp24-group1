class HomeScript {
    constructor() {
        // Selects the new note button
        this.newNoteButton = document.getElementById('new-note-button');
        // Selects the top right buttons: new note and new folder
        this.topRightButtons = document.querySelector('.top-right-buttons');
        // Selects the navigation bar
        this.navBar = document.querySelector('nav');
        // Selects the exist note
        this.existNoteButton = document.getElementById('exist-note-button');

        // Add event listener to open the modal on click of the new note button
        this.newNoteButton.addEventListener('click', this.openModal.bind(this));

        // Add event listener to open the modal on click of the existing note button
        this.existNoteButton.addEventListener('click', this.editModal.bind(this));
        
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
        document.body.appendChild(modal);
        // Hide the top right buttons
        this.topRightButtons.style.display = 'none';

        // Close modal when clicking the close button
        const closeButton = modal.querySelector('.close-modal');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
            // Show the top right buttons again
            this.topRightButtons.style.display = 'flex';
            // Remove the blur class from the navigation bar
            this.navBar.classList.remove('blur');
        });
        const createButton = modal.querySelector('#saveNoteButton');
    }


    // Opens the modal to the exist note
    editModal() {
        // Add blur class to navigation bar
        this.navBar.classList.add('blur');
        // Create modal element for 'div' of home html
        const modal = document.createElement('div');
        // Modal class for css design 
        modal.classList.add('modal');

        // Modal content
        modal.innerHTML = `
            <div class='note-modal'>
                <div class='modal-title'>
                    <h2>Note Title</h2>
                </div>
                <form id='note-modal-form'>
                    <button class='back-button' type='submit'>Back</button>
                    <div class='modal-input'>
                        <textarea id='note-body' name='note-body'></textarea>
                    </div>
                    <button class='save-button' type='submit'>Save</button>
                </form>
            </div>
        `
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
        });
        //const createButton = modal.querySelector('#saveNoteButton');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HomeScript()
})
