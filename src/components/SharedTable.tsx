
import { Table, TableBody, TableRow } from "@/components/ui/table";
import { ColumnDef, TableRow as ITableRow, TableName, TableData } from "@/types/table";
import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { TableHeader } from "./table/TableHeader";
import { InputRow } from "./table/InputRow";
import { TableCellComponent } from "./table/TableCell";
import { TableCell } from "./ui/table";
import { Database } from "@/integrations/supabase/types";
import { useCallback } from "react";

interface SharedTableProps<T extends TableName> {
  data: ITableRow[];
  columns: ColumnDef[];
  tableName: T;
  idField: string;
}

type UpdateVariables = {
  rowId: string;
  field: string;
  value: any;
};

type SortConfig = {
  field: string;
  direction: "asc" | "desc";
};

type Tables = Database['public']['Tables'];

type UndoRedoState = {
  rowId: string;
  field: string;
  oldValue: any;
  newValue: any;
};

function SharedTable<T extends TableName>({ data: initialData, columns, tableName, idField }: SharedTableProps<T>) {
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<SortConfig>({ field: "created_at", direction: "desc" });
  const [data, setData] = useState(initialData);
  const [newRecord, setNewRecord] = useState<Partial<TableData<T>>>({});
  const [undoStack, setUndoStack] = useState<UndoRedoState[]>([]);
  const [redoStack, setRedoStack] = useState<UndoRedoState[]>([]);
  const [editedValues, setEditedValues] = useState<Record<string, any>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    let sortedData = [...initialData];
    
    if (sort.field) {
      sortedData.sort((a, b) => {
        const aVal = a[sort.field];
        const bVal = b[sort.field];
        return sort.direction === "asc"
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }
    setData(sortedData);
  }, [initialData, sort]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undoStack, redoStack]);

  const updateMutation = useMutation({
    mutationKey: [tableName, 'update'],
    mutationFn: async ({ rowId, field, value }: UpdateVariables) => {
      type TableUpdate = Tables[T]['Update'];
      const table = supabase.from(tableName);
      const updateData = { [field]: value } as TableUpdate;
      
      const { error } = await (table as any)
        .update(updateData)
        .eq(idField, rowId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName.replace(/^\w+/, "").toLowerCase()] });
      setEditingRow(null);
      setEditedValues({});
    },
  });

  const createMutation = useMutation({
    mutationKey: [tableName, 'create'],
    mutationFn: async (record: Partial<TableData<T>>) => {
      type TableInsert = Tables[T]['Insert'];
      const table = supabase.from(tableName);
      const insertData = record as unknown as TableInsert;
      
      const { data, error } = await (table as any)
        .insert([insertData])
        .select();
      
      if (error) throw error;
      
      if (tableName === 'a1organizations' && data?.[0]?.organization_id) {
        const { error: folderError } = await supabase.functions.invoke('create-org-folders', {
          body: { organization_id: data[0].organization_id }
        });
        
        if (folderError) {
          console.error('Error creating folders:', folderError);
          toast.error("Organization created but failed to create folders");
          throw folderError;
        }
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [tableName.replace(/^\w+/, "").toLowerCase()] });
      setNewRecord({});
      toast.success("Record created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create record: " + error.message);
    }
  });

  const handleSort = (field: string, direction: "asc" | "desc") => {
    setSort({ field, direction });
    setActiveFilter(null);
  };

  const handleAdd = () => {
    const missingFields = columns
      .filter(col => col.required && !newRecord[col.field])
      .map(col => col.header);

    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    createMutation.mutate(newRecord);
  };

  const handleInputChange = (field: string, value: any) => {
    setNewRecord(prev => ({ ...prev, [field]: value }));
  };

  const handleRowClick = useCallback((rowId: string) => {
    if (editingRow === rowId) {
      return;
    }
    setEditingRow(rowId);
    setEditedValues({});
  }, [editingRow]);

  const handleCellUpdate = (field: string, value: any) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (rowId: string) => {
    const row = data.find(r => r.id === rowId);
    if (!row) return;

    Object.entries(editedValues).forEach(([field, newValue]) => {
      const oldValue = row[field];
      if (oldValue !== newValue) {
        updateMutation.mutate({ rowId, field, value: newValue });
        setUndoStack(prev => [...prev, { rowId, field, oldValue, newValue }]);
        setRedoStack([]);
      }
    });
  };

  const handleUndo = () => {
    const lastChange = undoStack[undoStack.length - 1];
    if (!lastChange) return;

    const { rowId, field, oldValue } = lastChange;
    updateMutation.mutate({ rowId, field, value: oldValue });
    
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, lastChange]);
  };

  const handleRedo = () => {
    const lastUndo = redoStack[redoStack.length - 1];
    if (!lastUndo) return;

    const { rowId, field, newValue } = lastUndo;
    updateMutation.mutate({ rowId, field, value: newValue });
    
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, lastUndo]);
  };

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (editingRow) {
      const target = e.target as HTMLElement;
      const isSelectContent = target.closest('.select-content');
      const isActiveRow = target.closest('tr')?.dataset.rowId === editingRow;
      
      if (!isSelectContent && !isActiveRow) {
        setEditingRow(null);
        setEditedValues({});
      }
    }
  }, [editingRow]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div>
      <InputRow
        columns={columns}
        newRecord={newRecord}
        handleInputChange={handleInputChange}
        handleAdd={handleAdd}
      />

      <Table>
        <TableHeader
          columns={columns}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          handleSort={handleSort}
          searchInputRef={searchInputRef}
        />
        <TableBody className="bg-white">
          {data.map((row) => (
            <TableRow 
              key={row.id}
              onClick={() => handleRowClick(row.id)}
              data-row-id={row.id}
              className="cursor-pointer hover:bg-gray-50/80"
            >
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  className="text-[#2A2A2A]"
                >
                  <TableCellComponent
                    row={row}
                    column={column}
                    isEditing={editingRow === row.id}
                    onUpdate={(value) => handleCellUpdate(column.field, value)}
                    onSave={() => handleSave(row.id)}
                    onCancel={() => {
                      setEditingRow(null);
                      setEditedValues({});
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default SharedTable;
