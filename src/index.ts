import { DirectoryManager } from "./utilities/directoryManager";


const runner = new DirectoryManager();

// TODO: enter some app starter pretties here
console.clear();
runner.listen();

// handle cleanup on shutdown:
const shutdownHandler = () => {
  console.log("\n\n Goodbye! \n\n");
};

process.on("beforeExit", shutdownHandler);

process.on("SIGINT", shutdownHandler);

process.on("uncaughtException", shutdownHandler);
