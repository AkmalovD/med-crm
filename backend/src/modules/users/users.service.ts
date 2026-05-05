import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

type PublicUser = {
  id: string
  email: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<PublicUser> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

    try {
      const user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: hashedPassword,
          role: createUserDto.role ?? UserRole.STAFF
        }
      })

      return this.toPublicUser(user)
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already in use')
      }

      throw error
    }
  }

  async findAll(): Promise<PublicUser[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return users
  }

  async findOne(id: string): Promise<PublicUser> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    return user
  }

  private toPublicUser(user: {
    id: string
    email: string
    role: UserRole
    createdAt: Date
    updatedAt: Date
  }): PublicUser {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }
}
