import { Commands } from "../models/commands.enum";
import { DirectoryInterface } from "../models/directory.models";
import { Directory } from "./directory";
import * as fs from "fs";
import { PathParts } from "../models/pathParts.model";
import { parsePaths } from "../helpers/parsePaths.helper";

/**
 * App controller - Manages the directory structure.
 * An instance can listen for console inputs, validate them, and process them.
 * All commands from 'Commands' reference are supported.
 * Errors are reported on screen, and listener remains live after a reported error.
 * 
 * A directory root is created on instantiation - no constructor arguments are required.
 */
export class DirectoryManager {
  protected directory: Directory;

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

  /**
   * Instructs the user regarding available options and syntax requirements.
   */
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

  // input handlers:

  /**
   * Event handler for the process listener.
   * Cleans the input and submits it for processing.
   * @param chunk a line of input from the console
   */
  protected handleInput(chunk: Buffer): void {
    try {
      const instructionLine = chunk.toString().split('\n')[0];

      this.processInstruction(instructionLine);
      this.promptUser();
    } catch (error: unknown) {
      console.error('ERROR:', (error as Error).message || 'unknown error')
    }
  }

  /**
   * Fetches instructions file from indicated path.
   * Extracts of instructions from the file.
   * Cleans the lines and submits them for processing in order.
   * @param path path to local commands file
   */
  protected handleInstructionsFile(path: string): void {
    console.info(`\nFetching instructions from ${path}...\n`);
    if (path == null) {
      console.error('Path to instructions file is invalid. Please try again.');
      return;
    }
    const instructionLines = fs.readFileSync(path)
      .toString()
      .split('\n');
    instructionLines.forEach((instructionLine) => {
      this.processInstruction(instructionLine)
    });
  }


  // command processors:

  /**
   * Sorts a line of instruction by command and routes to the appropriate handler.
   * @param instructionLine line of instruction from user, cleaned
   */
  private processInstruction(instructionLine: string): any {
    const instructionParts: string[] = instructionLine.split(' ');
    const command: string = instructionParts[0];
    const args: string[] = instructionParts.slice(1);
    switch (command) {
      case Commands.LIST:
        console.info(Commands.LIST);
        this.listDirectoryTree(this.directory);
        break;
      case Commands.CREATE:
        try {
          const [createPath] = parsePaths(args);
          console.info(`${Commands.CREATE} ${createPath.pathInput}`);
          this.createDirectory(createPath);
        } catch (error) {
          console.error(`Cannot create ${(args && args[0]) || 'undefined'} - `, (error as Error).message);
        } finally {
          break;
        }
      case Commands.DELETE:
        try {
          const [deletePath] = parsePaths(args);
          console.info(`${Commands.DELETE} ${deletePath.pathInput}`);
          this.deleteDirectory(deletePath);
        } catch (error) {
          console.error(`Cannot delete ${(args && args[0]) || 'undefined'} -`, (error as Error).message);
        } finally {
          break;
        }
      case Commands.MOVE:
        try {
          const [startPath, endPath] = parsePaths(args);
          console.info(`${Commands.MOVE} ${startPath.pathInput} ${endPath.pathInput}`);
          this.moveDirectory(startPath, endPath)
          break;
        } catch (error) {
          console.log({ error });
          console.error(`Cannot move ${(args && args[0]) || 'undefined'} to ${(args && args[1]) || 'undefined'} - `, (error as Error).message);
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
        console.error("Invalid input. Please try again.");
        break;
    }
  }

  /**
   * Crawls through the directory tree (recursively, starting at root) along provided path.
   * Locates the directory at that path, if it exists.
   * @param path path to target directory
   * @param startDirectory current directory sub-tree root
   * @returns directory at indicated path if it exists; otherwise throws error
   */
  protected getDirectory(
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

  /**
   * Creates a new directory at the specified path.
   * @param path path of intended new directory (ends in intended new directory's name)
   */
  private createDirectory(path: PathParts): void {
    const parent = this.getDirectory(path.parentPath, this.directory);
    const child = new Directory(path.childName, parent);
    parent.addChild(child);
  }

  /**
   * Deletes the directory at the specified path, if it exists.
   * @param path path of directory to delete (which ends in target directory's name)
   */
  private deleteDirectory(path: PathParts): void {
    const parent = this.getDirectory(path.parentPath, this.directory);
    parent.removeChild(path.childName);
  }

  /**
   * Moves a directory from its current location to a specified new parent directory.
   * @param currentPath path of directory to move (which ends in target directory's name)
   * @param newPath path to directory's intended new parent
   */
  private moveDirectory(currentPath: PathParts, newPath: PathParts): void {
    const oldParent = this.getDirectory(currentPath.parentPath, this.directory);
    const child = oldParent.contents[currentPath.childName];
    if (child == null) {
      throw Error(`${currentPath.pathInput} does not exist`)
    }
    const newParent = this.getDirectory(newPath.childPath, this.directory);
    child.updateParent(newParent);
  }

  /**
   * Lists (on screen) all directories with indents to indicate hierarchy
   * (recursively, starting at the specified root directory).
   * @param directory directory at which to start listing
   * @param indent indentation for current hierarchical level
   */
  private listDirectoryTree(directory: DirectoryInterface, indent = ''): void {
    // Print this directory:
    let newIndent = indent;
    if (directory != this.directory) {
      console.info(`${indent}${directory.name}`);
      newIndent += '  ';
    }

    // Print all children:
    const children: DirectoryInterface[] = Object.values(directory.contents)
      .sort((a, b) => a.name < b.name ? -1 : 1);
    children.forEach((child) => {
      this.listDirectoryTree(child, newIndent);
    });
  }

}
