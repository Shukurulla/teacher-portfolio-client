import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  LinearProgress,
  Skeleton,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import AchievmentService from "../../service/achievment.service";
import { generateSlug } from "../../utils/generateSlug";
import { PageHeader, SoftChip } from "../../components/ui";
import CreateBox from "./create.box";

const CreateAchievmetSection = () => {
  const { achievments, isLoading } = useSelector((state) => state.achievment);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slug, id } = useParams();

  useEffect(() => {
    AchievmentService.getAchievments(dispatch, id);
  }, [dispatch, id]);

  const sectionAchievments = achievments.find(
    (c) => generateSlug(c.section) === generateSlug(slug)
  );

  const [modalState, setModalState] = useState({
    state: false,
    value: {},
  });

  const calculateProgress = () => {
    if (!sectionAchievments)
      return { completed: 0, total: 0, totalPoints: 0, earnedPoints: 0 };

    const total = sectionAchievments.achievments.length;
    const completed = sectionAchievments.achievments.filter(
      (a) => a.exist
    ).length;

    const totalPoints = sectionAchievments.achievments.reduce((sum, item) => {
      const ratings = item.achievmet?.ratings || [];
      const maxRating =
        ratings.length > 0 ? Math.max(...ratings.map((r) => r.rating || 0)) : 0;
      return sum + maxRating;
    }, 0);

    const earnedPoints = sectionAchievments.achievments.reduce((sum, item) => {
      if (!item.exist) return sum;
      const ratings = item.achievmet?.ratings || [];
      const maxRating =
        ratings.length > 0 ? Math.max(...ratings.map((r) => r.rating || 0)) : 0;
      return sum + maxRating;
    }, 0);

    return { completed, total, totalPoints, earnedPoints };
  };

  const progress = calculateProgress();
  const percentage =
    progress.total > 0
      ? Math.round((progress.completed / progress.total) * 100)
      : 0;

  if (isLoading) {
    return (
      <Box>
        <Stack spacing={2}>
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent>
                <Skeleton variant="text" width="40%" height={28} />
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="55%" />
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    );
  }

  if (!sectionAchievments) return <Box />;

  return (
    <Box>
      {modalState.state && (
        <CreateBox state={modalState.value} setState={setModalState} id={id} />
      )}

      <PageHeader title={sectionAchievments.section} />

      {/* Progress Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            gap={1.5}
            mb={2}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {progress.completed} / {progress.total} yutuq bajarildi
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              {progress.earnedPoints} / {progress.totalPoints} ball to'plandi
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={percentage}
            sx={{ height: 8, borderRadius: 5 }}
          />
        </CardContent>
      </Card>

      {/* Achievements List */}
      <Stack spacing={2}>
        {sectionAchievments.achievments.map((item) => {
          const accent = item.exist ? "#16a34a" : "#2563eb";

          return (
            <Card key={item.achievmet.id}>
              <CardContent>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  gap={2}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.5}
                      mb={1.5}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2.5,
                          display: "grid",
                          placeItems: "center",
                          bgcolor: alpha(accent, 0.12),
                          color: accent,
                          flexShrink: 0,
                        }}
                      >
                        {item.exist ? (
                          <CheckRoundedIcon />
                        ) : (
                          <DescriptionRoundedIcon />
                        )}
                      </Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {item.achievmet.title}
                      </Typography>
                    </Stack>

                    <Box sx={{ pl: { sm: 6.5 } }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, mb: 1 }}
                      >
                        Baholar:
                      </Typography>
                      <Stack spacing={0.75}>
                        {item.achievmet.ratings.map((rating, index) => (
                          <Stack key={index} direction="row" spacing={1}>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 700, minWidth: 64, flexShrink: 0 }}
                            >
                              {rating.rating} ball
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              - {rating.about}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      flexShrink: 0,
                      display: "flex",
                      alignItems: { xs: "flex-start", sm: "center" },
                      justifyContent: "flex-end",
                    }}
                  >
                    {item.exist ? (
                      <Stack alignItems="flex-end" spacing={0.5}>
                        <SoftChip label="Yuborilgan" color="#16a34a" />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(
                            item.achievmet.updatedAt
                          ).toLocaleDateString()}
                        </Typography>
                      </Stack>
                    ) : (
                      <Button
                        variant="contained"
                        startIcon={<UploadFileRoundedIcon />}
                        onClick={() =>
                          setModalState({ state: true, value: item.achievmet })
                        }
                      >
                        Yuborish
                      </Button>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
};

export default CreateAchievmetSection;
