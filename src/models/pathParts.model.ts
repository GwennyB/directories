/**
 * Used to carry the various segments of a path as relevant to parent and child directories.
 * Members are used in order to complete the various directory manipulation commands.
 */
export interface PathParts {
  pathInput: string;
  parentPath: string[];
  parentName: string;
  childPath: string[];
  childName: string,
}