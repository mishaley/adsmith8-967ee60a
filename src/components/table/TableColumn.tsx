
import { ColumnDef, TableRow, TableName, DbRecord, DbInsert } from "@/types/table";
import { Input } from "@/components/ui/input";
import { TableHeader } from "./TableHeader";
import { RefObject, useState } from "react";
import { useTableMutations } from "./TableMutations";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash } from "lucide-react";

interface TableColumnProps<T extends TableName> {
  column: ColumnDef;
  data: TableRow[];
  newRecord: Partial<DbInsert<T>>;
  handleInputChange: (field: keyof DbRecord<T>, value: any) => void;
  handleSort: (field: string) => void;
  handleFilter: (field: string, value: string) => void;
  clearFilter: (field: string) => void;
  filters: Record<string, string>;
  searchInputRef: RefObject<HTMLInputElement>;
  tableName: T;
  idField: keyof DbRecord<T>;
}

export function TableColumn<T extends TableName>({
  column,
  data,
  newRecord,
  handleInputChange,
  handleSort,
  handleFilter,
  clearFilter,
  filters,
  searchInputRef,
  tableName,
  idField
}: TableColumnProps<T>) {
  const [editingCell, setEditingCell] = useState<{ rowId: string | null, field: string | null }>({ rowId: null, field: null });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingRow, setDeletingRow] = useState<TableRow | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const { updateMutation } = useTableMutations(tableName, idField);

  const handleCellClick = (rowId: string, field: string) => {
    if (column.editable) {
      setEditingCell({ rowId, field });
    }
  };

  const handleCellBlur = (rowId: string, field: string, value: any) => {
    setEditingCell({ rowId: null, field: null });
    if (column.editable) {
      updateMutation.mutate({ 
        rowId, 
        field: field as keyof DbRecord<T>, 
        value 
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, rowId: string, field: string, value: any) => {
    if (e.key === 'Enter') {
      handleCellBlur(rowId, field, value);
    }
  };

  const handleDelete = (row: TableRow) => {
    setDeletingRow(row);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (deletingRow) {
      const oldData = { ...deletingRow } as unknown as Partial<DbRecord<T>>;
      updateMutation.mutate({
        rowId: deletingRow.id,
        field: idField,
        value: null,
        isDelete: true,
        oldData
      });
    }
    setShowDeleteDialog(false);
    setDeletingRow(null);
  };

  return (
    <div className="flex flex-col h-full">
      <Popover>
        <PopoverTrigger asChild>
          <div className="bg-[#154851] p-4 text-white text-[16px] whitespace-nowrap uppercase font-semibold cursor-pointer hover:bg-[#1a5a65] group">
            <TableHeader 
              column={column} 
              handleSort={handleSort} 
              handleFilter={handleFilter} 
              clearFilter={clearFilter} 
              filters={filters} 
              searchInputRef={searchInputRef} 
            />
          </div>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[var(--radix-popper-anchor-width)] p-0 rounded-none shadow-none border-0 mt-0 bg-[#2A2A2A] text-white" 
          align="start"
          side="bottom"
          sideOffset={0}
          avoidCollisions={false}
        >
          <div className="py-1">
            <TableHeader 
              column={column} 
              handleSort={handleSort} 
              handleFilter={handleFilter} 
              clearFilter={clearFilter} 
              filters={filters} 
              searchInputRef={searchInputRef}
              isPopoverContent={true}
            />
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex-1">
        <div className="bg-[#d3e4fd] p-4 mb-2">
          <Input 
            value={newRecord[column.field as keyof DbInsert<T>] || ""} 
            onChange={e => handleInputChange(column.field as keyof DbRecord<T>, e.target.value)} 
            className="h-10 bg-white w-full rounded-md border border-input"
          />
        </div>
        <div className="bg-white">
          {data.map(row => {
            const isEditing = editingCell.rowId === row.id && editingCell.field === column.field;
            const showDeleteButton = column.field === 'created_at' && hoveredRow === row.id;

            return (
              <div 
                key={row.id} 
                className={`p-4 border-b whitespace-nowrap cursor-pointer hover:bg-gray-50 ${isEditing ? 'ring-2 ring-inset ring-[#ecb652]' : ''} relative`}
                onClick={() => handleCellClick(row.id, column.field)}
                onMouseEnter={() => setHoveredRow(row.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {isEditing ? (
                  <div className="w-full relative">
                    <input
                      autoFocus
                      defaultValue={row[column.field]}
                      onBlur={(e) => handleCellBlur(row.id, column.field, e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, row.id, column.field, (e.target as HTMLInputElement).value)}
                      className="absolute inset-0 bg-transparent outline-none p-0 m-0 border-none focus:ring-0"
                    />
                    <div className="invisible">{row[column.field]}</div>
                  </div>
                ) : (
                  <div className="truncate">
                    {row[column.field]}
                    {showDeleteButton && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(row);
                        }}
                        className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#990000] border border-white flex items-center justify-center hover:bg-[#bb0000] transition-colors"
                      >
                        <Trash className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>DELETE THIS RECORD</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
