import React from 'react';
import { useState, useRef, useEffect } from 'react';

type TableNodeRowProps = {
  name: string;
  type: string;
  constraint: string;
  pk: string;
  fk: string;
}

export default function TableNodeRow({ name, type, constraint, pk, fk }: TableNodeRowProps) {
  return (
    <>
      <td>{name}</td>
      <td>{type}</td>
      <td>{constraint}</td>
      <td>{pk}</td>
      <td>{fk}</td>
    </>
  );
}