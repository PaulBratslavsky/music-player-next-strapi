import { StrapiImage } from "@/components/custom/StrapiImage";

export function BackgroundImage({ backgroundImage } : { readonly backgroundImage: string }) {
  return <StrapiImage
    alt="Background"
    className="absolute inset-0 object-cover w-full h-full aspect-auto z-0"
    height={1080}
    width={1920}
    src={backgroundImage}
  />
}
