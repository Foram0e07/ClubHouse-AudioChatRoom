import { Router, Request, Response } from 'express';
import { client } from "../stream-client";

const router = Router();

interface User {
    id: string;
    role: string;
    name: string;
    image: string;
}

router.post("/createUser", async (req: Request, res: Response) => {
    try {
        const { username, name, image } = req.body;

        if (!username || !name || !image) {
            return res.status(400).json({ message: "Required fields were empty" });
        }

        const newUser: User = {
            id: username,
            role: "user",
            name,
            image,
        };

        const user = await client.upsertUsers({
            users: {
                [newUser.id]: newUser,
            }
        });

        const expiry = Math.floor(Date.now() / 1000) + 24 * 60 * 60;
        const token = client.createToken(username, expiry);
        return res.status(200).json({ token, username, name });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
