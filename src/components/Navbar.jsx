import {Drawer,Box,IconButton,Typography,List,ListItemButton,ListItemIcon,ListItemText,Divider,} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";
import ReportIcon from "@mui/icons-material/Report";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function Navbar({ isOpen, setIsOpen }) {
    const { user } = useAuth();
    const isMunicipality = user?.role === "municipality";
    const isSuperAdmin = user?.role === "superAdmin";
    const closeNavbar = () => {
        setIsOpen(false)
    }
    return (
        <>
            <IconButton onClick={() => setIsOpen(true)} sx={{
                    position: "fixed",
                    top: 20,
                    left: 20,
                    zIndex: 1200,
                    width: 50,
                    height: 50,
                    backgroundColor: "#591270",
                    color: "white",
                    "&:hover": {
                        backgroundColor: "#46105a",
                    }
                }}
            >
            <MenuIcon fontSize="large" />
            </IconButton>
           <Drawer anchor="left" open={isOpen} onClose={closeNavbar} sx={{"& .MuiDrawer-paper": {
            width: 265,
            backgroundColor: "#591270 !important",
            color: "white",
            boxSizing: "border-box",
        }}}>
                {/* close button */}
                <Box sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        p: 1,
                    }}>
                    <IconButton onClick={closeNavbar} sx={{
                        color: "white",
                        "&:hover": {
                            backgroundColor: "rgba(255,255,255,0.1)",
                        }}}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* logo */}
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: 2,
                    mb: 4,
                }}>
                <Box sx={{
                    width: 130,
                    height: 85,
                    backgroundColor: "white",
                    borderRadius: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    p: 1,
                    boxSizing: "border-box",
                    overflow: "hidden",
                }}>
                <Box component="img" src="/LOGO.webp" alt="SPDMS Logo" sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                }}/>
                </Box>
                <Typography variant="h4" sx={{
                    fontWeight: 700,
                    letterSpacing: 1,
                    mt: 1,
                }}>SPDMS</Typography>
                </Box>
                <Divider sx={{
                    borderColor: "rgba(255,255,255,0.2)",
                    mx: 2,
                    mb: 2,
                }}/>
                {/* Navbar links */}
                <List sx={{ px: 1.5 }}>
                {/* Home link*/}
                <ListItemButton component={Link} to="/user" onClick={closeNavbar} sx={{
                    color: "white",
                    borderRadius: 2,
                    mb: 1,
                    py: 1.5,
                    "&:hover": {
                        backgroundColor: "#682f7a",
                    }}}>
                    <ListItemIcon sx={{
                        color: "white",
                        minWidth: 45,
                    }}>
                    <HomeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Home" slotProps={{
                        primary: {
                            fontSize: "1.1rem",
                            fontWeight: 500,
                        }}}/>
                    </ListItemButton>
                    {/* the report button*/}
                    <ListItemButton component={Link} to="/report" onClick={closeNavbar} sx={{
                        color: "white",
                        borderRadius: 2,
                        mb: 1,
                        py: 1.5,
                        "&:hover": {
                            backgroundColor: "#682f7a",
                        }}}>
                        <ListItemIcon sx={{
                            color: "white",
                            minWidth: 45,
                        }}>
                        <ReportIcon />
                        </ListItemIcon>

                        <ListItemText primary="Report" slotProps={{ primary: {
                            fontSize: "1.1rem",
                            fontWeight: 500,
                        }}}/>
                    </ListItemButton>
                    {/* municipality reports link */}
                    {(isMunicipality || isSuperAdmin) && (
                        <ListItemButton component={Link} to="/municipality" onClick={closeNavbar} sx={{
                            color: "white",
                            borderRadius: 2,
                            mb: 1,
                            py: 1.5,
                            "&:hover": {
                                backgroundColor: "#682f7a",
                            }}}>
                            <ListItemIcon sx={{
                                color: "white",
                                minWidth: 45,
                            }}>
                            <AssessmentIcon />
                            </ListItemIcon>

                            <ListItemText primary="View Reports" slotProps={{
                            primary: {
                                fontSize: "1.1rem",
                                fontWeight: 500,
                            }}}/>
                        </ListItemButton>
                    )}

                    {/* admin link*/}
                    {isSuperAdmin && (
                        <ListItemButton component={Link} to="/superadmin" onClick={closeNavbar} sx={{
                        color: "white",
                        borderRadius: 2,
                        mb: 1,
                        py: 1.5,
                        "&:hover": {
                            backgroundColor: "#682f7a",
                        }}}>
                        <ListItemIcon
                        sx={{
                            color: "white",
                            minWidth: 45,
                        }}>
                        <AdminPanelSettingsIcon />
                        </ListItemIcon>
                            <ListItemText primary="Admin" slotProps={{
                            primary: {
                                fontSize: "1.1rem",
                                fontWeight: 500,
                            }}}/>
                        </ListItemButton>
                    )}
                </List>
            </Drawer>
        </>
    )
}
export default Navbar