/**
 * * Create a log, that is similar to git log
 * * Everytime dbSync is invoked, we want the following to happen:
 * * (1) - Make a copy of the current model.ts file before sync is invoked and save it in Migrations folder.
 * * (2) - Create a unique id name for the model.ts that was saved date with 24 time marker
 * * (3) - Save the unique id and user comment to a log file
 */
// import { resolve } from "https://deno.land/std@0.141.0/path/win32.ts";
import { dateFolder, today } from "./checkDbPull.ts";
import { dateFolderSync, todaySync } from "./checkDbSync.ts";
import { readLines } from "https://deno.land/std@0.141.0/io/buffer.ts";

export async function promptString(question: string) {
  console.log(question);
  for await (const line of readLines(Deno.stdin)) {
    return line;
  }
}

// Invoked with either 'db-sync' or 'db-pull', prompts user for a comment and appends
// message to migration_log.txt in user's 'Migrations' directory (added by 'denogres --init')
export async function uniqueLog(method: string): Promise<void> {
  const input = await promptString("What is your comment? ");
  if (method === "db-sync") {
    const dbSyncInfo =
      `This model was created with ${method} and was created on ${todaySync}. It's currently stored in the directory './Migrations/syncedModel_${dateFolderSync}'\n ${input}\n`;
    Deno.writeTextFileSync(
      "./Migrations/log/migration_log.txt",
      `${dbSyncInfo}\n`,
      { append: true },
    ); //* adds onto the text file instead of creating it again.
  } else {
    const dbPullInfo =
      `This model was created with ${method} and was created on ${today}. It's currently stored in the directory './Migrations/modelBuild_${dateFolder}'\n ${input}\n`;
    !`This model was created with ${method} and was created on ${today}. It's currently stored in the directory './Migrations/modelBuild_${dateFolder}'\n ${input}\n`;
    Deno.writeTextFileSync(
      "./Migrations/log/migration_log.txt",
      `${dbPullInfo}\n`,
      { append: true },
    ); //* adds onto the text file instead of creating it again.
  }
  return;
}