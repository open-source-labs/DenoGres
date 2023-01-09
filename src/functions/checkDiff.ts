/**
 * ! This File is a WIP
 */

import { FilesManager } from 'npm:turbodepot-node';

interface Comparison {
  before: File;
  after: File;
}

export function checkDiff(before: string, after: string): void {
  //* Need to grab the modelbuild folder and the current syncedBuild ts files
  const beforeModel = before, afterModel = after;

  //* compare the changes in both
  const filesManager = new FilesManager();
  filesManager.mirrorDirectory(
    './Migrations/modelBuild_20220915_183728203/build_model.ts',
    './Migrations/syncedModel_20220915_184717260/synced_build.ts',
  );
  //* output the changes into a file.
  //* this file will be called modelchanges.txt
}
//* This function will use built in shell commands to show the user the differences and
//* write the differences to a file if they desire.
export function diffShell(fileOne: File, fileTwo: File): void {
  // {
  //     cmd: [],
  //     cwd: './Migrations'
  // }
}
