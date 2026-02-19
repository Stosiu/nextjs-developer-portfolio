import {Button} from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-emerald-400 mb-4">404</h1>
      <p className="text-xl text-white/60 mb-8">Page not found</p>
      <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
        <a href="/">Go home</a>
      </Button>
    </div>
  );
}
