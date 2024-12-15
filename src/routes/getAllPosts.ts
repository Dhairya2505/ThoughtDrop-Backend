import { Request, Response } from "express";
import { prisma } from "../index.js";

export const getAllPosts = async (req: Request, res: Response) =>{
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: {
                    select: {
                        username: true
                    }
                }
            }
        });
        res.status(200).json({
            posts: posts
        })
    } catch (error) {
        res.status(500).json({
            msg: `Internal server error`
        })
    }
}