<script>
  import { CURRENT_USER_ID } from "./utils";

  export let posts;
  export let feedtitle;
  export let handleToggleFav;
</script>

<section class="p-4 h-[calc(100vh-4rem)]">
  <h2 class="h-6 flex items-center">{feedtitle}</h2>
  <div class="overflow-y-auto h-[calc(100%-1.5rem)] pr-2 py-2 flex flex-col gap-y-2">
    {#each posts as post}
      <div class="flex items-center justify-between px-2 py-4 border-1 rounded-md border-black">
        <span>
          {post.title}
        </span>
        <button on:click={() => handleToggleFav(post.id)}>
          <svg height="20" width="20" color="red">
            <use
              href={post.liked_users.includes(CURRENT_USER_ID)
                ? "assets/fav.svg#fav"
                : "assets/outline.svg#outline"} />
          </svg>
        </button>
      </div>
    {/each}
  </div>
</section>
