import { NextResponse } from "next/server";
import { worker } from "@/server/services/jobs/worker";

export const maxDuration = 60; // Max execution time

export async function GET(req: Request) {
  try {
    // Basic security for cron (ensure it's authorized if needed)
    const authHeader = req.headers.get("authorization");
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Process up to 50 jobs per cron tick
    const result = await worker.processPendingJobs(50);

    return NextResponse.json({
      success: true,
      message: `Processed ${result.processed} jobs, ${result.failed} failed.`,
      ...result,
    });
  } catch (error: any) {
    console.error("Error processing jobs:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
