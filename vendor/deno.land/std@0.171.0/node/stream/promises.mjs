// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
// Copyright Joyent and Node contributors. All rights reserved. MIT license.

import stream from "../_stream.mjs";

const { finished, pipeline } = stream.promises;

export default {
  finished,
  pipeline,
};
export { finished, pipeline };
