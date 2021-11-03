export interface DirectoryContents {
  [name: string]: DirectoryInterface;
}

export interface DirectoryInterface {
  name: string;
  parent: DirectoryInterface;
  contents: DirectoryContents;
  addChild(newChild: DirectoryInterface): void;
  removeChild(childName: string): void;
  updateParent(newParent: DirectoryInterface): void;
}
