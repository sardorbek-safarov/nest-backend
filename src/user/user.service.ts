import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  age?: number;
}

// Type for public user data (without password and refreshToken)
export type PublicUser = Omit<User, 'password' | 'refreshToken'>;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<PublicUser[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password and refreshToken from results
        password: false,
        refreshToken: false,
      },
    });
  }

  async findOne(id: number): Promise<PublicUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password and refreshToken from results
        password: false,
        refreshToken: false,
      },
    });
  }

  async create(data: CreateUserDto): Promise<PublicUser> {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password and refreshToken from results
        password: false,
        refreshToken: false,
      },
    });
  }

  async update(
    id: number,
    data: Partial<CreateUserDto>
  ): Promise<PublicUser | null> {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        createdAt: true,
        updatedAt: true,
        // Exclude password and refreshToken from results
        password: false,
        refreshToken: false,
      },
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateRefreshToken(
    userId: number,
    refreshToken: string | null
  ): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }
}
