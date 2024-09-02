import { prisma } from '../../prisma/index'
import { apiError } from '../middleware/apiError';
import { CreateUserRequest, UserResponse, toUserResponse, LoginUserRequest } from "../model/user-model";
import { UserValidation } from "../validation/user-validation";
import { Validation } from "../validation/validation";
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'

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

    static async login(request: LoginUserRequest) :Promise<UserResponse> {
        const loginRequest = Validation.validate(UserValidation.LOGIN, request)

        let user = await prisma.user.findUnique({
            where: {
                username: loginRequest.username
            }
        })

        if(!user){
            throw new apiError(401, 'Username or password wrong')
        }

        const isPasswordValid = await bcrypt.compare(loginRequest.password, user.password)

        if(!isPasswordValid){
            throw new apiError(401, 'Username or password wrong')
        }

        user = await prisma.user.update({
            where: {
                username: loginRequest.username
            },
            data: {
                token: uuid()
            }
        })

        const response = toUserResponse(user)
        response.token = user.token!
        return response
    }

}