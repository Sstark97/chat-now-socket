import type { UserRepository } from "../../types/domain";

class UserPrismaRepository {
    constructor(private userRepository: UserRepository){}

    async getUserInfo(userId: string) {
        return await this.userRepository.getUserInfo(userId)
    }
}

export default UserPrismaRepository