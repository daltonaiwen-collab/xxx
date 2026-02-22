import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

/**
 * API Route: GET /api/posts
 * 
 * Returns all posts, sorted by created_at descending.
 */
export async function GET() {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { posts: data ?? [] },
            { status: 200 }
        );
    } catch (e) {
        console.error('Error in /api/posts:', e);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

/**
 * API Route: POST /api/posts
 * 
 * Returns all posts, sorted by created_at descending.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, content } = body;

        if (!title || !content) {
            return NextResponse.json(
                { error: 'Both title and content are required.' },
                { status: 400 }
            );
        }

        const { data, error } = await supabase
            .from('posts')
            .insert([{ title, content }])
            .select()
            .single();

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { post: data },
            { status: 201 }
        );
    } catch (e) {
        console.error('Error in POST /api/posts:', e);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

/**
 * API Route: PATCH /api/posts
 * 
 * Updates a post by id.
 */
export async function PATCH(request: Request) {
    try {
        // 从URL搜索参数中获取id
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Missing id parameter in URL' },
                { status: 400 }
            );
        }

        // 从请求体中获取title和content
        const body = await request.json();
        const { title, content } = body;

        if (!title || !content) {
            return NextResponse.json(
                { error: 'Both title and content are required.' },
                { status: 400 }
            );
        }

        // 使用Supabase更新posts表中对应id的记录
        const { data, error } = await supabase
            .from('posts')
            .update({ title, content })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { post: data },
            { status: 200 }
        );
    } catch (e) {
        console.error('Error in PATCH /api/posts:', e);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

/**
 * API Route: DELETE /api/posts
 * 
 * Deletes a post by id.
 */
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Missing id parameter in URL' },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return new NextResponse(null, { status: 204 });
    } catch (e) {
        console.error('Error in DELETE /api/posts:', e);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}