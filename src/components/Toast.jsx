import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { hideToast } from "../utils/toastSlice";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaTimes } from "react-icons/fa";

const ICONS = {
  success: <FaCheckCircle className="text-green-400 text-lg shrink-0" />,
  error: <FaTimesCircle className="text-red-400 text-lg shrink-0" />,
  info: <FaInfoCircle className="text-blue-400 text-lg shrink-0" />,
};

const BORDERS = {
  success: "border-green-500/40",
  error: "border-red-500/40",
  info: "border-blue-500/40",
};

const Toast = () => {
  const dispatch = useDispatch();
  const { message, type, visible } = useSelector((store) => store.toast);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => dispatch(hideToast()), 3000);
    return () => clearTimeout(timer);
  }, [visible, message, dispatch]);

  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] transition-all duration-400 ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl glass border ${BORDERS[type] || BORDERS.info} shadow-2xl min-w-[260px] max-w-sm`}
      >
        {ICONS[type] || ICONS.info}
        <p className="text-white text-sm font-medium flex-1">{message}</p>
        <button
          onClick={() => dispatch(hideToast())}
          className="text-white/40 hover:text-white transition-colors ml-1"
        >
          <FaTimes className="text-xs" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
