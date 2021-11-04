"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const directoryManager_1 = require("./utilities/directoryManager");
// Create a 'DirectorManager' instance to listen for and process instructions.
const runner = new directoryManager_1.DirectoryManager();
// Clear the console to reduce clutter unrelated to the app run:
console.clear();
// Start listening for instructions:
runner.listen();
//# sourceMappingURL=index.js.map