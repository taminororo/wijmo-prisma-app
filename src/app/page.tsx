'use client';
import dynamic from 'next/dynamic'

const FlexGrid = dynamic(
  () => {
    return import("../../components/FlexGrid").then((mod) => mod.default);
  },
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <h1 className="mt-2.5 mb-2.5 text-sky-500 text-4xl font-bold">
        Wijmo×Prisma CRUDサンプル
      </h1>
      <FlexGrid></FlexGrid>
    </>
  )
}