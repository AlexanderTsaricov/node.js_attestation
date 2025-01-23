const joi = require("joi");
const nameShema = joi.object({
    username: joi.string().required(),
});

module.exports = { nameShema };
