"use client";

import { useState } from "react";
import { generateFAQ } from "../actions/generateFAQ"; // Import our server action
import { LoaderButton } from "@/components/ui/LoaderButton"; // Import LoaderButton
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// FAQ item type
type FAQItem = {
  question: string;
  answer: string;
};

export default function FAQForm() {
  const [url, setUrl] = useState("");
  const [faqs, setFaqs] = useState<FAQItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Convert the FAQ array to Markdown
  const toMarkdown = (items: FAQItem[]) =>
    items
      .map((item) => `## ${item.question}\n\n${item.answer}`)
      .join("\n\n");

  // Convert the FAQ array to HTML
  const toHTML = (items: FAQItem[]) =>
    items
      .map((item) => `<h2>${item.question}</h2>\n<p>${item.answer}</p>`)
      .join("\n\n");

  // Generate a safe filename from the URL
  const generateFilename = (url: string, extension: string) => {
    try {
      const { hostname } = new URL(url);
      const safeDomain = hostname.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      return `${safeDomain}_faq.${extension}`;
    } catch {
      return `faq.${extension}`;
    }
  };

  // Validate URL
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Trigger a file download in the browser
  const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const href = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // When the form is submitted, call our server action
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !isValidUrl(url)) {
      setError("Please enter a valid URL.");
      return;
    }

    setLoading(true);
    setError("");
    setFaqs(null); // Reset faqs to null

    try {
      const data = await generateFAQ(url);
      console.log("Data received from generateFAQ:", data); // Log the data received
      if (Array.isArray(data)) {
        setFaqs(data);
      } else {
        throw new Error("Invalid data format");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <Label htmlFor="url">Website URL</Label>
          <Input
            id="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1"
          />
        </div>
        <LoaderButton type="submit" isLoading={loading} className="w-full">
          Generate FAQ
        </LoaderButton>
      </form>

      {/* Error Message */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Display FAQ if we have data */}
      {faqs && faqs.length > 0 && (
        <div className="mt-4 space-y-4">
          <h2 className="font-bold text-xl">FAQ</h2>
          {faqs.map((faq, idx) => (
            <div key={idx} className="border p-3 rounded-md">
              <h3 className="font-bold">{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}

          {/* Download Buttons */}
          <div className="flex gap-4 pt-2">
            <LoaderButton
              variant="outline"
              onClick={() =>
                downloadFile(toMarkdown(faqs), generateFilename(url, "md"), "text/markdown")
              }
            >
              Download as Markdown
            </LoaderButton>
            <LoaderButton
              variant="outline"
              onClick={() =>
                downloadFile(toHTML(faqs), generateFilename(url, "html"), "text/html")
              }
            >
              Download as HTML
            </LoaderButton>
          </div>
        </div>
      )}
    </div>
  );
} 