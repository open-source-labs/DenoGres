import { ensureDir } from "https://deno.land/std/fs/ensure_dir.ts";

export function init() {
// create .env file in root directory 
    const envFilePath = "./";
    const envFileContent = `
# See the documentation for more detail: // detail here!
DATABASE_URI=" " // put your database connection URI here!!!
    `
    ensureDir(envFilePath).then(() => {
    Deno.writeTextFile(envFilePath + ".env", envFileContent);
    // + add .env in gitignor file (if no gitignore file, make one)
    console.log('.env file created')
    })

// create moodel folder in root directory
// inside the model folder, create model.ts file with boilerplate code
    const modelFilePath = "./models/";
    const modelFileContent = `    
import { Model } from './src/class/Model.ts'
// user model definition comes here    
    `
    ensureDir(modelFilePath).then(() => {
    Deno.writeTextFile(modelFilePath + "model.ts", modelFileContent);
    console.log('model.ts file created under model folder')
    })
}