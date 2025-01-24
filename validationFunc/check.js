function checkBody(schemaUsername, schemaTelephone) {
    return (req, res, next) => {
        const phoneResult = schemaTelephone.validate({ telephone: req.body.telephone });
        const usernameResult = schemaUsername.validate({ username: req.body.username });

        console.log("Phone validation result:", phoneResult); // Логируем результат валидации телефона
        console.log("Username validation result:", usernameResult); // Логируем результат валидации имени

        if (phoneResult.error) {
            return res.status(400).send(phoneResult.error.details);
        }
        if (usernameResult.error) {
            return res.status(400).send(usernameResult.error.details);
        }

        next();
    };
}

module.exports = { checkBody };
