import UserPrismaRepository from "../repositories/UserPrismaRepository"
import UserService from "../services/UserService"

class UserFactory {
    static createUserService() {
        const userPrismaRepository = new UserPrismaRepository()
        return new UserService(userPrismaRepository)
    }
}

export default UserFactory