import { Card, CardContent } from "@mui/material";

const BoxComponent = ({ children }) => {
  return (
    <Card>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default BoxComponent;
