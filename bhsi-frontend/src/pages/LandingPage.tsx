import {
  Box,
  Container,
  Typography,
  useMediaQuery,
  AppBar,
  Toolbar,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { LogOut } from "lucide-react";
import { useAuth } from "../auth/useAuth";
import TrafficLightQuery from "../components/TrafficLightQuery";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ExecutiveSummaryCard from "../components/ManagementSummary/ExecutiveSummaryCard";

const LandingPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [executiveSummary, setExecutiveSummary] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>("");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Header/Nav */}
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BHSI Traffic Light
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body2"
              sx={{ mr: 2, display: { xs: "none", sm: "block" } }}
            >
              {user?.name || "User"}
            </Typography>
            <Button
              color="inherit"
              onClick={logout}
              startIcon={<LogOut size={18} />}
              size={isMobile ? "small" : "medium"}
            >
              {isMobile ? "" : "Sign Out"}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: { xs: 6, md: 10 },
          backgroundImage: "linear-gradient(to bottom right, #003366, #00508F)",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 800, mx: "auto", textAlign: "center" }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              }}
            >
              BHSI Traffic Light Scoring System
            </Typography>
            <Typography
              variant="h6"
              component="p"
              color="white"
              sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}
            >
              Enter a company name to receive an instant risk
              assessment with detailed analysis and actionable insights for
              D&amp;O insurance decisions.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6, flex: 1 }}>
        {/* Traffic Light Query Section */}
        <Box>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ mb: 3, textAlign: { xs: "center", md: "left" } }}
          >
            Company Risk Assessment
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 4, maxWidth: 800 }}>
            Enter a company name to receive an instant risk
            assessment based on our proprietary algorithm analyzing turnover,
            shareholding structure, bankruptcy history, and legal issues.
          </Typography>
          <TrafficLightQuery
            onRiskResult={(company, executiveSummary) => {
              setCompanyName(company);
              setExecutiveSummary(executiveSummary);
            }}
          />
        </Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: theme.palette.grey[100],
          borderTop: `1px solid ${theme.palette.grey[300]}`,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Berkshire Hathaway Specialty Insurance.
            All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
