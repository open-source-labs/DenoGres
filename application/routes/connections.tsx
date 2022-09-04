/** @jsx h */

import { h } from "preact";
import { tw } from "@twind";
import Layout from "../components/Layout.tsx";
import Connections from "../islands/Connections.tsx";

export default function connections() {
  return (
    <Layout>
      <Connections />
    </Layout>
  );
}
