const darkModeToggle = document.getElementById("dark-mode-toggle");

// Check the user's preferred color scheme
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

// Set the initial theme based on localStorage or user's preferred color scheme
let currentTheme = localStorage.getItem("theme");
if (!currentTheme) {
    currentTheme = prefersDarkScheme.matches ? "dark" : "light";
    localStorage.setItem("theme", currentTheme);
}

// Apply the initial theme
if (currentTheme === "dark") {
    document.body.classList.add("dark-mode");
    darkModeToggle.checked = true;
} else {
    document.body.classList.add("light-mode");
    darkModeToggle.checked = false;
}

// Toggle the theme when the toggle switch is clicked
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
