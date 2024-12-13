import { NextRequest, NextResponse } from "next/server";
import { IDocument } from "../../../../shared/utilities/dataStorage/data.types";

export async function PUT(request:NextRequest) {
    try {
        const { document } = await request.json();
        const {id, state, documentTotalAmount, stateTime} = document as IDocument;

        const expressResponse = await fetch(`http://localhost:4000/documents/${id}`, {
            cache: "no-cache",
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ state, documentTotalAmount, stateTime}), 
        });

        if (!expressResponse.ok) {
            const errorText = await expressResponse.text();
            console.error("Error from Express server:", errorText);
            return NextResponse.json(
                { success: false, message: "Failed to update on Express server" },
                { status: 500 }
            );
        }
        const expressData = await expressResponse.json();
        console.log(expressData.document.stateTime)

        return NextResponse.json(
            { data: expressData.document, success: true, message: "Update successful" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error handling PUT request:", error);
        return NextResponse.json(
            { success: false, message: "Error occurred during the update" },
            { status: 500 }
        );
    }
}
