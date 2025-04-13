// src/components/CustomModal.tsx
import React from "react";
import { Modal } from "@mui/material";

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ open, onClose, children }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto mt-24">
          {children}
        </div>
      </div>
    </Modal>
  );
};

export default CustomModal;
