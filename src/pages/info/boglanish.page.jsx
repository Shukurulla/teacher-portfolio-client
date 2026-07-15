import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  Link as MuiLink,
} from "@mui/material";
import TelegramIcon from "@mui/icons-material/Telegram";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import { PageHeader } from "../../components/ui";

// ⚙️ Bu qiymatlarni o'zingiznikiga o'zgartiring
const CONTACTS = {
  telegramNick: "@portfolio_sport_admin",
  telegramGroup: "https://t.me/portfolio_sport",
  telegramGroupLabel: "@portfolio_sport",
  phone: "+998 90 000 00 00",
};

const ContactCard = ({ icon, color, label, value, href }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Stack spacing={1.5} alignItems="flex-start">
        <Avatar sx={{ bgcolor: color, width: 52, height: 52 }}>{icon}</Avatar>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          {href ? (
            <MuiLink
              href={href}
              target="_blank"
              rel="noopener"
              sx={{ fontWeight: 700, fontSize: 18 }}
            >
              {value}
            </MuiLink>
          ) : (
            <Typography sx={{ fontWeight: 700, fontSize: 18 }}>{value}</Typography>
          )}
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const ContactPage = () => {
  return (
    <Box>
      <PageHeader
        title="Bog'lanish"
        subtitle="Savol yoki muammo bo'lsa, biz bilan bog'laning"
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(3,1fr)" },
          gap: 2.5,
        }}
      >
        <ContactCard
          icon={<TelegramIcon />}
          color="#229ED9"
          label="Telegram (admin)"
          value={CONTACTS.telegramNick}
          href={`https://t.me/${CONTACTS.telegramNick.replace("@", "")}`}
        />
        <ContactCard
          icon={<GroupsRoundedIcon />}
          color="#7c3aed"
          label="Telegram guruh"
          value={CONTACTS.telegramGroupLabel}
          href={CONTACTS.telegramGroup}
        />
        <ContactCard
          icon={<PhoneRoundedIcon />}
          color="#16a34a"
          label="Telefon"
          value={CONTACTS.phone}
          href={`tel:${CONTACTS.phone.replace(/\s/g, "")}`}
        />
      </Box>
    </Box>
  );
};

export default ContactPage;
