import { Controller, Post , Req , Body, ParseBoolPipe, ParseIntPipe} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { error } from "console";

@Controller('auth')
export class AuthController{
    constructor(private authService : AuthService){}
     
    @Post('signin')
    signin(@Body() dto : AuthDto){
        console.log({
            email : dto.email,
            password : dto.password
        });
        return this.authService.signin()
    }

    @Post('signup')
    signup(){
        return this.authService.signup()
    }
}