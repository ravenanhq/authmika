import React from "react";
import { createRoot } from "react-dom/client";
import { TokenExpiredModal } from "./TokenExpiredModal";

export function showModal() {
	const modalRoot = document.getElementById("modal-root");
	if (!modalRoot) return;
	const root = createRoot(modalRoot);
	root.render(<TokenExpiredModal />);
}
