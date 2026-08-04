import { Controller, Post, Body, Get, UseGuards, Request, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() body: { email: string; password_hash: string; full_name?: string }) {
        return this.authService.register(body);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() body: { email: string; password_hash: string }) {
        return this.authService.login(body.email, body.password_hash);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req: any) {
        return this.authService.getProfile(req.user.sub);
    }
}
