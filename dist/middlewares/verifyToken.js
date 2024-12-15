import jwt from 'jsonwebtoken';
export const verifyToken = (req, res, next) => {
    const SECRET_KEY = process.env.JWT_SECRET_KEY;
    const bearerToken = req.headers.token;
    if (bearerToken != '' && typeof (bearerToken) == 'string') {
        const token = bearerToken.split(' ')[1];
        if (SECRET_KEY) {
            try {
                const result = jwt.verify(token, SECRET_KEY);
                if (result) {
                    req.headers.username = result.username;
                    req.headers.userId = result.userId;
                    next();
                }
            }
            catch (error) {
                res.status(401).json({
                    msg: `Unauthorized`
                });
            }
        }
        else {
            res.status(500).json({
                msg: `Internal server error`
            });
        }
    }
    else {
        res.status(401).json({
            msg: `Unauthorized`
        });
    }
};
