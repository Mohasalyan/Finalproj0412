import { Typography, useMediaQuery } from "@mui/material";
import "./SectionHeader.scss";
import { MED_SCREEN, SMALL_SCREEN } from "@src/constants";
function SectionHeader({ title }) {
  const isSmallScreen = useMediaQuery(`(${MED_SCREEN})`);

  return (
    <Typography
      className="sectionHeader"
      sx={{
        textAlign: "center",
        fontSize: isSmallScreen ? 20 : 50,
        fontWeight: 200,
        marginInline: "auto !important",
      }}>
      {title}
    </Typography>
  );
}

export default SectionHeader;
