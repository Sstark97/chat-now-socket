"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class UserPrismaRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    getUserInfo(userId) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            select: { name: true, image: true },
        });
    }
}
exports.default = UserPrismaRepository;
