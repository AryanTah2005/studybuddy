import { NextResponse } from "next/server";

function wrapInDocument(latex: string): string {
  latex = latex
    .replace(/^\s*```latex\s*/i, "")
    .replace(/^\s*```/, "")
    .replace(/\s*```$/, "");

  // Clean: only keep from first \documentclass onward, if exists
  const docclassMatch = latex.match(/\\documentclass\{[^\}]+\}/);
  if (docclassMatch) {
    latex = latex.substring(latex.indexOf(docclassMatch[0]));
    return latex;
  }

  // Else, ensure we have a document
  if (!/\\begin\{document\}/.test(latex)) {
    return [
      "\\documentclass{article}",
      "\\usepackage[utf8]{inputenc}",
      "\\begin{document}",
      latex,
      "\\end{document}",
    ].join("\n");
  }
  return latex;
}

export async function POST(req: Request) {
  try {
    let { latex } = await req.json();
    if (!latex) {
      return NextResponse.json({ error: "Missing LaTeX source" }, { status: 400 });
    }

    latex = wrapInDocument(latex);

    const response = await fetch("https://latex.ytotech.com/builds/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        compiler: "pdflatex",
        resources: [
          { main: true, content: latex },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("LaTeX service error:", errorData);
      let errorMessage = "PDF generation failed";
      if (errorData.logs) {
        const logs = errorData.logs.toString();
        const errorLines = logs
          .split("\n")
          .filter(line => line.includes("error:"))
          .map(line => line.split("error:")[1]?.trim());
        errorMessage = errorLines.length > 0
          ? `LaTeX Error: ${errorLines[0]}`
          : errorData.error || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const pdfBuffer = await response.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=document.pdf",
      },
    });
  } catch (error) {
    console.error("Error details:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "PDF generation failed",
      details: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
