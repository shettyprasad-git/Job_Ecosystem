import { Rocket } from 'lucide-react';

export default function ShipPage() {
  return (
    <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center justify-center">
      <div className="bg-emerald-100 p-8 rounded-full">
        <Rocket className="h-16 w-16 text-emerald-600" />
      </div>
      <h1 className="mt-8 text-4xl font-bold tracking-tight text-slate-900">
        Ready for Deployment
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-500 leading-relaxed">
        All pre-shipment checks have passed. You are clear to proceed with the deployment process.
      </p>
    </main>
  );
}
