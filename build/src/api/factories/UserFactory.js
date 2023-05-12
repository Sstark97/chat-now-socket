"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserPrismaRepository_1 = __importDefault(require("../repositories/UserPrismaRepository"));
const UserService_1 = __importDefault(require("../services/UserService"));
class UserFactory {
    static createUserService() {
        const userPrismaRepository = new UserPrismaRepository_1.default();
        return new UserService_1.default(userPrismaRepository);
    }
}
exports.default = UserFactory;
