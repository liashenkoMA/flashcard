import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/kana",
  "/kana/hiragana?type=repeat",
  "/kana/hiragana",
  "/kana/katakana?type=repeat",
  "/kana/katakana",
  "/kanji",
  "/kanji/add",
  "/kanji/repeat",
  "/tables",
  "/words",
  "/words/add",
  "/words/repeat",
  "/tables",
  "/tables/table-words",
  "/tables/table-kanji",
  "/tables/table-kana",
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
