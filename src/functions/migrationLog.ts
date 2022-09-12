/** 
 * * The function needs to do the following:
 * * (1): Create a new text file and a log.ts file, the text file will indicate any changes that were made 
 * * with its contents as the comment the user input. 
 * * The ts file will contain the model with its old changes before modification took place.
 * * (2): Have a before and after log, has file before changes and after changes. 
 * * (3): Document the differences between the old and the new. 
 */
import { resolve } from 'https://deno.land/std/path/mod.ts';
import { isPathSeparator } from 'https://deno.land/std@0.141.0/path/_util.ts';


/** Helper Functions
 ** (1): Checks if there is a difference between files, if so, denoLog will run and create file
 */

// * Reads the model.ts file and stores it in the migrations folder
const modelBefore = Deno.readTextFileSync(resolve('./models/model.ts'));
// const beforeFile = Deno.writeFileSync(resolve('./Migrations');

const currentDate: string = new Date().toISOString()
.replace(/[-:.Z]/g, '')     // replace T with a space
.replace(/[T]/g, '_');
console.log(currentDate);

const permDate = currentDate;


//! Stuck HERE: Need to create a before and after directory once time stamp is created.
//* Create before directory
await Deno.mkdir(`./Migrations/${permDate}`)
// await Deno.mkdir(`./Migrations/${permDate}`)

//* Populate directory with before and after
export const denoLog = () => {
    //* Creates a date with timestamp in ms
    const currentDate: string = new Date().toISOString()
    .replace(/[-:.Z]/g, '')     // replace T with a space
    .replace(/[T]/g, '_');
    // console.log(currentDate);

    //* Access the model.ts before sync is ran.
    const modelBefore = Deno.readTextFileSync(resolve('./models/model.ts'));

    //* Make a new 'before' directory with beforeModel
    const writeChanges = () => {
        Deno.writeTextFile(`./Migrations/test.ts`, modelBefore)
    }
    writeChanges();
    //* Append to the log with the typed comment



 }


