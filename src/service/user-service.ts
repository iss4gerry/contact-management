import { prisma } from '../../prisma/index'
import { apiError } from '../middleware/apiError';
import { CreateUserRequest, UserResponse, toUserResponse } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bcrypt from 'bcrypt'

export class UserService {

    static async register(request: CreateUserRequest) : Promise<UserResponse> {
        const registerRequest = Validation.validate(UserValidation.REGISTER, request)
        const usernameExist = await prisma.user.count({
            where: {
                username: registerRequest.username
            }
        })

        if(usernameExist){
            throw new apiError(400, 'Username already exist')
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password, 10)

        const user = await prisma.user.create({
            data: registerRequest
        })

        return toUserResponse(user)
    }

}