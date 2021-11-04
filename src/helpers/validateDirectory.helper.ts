import { DirectoryInterface } from "../models/directory.models";

/**
 * Validates a directory by contents.
 * (DEV NOTE: A Yup validator would be a great add if models get complex.)
 * @param directory directory to validate
 */
export const validateDirectory = (directory: DirectoryInterface): void => {
  if (
    directory == null
    || directory.name === undefined
    || directory.parent === undefined
    || directory.contents === undefined
  ) {
    throw Error('Directory is invalid.');
  }
}
