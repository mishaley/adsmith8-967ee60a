
interface TableTextCellProps {
  value: string;
  onBlur: (value: string) => void;
  isCenter?: boolean;
}

export function TableTextCell({ value, onBlur, isCenter }: TableTextCellProps) {
  return (
    <div className="w-full" onClick={(e) => e.stopPropagation()}>
      <input
        autoFocus
        defaultValue={value}
        onBlur={(e) => onBlur(e.target.value)}
        className={`w-full bg-transparent outline-none focus:ring-0 text-base p-0 ${isCenter ? 'text-center' : 'text-left'}`}
      />
    </div>
  );
}
