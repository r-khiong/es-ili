import { QRCodeSVG } from "qrcode.react";
import { SITE_URL } from "@/lib/site";

const QR_SIZE = 200;

interface ApprovedQrProps {
  token: string;
}

/**
 * Renders a QR code encoding this status page's full URL.
 *
 * The URL is built from SITE_URL rather than window.location.origin, so the
 * code encodes exactly the link the "Copy link" box shows the guest — the two
 * used to be able to disagree once a custom domain fronts the Netlify host.
 * Being a build-time constant it is identical on server and client, so this is
 * no longer a client component and needs no mount effect.
 *
 * `token` is accepted as a prop so a future check-in scanner has a clear
 * interface to resolve the registration from the encoded URL.
 */
export function ApprovedQr({ token }: ApprovedQrProps) {
  return (
    <div className="rounded-lg bg-white p-4">
      <QRCodeSVG value={`${SITE_URL}/status/${token}`} size={QR_SIZE} />
    </div>
  );
}
