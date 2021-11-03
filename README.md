# directories
This is a NodeJS console-based implementation of a directory tree. It is representative-only (ie - it does not actually create or modify directories on the host), and the represented 'directories' are stored in-state (ie - it does not persist after application shutdown).

# Getting started
1. Verify that prerequisites are met:  
 * internet connectivity
 * Mac or WSL (Scripts for Win are not included.)
 * Node v12+
 * NPM v6+

2. Clone repo locally: `git clone https://github.com/GwennyB/directories.git`

3. (In terminal) Navigate to the root of the cloned repo.

4. (In terminal) Load package dependencies: `npm i`

5. (In terminal) Start application: `npm run start`

# Using the app
The console application presents command options. To use the app, enter the command in the prompted format.  
Available commands and expected formats:
 * CREATE  
   Required input: `CREATE <path>`  
   What it does: Creates a folder at the indicated `path`, which should end with the intended name for the new folder.

 * DELETE  
   Required input: `DELETE <path>`  
   What it does: Deletes the folder at the indicated `path`, which should end with the name of the folder to be deleted.

 * MOVE  
   Required input: `MOVE <current_path> <new_home>`  
   What it does: Moves a folder from `current_path` (path should end with the name of the folder to be moved) to `new_home` (the path to the folder's new parent, which should already exist).

 * LIST  
   Required input: `LIST`  
   What it does: Prints (to screen) the full directory structure as it exists currently, and formatted to reflect the directory hierarchy.

 * PATH
   Required input: `PATH <path>`
   What it does: Fetches commands from a plain text file, formatted as shown above, with one formatted command per line and no empty lines.  
   ex:
   ```
   CREATE cars
   CREATE cars/sedans
   LIST
   DELETE cars/sedans
   LIST
   ```

 * `<enter>`
   What it does: Shuts down the application. Also useful to shut down the application after processing an instructions file by adding an empty line to the end, after the last command.  

Errors are handled and (typically) reported on-screen when encountered, and the application will continue running afterward.

