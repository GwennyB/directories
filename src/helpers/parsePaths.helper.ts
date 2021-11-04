import { PathParts } from "../models/pathParts.model";

/**
 * Validates path arguments and arranges their pieces into descriptive segments
 * as needed to locate and manipulate directories.
 * @param pathInputs a list of 'path' arguments provided by the user
 * @returns a list of objects with validated, descriptive segments of target paths
 */
export const parsePaths = (pathInputs: string[]): PathParts[] => {
  if (pathInputs == null
    || !pathInputs.length
    || pathInputs.filter((path) => path == null).length) {
    throw Error('Path is required. Please try again.');
  }
  const parsedPaths: PathParts[] = pathInputs.reduce((acc, pathInput) => {
    const childPath = pathInput.split('/');
    const parentPath = childPath.slice(0, childPath.length - 1);
    const pathParts: PathParts = {
      pathInput,
      parentPath,
      childPath,
      parentName: parentPath[parentPath.length - 1],
      childName: childPath[childPath.length - 1],
    };
    if (!pathParts.childName.replace(/ /g, '').length) {
      throw Error('Path may not be blank. Please try again.');
    }

    return acc.concat([pathParts]);
  }, []);

  return parsedPaths;
};
