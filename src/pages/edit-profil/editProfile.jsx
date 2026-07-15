import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserService from "../../service/user.service";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Stack,
  Divider,
  TextField,
} from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { PageHeader, Loader } from "../../components/ui";

const EditProfile = () => {
  const { user, isLoading } = useSelector((state) => state.user);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [image, setImage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    UserService.getUser(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhone(user.phone || "");
      setThumbnail(user.profileImage || "");
      setImage(user.profileImage || "");
    }
  }, [user]);

  const changeFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const thumbnail = URL.createObjectURL(file);
      setThumbnail(thumbnail);
      setImage(file);
    }
  };

  const submitHandler = async () => {
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    if (image instanceof File) {
      formData.append("profileImage", image);
    }

    await UserService.editProfile(dispatch, user._id, formData);
    navigate("/profile");
  };

  const initials = `${firstName?.[0] || ""}${
    lastName?.[0] || ""
  }`.toUpperCase();

  if (isLoading && !user?._id) {
    return (
      <Box>
        <Loader height={360} label="Yuklanmoqda..." />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Sozlamalar"
        subtitle="Profil ma'lumotlaringizni yangilang"
      />

      <Card sx={{ maxWidth: 720, mx: "auto" }}>
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6">Profil ma'lumotlari</Typography>
        </Box>
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Stack spacing={3.5}>
            <Stack alignItems="center" spacing={1.25}>
              <Button
                component="label"
                sx={{
                  p: 0,
                  minWidth: 0,
                  borderRadius: "50%",
                  "&:hover": { bgcolor: "transparent" },
                }}
              >
                <Box sx={{ position: "relative" }}>
                  <Avatar
                    src={thumbnail || undefined}
                    sx={{
                      width: 128,
                      height: 128,
                      fontSize: 40,
                      fontWeight: 700,
                      bgcolor: "primary.main",
                    }}
                  >
                    {initials || <PersonRoundedIcon sx={{ fontSize: 64 }} />}
                  </Avatar>
                  <Box
                    sx={{
                      position: "absolute",
                      right: 2,
                      bottom: 2,
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      color: "#fff",
                      display: "grid",
                      placeItems: "center",
                      border: "3px solid #fff",
                    }}
                  >
                    <PhotoCameraRoundedIcon fontSize="small" />
                  </Box>
                </Box>
                <input
                  type="file"
                  hidden
                  id="profileImage"
                  accept="image/*"
                  onChange={changeFile}
                />
              </Button>
              <Typography variant="caption" color="text.secondary">
                Rasmni o'zgartirish uchun bosing
              </Typography>
            </Stack>

            <Divider />

            <Stack spacing={2.5}>
              <TextField
                label="Ism"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                fullWidth
                placeholder="Ismingiz"
              />
              <TextField
                label="Familiya"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                fullWidth
                placeholder="Familiyangiz"
              />
              <TextField
                label="Telefon raqam"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
                placeholder="Telefon raqam"
              />
            </Stack>

            <Stack
              direction="row"
              justifyContent="flex-end"
              spacing={1.5}
              sx={{ pt: 0.5 }}
            >
              <Button color="inherit" onClick={() => navigate("/profile")}>
                Bekor qilish
              </Button>
              <Button
                variant="contained"
                size="large"
                startIcon={<SaveRoundedIcon />}
                onClick={submitHandler}
                disabled={!firstName || !lastName || !phone}
              >
                Saqlash
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EditProfile;
