import React from "react";
import HeroSection from "@/components/custom/HeroSection";
import MusicSection from "@/components/custom/MusicSection";

interface SearchParamsProps {
  searchParams?: {
    page?: string;
    query?: string;
  };
}

export default async function Home({ searchParams }: Readonly<SearchParamsProps>) {
  const currentPage = Number(searchParams?.page) || 1;
  const query = searchParams?.query ?? "";  
  return (
    <React.Fragment>
      <HeroSection /> 
      <MusicSection page={currentPage} query={query} />
    </React.Fragment>
  );
}
