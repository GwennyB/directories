import { Commands } from '../models/commands.enum';
import { DirectoryManager } from './directoryManager';

describe("DirectoryManager Class", () => {
  let runner: DirectoryManagerTest;

  beforeEach(() => {
    runner = new DirectoryManagerTest();
    spyOn(console, "log").and.callFake(() => { });
  });

  describe("handleInput()", () => {
    describe("CREATE directory", () => {
      it("creates a new directory at the prescribed path", () => {
        // create some directories:
        runner.handleInput(Buffer.from("CREATE folderOne"));
        runner.handleInput(Buffer.from("CREATE folderOne/childOne"));
        runner.handleInput(Buffer.from("CREATE folderOne/childOne/grandchildOne"));

        // verify the directories are present:
        const folderOne = runner.testDirectory.contents.folderOne;
        expect(folderOne).toBeDefined();
        const childOne = folderOne.contents.childOne;
        expect(childOne).toBeDefined();
        const grandchildOne = childOne.contents.grandchildOne;
        expect(grandchildOne).toBeDefined();
      });

      it("reports error if prescribed path is invalid", () => {
        const logSpy = spyOn(console, "error").and.callThrough();
        runner.handleInput(Buffer.from("CREATE invalidFolder/thisWontWork"));
        const logCalls = logSpy.calls.allArgs();
        expect(logCalls).toEqual([
          [
            'Cannot create invalidFolder/thisWontWork - ',
            'invalidFolder does not exist'
          ],
        ])
      });
    });

    describe("DELETE directory", () => {
      it("deletes the directory at the prescribed path", () => {
        // create some directories:
        runner.handleInput(Buffer.from("CREATE folderOne"));
        runner.handleInput(Buffer.from("CREATE folderOne/childOne"));
        runner.handleInput(Buffer.from("CREATE folderOne/childOne/grandchildOne"));
        expect(runner.testDirectory.contents.folderOne.contents.childOne.contents.grandchildOne).toBeDefined();
        runner.handleInput(Buffer.from("DELETE folderOne/childOne/grandchildOne"));
        expect(runner.testDirectory.contents.folderOne.contents.childOne.contents.grandchildOne).toBeUndefined();
      });
    });

    describe("MOVE directory", () => {
      it("moves a directory to new location", () => {
        runner.handleInput(Buffer.from("CREATE folderOne"));
        runner.handleInput(Buffer.from("CREATE folderOne/target"));
        runner.handleInput(Buffer.from("CREATE folderTwo"));
        expect(runner.testDirectory.contents.folderOne.contents.target).toBeDefined();
        expect(runner.testDirectory.contents.folderTwo.contents.target).toBeUndefined();

        runner.handleInput(Buffer.from("MOVE folderOne/target folderTwo"));
        expect(runner.testDirectory.contents.folderOne.contents.target).toBeUndefined();
        expect(runner.testDirectory.contents.folderTwo.contents.target).toBeDefined();
      });

      it("reports error if directory doesn't exist", () => {
        runner.handleInput(Buffer.from("CREATE folderOne"));
        runner.handleInput(Buffer.from("CREATE folderTwo"));
        expect(runner.testDirectory.contents.folderOne).toBeDefined();
        expect(runner.testDirectory.contents.folderOne.contents.target).toBeUndefined();
        expect(runner.testDirectory.contents.folderTwo).toBeDefined();
        const logSpy = spyOn(console, "error").and.callThrough();

        runner.handleInput(Buffer.from("MOVE folderOne/target folderTwo"));
        const logCalls = logSpy.calls.allArgs();
        expect(logCalls).toEqual([
          [
            'Cannot move folderOne/target to folderTwo - ',
            'folderOne/target does not exist'
          ]
        ]);
      });

      it("reports error if new parent directory doesn't exist", () => {
        runner.handleInput(Buffer.from("CREATE folderOne"));
        runner.handleInput(Buffer.from("CREATE folderOne/target"));
        expect(runner.testDirectory.contents.folderOne.contents.target).toBeDefined();

        const logSpy = spyOn(console, "error").and.callThrough();

        runner.handleInput(Buffer.from("MOVE folderOne/target folderTwo"));
        expect(runner.testDirectory.contents.folderOne.contents.target).toBeDefined();
        const logCalls = logSpy.calls.allArgs();
        expect(logCalls).toEqual([
          [
            'Cannot move folderOne/target to folderTwo - ',
            'folderTwo does not exist'
          ]
        ]);
      });
    });

    describe("LIST directory tree", () => {
      it("lists all directories indented to display hierarchy", () => {
        // add some directories:
        runner.handleInput(Buffer.from("CREATE folderOne\n"));
        runner.handleInput(Buffer.from("CREATE folderTwo\n"));
        runner.handleInput(Buffer.from("CREATE folderOne/childOne\n"));
        runner.handleInput(Buffer.from("CREATE folderTwo/childTwo\n"));
        runner.handleInput(Buffer.from("CREATE folderOne/childOne/grandchildOne\n"));

        const logSpy = spyOn(console, "info").and.callThrough();
        runner.handleInput(Buffer.from(Commands.LIST));

        const logCalls = logSpy.calls.allArgs();
        expect(logCalls.length).toEqual(6);
        expect(logCalls).toEqual([
          ["LIST"],
          ["folderOne"],
          ["  childOne"],
          ["    grandchildOne"],
          ["folderTwo"],
          ["  childTwo"],
        ]);
      });
    });
  });

  describe("handleInstructionsFile()", () => {
    describe("CREATE directory", () => {
      it("reads and parses a valid instructions file", () => {
        const path = './test_utils/testInstructions';
        runner.handleInstructionsFile(path);
        expect(runner.testDirectory.contents.foods.contents.vegetables.contents.squash)
          .toBeDefined();
      });
    });
  });
});

class DirectoryManagerTest extends DirectoryManager {
  testDirectory = this.directory;
  handleInput = super.handleInput;
  handleInstructionsFile = super.handleInstructionsFile;
}