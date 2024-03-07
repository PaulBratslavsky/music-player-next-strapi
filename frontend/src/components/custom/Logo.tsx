import Link from "next/link";

export function Logo({ dark = false }) {
  return (
    <Link className="flex items-center gap-2" href="/">
      <span className="text-lg font-semibold">Music Buddy</span>
    </Link>
  );
}
