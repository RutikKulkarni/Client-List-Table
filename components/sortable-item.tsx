"use client";

import type React from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import type { SortCriteria, SortField } from "@/types/client";
import { FiMenu, FiX, FiChevronUp, FiChevronDown } from "react-icons/fi";

interface SortableItemProps {
  id: SortField;
  criteria: SortCriteria;
  option: { field: SortField; label: string; icon: React.ReactNode };
  onToggleDirection: (field: SortField) => void;
  onRemove: (field: SortField) => void;
  priority: number;
}

export function SortableItem({
  id,
  criteria,
  option,
  onToggleDirection,
  onRemove,
  priority,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getDirectionLabel = () => {
    if (criteria.field === "name" || criteria.field === "id") {
      return criteria.direction === "asc" ? "A-Z" : "Z-A";
    }
    return criteria.direction === "asc"
      ? "Oldest to Newest"
      : "Newest to Oldest";
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 bg-white border rounded-md shadow-sm"
    >
      <div className="flex items-center gap-2">
        <span className="text-xs bg-blue-100 text-blue-700 rounded-full w-5 h-5 flex items-center justify-center font-medium">
          {priority}
        </span>
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
        >
          <FiMenu className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      <div className="flex items-center gap-2 flex-1">
        {option.icon}
        <span className="text-sm font-medium">{option.label}</span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggleDirection(criteria.field)}
          className="h-8 px-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
        >
          {criteria.direction === "asc" ? (
            <FiChevronUp className="h-3 w-3 mr-1" />
          ) : (
            <FiChevronDown className="h-3 w-3 mr-1" />
          )}
          {getDirectionLabel()}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(criteria.field)}
          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
        >
          <FiX className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
