import { NextRequest, NextResponse } from "next/server";
import ICAL from "ical.js";

async function fetchEvents(url?: string) {
  if (!url || url.trim() === "") return [];
  try {
    const res = await fetch(url);
    if(!res.ok) return [];
    const ics = await res.text();
    const jcalData = ICAL.parse(ics);
    const comp = new ICAL.Component(jcalData);
    const vevents = comp.getAllSubcomponents("vevent");
    return vevents.map(ev => {
      const event = new ICAL.Event(ev);
      return {
        id: event.uid,
        title: event.summary,
        time: event.startDate ? event.startDate.toJSDate().toISOString() : "",
      };
    });
  } catch (e) {
    // Consider logging error
    return [];
  }
}

export async function POST(request: NextRequest) {
	try {
	  const body = await request.json();
	  const { google, canvas } = body || {};
  
	  if ((!google || google.trim() === "") && (!canvas || canvas.trim() === "")) {
		return NextResponse.json({ events: [] }, { status: 200 });
	  }
  
	  const googleEvents = await fetchEvents(google);
	  const canvasEvents = await fetchEvents(canvas);
	  const all = [...googleEvents, ...canvasEvents];
  
	 
  
	  return NextResponse.json({ events: all }, { status: 200 });
	} catch (e: any) {
	  console.error("API ERROR", e);
	  console.log("Returning error JSON:", { events: [], error: e?.message || "Unknown error" }); // <-- print error
	  return NextResponse.json({ events: [], error: e?.message || "Unknown error" }, { status: 500 });
	}
  }
// (If you want to support GET for debugging:)
export function GET() {
  return NextResponse.json({ message: "Use POST" });
}