import { PrismaClient } from "@prisma/client";
import type { UserRepository } from "../../types/domain";

class UserPrismaRepository implements UserRepository {
    private prisma: PrismaClient
    constructor() {
        this.prisma = new PrismaClient()
    }

    getUserInfo(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, image: true },
        })
    }
}

export default UserPrismaRepository