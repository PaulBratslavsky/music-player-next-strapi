import { BackgroundImage } from "@/components/custom/BackgroundImage";

export default function AuthLayout({ children }: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-900">
      <BackgroundImage backgroundImage="https://thoughtful-chickens-9661b5da26.media.strapiapp.com/paulbratslavsky_cyberpunk_girl_in_the_style_of_bladerunner_movi_55050682_5a79_4025_be2f_d92e07aa9c99_74468dcf36.png" />
      <div className="z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
