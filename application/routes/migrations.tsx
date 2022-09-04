/** @jsx h */

import { h } from "preact";
import { tw } from "@twind";
import Layout from "../components/Layout.tsx";
import Migrations from "../islands/Migrations.tsx";

export default function migrations() {
  return (
    <Layout>
      <Migrations />
    </Layout>
  );
}
