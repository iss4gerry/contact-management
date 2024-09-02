import { Request, Response, NextFunction } from "express";
import { prisma } from "../../prisma";
import { UserRequest } from "../types/user-request";

export const auth = async(req: UserRequest, res: Response, next: NextFunction) => {
    const token = req.get('X-API-TOKEN')

    if(token){
        const user = await prisma.user.findFirst({
            where: {
                token: token
            }
        })

        if(user) {
            req.user = user
            next()
            return
        }
    }

    res.status(401).json({
        errors: 'Unauthorized'
    }).end()
}
