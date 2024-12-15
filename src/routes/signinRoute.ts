import { Request, Response } from "express";
import bcrypt from 'bcrypt'
import { prisma } from '../index.js'
import jwt from 'jsonwebtoken'

export const signinRoute = async (req: Request, res: Response) => {
    
    const password = req.headers.password;
    const username = req.headers.username;
    const SECRET_KEY = process.env.JWT_SECRET_KEY;
    if(typeof(username) == 'string' && typeof(password) == 'string'){
        if(username != '' && password != ''){

            try {
    
                const user = await prisma.user.findMany({
                    where: {
                        username: username
                    }
                })

                if(user.length){

                    try {
                        const result = await bcrypt.compare(password, user[0].password)
                        if(result){
                            if (SECRET_KEY){
                                try {
                                    const token = await jwt.sign({
                                        username: username
                                    }, SECRET_KEY)
                                    
                                    res.status(200).json({
                                        msg: `Successful Login`,
                                        token: token
                                    })
                                    
                                } catch (error) {
                                    res.status(500).json({
                                        msg: `Internal server error`
                                    })
                                }
                            } else {
                                res.status(500).json({
                                    msg: `Internal server error`
                                })
                            }

                        } else {
                            res.status(401).json({
                                msg: `Wrong password`
                            })
                        }
                    } catch (error) {
                        res.status(500).json({
                            msg: `Internal server error`
                        })
                    }

                } else{
                    res.status(404).json({
                        msg: `User not found`
                    })    
                }
            
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