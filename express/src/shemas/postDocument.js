import Joi from 'joi';

const state = ['SUBMITTED', 'IN_PROCESS','ADDITIONAL_REVIEW','REVIEW_COMPLETED','INVALID'];

const postDocuments = (postQuery) => {

    try {
        const schema = Joi.object({
            id: Joi.number().integer().required(),
            state: Joi.string().valid(...state).required(),
            stateTime: Joi.string().pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/).message('Invalid date format, expected "YYYY-MM-DD HH:mm:ss"').required(),
            documentNumber: Joi.number().required(),
            documentName: Joi.string().pattern(/^Doc\s+[A-Za-z0-9-_]+$/).required(),
            documentDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/).message('Invalid date format, expected "YYYY-MM-DD HH:mm:ss"').required(),
            documentTotalAmount: Joi.number().required()
        })

        const { error, value } = schema.validate(postQuery);

        if (error) {
            console.error("POST request validation error", error.details);
            throw new Error("Validation error");
        }

        return value

    } catch (error) {
        console.error("An error occurred:", error);
        throw error; 
    }
};

export default postDocuments;






documentTotalAmount: Joi.number().integer().required()