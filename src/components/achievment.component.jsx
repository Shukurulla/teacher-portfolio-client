import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../service/api";
import {
  Card,
  CardContent,
  Stack,
  Box,
  Typography,
  Button,
  Divider,
  Alert,
} from "@mui/material";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import FileViewerComponent from "./FileViewerComponent";
import Swal from "sweetalert2";
import CreateBox from "../pages/achievments/create.box";
import { useSelector } from "react-redux";
import { StatusChip, SoftChip } from "./ui";

const AchievmentComponent = ({ item, jobId }) => {
  const queryClient = useQueryClient();
  const [modalState, setModalState] = useState({
    state: false,
    value: {},
  });
  const { achievments } = useSelector((state) => state.achievment);
  const [viewingFile, setViewingFile] = useState(null);

  // Yutuqni o'chirish
  const deleteAchievementMutation = useMutation({
    mutationFn: (achievementId) => axios.delete(`/file/${achievementId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs", jobId]);
      Swal.fire({
        title: "Muvaffaqiyatli!",
        text: "Yutuq muvaffaqiyatli o'chirildi",
        icon: "success",
        confirmButtonText: "OK",
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Xatolik!",
        text:
          error.response?.data?.message ||
          "Yutuqni o'chirishda xatolik yuz berdi",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });

  const handleDelete = (achievementId) => {
    Swal.fire({
      title: "Yutuqni o'chirish",
      text: "Haqiqatan ham bu yutuqni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ha, o'chirilsin!",
      cancelButtonText: "Bekor qilish",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteAchievementMutation.mutate(achievementId);
      }
    });
  };

  // Holat chipi — dizayn tizimidagi StatusChip/SoftChip orqali
  const renderStatus = () => {
    if (item.status === "Tasdiqlandi")
      return <StatusChip status="Tasdiqlandi" />;
    if (item.status === "Tasdiqlanmadi")
      return <StatusChip status="Tasdiqlanmadi" />;
    return <SoftChip label="Kutilmoqda" color="#d97706" />;
  };

  return (
    <Card>
      {modalState.state && (
        <CreateBox
          state={modalState.value}
          setState={setModalState}
          id={item.from.job}
        />
      )}
      <CardContent>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={1.5}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {item.achievments.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.achievments.section}
            </Typography>
            {item.achievments.rating && (
              <Typography variant="body2" color="text.secondary" mt={0.5}>
                {item.achievments.rating.ratingTitle} (
                {item.achievments.rating.rating}/5)
              </Typography>
            )}
          </Box>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ flexShrink: 0 }}
          >
            {renderStatus()}
            {item.status === "Tasdiqlanmadi" ? (
              <Button
                size="small"
                variant="outlined"
                onClick={() =>
                  setModalState({
                    state: true,
                    value: achievments
                      .filter((c) => c.section == item.achievments.section)[0]
                      .achievments.find(
                        (c) => c.achievmet.title == item.achievments.title
                      ).achievmet,
                  })
                }
              >
                qayta jonatish
              </Button>
            ) : (
              ""
            )}
          </Stack>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={1.5}
        >
          <Box>
            {item.score && (
              <SoftChip
                color="#16a34a"
                icon={<EmojiEventsRoundedIcon sx={{ fontSize: 16 }} />}
                label={`Ball: ${item.score}`}
              />
            )}
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              size="small"
              color="inherit"
              startIcon={<VisibilityRoundedIcon />}
              onClick={() =>
                setViewingFile({
                  fileUrl: item.fileUrl,
                  fileName: item.fileName,
                })
              }
              sx={{ color: "text.secondary" }}
            >
              Faylni ko'rish
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => handleDelete(item._id)}
            >
              O'chirish
            </Button>
          </Stack>
        </Stack>

        {item.resultMessage && (
          <Alert
            severity={item.status === "Tasdiqlandi" ? "success" : "error"}
            sx={{ mt: 2 }}
          >
            {item.resultMessage}
          </Alert>
        )}
      </CardContent>

      {viewingFile && (
        <FileViewerComponent
          files={item.files}
          onClose={() => setViewingFile(null)}
        />
      )}
    </Card>
  );
};

export default AchievmentComponent;
