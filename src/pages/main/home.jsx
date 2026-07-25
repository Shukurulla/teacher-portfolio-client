import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Autocomplete,
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import WorkRounded from "@mui/icons-material/WorkRounded";
import EmojiEventsRounded from "@mui/icons-material/EmojiEventsRounded";
import AddRounded from "@mui/icons-material/AddRounded";
import ArrowForwardRounded from "@mui/icons-material/ArrowForwardRounded";
import BusinessRounded from "@mui/icons-material/BusinessRounded";
import MenuBookRounded from "@mui/icons-material/MenuBookRounded";
import LocationOnRounded from "@mui/icons-material/LocationOnRounded";
import JobService from "../../service/job.service";
import FileService from "../../service/file.service";
import FilesService from "../../service/file.service";
import AchievmentService from "../../service/achievment.service";
import UserService from "../../service/user.service";
import { PageHeader, StatCard, Loader, EmptyState } from "../../components/ui";

const GREEN = "#16a34a";

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

const TeacherJobsPage = () => {
  const { jobs, isLoading } = useSelector((state) => state.job);
  const { myFiles } = useSelector((state) => state.file);
  const { achievments } = useSelector((state) => state.achievment);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [workplace, setWorkplace] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [province, setProvince] = useState(null);
  const [district, setDistrict] = useState("");

  useEffect(() => {
    JobService.getJobs(dispatch);
    FilesService.getFiles(dispatch);
    AchievmentService.getAchievments(dispatch);

    const fetchRegions = async () => {
      const response = await UserService.getProvinces();
      setRegions(response.data || []);
    };
    fetchRegions();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (province?.title) {
        const response = await UserService.getDistricts(province.title);
        setDistricts(response.data || []);
      }
    };
    fetchDistricts();
  }, [province]);

  useEffect(() => {
    if (isModalOpen && user) {
      // Modal ochilganda user'ning viloyat va tumanini default qilib o'rnatish
      setProvince(user.region || null);
      setDistrict(user.district || "");
    }
  }, [isModalOpen, user]);

  const getAchievementsCount = (jobId) => {
    const files = myFiles.filter(
      (file) => 
        file.status === "Tasdiqlandi" && 
        file.from?.job === jobId
    );
    const length = files.length;
    const totalScore = files.reduce(
      (sum, item) =>
        sum + item.files.reduce((s, f) => s + (f.rating?.rating || 0), 0),
      0,
    );

    return { length, totalScore };
  };

  const existingTitles = jobs.map((item) => item.title);
  const filteredDirections = directions
    .filter((item) => !existingTitles.includes(item))
    .filter((item) => item.toLowerCase().includes(searchTerm.toLowerCase()));
  const handleAddJob = async () => {
    await JobService.createJob(dispatch, {
      title,
      workplace,
      province,
      district,
    });
    setIsModalOpen(false);
    setTitle("");
    setWorkplace("");
    setProvince(null);
    setDistrict("");
  };
  const rating = myFiles
    .filter((c) => c.status == "Tasdiqlandi")
    .map((c) =>
      c.files.reduce((sum, item) => sum + (item.rating?.rating || 0), 0),
    )
    .reduce((a, b) => a + b, 0);

  const count = myFiles.filter((c) => c.status == "Tasdiqlandi").length;

  const closeModal = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setSearchTerm("");
    setTitle("");
    setWorkplace("");
    setProvince(null);
    setDistrict("");
  };

  return (
    <Box>
      <PageHeader
        title="Ish Joylarim"
        subtitle="Faoliyat olib borayotgan muassasalar"
        action={
          jobs.length > 0 ? (
            <Button
              variant="contained"
              startIcon={<AddRounded />}
              onClick={() => setIsModalOpen(true)}
            >
              Ish joyi qo'shish
            </Button>
          ) : null
        }
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
          gap: 2.5,
          mb: 3,
        }}
      >
        <StatCard
          icon={<WorkRounded />}
          label="Ish joylari"
          value={jobs.length}
          color="#2563eb"
        />
        <StatCard
          icon={<EmojiEventsRounded />}
          label="Tasdiqlangan yutuqlar"
          value={count}
          color={GREEN}
        />
        <StatCard
          icon={<EmojiEventsRounded />}
          label="Umumiy ball"
          value={rating}
          color={GREEN}
        />
      </Box>

      {isLoading ? (
        <Loader height={260} />
      ) : jobs.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 2.5,
          }}
        >
          {jobs.map((job) => (
            <Card
              key={job._id}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform .15s ease, box-shadow .15s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 10px 28px rgba(15,23,42,0.1)",
                },
              }}
            >
              <CardContent
                sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
              >
                <Stack direction="row" alignItems="center" spacing={1.75}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 3,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: alpha("#2563eb", 0.12),
                      color: "#2563eb",
                      flexShrink: 0,
                    }}
                  >
                    <WorkRounded />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h6" noWrap title={job.title}>
                      {job.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                      title={job.workplace}
                    >
                      {job.workplace}
                    </Typography>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
                  <Stack direction="row" alignItems="center" spacing={1.25}>
                    <MenuBookRounded fontSize="small" color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      Asosiy fan: {job.subject || job.title}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1.25}>
                    <EmojiEventsRounded
                      fontSize="small"
                      sx={{ color: GREEN }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {getAchievementsCount(job._id).length} ta tasdiqlangan
                      yutuq —{" "}
                      <Box
                        component="span"
                        sx={{ color: GREEN, fontWeight: 800 }}
                      >
                        {getAchievementsCount(job._id).totalScore} ball
                      </Box>
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1.25}>
                    <BusinessRounded
                      fontSize="small"
                      sx={{ color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {job.workplace}
                    </Typography>
                  </Stack>
                </Stack>

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2.5 }}
                >
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardRounded />}
                    onClick={() => navigate(`/job/${job._id}`)}
                  >
                    Batafsil ko'rish
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Card>
          <EmptyState
            icon={<WorkRounded />}
            title="Ish joylari mavjud emas"
            description="Hozircha qo'shilgan ish joylaringiz yo'q"
            action={
              <Button
                variant="contained"
                startIcon={<AddRounded />}
                onClick={() => setIsModalOpen(true)}
              >
                Ish joyi qo'shish
              </Button>
            }
          />
        </Card>
      )}

      {/* Add Job Modal */}
      <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 800 }}>
          Yangi ish joyi qo'shish
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Autocomplete
              open={isDropdownOpen}
              onOpen={() => setIsDropdownOpen(true)}
              onClose={() => setIsDropdownOpen(false)}
              options={filteredDirections}
              filterOptions={(x) => x}
              getOptionLabel={(o) => o || ""}
              isOptionEqualToValue={(o, v) => o === v}
              value={title || null}
              onChange={(e, val) => {
                setTitle(val || "");
                setIsDropdownOpen(false);
                setSearchTerm("");
              }}
              onInputChange={(e, val, reason) => {
                if (reason === "input") setSearchTerm(val);
                if (reason === "clear") setSearchTerm("");
              }}
              noOptionsText="Hech narsa topilmadi"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Lavozim"
                  placeholder="Lavozimni tanlang"
                />
              )}
            />
            <TextField
              select
              fullWidth
              label="Viloyat / shahar"
              value={province ? JSON.stringify(province) : ""}
              onChange={(e) => {
                setProvince(JSON.parse(e.target.value));
                setDistrict("");
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnRounded fontSize="small" color="action" />
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
            <TextField
              select
              fullWidth
              label="Tuman"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={!districts.length}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnRounded fontSize="small" color="action" />
                  </InputAdornment>
                ),
              }}
            >
              {districts.map((item, index) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Ish joyi (Muassasa)"
              name="workplace"
              value={workplace}
              onChange={(e) => setWorkplace(e.target.value)}
              required
              fullWidth
              placeholder="Masalan: 15-sonli maktab"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button color="inherit" onClick={closeModal}>
            Bekor qilish
          </Button>
          <Button
            variant="contained"
            onClick={handleAddJob}
            disabled={!title || !workplace || !province || !district}
          >
            Qo'shish
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TeacherJobsPage;
