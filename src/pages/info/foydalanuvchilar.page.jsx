import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Link as MuiLink,
  Divider,
} from "@mui/material";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import GavelRoundedIcon from "@mui/icons-material/GavelRounded";
import { PageHeader } from "../../components/ui";

const DIPLOM = { label: "Jismoniy tarbiya va sport sohasidagi ma'lumoti", url: "https://diplom.edu.uz/" };
const SPORT_TOIFA = { label: "Sport toifasi uchun", url: "https://my.sport.uz/uz/services/sport-titles-info" };
const MALAKA_TOIFA = { label: "Malaka toifasi uchun", url: "https://my.sport.uz/uz/services/category-check-info" };
const HAKAMLIK = { label: "Sport turi bo'yicha hakamlik toifasi uchun", url: "https://erp.sport.uz/" };
const SINOV = { label: "Sport sinovlari natijasiga ko'ra jismoniy tayyorgarlik darajasi", url: "https://my.sport.uz/uz/interactive-services/physical-training-statistics" };
const TRENER = { label: "Trenerlik yoki trener-yo'riqchilik faoliyati uchun", url: "https://my.mehnat.uz" };
const MALAKA_PED = { label: "Malaka toifasi uchun (pedagog)", url: "https://pedagog.uzedu.uz/" };
const ADABIYOT = { label: "O'quv-uslubiy adabiyotlar tayyorlagani", url: "https://ommalashtirish.avloniy.uz/login/" };

const SECTIONS = [
  { rn: "I", title: "Sport ta'lim muassasalari rahbar va o'rinbosarlari", pdf: 1, links: [DIPLOM, SPORT_TOIFA, HAKAMLIK, SINOV] },
  { rn: "II", title: "Sport ta'lim muassasalari yo'riqchi-uslubchilari", pdf: 2, links: [DIPLOM, SPORT_TOIFA, MALAKA_TOIFA, HAKAMLIK, SINOV] },
  { rn: "III", title: "Sport turlarini rivojlantirish respublika markazlari, Olimpiya va paralimpiya markazlari, ixtisoslashtirilgan sport maktablari trenerlari", pdf: 3, links: [SPORT_TOIFA, MALAKA_TOIFA, HAKAMLIK] },
  { rn: "IV", title: "Sport maktablari trenerlari", pdf: 4, links: [DIPLOM, SPORT_TOIFA, MALAKA_TOIFA, HAKAMLIK, SINOV] },
  { rn: "V", title: "Sport psixologlari", pdf: 5, links: [{ label: "Psixologiya (sport) sohasidagi ma'lumoti", url: "https://diplom.edu.uz/" }, { label: "Sport turi bo'yicha kattalar sporti razryadi", url: "https://my.sport.uz/uz/login" }] },
  { rn: "VI", title: "Oliy ta'lim muassasalarining jismoniy tarbiya va sport yo'nalishlari bo'yicha rahbar va pedagog kadrlari", pdf: 6, links: [{ label: "Ilmiy daraja va unvoni uchun", url: "https://oldmy.gov.uz/oz/submission-scientific-degrees-v1/applicanti-info-applicant/create" }, TRENER] },
  { rn: "VII", title: "Kasbiy ta'lim tashkilotlari jismoniy tarbiya fani mutaxassislari", pdf: 7, links: [SPORT_TOIFA, TRENER, SINOV] },
  { rn: "VIII", title: "Umumiy o'rta va o'rta maxsus ta'lim tashkilotlari jismoniy tarbiya fani mutaxassislari", pdf: 8, links: [MALAKA_PED, SPORT_TOIFA, TRENER, SINOV, ADABIYOT] },
  { rn: "IX", title: "Maktabgacha ta'lim tashkilotlari jismoniy tarbiya yo'riqchilari", pdf: 9, links: [DIPLOM, MALAKA_PED, SPORT_TOIFA, TRENER, SINOV, ADABIYOT] },
];

const ForUsersPage = () => {
  return (
    <Box>
      <PageHeader
        title="Foydalanuvchilar uchun"
        subtitle="Kasbiy faoliyat natijalarini baholash mezonlari va tegishli havolalar"
      />

      <Card sx={{ mb: 2.5, bgcolor: "primary.main", color: "#fff", border: 0 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <GavelRoundedIcon />
            <Box>
              <Typography sx={{ fontWeight: 700 }}>
                Vazirlar Mahkamasining Jismoniy tarbiya va sport bo'yicha
                mutaxassislarni qayta tayyorlash va malakasini oshirish tizimini
                takomillashtirish to'g'risidagi QARORI
              </Typography>
              <MuiLink
                href="https://lex.uz/docs/-6093267"
                target="_blank"
                rel="noopener"
                sx={{ color: "#fff", textDecorationColor: "rgba(255,255,255,0.6)", fontWeight: 600, mt: 0.5, display: "inline-flex", alignItems: "center", gap: 0.5 }}
              >
                lex.uz/docs/-6093267 <OpenInNewRoundedIcon sx={{ fontSize: 16 }} />
              </MuiLink>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={1.5}>
        {SECTIONS.map((s) => (
          <Accordion key={s.rn} disableGutters sx={{ border: "1px solid", borderColor: "divider", "&:before": { display: "none" }, borderRadius: 3, overflow: "hidden" }}>
            <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box sx={{ minWidth: 40, height: 40, borderRadius: 2, bgcolor: "primary.main", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800 }}>
                  {s.rn}
                </Box>
                <Typography sx={{ fontWeight: 600 }}>{s.title}</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails>
              <Button
                variant="contained"
                startIcon={<DownloadRoundedIcon />}
                href={`/criteria/${s.pdf}.pdf`}
                download
                sx={{ mb: 2 }}
              >
                Baholash mezonini yuklab oling
              </Button>
              <Divider sx={{ mb: 1.5 }} />
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Tegishli tizimlar:
              </Typography>
              <Stack spacing={1}>
                {s.links.map((l, i) => (
                  <MuiLink
                    key={i}
                    href={l.url}
                    target="_blank"
                    rel="noopener"
                    sx={{ display: "inline-flex", alignItems: "center", gap: 0.75, fontWeight: 500, width: "fit-content" }}
                  >
                    <OpenInNewRoundedIcon sx={{ fontSize: 16 }} />
                    {l.label}
                  </MuiLink>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Box>
  );
};

export default ForUsersPage;
