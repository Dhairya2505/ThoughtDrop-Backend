import express from 'express'
import { PrismaClient } from '@prisma/client'
import cors from 'cors'

import { checkForUsername } from './middlewares/checkForUsername.js';
import { verifyToken } from './middlewares/verifyToken.js';

import { signupRoute } from './routes/signupRoute.js';
import { signinRoute } from './routes/signinRoute.js';
import { getPosts } from './routes/getPosts.js';
import { createPost } from './routes/createPost.js';
import { replyToPost } from './routes/reply.js';
import { getAllPosts } from './routes/getAllPosts.js';

const app = express();
const PORT = process.env.PORT || 3000;

export const prisma = new PrismaClient()

// app.get(`/`, (req: Request, res: Response) => {
//     res.send(`Welcome to Thought Drop !!`)
// })

app.use(express.json())
app.use(cors({
    origin: "*"
}))

app.post(`/signup`, checkForUsername, signupRoute);
app.get(`/signin`, signinRoute);
app.post(`/createpost`,verifyToken, createPost);
app.get(`/getposts`,verifyToken, getPosts);
app.post(`/reply`,verifyToken,replyToPost);
app.get(`/getallposts`, getAllPosts);

app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});