
import { expect } from "chai";
import { beforeEach, describe, it } from "node:test";
import { shiftArrayCoordinates } from "../src/shared/utilities/shiftArrayCoordinates";


describe('shiftArrayCoordinates functionality', () => {
    const parentArrayLength = 10;
    const targetArrayLength = 3;

    let currentCoordinates = {
        start: 0,
        end: targetArrayLength
    };

    describe('when target array is at the beginning of parent array', () => {
        it('should shiftStep coordinates 2 positions right', () => {
            const shiftStepedCoordinates = shiftArrayCoordinates({ currentCoordinates, parentArrayLength, shiftStep: 2 });
            expect(shiftStepedCoordinates).deep.equal({ start: 2, end: 5 });
        });

        it('should not shiftStep coordinates left by 2 positions (since already at the start)', () => {
            const shiftStepedCoordinates = shiftArrayCoordinates({ currentCoordinates, parentArrayLength, shiftStep: -2 });
            expect(shiftStepedCoordinates).deep.equal({ start: 0, end: 3 });
        });

        it('should not shiftStep coordinates beyond the array length (e.g., shiftStep right by 10)', () => {
            const shiftStepedCoordinates = shiftArrayCoordinates({ currentCoordinates, parentArrayLength, shiftStep: 10 });
            expect(shiftStepedCoordinates).deep.equal({ start: 6, end: 9 });
        });
    });

    describe('when target array is somewhere in the middle of parent array', () => {
        beforeEach(() => {
            currentCoordinates = {
                start: 4,
                end: 4 + targetArrayLength
            };
        });

        it('should shiftStep coordinates 2 positions left', () => {
            const shiftStepedCoordinates = shiftArrayCoordinates({ currentCoordinates, parentArrayLength, shiftStep: -2 });
            expect(shiftStepedCoordinates).deep.equal({ start: 2, end: 5 });
        });

        it('should not shiftStep coordinates left more than the start of the array (e.g., shiftStep by -5)', () => {
            const shiftStepedCoordinates = shiftArrayCoordinates({ currentCoordinates, parentArrayLength, shiftStep: -5 });
            expect(shiftStepedCoordinates).deep.equal({ start: 0, end: 3 });
        });

        it('should shiftStep coordinates right but not beyond parent array length', () => {
            const shiftStepedCoordinates = shiftArrayCoordinates({ currentCoordinates, parentArrayLength, shiftStep: 5 });
            expect(shiftStepedCoordinates).deep.equal({ start: 6, end: 9 });
        });
    });
});
