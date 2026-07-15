import { useEffect, useState } from "react";
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
  Alert,
} from "@mui/material";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import WorkspacePremiumRoundedIcon from "@mui/icons-material/WorkspacePremiumRounded";
import { toast } from "react-hot-toast";
import { PageHeader, StatusChip, Loader, EmptyState } from "../../components/ui";

const SpecialPage = () => {
  const [items, setItems] = useState([]);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemIndex, setItemIndex] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [itemsRes, myRes] = await Promise.all([
        axios.get("/special-items"),
        axios.get("/special/my"),
      ]);
      setItems(itemsRes.data.data || []);
      setSubs(myRes.data.data || []);
    } catch (e) {
      toast.error("Ma'lumotlarni olishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (itemIndex === "" || !file) {
      toast.error("Band va hujjatni tanlang");
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("itemIndex", itemIndex);
      fd.append("file", file);
      await axios.post("/special/upload", fd);
      toast.success("Hujjat yuborildi");
      setItemIndex("");
      setFile(null);
      await load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Yuborishda xatolik");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Ushbu topshiriqni o'chirasizmi?")) return;
    try {
      await axios.delete(`/special/${id}`);
      toast.success("O'chirildi");
      await load();
    } catch {
      toast.error("O'chirishda xatolik");
    }
  };

  return (
    <Box>
      <PageHeader
        title="Maxsus yutuqlar"
        subtitle="VM 355-son qarori (19-band) bo'yicha maxsus yutuqlar. Bunday yutug'ingiz bo'lsa, tasdiqlovchi hujjatni yuklang — muqobil malaka oshirish shakliga o'tasiz."
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
            <Typography variant="h6">Yangi hujjat yuborish</Typography>
          </Box>
          <CardContent>
            <Stack spacing={2.5}>
              <TextField
                select
                label="Maxsus yutuq turini tanlang"
                value={itemIndex}
                onChange={(e) => setItemIndex(e.target.value)}
                fullWidth
              >
                <MenuItem value="">
                  <em>Tanlang</em>
                </MenuItem>
                {items.map((it, i) => (
                  <MenuItem key={i} value={i} sx={{ whiteSpace: "normal", maxWidth: 560 }}>
                    {i + 1}. {it}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                component="label"
                variant="outlined"
                startIcon={<UploadFileRoundedIcon />}
                sx={{ justifyContent: "flex-start", py: 1.25 }}
              >
                {file ? file.name : "Hujjat tanlash (PDF yoki DOCX)"}
                <input
                  hidden
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </Button>

              <Button
                variant="contained"
                onClick={submit}
                disabled={submitting}
                size="large"
              >
                {submitting ? "Yuborilmoqda..." : "Yuborish"}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6">Mening topshiriqlarim</Typography>
          </Box>
          {loading ? (
            <Loader height={200} />
          ) : subs.length === 0 ? (
            <EmptyState
              icon={<WorkspacePremiumRoundedIcon />}
              title="Hozircha topshiriq yo'q"
              description="Maxsus yutuq hujjatingizni chapdagi shakl orqali yuboring"
            />
          ) : (
            <Stack divider={<Divider />}>
              {subs.map((s) => (
                <Stack
                  key={s._id}
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={1.5}
                  sx={{ px: 3, py: 2 }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {s.itemTitle}
                    </Typography>
                    <Box mt={0.75}>
                      <StatusChip status={s.status} />
                    </Box>
                    {s.status === "Tasdiqlanmadi" && s.resultMessage && (
                      <Typography variant="caption" color="error" display="block" mt={0.5}>
                        {s.resultMessage}
                      </Typography>
                    )}
                  </Box>
                  {s.status === "Tekshirilmoqda" && (
                    <Tooltip title="O'chirish">
                      <IconButton color="error" onClick={() => remove(s._id)}>
                        <DeleteOutlineRoundedIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              ))}
            </Stack>
          )}
        </Card>
      </Box>

      {subs.some((s) => s.status === "Tasdiqlandi") && (
        <Alert severity="success" sx={{ mt: 2.5 }}>
          Sizda tasdiqlangan maxsus yutuq bor — muqobil malaka oshirish shakliga
          o'tish huquqiga egasiz.
        </Alert>
      )}
    </Box>
  );
};

export default SpecialPage;
