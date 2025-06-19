import { responses } from "@/app/lib/api/response";
import fs from "fs/promises";
import path from "path";

export const GET = async () => {
  const filePath = path.resolve(process.cwd(), "packages/forms/dist/index.umd.cjs");

  try {
    const packageSrcCode = await fs.readFile(filePath, "utf-8");

    return new Response(packageSrcCode, {
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "public, s-maxage=600, max-age=1800, stale-while-revalidate=600, stale-if-error=600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    console.error("Error reading file:", error);

    if (error.code === "ENOENT") {
      return responses.notFoundResponse(
        "package",
        "forms",
        true,
        "public, s-maxage=600, max-age=1800, stale-while-revalidate=600, stale-if-error=600"
      );
    }

    return responses.internalServerErrorResponse(
      "file read error",
      true,
      "public, s-maxage=600, max-age=1800, stale-while-revalidate=600, stale-if-error=600"
    );
  }
};
