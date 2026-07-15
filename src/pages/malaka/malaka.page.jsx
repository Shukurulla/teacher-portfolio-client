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
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import { toast } from "react-hot-toast";
import { PageHeader, Loader, EmptyState } from "../../components/ui";

const FILIALS = [
  { key: "Nukus", name: "JTSBMQTMOI Nukus Filiali" },
  { key: "Fargʻona", name: "JTSBMQTMOI Fargʻona Filiali" },
  { key: "Samarqand", name: "JTSBMQTMOI Samarqand Filiali" },
  { key: "Toshkent", name: "JTSBMQTMO Instituti" },
];
const filialName = (key) => FILIALS.find((f) => f.key === key)?.name || key;

const MalakaPage = () => {
  const { user } = useSelector((s) => s.user);
  const defaultFilial = user?.region?.region || "";
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [filial, setFilial] = useState(defaultFilial);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

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
    if (defaultFilial && !filial) setFilial(defaultFilial);
  }, [defaultFilial]);

  const submit = async () => {
    if (!date) {
      toast.error("Sanani tanlang");
      return;
    }
    setSaving(true);
    try {
      await axios.post("/malaka/create", {
        date,
        filial: filial || defaultFilial,
        note,
      });
      toast.success("Qo'shildi");
      setDate("");
      setNote("");
      setFilial(defaultFilial);
      await load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Saqlashda xatolik");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Ushbu yozuvni o'chirasizmi?")) return;
    try {
      await axios.delete(`/malaka/${id}`);
      toast.success("O'chirildi");
      await load();
    } catch {
      toast.error("O'chirishda xatolik");
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
      >
        <Card>
          <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6">Yangi yozuv</Typography>
          </Box>
          <CardContent>
            <Stack spacing={2.5}>
              <TextField
                type="date"
                label="Sana"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                select
                label="Filial"
                value={filial}
                onChange={(e) => setFilial(e.target.value)}
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
                label="Izoh (ixtiyoriy)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                fullWidth
                multiline
                rows={2}
              />
              <Button variant="contained" size="large" onClick={submit} disabled={saving}>
                {saving ? "Saqlanmoqda..." : "Qo'shish"}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6">Rejalarim</Typography>
          </Box>
          {loading ? (
            <Loader height={200} />
          ) : records.length === 0 ? (
            <EmptyState
              icon={<SchoolRoundedIcon />}
              title="Reja yo'q"
              description="Malaka oshirish sanasini chapdagi shakl orqali qo'shing"
            />
          ) : (
            <Stack divider={<Divider />}>
              {records.map((r) => (
                <Stack
                  key={r._id}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={1.5}
                  sx={{ px: 3, py: 2 }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" gap={0.75}>
                      <EventRoundedIcon fontSize="small" color="primary" />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {new Date(r.date).toLocaleDateString("uz-UZ", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" gap={0.75} mt={0.5}>
                      <PlaceRoundedIcon fontSize="small" sx={{ color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        {filialName(r.filial)}
                      </Typography>
                    </Stack>
                    {r.note && (
                      <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                        {r.note}
                      </Typography>
                    )}
                  </Box>
                  <Tooltip title="O'chirish">
                    <IconButton color="error" onClick={() => remove(r._id)}>
                      <DeleteOutlineRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              ))}
            </Stack>
          )}
        </Card>
      </Box>
    </Box>
  );
};

export default MalakaPage;
