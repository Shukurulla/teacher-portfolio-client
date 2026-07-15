import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon as MenuItemIcon,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

const DRAWER = 268;
const DEFAULT_AVATAR =
  "https://as2.ftcdn.net/jpg/05/89/93/27/1000_F_589932782_vQAEAZhHnq1QCGu5ikwrYaQD0Mmurm0N.jpg";

const NAV = [
  { to: "/", label: "Bosh sahifa", icon: <HomeRoundedIcon />, end: true },
  { to: "/achievments", label: "Mening yutuqlarim", icon: <EmojiEventsRoundedIcon /> },
  { to: "/special", label: "Maxsus yutuqlar", icon: <WorkspacePremiumRoundedIcon /> },
  { to: "/malaka", label: "Malaka oshirish", icon: <SchoolRoundedIcon /> },
  { to: "/foydalanuvchilar", label: "Foydalanuvchilar uchun", icon: <MenuBookRoundedIcon /> },
  { to: "/boglanish", label: "Bog'lanish", icon: <SupportAgentRoundedIcon /> },
];

const Layout = ({ activePage }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchor, setAnchor] = useState(null);

  const active = (to, end) =>
    end ? location.pathname === to : location.pathname.startsWith(to);

  const logout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        color: "#e2e8f0",
        background: "linear-gradient(180deg,#0f172a 0%,#1e293b 100%)",
      }}
    >
      <Stack direction="row" alignItems="center" gap={1.5} sx={{ px: 2.5, py: 2.75 }}>
        <Avatar sx={{ bgcolor: "primary.main", width: 42, height: 42 }}>
          <SchoolRoundedIcon />
        </Avatar>
        <Box>
          <Typography sx={{ fontWeight: 800, lineHeight: 1.1 }}>
            Portfolio Sport
          </Typography>
          <Typography variant="caption" sx={{ color: "#94a3b8" }}>
            O'qituvchi kabineti
          </Typography>
        </Box>
      </Stack>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
      <List sx={{ flex: 1, py: 1.5 }}>
        {NAV.map((it) => (
          <ListItemButton
            key={it.to}
            component={NavLink}
            to={it.to}
            end={it.end}
            selected={active(it.to, it.end)}
            onClick={() => setMobileOpen(false)}
            sx={{
              color: "#cbd5e1",
              mb: 0.5,
              "&.Mui-selected": { color: "#fff", bgcolor: "rgba(255,255,255,0.14) !important" },
              "& .MuiListItemIcon-root": { color: "inherit" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{it.icon}</ListItemIcon>
            <ListItemText primary={it.label} primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }} />
          </ListItemButton>
        ))}
      </List>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
      <List sx={{ py: 1 }}>
        <ListItemButton
          onClick={logout}
          sx={{ color: "#fca5a5", "& .MuiListItemIcon-root": { color: "inherit" } }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <LogoutRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Chiqish" primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }} />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${DRAWER}px)` },
          ml: { md: `${DRAWER}px` },
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ display: { md: "none" } }}>
            <MenuRoundedIcon />
          </IconButton>
          <Box sx={{ flex: 1 }} />
          <Box
            onClick={(e) => setAnchor(e.currentTarget)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.25,
              cursor: "pointer",
              px: 1,
              py: 0.5,
              borderRadius: 2,
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <Avatar src={user?.profileImage || DEFAULT_AVATAR} sx={{ width: 36, height: 36 }} />
            <Typography variant="body2" sx={{ fontWeight: 600, display: { xs: "none", sm: "block" } }}>
              {user?.firstName} {user?.lastName}
            </Typography>
          </Box>
          <Menu
            anchorEl={anchor}
            open={!!anchor}
            onClose={() => setAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={() => { setAnchor(null); navigate("/profile"); }}>
              <MenuItemIcon><PersonRoundedIcon fontSize="small" /></MenuItemIcon>
              Profil
            </MenuItem>
            <MenuItem onClick={() => { setAnchor(null); navigate("/settings"); }}>
              <MenuItemIcon><SettingsRoundedIcon fontSize="small" /></MenuItemIcon>
              Sozlamalar
            </MenuItem>
            <Divider />
            <MenuItem onClick={logout}>
              <MenuItemIcon><LogoutRoundedIcon fontSize="small" /></MenuItemIcon>
              Chiqish
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: "block", md: "none" }, "& .MuiDrawer-paper": { width: DRAWER, border: 0 } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{ display: { xs: "none", md: "block" }, "& .MuiDrawer-paper": { width: DRAWER, border: 0 } }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER}px)` }, minWidth: 0 }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 } }}>{activePage}</Box>
      </Box>
    </Box>
  );
};

export default Layout;
