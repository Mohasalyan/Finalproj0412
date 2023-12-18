import {
  useGetUsersQuery,
  useLoginMutation,
  useProfileQuery,
} from "@store/users/usersApiSlice";
import { setProfile } from "@store/users/usersSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, Navigate, Outlet, useNavigate } from "react-router-dom";

const RequireAuth = ({ allowedRole }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, notFound, loading, token } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.users);
  const location = useLocation();
  const { data: profileData, isError, refetch } = useProfileQuery(token);

  useEffect(() => {
    dispatch(setProfile(profileData));
  }, [profileData]);
  useEffect(() => {
    refetch();
  }, []);
  useEffect(() => {
    if (isError && !profileData) {
      navigate("/login");
    }
  }, [isError]);

  return allowedRole.includes(user?.role) ? (
    <>
      <Outlet />
    </>
  ) : user ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <>
      <Navigate to="/" state={{ from: location }} replace />
    </>
  );
};

export default RequireAuth;
