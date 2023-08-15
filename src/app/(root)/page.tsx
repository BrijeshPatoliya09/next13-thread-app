import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThread } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const results = await fetchThread(1, 30);
  const user = await currentUser();

  return (
    <main>
      <h1 className="text-slate-50">Threads</h1>

      <section className="mt-9 flex flex-col gap-10">
        {results.threads.length === 0 ? (
          <p className="no-result">No thread found</p>
        ) : (
          <>
            {results.threads.map((thread) => (
              <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={user?.id || ""}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}
                community={thread.community}
                createdAt={thread.createdAt}
                comments={thread.children}
              />
            ))}
          </>
        )}
      </section>
    </main>
  );
}
