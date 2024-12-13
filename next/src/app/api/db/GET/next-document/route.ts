import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const expressResponse = await fetch(`${process.env.SERVER_API_URL_GET_NEXT_ID}`, { cache: "no-cache" });
        
        if (!expressResponse.ok) {
            console.error("Failed to fetch next ID");
            return NextResponse.json({
                success: false,
                message: 'Failed to fetch next ID from DB',
            }, {
                status: expressResponse.status,
            });
        }

        const data = await expressResponse.json();
       
        return NextResponse.json(data, {
            status: 200,
        });

    } catch (error) {
        console.log("Error fetching ID:", error);
        return NextResponse.json({
            success: false,
            message: "Error occurred during the request for next ID",
        }, {
            status: 500,
        });
    }
}
