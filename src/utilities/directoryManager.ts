import { Commands } from "../models/commands.enum";
import { DirectoryInterface } from "../models/directory.models";
import { Directory } from "./directory.model";

export class DirectoryManager {
  private directory: Directory;

  constructor() {
    this.directory = new Directory(
      "[root]",
      null,
      {}
    )
  }

  /**
   * Starts console input listener.
   */
  listen(): void {
    console.log(`\n
    What would you like to do?

      -> Enter 'LIST' to view all directories and where they live.
      -> Enter 'CREATE <path>' to create a new folder in an existing folder.
      -> Enter 'DELETE <path>' to delete an existing folder.
      -> Enter 'MOVE <path_1> <path_2>' to move an existing folder at 'path_1' to an existing location 'path_2'.
      -> Enter 'PATH' to use instructions from a file.

      -> Press 'enter' to exit.`);

    process.stdin.on("data", this.handleInput.bind(this));
  }

  private handleInput(chunk: Buffer): void {
    const instructionLine = chunk.toString().split('\n')[0];
    const instructionParts: string[] = instructionLine.split(' ');

    const command: string = instructionParts[0];
    const args: string[] = instructionParts.slice(1);

    this.processInstruction(command, args);
  }

  private processInstruction(command: string, args: string[]): void {

    switch (command) {
      case Commands.LIST:
        this.listDirectoryTree(this.directory);
        break;
      case Commands.CREATE:
        const [createPath] = args;
        if (createPath == null) {
          console.log("Request must include intended directory path. Please try again.");
          break;
        }
        this.createDirectory(createPath);
        break;
      case Commands.DELETE:
        const [deletePath] = args;
        if (deletePath == null) {
          console.log("Request must include directory path. Please try again.");
          break;
        }
        this.deleteDirectory(deletePath);
        break;
      case Commands.MOVE:
        const [startPath, endPath] = args;
        if (startPath == null || endPath == null) {
          console.log("Request must include start and end paths. Please try again.");
          break;
        }
        this.moveDirectory(startPath, endPath)
        break;
      case Commands.PATH:
        const [filePath] = args;
        this.handleInstructionsFile();
        break;
      case Commands.EXIT:
        process.exit();
      default:
        console.log("Invalid input. Please try again.");
        break;
    }
  }

  private createDirectory(
    path: string,
    newDirectory: DirectoryInterface = null
  ): DirectoryInterface {
    // TODO: navigate to the new 'parent' and create new 'child'
    // TODO: print success/failure message

    // TODO: return new 'child'
    return null;
  }

  private getDirectory(path: string): DirectoryInterface {
    // TODO: crawl 'this.directory' along the provided path.

    return null;
  }

  private deleteDirectory(path: string): void {
    // TODO: navigate to the new 'parent' and delete existing 'child'
    // TODO: print success/failure message
  }

  private moveDirectory(currentPath: string, newPath: string): void {

  }

  private listDirectoryTree(directory: DirectoryInterface): void {
    // TODO: crawl 'this.directory' along all paths
    // TODO: print 'name' at proper indent for each directory
    // Temporary - for test:
    console.log(JSON.stringify(directory, null, 2));
  }


  // helpers:

  private handleInstructionsFile() {
    // TODO: read instructions from file
    //    parse into lines
    //    send to instruction line handler
    console.log("This feature is not yet implemented.");
  }
}
