import {
  DirectoryInterface,
  DirectoryContents
} from "../models/directory.models";


export class Directory implements DirectoryInterface {
  constructor(
    public readonly name: string,
    public parent: DirectoryInterface,
    public contents: DirectoryContents = {},
  ) { }

  updateParent(newParent: DirectoryInterface): void {
    const isValid = this.validateDirectory(newParent);
    // TODO: implement
  }

  addChild(newChild: DirectoryInterface): void {
    const isValid = this.validateDirectory(newChild);
    // TODO: implement
  }

  removeChild(childName: string): void {
    // TODO: implement
  }

  private validateDirectory(directory: DirectoryInterface): boolean {
    if (
      directory == null
      || directory.name === undefined
      || directory.contents === undefined
      || directory.contents === undefined
    ) {
      return false;
    }
    return true;
  }
}
