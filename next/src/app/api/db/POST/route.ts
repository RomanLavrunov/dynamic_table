import { NextRequest, NextResponse } from "next/server";
import { IDocument } from "../../../../shared/utilities/dataProcessor/data.types";

export async function POST(request:NextRequest) {
    try {
        const {postDocument} = await request.json();

        const expressResponse = await fetch(`${process.env.SERVER_API_URL}`, {
            cache: "no-cache",
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({postDocument}), 
        });

        if (!expressResponse.ok) {
            const errorText = await expressResponse.text();
            console.error("Error from Express server:", errorText);
            return NextResponse.json(
                { success: false, message: "Failed to update on Express server" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Document added successfully"},
            { status: 200 }
        );

    } catch (error) {
        console.error("Error handling POST request:", error);
        return NextResponse.json(
            { success: false, message: "Error occurred during the update" },
            { status: 500 }
        );
    }
}
