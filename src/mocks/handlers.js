import { delay, http, HttpResponse } from "msw";
import { allPosts } from "./data";
import { updatePost } from "../lib/utils";

export const handlers = [
  http.get("http://localhost:5173/posts?feed=user&userId=1", async ({ request }) => {
    await delay(1000);
    const url = new URL(request.url);
    const feed = url.searchParams.get("feed");
    let followingPosts, globalPosts;
    const persistedPosts = window.localStorage.getItem("posts");
    if (persistedPosts) {
      [followingPosts, globalPosts] = JSON.parse(persistedPosts);
    } else {
      followingPosts = allPosts.filter((post) => post.feed.includes("following"));
      globalPosts = allPosts.filter((post) => post.feed.includes("global"));
    }
    if (feed === "user") {
      // return HttpResponse.error();
      return HttpResponse.json(followingPosts);
    } else if (feed === "global") {
      return HttpResponse.json(globalPosts);
    }
  }),
  http.post("http://localhost:5173/post/:id", async ({ params, request }) => {
    await delay(1000);
    const postId = params.id;
    const reqData = await request.json();
    let followingPosts, globalPosts;
    try {
      const persistedPosts = window.localStorage.getItem("posts");
      [followingPosts, globalPosts] = JSON.parse(persistedPosts);
      followingPosts = updatePost(followingPosts, postId, reqData["userId"]);
      globalPosts = updatePost(globalPosts, postId, reqData["userId"]);
      // return HttpResponse.error();
      return HttpResponse.json({ followingPosts, globalPosts });
    } catch (err) {
      return HttpResponse.error();
    }
  }),
];
