"use client";

import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  // Construct Schema.org BreadcrumbList JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const element: {
        "@type": string;
        position: number;
        name: string;
        item?: string;
      } = {
        "@type": "ListItem",
        position: index + 1,
        name: item.label,
      };
      if (item.href) {
        element.item = `https://stotramani.app${item.href.startsWith("/") ? item.href : `/${item.href}`}`;
      }
      return element;
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav
        aria-label="Breadcrumb"
        style={{
          marginBottom: "1.25rem",
          fontSize: "0.82rem",
          color: "var(--text-secondary)",
        }}
      >
        <ol
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.4rem",
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li
                key={index}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                }}
              >
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    style={{
                      color: "var(--border)",
                      fontSize: "0.75rem",
                      userSelect: "none",
                    }}
                  >
                    /
                  </span>
                )}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    style={{
                      color: "var(--text-secondary)",
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                      fontWeight: 500,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    style={{
                      color: isLast ? "var(--accent)" : "var(--text-secondary)",
                      fontWeight: isLast ? 600 : 400,
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
