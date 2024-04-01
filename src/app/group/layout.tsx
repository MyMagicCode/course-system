export default function Layout({
  children,
  team,
}: {
  children: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div>
      <h1>group layout</h1>
      {children}
      {team}
    </div>
  );
}
