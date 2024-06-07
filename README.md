# One and Done

<img src="./admin/branding/icon.png" width="200">

Welcome to **One and Done**, a feature-rich journal app built with HTML, CSS, and JavaScript. This app allows you to create notes and folders, use markdown for formatting, and manage tasks efficiently.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)

## Learn More About our [Team](./admin/team.md)!

[![Team Introduction Video](https://img.youtube.com/vi/zUe_q16AtvY/hqdefault.jpg)](http://www.youtube.com/watch?v=zUe_q16AtvY)

## Project Links

![Github](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=GitHub%20Pages&logoColor=white)

- We used Github for project management. Our [GitHub Repository](https://github.com/cse110-sp24-group1/cse110-sp24-group1) has our source code, meeting notes, brainstorming information, kanban board, and much more.
- We are hosting our [website](https://cse110-sp24-group1.github.io/cse110-sp24-group1/src/) with GitHub Pages.

## Features

- Organized Note and Folder Creation: Easily create and manage your notes and folders to keep your thoughts and tasks well-organized.
- Markdown Support: Utilize powerful markdown capabilities to format your notes with ease, adding structure and emphasis.
- Efficient Task List Management: Keep track of your tasks and to-dos effortlessly with a dedicated task list management system.
- Dual Theme Options: Switch seamlessly between dark mode and light mode to suit your preferences and enhance your writing experience.
- Persistent Data Management: Rely on local storage to securely manage your data, ensuring your notes and tasks are always saved.
- Powerful Search Functionality: Quickly find specific notes and tasks with a robust search bar, enhancing productivity and accessibility.
- Accessibility: Enjoy a user-friendly UI with full keyboard accessibility, ensuring ease of use for everyone.

## Brainstorming and Design Process

![Dribbble](https://img.shields.io/badge/Dribbble-EA4C89?style=for-the-badge&logo=dribbble&logoColor=white)
![Miro](https://img.shields.io/badge/Miro-F7C922?style=for-the-badge&logo=Miro&logoColor=050036)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)

- We used [Dribble](https://dribbble.com/tags/journal-app) for inspiration for our journal app.
- We used this [Miro Board](https://miro.com/app/board/uXjVKSW94aI=/) for our brainstorming and wireframing process.
- We used Figma for [wireframing](https://www.figma.com/design/VSgkp9TLpiEXWHehsFP2Dg/One-and-Done-Journal-App-Wireframing?node-id=0-1&t=y5qAZjXKxdrZl7Rq-1) and [hi-fidelity diagrams](https://www.figma.com/proto/uAhqMx3Dmbe6gv9awADPCt/One-and-Done-Journal-App-Prototype?node-id=2-618&t=U0amyd0JrK52E80l-0&scaling=scale-down&page-id=0%3A1&starting-point-node-id=1%3A2).

## SimpleMDE API

![Markdown](https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white)

- We used [SimpleMDE's API](https://simplemde.com/) to implement a markdown editor which includes a tool bar and keyboard shortcuts.

  - **Bold**: `Cmd-B`
  - **Italic**: `Cmd-I`
  - **Link**: `Cmd-K`
  - **Preview**: `Cmd-P`
  - **Unordered List**: `Cmd-L`
  - **Code Block**: `Cmd-Alt-C`
  - **Image**: `Cmd-Alt-I`
  - **Ordered List**: `Cmd-Alt-L`
  - **Heading Bigger**: `Shift-Cmd-H`
  - **Heading Smaller**: `Cmd-H`
  - **Side By Side**: `F9`
  - **Full Screen**: `F11`

## CI/CD Pipeline

![Github Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

Our project uses GitHub Actions for Continuous Integration and Deployment. The pipeline includes:

### JSDoc

- We used JSDoc Actions to generate our [project documentation](https://cse110-sp24-group1.github.io/cse110-sp24-group1/docs/index.html) from JavaScript Comments. 

### Superlinter

- To ensure code quality and adherence to community best practices for [Javascript, HTML, CSS,and Markdown](https://github.com/super-linter/super-linter).

### Calibreapp Image Optimizer

- [Optimization](https://github.com/calibreapp/image-actions) of image,icons, and svg storage quality that are stored on the repo without the loss of quality.

### Jest and Puppeteer

![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)

- For testing purposes.

### Markdown Link Validator

- [Tests](https://github.com/marketplace/actions/markdown-link-check) all links that are implemented using Markdown to ensure all links are reachable and valid.

### File Changed Checker

- [Lists and logs](https://github.com/marketplace/actions/changed-files) all core files that were changed in a specifc branch such as main.

#### How to Test

1. Clone the GitHub repository locally: ```git clone https://github.com/cse110-sp24-group1/cse110-sp24-group1.git```
2. Start the live server: Ensure the live server is running and the application is accessible.
3. Run the tests: Execute the test suite using Jest.

##### Folder Functionality

```npm test -- folders.test.js```

##### Note Functionality

```npm test -- notes.test.js```

##### Task Functionality

```npm test -- tasks.test.js```


## Repository Organization

- `/admin/meetings`: Contains our meeting notes.
- `/admin/cipipline`: Contains pipeline diagrams.
- `/admin/branding`: Continas branding information.
- `/admin/videos`: Contains progress videos and final demo video.
- `/admin/guidelines`: Contains code style, version control, and CSS style guidelines
- `/docs`: Contains JSDoc information.
- `/specs/adrs`: Contains Architectural Design Records for any major decisions made in our project.
- `/specs/brainstorm`: Contains all of our initial brainstorming from user reasearch to wireframing.
- `/specs/pitch`: Contains our intial project pitch.
- `/src`: Contains source code for our project.

## Wiki

- To learn more about our project and its development, take a look at our [wiki](https://github.com/cse110-sp24-group1/cse110-sp24-group1/wiki).
  
## Future Investigation

- **Time Remaining for Task List**
  - Calculate and display time remaining for each task.
  - Implement visual representation (countdown clock, progress bar).

- **Calendar Widget**
  - Design a tab with an interactive calendar widget.
  - Display notes/tasks due on specific dates.
  - Allow input of daily work hours, displayed on the calendar.

- **Login/Logout Feature**
  - Implement user authentication for account creation and login.
  - Design login and sign-in forms.
  - Create a profile page for user information.
  - Ensure security and cross-platform accessibility.

- **Note Entry Templates**
  - Implement template selection for notes.
  - Predefined templates: Sprint Review, Standup Meeting, Brainstorming Meeting.
