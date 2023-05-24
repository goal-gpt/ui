import { toast as toastOriginal } from "react-toastify";

const defaultOptions = {
  autoClose: 2000,
  hideProgressBar: true,
};

export const TOAST_ERROR = toastOriginal.TYPE.ERROR;
export const TOAST_INFO = toastOriginal.TYPE.INFO;
export const TOAST_SUCCESS = toastOriginal.TYPE.SUCCESS;
export const TOAST_WARNING = toastOriginal.TYPE.WARNING;

export const toast = (content: string, options = {}) => {
  toastOriginal(content, { ...defaultOptions, ...options });
};
