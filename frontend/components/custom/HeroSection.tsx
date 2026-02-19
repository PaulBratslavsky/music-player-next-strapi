import { Search } from "./Search";
import { getHomePageData } from "@/data/loader";
import { BackgroundImage } from "./BackgroundImage";

export async function HeroSection() {
  const data = await getHomePageData();
  const hero = data?.hero;
  const backgroundImage = hero?.imageBackground?.url;

  return (
    <header className="relative h-[450px] overflow-hidden">
      {backgroundImage && <BackgroundImage backgroundImage={backgroundImage} />}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white bg-black/60">
        <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
          {hero?.heading ?? "Music Buddy"}
        </h1>
        <p className="mt-4 text-lg md:text-xl lg:text-2xl mb-4">
          {hero?.text ?? "Discover and listen to music"}
        </p>
        <div className="container sm:w-full md:w-[575px] text-pink-600 font-semibold">
          <Search />
        </div>
      </div>
    </header>
  );
}
