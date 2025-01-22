"use server";

import FirecrawlApp from "@mendable/firecrawl-js";
import { z } from "zod";

// Define a Zod schema for the FAQ shape
const faqSchema = z.object({
  faq: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
});

/**
 * Server Action that calls Firecrawl to generate a short FAQ.
 * Exposed as a function we can import in a client component.
 */
export async function generateFAQ(url: string) {
  if (!url) throw new Error("No URL provided.");

  const promptText = `
    Extract a list of questions that could be likely asked by users and the answers to these questions in the same language as the page.
  `;

  // Initialize the Firecrawl client
  const app = new FirecrawlApp({
    apiKey: process.env.FIRECRAWL_API_KEY ?? "",
  });

  // Call Firecrawl's /extract endpoint
  const result = await app.extract([`${url}/*`], {
    prompt: promptText,
    schema: faqSchema,
  });

  if (!result.success) {
    throw new Error(result.error || "Firecrawl extraction failed.");
  }

  // Return the array of Q&A objects
  console.log("FAQ Data:", result.data.faq); // Log the data specifically
  return result.data.faq;
} 