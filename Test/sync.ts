import { assert, assertEquals } from './deps.ts';

Deno.test('Sync Functions', () => {
    const x = 1 + 2;
    assertEquals(x, 3)
})