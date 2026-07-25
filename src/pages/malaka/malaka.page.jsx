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
          {/* Ro'yxat sarlavhasi — ixcham */}
          <Stack direction="row" alignItems="center" gap={1.5} mb={2}>
            <Avatar
              sx={{ width: 40, height: 40, bgcolor: "#EEF3FF", color: "#3563E9" }}
            >
              <CalendarMonthRoundedIcon sx={{ fontSize: 22 }} />
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                Rejalarim
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Rejalashtirilgan malaka oshirish kurslari
              </Typography>
            </Box>
            <Box flex={1} />
            {!loading && records.length > 0 && (
              <Chip
                size="small"
                label={records.length}
                sx={{ bgcolor: "#EEF3FF", color: "#3563E9", fontWeight: 700 }}
              />
            )}
          </Stack>

          {loading ? (
            <Card>
              <Loader height={180} />
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
            <Stack spacing={1.5}>
              {records.map((r) => {
                const note = r.note?.trim();
                const d = getPlanDateParts(r.date);

                return (
                  <Card
                    key={r._id}
                    sx={{
                      p: 1.75,
                      display: "flex",
                      alignItems: "center",
                      gap: 1.75,
                      position: "relative",
                      overflow: "hidden",
                      "&:before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        bgcolor: "#3563E9",
                      },
                    }}
                  >
                    {/* Sana bloki */}
                    <Box
                      sx={{
                        ml: 0.5,
                        width: 62,
                        flexShrink: 0,
                        textAlign: "center",
                        bgcolor: "#F5F8FF",
                        borderRadius: 2,
                        py: 0.75,
                      }}
                    >
                      <Typography
                        sx={{ fontWeight: 800, fontSize: 22, color: "#3563E9", lineHeight: 1.1 }}
                      >
                        {d.day}
                      </Typography>
                      <Typography
                        sx={{ fontWeight: 700, fontSize: 10, color: "#3563E9", letterSpacing: .3 }}
                      >
                        {d.month}
                      </Typography>
                      <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
                        {d.year}
                      </Typography>
                    </Box>

                    {/* Ma'lumot */}
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 700, color: "#3563E9", mb: 0.4 }}
                        noWrap
                      >
                        {filialName(r.filial)}
                      </Typography>

                      {r.province && (
                        <Stack direction="row" alignItems="center" gap={0.75}>
                          <LocationOnRoundedIcon
                            sx={{ fontSize: 15, color: "text.secondary", flexShrink: 0 }}
                          />
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {r.province}
                          </Typography>
                        </Stack>
                      )}

                      {r.direction && (
                        <Stack direction="row" alignItems="flex-start" gap={0.75} mt={0.4}>
                          <SchoolRoundedIcon
                            sx={{ fontSize: 15, color: "text.secondary", flexShrink: 0, mt: "2px" }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                            title={r.direction}
                          >
                            {r.direction}
                          </Typography>
                        </Stack>
                      )}

                      {note && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mt: 0.5, fontStyle: "italic" }}
                        >
                          {note}
                        </Typography>
                      )}
                    </Box>

                    {/* Amallar */}
                    <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                      <Tooltip title="Tahrirlash">
                        <IconButton size="small" onClick={() => startEdit(r)}>
                          <EditRoundedIcon sx={{ fontSize: 19, color: "#3563E9" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="O'chirish">
                        <IconButton size="small" onClick={() => remove(r._id)}>
                          <DeleteOutlineRoundedIcon sx={{ fontSize: 19, color: "#E53935" }} />
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
