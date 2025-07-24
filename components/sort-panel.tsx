"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { SortCriteria, SortField } from "@/types/client";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "@/components/sortable-item";
import {
  FiUser,
  FiCalendar,
  FiClock,
  FiHash,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";

interface SortPanelProps {
  sortCriteria: SortCriteria[];
  onSortCriteriaChange: (criteria: SortCriteria[]) => void;
  onClose: () => void;
}

interface SortOption {
  field: SortField;
  label: string;
  icon: React.ReactNode;
  options: {
    direction: "asc" | "desc";
    label: string;
    icon: React.ReactNode;
  }[];
}

const sortOptions: SortOption[] = [
  {
    field: "name",
    label: "Client Name",
    icon: <FiUser className="h-4 w-4" />,
    options: [
      {
        direction: "asc",
        label: "A-Z",
        icon: <FiChevronUp className="h-3 w-3" />,
      },
      {
        direction: "desc",
        label: "Z-A",
        icon: <FiChevronDown className="h-3 w-3" />,
      },
    ],
  },
  {
    field: "createdAt",
    label: "Created At",
    icon: <FiCalendar className="h-4 w-4" />,
    options: [
      {
        direction: "asc",
        label: "Oldest to Newest",
        icon: <FiChevronUp className="h-3 w-3" />,
      },
      {
        direction: "desc",
        label: "Newest to Oldest",
        icon: <FiChevronDown className="h-3 w-3" />,
      },
    ],
  },
  {
    field: "updatedAt",
    label: "Updated At",
    icon: <FiClock className="h-4 w-4" />,
    options: [
      {
        direction: "asc",
        label: "Oldest to Newest",
        icon: <FiChevronUp className="h-3 w-3" />,
      },
      {
        direction: "desc",
        label: "Newest to Oldest",
        icon: <FiChevronDown className="h-3 w-3" />,
      },
    ],
  },
  {
    field: "id",
    label: "Client ID",
    icon: <FiHash className="h-4 w-4" />,
    options: [
      {
        direction: "asc",
        label: "A-Z",
        icon: <FiChevronUp className="h-3 w-3" />,
      },
      {
        direction: "desc",
        label: "Z-A",
        icon: <FiChevronDown className="h-3 w-3" />,
      },
    ],
  },
];

export function SortPanel({
  sortCriteria,
  onSortCriteriaChange,
  onClose,
}: SortPanelProps) {
  const [tempCriteria, setTempCriteria] =
    useState<SortCriteria[]>(sortCriteria);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const applySortOption = (field: SortField, direction: "asc" | "desc") => {
    const filteredCriteria = tempCriteria.filter((c) => c.field !== field);
    const newCriteria: SortCriteria[] = [
      ...filteredCriteria,
      { field, direction: direction as "asc" | "desc" },
    ];
    setTempCriteria(newCriteria);
    onSortCriteriaChange(newCriteria);
  };

  const removeSortCriteria = (field: SortField) => {
    const newCriteria = tempCriteria.filter((c) => c.field !== field);
    setTempCriteria(newCriteria);
    onSortCriteriaChange(newCriteria);
  };

  const toggleDirection = (field: SortField) => {
    const newCriteria = tempCriteria.map((c) =>
      c.field === field
        ? { ...c, direction: c.direction === "asc" ? "desc" : "asc" }
        : c
    );
    setTempCriteria(newCriteria);
    onSortCriteriaChange(newCriteria);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = tempCriteria.findIndex((c) => c.field === active.id);
      const newIndex = tempCriteria.findIndex((c) => c.field === over.id);

      const newCriteria = arrayMove(tempCriteria, oldIndex, newIndex);
      setTempCriteria(newCriteria);
      onSortCriteriaChange(newCriteria);
    }
  };

  const clearAll = () => {
    setTempCriteria([]);
    onSortCriteriaChange([]);
  };

  const isFieldActive = (field: SortField) => {
    return tempCriteria.find((c) => c.field === field);
  };

  const getFieldDirection = (field: SortField) => {
    const criteria = tempCriteria.find((c) => c.field === field);
    return criteria?.direction;
  };

  return (
    <Card className="w-80 p-4 shadow-lg border bg-white">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">Sort By</h3>
          {tempCriteria.length > 0 && (
            <Button
              variant="ghost"
              onClick={clearAll}
              className="text-xs h-6 px-2"
            >
              Clear all
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {sortOptions.map((option) => {
            const activeCriteria = isFieldActive(option.field);
            const activeDirection = getFieldDirection(option.field);

            return (
              <div key={option.field} className="space-y-2">
                <div className="flex items-center gap-3">
                  {option.icon}
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
                <div className="ml-7 space-y-1">
                  {option.options.map((subOption) => {
                    const isActive =
                      activeCriteria && activeDirection === subOption.direction;

                    return (
                      <button
                        key={`${option.field}-${subOption.direction}`}
                        onClick={() =>
                          applySortOption(option.field, subOption.direction)
                        }
                        className={`flex items-center gap-2 w-full p-2 text-left rounded-md transition-colors text-sm ${
                          isActive
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "hover:bg-gray-50 text-gray-600"
                        }`}
                      >
                        {subOption.icon}
                        <span>{subOption.label}</span>
                        {isActive && (
                          <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {tempCriteria.length > 0 && (
          <div className="space-y-2 border-t pt-4">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Applied Sorts
            </h4>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={tempCriteria.map((c) => c.field)}
                strategy={verticalListSortingStrategy}
              >
                {tempCriteria.map((criteria, index) => {
                  const option = sortOptions.find(
                    (o) => o.field === criteria.field
                  )!;
                  return (
                    <SortableItem
                      key={criteria.field}
                      id={criteria.field}
                      criteria={criteria}
                      option={option}
                      onToggleDirection={toggleDirection}
                      onRemove={removeSortCriteria}
                      priority={index + 1}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>
    </Card>
  );
}
