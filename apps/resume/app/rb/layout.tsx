import { BuildTrackProvider } from '@/components/build-track/BuildTrackProvider';

export default function RBLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <BuildTrackProvider>{children}</BuildTrackProvider>;
}
