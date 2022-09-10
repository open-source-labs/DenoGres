/** 
 * * The function needs to do the following:
 * * (1): Create a new text file and a log.ts file, the text file will indicate any changes that were made 
 * * with its contents as the comment the user input. The ts file will contain the model with its old changes before modification took place.
 * * (2): Have a before and after log, has file before changes and after changes. 
 * * (3): Document the differences between the old and the new. 
 */


export const denoLog = () => {
    //* Creates a date with timestamp in ms
    const currentDate: string = new Date().toISOString()
    .replace(/[-:.Z]/g, '')     // replace T with a space
    .replace(/[T]/g, '_');
    console.log(currentDate);
    //* Access the model.ts before sync is ran.
    // const beforeSync = Deno.readTextFile('../models/model.ts');

    // const writeChanges = () => {
    //     Deno.writeTextFile(`./Migrations/${}`)
    // }

    //* Append to the log with the typed comment
    const userComment = Deno.readTextFile(
        
    )
}
