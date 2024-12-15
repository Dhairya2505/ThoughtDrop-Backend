import { Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { prisma } from "../index.js";

interface CustomJwtPayload extends JwtPayload {
    username: string
    userId: string
  }

export const getPosts = async (req: Request, res: Response) => {
    const bearerToken = req.headers.token
    const SECRET_KEY = process.env.JWT_SECRET_KEY;

    if(bearerToken != '' && typeof(bearerToken) == 'string'){
        const token = bearerToken.split(' ')[1]
        if(SECRET_KEY){
            
            try {
                const payload = jwt.verify(token,SECRET_KEY) as CustomJwtPayload
                const username = payload.username;
                const user = await prisma.user.findFirst({
                    where: {
                        username: username
                    },
                    include: {
                        posts: true,
                        reply: true
                    }
                })
                if(user){
                    res.status(200).json({
                        posts: user.posts,
                    })
                } else {
                    res.status(401).json({
                        msg: `Unauthorized`
                    })
                }

            } catch (e) {
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