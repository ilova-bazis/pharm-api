import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SigninDto, SignupDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserDto } from 'src/user/dto';
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}

    async signin(dto: SigninDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                username: dto.username,
            },
        });
        if (!user) {
            throw new UnauthorizedException('Wrong username or password');
        }

        if (!(await argon.verify(user.password_hash, dto.password))) {
            throw new UnauthorizedException('Wrong username or password');
        }
        const token = await this.signToken(user.id, user.username);
        return { access_token: token, user: new UserDto(user) };
    }

    async signup(dto: SignupDto) {
        try {
            const hash = await argon.hash(dto.password);
            const user = await this.prisma.user.create({
                data: {
                    password_hash: hash,
                    username: dto.username,
                    created_at: new Date(),
                },
            });
            delete user.password_hash;
            return user;
        } catch (error) {
            if (error) {
                if (error instanceof PrismaClientKnownRequestError) {
                    if (error.code == 'P2002') {
                        throw new ForbiddenException('Credentials are taken.');
                    }
                }
            }
            throw error;
        }
    }

    async signToken(userId: number, username: string): Promise<string> {
        const payload = {
            sub: userId,
            username,
        };
        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '48h',
            secret: secret,
        });
        return token;
    }
}
