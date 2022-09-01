/** @jsx h */

import { h } from "preact";
import { tw } from "@twind";
import Layout from "../components/Layout.tsx";
import Console from "../islands/Console.tsx";

export default function explorer() {
  return (
    <Layout>
      <Console />
    </Layout>
  );
}
