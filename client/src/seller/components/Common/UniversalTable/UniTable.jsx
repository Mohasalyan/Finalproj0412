import {
  Table,
  TableRow,
  TableCell,
  TableContainer,
  TableBody,
  Typography,
  Paper,
  TablePagination,
  useTheme,
  Button,
  Stack,
  Box,
} from "@mui/material";
import dayjs from "dayjs";
import { sortTable } from "@src/utils/sortTable";
import EnhancedTableHead from "./EnhancedTableHead/EnhancedTableHead";
import { useTable } from "./useTable";
import { useDispatch, useSelector } from "react-redux";
import Loading from "@components/common/Loading/Loading";
import { Chat } from "@mui/icons-material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link } from "react-router-dom";

const UniTable = ({
  data = [],
  headers,
  title,
  loading,
  noDataMsg,
  confirmActionHandler,
  rejectActionHandler,
  clickHandler,
}) => {
  const theme = useTheme();
  const { pageTitle } = useSelector((state) => state.settings);

  const {
    page,
    rowsPerPage,
    order,
    orderBy,
    setRowsPerPage,
    setPage,
    onSortClick,
  } = useTable();

  // Cell Content Func for custom content
  const datesText = ["addedAt", "createdAt", "date", "startDate", "endDate"];
  const imgTxt = ["photo", "image", "img"];
  const deleteAction = ["SellerProducts"];

  const cellContentHandler = ({ header, item, title }) => {
    if (datesText.includes(header.id)) {
      return dayjs(item[header.id]).format("DD-MM-YYYY");
    } else if (header.id === "_id") {
      return (
        <Typography
          onClick={() => clickHandler(item[header.id])}
          className="pointer"
          sx={{ fontWeight: 600, fontSize: 12, textDecoration: "underline" }}>
          <VisibilityIcon sx={{ fontSize: 15 }} />
        </Typography>
      );
    } else if (header.id === "image") {
      return (
        <img
          src={`${import.meta.env.VITE_API_URL}/${item[header.id]}`}
          alt="image"
          width={50}
        />
      );
    } else if (header.id === "mqActions") {
      return (
        <Stack direction={"row"} spacing={2}>
          <Button
            variant="outlined"
            color="success"
            size="small"
            sx={{ fontSize: 10 }}
            onClick={() => confirmActionHandler(item)}
            disabled={item.status === "accepted"}>
            Accept
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            sx={{ fontSize: 10 }}
            onClick={() => rejectActionHandler(item)}
            disabled={item.status === "rejected"}>
            Reject
          </Button>
        </Stack>
      );
    } else if (header.id === "productActions") {
      return (
        <Stack direction={"row"} spacing={2}>
          <Button
            variant="outlined"
            color="success"
            size="small"
            sx={{ fontSize: 10 }}
            onClick={() => confirmActionHandler(item)}
            disabled={item.status === "used"}>
            Used
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            sx={{ fontSize: 10 }}
            onClick={() => rejectActionHandler(item)}>
            Delete
          </Button>
        </Stack>
      );
    } else if (header.id === "chatBtn") {
      return (
        <Button
          variant="outlined"
          color="success"
          size="small"
          sx={{ fontSize: 10 }}
          onClick={() => confirmActionHandler(item)}
          disabled={item.status !== "accepted"}
          startIcon={<Chat />}>
          <Link to={`/chat/${item.productId}`}>
            Chat with {item.sender.username}
          </Link>
        </Button>
      );
    } else if (imgTxt.includes(header.id)) {
      return (
        <img
          src={item[header.id]}
          alt="room"
          width={50}
          style={{ borderRadius: header.id === "photo" ? "50%" : "unset" }}
        />
      );
    } else if (header.id === "category") {
      return item[header.id]?.name;
    } else if (header.id === "sender") {
      return item[header.id]?.username;
    } else if (header.id === "color") {
      return (
        <Box
          sx={{
            background: item[header.id],
            width: "20px",
            height: "20px",
            borderRadius: 50,
          }}
        />
      );
    } else {
      return item[header.id];
    }
  };

  return (
    <>
      <Typography
        variant="h6"
        color={theme.palette.secondary[400]}
        border={`1px solid ${theme.palette.secondary[400]}`}
        borderBottom={"unset"}
        borderRadius={"10px 10px 0 0"}
        width="fit-content"
        px={2}
        py={1}
        fontSize={12}>
        {title}
      </Typography>
      <Paper
        sx={{
          backgroundColor: theme.palette.primary[600],
          borderTop: `1px solid ${theme.palette.secondary[500]}`,
        }}>
        <TableContainer>
          <div style={{ overflowX: "auto", width: "100%" }}>
            <Table>
              <EnhancedTableHead
                headers={headers}
                order={order}
                orderBy={orderBy}
                onSortClick={onSortClick}
              />
              <TableBody>
                {loading ? (
                  <Loading height="small" />
                ) : data.length < 1 ? (
                  <Typography
                    sx={{
                      textAlign: "right",
                      py: 4,
                      color: "#999",
                      textTransform: "capitalize",
                    }}>
                    {noDataMsg}
                  </Typography>
                ) : (
                  sortTable(data, order, orderBy)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item) => {
                      return (
                        <TableRow
                          key={item._id}
                          hover
                          onDoubleClick={() => clickHandler(item?._id)}>
                          {headers.map((header) => (
                            <TableCell
                              key={header.id}
                              align="left"
                              sx={{ maxWidth: "200px" }}
                              className="smallTxt">
                              {cellContentHandler({ header, item })}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </div>
          <TablePagination
            component={"div"}
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            rowsPerPageOptions={data?.length >= 20 ? [5, 10, 20] : [5, 10]}
            onPageChange={(e, page) => {
              setPage(page);
            }}
            onRowsPerPageChange={(e) => {
              setPage(0);
              setRowsPerPage(e.target.value);
            }}
            sx={{
              marginRight: 4,
              display: "flex",
              justifyContent: "flex-start",
              color: "#777",
              "& .MuiTablePagination-actions": {
                display: "flex",
                flexDirection: "row",
              },
            }}
          />
        </TableContainer>
      </Paper>
    </>
  );
};

export default UniTable;
