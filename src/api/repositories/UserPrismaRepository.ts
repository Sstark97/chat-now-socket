import { PrismaClient } from "@prisma/client";
import type { UserRepository } from "../../types/domain";

/**
 * @class UserPrismaRepository
 * @description Repositorio de usuarios
 * @property {PrismaClient} prisma - Cliente de Prisma
 */
class UserPrismaRepository implements UserRepository {
    private prisma: PrismaClient
    constructor() {
        this.prisma = new PrismaClient()
    }

    /**
     * @function getUserInfo
     * @param userId {string}
     * @description Obtiene la información de un usuario
     * @returns {Promise<User | null>} Información del usuario
     */
    getUserInfo(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, image: true },
        })
    }
}

export default UserPrismaRepository