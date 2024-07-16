import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { LoginDto } from "../dto/login.dto";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local'){
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const body: LoginDto = request.body;

    // Validate that email and password are provided
    if (!body.email || !body.password) {
      throw new UnauthorizedException('Email and password are required');
    }

    // Call super.logIn() to establish a session.
    const result = (await super.canActivate(context)) as boolean;

    // Add your custom authentication logic here
    return result;
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException(info?.message);
    }
    return user;
  }
  
}