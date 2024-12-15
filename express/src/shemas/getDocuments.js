import Joi from 'joi';

const headers = ["state", "id", "documentName", "documentDate", "stateTime", "documentNumber", "documentTotalAmount"];

const escapeHtml = (str) => {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
};

const getDocuments = (doucmentsLength, getQuery) => {

    try {
        const schema = Joi.object({
            tableHeader: Joi.string().valid(...headers).required(),
            isAscending: Joi.boolean().required(),
            offset: Joi.number().min(0).max(doucmentsLength).required(),
            searchText: Joi.string().pattern(/^[a-zA-Z0-9\s]*$/).allow('').required()
        })

        const { error, value } = schema.validate(getQuery);

        
        if (error) {
            console.error("GET request validation error", error.details);
            throw new Error("Validation error");
        }

        const safeSearchText = escapeHtml(value.searchText);
        return {...value, searchText:safeSearchText}; 

    } catch (error) {
        console.error("An error occurred:", error);
        throw error; 
    }
};

export default getDocuments;
