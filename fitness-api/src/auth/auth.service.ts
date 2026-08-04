import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async register(data: { email: string; password_hash: string; full_name?: string }) {
        const existing = await this.userRepository.findOne({ where: { email: data.email } });
        if (existing) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(data.password_hash, 10);
        const user = this.userRepository.create({
            ...data,
            password_hash: hashedPassword,
        });

        const savedUser = await this.userRepository.save(user);
        const { password_hash, ...result } = savedUser;
        return {
            user: result,
            token: this.generateToken(savedUser),
        };
    }

    async login(email: string, pass: string) {
        const user = await this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password_hash', 'full_name']
        });

        if (!user || !(await bcrypt.compare(pass, user.password_hash))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const { password_hash, ...result } = user;
        return {
            user: result,
            token: this.generateToken(user),
        };
    }

    private generateToken(user: User) {
        return this.jwtService.sign({ email: user.email, sub: user.id });
    }

    async getProfile(id: string) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) throw new UnauthorizedException();
        return user;
    }
}
