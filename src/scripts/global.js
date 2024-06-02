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
