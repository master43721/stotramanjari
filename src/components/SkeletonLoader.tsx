import React from "react";

export function StotramCardSkeleton() {
  return (
    <div className="stotram-card-skeleton" aria-hidden="true">
      {/* Category pill */}
      <span
        className="skeleton-shimmer"
        style={{ width: "90px", height: "13px", borderRadius: "12px" }}
      />
      {/* English title */}
      <div
        className="skeleton-shimmer"
        style={{ width: "75%", height: "22px", marginTop: "0.25rem", borderRadius: "6px" }}
      />
      {/* Telugu title */}
      <div
        className="skeleton-shimmer"
        style={{ width: "55%", height: "18px", marginTop: "0.15rem", borderRadius: "6px" }}
      />
      {/* Read link placeholder */}
      <div style={{ marginTop: "auto", paddingTop: "0.75rem" }}>
        <div
          className="skeleton-shimmer"
          style={{ width: "95px", height: "14px", borderRadius: "6px" }}
        />
      </div>
    </div>
  );
}

export function StotramGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid" aria-label="Loading sacred stotrams..." role="status">
      {Array.from({ length: count }).map((_, i) => (
        <StotramCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StotramReaderSkeleton() {
  return (
    <div className="reader-wrapper" style={{ paddingBottom: "4.5rem" }} role="status" aria-label="Loading stotram...">
      <div className="reader-container reader-skeleton">
        {/* Header toolbar shimmer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            className="skeleton-shimmer"
            style={{ width: "120px", height: "16px", borderRadius: "6px" }}
          />
          <div
            className="skeleton-shimmer"
            style={{ width: "130px", height: "28px", borderRadius: "20px" }}
          />
        </div>

        {/* Titles shimmer */}
        <div style={{ textAlign: "center", marginBlock: "1.5rem" }}>
          <div
            className="skeleton-shimmer"
            style={{ width: "55%", height: "36px", margin: "0 auto 0.75rem auto", borderRadius: "8px" }}
          />
          <div
            className="skeleton-shimmer"
            style={{ width: "35%", height: "20px", margin: "0 auto", borderRadius: "6px" }}
          />
        </div>

        {/* Stanzas shimmer */}
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="reader-skeleton-stanza">
            <div
              className="skeleton-shimmer"
              style={{ width: "88%", height: "20px", borderRadius: "6px" }}
            />
            <div
              className="skeleton-shimmer"
              style={{ width: "94%", height: "20px", borderRadius: "6px" }}
            />
            <div
              className="skeleton-shimmer"
              style={{ width: "78%", height: "20px", borderRadius: "6px" }}
            />
            <div
              className="skeleton-shimmer"
              style={{ width: "84%", height: "20px", borderRadius: "6px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
