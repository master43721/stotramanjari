import React from "react";
import Image from "next/image";

export interface StotramaniLogoProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  glow?: boolean;
  alt?: string;
  priority?: boolean;
}

export default function StotramaniLogo({
  size = 28,
  className = "",
  style = {},
  glow = true,
  alt = "",
  priority = true,
}: StotramaniLogoProps) {
  const isDecorative = !alt;

  return (
    <span
      className={`stotramani-logo-wrapper ${className}`.trim()}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        flexShrink: 0,
        verticalAlign: "middle",
        lineHeight: 1,
        ...style,
      }}
    >
      <Image
        src="/logo.png"
        width={size}
        height={size}
        alt={alt || "Stotramani Om Logo"}
        aria-hidden={isDecorative ? "true" : undefined}
        priority={priority}
        unoptimized
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          objectFit: "contain",
          filter: glow ? "drop-shadow(0 0 7px rgba(212, 175, 55, 0.45))" : "none",
          transition: "transform 0.3s ease, filter 0.3s ease",
          display: "block",
        }}
      />
    </span>
  );
}
