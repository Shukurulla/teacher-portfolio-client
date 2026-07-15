import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Stack,
  LinearProgress,
  Skeleton,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AchievmentService from "../../service/achievment.service";
import { generateSlug } from "../../utils/generateSlug";
import { PageHeader, SoftChip, EmptyState } from "../../components/ui";

const CreateAchievment = () => {
  const { achievments, isLoading } = useSelector((state) => state.achievment);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    AchievmentService.getAchievments(dispatch, id);
  }, [dispatch, id]);

  const calculateSectionProgress = (section) => {
    if (!section?.achievments) {
      return {
        completed: 0,
        total: 0,
        percentage: 0,
        totalPoints: 0,
        earnedPoints: 0,
      };
    }

    const total = section.achievments.length;
    const completed = section.achievments.filter((a) => a.exist).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const totalPoints = section.achievments.reduce((sum, item) => {
      const ratings = item.achievmet?.ratings || [];
      const maxRating =
        ratings.length > 0 ? Math.max(...ratings.map((r) => r.rating || 0)) : 0;
      return sum + maxRating;
    }, 0);

    const earnedPoints = section.achievments.reduce((sum, item) => {
      if (!item.exist) return sum;
      const ratings = item.achievmet?.ratings || [];
      const maxRating =
        ratings.length > 0 ? Math.max(...ratings.map((r) => r.rating || 0)) : 0;
      return sum + maxRating;
    }, 0);

    return { completed, total, percentage, totalPoints, earnedPoints };
  };

  return (
    <Box>
      <PageHeader
        title="Yutuq bo'limlari"
        subtitle="Bo'limni tanlab, tegishli yutuqlaringiz uchun tasdiqlovchi hujjatlarni yuklang"
      />

      {isLoading ? (
        <Stack spacing={2}>
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent>
                <Skeleton variant="text" width="45%" height={28} />
                <Skeleton variant="text" width="65%" />
                <Skeleton
                  variant="rounded"
                  height={8}
                  sx={{ mt: 1.5, borderRadius: 5 }}
                />
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : achievments?.length === 0 ? (
        <EmptyState
          icon={<DescriptionRoundedIcon />}
          title="Bo'limlar topilmadi"
          description="Ushbu yo'nalish uchun yutuq bo'limlari hozircha mavjud emas"
        />
      ) : (
        <Stack spacing={2}>
          {achievments?.map((item, index) => {
            const progress = calculateSectionProgress(item);
            const isComplete = progress.percentage === 100;
            const accent = isComplete ? "#16a34a" : "#2563eb";

            return (
              <Card
                key={index}
                sx={{
                  transition: "box-shadow .15s ease, transform .15s ease",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardActionArea
                  onClick={() =>
                    navigate(
                      `/achievment/create/${id}/section/${generateSlug(
                        item.section
                      )}`
                    )
                  }
                  sx={{ p: { xs: 2, sm: 2.5 } }}
                >
                  <Stack direction="row" alignItems="flex-start" spacing={2}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                        display: "grid",
                        placeItems: "center",
                        bgcolor: alpha(accent, 0.12),
                        color: accent,
                        flexShrink: 0,
                      }}
                    >
                      {isComplete ? (
                        <CheckRoundedIcon />
                      ) : (
                        <DescriptionRoundedIcon />
                      )}
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        flexWrap="wrap"
                        gap={1}
                        mb={1}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          {item.section}
                        </Typography>
                        {isComplete && (
                          <SoftChip label="Yakunlangan" color="#16a34a" />
                        )}
                      </Stack>

                      <Stack
                        direction="row"
                        flexWrap="wrap"
                        rowGap={0.5}
                        columnGap={3}
                        mb={1.5}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: accent }}
                        >
                          {progress.completed}/{progress.total} yutuq
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: accent }}
                        >
                          {progress.earnedPoints}/{progress.totalPoints} ball
                        </Typography>
                      </Stack>

                      <LinearProgress
                        variant="determinate"
                        value={progress.percentage}
                        color={isComplete ? "success" : "primary"}
                        sx={{
                          height: 8,
                          borderRadius: 5,
                          bgcolor: alpha(accent, 0.12),
                        }}
                      />
                    </Box>
                  </Stack>
                </CardActionArea>
              </Card>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default CreateAchievment;
