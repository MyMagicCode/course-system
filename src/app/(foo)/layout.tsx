export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>foo layout</h1>
      {children}
    </div>
  );
}
