# Tasks **DUE SUNDAY, MAY 19, 2024**

## Front-End

(Gwen Kabir Moss Jeff Katie Anshi Vedant)

- REMINDERS
    - Make sure to follow code-style.md
    - Make sure to account for different page sizes
    - Branches, make sure to follow version-control.md
        - Main
        - Frontend
            - Create a sub-branch for each feature and merge to Frontend
        - Backend
        - Before working ALWAYS pull
        - Communicate with other branches to have most essential features updated

### Front End Team 1 

- [ ] Custom Icons -- **VEDANT** (no need to create custom for everything, just find a scalable image in different formats and add to assets folder)
    - [ ] Task list icon
    - [ ] Home page icon
    - [ ] Upload image icon
    - [ ] Upload text icon
    - [ ] Upload markdown icon
    - [ ] Website logo (optional)
    - [ ] Folder image for notes (find free svg)
    - [ ] Document image for notes (find free svg)
    - [ ] Create New Note Button Icon (+ sign bottom right of note)
    - [ ] Create New Folder Button Icon (+ sign buttom right of folder)
    - [ ] Task List Edit/Delete Button (not required but right now it is an emoji, might not match our theme?)
- [ ] Navigation Bar -- **KABIR**
    - [ ] Make sure nav bar is consistent across all pages
        - [ ] HTML
        - [ ] CSS
            - [ ] Media Queries
        - [ ] Redirection
            - [ ] temporary buttons and use created empty html files
    - [ ] Create redirection buttons for the navbar buttons
    - [ ] Make sure to include media queries so that phone/laptop nav display is properly displayed
- [ ] Create media queries template for desktop/laptop and phone(set min and mix width) - **ANSHI**
    - ''' (@media only screen and (min-width: 768px) {
    /* tablets and desktop */
    }
    '''
    - '''@media only screen and (max-width: 767px) and (orientation: portrait) {
    /* portrait phones */
        } ''' 
- [ ] Create basic HTML and CSS page for home page -- **JEFF & GWEN**
    - [ ] Flex box w/ approrpiate sizing
        - [ ] Display: Flex 
        - [ ] Have a mix of folders and entries 
        - [ ] Create New folder and New Note button
        - [ ] Leave room for navbar to be implemented, define how much percentage of page is to be used, using relative units
    - [ ] Functionality to adjust alignment for new folders / notes (if you do display flex and document add new note element in the beginning of the list, it should readjust automatically so just make sure to add the new note/folder in the begining)
- [ ] Create basic HTML and CSS page for New Note page form -- **KATIE & MOSS**
    - [ ] When clicking the new page button a popup modal form should be created
    - [ ] Make sure buttons click, text can be inputted
    - [ ] make sure size of form for new note is same existing note
    - [ ] make sure navbar is blurred when opening form
- [ ] Create basic HTML and CSS page for Existing Note entry -- **KATIE & MOSS**
    - [ ] When clicking on a note document the notes should pop in a display
    - [ ] make sure 3 buttons are at top right of form
    - [ ] make sure navbar is blurred when opening form


### Front End Team 2

- [ ] Revise basic HTML and CSS page for Task List -- **ANSHI**
    - [ ] change color palatte
    - [ ] seperate html from js
    - [ ] implement nav bar when available
    - [ ] media queries (add task)

## Back-End

(Purich Teddy Jeremy Nam)

- [ ] Finalize Model Schema for data **Nam & Teddy**
    - [ ] have separate folder for this in json
- [ ] Create tests for data schema **Jeremy** 
    - [ ] Use Jest for testing/puppeter
- [ ] Start creating Local Storage Functions **Everybody**
    - [ ] Create separate script file for the local storage functions
- [ ] Experiment with using Markdown integration **Purich**
    - [ ] use default html page and buttons to test on separate branch