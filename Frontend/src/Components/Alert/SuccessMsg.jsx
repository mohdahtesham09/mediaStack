import React, { useEffect } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { resetSuccessAction } from "../../Redux/slices/globalSlice/globalSlice";

const SuccessMsg = ({ message }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (!message) return;
    Swal.fire({ icon: "success", title: "Good Job", text: message });
    dispatch(resetSuccessAction());
  }, [message, dispatch]);
  return null;
};

export default SuccessMsg;
