// src/components/CustomModal.tsx
import React from "react";
import { Modal, Box } from "@mui/material";

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ open, onClose, children }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          width: "90%",
          maxWidth: 500,
          mx: "auto",
          mt: "10%",
        }}
      >
        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;
