import { resolve } from 'https://deno.land/std/path/mod.ts';
import { permDate } from './checkDbPull.ts';

export function checkDbSync(): void {
    const modelAfter = Deno.readTextFileSync(resolve('./models/model.ts'));
    console.log("the checkDbSync function worked!", modelAfter);
    //* Creating files and directory in Migrations 
    Deno.writeTextFileSync(`./Migrations/${permDate}/after.ts`, modelAfter);
    Deno.writeTextFileSync(`./Migrations/${permDate}/diff.txt`, 'This is a test');
}

