# QuestVault Tracker

QuestVault is a clean, animated browser-based tracker for managing question practice progress across different topics like DSA, SQL, JavaScript, aptitude, and more.

It lets you create separate topic files, save progress locally, continue from where you stopped, and customize how many question blocks each topic has.

## Preview

> Add your app screenshot here after uploading images to GitHub.

![QuestVault Home Preview](./assets/questvault-preview.png)

![QuestVault Progress Preview](./assets/questvault-progress.png)

## Live Demo

Add your GitHub Pages link here:

```text
https://Suraj76450.github.io/questvault-tracker/
```

## Features

- Create separate files for different topics
- Save solved question progress in the browser
- Continue from the last selected question
- Add more question blocks
- Remove question blocks safely
- Rename topic files
- Delete topic files
- Jump directly to any question number
- Move to the next unsolved question
- Mark all questions as solved
- Clear solved progress without deleting the file
- Animated progress bar
- Completion effect when all blocks are solved
- Responsive UI for desktop and mobile

## Screenshots

### Dashboard

![Dashboard Screenshot](./assets/dashboard.png)

### Topic Files

![Files Screenshot](./assets/files.png)

### Completed Progress

![Completed Screenshot](./assets/completed.png)

## Tech Stack

- HTML
- CSS
- JavaScript
- Browser LocalStorage

## How It Works

QuestVault stores all progress in your browser using LocalStorage. This means your files and solved questions remain saved when you reopen the app in the same browser.

Important: progress does not sync across different devices or browsers unless a backend/database is added later.

## Project Structure

```text
questvault-tracker/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Run Locally

1. Download or clone this repository.
2. Open `index.html` in your browser.
3. Start creating topic files and tracking progress.

## Deploy on GitHub Pages

1. Push the project to GitHub.
2. Open repository **Settings**.
3. Go to **Pages**.
4. Select:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Save and wait for GitHub to generate your website link.

## Future Improvements

- Cloud sync across devices
- Login system
- Import/export progress
- Dark mode
- Notes for each question
- Tags and difficulty levels

## Author

Made by **Suraj**.

## License

This project is open source and free to use.
