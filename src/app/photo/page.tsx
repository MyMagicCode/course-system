import Link from "next/link";

export default function Photo() {
  return (
    <div>
      <h2>photo page</h2>
      <Link href="/photo/photo-view/3">photo view</Link>
    </div>
  );
}
