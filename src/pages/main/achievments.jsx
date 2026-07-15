import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Divider,
  Alert,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import EmojiEventsRounded from "@mui/icons-material/EmojiEventsRounded";
import FilesService from "../../service/file.service";
import FileViewerComponent from "../../components/FileViewerComponent";
import AchievmentService from "../../service/achievment.service";
import { PageHeader, StatusChip, SoftChip, Loader, EmptyState } from "../../components/ui";

const AchievementsPage = () => {
  const { myFiles = [], isLoading } = useSelector((state) => state.file); // default empty array
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [viewingFile, setViewingFile] = useState(null);

  useEffect(() => {
    FilesService.getFiles(dispatch);
    AchievmentService.getAchievments(dispatch);
  }, [dispatch]);

  if (isLoading) {
    return <Loader height="80vh" label="Yuklanmoqda..." />;
  }

  const filesArray = Array.isArray(myFiles) ? myFiles : [];

  return (
    <Box>
      <PageHeader
        title="Mening Yutuqlarim"
        subtitle="Yuborilgan yutuqlaringiz va ularning tasdiqlanish holati"
      />

      {filesArray.length === 0 ? (
        <Card>
          <EmptyState
            icon={<EmojiEventsRounded />}
            title="Yutuqlar topilmadi"
            description="Siz hali hech qanday yutuq qo'shmagansiz"
          />
        </Card>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 2.5,
          }}
        >
          {filesArray.map((item) => (
            <Card key={item._id} sx={{ height: "100%" }}>
              <CardContent>
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  justifyContent="space-between"
                  spacing={1.5}
                >
                  <Stack direction="row" alignItems="center" spacing={1.75} sx={{ minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 3,
                        display: "grid",
                        placeItems: "center",
                        bgcolor: alpha("#2563eb", 0.12),
                        color: "#2563eb",
                        flexShrink: 0,
                      }}
                    >
                      <EmojiEventsRounded />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {item.achievments.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.achievments.section}
                      </Typography>
                      {item.achievments.rating && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                          mt={0.25}
                        >
                          {item.achievments.rating.ratingTitle} (
                          {item.achievments.rating.rating}/5)
                        </Typography>
                      )}
                    </Box>
                  </Stack>
                  <Box sx={{ flexShrink: 0 }}>
                    <StatusChip status={item.status} />
                  </Box>
                </Stack>

                {item.resultMessage && (
                  <Alert
                    severity={item.status === "Tasdiqlandi" ? "success" : "error"}
                    sx={{ mt: 2 }}
                  >
                    {item.resultMessage}
                  </Alert>
                )}

                <Divider sx={{ my: 2 }} />

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={1.5}
                >
                  {item.score ? (
                    <SoftChip label={`Ball: ${item.score}`} color="#2563eb" />
                  ) : (
                    <Box />
                  )}
                  {item.files?.length > 0 && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setViewingFile(item)}
                    >
                      Faylni ko'rish
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Fayl ko'ruvchi modal */}
      {viewingFile?.files?.length > 0 && (
        <FileViewerComponent
          files={viewingFile.files}
          onClose={() => setViewingFile(null)}
        />
      )}
    </Box>
  );
};

export default AchievementsPage;
