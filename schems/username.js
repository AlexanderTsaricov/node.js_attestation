const joi = require("joi");
const nameShema = joi.object({
    username: joi.string().min(4).required(),
});

module.exports = nameShema;
