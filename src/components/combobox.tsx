"use client";

import { useState, useEffect, useRef } from "react";
import { useCombobox } from "downshift";
import { Input } from "@/components/ui/input";

interface Item {
  id: string;
  name: string;
}

interface PaginatedComboboxProps {
  items: Item[];
  itemsPerPage: number;
  onSelectedItemChange: (selectedItem: Item | null) => void;
  placeholder: string;
}

export function PaginatedCombobox({
  items,
  itemsPerPage,
  onSelectedItemChange,
  placeholder,
}: PaginatedComboboxProps) {
  //   const [inputItems, setInputItems] = useState(items);
  const [visibleItems, setVisibleItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    // setInputItems(items);
    setCurrentPage(1);
    setVisibleItems(items.slice(0, itemsPerPage));
  }, [items, itemsPerPage]);

  const loadMoreItems = () => {
    const nextPage = currentPage + 1;
    const startIndex = visibleItems.length;
    const endIndex = startIndex + itemsPerPage;
    const nextItems = items.slice(startIndex, endIndex);

    if (nextItems.length > 0) {
      setVisibleItems((prev) => [...prev, ...nextItems]);
      setCurrentPage(nextPage);
    }
  };

  const handleScroll = () => {
    if (dropdownRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = dropdownRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        loadMoreItems();
      }
    }
  };

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    items: visibleItems,
    onSelectedItemChange: ({ selectedItem }) =>
      onSelectedItemChange(selectedItem || null),
    itemToString: (item) => (item ? item.name : ""),
    onInputValueChange: ({ inputValue }) => {
      const filtered = items.filter((item) =>
        item.name.toLowerCase().includes(inputValue?.toLowerCase() || "")
      );
      //   setInputItems(filtered);
      setCurrentPage(1);
      setVisibleItems(filtered.slice(0, itemsPerPage));
    },
  });

  return (
    <div className="relative">
      <Input
        {...getInputProps()}
        placeholder={placeholder}
        className="w-full"
      />
      <ul
        {...getMenuProps()}
        ref={dropdownRef}
        className={`absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-60 overflow-auto rounded-lg shadow-md ${
          isOpen ? "" : "hidden"
        }`}
        onScroll={handleScroll}
      >
        {isOpen && visibleItems.length > 0 ? (
          visibleItems.map((item, index) => (
            <li
              key={item.id}
              {...getItemProps({ item, index })}
              className={`px-3 py-2 text-sm cursor-pointer ${
                highlightedIndex === index ? "bg-orange-500 text-white" : ""
              } ${selectedItem === item ? "font-semibold" : ""}`}
            >
              {item.name}
            </li>
          ))
        ) : (
          <li className="px-3 py-2 text-sm text-gray-500">No results found</li>
        )}
      </ul>
    </div>
  );
}
