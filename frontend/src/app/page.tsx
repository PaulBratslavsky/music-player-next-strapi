import React from "react";
import type { Metadata } from 'next'
import { getHomeMetadata } from "@/data/loader";
import { HeroSection } from "@/components/custom/HeroSection";
import { MusicSection } from "@/components/custom/MusicSection";
import { cookies } from "next/headers";

interface SearchParamsProps {
  searchParams?: {
    page?: string;
    query?: string;
  };
}


export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomeMetadata();
  
  return {
      title: page?.title ?? "Music App",
      description: page.description && "Create, Share, Chat and Listen to your favorite music",
  }
}

export default async function Home({
  searchParams,
}: Readonly<SearchParamsProps>) {
  const currentPage = Number(searchParams?.page) || 1;
  const query = searchParams?.query ?? "";
  return (
    <React.Fragment>
      <HeroSection />
      <MusicSection page={currentPage} query={query} />
    </React.Fragment>
  );
}
