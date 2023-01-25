// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
// Copyright Joyent, Inc. and Node.js contributors. All rights reserved. MIT license.
import { getBinding } from "../../internal_binding/mod.ts";
import type { BindingName } from "../../internal_binding/mod.ts";

export function internalBinding(name: BindingName) {
  return getBinding(name);
}

// TODO(kt3k): export actual primordials
export const primordials = {};

export default {
  internalBinding,
  primordials,
};
