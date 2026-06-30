'use client';

import { Sidebar } from '@/components/dashboard/sidebar';
import { ParticlesBg } from '@/components/shared/particles-bg';
import dynamic from 'next/dynamic';



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <ParticlesBg />
      <Sidebar />
      <main className="lg:ml-[260px] relative z-10 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 pt-20 lg:pt-8 max-w-[1600px]">
          {children}
        </div>
      </main>
    </div>
  );
}
