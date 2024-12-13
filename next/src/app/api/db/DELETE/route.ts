import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
    try {
      const {searchParams} = new URL(request.url); 
      const id = searchParams.get('id');
  
      const expressResponse = await fetch(`${process.env.SERVER_API_URL}${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!expressResponse.ok) {
        throw new Error('Failed to delete document in Express API');
      }
  
      return NextResponse.json(
        { success: true, message: 'Document deleted successfully' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error handling DELETE request:', error);
      return NextResponse.json(
        { success: false, message: 'Error occurred during the deletion' },
        { status: 500 }
      );
    }
  }
  