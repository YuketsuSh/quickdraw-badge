# Quickdraw

Automates creating a GitHub repository, pushing a branch with a README, and opening a pull request to earn the GitHub Quickdraw badge.

---

## Description

Quickdraw is a command-line tool (CLI) that automates the steps needed to earn the GitHub Quickdraw badge by:

- Creating a new GitHub repository  
- Initializing the main branch (`main`) with an initial commit  
- Creating a dedicated branch with a README  
- Pushing changes to GitHub  
- Automatically opening a pull request in your default browser  

---

## Features

- Automatic repository creation using your GitHub token  
- Local cloning and preparation of the repository with required branches  
- Commit pushes and pull request creation via the GitHub API  
- Automatic pull request opening in your browser  
- Support for private or public repositories via a flag  

---

## Requirements

- Node.js (>=14)  
- Git installed and accessible in your system PATH  
- A GitHub personal access token with `repo` permissions  

---

## Installation & Usage

No build step needed — just run the script directly using `tsx` with `npx`:

```bash
npx tsx src/index.ts -t YOUR_GITHUB_TOKEN
````

Available options:

* `-t, --token <token>` : your GitHub personal access token (required)
* `-n, --name <name>` : repository name (default: `quickdraw-TIMESTAMP`)
* `--private` : create the repository as private (default: public)

Example:

```bash
npx tsx src/index.ts -t YOUR_GITHUB_TOKEN -n quickdraw-demo --private
```

---

## How It Works

1. Authenticate with GitHub using your token
2. Create a new repository with the specified name
3. Clone the repository locally and initialize the main branch (`main`) with an initial commit
4. Create a `quickdraw-branch` branch with a README file
5. Push the branch to GitHub
6. Automatically create a pull request and open it in your browser

---

## Troubleshooting

* Ensure your token has the required `repo` permissions
* Make sure Git is installed and in your system PATH
* Check your internet connection and GitHub API rate limits

---

## Contributions

Feel free to open issues or submit pull requests.
