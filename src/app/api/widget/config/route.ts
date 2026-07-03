import { NextRequest, NextResponse } from "next/server";
import { widgetService } from "@/server/services/widget-service";
import { widgetRepository } from "@/server/repositories/widget";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("orgId");

    if (!orgId) {
      return NextResponse.json({ error: "Missing organization identifier" }, { status: 400 });
    }

    // Security Check: Whitelisted Domain Embed Verify
    const origin = req.headers.get("origin") || req.headers.get("referer") || "";
    if (origin) {
      const isAllowed = await widgetService.checkDomainWhitelisted(orgId, origin);
      if (!isAllowed) {
        return NextResponse.json({
          error: "Unauthorized domain. Please whitelist this origin in your Operator settings.",
          isLocked: true
        }, { status: 403 });
      }

      // Log/update installation status
      const hostname = origin
        .replace(/^https?:\/\//, "")
        .replace(/\/$/, "")
        .split(":")[0];
      await widgetRepository.logInstallation(orgId, hostname);
    }

    const settings = await widgetService.getWidgetSettingsBundle(orgId);
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to load widget config" }, { status: 500 });
  }
}
