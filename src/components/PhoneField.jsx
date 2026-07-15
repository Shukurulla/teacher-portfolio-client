import { TextField, InputAdornment } from "@mui/material";
import PhoneRounded from "@mui/icons-material/PhoneRounded";

// value — kanonik satr ("+998XXXXXXXXX") yoki "".
// onChange — kanonik satrni qaytaradi.
// Ko'rinishda har doim "+998 XX XXX XX XX".
const digitsOf = (v) =>
  String(v || "")
    .replace(/\D/g, "")
    .replace(/^998/, "")
    .slice(0, 9);

const PhoneField = ({ value, onChange, ...props }) => {
  const d = digitsOf(value);
  const display =
    "+998" +
    (d ? " " : "") +
    [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)]
      .filter(Boolean)
      .join(" ");

  const handle = (e) => {
    const nd = e.target.value
      .replace(/\D/g, "")
      .replace(/^998/, "")
      .slice(0, 9);
    onChange(nd ? "+998" + nd : "");
  };

  return (
    <TextField
      value={display}
      onChange={handle}
      inputProps={{ inputMode: "numeric" }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PhoneRounded fontSize="small" color="action" />
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

export default PhoneField;
