const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.auth = (req, res, next) => {
    try {
        // ...
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

        if (!token || token === undefined) {
            return res.status(401).json({
                success: false,
                message: 'Token Missing',
            });
        }

        // Verify the token
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);
            req.user = payload;
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid",
            });
        }

        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Something Went wrong while verifying token"
        });
    }
};
