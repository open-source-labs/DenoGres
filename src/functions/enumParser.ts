export const enumParser = (): Record<string, unknown[]> => {
    const modelText = Deno.readTextFileSync('./models/model.ts');

    const enumText = modelText.replaceAll(/export interface \w+ {[\n +\w+: \w+]+}/g, '').
            replaceAll("import { Model } from 'https://deno.land/x/denogres/mod.ts'\n", ''). // initial wording
            // replaceAll("import { Model } from 'https://deno.land/x/denogresdev/mod.ts'\n", ''). // initial wording
            replaceAll(/\/\/ user model definition comes here\n+/g, '').
            replaceAll(/\n */g, '').
            matchAll(/export enum \w+ {[\n *\w+\,*]+}/g) // remove enums for now, will need different logic to parse these

    const enumModel = [...enumText];
    const enumObject: Record<string, unknown[]> = {};

    enumModel.forEach(el => {
        let str = el[0];
        str = str.replace(/ *export enum */, '');
        let enumName = str.split(' ')[0].replaceAll(' ', '');

        const enumValues = str.replace(enumName, '').replaceAll(/ *\{ *| *\} */g, '').split(',')

        enumName = enumName.toLowerCase();
        if(enumValues[enumValues.length - 1] === '') enumValues.pop();

        enumObject[enumName] = enumValues;
    })

    return enumObject
}