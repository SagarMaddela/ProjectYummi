// src/components/Navbar.js
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    console.log("Logged out successfully");
    navigate("/login");  // Navigate to login page after logout
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "#34495E",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Toolbar>
        {/* App Title */}
        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            color: "#ECF0F1",
            fontWeight: "bold",
            cursor: "pointer",
            "&:hover": {
              color: "#BDC3C7",
            },
          }}
          onClick={() => navigate("/")}
        >
          Admin Dashboard
        </Typography>

        {/* Logout Button */}
        <Box>
          <Button
            onClick={handleLogout}
            variant="contained"
            sx={{
              backgroundColor: "#E74C3C",
              color: "#fff",
              textTransform: "none",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#C0392B",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
