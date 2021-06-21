import { Arg, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";

import { Post } from "../entities/Post";
import { MyContext } from "../utils/types";
//created the post resolver by decorating the post class with resolver method
@Resolver()
export default class PostResolver {
  //@query decorator just states that getPost is of query typedefs and it should return a post array
  //using the @Ctx decorator also says that context parameter is a context obj passed in via the apollo server and that the context parameter is of type MyContext
  @Query(() => [Post]) //clearly telling graphql return type
  //                                  explicitly telling TS the return type
  getPosts(@Ctx() context: MyContext): Promise<Post[]> {
    return context.em.find(Post, {});
  }

  @Query(() => Post, { nullable: true }) // specifies that the getPost query can be null or can return a Post object
  getPost(
    @Arg("postId", () => Int) id: number, // translates to getPost(postId:Int!):Post
    @Ctx() context: MyContext
  ): Promise<Post | null> {
    return context.em.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("postTitle", () => String) title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, { title });
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    //we are clearly stating that postId type should be int
    @Arg("postId", () => Int) id: number,
    //type graphql can infer the type from the TS type
    @Arg("postTitle") title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    //find a post by id, return null if not found
    const post = await em.findOne(Post, { id });
    if (!post) return null;
    post.title = title;
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    //we are clearly stating that postId type should be int
    @Arg("postId", () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    let deleteStatus = false;
    try {
      const result = await em.nativeDelete(Post, { id });
      console.log(result, "--------------err from post delete---------------");
      if (result) deleteStatus = true;
    } catch (err) {
      console.log(err, "--------------err from post delete---------------");
    }
    return deleteStatus;
  }
}
