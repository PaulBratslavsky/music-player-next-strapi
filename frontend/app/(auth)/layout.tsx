export default function AuthLayout({ children }: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-gray-100 dark:bg-gray-900">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-pink-900 z-0" />
      <div className="z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
