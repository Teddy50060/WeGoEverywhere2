import { fetchMe } from "@/actions/actions";
import { Navbar } from "@/components/navbar/Navbar";

export default async function Home() {
  const res = await fetchMe();
  if (!res.ok) {
    return <div>Fail to fetch user</div>;
  }
  const user = res.data;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-20">
        <p className="mt-4 text-center text-lg">Welcome to WeGoEveryWhere!</p>
        <h1 className="pt-5 text-4xl font-bold items-center text-center text-[var(--color-brand-tertiary)]">
          Hi {user.firstName} {user.lastName}
        </h1>
        <h1 className="flex flex-col items-center text-[150px] font-bold">
          <span>H</span>
          <span>O</span>
          <span>M</span>
          <span>E</span>
        </h1>
      </main>
      <Navbar />
    </div>
  );
}
