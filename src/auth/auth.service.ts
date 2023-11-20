import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2"
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/library";
import { User } from "@prisma/client";

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
            if(error instanceof PrismaClientKnownRequestError && error.code ==='P2002'){
                if(error.code === 'P2002'){
                    console.log('Credentials Taken')
                }
            }
            throw error
        }
    }

    signin(){
        return {msg : 'Lmao'}
    }
}