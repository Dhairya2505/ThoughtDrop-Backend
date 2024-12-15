import { Request, Response } from "express";
import { prisma } from "../index.js";
import { nanoid } from "nanoid";
import { lengthOfContent } from "../utilities/lengthofcontent.js";

export const replyToPost = async (req: Request, res: Response) => {
    
    const username = req.headers.username;
    const userId = req.headers.userId;
    const content = req.body.content;
    const postId = req.body.postId;

    const len = await lengthOfContent(content);
    if(len > 25){
        res.status(400).json({
            msg: `Reply is more than 25 words`
        })
    } else {
        const id = await nanoid(20);
        try {
            if(typeof(username) == 'string' && typeof(userId) == 'string'){

                const posts = await prisma.post.findMany({
                    where: {
                        id: postId
                    }
                })

                if(posts.length){
                    await prisma.reply.create({
                        data: {
                            id: id,
                            content: content,
                            author: {
                                connect: {
                                    username: username,
                                    id: userId
                                }
                            },
                            post: {
                                connect: {
                                    id: postId
                                }
                            } 
                        }
                    })
                    res.status(200).json({
                        msg: `Reply sent successfully`
                    })
                } else {
                    res.status(404).json({
                        msg: `Post not found`
                    })
                }
            } else {
                res.status(401).json({
                    msg:`Unauthorizd`
                })
            }

        } catch (error) {
            console.log(error)
            res.status(500).json({
                msg: `Internal server error`
            })
        }

    }
}