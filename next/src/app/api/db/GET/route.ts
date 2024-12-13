import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const dataUrl = searchParams
        ? `http://localhost:4000/documents?${searchParams}`
        : 'http://localhost:4000/documents';

    try {
        const response = await fetch(dataUrl, { cache: 'no-cache' });
        if (!response.ok) {
            console.error(`Failed to fetch documents: ${response.status} ${response.statusText}`);
            return NextResponse.json({
                success: false,
                message: `Failed to fetch data: ${response.statusText}`,
            }, { status: response.status });
        }

        const data = await response.json();
        const {documents, dataCount} = data;
        if (documents && documents.length) {
            return NextResponse.json({ data: documents, documentsAmount: dataCount}, { status: 200 });
        }

    } catch (error) {
        console.error("Error fetching data from server:", error);
        return NextResponse.json({
            success: false,
            message: "Server error. Please try again later.",
        }, { status: 500 });
    }
}




