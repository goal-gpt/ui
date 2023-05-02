import { toast as toastOriginal } from "react-toastify";

export const TOAST_ERROR = toastOriginal.TYPE.ERROR;
export const TOAST_INFO = toastOriginal.TYPE.INFO;
export const TOAST_SUCCESS = toastOriginal.TYPE.SUCCESS;
export const TOAST_WARNING = toastOriginal.TYPE.WARNING;
export const toast = toastOriginal;
