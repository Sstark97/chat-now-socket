"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
/**
 * @class UserPrismaRepository
 * @description Repositorio de usuarios
 * @property {PrismaClient} prisma - Cliente de Prisma
 */
class UserPrismaRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    /**
     * @function getUserInfo
     * @param userId {string}
     * @description Obtiene la información de un usuario
     * @returns {Promise<User | null>} Información del usuario
     */
    getUserInfo(userId) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, image: true },
        });
    }
}
exports.default = UserPrismaRepository;
