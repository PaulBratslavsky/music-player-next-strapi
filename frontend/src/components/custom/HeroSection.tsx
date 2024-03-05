import { Search } from "./Search";

import { getHomePageData } from "@/data/loader";
import { StrapiImage } from "./StrapiImage";


export default async function HeroSection() {
  const data = await getHomePageData();
  const hero = data.hero;
  const avatarImage = hero.imageAvatar.url;
  const backgroundImage = hero.imageBackground.url;

  return (
    <header className="relative h-[450px] overflow-hidden">
      <StrapiImage
        alt="Background"
        className="absolute inset-0 object-cover w-full h-full aspect-auto"
        height={1080}
        width={1920}
        src={backgroundImage}
      />
      <div className="relative z-10  h-full flex flex-col items-center justify-center text-center text-white bg-black bg-opacity-30">
        <StrapiImage
          alt="Avatar of the author"
          className="h-48 w-48 rounded-full object-cover mb-6"
          src={avatarImage}
          height={300}
          width={300}
        />
        <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl ">
          {hero.heading}
        </h1>
        <p className="mt-4 text-lg md:text-xl lg:text-2xl mb-4">
          {hero.text}
        </p>
        <div className="container sm:w-full  md:w-[575px] text-pink-600 font-semibold">
          <Search />
        </div>
      </div>
    </header>
  );
}