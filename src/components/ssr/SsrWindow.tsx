export function SsrWindow({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bevel-window bg-chrome p-1">
      <div className="titlebar-active flex items-center px-2 py-1">
        <span className="font-pixel text-sm font-bold">{title}</span>
      </div>
      <div className="bevel-field mt-1 bg-white p-4 sm:p-6">{children}</div>
    </div>
  );
}
