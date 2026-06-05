import type { LegalBlock } from "@/lib/dictionaries";

const CONTACT_EMAIL = "hello@buildpalnorte.com";

function renderParagraph(text: string) {
  if (!text.includes("{email}")) {
    return <p>{text}</p>;
  }

  const [before, after] = text.split("{email}");

  return (
    <p>
      {before}
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="text-[#aaff00] transition-opacity hover:opacity-80"
      >
        {CONTACT_EMAIL}
      </a>
      {after}
    </p>
  );
}

export function LegalBlocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <div key={`p-${index}`}>{renderParagraph(block.text)}</div>
          );
        }

        return (
          <ul key={`ul-${index}`} className="list-disc space-y-2 pl-6">
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        );
      })}
    </>
  );
}
