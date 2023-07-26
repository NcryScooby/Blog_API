import { Comment, type Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(argsCreate: Prisma.CommentCreateArgs): Promise<Comment> {
    return this.prismaService.comment.create(argsCreate);
  }

  findAll(argsFind: Prisma.CommentFindManyArgs): Promise<Comment[]> {
    return this.prismaService.comment.findMany(argsFind);
  }

  count(argsCount?: Prisma.CommentCountArgs): Promise<number> {
    return this.prismaService.comment.count(argsCount);
  }
}
