import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma, Role } from '@prisma/client';
import { GetGuestsDto } from './dto/get-guests.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findAllGuests(query: GetGuestsDto) {
    const { page, limit, name } = query;
    const where: Prisma.UserWhereInput = {
      role: Role.GUEST,
      ...(name && {
        fullName: {
          contains: name,
          mode: 'insensitive',
        },
      }),
    };

    if (page && limit) {
      const totalItems = await this.prisma.user.count({ where });
      const users = await this.prisma.user.findMany({
        where,
        skip: Number(page - 1) * Number(limit),
        take: Number(limit),
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        data: users,
        metadata: {
          totalItems,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page,
        },
      };
    }

    return this.prisma.user.findMany({ where });
  }
}
