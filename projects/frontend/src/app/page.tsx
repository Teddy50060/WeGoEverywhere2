import { fetchMe } from "@/actions/actions";
import { Navbar } from "@/components/navbar/Navbar";

export default async function Home() {
  // Try to fetch user, but provide fallback for unauthenticated users
  const res = await fetchMe();
  let user = null;
  
  if (res.ok && res.data) {
    user = res.data;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-20">
        <p className="mt-4 text-center text-lg">Welcome to WeGoEveryWhere!</p>
        <h1 className="pt-5 text-4xl font-bold items-center text-center text-[var(--color-brand-tertiary)]">
          {user ? (
            `Hi ${user.firstName} ${user.lastName}`
          ) : (
            "Hi Guest User"
          )}
        </h1>
        <h1 className="flex flex-col items-center text-[150px] font-bold">
          <span>H</span>
          <span>O</span>
          <span>M</span>
          <span>E</span>
        </h1>
        {!user && (
          <div className="text-center mt-4 text-sm text-gray-600">
            <p>Please log in to see your personalized content</p>
          </div>
        )}
      </main>
      <Navbar />
    </div>
  );
}
