/** @jsx h */

import { h } from "preact";
import { tw } from "@twind";
import Layout from "../components/Layout.tsx";
import NavBar from "../components/NavBar.tsx";
import Console from "../islands/Console.tsx";

export default function explorer() {
  return (
    <Layout>
      <NavBar active="/explorer" />
      <Console />
    </Layout>
  );
}
