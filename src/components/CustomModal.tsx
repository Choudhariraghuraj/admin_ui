// src/components/CustomModal.tsx
import React from "react";
import { Modal, useTheme, Box } from "@mui/material";

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ open, onClose, children }) => {
  const theme = useTheme();

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="flex justify-center items-center min-h-screen">
        <Box
        className="rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto mt-24"
          sx={{
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary
          }}
        >
          {children}
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomModal;
