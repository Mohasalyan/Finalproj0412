import * as yup from "yup";
import { AddAPhoto } from "@mui/icons-material";
import { Box, Button, Grid, Stack, TextField, styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import emptyPhoto from "@assets/emptyImage.webp";
import {
  useCreateProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
} from "@store/Products/productsApiSlice";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { setProduct } from "@store/seller/sellerSlice";
import SmallTitle from "@seller/components/Common/SmallTitle/SmallTitle";
import UniSelect from "@components/common/UniSelect/UniSelect";
import UniEditor from "@seller/components/Common/Editor/Editor";

const CustomImg = styled("img")(({ theme }) => ({
  width: "100%",
  height: "100%",
  objectFit: "contain",
}));

function CreateProductFrom({ create, productSuccess, productData }) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const { productDetails } = useSelector((state) => state.seller.products);
  const { categories } = useSelector((state) => state.seller.category);

  // Create & Update
  const [createProduct, { isLoading, isSuccess, isError, error }] =
    useCreateProductMutation();
  const [
    updateProduct,
    {
      isLoading: updateLoading,
      isSuccess: updated,
      isError: updateIsError,
      error: updateError,
    },
  ] = useUpdateProductMutation();

  // Handling Form
  const formik = useFormik({
    initialValues: {
      name: productData?.name || "",
      image: productData?.image || "",
      status: productData?.status || "",
      price: productData?.price || "",
      color: productData?.color || "",
      tips: productData?.tips || "",
      option: productData?.option || "",
      category: productData?.category?.name,
      imageFile: productData?.image || "",
    },
    validationSchema: yup.object({
      name: yup.string().required("name is required"),
      imageFile: yup.string().required("image is required"),
      color: yup.string(),
      status: yup.string().required("status is required"),
      option: yup.string().required("option is required"),
      tips: yup.string(),
      price: yup.number().required("price is required"),
      category: yup.string().required("category is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("status", values.status);
      formData.append("color", values.color);
      formData.append("price", values.price);
      formData.append("option", values.option);
      formData.append("category", values.category);
      formData.append("image", values.imageFile);
      formData.append("tips", values.tips);
      const productData = create
        ? await createProduct({ token, data: formData }).unwrap()
        : await updateProduct({
            token,
            params: { id },
            data: formData,
          }).unwrap();
      if (productData) {
        toast.success("Done!");
        navigate("/seller");
      }
    },
  });
  // On Image Change
  const onImageChange = (e) => {
    if (e.target.files.length <= 0) {
      return false;
    }
    const file = e.target.files[0];
    const validExtension = new RegExp("^image/(jpeg|png|jpg)$", "ig").test(
      file.type
    );
    const validSize = file.size <= 512 * 1024;
    if (!validExtension || !validSize) {
      return false;
    }
    const url = URL.createObjectURL(file);
    document.getElementById("photo").src = url;
    // setTempPhoto(file);
    formik.setFieldValue("imageFile", file);
    // formik.setFieldValue("image", file);
  };
  useEffect(() => {
    if (productSuccess || productData) {
      formik.setFieldValue("name", productData.name);
      formik.setFieldValue("color", productData.color);
      formik.setFieldValue("status", productData.status);
      formik.setFieldValue("imageFile", productData.image);
      formik.setFieldValue("price", productData.price);
      formik.setFieldValue("option", productData.option);
      formik.setFieldValue("tips", productData.tips);
      formik.setFieldValue("category", productData.category?._id);
      dispatch(setProduct(productData));
    }
    if (isError) {
      toast.error(error);
    }
  }, [isError, productSuccess, productData]);
  const statusOptions = [
    { value: "new", text: "New" },
    { value: "used", text: "Used" },
  ];
  const typeOptions = [
    { value: "sale", text: "Sale" },
    { value: "swap", text: "Swap" },
    { value: "both", text: "Both" },
  ];
  const categoriesOptions = categories?.map((item) => ({
    value: item._id,
    text: item.name,
    image: item.icon,
  }));
  return (
    <form className="product" onSubmit={formik.handleSubmit}>
      <div className="container">
        <Grid container spacing={3} sx={{ paddingBottom: "5rem" }}>
          {/* Start Image */}
          <Grid item xs={12} md={4} sx={{ height: "50vh" }}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                border: "1px solid #dedede",
                borderRadius: 3,
                p: 3,
              }}>
              <CustomImg
                id="photo"
                src={
                  productDetails?.image
                    ? `${import.meta.env.VITE_API_URL}/${productDetails?.image}`
                    : emptyPhoto
                }
              />
              <label
                style={{
                  position: "absolute",
                  top: 20,
                  left: 20,
                  color: "#dfdfdf",
                  cursor: "pointer",
                }}>
                <AddAPhoto fontSize="large" />
                <input
                  type="file"
                  multiple={false}
                  accept="image/jpeg,image/jpg,image/png"
                  style={{ display: "none" }}
                  onChange={onImageChange}
                />
              </label>
            </Box>
          </Grid>
          {/* End Image */}
          {/* Start Product Info */}
          <Grid item xs={12} md={8}>
            <TextField
              name="name"
              label="Name"
              type="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.name)}
              helperText={formik.errors.name}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              name="color"
              label="Color"
              type="color"
              value={formik.values.color}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.color)}
              helperText={formik.errors.color}
              fullWidth
            />
            <Stack direction={"row"} spacing={2} my={2}>
              <UniSelect
                name="status"
                value={formik.values.status}
                items={statusOptions}
                selectTitle="status"
                handleChange={formik.handleChange}
                error={formik.errors.status}
                cstStyle={{ flex: 1 }}
              />
              <UniSelect
                name="option"
                value={formik.values.option}
                items={typeOptions}
                selectTitle="Type"
                handleChange={formik.handleChange}
                cstStyle={{ flex: 1 }}
                error={formik.errors.option}
              />
            </Stack>
            <UniSelect
              name="category"
              value={formik.values.category}
              items={categoriesOptions}
              selectTitle="Category"
              handleChange={formik.handleChange}
              img={true}
              cstStyle={{ flex: 1 }}
              error={formik.errors.category}
            />
            <TextField
              name="price"
              label="Price"
              type="price"
              value={formik.values.price}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.price)}
              helperText={formik.errors.price}
              fullWidth
              sx={{ mt: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <SmallTitle text="Tips" />
            <UniEditor
              name="tips"
              editorHtml={formik.values.tips}
              setEditorHtml={formik.handleChange}
              setFieldValue={formik.setFieldValue}
            />
          </Grid>
        </Grid>

        <div className="flex-center">
          <Button
            type="submit"
            variant="outlined"
            size="small"
            sx={{ margin: "auto" }}
            disabled={isLoading || updateLoading}>
            {create ? "Create" : "Update"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default CreateProductFrom;
