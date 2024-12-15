import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { prisma } from "../index.js";
import { lengthOfContent } from "../utilities/lengthofcontent.js";

export const createPost = async (req: Request, res: Response) => {

    const id = nanoid(20);

    const content:string = req.body.content;
    const username = req.headers.username;
    const userId = req.headers.userId;

    const len = await lengthOfContent(content);
    if(len > 50){
        res.status(400).json({
            msg: `Content is more than 50 words`
        })
    } else {
            
        try {
            if(typeof(username) == 'string' && typeof(userId) == 'string'){
                const post = await prisma.post.create({
                    data: {
                        id: id,
                        content: content,
                        author: {
                            connect: {
                                username: username,
                                id: userId
                            }
                        }
                    }
                })
                res.status(200).json({
                    msg:`Post created successfully`
                })
            } else {
                res.status(401).json({
                    msg:`Unauthorizd`
                })
            }
        } catch (error) {
            res.status(500).json({
                msg: `Internal server error`
            })
        }
    }

}