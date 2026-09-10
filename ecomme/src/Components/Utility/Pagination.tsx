/** @format */

import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";

export default function CustomIcons() {
  return (
    <div className="p-8 font-mono flex justify-center ">
      <Stack spacing={2}>
        <Pagination
          count={10}
          renderItem={(item) => <PaginationItem {...item} />}
          sx={{
            "& .MuiPaginationItem-root": {
              color: "white",
              fontSize: "1.25rem",
              width: 44,
              height: 44,
              "&:hover": {
                color: "black",
                backgroundColor: "white",
              },
            },
          }}
        />
      </Stack>
    </div>
  );
}
