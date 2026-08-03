/**
 * Structured data, emitted into the static HTML.
 *
 * A server component, so the graph is in the exported file rather than being
 * written by a bundle a crawler may never run.
 *
 * dangerouslySetInnerHTML is the standard way to do this — React would escape
 * the JSON into HTML entities if it were set as a child, and a parser reading
 * `&quot;` where it expects `"` gets invalid JSON. The input is our own object
 * literal, never user content, and the `<` escape below closes the one hole
 * that matters: a string containing "</script>" would otherwise end the element
 * early and drop the rest of the graph into the document as markup.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
