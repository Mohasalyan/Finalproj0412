import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { setCredentials } from "@store/auth/authSlice";
import { toast } from "react-toastify";

import "../Auth.scss";
import { useRegisterMutation } from "@store/users/usersApiSlice";
import { AddAPhoto } from "@mui/icons-material";
import Logo from "@components/Layout/Logo/Logo";
import UniSelect from "@components/common/UniSelect/UniSelect";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isError, isLoading, error, isSuccess }] =
    useRegisterMutation();
  const { user, message } = useSelector((state) => state.auth);
  const isMdScreen = useMediaQuery("(max-width: 992px)");
  const [tempPhoto, setTempPhoto] = useState(null);
  const items = [
    { value: "buyer", text: "Buyer" },
    { value: "seller", text: "Seller" },
  ];
  const formik = useFormik({
    initialValues: {},
    validationSchema: yup.object({
      email: yup.string().required("Email is required"),
      username: yup.string().required("Username is required"),
      fullName: yup.string().required("Full Name is required"),
      role: yup.string().required("Role is required"),
      password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
      photo: yup.string().required("photo is required"),
      confirmPassword: yup
        .string()
        .required("Confirm Password is required")
        .oneOf([yup.ref("password"), null], "Passwords do not match"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("username", values.username);
      formData.append("fullName", values.fullName);
      formData.append("password", values.password);
      formData.append("role", values.role);
      formData.append("image", values.photo);
      const userData = await register(formData).unwrap();
      dispatch(setCredentials(userData));
    },
  });
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
      toast.error("Invalid image size or formal");
      return false;
    } else {
      formik.setFieldError("photo", null);
    }
    const url = URL.createObjectURL(file);
    formik.setFieldValue("photo", file);
    setTempPhoto(url);
  };

  useEffect(() => {
    if (isSuccess && user?.role) {
      navigate(user?.role === "seller" ? "/seller" : "/");
    }
    if (isError) {
      toast.error(error.data?.message);
    }
  }, [isSuccess, user?.role, isError]);
  return (
    <div className="auth register">
      <div className="container">
        <div className="auth-box">
          <Logo />
          <div className="auth-text">
            <Typography sx={{ fontSize: isMdScreen ? "1.7rem" : "2rem" }}>
              Register to our system
            </Typography>
          </div>
          <form onSubmit={formik.handleSubmit} className="auth-box-form">
            {/* Photo */}
            <Box
              component="div"
              sx={{
                width: "100%",
                height: "100%",
                p: 2,
                mb: 4,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
              }}>
              <Avatar
                id="photo"
                sx={{
                  width: { xs: 100 },
                  height: { xs: 100 },
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                src={tempPhoto}
              />
              <label
                style={{
                  position: "absolute",
                  left: "58%",
                  top: 10,
                  cursor: "pointer",
                  color: "#dfdfdf",
                }}>
                <AddAPhoto fontSize="small" />
                <input
                  type="file"
                  accept="image/png,image/jpg,image/jpeg"
                  multiple={false}
                  style={{ display: "none" }}
                  onChange={onImageChange}
                />
              </label>
              {formik.errors?.photo && (
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "red",
                    marginTop: 2,
                  }}>
                  {formik.errors?.photo}
                </Typography>
              )}
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              gap={2}
              marginBottom={2}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.email)}
                helperText={formik.errors.email}
              />
              <TextField
                name="username"
                label="Username"
                type="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.username)}
                helperText={formik.errors.username}
              />
              <TextField
                name="fullName"
                label="FullName"
                type="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.fullName)}
                helperText={formik.errors.fullName}
              />
              <TextField
                name="password"
                label="Password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.password)}
                helperText={formik.errors.password}
              />
              <TextField
                name="confirmPassword"
                label="ConfirmPassword"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.confirmPassword)}
                helperText={formik.errors.confirmPassword}
              />
              <UniSelect
                name="role"
                value={formik.values.role}
                items={items}
                selectTitle="role"
                handleChange={formik.handleChange}
                // size="small"
                cstStyle={{ flex: 1 }}
              />
            </Box>
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ marginY: 5 }}
              disabled={isLoading}>
              Register
            </Button>
            <Typography
              sx={{ fontSize: ".8rem", "& > a": { fontWeight: 900 } }}>
              Already have an account? <Link to="/login"> Login </Link>
            </Typography>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
