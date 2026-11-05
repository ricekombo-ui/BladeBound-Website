import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isolatedBetaUrl } from "@/lib/beta/config";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/beta") || request.nextUrl.pathname.startsWith("/api/beta/")) {
    const url = process.env.NEXT_PUBLIC_BETA_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_BETA_SUPABASE_ANON_KEY;
    if (!url || !key || !isolatedBetaUrl(url, process.env.NEXT_PUBLIC_SUPABASE_URL)) return new NextResponse("Beta is unavailable", { status: 503, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
    let response = NextResponse.next({ request });
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    response.headers.set("Cache-Control", "private, no-store");
    const beta = createServerClient(url, key, { cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: values => {
        values.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
        response.headers.set("Cache-Control", "private, no-store");
        values.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    } });
    const { data: { user } } = await beta.auth.getUser();
    if (request.nextUrl.pathname === "/beta/login") return response;
    const { data: member } = user ? await beta.from("beta_members").select("user_id").eq("user_id", user.id).maybeSingle() : { data: null };
    if (!member) {
      if (request.nextUrl.pathname.startsWith("/api/")) return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
      const login = request.nextUrl.clone(); login.pathname = "/beta/login"; login.search = "";
      const redirect = NextResponse.redirect(login); redirect.headers.set("X-Robots-Tag", "noindex, nofollow"); redirect.headers.set("Cache-Control", "no-store"); return redirect;
    }
    return response;
  }
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protect all /amc routes except login and the token-authenticated daily check-in link
  const isPublicAmcPath = pathname === "/amc/login" || pathname.startsWith("/amc/daily/");
  if (pathname.startsWith("/amc") && !isPublicAmcPath) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/amc/login";
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect logged-in users away from login page
  if (pathname === "/amc/login" && user) {
    const dashUrl = request.nextUrl.clone();
    dashUrl.pathname = "/amc/dashboard";
    return NextResponse.redirect(dashUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/amc/:path*", "/beta/:path*", "/api/beta/:path*"],
};
