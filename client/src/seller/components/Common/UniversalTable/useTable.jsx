import react, { useState } from "react";

export const useTable = (props) => {
  const [rowsPerPage, setRowsPerPage] = useState(props ? +props.rows : 5);
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState("_id");
  const [order, setOrder] = useState("asc");

  const onSortClick = (e, property) => {
    setPage(0);
    setOrderBy(property);
    setOrder(order === "asc" ? "desc" : "asc");
  };
  return {
    page,
    rowsPerPage,
    setRowsPerPage,
    setOrderBy,
    setOrder,
    orderBy,
    order,
    setPage,
    onSortClick,
  };
};
