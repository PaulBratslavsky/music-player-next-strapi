import { BackgroundImage } from "@/components/custom/BackgroundImage";

export default function AuthLayout({ children }: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-900">
      <BackgroundImage backgroundImage="/uploads/paulbratslavsky_cyberpunk_girl_in_the_style_of_bladerunner_movi_3e54ca01_3112_45ee_8660_0c8d09daf009_53caf9d901.png" />
      <div className="z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
