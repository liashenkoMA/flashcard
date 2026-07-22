import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/contacts",
  "/price",

  // Kana
  "/kana/hiragana",
  "/kana/hiragana?type=repeat",
  "/kana/katakana",
  "/kana/katakana?type=repeat",

  // Kanji
  "/kanji/repeat",
  "/kanji/add",

  // Japanese words
  "/words/repeat",
  "/words/add",

  // Japanese tables
  "/tables/table-kana",
  "/tables/table-kanji",
  "/tables/table-words",

  // Hangeul
  "/hangeul",
  "/hangeul?type=repeat",

  // Korean words
  "/kr-words/repeat",
  "/kr-words/add",

  // Korean tables
  "/kr-tables/table-hangeul",
  "/kr-tables/table-words",

  // Hanzi
  "/hanzi/repeat",
  "/hanzi/add",

  // Chinese words
  "/cn-words/repeat",
  "/cn-words/add",

  // Chinese tables
  "/cn-tables/table-hanzi",
  "/cn-tables/table-words",
];

export default async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  const cookie = (await cookies()).get("session_flashcard");

  if (isProtectedRoute && !cookie) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
