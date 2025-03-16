"use server";

import { cookies } from "next/headers";

export async function deleteAuthCookie() {
  (await cookies()).delete("_et");
}

export async function setAuthCookie(token: string) {
  (await cookies()).set("_et", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24
  });
}

export async function getAuthCookie() {
  return (await cookies()).get("_et");
}
