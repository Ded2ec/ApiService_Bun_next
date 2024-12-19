import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const UserController = {
    singeIn: async ({body,jwt}: {
        body: {
            username: string, 
            password: string
        }, jwt: any}) => {
        try {
            const user = await prisma.user.findUnique({
                select: {
                    id: true,
                    username: true,
                    password: true,
                    level: true,
                    status: true
                },
                where: {
                    username: body.username,
                    password: body.password,
                    status: "active"
                }
            })
            if (!user) {
                return {message: "Invalid username or password"}
            }
            const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "1h"})
            return {
                message: "Login successful",
                token: token
            }
        } catch (error: any) {
            throw new Error(error.message)
        }
             
    },
}