import { useDispatch, useSelector } from "react-redux";
import ProfileForm from "@components/Profile/ProfileForm/ProfileForm";
import { Box } from "@mui/material";
import { useEffect } from "react";
import { setTopRated } from "@store/users/usersSlice";
import { useTopRatedQuery } from "@store/users/usersApiSlice";

function Profile() {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.users);
  const {
    data: usersData,
    isError,
    error,
    isSuccess,
    refetch,
  } = useTopRatedQuery();
  useEffect(() => {
    if (isSuccess) {
      dispatch(setTopRated(usersData));
    }
    if (isError) {
      toast.error(error);
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <Box component={"div"} sx={{ pt: 20 }} className="profile page-h">
      <div className="container">{profile && <ProfileForm />}</div>
    </Box>
  );
}

export default Profile;
