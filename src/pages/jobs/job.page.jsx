import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../service/api";
import { useSelector, useDispatch } from "react-redux";
import AchievmentComponent from "../../components/achievment.component";
import {
  Box,
  Card,
  Stack,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import { generateSlug } from "../../utils/generateSlug";
import Swal from "sweetalert2";
import AchievmentService from "../../service/achievment.service";
import { PageHeader, StatCard, Loader, EmptyState } from "../../components/ui";

const directions = [
  "I. Sport taʼlim muassasalari rahbar va oʻrinbosarlari",
  "II. Sport taʼlim muassasalari yoʻriqchi-uslubchilari",
  "III. Sport turlarini rivojlantirish respublika markazlari, Olimpiya va paralimpiya sport turlariga tayyorlash markazlari, ixtisoslashtirilgan sport maktablari, ixtisoslashtirilgan olimpiya zaxiralari maktablari trenerlari",
  "IV. Sport maktablari trenerlari",
  "V. Sport psixologlari",
  "VI. Oliy taʼlim muassasalarining jismoniy tarbiya va sport yoʻnalishlari boʻyicha rahbar va pedagog kadrlari",
  "VII. Kasbiy taʼlim tashkilotlari jismoniy tarbiya fani oʻqituvchilari (jismoniy tarbiya va sportga ixtisoslashtirilganlar bundan mustasno)",
  "VIII. Umumiy oʻrta va oʻrta maxsus taʼlim tashkilotlari jismoniy tarbiya fani oʻqituvchilari",
  "IX. Maktabgacha taʼlim tashkilotlari jismoniy tarbiya yoʻriqchilari",
];

const JobPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editModal, setEditModal] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [workplace, setWorkplace] = useState("");
  const { achievments } = useSelector((state) => state.achievment);

  const dispatch = useDispatch();
  // Kasb ma'lumotlarini olish
  const fetchJobs = async () => {
    const response = await axios.get(`/job/${id}`);
    console.log(response.data.data);

    return response.data.data;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["jobs", id],
    queryFn: fetchJobs,
    onSuccess: (data) => {
      if (data?.job) {
        setJobTitle(data.job.title);
        setWorkplace(data.job.workplace);
      }
    },
  });

  useEffect(() => {
    if (data?.job) {
      setJobTitle(data.job.title);
      setWorkplace(data.job.workplace);
    }
  }, [data]);
  useEffect(() => {
    AchievmentService.getAchievments(dispatch);
  }, []);

  // Kasbni yangilash
  const updateJobMutation = useMutation({
    mutationFn: (updatedJob) => axios.put(`/job/${id}`, updatedJob),
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs", id]);
      setEditModal(false);
      Swal.fire({
        title: "Muvaffaqiyatli!",
        text: "Kasb ma'lumotlari yangilandi",
        icon: "success",
        confirmButtonText: "OK",
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Xatolik!",
        text:
          error.response?.data?.message ||
          "Ma'lumotlarni yangilashda xatolik yuz berdi",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });

  // Kasbni o'chirish
  const deleteJobMutation = useMutation({
    mutationFn: () => axios.delete(`/job/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["jobs"]);
      navigate("/");
      Swal.fire({
        title: "Muvaffaqiyatli!",
        text: "Kasb muvaffaqiyatli o'chirildi",
        icon: "success",
        confirmButtonText: "OK",
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Xatolik!",
        text: error.response?.data?.message || "O'chirishda xatolik yuz berdi",
        icon: "error",
        confirmButtonText: "OK",
      });
    },
  });

  const handleUpdateJob = () => {
    updateJobMutation.mutate({ title: jobTitle, workplace });
  };

  const handleDeleteJob = () => {
    Swal.fire({
      title: "Kasbni o'chirish",
      text: "Haqiqatan ham bu kasbni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ha, o'chirilsin!",
      cancelButtonText: "Bekor qilish",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteJobMutation.mutate();
      }
    });
  };

  // Faqat tasdiqlangan yutuqlar soni
  const approvedCount =
    data?.files?.filter((f) => f.status === "Tasdiqlandi").length || 0;

  // Faqat tasdiqlangan yutuqlarning umumiy ballini hisoblash
  const totalScore =
    data?.files
      ?.filter((f) => f.status === "Tasdiqlandi")
      .reduce(
        (sum, item) =>
          sum + item.files.reduce((s, f) => s + (f.rating?.rating || 0), 0),
        0
      ) || 0;

  if (isLoading) {
    return (
      <Box>
        <Loader label="Yuklanmoqda..." />
      </Box>
    );
  }

  const goToCreate = () =>
    navigate(
      `/achievment/create/${id}/section/${generateSlug(data?.job?.title)}`
    );

  return (
    <Box>
      <PageHeader
        title={data?.job?.title || "Kasb nomi"}
        subtitle={data?.job?.workplace || "Ish joyi"}
        action={
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button variant="outlined" onClick={() => setEditModal(true)}>
              Tahrirlash
            </Button>
            <Button variant="outlined" color="error" onClick={handleDeleteJob}>
              O'chirish
            </Button>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={goToCreate}
            >
              Yutuq qo'shish
            </Button>
          </Stack>
        }
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2.5,
        }}
      >
        <StatCard
          icon={<DescriptionRoundedIcon />}
          label="Jami yutuqlar"
          value={data?.files?.length || 0}
          color="#2563eb"
        />
        <StatCard
          icon={<EmojiEventsRoundedIcon />}
          label="Tasdiqlangan yutuqlar"
          value={approvedCount}
          color="#16a34a"
        />
        <StatCard
          icon={<EmojiEventsRoundedIcon />}
          label="Umumiy ball"
          value={totalScore}
          color="#16a34a"
        />
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ mt: 4, mb: 2 }}
      >
        <EmojiEventsRoundedIcon color="primary" />
        <Typography variant="h6">Yutuqlar</Typography>
      </Stack>

      {data?.files?.length === 0 ? (
        <Card>
          <EmptyState
            icon={<EmojiEventsRoundedIcon />}
            title="Hozircha yutuqlar mavjud emas"
            description="Ushbu kasb bo'yicha birinchi yutug'ingizni qo'shing"
            action={
              <Button
                variant="contained"
                startIcon={<AddRoundedIcon />}
                onClick={goToCreate}
              >
                Yutuq qo'shish
              </Button>
            }
          />
        </Card>
      ) : (
        <Stack spacing={2}>
          {data?.files?.map((item) => (
            <AchievmentComponent key={item._id} item={item} jobId={id} />
          ))}
        </Stack>
      )}

      <Dialog
        open={editModal}
        onClose={() => setEditModal(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Kasbni tahrirlash</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              select
              label="Kasbingiz"
              value={jobTitle}
              disabled
              onChange={(e) => setJobTitle(e.target.value)}
              fullWidth
            >
              {directions.map((item, i) => (
                <MenuItem key={i} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Ish joyingiz"
              value={workplace}
              onChange={(e) => setWorkplace(e.target.value)}
              placeholder="Ish joyi nomi"
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button color="error" onClick={handleDeleteJob}>
            O'chirish
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" onClick={() => setEditModal(false)}>
            Bekor qilish
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateJob}
            disabled={!jobTitle || !workplace || updateJobMutation.isLoading}
          >
            {updateJobMutation.isLoading ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobPage;
