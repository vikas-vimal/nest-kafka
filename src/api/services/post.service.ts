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

  //   async createNewPost(authorId: JwtUserObj, postObj: NewPost) {
  //     try {
  //       const result = await this.prisma.post.create({
  //         data: {
  //           title: postObj.title,
  //           content: postObj.content,
  //           authorId: postObj.authorId,
  //           createdAt: new Date(),
  //           updatedAt: new Date(),
  //           published: postObj.published || false,
  //         },
  //       });
  //       return { data: result };
  //     } catch (error) {
  //       console.log(error?.message);
  //       console.log(error?.meta);
  //       return false;
  //     }
  //   }

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

  async searchPosts(
    page: number,
    pageSize: number,
    searchKeyword: string,
  ): Promise<Post[]> {
    try {
      const list = await this.prisma.post.findMany({
        where: {
          title: {
            contains: searchKeyword,
          },
          content: {
            contains: searchKeyword,
          },
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: true,
        },
      });
      return list;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async findUserPostsById(
    userId: number,
    page: number,
    pageSize: number,
  ): Promise<Post[]> {
    try {
      const list = this.prisma.post.findMany({
        where: {
          authorId: userId,
        },
        take: pageSize,
        skip: (page - 1) * pageSize,
        orderBy: {
          createdAt: 'desc',
        },
      });
      console.log({ found: list });
      return list;
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}
