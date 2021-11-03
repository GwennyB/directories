import { Commands } from "../models/commands.enum";
import { DirectoryInterface } from "../models/directory.models";
import { Directory } from "./directory";
import * as fs from "fs";
import { PathParts } from "../models/pathParts.model";
import { parsePaths } from "../helpers/parsePaths.helper";

export class DirectoryManager {
  private directory: Directory;

  constructor() {
    this.directory = new Directory(
      "",
      null,
      {}
    )
  }

  /**
   * Starts console input listener.
   */
  listen(): void {
    this.promptUser();

    process.stdin.on("data", this.handleInput.bind(this));
  }

  private promptUser(): void {
    console.log(`

    -------------------------------------------------------------------------
    What would you like to do?
    
    -> Enter 'LIST' to view all directories and where they live.
    -> Enter 'CREATE <path>' to create a new folder in an existing folder.
    -> Enter 'DELETE <path>' to delete an existing folder.
    -> Enter 'MOVE <path_1> <path_2>' to move an existing folder at 'path_1'
    to an existing location 'path_2'.
    -> Enter 'PATH' to use instructions from a file.
    
    -> Press 'enter' to exit.
    -------------------------------------------------------------------------
    
    `);
  }

  private handleInput(chunk: Buffer): any {
    try {
      const instructionLine = chunk.toString().split('\n')[0];

      this.processInstruction(instructionLine);
      this.promptUser();
    } catch (error: unknown) {
      console.log('ERROR:', (error as Error).message || 'unknown error')
    }
  }
  
  private processInstruction(instructionLine: string): any {
    const instructionParts: string[] = instructionLine.split(' ');
    const command: string = instructionParts[0];
    const args: string[] = instructionParts.slice(1);
    switch (command) {
      case Commands.LIST:
        this.listDirectoryTree(this.directory);
        break;
      case Commands.CREATE:
        try {
          const [createPath] = parsePaths(args);
          this.createDirectory(createPath);
        } catch (error) {
          console.log(`Cannot create ${(args && args[0]) || 'undefined'} - `, (error as Error).message);
        } finally {
          break;
        }
      case Commands.DELETE:
        try {
          const [deletePath] = parsePaths(args);
          this.deleteDirectory(deletePath);
        } catch (error) {
          console.log(`Cannot delete ${(args && args[0]) || 'undefined'} - `, (error as Error).message);
        } finally {
          break;
        }
      case Commands.MOVE:
        try {
          const [startPath, endPath] = parsePaths(args);
          this.moveDirectory(startPath, endPath)
          break;
        } catch (error) {
          console.log(`Cannot move ${(args && args[0]) || 'undefined'} to ${(args && args[1]) || 'undefined'} - `, (error as Error).message);
        } finally {
          break;
        }
      case Commands.PATH:
        const path = args[0];
        this.handleInstructionsFile(path);
        break;
      case Commands.EXIT:
        process.exit();
      default:
        console.log("Invalid input. Please try again.");
        break;
    }
  }

  private getDirectory(
    path: string[],
    startDirectory: DirectoryInterface,
  ): DirectoryInterface {
    // Return last found directory at end of 'path' array:
    if (path.length === 0) {
      return startDirectory;
    }

    // Get next directory:
    const currDirName = path[0];
    const currentDir = startDirectory.contents[currDirName];
    if (currentDir == null) {
      throw Error(`${currDirName} does not exist`);
    }
    // Get list of remaining directories:
    const nextPath = path.slice(1);

    // Repeat while 'path' still contains directories:
    return this.getDirectory(nextPath, currentDir);
  }

  private createDirectory(path: PathParts): void {
    const parent = this.getDirectory(path.parentPath, this.directory);
    const child = new Directory(path.childName, parent);
    parent.addChild(child);

    const success = parent.contents[child.name] != null;
    if (success) {
      console.log(`CREATE ${path.pathInput}`);
    }
  }

  private deleteDirectory(path: PathParts): void {
    try {
      const parent = this.getDirectory(path.parentPath, this.directory);
      parent.removeChild(path.childName);

      const success = parent.contents[path.childName] == null;
      if (success) {
        console.log(`DELETE ${path.pathInput}`);
      }
    } catch (error) {
      const message: string = (error as Error).message || 'unknown error';
      console.log(`Cannot delete ${path && path.pathInput} - ${message}`);
    }
  }

  private moveDirectory(currentPath: PathParts, newPath: PathParts): void {
    try {
      const oldParent = this.getDirectory(currentPath.parentPath, this.directory);
      const newParent = this.getDirectory(newPath.childPath, this.directory);
      const child = oldParent.contents[currentPath.childName];
      // newParent.addChild(child);
      child.updateParent(newParent);
      // oldParent.removeChild(child.name);
    } catch (error) {
      const message: string = (error as Error).message || 'unknown error';
      console.log(`Cannot move ${currentPath} to ${newPath} - ${message}`);
    }
  }

  private listDirectoryTree(directory: DirectoryInterface, indent = ''): void {
    // Print this directory:
    let newIndent = indent;
    if (directory != this.directory) {
      console.log(`${indent}${directory.name}`)
      newIndent += '  ';
    }

    // Print all children:
    const children: DirectoryInterface[] = Object.values(directory.contents)
      .sort((a, b) => a.name < b.name ? -1 : 1);
    children.forEach((child) => {
      this.listDirectoryTree(child, newIndent);
    });
  }


  // helpers:

  private handleInstructionsFile(path: string): void {
    console.log(`\nFetching instructions from ${path}...\n`);
    if (path == null) {
      console.log('Path to instructions file is invalid. Please try again.');
      return;
    }
    const instructionLines = fs.readFileSync(path)
      .toString()
      .split('\n');
    instructionLines.forEach((instructionLine) => {
      this.processInstruction(instructionLine)
    });
  }
}
