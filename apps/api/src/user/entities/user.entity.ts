import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Comment } from 'src/comment/entities/comment.entity';
import { Like } from 'src/like/entities/like.entity';
import { Post } from 'src/post/entities/post.entity';

@ObjectType()
export class User {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  bio?: string;

  // add firld for avater as string and posts an array of post

  @Field({ nullable: true })
  avatar?: string;

  @Field(() => [Post])
  posts?: Post[];

  @Field(() => [Comment])
  comments?: Comment[];

  @Field(() => [Like])
  likes?: Like[];

  @Field(() => Date, { nullable: true })
  createdAt?: Date;
  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}
