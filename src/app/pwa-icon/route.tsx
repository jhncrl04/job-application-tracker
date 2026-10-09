import { iconImage } from "@/lib/icon-image";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requested = Number(searchParams.get("size"));
  const size = requested === 192 ? 192 : 512;
  return iconImage(size, searchParams.get("maskable") === "1");
}
