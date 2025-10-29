import { Navbar } from "@/components/navbar/Navbar";


const Chatpage = () => {
  return (
    <div className="min-h-screen flex flex-col max-w-[393px] mx-auto">
      <div className="flex-1 flex justify-center items-center">
        Chatpage
      </div>
      <footer className="sticky bottom-0 w-full z-50 bg-transparent">
        <Navbar />
      </footer>
    </div>
  );
};
export default Chatpage;
