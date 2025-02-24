
import { Table } from "@/components/ui/table";
import { ColumnDef, TableRow as ITableRow, TableName } from "@/types/table";
import { useState, useEffect, useRef, useCallback } from "react";
import { TableActions } from "./table/TableActions";
import { TableContent } from "./table/TableContent";
import { useTableMutations } from "./table/TableMutations";

interface SharedTableProps<T extends TableName> {
  data: ITableRow[];
  columns: ColumnDef[];
  tableName: T;
  idField: string;
}

function SharedTable<T extends TableName>({ 
  data: initialData, 
  columns, 
  tableName, 
  idField 
}: SharedTableProps<T>) {
  const [activeCell, setActiveCell] = useState<{ rowId: string; field: string } | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sort, setSort] = useState({ field: "created_at", direction: "desc" as "asc" | "desc" });
  const [data, setData] = useState(initialData);
  const [newRecord, setNewRecord] = useState<Record<string, any>>({});
  const [undoStack, setUndoStack] = useState<Array<{ rowId: string; field: string; oldValue: any; newValue: any }>>([]);
  const [redoStack, setRedoStack] = useState<Array<{ rowId: string; field: string; oldValue: any; newValue: any }>>([]);
  const [editedValues, setEditedValues] = useState<Record<string, any>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { updateMutation, createMutation } = useTableMutations(tableName, idField);

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
    setNewRecord({});
  };

  const handleInputChange = (field: string, value: any) => {
    setNewRecord(prev => ({ ...prev, [field]: value }));
  };

  const handleCellClick = useCallback((rowId: string, field: string) => {
    if (activeCell && (activeCell.rowId !== rowId || activeCell.field !== field)) {
      if (Object.keys(editedValues).length > 0) {
        handleSave(activeCell.rowId, activeCell.field);
      }
      setActiveCell({ rowId, field });
      setEditedValues({});
    } else if (!activeCell) {
      setActiveCell({ rowId, field });
      setEditedValues({});
    }
  }, [activeCell, editedValues]);

  const handleCellUpdate = (field: string, value: any) => {
    setEditedValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (rowId: string, field: string) => {
    if (!editedValues[field]) return;
    
    const row = data.find(r => r.id === rowId);
    if (!row) return;

    const newValue = editedValues[field];
    const oldValue = row[field];
    
    if (oldValue !== newValue) {
      updateMutation.mutate({ rowId, field, value: newValue });
      setUndoStack(prev => [...prev, { rowId, field, oldValue, newValue }]);
      setRedoStack([]);
    }
    
    setActiveCell(null);
    setEditedValues({});
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeCell) {
        const target = e.target as HTMLElement;
        const isSelectContent = target.closest('.select-content');
        const cellElement = target.closest('[data-cell-id]') as HTMLElement | null;
        const isActiveCell = cellElement?.dataset.cellId === `${activeCell.rowId}-${activeCell.field}`;
        
        if (!isSelectContent && !isActiveCell) {
          if (editedValues[activeCell.field]) {
            handleSave(activeCell.rowId, activeCell.field);
          }
          setActiveCell(null);
          setEditedValues({});
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeCell, editedValues]);

  return (
    <div>
      <TableActions
        columns={columns}
        newRecord={newRecord}
        handleInputChange={handleInputChange}
        handleAdd={handleAdd}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        handleSort={handleSort}
        searchInputRef={searchInputRef}
      />
      
      <Table>
        <TableContent
          data={data}
          columns={columns}
          activeCell={activeCell}
          handleCellUpdate={handleCellUpdate}
          handleSave={handleSave}
          handleCellClick={handleCellClick}
        />
      </Table>
    </div>
  );
}

export default SharedTable;
