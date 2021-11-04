import { PathParts } from '../models/pathParts.model';
import { parsePaths } from './parsePaths.helper';

describe("parsePaths()", () => {
  const parentName = 'directory';
  const parentPath = 'path/to/target/directory';
  const inputs = [
    `${parentPath}/one`,
    `${parentPath}/two`,
  ];

  const expectedResult: PathParts[] = [
    {
      pathInput: 'path/to/target/directory/one',
      parentName: 'directory',
      parentPath: ['path', 'to', 'target', 'directory'],
      childName: 'one',
      childPath: ['path', 'to', 'target', 'directory', 'one'],
    },
    {
      pathInput: 'path/to/target/directory/two',
      parentName: 'directory',
      parentPath: ['path', 'to', 'target', 'directory'],
      childName: 'two',
      childPath: ['path', 'to', 'target', 'directory', 'two'],
    }
  ];

  it("properly parses valid inputs", () => {
    const results = parsePaths(inputs).sort();
    expect(results).toEqual(expectedResult);
  });

  it("handles single 'null' input", () => {
    const fxn = () => parsePaths(inputs.concat(null));
    expect(fxn).toThrowMatching((thrown) => {
      return thrown.message.includes('Path is required');
    });
  });
  
  it("handles 'null' inputs array", () => {
    const fxn = () => parsePaths(null);
    expect(fxn).toThrowMatching((thrown) => {
      return thrown.message.includes('Path is required');
    });
  });

  it("handles empty inputs", () => {
    const fxn = () => parsePaths(inputs.concat('   '));
    expect(fxn).toThrowMatching((thrown) => {
      return thrown.message.includes('Path may not be blank');
    });
  });

});
