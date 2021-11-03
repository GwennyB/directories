import { PathParts } from "../models/pathParts.model";

export const parsePaths = (pathInputs: string[]): PathParts[] => {
  if (pathInputs == null || !pathInputs.length) {
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
    if (pathParts.childName.replace(' ', '') === '') {
      throw Error('Path is required. Please try again.');
    }

    return acc.concat([pathParts]);
  }, []);

  return parsedPaths;
};
