/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "next/server" {
  export type NextRequest = any;
  export const NextRequest: any;
  export type NextResponse = any;
  export const NextResponse: any;
}

declare module "next/server.js" {
  export { NextRequest, NextResponse } from "next/server";
}

declare module "next/navigation" {
  export const useRouter: any;
  export const usePathname: any;
  export const useSearchParams: any;
  export const notFound: any;
  export const redirect: any;
}

declare module "next/navigation.js" {
  export { useRouter, usePathname, useSearchParams, notFound, redirect } from "next/navigation";
}

declare module "next/link" {
  const Link: any;
  export default Link;
}

declare module "next/link.js" {
  import Link from "next/link";
  export default Link;
}

declare module "next/image" {
  const Image: any;
  export default Image;
}

declare module "next/image.js" {
  import Image from "next/image";
  export default Image;
}
