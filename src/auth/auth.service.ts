import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2"
import { PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import { User } from "@prisma/client";
import { error } from "console";

@Injectable({})
export class AuthService {
    constructor(private prisma : PrismaService){}
    async signup(dto : AuthDto){
        //generate the password hash
        const hash = await argon.hash(dto.password)

        //save the new user in db
        try{
            const user = await this.prisma.user.create({
                data:{
                    email : dto.email,
                    hash ,
                },
            })
            delete user.hash
            //return the saved user
            return user
        }
        catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002'){
                    console.log('Credentials Taken')
                }
            }
            throw error
        }
    }

    async signin(dto : AuthDto){
        //find user by email
        const user = this.prisma.user.findUnique({
            where : {
                email : dto.email
            }
        })
        //throw error if email not found
        if(!user){
            throw new error({err : 'User Not found'})
        }
        //compare passwords
        const pwMatch = await argon.verify((await user).hash, dto.password)

        //if password incorrect throw exception
        if(!pwMatch){
            throw new error({err : 'Password incorrect'})
        }
        //send user back
        delete (await user).hash
        return user
    }
}