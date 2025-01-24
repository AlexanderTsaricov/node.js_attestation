const joi = require("joi");
const nameShema = joi.object({
    username: joi.string().min(4).pattern(/^\S+$/, "no spaces").required(),
});

module.exports = nameShema;
