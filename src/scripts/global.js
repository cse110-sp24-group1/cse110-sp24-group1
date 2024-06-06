/**
 * Element representing the dark mode toggle switch.
 * @type {HTMLElement}
 */
const darkModeToggle = document.getElementById("dark-mode-toggle");

/**
 * MediaQueryList object representing the user's preferred color scheme.
 * @type {MediaQueryList}
 */
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

/**
 * The current theme, either 'dark' or 'light', stored in localStorage.
 * @type {string|null}
 */
let currentTheme = localStorage.getItem("theme");

/**
 * Set the initial theme based on localStorage or user's preferred color scheme.
 */
if (!currentTheme) {
    currentTheme = prefersDarkScheme.matches ? "dark" : "light";
    localStorage.setItem("theme", currentTheme);
}

/**
 * Apply the initial theme to the document body and toggle switch.
 */
if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
    darkModeToggle.checked = true;
} else {
    document.body.classList.add("light-mode");
    darkModeToggle.checked = false;
}

/**
 * Toggle the theme between dark mode and light mode when the toggle switch is clicked.
 */
darkModeToggle.addEventListener("change", function () {
    if (darkModeToggle.checked) {
        document.body.classList.remove("light-mode");
        document.body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
    } else {
        document.body.classList.remove("dark-mode");
        document.body.classList.add("light-mode");
        localStorage.setItem("theme", "light");
    }
});

/**
 * List of focusable elements in the modal (initialized upon modal creation).
 * @type {NodeListOf<HTMLElement>}
 */
let focusable = null;

/**
 * Tab event handler for navigating within the modal.
 * @param {KeyboardEvent} e - The keyboard event.
 */
const handleKey = (e) => {
    if (e.keyCode === 9) {
        if (focusable.length) {
            console.log(e.target);
            let first = focusable[0];
            let last = focusable[focusable.length - 1];
            let shift = e.shiftKey;
            if (!Array.from(focusable).includes(e.target)) {
                first.focus();
                e.preventDefault();
            }
            if (shift) {
                if (e.target === first) { // shift-tab pressed on first input in dialog
                    last.focus();
                    e.preventDefault();
                }
            } else {
                if (e.target === last) { // tab pressed on last input in dialog
                    first.focus();
                    e.preventDefault();
                }
            }
        }
    }
}

/**
 * Enables or disables the tab trap within the modal for accessibility.
 * @param {HTMLElement} modal - The modal element.
 * @param {boolean} en - Whether to enable or disable the tab trap.
 */
function enableModalTabTrap(modal, en) {
    let focusableList = modal.querySelectorAll('input,button,select,textarea');
    focusable = focusableList;
    if (en) {
        window.addEventListener('keydown', handleKey);
    } else {
        window.removeEventListener('keydown', handleKey);
        focusable = null;
    }   
}
