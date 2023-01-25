// Checks if directory exists, if not its created
import { ensureDir } from '../../deps.ts';

export function init() {
  // create .env file in root directory
  const envFilePath = './';
  const envFileContent = `
# Set your environment either 'development' or 'test'
ENVIRONMENT=development
# Please enter your database uri below :
# (for development mode)
DATABASE_URI=" "
# (for test mode)
TEST_DB_URI=" "
`;
  // Check if root exists, then returns a promise which writes the file path, and the file content to the file path.

  ensureDir(envFilePath).then(() => {
    Deno.writeTextFile(envFilePath + '.env', envFileContent);
    // + add .env in gitignore file (if no gitignore file, make one)
    console.log('.env file created');
  });

  const migrationFilePath = './Migrations/log/';
  ensureDir(migrationFilePath);
  console.log('Migrations folder created');

  // create model folder in root directory
  // inside the model folder, create model.ts file with boilerplate code
  const modelFilePath = './models/';
  const modelFileContent = `    
import { Model } from 'https://deno.land/x/denogres/mod.ts'
// user model definition comes here    
    `;

  ensureDir(modelFilePath).then(() => {
    Deno.writeTextFile(modelFilePath + 'model.ts', modelFileContent);
    console.log('model.ts file created under model folder');
  });
}
