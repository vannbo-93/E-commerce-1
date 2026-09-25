/** @format */
import {
  Alert,
  Button,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  ThemeProvider,
} from "@mui/material";
import type { AlertColor } from "@mui/material";

// نفس خط ولون موقعك بدل الافتراضي في MUI
const theme = createTheme({
  typography: { fontFamily: '"Inter", sans-serif' },
  shape: { borderRadius: 2 },
  palette: {
    primary: { main: "#0ea5e9" }, // sky-500
    info: { main: "#0284c7" }, // sky-600
    success: { main: "#0ea5e9" }, // green-600
    warning: { main: "#d97706" }, // amber-600
    error: { main: "#dc2626" }, // red-600
  },
});

/* ---------- نافذة تأكيد (بديل window.confirm) ---------- */
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmText = "Delete",
  onClose,
  onConfirm,
}: ConfirmDialogProps) => (
  <ThemeProvider theme={theme}>
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      sx={{ "& .MuiDialog-paper": { borderRadius: 2 } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <Alert variant="filled" severity="warning">
          {message}
        </Alert>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          color="inherit"
          sx={{ textTransform: "none", fontWeight: 600 }}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disableElevation
          sx={{ textTransform: "none", fontWeight: 600 }}>
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  </ThemeProvider>
);

/* ---------- رسالة قصيرة تختفي تلقائيًا ---------- */
interface ToastProps {
  open: boolean;
  message: string;
  severity?: AlertColor;
  onClose: () => void;
}

export const Toast = ({
  open,
  message,
  severity = "success",
  onClose,
}: ToastProps) => (
  <ThemeProvider theme={theme}>
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={(_, reason) => {
        if (reason === "clickaway") return;
        onClose();
      }}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert
        variant="filled"
        severity={severity}
        onClose={onClose}
        sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  </ThemeProvider>
);
