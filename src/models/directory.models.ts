export interface DirectoryContents {
  [name: string]: DirectoryInterface;
}

export interface DirectoryInterface {
  name: string;
  parent: DirectoryInterface;
  contents: DirectoryContents;
  addChild: Function;
  removeChild: Function;
  updateParent: Function;
}
