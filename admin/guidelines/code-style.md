# Code Style Guidelines

## File Linting Locally

### FOR JS LOCAL LINTING (ESLINT)
- npx eslint "src/**/*.js" (ALL JS FILES IN SRC)
- npx eslint "src/**/file1.js" (INDIVIDUAL FILE IN SRC)

### FOR HTML LOCAL LINTING
- npx htmlhint "src/**/*.html" (ALL HTML FILES IN SRC)
- npx htmlhint "src/**/file1.html" (INDIVIDUAL FILE IN SRC
  
### FOR CSS LOCAL LINTING:
- npx stylelint "src/**/*.css" (ALL CSS FILES IN SRC)
- npx stylelint "src/**/file1.css" (INDIVIDUAL FILE IN SRC)

## File Naming

### HTML Files
- Use descriptive names that reflect the content or purpose of the file. 
- Use lowercase letters and separate words with hyphens. For example:
```
index.html
about-us.html
contact-form.html
```

### CSS Files
- Use the same naming conventions as HTML files, but with the .css extension. For example:
```
styles.css
layout.css
animations.css
```

### JavaScript Files
- Use camelCase for file names and include a brief description of the file's purpose. For example:
```
appLogic.js
formValidation.js
modalScript.js
```

## Comments

### HTML
- Use comments to describe the purpose of major sections or elements within the HTML file. For example:
```
<!-- Header Section -->
<header>
    ...
</header>
```
```
<!-- Main Content Section -->
<main>
    ...
</main>
```

### CSS
- Use comments to organize and describe sections of CSS code. Include a brief description of the styles being applied. For example:
```
/* Header Styles */
header {
    ...
}
```
```
/* Main Content Styles */
main {
    ...
}
```

### JavaScript
- Use comments to explain complex algorithms, functions, or sections of code. 
- Use comments to make the code more readable and explain any non-obvious logic. For example:
```
// Calculate total price including tax
function calculateTotal(price) {
    ...
}
```

## Indentation and Formatting

### HTML and CSS
- Use 2 spaces for indentation. 
- Use consistent spacing around selectors, properties, and values. For example:
```
header {
  background-color: #333;
  color: white;
  padding: 1rem;
}
```

### JavaScript
- Use 2 spaces for indentation. 
- Use consistent spacing around operators and after commas. For example:
```
function calculateTotal(price, taxRate) {
  let total = price + (price * taxRate);
  return total;
}
```

## Naming Conventions

### Classes and IDs
- Use meaningful names that describe the purpose of the element. 
- Use lowercase letters and separate words with hyphens for readability. For example:
```
<div class="contact-form">
    ...
</div>
```

### Variables and Functions
- Use camelCase for variable and function names. For example:
```
let firstName = "John";
function calculateTotal(price) {
    ...
}
```

### Constants
- Use uppercase letters and underscores to separate words for constants. For example:
```
const MAX_WIDTH = 1024;
```
