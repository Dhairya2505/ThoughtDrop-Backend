import { NextFunction, Request, Response } from "express";
import { prisma } from "../index.js";

export const checkForUsername = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
        const username = req.headers.username;
        if(typeof(username)=='string'){
            const existingUser = await prisma.user.findMany({
                where: {
                    username: username
                }
            })
    
            if (existingUser.length) {
                res.status(409).json({
                    msg: `Username already exists. Please choose a different username.`
                });
                return;
            } else {
                next();
            }

        }else {
            res.status(400).json({
                msg: `Bad Inputs`
            })
            return;
        }

        
    } catch (e) {
        res.status(500).json({
            msg: `Internal server error`
        })
    }
    
}