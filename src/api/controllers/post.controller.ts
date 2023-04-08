import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../decorators/currentUser.decorator';
import { KafkaProducerService } from '../producers/kafka.producer.service';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';
import { Public } from '../decorators/publicRoute.decorator';

@Controller('post/v1')
export class PostController {
  constructor(
    private userService: UserService,
    private postService: PostService,
    private kafkaProducerService: KafkaProducerService,
  ) {}

  @Post('create')
  async createNewPost(
    @CurrentUser() currentUser: JwtUserObj,
    @Body() payload: any,
  ) {
    const newPostPayload = {
      title: payload.title,
      content: payload.content,
      published: payload.published || false,
      authorId: currentUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await this.kafkaProducerService.publishMessage(
      'test',
      JSON.stringify({ ...newPostPayload, type: 'SAVE_POST' }),
    );
    // console.log({ result });

    // const result = await this.postService.createNewPost(
    //   currentUser,
    //   newPostPayload,
    // );
    if (!result) {
      throw new HttpException(
        'Unable to create post! Please try again later!',
        400,
      );
    }
    return newPostPayload;
  }

  @Public()
  @Get('feed')
  async getPostsFeed(
    @Query('search') searchKeyword: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    if (page < 1) page = 1;
    if (pageSize > 50) pageSize = 50;
    searchKeyword = searchKeyword ? searchKeyword.trim().toLowerCase() : '';
    const list = await this.postService.searchPosts(
      page,
      pageSize,
      searchKeyword,
    );
    // console.log({ result: list });

    if (!list || !list.length) {
      return {
        docs: [],
        nextPage: null,
      };
    }
    const nextPage = list.length >= pageSize ? page + 1 : null;
    return {
      docs: list,
      nextPage,
    };
  }

  @Get('wall')
  async findUserPosts(
    @CurrentUser() currentUser: JwtUserObj,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    if (page < 1) page = 1;
    if (pageSize > 50) pageSize = 50;
    const list = await this.postService.findUserPostsById(
      currentUser.id,
      page,
      pageSize,
    );
    console.log({ result: list });

    if (!list || !list.length) {
      return {
        docs: [],
        nextPage: null,
      };
    }
    const nextPage = list.length >= pageSize ? page + 1 : null;
    return {
      docs: list,
      nextPage,
    };
  }
}
