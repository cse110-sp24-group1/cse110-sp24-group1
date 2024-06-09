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

