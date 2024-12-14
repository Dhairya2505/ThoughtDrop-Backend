import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import { prisma } from '../index.js'
import { nanoid } from "nanoid";

export const signupRoute = async (req: Request, res: Response) => {
    
    const password = req.headers.password;
    const username = req.headers.username;

    if(typeof(username) == 'string' && typeof(password) == 'string'){
        if(username != '' && password != ''){

            try {
                const salt = await bcrypt.genSalt();
                const hashedPassword = await bcrypt.hash(password, salt);
                    
                const id = await nanoid(20);
    
                await prisma.user.create({
                    data: {
                        id: id,
                        username: username,
                        password: hashedPassword
                    }
                })
        
                res.status(200).json({
                    msg: `User Saved`
                })
            
            } catch (error) {
                res.status(500).json({
                    msg: `Internal server error`
                })
            }
        } else{
            res.status(400).json({
                msg: `Please enter username and password`
            })
        }
    } else{
        res.status(400).json({
            msg: `Bad Inputs`
        })
    }


}