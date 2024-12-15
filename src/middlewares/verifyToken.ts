import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'

interface CustomJwtPayload extends JwtPayload {
    username: string,
    userId: string
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const SECRET_KEY = process.env.JWT_SECRET_KEY;
    const bearerToken = req.headers.token;
    if(bearerToken != '' && typeof(bearerToken) == 'string'){
        const token = bearerToken.split(' ')[1]
        if (SECRET_KEY){
            try {
                const result = jwt.verify(token, SECRET_KEY) as CustomJwtPayload
                if(result){
                    req.headers.username = result.username
                    req.headers.userId = result.userId 
                    next();
                }
            } catch (error) {
                res.status(401).json({
                    msg: `Unauthorized`
                })
            }
        } else {
            res.status(500).json({
                msg: `Internal server error`
            })
        }
    } else {
        res.status(401).json({
            msg: `Unauthorized`
        })
    }

}