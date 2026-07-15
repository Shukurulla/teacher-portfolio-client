import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  InputAdornment,
  Link,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import PersonRounded from "@mui/icons-material/PersonRounded";
import BadgeRounded from "@mui/icons-material/BadgeRounded";
import LockRounded from "@mui/icons-material/LockRounded";
import UserService from "../../service/user.service";
import PhoneField from "../../components/PhoneField";

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isLoading } = useSelector((state) => state.user);
  const [regions, setRegions] = useState([]);
  const [province, setProvince] = useState({
    title: "Toshkent shahri",
    region: "Toshkent",
  });

  useEffect(() => {
    const provinces = async () => {
      const provinces = await UserService.getProvinces();
      setRegions(provinces.data);
      return provinces;
    };
    provinces();
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const postHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      phone.replace(/\D/g, "").length < 12 ||
      !password.trim()
    ) {
      setError("Barcha maydonlarni to'ldiring (telefonni to'liq kiriting)");
      return;
    }

    const userSchema = {
      firstName,
      lastName,
      phone,
      password,
      province,
    };

    await UserService.postUser(dispatch, userSchema, navigate);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        py: 4,
        background: "linear-gradient(135deg,#0f172a,#1e3a8a)",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 440,
          borderRadius: 4,
          border: "none",
          boxShadow: "0 24px 60px rgba(2,6,23,0.45)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={1} alignItems="center" textAlign="center" mb={3}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                boxShadow: "0 8px 24px rgba(37,99,235,0.4)",
              }}
            >
              <SchoolRounded sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h5">Portfolio Sport</Typography>
            <Typography variant="body2" color="text.secondary">
              Ro'yhatdan o'tish
            </Typography>
          </Stack>

          <Box component="form" onSubmit={postHandler} noValidate>
            <Stack spacing={2.25}>
              {error && (
                <Alert severity="error" onClose={() => setError("")}>
                  {error}
                </Alert>
              )}

              <TextField
                fullWidth
                label="Ismingiz"
                placeholder="Ismingiz"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonRounded fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                label="Familiyangiz"
                placeholder="Familiyangiz"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeRounded fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <PhoneField
                fullWidth
                label="Telefon raqam"
                value={phone}
                onChange={setPhone}
              />

              <TextField
                fullWidth
                type="password"
                label="Parol"
                placeholder="Parol"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockRounded fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                select
                fullWidth
                label="Viloyat / shahar"
                value={JSON.stringify(province)}
                onChange={(e) => setProvince(JSON.parse(e.target.value))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SchoolRounded fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              >
                {regions.map((item, index) => (
                  <MenuItem key={index} value={JSON.stringify(item)}>
                    {item.title}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                type="submit"
                fullWidth
                size="large"
                variant="contained"
                disabled={isLoading}
                startIcon={
                  isLoading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : null
                }
                sx={{ py: 1.25, mt: 0.5 }}
              >
                {isLoading ? "Yuborilmoqda..." : "Yuborish"}
              </Button>

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Oldin ro'yhantdan otganmisiz?{" "}
                <Link
                  component={RouterLink}
                  to="/auth/login"
                  fontWeight={600}
                  underline="hover"
                >
                  Kirish
                </Link>
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RegisterPage;
