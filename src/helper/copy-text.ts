import copy from "clipboard-copy";
import { toast } from "sonner"

export const copyText = async (text: string) => {
  try {
    await copy(text);
    toast(`Copied ${text}`)
  } catch (error) {
    console.log("Error copying text")
    toast("Failed to copy")
  }
};
