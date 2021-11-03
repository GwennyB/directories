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
    this.validateDirectory(newParent);
    newParent.addChild(this);
    this.parent.removeChild(this.name);
    this.parent = newParent;
  }

  addChild(newChild: DirectoryInterface): void {
    this.validateDirectory(newChild);
    this.contents[newChild.name] = newChild;
  }

  removeChild(childName: string): void {
    delete this.contents[childName];
  }

  private validateDirectory(directory: DirectoryInterface): void {
    if (
      directory == null
      || directory.name === undefined
      || directory.contents === undefined
      || directory.contents === undefined
    ) {
      throw Error('Directory is invalid.');
    }
  }
}
