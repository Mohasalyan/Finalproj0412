import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";

import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { toast } from "react-toastify";

import "../Auth.scss";
import { useLoginMutation } from "@store/users/usersApiSlice";
import { setCredentials } from "@store/auth/authSlice";
import Logo from "@components/Layout/Logo/Logo";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [login, { isError, error, isLoading, isSuccess }] = useLoginMutation();
  const isMdScreen = useMediaQuery("(max-width: 992px)");
  const formik = useFormik({
    initialValues: {},
    validationSchema: yup.object({
      username: yup.string().required("username is required"),
      password: yup.string().required("password is required"),
    }),
    onSubmit: async (values) => {
      const userData = await login(values).unwrap();
      dispatch(setCredentials(userData));
    },
  });
  useEffect(() => {
    if (isSuccess && user?.role) {
      navigate(user?.role === "seller" ? "/seller" : "/");
    }
  }, [isSuccess, user?.role]);
  useEffect(() => {
    if (isError) {
      toast.error(error.data?.message);
    }
  }, [isError]);

  return (
    <div className="auth">
      <div className="container">
        <div className="auth-box">
          <Logo />
          <div className="auth-text">
            <Typography sx={{ fontSize: isMdScreen ? "1.7rem" : "2rem" }}>
              Login to our system
            </Typography>
          </div>
          <form onSubmit={formik.handleSubmit} className="auth-box-form">
            <Box
              display={"flex"}
              flexDirection={"column"}
              gap={2}
              marginBottom={2}
              width={"100%"}>
              <TextField
                name="username"
                label="Username"
                type="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.username)}
                helperText={formik.errors.username}
                fullWidth
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
            </Box>
            <Button
              type="submit"
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ marginY: 5 }}
              disabled={isLoading}>
              Login
            </Button>
            <Typography
              sx={{ fontSize: ".8rem", "& > a": { fontWeight: 900 } }}>
              Don't have an account? <Link to="/register"> Register </Link>
            </Typography>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
