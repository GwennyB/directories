import { validateDirectory } from "../helpers/validateDirectory.helper";
import {
  DirectoryInterface,
  DirectoryContents
} from "../models/directory.models";

/**
 * Implementation of DirectoryInterface (see ref).
 * Specify directory name, parent directory reference, and
 * child directories (optional) to create a directory.
 */
export class Directory implements DirectoryInterface {
  constructor(
    public readonly name: string,
    public parent: DirectoryInterface,
    public contents: DirectoryContents = {},
  ) { }

  /**
   * Updates this directory's 'parent' reference.
   * @param newParent intended new parent directory
   */
  updateParent(newParent: DirectoryInterface): void {
    validateDirectory(newParent);
    newParent.addChild(this);
    this.parent.removeChild(this.name);
    this.parent = newParent;
  }

  /**
   * Adds a child directory to this directory's 'contents'.
   * @param newChild intended new child to add to 'contents'
   */
  addChild(newChild: DirectoryInterface): void {
    validateDirectory(newChild);
    this.contents[newChild.name] = newChild;
  }

  /**
   * Removes a child reference from 'contents' if it exists.
   * @param childName name of child to remove from 'contents'
   */
  removeChild(childName: string): void {
    delete this.contents[childName];
  }
}
