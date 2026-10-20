import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const KEY = "skill2project-community-posts";

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export default function Community() {
  const [posts, setPosts] = useState(load);
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Project idea");
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("Loading community feed...");

  useEffect(() => {
    let active = true;

    async function loadCommunity() {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) throw sessionError;
      const user = sessionData?.session?.user;

      if (!user) {
        if (active) setMessage("Sign in to publish posts and like community posts.");
        return;
      }

      if (active) setUserId(user.id);

      const { data: postRows, error: postsError } = await supabase
        .from("community_posts")
        .select("id,user_id,author,content,category,created_at")
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      const { data: likeRows, error: likesError } = await supabase
        .from("community_post_likes")
        .select("post_id,user_id");

      if (likesError) throw likesError;
      if (!active) return;

      const mapped = (postRows || []).map((post) => ({
        id: post.id,
        userId: post.user_id,
        author: post.author,
        content: post.content,
        category: post.category || "Project idea",
        createdAt: post.created_at,
        likes: (likeRows || [])
          .filter((like) => like.post_id === post.id)
          .map((like) => like.user_id),
      }));

      setPosts(mapped);
      localStorage.setItem(KEY, JSON.stringify(mapped));
      setMessage("Connected to Supabase — community posts and likes are synced.");
    }

    loadCommunity().catch((error) => {
      if (active) setMessage("Community sync failed: " + (error.message || "Please try again."));
    });

    return () => {
      active = false;
    };
  }, []);

  async function publish(event) {
    event.preventDefault();

    if (!author.trim() || !content.trim()) return;

    if (!userId) {
      setMessage("Please sign in before publishing a community post.");
      return;
    }

    const { data, error } = await supabase
      .from("community_posts")
      .insert({
        user_id: userId,
        author: author.trim(),
        content: content.trim(),
        category,
      })
      .select("id,user_id,author,content,category,created_at")
      .single();

    if (error) {
      setMessage("Post publish failed: " + error.message);
      return;
    }

    const newPost = {
      id: data.id,
      userId: data.user_id,
      author: data.author,
      content: data.content,
      category: data.category,
      createdAt: data.created_at,
      likes: [],
    };

    const next = [newPost, ...posts];
    setPosts(next);
    localStorage.setItem(KEY, JSON.stringify(next));
    setContent("");
    setMessage("Your post was published successfully.");
  }

  async function toggleLike(post) {
    if (!userId) {
      setMessage("Please sign in to like posts.");
      return;
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      const { error } = await supabase
        .from("community_post_likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", userId);

      if (error) {
        setMessage("Unlike failed: " + error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from("community_post_likes")
        .insert({ post_id: post.id, user_id: userId });

      if (error) {
        setMessage("Like failed: " + error.message);
        return;
      }
    }

    const next = posts.map((item) => {
      if (item.id !== post.id) return item;

      return {
        ...item,
        likes: alreadyLiked
          ? item.likes.filter((id) => id !== userId)
          : [...item.likes, userId],
      };
    });

    setPosts(next);
    localStorage.setItem(KEY, JSON.stringify(next));
    setMessage(alreadyLiked ? "Like removed." : "Post liked!");
  }

  async function remove(post) {
    if (!userId) {
      setMessage("Please sign in to delete your own posts.");
      return;
    }

    if (post.userId !== userId) {
      setMessage("You can delete only posts you created.");
      return;
    }

    if (!window.confirm("Delete this post?")) return;

    const { error } = await supabase
      .from("community_posts")
      .delete()
      .eq("id", post.id)
      .eq("user_id", userId);

    if (error) {
      setMessage("Delete failed: " + error.message);
      return;
    }

    const next = posts.filter((item) => item.id !== post.id);
    setPosts(next);
    localStorage.setItem(KEY, JSON.stringify(next));
    setMessage("Your post was deleted.");
  }

  return (
    <main style={s.page}>
<Link to="/dashboard" style={s.link}>← Dashboard</Link>
      <h1>👥 Student Community</h1>
      <p style={s.muted}>Share project ideas, ask for collaboration and celebrate learning.</p>

      <form onSubmit={publish} style={s.panel}>
        <h2>Create a post</h2>
        <input required value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Your display name" style={s.input} />
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={s.input}>
          <option>Project idea</option>
          <option>Looking for teammates</option>
          <option>Question</option>
          <option>Achievement</option>
        </select>
        <textarea required value={content} onChange={(e) => setContent(e.target.value)} maxLength={1000} rows={4} placeholder="What would you like to share with fellow students?" style={{ ...s.input, resize: "vertical" }} />
        <button style={s.button}>Publish post</button>
      </form>

      <p role="status" style={s.muted}>{message}</p>
      <h2>Community feed ({posts.length})</h2>

      {posts.length === 0 ? (
        <div style={s.panel}><p style={s.muted}>No posts yet. Be the first to share an idea!</p></div>
      ) : (
        posts.map((post) => (
          <article key={post.id} style={s.panel}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <strong>{post.author}</strong>
              <span style={s.tag}>{post.category}</span>
            </div>
            <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{post.content}</p>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <button type="button" onClick={() => toggleLike(post)} style={s.secondary}>
                ♥ {post.likes.length} Like{post.likes.length === 1 ? "" : "s"}
              </button>
              <span style={s.muted}>{new Date(post.createdAt).toLocaleString()}</span>
              {post.userId === userId && (
                <button type="button" onClick={() => remove(post)} style={s.delete}>Delete</button>
              )}
            </div>
          </article>
        ))
      )}
    </main>
  );
}

const s = {
  page: { minHeight: "100vh", padding: "36px 20px", maxWidth: 850, margin: "auto", color: "#f7f5ff", fontFamily: "Inter,system-ui,sans-serif", background: "#08051c" },
  link: { color: "#b8a5ff", textDecoration: "none" },
  muted: { color: "#bcb5d8", fontSize: 13, lineHeight: 1.6 },
  panel: { padding: 22, margin: "16px 0", borderRadius: 18, border: "1px solid #9d8aff50", background: "#15112de8" },
  input: { display: "block", boxSizing: "border-box", width: "100%", padding: 12, margin: "12px 0", borderRadius: 10, border: "1px solid #544779", background: "#0d0a20", color: "white" },
  button: { padding: "12px 18px", border: 0, borderRadius: 10, background: "#925cff", color: "white", fontWeight: 700, cursor: "pointer" },
  secondary: { padding: "8px 12px", borderRadius: 8, border: "1px solid #925cff", background: "#21163f", color: "white", cursor: "pointer" },
  delete: { padding: "8px 12px", borderRadius: 8, border: "1px solid #ff7b91", background: "transparent", color: "#ff9eae", cursor: "pointer" },
  tag: { fontSize: 12, padding: "5px 9px", borderRadius: 20, background: "#38265f", color: "#d8caff" }
};


