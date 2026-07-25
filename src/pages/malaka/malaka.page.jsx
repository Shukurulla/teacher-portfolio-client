import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "../../service/api";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  MenuItem,
  TextField,
  Stack,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { toast } from "react-hot-toast";
import { PageHeader, Loader, EmptyState } from "../../components/ui";

const FILIALS = [
  {
    key: "Nukus",
    name: "JTSBMQTMOI Nukus Filiali",
    provinces: [
      "Qoraqalpog’iston Respublikasi",
      "Xorazm viloyati",
      "Buxoro viloyati",
    ],
  },
  {
    key: "Fargʻona",
    name: "JTSBMQTMOI Fargʻona Filiali",
    provinces: ["Fargʻona viloyati", "Andijon viloyati", "Namangan viloyati"],
  },
  {
    key: "Samarqand",
    name: "JTSBMQTMOI Samarqand Filiali",
    provinces: [
      "Samarqand viloyati",
      "Qashqadaryo viloyati",
      "Navoiy viloyati",
      "Surxondaryo viloyati",
    ],
  },
  {
    key: "Toshkent",
    name: "JTSBMQTMO Instituti",
    provinces: [
      "Toshkent shahri",
      "Toshkent viloyati",
      "Jizzax viloyati",
      "Sirdaryo viloyati",
    ],
  },
];

export const directions = [
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
const filialName = (key) => FILIALS.find((f) => f.key === key)?.name || key;

const MONTH_NAMES = [
  "YANVAR",
  "FEVRAL",
  "MART",
  "APREL",
  "MAY",
  "IYUN",
  "IYUL",
  "AVGUST",
  "SENTABR",
  "OKTABR",
  "NOYABR",
  "DEKABR",
];

const getPlanDateParts = (input) => {
  const date = new Date(input);

  if (Number.isNaN(date.getTime())) {
    return { day: "—", month: "", year: "" };
  }

  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: MONTH_NAMES[date.getMonth()],
    year: date.getFullYear(),
  };
};

