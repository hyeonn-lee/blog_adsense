import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { AdSlot } from "@/components/AdSlot";
import { siteConfig } from "@/config/site";

export default function Home() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900">{siteConfig.name}</h1>
        <p className="mt-2 text-zinc-600">{siteConfig.description}</p>
      </section>

      <AdSlot className="mb-8" />

      {posts.length === 0 ? (
        <p className="text-zinc-500">아직 등록된 글이 없습니다. 곧 새로운 글로 찾아뵐게요.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
