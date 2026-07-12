import { accent } from "@/lib/theme";
import type { Locale } from "@/lib/i18n";

const BRAND_CUBE_SVG = `<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" style="display:block;">
  <rect width="32" height="32" rx="6" fill="#000000"/>
  <polygon points="16,5 27,11 16,17 5,11" fill="${accent}"/>
  <polygon points="5,11 16,17 16,27 5,21" fill="#55aa00"/>
  <polygon points="27,11 16,17 16,27 27,21" fill="#77cc00"/>
</svg>`;

const STAR_SVG = `<svg width="36" height="36" viewBox="-12 -12 24 24" aria-hidden="true" style="display:block;margin:0 auto;">
  <path d="M0,-12 L1.5,-1.5 L12,0 L1.5,1.5 L0,12 L-1.5,1.5 L-12,0 L-1.5,-1.5 Z" fill="${accent}"/>
</svg>`;

export function buildBrandEmailHtml({
  locale,
  badge,
  headline,
  greeting,
  body,
  cta,
  ctaUrl,
  tagline,
  scheduleLine,
  locationTag,
  footerLine,
  logoUrl,
}: {
  locale: Locale;
  badge: string;
  headline: string;
  greeting: string;
  body: string;
  cta: string;
  ctaUrl: string;
  tagline: string;
  scheduleLine: string;
  locationTag: string;
  footerLine: string;
  logoUrl: string;
}) {
  const montserrat =
    "'Montserrat', 'Arial Black', 'Helvetica Neue', Helvetica, sans-serif";
  const outfit = "'Outfit', Arial, Helvetica, sans-serif";

  return `<!DOCTYPE html>
<html lang="${locale}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark" />
    <meta name="supported-color-schemes" content="dark" />
    <title>${headline}</title>
    <!--[if !mso]><!-->
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&family=Outfit:wght@400;500&display=swap"
      rel="stylesheet"
    />
    <!--<![endif]-->
    <style>
      @media (prefers-color-scheme: dark) {
        .email-body { background-color: #000000 !important; }
      }
    </style>
  </head>
  <body class="email-body" style="margin:0;padding:0;background-color:#000000;color:#ededed;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      ${greeting} ${body}
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#000000;">
      <tr>
        <td align="center" style="padding:48px 16px;background-color:#000000;background-image:linear-gradient(rgba(170,255,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(170,255,0,0.04) 1px, transparent 1px);background-size:40px 40px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;">
            <tr>
              <td align="center" style="padding:0 0 28px;">
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="padding-right:12px;vertical-align:middle;">
                      ${BRAND_CUBE_SVG}
                    </td>
                    <td style="vertical-align:middle;">
                      <p style="margin:0;font-family:${montserrat};font-size:22px;font-weight:900;line-height:0.95;letter-spacing:-0.03em;color:#ffffff;">
                        Build<br />Pa&apos;l Norte
                      </p>
                    </td>
                  </tr>
                </table>
                <p style="margin:14px 0 0;font-family:${outfit};font-size:12px;line-height:1.5;letter-spacing:0.22em;text-transform:uppercase;color:rgba(170,255,0,0.8);">
                  ${tagline}
                </p>
                <p style="margin:10px 0 0;font-family:${outfit};font-size:12px;line-height:1.5;letter-spacing:0.18em;text-transform:uppercase;color:${accent};">
                  ${scheduleLine}
                </p>
                <p style="margin:8px 0 0;font-family:${outfit};font-size:11px;line-height:1.5;letter-spacing:0.28em;text-transform:uppercase;color:rgba(255,255,255,0.45);">
                  ${locationTag}
                </p>
              </td>
            </tr>
            <tr>
              <td style="border:1px solid rgba(170,255,0,0.25);border-radius:16px;background-color:#050505;box-shadow:0 0 80px rgba(170,255,0,0.1);overflow:hidden;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td style="height:2px;background:linear-gradient(90deg, rgba(170,255,0,0.35), rgba(170,255,0,0.05) 50%, rgba(170,255,0,0.2));font-size:0;line-height:0;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td style="padding:36px 32px 28px;text-align:center;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 0 24px;">
                        <tr>
                          <td style="height:1px;background-color:rgba(170,255,0,0.7);font-size:0;line-height:0;">&nbsp;</td>
                          <td style="padding:0 16px;white-space:nowrap;font-family:${montserrat};font-size:11px;font-weight:800;line-height:1;letter-spacing:0.3em;text-transform:uppercase;color:#ffffff;">
                            ${badge}
                          </td>
                          <td style="height:1px;background-color:rgba(170,255,0,0.7);font-size:0;line-height:0;">&nbsp;</td>
                        </tr>
                      </table>
                      <div style="margin:0 0 20px;">${STAR_SVG}</div>
                      <h1 style="margin:0 0 12px;font-family:${montserrat};font-size:28px;font-weight:900;line-height:1.15;color:#ffffff;text-shadow:0 0 8px rgba(170,255,0,0.35), 0 0 20px rgba(170,255,0,0.15);">
                        ${headline}
                      </h1>
                      <p style="margin:0 0 10px;font-family:${outfit};font-size:16px;line-height:1.6;color:#ffffff;">
                        ${greeting}
                      </p>
                      <p style="margin:0;font-family:${outfit};font-size:16px;line-height:1.65;color:rgba(255,255,255,0.7);">
                        ${body}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding:0 32px 36px;">
                      <table role="presentation" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="border-radius:12px;border:1px solid ${accent};background-color:#0a0a0a;">
                            <a
                              href="${ctaUrl}"
                              style="display:inline-block;padding:14px 28px;font-family:${montserrat};font-size:13px;font-weight:800;line-height:1;letter-spacing:0.12em;text-transform:uppercase;text-decoration:none;color:${accent};"
                            >
                              ${cta}
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 32px 32px;text-align:center;">
                      <img
                        src="${logoUrl}"
                        width="72"
                        height="72"
                        alt="Build Pa'l Norte"
                        style="display:block;margin:0 auto 16px;border-radius:12px;"
                      />
                      <p style="margin:0;font-family:${outfit};font-size:12px;line-height:1.6;color:rgba(255,255,255,0.35);">
                        ${footerLine}
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