const getTodayDateValue = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${today.getFullYear()}-${month}-${day}`;
};

const MalakaPage = () => {
  const { user } = useSelector((s) => s.user);
  const defaultFilial = user?.region?.region || "";
  const defaultProvince =
    FILIALS.find((f) => f.key === defaultFilial)?.provinces?.[0] || "";
  const minDate = getTodayDateValue();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [filial, setFilial] = useState(defaultFilial);
  const [province, setProvince] = useState(defaultProvince);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const currentFilial = FILIALS.find((f) => f.key === filial) || FILIALS[0];
  const provinces = currentFilial.provinces;
  const [direction, setDirection] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/malaka/my");
      setRecords(data.data || []);
    } catch {
      toast.error("Ma'lumotlarni olishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!defaultFilial) return;

    setFilial(defaultFilial);

    const item = FILIALS.find((f) => f.key === defaultFilial);

    if (item) {
      setProvince(item.provinces[0]);
    }
  }, [defaultFilial]);

  const submit = async () => {
    if (!date) {
      toast.error("Sanani tanlang");
      return;
    }
    if (!directions.find((d) => d == direction)) {
      toast.error("Iltimos yonalishingizni tanlang");
      return;
    }
    setSaving(true);
    try {
      await axios.post("/malaka/create", {
        date,
        filial,
        province,
        note,
        direction,
      });
      toast.success("Qo'shildi");
      const item = FILIALS.find((f) => f.key === defaultFilial);

      setDate("");
      setNote("");
      setFilial(defaultFilial);
      setProvince(item?.provinces?.[0] || "");
      await load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  };

  const handleFilialChange = (e) => {
    const value = e.target.value;

    setFilial(value);

    const item = FILIALS.find((f) => f.key === value);

    if (item) {
      setProvince(item.provinces[0]);
    } else {
      setProvince("");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Ushbu yozuvni o'chirasizmi?")) return;
    try {
      await axios.delete(`/malaka/${id}`);
      toast.success("O'chirildi");
      await load();
    } catch (e) {
      toast.error(e.response?.data?.message || "O'chirishda xatolik");
    }
  };

  // --- Tahrirlash ---
  const startEdit = (r) => {
    const d = new Date(r.date);
    const iso = Number.isNaN(d.getTime())
      ? ""
      : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
          d.getDate()
        ).padStart(2, "0")}`;
    setEditing({
      _id: r._id,
      date: iso,
      filial: r.filial || defaultFilial,
      province: r.province || "",
      direction: r.direction || "",
      note: r.note || "",
    });
  };

  const editProvinces =
    FILIALS.find((f) => f.key === editing?.filial)?.provinces || [];

  const saveEdit = async () => {
    if (!editing?.date) {
      toast.error("Sanani tanlang");
      return;
    }
    if (!directions.find((d) => d === editing.direction)) {
      toast.error("Iltimos yonalishingizni tanlang");
      return;
    }
    setEditSaving(true);
    try {
      await axios.put(`/malaka/${editing._id}`, {
        date: editing.date,
        filial: editing.filial,
        province: editing.province,
        direction: editing.direction,
        note: editing.note,
      });
      toast.success("Yangilandi");
      setEditing(null);
      await load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Saqlashda xatolik");
    } finally {
      setEditSaving(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Malaka oshirish"
        subtitle="Malaka oshirishga qachon va qaysi filialga borishingizni belgilang. Filial sizning viloyatingiz bo'yicha avtomatik tanlanadi."
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
          gap: 2.5,
          alignItems: "start",
        }}
        style={{ marginTop: "25px" }}
      >
        <Card>
          <Box
            sx={{
              px: 3,
              py: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6">Yangi yozuv</Typography>
          </Box>
          <CardContent>
            <Stack spacing={2.5}>
              <TextField
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: minDate }}
              />
              <TextField
                select
                label="Filial"
                value={filial}
                onChange={handleFilialChange}
                fullWidth
                helperText="Standart holatda viloyatingiz filiali"
              >
                {FILIALS.map((f) => (
                  <MenuItem key={f.key} value={f.key}>
                    {f.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Viloyat"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                fullWidth
              >
                {provinces.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Yonalish"
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                required={true}
              >
                {directions.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Izoh (ixtiyoriy)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                fullWidth
                multiline
                rows={2}
              />
              <Button
                variant="contained"
                size="large"
                onClick={submit}
                disabled={saving}
              >
                {saving ? "Saqlanmoqda..." : "Qo'shish"}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2.5,
            }}
          >
            <Avatar
              sx={{
                width: { xs: 54, sm: 64 },
                height: { xs: 54, sm: 64 },
                bgcolor: "#EEF3FF",
                color: "#3563E9",
                flexShrink: 0,
              }}
            >
              <CalendarMonthRoundedIcon sx={{ fontSize: { xs: 30, sm: 36 } }} />
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: 28, sm: 36 },
                  color: "#1A2238",
                  lineHeight: 1,
                }}
              >
                Rejalarim
              </Typography>

              <Typography
                color="#6B7280"
                fontSize={{ xs: 14, sm: 16 }}
                mt={0.75}
              >
                Rejalashtirilgan malaka oshirish kurslari ro'yxati
              </Typography>
            </Box>
          </Box>

          {loading ? (
            <Card>
              <Loader height={200} />
            </Card>
          ) : records.length === 0 ? (
            <Card>
              <EmptyState
                icon={<SchoolRoundedIcon />}
                title="Reja yo'q"
                description="Malaka oshirish sanasini chapdagi shakl orqali qo'shing"
              />
            </Card>
          ) : (
            <Stack spacing={2}>
              {records.map((r) => {
                const note = r.note?.trim();
                const dateParts = getPlanDateParts(r.date);

                return (
                  <Card
                    key={r._id}
                    elevation={0}
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      border: "1px solid #E8ECF5",
                      display: "flex",
                      alignItems: { xs: "stretch", sm: "center" },
                      justifyContent: "space-between",
                      gap: { xs: 2, sm: 2.5 },
                      position: "relative",
                      overflow: "hidden",
                      padding: "10px",
                      flexDirection: { xs: "column", sm: "row" },
                      "&:before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 7,
                        bgcolor: "#3563E9",
                      },
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      alignItems={{ xs: "stretch", md: "center" }}
                      gap={{ xs: 2, md: 3 }}
                      sx={{
                        minWidth: 0,
                        flex: 1,
                        pl: { xs: 0.75, sm: 1 },
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: "100%", md: 128 },
                          // minHeight: { xs: 112, md: 158 },
                          borderRadius: { xs: 3, sm: 4 },
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        <CalendarMonthRoundedIcon
                          sx={{
                            color: "#3563E9",
                            fontSize: { xs: 30, md: 36 },
                            mb: 1,
                          }}
                        />

                        <Typography
                          fontWeight={800}
                          fontSize={{ xs: 40, md: 48 }}
                          color="#3563E9"
                          lineHeight={1}
                        >
                          {dateParts.day}
                        </Typography>

                        <Typography
                          fontWeight={700}
                          color="#3563E9"
                          fontSize={15}
                        >
                          {dateParts.month}
                        </Typography>

                        <Typography mt={0.5} color="#64748B" fontSize={15}>
                          {dateParts.year}
                        </Typography>
                      </Box>

                      <Box sx={{ minWidth: 0 }}>
                        <Chip
                          label={filialName(r.filial)}
                          sx={{
                            maxWidth: "100%",
                            height: "auto",
                            bgcolor: "#EEF3FF",
                            color: "#3563E9",
                            fontWeight: 700,
                            fontSize: { xs: 14, sm: 15 },
                            px: 1,
                            py: 1,
                            borderRadius: 2,
                            "& .MuiChip-label": {
                              display: "block",
                              whiteSpace: "normal",
                              lineHeight: 1.35,
                              py: 0.35,
                            },
                          }}
                        />

                        {r.province && (
                          <Box
                            mt={4}
                            // display="flex"
                            style={{
                              display: "flex",
                              marginTop: "15px",
                              gap: "10px",
                            }}
                            alignItems="center"
                            gap={1}
                            sx={{ minWidth: 0 }}
                          >
                            <LocationOnRoundedIcon
                              sx={{
                                color: "#5C667A",
                                fontSize: { xs: 24, sm: 28 },
                                flexShrink: 0,
                              }}
                            />

                            <Typography
                              fontSize={{ xs: 17, sm: 20 }}
                              fontWeight={700}
                              sx={{ overflowWrap: "anywhere" }}
                            >
                              {r.province}
                            </Typography>
                          </Box>
                        )}
                        {r.direction && (
                          <Box
                            mt={4}
                            // display="flex"
                            style={{
                              display: "flex",
                              marginTop: "15px",
                              gap: "10px",
                            }}
                            alignItems="center"
                            gap={1}
                            sx={{ minWidth: 0 }}
                          >
                            <SchoolRoundedIcon
                              sx={{
                                color: "#5C667A",
                                fontSize: { xs: 24, sm: 28 },
                                flexShrink: 0,
                              }}
                            />

                            <Typography
                              fontSize={{ xs: 17, sm: 20 }}
                              fontWeight={700}
                              sx={{ overflowWrap: "anywhere" }}
                            >
                              {r.direction}
                            </Typography>
                          </Box>
                        )}
                        {note && (
                          <Typography
                            mt={2}
                            color="#7A8599"
                            fontSize={{ xs: 15, sm: 17 }}
                            sx={{ overflowWrap: "anywhere", lineHeight: 1.45 }}
                          >
                            {note}
                          </Typography>
                        )}
                      </Box>
                    </Stack>

                    <Stack
                      direction={{ xs: "row", sm: "row" }}
                      spacing={1}
                      sx={{ flexShrink: 0 }}
                    >
                    <Tooltip title="Tahrirlash">
                      <IconButton
                        onClick={() => startEdit(r)}
                        sx={{
                          width: { xs: "100%", sm: 58 },
                          height: { xs: 52, sm: 58 },
                          borderRadius: { xs: 2.5, sm: "50%" },
                          bgcolor: "#EEF3FF",
                          flexShrink: 0,
                          "&:hover": { bgcolor: "#DDE7FF" },
                        }}
                      >
                        <EditRoundedIcon
                          sx={{ color: "#3563E9", fontSize: { xs: 28, sm: 30 } }}
                        />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="O'chirish">
                      <IconButton
                        onClick={() => remove(r._id)}
                        sx={{
                          width: { xs: "100%", sm: 58 },
                          height: { xs: 52, sm: 58 },
                          borderRadius: { xs: 2.5, sm: "50%" },
                          bgcolor: "#FFF1F1",
                          flexShrink: 0,
                          "&:hover": {
                            bgcolor: "#FFE4E4",
                          },
                        }}
                      >
                        <DeleteOutlineRoundedIcon
                          sx={{
                            color: "#E53935",
                            fontSize: { xs: 30, sm: 34 },
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                    </Stack>
                  </Card>
                );
              })}
            </Stack>
          )}
        </Box>
      </Box>

      {/* Arizani tahrirlash */}
      <Dialog
        open={!!editing}
        onClose={() => setEditing(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Arizani tahrirlash</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              type="date"
              label="Sana"
              value={editing?.date || ""}
              onChange={(e) =>
                setEditing((s) => ({ ...s, date: e.target.value }))
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: minDate }}
            />
            <TextField
              select
              label="Filial"
              value={editing?.filial || ""}
              onChange={(e) => {
                const value = e.target.value;
                const item = FILIALS.find((f) => f.key === value);
                setEditing((s) => ({
                  ...s,
                  filial: value,
                  province: item?.provinces?.[0] || "",
                }));
              }}
              fullWidth
            >
              {FILIALS.map((f) => (
                <MenuItem key={f.key} value={f.key}>
                  {f.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Viloyat"
              value={editing?.province || ""}
              onChange={(e) =>
                setEditing((s) => ({ ...s, province: e.target.value }))
              }
              fullWidth
            >
              {editProvinces.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Yonalish"
              value={editing?.direction || ""}
              onChange={(e) =>
                setEditing((s) => ({ ...s, direction: e.target.value }))
              }
              fullWidth
            >
              {directions.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Izoh (ixtiyoriy)"
              value={editing?.note || ""}
              onChange={(e) =>
                setEditing((s) => ({ ...s, note: e.target.value }))
              }
              fullWidth
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button color="inherit" onClick={() => setEditing(null)}>
            Bekor qilish
          </Button>
          <Button variant="contained" onClick={saveEdit} disabled={editSaving}>
            {editSaving ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MalakaPage;
