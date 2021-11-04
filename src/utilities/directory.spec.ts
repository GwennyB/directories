import { DirectoryInterface } from '../models/directory.models';
import { Directory } from './directory';

describe("Directory Class", () => {
  let directory: DirectoryInterface;
  let child: DirectoryInterface;
  let parent: DirectoryInterface;

  beforeEach(() => {
    const grandparent = new Directory(
      "grandparent",
      {} as DirectoryInterface
    );
    parent = new Directory(
      "parent_dir",
      grandparent,
    );
    child = new Directory(
      "child_dir",
      {} as DirectoryInterface,
    );
    directory = new Directory(
      "dir",
      parent,
      {
        [child.name]: child,
      },
    );
  });

  describe("updateParent()", () => {
    let newParent: DirectoryInterface;
    beforeEach(() => {
      newParent = new Directory("new_parent", parent as DirectoryInterface);
    });

    it("replaces parent with a new valid parent", () => {
      directory.updateParent(newParent);
      expect(directory.parent).toBe(newParent);
    });

    it("does not replace parent with invalid parent", () => {
      delete newParent.name;
      expect(() => directory.updateParent(newParent)).toThrow();
      expect(directory.parent).not.toEqual(newParent);
    });
  });

  describe("addChild()", () => {
    let newChild: DirectoryInterface;
    beforeEach(() => {
      newChild = new Directory("new_child", parent as DirectoryInterface);
    });

    it("adds a valid child to contents", () => {
      directory.addChild(newChild);
      const childEntry = directory.contents[newChild.name];
      expect(childEntry).not.toBeNull();
      expect(childEntry).toBe(newChild);
    });

    it("does not add an invalid child to contents", () => {
      delete newChild.name;
      expect(() => directory.addChild(newChild)).toThrow();
      const childEntry = directory.contents[newChild.name];
      expect(childEntry).toBeUndefined();
    });
  });

  describe("removeChild()", () => {
    it("removes a child if present in contents", () => {
      expect(directory.contents[child.name]).toEqual(child);
      directory.removeChild(child.name);
      expect(directory.contents[child.name]).toBeUndefined();
    });

    it("resolves without error if child not in contents", () => {
      // TODO: test here
    });
  });
});
