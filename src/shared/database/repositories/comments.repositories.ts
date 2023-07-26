import { Comment, type Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findAll(argsFind: Prisma.CommentFindManyArgs): Promise<Comment[]> {
    return this.prismaService.comment.findMany(argsFind);
  }

  findById(argsFind: Prisma.CommentFindUniqueArgs): Promise<Comment | null> {
    return this.prismaService.comment.findUnique(argsFind);
  }

  create(argsCreate: Prisma.CommentCreateArgs): Promise<Comment> {
    return this.prismaService.comment.create(argsCreate);
  }

  delete(argsDelete: Prisma.CommentDeleteArgs): Promise<Comment> {
    return this.prismaService.comment.delete(argsDelete);
  }

  count(argsCount?: Prisma.CommentCountArgs): Promise<number> {
    return this.prismaService.comment.count(argsCount);
  }
}
