import { Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
interface NewPost {
  title: string;
  content: string;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
}

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async createNewPost(authorId: JwtUserObj, postObj: NewPost) {
    try {
      const result = await this.prisma.post.create({
        data: {
          title: postObj.title,
          content: postObj.content,
          authorId: postObj.authorId,
          createdAt: new Date(),
          updatedAt: new Date(),
          published: postObj.published || false,
        },
      });
      return { data: result };
    } catch (error) {
      console.log(error?.message);
      console.log(error?.meta);
      return false;
    }
  }

  async findByPostId(id: number): Promise<Post | null> {
    try {
      const found = this.prisma.post.findUnique({
        where: {
          id: id,
        },
      });
      console.log({ found });
      return found;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
