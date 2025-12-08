import React from "react";

const PostCard = ({ post }) => {
  const user = post.user || {};
  const image = (post.image_urls && post.image_urls[0]) || null;

  return (
    <div className="bg-white rounded-xl p-4 shadow-md">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={user.profile_picture || user.imageUrl}
          alt={user.username || "user"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <div className="text-sm font-semibold text-gray-900">
            {user.full_name || user.username || "User"}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(post.createdAt || Date.now()).toLocaleString()}
          </div>
        </div>
      </div>

      {post.content && (
        <p className="text-gray-800 text-sm whitespace-pre-line mb-3">{post.content}</p>
      )}

      {image && (
        <div className="rounded-lg overflow-hidden">
          <img src={image} alt="post" className="w-full h-auto object-cover" />
        </div>
      )}
    </div>
  );
};

const PostItems = ({ posts = [] }) => {
  return (
    <div className="space-y-4">
      {posts.map((p) => (
        <PostCard key={p._id} post={p} />
      ))}
    </div>
  );
};

export default PostItems;
