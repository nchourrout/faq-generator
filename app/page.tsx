import FAQForm from "@/components/FAQForm";

export default function Page() {
  return (
    <main className="flex justify-center items-center min-h-screen p-8">
      <div className="max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Generate FAQs for your Website</h1>
        <FAQForm />
      </div>
    </main>
  );
}
