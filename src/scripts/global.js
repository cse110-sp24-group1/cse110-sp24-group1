document.addEventListener("DOMContentLoaded", function() {
    /**
     * Element representing the dark mode toggle switch.
     * @type {HTMLElement}
     */
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    /**
     * Function applyTheme to set the colorSchemes of the elements.
     */
    const applyTheme = (theme) => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark-mode");
            document.documentElement.style.colorScheme = 'dark';
        } else {
            document.documentElement.classList.remove("dark-mode");
            document.documentElement.style.colorScheme = 'light';
        }
    };
    /**
     * The current theme, either 'dark' or 'light', stored in localStorage.
     * @type {string|null}
     */
    let currentTheme = localStorage.getItem("theme");
    /**
     * Set the initial theme based on localStorage or user's preferred color scheme.
     */
    if (currentTheme) {
        applyTheme(currentTheme);
        darkModeToggle.checked = (currentTheme === "dark");
    }
    /**
     * Toggle the theme between dark mode and light mode when the toggle switch is clicked.
     */
    darkModeToggle.addEventListener("change", function () {
        let theme = "light";
        if (darkModeToggle.checked) {
            theme = "dark";
        }
        localStorage.setItem("theme", theme);
        applyTheme(theme);
    });
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
