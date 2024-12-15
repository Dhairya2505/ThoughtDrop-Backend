import express from 'express';
import { PrismaClient } from '@prisma/client';
import { signupRoute } from './routes/signupRoute.js';
import { checkForUsername } from './middlewares/checkForUsername.js';
import { signinRoute } from './routes/signinRoute.js';
// import { createPost } from './routes/createPost.js';
import { getPosts } from './routes/getPosts.js';
import { createPost } from './routes/createPost.js';
import { verifyToken } from './middlewares/verifyToken.js';
const app = express();
const PORT = process.env.PORT || 3000;
export const prisma = new PrismaClient();
// app.get(`/`, (req: Request, res: Response) => {
//     res.send(`Welcome to Thought Drop !!`)
// })
app.use(express.json());
app.post(`/signup`, checkForUsername, signupRoute);
app.get(`/signin`, signinRoute);
app.post(`/createpost`, verifyToken, createPost);
app.get(`/getposts`, verifyToken, getPosts);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
process.on('SIGINT', async () => {
    console.log('SIGINT received: Closing Prisma connection...');
    await prisma.$disconnect();
    process.exit(0);
});
