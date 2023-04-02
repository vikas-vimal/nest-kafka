import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { CurrentUser } from '../decorators/currentUser.decorator';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';

@Controller('post/v1')
export class PostController {
  constructor(
    private userService: UserService,
    private postService: PostService,
  ) {}

  @Post('create')
  async registerUser(
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
    const result = await this.postService.createNewPost(
      currentUser,
      newPostPayload,
    );
    if (!result) {
      throw new HttpException(
        'Unable to create post! Please try again later!',
        400,
      );
    }
    return result;
  }
}
