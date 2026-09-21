/** @format */
import Pagination from "@mui/material/Pagination";

interface PaginationComponentProps {
  count?: number;
  page?: number;
  onPageChange?: (page: number) => void;
}

export default function PaginationComponent({
  count = 10,
  page,
  onPageChange,
}: PaginationComponentProps) {
  return (
    <div className="flex justify-center py-6">
      <Pagination
        count={count}
        page={page}
        onChange={(_, value) => onPageChange?.(value)}
        siblingCount={1}
        sx={{
          "& .MuiPaginationItem-root": {
            fontFamily: "inherit",
            fontSize: "1rem",
            fontWeight: 500,
            color: "#374151",
            minWidth: 40,
            height: 40,
            borderRadius: "0.5rem",
            transition: "background-color 0.2s, color 0.2s",
            "&:hover": {
              backgroundColor: "#f0f9ff",
              color: "#0284c7",
            },
            "&.Mui-selected": {
              backgroundColor: "#0ea5e9",
              color: "#ffffff",
              "&:hover": { backgroundColor: "#0284c7" },
            },
            "&.Mui-focusVisible": {
              outline: "2px solid rgba(56,189,248,0.6)",
            },
            "&.Mui-disabled": { opacity: 0.4 },
          },
        }}
      />
    </div>
  );
}
