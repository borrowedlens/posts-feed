<script>
  import { onMount } from "svelte";
  import Posts from "./lib/Posts.svelte";
  import { CURRENT_USER_ID, updatePost } from "./lib/utils";

  const broadcastChannel = new BroadcastChannel("fav");

  let followingPosts,
    isFollowingPostsPending = true,
    isFollowingPostsError,
    followingPostsForMutation,
    globalPosts,
    isGlobalPostsPending = true,
    isGlobalPostsError,
    globalPostsForMutation;

  onMount(async () => {
    broadcastChannel.onmessage = (event) => {
      if (event.data.type === "toggle-fav") {
        const postId = event.data.postId;
        followingPostsForMutation = updatePost(followingPostsForMutation, postId, CURRENT_USER_ID);
        globalPostsForMutation = updatePost(globalPostsForMutation, postId, CURRENT_USER_ID);
      }
    };
    let persistedPosts = window.localStorage.getItem("posts");
    if (persistedPosts) {
      [followingPostsForMutation, globalPostsForMutation] = JSON.parse(persistedPosts);
      if (!(followingPostsForMutation instanceof Array) || !followingPostsForMutation) {
        isFollowingPostsError = true;
        window.localStorage.removeItem("posts");
      }
      if (!(globalPostsForMutation instanceof Array) || !globalPostsForMutation) {
        isGlobalPostsError = true;
        window.localStorage.removeItem("posts");
      }
      isFollowingPostsPending = false;
      isGlobalPostsPending = false;
    }
    [followingPosts, globalPosts] = await Promise.all([
      fetch("http://localhost:5173/posts?feed=user&userId=1").then((res) => res.json()),
      fetch("http://localhost:5173/posts?feed=global").then((res) => res.json()),
    ]);
    window.localStorage.setItem("posts", JSON.stringify([followingPosts, globalPosts]));
    isFollowingPostsPending = false;
    isGlobalPostsPending = false;
    followingPostsForMutation = structuredClone(followingPosts);
    globalPostsForMutation = structuredClone(globalPosts);
  });

  const handleToggleFav = (postId) => {
    followingPostsForMutation = updatePost(followingPostsForMutation, postId, CURRENT_USER_ID);
    globalPostsForMutation = updatePost(globalPostsForMutation, postId, CURRENT_USER_ID);
    broadcastChannel.postMessage({ type: "toggle-fav", postId: postId });
    fetch(`http://localhost:5173/post/${postId}`, {
      method: "POST",
      body: JSON.stringify({
        userId: CURRENT_USER_ID,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        window.localStorage.setItem(
          "posts",
          JSON.stringify([data.followingPosts, data.globalPosts]),
        );
      })
      .catch(() => {
        followingPostsForMutation = updatePost(followingPostsForMutation, postId, CURRENT_USER_ID);
        globalPostsForMutation = updatePost(globalPostsForMutation, postId, CURRENT_USER_ID);
      });
  };
</script>

<header class="w-full h-12 flex items-center px-4 bg-slate-200">
  <h1 class="text-xl">Posts Feed</h1>
</header>
<main>
  <div class="grid grid-cols-2 items-start w-full">
    {#if isFollowingPostsPending}
      <div class="px-4 h-[calc(100vh-4rem)] grid place-items-center">Loading your posts...</div>
    {:else if isFollowingPostsError}
      <div class="px-4 h-[calc(100vh-4rem)] grid place-items-center">
        <div class="px-3 py-2 bg-red-200 border-1 border-red-700 rounded-md text-red-700 m-2">
          Could not load your posts!
        </div>
      </div>
    {:else}
      <Posts posts={followingPostsForMutation} feedtitle="Your Posts" {handleToggleFav} />
    {/if}
    {#if isGlobalPostsPending}
      <div class="px-4 h-[calc(100vh-4rem)] grid place-items-center">Loading global posts...</div>
    {:else if isGlobalPostsError}
      <div class="px-4 h-[calc(100vh-4rem)] grid place-items-center">
        <div class="px-3 py-2 bg-red-200 border-1 border-red-700 rounded-md text-red-700 m-2">
          Could not load global posts!
        </div>
      </div>
    {:else}
      <Posts posts={globalPostsForMutation} feedtitle="Global Posts" {handleToggleFav} />
    {/if}
  </div>
</main>

<style>
</style>
