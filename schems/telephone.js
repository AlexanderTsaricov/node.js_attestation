const joi = require("joi");
const telephoneSchema = joi.object({
    telephone: joi.string().min(11).max(15).required(),
});

module.exports = { telephoneSchema };
