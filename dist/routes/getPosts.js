import { prisma } from "../index.js";
export const getPosts = async (req, res) => {
    try {
        const username = req.headers.username;
        if (typeof (username) == 'string') {
            const user = await prisma.user.findMany({
                where: {
                    username: username
                },
                select: {
                    posts: true
                }
            });
            console.log(user[0].posts);
            // if(user){
            //     res.status(200).json({
            //         posts: user.posts,
            //     })
            // } else {
            //     res.status(401).json({
            //         msg: `Unauthorized`
            //     })
            // }
        }
        else {
            res.status(401).json({
                msg: `Unauthorizd`
            });
        }
    }
    catch (e) {
        res.status(401).json({
            msg: `Unauthorized`
        });
    }
};
