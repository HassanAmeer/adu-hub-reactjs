# Git Commands Cheat Sheet (Windows & Mac)

## File States
- **Untracked**: When you create new files that Git cannot track yet.
- **Modified**: When changes have been made to a tracked file.
- **Staged**: File is ready to be committed.
- **Unmodified**: Unchanged files (e.g., right after being committed).

## Initial Setup
### Downloads & Terminal
- **Windows**: Download Git Bash from [git-scm.com/download/win](https://git-scm.com/download/win). Use Git Bash or VS Code Terminal.
- **Mac**: Open the default `Terminal` app or VS Code Terminal. Git is often pre-installed.

### Basic Checks
```bash
git --version  # Check Git version
ls             # List files and folders in the current directory
ls -a          # View all files in the folder, including hidden ones
```

## Global Configuration
Global setup configures your Git account for the whole system. Omit `--global` if you need to use different Git accounts for specific repositories.
```bash
git config --global user.name "Your GitHub Name"
git config --global user.email "your.email@example.com"
git config --list  # Check all configured account details
```

## Cloning & Basic Workflow
```bash
git clone <link>                  # Clone any project using HTTPS or SSH link
git status                        # Check the status of files (added, committed, pushed, or staged)
git add <filename.extension>      # Add specific file changes to the staging area
git add .                         # Add all changed files to the staging area
git restore <filename.extension>  # Discard all unstaged changes in a file
git restore --staged <filename>   # Unstage a file
git commit -m "Commit message"    # Commit staged files with a descriptive message
git push                          # Upload files to the current branch
git push origin main              # Upload files to the main branch on the origin remote
```

## Initializing a New Repository
When creating a new repository (especially useful if created locally before pushing to an empty remote repository without a `README.md`):
```bash
git init                          # Initialize a new local Git repository
git remote add origin <link>      # Link the local repository to a remote URL
git remote -v                     # Verify the connected remote URLs
git branch                        # Check current branch
git branch -M main                # Rename the default branch (usually 'master') to 'main'
git push -u origin main           # Push to origin main and set upstream. Afterwards, you can just use 'git push'
```
*Note: If a remote repo already has a `README.md`, you may need to pull those changes first before pushing.*

## Branch Commands
```bash
git branch                        # List all local branches (highlights currently open branch)
git branch -M main                # Rename current branch to 'main'
git checkout <branchname>         # Switch/navigate to an existing branch
git checkout -b <branchname>      # Create a new branch and switch to it immediately
git branch -d <branchname>        # Delete a branch (must be switched to a different branch first)
```

## Merging Code
```bash
git diff                          # Check differences between branch code and current working tree
git merge <branchname>            # Merge code from the specified branch into the current branch
```

## Getting Updated Code (Pull)
```bash
git pull origin main              # Pull the latest changes from the origin's main branch
git pull                          # Pull changes from the default upstream branch
```

## Undoing Changes
### Before Committing (Added to Staging)
```bash
git reset <filename.extension>    # Unstage a file (change back from 'git add')
git reset                         # Unstage all files
```

### After Committing
```bash
git reset HEAD~1                  # Undo the last commit, keeping the changes in your working directory
git reset <commit-hash>           # Undo multiple commits back to the specified hash (keeps files)
git reset --hard <commit-hash>    # Undo multiple commits AND delete the changes completely
```

## Removing Stored GitHub Credentials
If you need to switch accounts and Git remembers the old one:

### Windows
Run this in Command Prompt or Git Bash to clear stored Windows credentials:
```cmd
cmdkey /delete:git:https://github.com
```
*(Alternatively, search for "Credential Manager" in the Windows start menu, go to "Windows Credentials", find GitHub, and remove it).*

### Mac
Run this in Terminal:
```bash
git credential-osxkeychain erase
host=github.com
protocol=https
# (Press Enter twice after typing the above lines)
```
*(Alternatively, open the "Keychain Access" app, search for "github.com", and delete the stored password).*
