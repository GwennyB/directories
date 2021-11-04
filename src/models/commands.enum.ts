/**
 * Establishes a set of supported directory manipulation commands by name and syntax.
 * @member CREATE used to create a new directory
 * @member DELETE used to delete an existing directory
 * @member LIST used to on-screen print the directory structure
 * @member MOVE used to move an existing directory to a new path
 * @member PATH used to point to a local file location where a commands list is stored
 * @member EXIT used to exit the application
 */
export enum Commands {
  CREATE = "CREATE",
  DELETE = "DELETE",
  LIST = "LIST",
  MOVE = "MOVE",
  PATH = "PATH",
  EXIT = ""
}
