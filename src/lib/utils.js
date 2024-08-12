export const CURRENT_USER_ID = "1";

export const updatePost = (posts, postId, currentUserId) => {
  const postIndex = posts.findIndex((post) => post.id === postId);
  if (postIndex > -1) {
    if (posts[postIndex].liked_users.includes(currentUserId)) {
      posts[postIndex].liked_users = posts[postIndex].liked_users.filter(
        (userId) => userId !== currentUserId,
      );
    } else {
      posts[postIndex].liked_users = [...posts[postIndex].liked_users, currentUserId];
    }
  }
  return posts;
};
