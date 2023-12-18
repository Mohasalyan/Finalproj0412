import { AddAPhoto } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  FormLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { API_URL } from "@src/constants";
import { useUpdateProfileMutation } from "@store/users/usersApiSlice";
import { setProfile } from "@store/users/usersSlice";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as yup from "yup";

function ProfileForm() {
  const dispatch = useDispatch();
  const { user,token } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.users);

  // ################## RTK ##################
  const [updateProfile, { isSuccess, isLoading, isError, error }] =
    useUpdateProfileMutation();

  // ################## Formik ##################
  const formik = useFormik({
    initialValues: {
      email: profile?.email || "",
      fullName: profile?.fullName || "",
      username: profile?.username || "",
      photo: profile?.photo
        ? `${API_URL}/${profile.photo}`
        : "",
      file: "",
    },
    validationSchema: yup.object({
      email: yup.string(),
      fullName: yup.string(),
      username: yup.string(),
      photo: yup.string(),
      file: yup.string(),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("fullName", values.fullName);
      formData.append("username", values.username);
      formData.append("image", values.file);
      const profileData = await updateProfile({
        data: formData,
        token,
      });
      dispatch(setProfile(profileData.data));
    },
  });

  // ################## Image ##################
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
      formik.setFieldError("photo", "Invalid image size or formal");
      return false;
    } else {
      const url = URL.createObjectURL(file);
      formik.setFieldValue("photo", url);
      formik.setFieldValue("file", file);
      setTempPhoto(file);
    }
  };

  // ################## Handling Alerts ##################
  useEffect(() => {
    if (isError) {
      toast.error(error.data);
    }
    if (isSuccess) {
      toast.success("Updated");
    }
  }, [isError, isSuccess]);

  return (
    <div>
      <Box
        component={"form"}
        sx={{ display: "flex", flexFlow: "column", gap: 2 }}
        onSubmit={formik.handleSubmit}>
        {/* <FormLabel> {t("profile.sectionTitle")}</FormLabel> */}
        <Grid container spacing={2}>
          {/* Profile Photo */}
          <Grid xs={12} lg={4}>
            <Box
              component="div"
              sx={{
                width: "100%",
                height: "100%",
                p: 2,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Avatar
                id="photo"
                sx={{
                  width: 100,
                  height: 100,
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                src={formik.values.photo}
              />
              <label
                style={{
                  position: "absolute",
                  left: 10,
                  top: 10,
                  cursor: "pointer",
                  color: "#dfdfdf",
                }}>
                <AddAPhoto fontSize="large" />
                <input
                  type="file"
                  accept="image/png,image/jpg,image/jpeg"
                  multiple={false}
                  style={{ display: "none" }}
                  onChange={onImageChange}
                />
              </label>
            </Box>
            <Typography
              sx={{ fontSize: 12, color: "red", textAlign: "center" }}>
              {formik.errors.photo}
            </Typography>
          </Grid>
          {/* User Info */}
          <Grid
            xs={12}
            lg={8}
            sx={{
              "& > div": {
                mb: 2,
              },
            }}>
            <Box component="div">
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formik.values.email}
                // onChange={formik.handleChange}
                error={Boolean(formik.errors.email)}
                helperText={formik.errors.email}
                sx={{ width: "100%" }}
                disabled
              />
            </Box>
            <Box component="div">
              <TextField
                name="fullName"
                label="Full Name"
                type="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.fullName)}
                helperText={formik.errors.fullName}
                sx={{ width: "100%" }}
              />
            </Box>

            <Box component="div">
              <TextField
                name="username"
                label="Username"
                type="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.username)}
                helperText={formik.errors.username}
                sx={{ width: "100%" }}
              />
            </Box>
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              fullWidth
              disabled={isLoading}>
              Update
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default ProfileForm;
