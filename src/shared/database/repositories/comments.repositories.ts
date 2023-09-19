import { PrismaService } from '../../../shared/database/prisma.service';
import { Comment, type Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  findMany(argsFindMany: Prisma.CommentFindManyArgs): Promise<Comment[]> {
    return this.prismaService.comment.findMany(argsFindMany);
  }

  findUnique(
    findUnique: Prisma.CommentFindUniqueArgs,
  ): Promise<Comment | null> {
    return this.prismaService.comment.findUnique(findUnique);
  }

  create(argsCreate: Prisma.CommentCreateArgs): Promise<Comment> {
    return this.prismaService.comment.create(argsCreate);
  }

  update(argsUpdate: Prisma.CommentUpdateArgs): Promise<Comment> {
    return this.prismaService.comment.update(argsUpdate);
  }

  delete(argsDelete: Prisma.CommentDeleteArgs): Promise<Comment> {
    return this.prismaService.comment.delete(argsDelete);
  }

  count(argsCount?: Prisma.CommentCountArgs): Promise<number> {
    return this.prismaService.comment.count(argsCount);
  }
}
