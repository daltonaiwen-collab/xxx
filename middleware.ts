import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function middleware(request: NextRequest) {
  // 只针对 /api/posts 路径下的请求
  if (request.nextUrl.pathname.startsWith('/api/posts')) {
    const authorization = request.headers.get('Authorization');
    let access_token = null;

    // 支持 Bearer Token
    if (authorization && authorization.startsWith('Bearer ')) {
      access_token = authorization.replace('Bearer ', '');
    } else {
      // 通常 Supabase 客户端 SDK 存 token 在 cookie 里 'sb-access-token'
      access_token = request.cookies.get('sb-access-token')?.value;
    }

    if (!access_token) {
      return NextResponse.json(
        { error: '未授权：缺少访问令牌' },
        { status: 401 }
      );
    }

    // 校验 token
    const { data, error } = await supabase.auth.getUser(access_token);

    if (error || !data?.user) {
      return NextResponse.json(
        { error: '未授权：访问令牌无效' },
        { status: 401 }
      );
    }
    // 有效用户则允许通过
    return NextResponse.next();
  }

  // 不是 /api/posts 下的请求，直接放行
  return NextResponse.next();
}