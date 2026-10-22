import Navbar from "@/components/Navbar";
import Catalog from "@/components/Catalog";
export default function Cases() {
    return <div className="min-h-screen bg-background">
    <Navbar />
    <main className="max-w-6xl mx-auto px-4 pt-28 pb-20">
    <h1 className="text-3xl font-bold mb-8">Catálogo de projetos</h1>
    <Catalog />
    </main>
    </div>;
}
