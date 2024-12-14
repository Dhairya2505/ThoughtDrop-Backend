import express from 'express';
import { PrismaClient } from '@prisma/client';
import { signupRoute } from './routes/signupRoute.js';
import { checkForUsername } from './middlewares/checkForUsername.js';
import { signinRoute } from './routes/signinRoute.js';
const app = express();
const PORT = process.env.PORT || 3000;
export const prisma = new PrismaClient();
// app.get(`/`, (req: Request, res: Response) => {
//     res.send(`Welcome to Thought Drop !!`)
// })
app.use(express.json());
app.post(`/signup`, checkForUsername, signupRoute);
app.get(`/signin`, signinRoute);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
process.on('SIGINT', async () => {
    console.log('SIGINT received: Closing Prisma connection...');
    await prisma.$disconnect();
    process.exit(0);
});
