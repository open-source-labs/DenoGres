import { ensureDir } from "../../deps.ts";

export function init() {
// create .env file in root directory 
    const envFilePath = "./";
    const envFileContent = `
# Set your environment either 'development' or 'test'
ENVIRONMENT=development
# Please enter your database uri below :
# (for development mode)
DATABASE_URI=" "
# (for test mode)
TEST_DB_URI=" "
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
import { Model } from 'https://deno.land/x/denogres/mod.ts'
// user model definition comes here    
    `
    ensureDir(modelFilePath).then(() => {
    Deno.writeTextFile(modelFilePath + "model.ts", modelFileContent);
    console.log('model.ts file created under model folder')
    })
}