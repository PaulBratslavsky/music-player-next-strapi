import React from "react";
import type { Metadata } from "next";
import { getHomeMetadata } from "@/data/loader";
import { HeroSection } from "@/components/custom/HeroSection";
import { MusicSection } from "@/components/custom/MusicSection";

interface SearchParamsProps {
  searchParams?: Promise<{
    page?: string;
    query?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomeMetadata();

  return {
    title: page?.title ?? "Music App",
    description: page?.description ?? "Create, Share, Chat and Listen to your favorite music",
  };
}

export default async function Home({
  searchParams,
}: Readonly<SearchParamsProps>) {
  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const query = params?.query ?? "";
  return (
    <React.Fragment>
      <HeroSection />
      <MusicSection page={currentPage} query={query} />
    </React.Fragment>
  );
}
