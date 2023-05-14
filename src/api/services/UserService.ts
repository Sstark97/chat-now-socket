import type { UserRepository } from "../../types/domain";

/**
 * @class UserPrismaRepository
 * @description Repositorio de usuarios
 * @property {UserRepository} userRepository - Repositorio de usuarios
 */
class UserPrismaRepository {
    constructor(private userRepository: UserRepository){}

    /**
     * @function getUserInfo
     * @param userId{string}
     * @description Obtiene la información de un usuario
     * @returns {Promise<UserNotify | null>} Información del usuario
     */
    async getUserInfo(userId: string) {
        return await this.userRepository.getUserInfo(userId)
    }
}

export default UserPrismaRepository