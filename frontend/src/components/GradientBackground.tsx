import { useEffect } from "react";

export interface GradientConfig {
  enabled: boolean;
  color1: string;
  color2: string;
  color3: string;
  direction:
    | "to right"
    | "to bottom right"
    | "to bottom"
    | "135deg"
    | "to right bottom";
}

interface Props {
  config: GradientConfig;
}

/**
 * Applies a CSS gradient as the brand color across the UI.
 * Injects a <style> tag that overrides btn-primary, badges, links etc.
 * No Three.js / WebGL — pure CSS.
 */
export default function GradientBrandColor({ config }: Props) {
  useEffect(() => {
    const styleId = "anonvote-gradient-brand";
    let el = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!config.enabled) {
      el?.remove();
      return;
    }

    const { color1, color2, color3, direction } = config;
    const gradient = `linear-gradient(${direction}, ${color1}, ${color2}, ${color3})`;
    const gradientReverse = `linear-gradient(${direction}, ${color3}, ${color2}, ${color1})`;

    const css = `
      /* AnonVote gradient brand override */
      .btn-primary {
        background: ${gradient} !important;
        box-shadow: 0 2px 12px ${color1}40 !important;
      }
      .btn-primary:hover {
        background: ${gradientReverse} !important;
        box-shadow: 0 4px 20px ${color1}60 !important;
      }
      .badge-open {
        background: ${gradient} !important;
        color: white !important;
        border-color: transparent !important;
      }
      .text-eyebrow {
        background: ${gradient};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .text-eyebrow::after {
        background: ${gradient} !important;
      }
      .navbar-avatar {
        background: ${gradient} !important;
      }
      .progress-fill {
        background: ${gradient} !important;
      }
      a.btn-primary {
        background: ${gradient} !important;
      }
    `;

    if (!el) {
      el = document.createElement("style");
      el.id = styleId;
      document.head.appendChild(el);
    }
    el.textContent = css;

    return () => {
      document.getElementById(styleId)?.remove();
    };
  }, [config]);

  return null;
}
