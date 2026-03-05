import { NextRequest, NextResponse } from "next/server";
import { getResendClient } from "@/lib/resend";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resend = getResendClient();
    const { to } = await req.json().catch(() => ({}));
    
    if (!to) {
      return NextResponse.json({ error: "Missing 'to' email address" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: "AXIS Test <onboarding@resend.dev>",
      to,
      subject: "AXIS Test Email",
      html: "<strong>This is a test email from AXIS Creator Hub!</strong>",
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
