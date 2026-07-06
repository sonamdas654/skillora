"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputCls =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none";

interface PostView {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  status: string;
  createdAt: string;
}

export default function BlogManager({ posts }: { posts: PostView[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<PostView | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: fd.get("title"),
      content: fd.get("content"),
      metaTitle: fd.get("metaTitle"),
      metaDescription: fd.get("metaDescription"),
      status: fd.get("status"),
    };
    const res = editing
      ? await fetch(`/api/admin/blog/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      : await fetch("/api/admin/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
    setSaving(false);
    if (res.ok) {
      setShowForm(false);
      setEditing(null);
      router.refresh();
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Failed to save post");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this post permanently?")) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    router.refresh();
  }

  function startEdit(post: PostView) {
    setEditing(post);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-ink">Blog</h1>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(!showForm);
          }}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-deep"
        >
          {showForm && !editing ? "Cancel" : "+ New post"}
        </button>
      </div>
      <p className="mt-2 text-sm text-ink-soft">
        Published posts appear on the public blog alongside the 6 built-in articles. Formatting:
        start a line with <code className="rounded bg-black/[0.06] px-1">## </code> for headings,{" "}
        <code className="rounded bg-black/[0.06] px-1">- </code> for list items; blank line
        between paragraphs.
      </p>

      {showForm && (
        <form onSubmit={save} className="mt-6 rounded-2xl border border-line bg-white p-6 space-y-4">
          {editing && (
            <p className="rounded-xl bg-accent-soft px-4 py-2 text-sm font-semibold text-accent">
              Editing: {editing.title}{" "}
              <button
                type="button"
                className="ml-2 underline"
                onClick={() => {
                  setEditing(null);
                  setShowForm(false);
                }}
              >
                cancel
              </button>
            </p>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Title *</label>
            <input name="title" required defaultValue={editing?.title ?? ""} className={inputCls} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Content *</label>
            <textarea
              name="content"
              required
              rows={14}
              defaultValue={editing?.content ?? ""}
              className={`${inputCls} font-mono text-xs leading-5`}
              placeholder={"Intro paragraph...\n\n## First heading\n\nParagraph text...\n\n- List item one\n- List item two"}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Meta title (SEO)</label>
              <input name="metaTitle" defaultValue={editing?.metaTitle ?? ""} className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-ink">Meta description (SEO)</label>
              <input name="metaDescription" defaultValue={editing?.metaDescription ?? ""} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">Status</label>
            <select name="status" defaultValue={editing?.status ?? "draft"} className={inputCls}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          <button
            disabled={saving}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : editing ? "Save changes" : "Create post"}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {posts.length === 0 && (
          <p className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-ink-soft">
            No custom posts yet. The 6 built-in articles are live on the public blog.
          </p>
        )}
        {posts.map((post) => (
          <div key={post.id} className="rounded-2xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-ink">
                  {post.title}{" "}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      post.status === "published"
                        ? "bg-mint/10 text-mint"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {post.status.toUpperCase()}
                  </span>
                </p>
                <p className="mt-0.5 text-sm text-ink-soft">
                  /blog/{post.slug} ·{" "}
                  {new Date(post.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {post.status === "published" && (
                  <a
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="rounded-full border border-line px-3.5 py-1.5 text-xs font-semibold text-ink hover:border-accent hover:text-accent"
                  >
                    View
                  </a>
                )}
                <button
                  onClick={() => startEdit(post)}
                  className="rounded-full border border-line px-3.5 py-1.5 text-xs font-semibold text-ink hover:border-accent hover:text-accent"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(post.id)}
                  className="rounded-full border border-line px-3.5 py-1.5 text-xs font-semibold text-red-500 hover:border-red-300"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
