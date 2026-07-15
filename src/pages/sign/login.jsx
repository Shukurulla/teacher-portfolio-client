import React, { useState } from "react";
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
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SchoolRounded from "@mui/icons-material/SchoolRounded";
import PhoneRounded from "@mui/icons-material/PhoneRounded";
import LockRounded from "@mui/icons-material/LockRounded";
import UserService from "../../service/user.service";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isLoading } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const postHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (!phone.trim() || !password.trim()) {
      setError("Telefon raqam va parolni kiriting");
      return;
    }

    const userSchema = {
      phone,
      password,
    };
    await UserService.loginUser(dispatch, userSchema, navigate);
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
              Profilga Kirish
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
                label="Telefon raqam"
                placeholder="Telefon raqam"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneRounded fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
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
                Oldin ro'yhantdan otmaganmisiz?{" "}
                <Link
                  component={RouterLink}
                  to="/auth/register"
                  fontWeight={600}
                  underline="hover"
                >
                  Ro'yhatdan o'tish
                </Link>
              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
