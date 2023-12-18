import { Paper } from "@mui/material";
import CreateProductFrom from "@seller/components/Home/CreateProductFrom/CreateProductFrom";
import { useGetCategoriesQuery } from "@store/Products/productsApiSlice";
import { setSellerCategory } from "@store/seller/sellerSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import './style.scss'
function CreateProduct() {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const {
    data: categoriesData,
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  } = useGetCategoriesQuery(token);

  useEffect(() => {
    if (isError) {
      toast.error(error.data);
    }
    if (isSuccess) {
      dispatch(setSellerCategory(categoriesData));
    }
  }, [isError, isSuccess]);

  return (
    <div className="createProduct page-h">
      <div className="container">
        <Paper sx={{ py: 4 }}>
          <CreateProductFrom create={true} />
        </Paper>
      </div>
    </div>
  );
}

export default CreateProduct;
