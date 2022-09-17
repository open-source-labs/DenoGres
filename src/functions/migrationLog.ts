/** 
 * * The function will do the following:
 * * (1): Create a directory with a timestamp.
 * * This directory will hold 3 files: before.ts, after.ts, diff.txt
 * * (2): before.ts will be created when db-pull is initiated.
 * * (3): After.ts will be created after db-sync is ran.
 */

// import { wasFired } from "./dbPull.ts"
import { resolve } from 'https://deno.land/std/path/mod.ts';
import { isPathSeparator } from 'https://deno.land/std@0.141.0/path/_util.ts';
import "https://deno.land/x/dotenv/load.ts";

/** Helper Functions
 ** (1): Check when db-pull fires off, goes and creates the beforeModel.ts file by reading model.ts after db-pull is invoked.
 ** (2): Checks when db-sync fires off, goes and creates the afterModel.ts file by reading the model.ts after sync is invoked.
 ** (3): Checks if there is a difference between files, if so, denoLog will run and create file
 ** The text file should be very detailed, with date of changes and time.
 */

// * Reads the model.ts file and stores it in the migrations folder
// const modelBefore = Deno.readTextFileSync(resolve('./models/model.ts'));
// const beforeFile = Deno.writeFileSync(resolve('./Migrations'));


//* Creating timestamp for folders
const currentDate: string = new Date().toISOString()
.replace(/[-:.Z]/g, '')     // replace T with a space
.replace(/[T]/g, '_');
console.log(currentDate);

const permDate = currentDate;
const myText = "This is a test."





//* Creates the directory and files before the sync occurs
Deno.mkdirSync(`./Migrations/${permDate}`)
Deno.writeTextFileSync(`./Migrations/${permDate}/before.ts`, modelBefore);

//* Creates the files and directories after the sync occurs
Deno.writeTextFileSync(`./Migrations/${permDate}/after.ts`, modelBefore);
Deno.writeTextFileSync(`./Migrations/${permDate}/diff.txt`, myText);


// await Deno.mkdir(`./Migrations/${permDate}/after.ts`)
//* Populate directory with before and after
export const denoLog = () => {
   

 }


