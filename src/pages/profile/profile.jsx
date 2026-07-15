import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserService from "../../service/user.service";
import FilesService from "../../service/file.service";
import {
  Box,
  Card,
  CardContent,
  Avatar,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import { PageHeader, StatCard, Loader } from "../../components/ui";
import { formatPhone } from "../../utils/format";

const Profile = () => {
  const { user, isLoading } = useSelector((state) => state.user);
  const { myFiles, isLoading: filesLoading } = useSelector(
    (state) => state.file
  );
  const [openModal, setOpenModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [image, setImage] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    UserService.getUser(dispatch);
    FilesService.getFiles(dispatch);
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
    setOpenModal(false);
  };

  // Yutuqlar statistikasi (myFiles massividan hisoblanadi)
  const filesArray = Array.isArray(myFiles) ? myFiles : [];
  const confirmedFiles = filesArray.filter((c) => c.status === "Tasdiqlandi");
  const totalBall = confirmedFiles.reduce(
    (sum, c) =>
      sum + (c.files || []).reduce((s, f) => s + (f.rating?.rating || 0), 0),
    0
  );
  const confirmedCount = confirmedFiles.length;
  const totalCount = filesArray.length;

  const region = user?.region;
  const regionText =
    typeof region === "string" ? region : region?.title || region?.region || "";
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
  const initials = `${user?.firstName?.[0] || ""}${
    user?.lastName?.[0] || ""
  }`.toUpperCase();

  if (isLoading) {
    return (
      <Box>
        <Loader height={360} label="Yuklanmoqda..." />
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Mening profilim"
        subtitle="Shaxsiy ma'lumotlaringiz va yutuqlaringiz statistikasi"
        action={
          <Button
            variant="contained"
            startIcon={<EditRoundedIcon />}
            onClick={() => setOpenModal(true)}
          >
            Tahrirlash
          </Button>
        }
      />

      {/* Profil sarlavha kartasi */}
      <Card sx={{ mb: 2.5 }}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2, sm: 3.5 }}
            alignItems={{ xs: "flex-start", sm: "center" }}
          >
            <Avatar
              src={user?.profileImage || undefined}
              sx={{
                width: 112,
                height: 112,
                fontSize: 34,
                fontWeight: 700,
                bgcolor: "primary.main",
              }}
            >
              {initials || <PersonRoundedIcon sx={{ fontSize: 56 }} />}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h5" sx={{ mb: 1 }}>
                {fullName || "Ismsiz foydalanuvchi"}
              </Typography>
              <Stack spacing={0.75}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <PhoneRoundedIcon
                    fontSize="small"
                    sx={{ color: "text.secondary" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {user?.phone
                      ? formatPhone(user.phone)
                      : "Telefon raqam kiritilmagan"}
                  </Typography>
                </Stack>
                {regionText && (
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <PlaceRoundedIcon
                      fontSize="small"
                      sx={{ color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {regionText}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Statistika kartalari */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2.5,
        }}
      >
        <StatCard
          icon={<EmojiEventsRoundedIcon />}
          label="Umumiy ball"
          value={totalBall}
          color="#2563eb"
          loading={filesLoading}
          hint="Tasdiqlangan yutuqlar bo'yicha"
        />
        <StatCard
          icon={<EmojiEventsRoundedIcon />}
          label="Tasdiqlangan yutuqlar"
          value={confirmedCount}
          color="#16a34a"
          loading={filesLoading}
        />
        <StatCard
          icon={<EmojiEventsRoundedIcon />}
          label="Jami yutuqlar"
          value={totalCount}
          color="#7c3aed"
          loading={filesLoading}
        />
      </Box>

      {/* Profilni tahrirlash oynasi */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Profil ma'lumotlarini o'zgartirish
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ pt: 1 }}>
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
                      width: 120,
                      height: 120,
                      fontSize: 36,
                      fontWeight: 700,
                      bgcolor: "primary.main",
                    }}
                  >
                    {initials || <PersonRoundedIcon sx={{ fontSize: 60 }} />}
                  </Avatar>
                  <Box
                    sx={{
                      position: "absolute",
                      right: 2,
                      bottom: 2,
                      width: 36,
                      height: 36,
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
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button color="inherit" onClick={() => setOpenModal(false)}>
            Bekor qilish
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveRoundedIcon />}
            onClick={submitHandler}
            disabled={!firstName || !lastName || !phone}
          >
            Saqlash
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
