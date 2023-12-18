import React from "react";
import { TableCell, TableHead, TableRow, TableSortLabel } from "@mui/material";

const EnhancedTableHead = ({
  headers = [],
  orderBy = "_id",
  order = "asc",
  onSortClick,
}) => {
  const createSortHandler = (property) => {
    return (e) => {
      onSortClick(e, property);
    };
  };
  return (
    <TableHead>
      <TableRow>
        {headers.map((header) => (
          <TableCell key={header.id} align="left" dir="ltr">
            <TableSortLabel
              active={header.id === orderBy}
              direction={header.id === orderBy ? order : "asc"}
              onClick={createSortHandler(header.id)}>
              {header.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};
export default EnhancedTableHead;