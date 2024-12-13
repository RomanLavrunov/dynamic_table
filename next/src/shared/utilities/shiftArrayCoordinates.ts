export interface ShiftedArrayCoordinatesParams {
    currentCoordinates: {start: number, end: number},
    parentArrayLength: number,
    shiftStep: number,
}

export const shiftArrayCoordinates = ( { currentCoordinates, parentArrayLength, shiftStep}: ShiftedArrayCoordinatesParams) => {
    let start = currentCoordinates.start
    let end = currentCoordinates.end
    const targetArrayLength = end - start;

    start = start + shiftStep;
    end = end + shiftStep;

    if (end > parentArrayLength) {
        end = parentArrayLength - 1;
        start = parentArrayLength - targetArrayLength - 1;
    }
    if (start < 0) {
        start = 0;
        end = targetArrayLength;
    }

    return { start, end };
}