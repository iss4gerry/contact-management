import { prisma } from "../prisma";

export class UserTest {

    static async delete() {
        await prisma.user.deleteMany({
            where: {
                username: 'test'
            }
        })
    }

}