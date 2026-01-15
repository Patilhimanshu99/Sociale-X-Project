import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import CreatePost from "../components/CreatePost";

function Home() {
  const { user, logout } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch {
      alert("Failed to fetch posts");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    await api.put(`/posts/like/${postId}`);
    fetchPosts();
  };

  const handleComment = async (postId) => {
    await api.post(`/posts/comment/${postId}`, {
      text: commentText[postId]
    });

    setCommentText({ ...commentText, [postId]: "" });
    fetchPosts();
  };

  return (
    <div>
      <h2>Welcome, {user.username}</h2>
      <button onClick={logout}>Logout</button>

      <hr />

      <CreatePost onPostCreated={fetchPosts} />

      <hr />
      <h3>Feed</h3>

      {posts.map((post) => {
        const isLiked = post.likes.includes(user.id);

        return (
          <div
            key={post._id}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px"
            }}
          >
            <p><strong>{post.username}</strong></p>
            <p>{post.description}</p>
            <p>📍 {post.location}</p>

            <button onClick={() => handleLike(post._id)}>
              {isLiked ? "❤️ Unlike" : "🤍 Like"}
            </button>

            <p>{post.likes.length} likes</p>

            <h4>Comments</h4>
            {post.comments.map((c) => (
              <p key={c._id}>
                <strong>{c.username}:</strong> {c.text}
              </p>
            ))}

            <input
              placeholder="Add a comment..."
              value={commentText[post._id] || ""}
              onChange={(e) =>
                setCommentText({
                  ...commentText,
                  [post._id]: e.target.value
                })
              }
            />
            <button onClick={() => handleComment(post._id)}>
              Comment
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
