import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  IconButton,
  Typography,
  Alert,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

const getFileExtension = (fileName) => fileName?.split(".").pop()?.toLowerCase();

const FileViewerComponent = ({ files, onClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentIndex, setCurrentIndex] = useState(0);

  const list = Array.isArray(files) ? files : [];
  const currentFile = list[currentIndex];
  if (!currentFile) return null;

  const ext = getFileExtension(currentFile.fileUrl);
  const fullUrl = `https://server.portfolio-sport.uz${currentFile.fileUrl}`;

  const isImage = ["jpg", "jpeg", "png", "gif", "webp"].includes(ext);
  const isPDF = ext === "pdf";
  const isUnsupported = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(
    ext
  );

  const goToPrevious = () =>
    setCurrentIndex((p) => (p > 0 ? p - 1 : list.length - 1));
  const goToNext = () =>
    setCurrentIndex((p) => (p < list.length - 1 ? p + 1 : 0));

  const navBtnSx = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    bgcolor: "background.paper",
    boxShadow: 2,
    zIndex: 2,
    "&:hover": { bgcolor: "background.paper" },
  };

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={fullScreen}
      slotProps={{
        paper: {
          sx: {
            height: fullScreen ? "100%" : "88vh",
            borderRadius: fullScreen ? 0 : 3,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          pr: 6,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <DescriptionRoundedIcon color="primary" />
        <Typography variant="h6" noWrap sx={{ flex: 1, minWidth: 0 }}>
          {currentFile.fileTitle || "Fayl ko'rish"}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 12, top: 12 }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: 0,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.100",
          overflow: "hidden",
        }}
      >
        {isImage ? (
          <Box
            component="img"
            src={fullUrl}
            alt={currentFile.fileTitle}
            sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          />
        ) : isPDF ? (
          <Box
            component="iframe"
            src={fullUrl}
            title="PDF"
            sx={{ width: "100%", height: "100%", border: 0 }}
          />
        ) : (
          <Alert severity={isUnsupported ? "warning" : "info"} sx={{ m: 3 }}>
            {isUnsupported
              ? "Ushbu fayl turini brauzerda ko'rsatib bo'lmaydi. Iltimos, faylni yuklab oling."
              : "Noma'lum fayl turi. Faylni yuklab ko'rishingiz mumkin."}
          </Alert>
        )}

        {list.length > 1 && (
          <>
            <IconButton onClick={goToPrevious} sx={{ ...navBtnSx, left: 12 }}>
              <ChevronLeftRoundedIcon />
            </IconButton>
            <IconButton onClick={goToNext} sx={{ ...navBtnSx, right: 12 }}>
              <ChevronRightRoundedIcon />
            </IconButton>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {list.length > 1 ? `${currentIndex + 1} / ${list.length}` : ""}
        </Typography>
        <Box sx={{ flex: 1 }} />
        <Stack direction="row" spacing={1}>
          <Button color="inherit" onClick={onClose} startIcon={<CloseRoundedIcon />}>
            Yopish
          </Button>
          <Button
            variant="contained"
            href={fullUrl}
            download
            target="_blank"
            rel="noopener"
            startIcon={<DownloadRoundedIcon />}
          >
            Yuklab olish
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default FileViewerComponent;
