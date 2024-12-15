import { Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { nanoid } from "nanoid";
import { prisma } from "../index.js";

interface CustomJwtPayload extends JwtPayload {
    username: string,
    userId: string
}

const lengthOfContent = async (content: string) => {
    let wordCount = 0;
    for (let i = 0 ; i<content.length ; i++){
        if(content[i] == " "){
            wordCount++;
        }
    }
    wordCount++;
    return wordCount;
}

export const createPost = async (req: Request, res: Response) => {

    const bearerToken = req.headers.token
    const SECRET_KEY = process.env.JWT_SECRET_KEY;

    const id = nanoid(20);

    const content:string = req.body.content;
    const len = await lengthOfContent(content);
    if(len > 50){
        res.status(400).json({
            msg: `Content is more than 50 words`
        })
    } else {

        if(bearerToken != '' && typeof(bearerToken) == 'string'){
            const token = bearerToken.split(' ')[1]
            if(SECRET_KEY){
                
                try {
                    const payload = await jwt.verify(token,SECRET_KEY) as CustomJwtPayload
                    const username = payload.username;
                    try {
                        
                        const post = await prisma.post.create({
                            data: {
                                id: id,
                                content: content,
                                author: {
                                    connect: {
                                        username: username,
                                        id: payload.userId
                                    }
                                }
                            }
                        })
                        res.status(200).json({
                            msg:`Post created successfully`
                        })
                    } catch (error) {
                        res.status(500).json({
                            msg: `Internal server error`
                        })
                    }
                }
                catch(e){
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
}