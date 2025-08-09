"use client";

import { useEffect, useMemo, useState } from "react";
import type { LinkCategory } from "@/types";

type LinkItem = { id: string; title: string; description?: string; url: string; category: LinkCategory };

type AddLinkPayload = { title: string; url: string; description?: string; category: LinkCategory };

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [filter, setFilter] = useState<LinkCategory | "all">("all");

  const filtered = useMemo(
    () => links.filter((l) => (filter === "all" ? true : l.category === filter)),
    [links, filter]
  );

  async function checkAuth() {
    const res = await fetch("/api/admin/me");
    const data = await res.json();
    setAuthed(Boolean(data.authenticated));
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setPassword("");
      await checkAuth();
      await loadLinks();
    } else {
      alert("Login failed");
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    await checkAuth();
  }

  async function loadLinks() {
    const res = await fetch("/api/links", { cache: "no-store" });
    const data = await res.json();
    setLinks(data.links ?? []);
  }

  async function addLink(form: FormData) {
    const entries = Object.fromEntries(form.entries()) as Record<string, FormDataEntryValue>;
    const payload: AddLinkPayload = {
      title: String(entries.title ?? ""),
      url: String(entries.url ?? ""),
      description: entries.description ? String(entries.description) : undefined,
      category: String(entries.category ?? "reading") as LinkCategory,
    };
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      alert("Failed to add link");
      return;
    }
    (document.getElementById("add-form") as HTMLFormElement).reset();
    await loadLinks();
  }

  async function updateLink(id: string, updates: Partial<LinkItem>) {
    const res = await fetch(`/api/links/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) alert("Failed to update");
    await loadLinks();
  }

  async function deleteLink(id: string) {
    if (!confirm("Delete this link?")) return;
    const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
    if (!res.ok) alert("Failed to delete");
    await loadLinks();
  }

  useEffect(() => {
    checkAuth();
    loadLinks();
  }, []);

  if (!authed) {
    return (
      <div className="max-w-sm">
        <h1 className="text-xl font-semibold mb-2">Admin Login</h1>
        <form onSubmit={login} className="grid gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="rounded border p-2"
          />
          <button type="submit" className="rounded border p-2">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Admin</h1>
        <button onClick={logout} className="rounded border px-3 py-2">Logout</button>
      </div>

      <section className="rounded border p-4">
        <h2 className="font-semibold mb-3">Add Link</h2>
        <form
          id="add-form"
          action={(formData: FormData) => addLink(formData)}
          className="grid gap-3 sm:grid-cols-2"
        >
          <input name="title" placeholder="Title" className="rounded border p-2" required />
          <input name="url" placeholder="URL" className="rounded border p-2" required />
          <input name="description" placeholder="Description" className="rounded border p-2 sm:col-span-2" />
          <select name="category" className="rounded border p-2" required defaultValue="reading">
            <option value="reading">Reading</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="guided">Guided</option>
            <option value="podcast">Podcast</option>
          </select>
          <button type="submit" className="rounded border p-2">Add</button>
        </form>
      </section>

      <section className="rounded border p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Links</h2>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as LinkCategory | "all")}
            className="rounded border p-2"
          >
            <option value="all">All</option>
            <option value="reading">Reading</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="guided">Guided</option>
            <option value="podcast">Podcast</option>
          </select>
        </div>
        <div className="grid gap-3">
          {filtered.map((l) => (
            <div key={l.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_2fr_auto] items-center border rounded p-2">
              <input
                defaultValue={l.title}
                className="rounded border p-2"
                onBlur={(e) => updateLink(l.id, { title: e.target.value })}
              />
              <input
                defaultValue={l.url}
                className="rounded border p-2"
                onBlur={(e) => updateLink(l.id, { url: e.target.value })}
              />
              <input
                defaultValue={l.description}
                className="rounded border p-2"
                onBlur={(e) => updateLink(l.id, { description: e.target.value })}
              />
              <div className="flex items-center gap-2">
                <select
                  defaultValue={l.category}
                  className="rounded border p-2"
                  onChange={(e) => updateLink(l.id, { category: e.target.value as LinkCategory })}
                >
                  <option value="reading">Reading</option>
                  <option value="video">Video</option>
                  <option value="audio">Audio</option>
                  <option value="guided">Guided</option>
                  <option value="podcast">Podcast</option>
                </select>
                <button className="rounded border px-2 py-1" onClick={() => deleteLink(l.id)}>Delete</button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="opacity-70">No items.</p>}
        </div>
      </section>
    </div>
  );
} 