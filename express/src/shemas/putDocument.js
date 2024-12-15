import Joi from 'joi';

const state = ['SUBMITTED', 'IN_PROCESS','ADDITIONAL_REVIEW','REVIEW_COMPLETED','INVALID'];

const putDocuments = (putQuery) => {

    try {
        const schema = Joi.object({
            state: Joi.string().valid(...state).required(),
            stateTime: Joi.string().pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/).message('Invalid date format, expected "YYYY-MM-DD HH:mm:ss"').required(),
            documentTotalAmount: Joi.number().required()
        })

        const { error, value } = schema.validate(putQuery);

        if (error) {
            console.error("PUT request validation error", error.details);
            throw new Error("Validation error");
        }

        return value

    } catch (error) {
        console.error("An error occurred:", error);
        throw error; 
    }
};

export default putDocuments;