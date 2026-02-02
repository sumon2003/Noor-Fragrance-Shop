export default function Footer() {
  return (
    <footer className="mt-10">
      <div className="h-px bg-gradient-to-r from-transparent via-amber-300/25 to-transparent" />
      <div className="max-w-6xl mx-auto px-4 py-10 text-sm text-amber-50/60 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} Noor Attar</span>
        <span className="text-amber-200/50">Premium • Attar</span>
      </div>
    </footer>
  );
}
