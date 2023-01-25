// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
// Copyright Joyent and Node contributors. All rights reserved. MIT license.

import { notImplemented } from "./_utils.ts";

export function create() {
  notImplemented("domain.create");
}
export class Domain {
  constructor() {
    notImplemented("domain.Domain.prototype.constructor");
  }
}
export default {
  create,
  Domain,
};
