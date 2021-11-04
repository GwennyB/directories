import { DirectoryManager } from "./utilities/directoryManager";

// Create a 'DirectorManager' instance to listen for and process instructions.
const runner = new DirectoryManager();

// Clear the console to reduce clutter unrelated to the app run:
console.clear();

// Start listening for instructions:
runner.listen();
