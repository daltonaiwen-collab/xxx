import { NextResponse } from 'next/server';

/**
 * Response type for the hello API endpoint
 */
interface HelloResponse {
  message: string;
}

/**
 * Error response type
 */
interface ErrorResponse {
  error: string;
}

/**
 * API Route: GET /api/hello
 * 
 * Returns a simple greeting message.
 * 
 * @returns {Promise<NextResponse<HelloResponse | ErrorResponse>>} JSON response with greeting message
 */
export async function GET(): Promise<NextResponse<HelloResponse | ErrorResponse>> {
  try {
    const data: HelloResponse = { message: 'Hello from our API!' };
    
    const response = NextResponse.json<HelloResponse>(
      data,
      { status: 200 }
    );

    // Set response headers
    response.headers.set('Content-Type', 'application/json');
    response.headers.set('Cache-Control', 'no-store, max-age=0');

    return response;
  } catch (error) {
    // Error handling
    console.error('Error in /api/hello:', error);
    
    const errorData: ErrorResponse = { error: 'Internal Server Error' };
    return NextResponse.json<ErrorResponse>(
      errorData,
      { status: 500 }
    );
  }
}