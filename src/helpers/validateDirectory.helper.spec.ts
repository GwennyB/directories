import { DirectoryInterface } from '../models/directory.models';
import { validateDirectory } from './validateDirectory.helper';

describe("validateDirectory()", () => {
  let directory: any;
  beforeEach(() => {
    directory = {
      name: 'dir_name',
      parent: {},
      contents: {}
    };
  });

  const fxn = () => validateDirectory(directory);
  const error = Error('Directory is invalid.');

  it("does not throw if directory is valid", () => {
    expect(fxn).not.toThrow();
  });

  it("throws if directory is null", () => {
    directory = null;
    expect(fxn).toThrow(error);
  });

  it("throws if directory name is undefined", () => {
    delete directory.name;
    expect(fxn).toThrow(error);
  });

  it("throws if directory parent is undefined", () => {
    delete directory.parent;
    expect(fxn).toThrow(error);
  });

  it("throws if directory contents is undefined", () => {
    delete directory.contents;
    expect(fxn).toThrow(error);
  });
});