import { NextResponse } from 'next/server';

export default async function Home() {
  return NextResponse.json("Welcome to Nonton API");
}