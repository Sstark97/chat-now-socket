import UserPrismaRepository from "../repositories/UserPrismaRepository"
import UserService from "../services/UserService"

/**
 * @class UserFactory
 * @description Factoría para crear instancias de UserService
 */
class UserFactory {
    /**
     * @static
     * @method createUserService
     * @description Crea una instancia de UserService
     * @returns {UserService}
     */
    static createUserService() {
        const userPrismaRepository = new UserPrismaRepository()
        return new UserService(userPrismaRepository)
    }
}

export default UserFactory