import { useState } from "react";
import api from "../services/api";

function CreatePost({ onPostCreated }) {
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/posts", {
        fileType: "image",
        file,
        description,
        location
      });

      setDescription("");
      setFile("");
      setLocation("");

      onPostCreated();
      alert("Post created");
    } catch {
      alert("Failed to create post");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Post</h3>

      <input
        placeholder="Image URL"
        value={file}
        onChange={(e) => setFile(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      <button type="submit">Post</button>
    </form>
  );
}

export default CreatePost;
