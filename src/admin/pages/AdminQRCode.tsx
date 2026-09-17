import { useMemo, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
    Check,
    Copy,
    Download,
    ExternalLink,
    MapPin,
    Printer,
    QrCode,
} from "lucide-react";

function AdminQRCode() {
    const [copied, setCopied] = useState(false);

    const menuUrl = useMemo(() => {
        return `${window.location.origin}/`;
    }, []);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(menuUrl);
            setCopied(true);

            window.setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch {
            setCopied(false);
        }
    }

    function handleDownload() {
        const canvas = document.getElementById(
            "meal-deal-qr"
        ) as HTMLCanvasElement | null;

        if (!canvas) return;

        const link = document.createElement("a");
        link.download = "meal-and-deal-menu-qr.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    }

    function handlePrint() {
        window.print();
    }

    return (
        <div className="min-h-full bg-gray-950 text-white">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400 text-gray-950">
                            <QrCode className="h-6 w-6" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
                                QR Code
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                Let customers scan and open your digital menu.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
                    {/* QR Preview */}
                    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
                        <div className="mb-6">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-400">
                                Menu QR
                            </p>

                            <h2 className="mt-2 text-xl font-black text-white">
                                Scan to view our menu
                            </h2>
                        </div>

                        <div className="flex justify-center">
                            <div
                                id="qr-print-area"
                                className="rounded-3xl bg-white p-6 shadow-2xl"
                            >
                                <QRCodeCanvas
                                    id="meal-deal-qr"
                                    value={menuUrl}
                                    size={260}
                                    level="H"
                                    includeMargin
                                />

                                <div className="mt-4 text-center">
                                    <p className="text-xl font-black text-gray-950">
                                        Meal & Deal
                                    </p>

                                    <p className="mt-1 text-xs font-semibold text-gray-600">
                                        100% Pure Vegetarian
                                    </p>

                                    <p className="mt-2 text-xs font-medium text-gray-500">
                                        Scan for Our Menu
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Details */}
                    <section className="space-y-6">
                        {/* URL */}
                        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-400">
                                Customer Menu URL
                            </p>

                            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                                <p className="break-all text-sm font-medium leading-6 text-gray-300">
                                    {menuUrl}
                                </p>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={handleCopy}
                                    className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-bold text-gray-950 transition hover:bg-yellow-300 active:scale-[0.98]"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="h-4 w-4" />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4" />
                                            Copy URL
                                        </>
                                    )}
                                </button>

                                <a
                                    href={menuUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-gray-200 transition hover:bg-white/10"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Open Menu
                                </a>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-yellow-400">
                                QR Actions
                            </p>

                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={handleDownload}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                                >
                                    <Download className="h-4 w-4" />
                                    Download QR
                                </button>

                                <button
                                    type="button"
                                    onClick={handlePrint}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                                >
                                    <Printer className="h-4 w-4" />
                                    Print QR
                                </button>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-yellow-400" />

                                <div>
                                    <p className="text-sm font-bold text-white">
                                        Restaurant Location
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-gray-400">
                                        QXQC+J23, Lucknow, Uttar Pradesh
                                    </p>

                                    <a
                                        href="https://maps.app.goo.gl/vzYGXPYu2sq2LfF59"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-yellow-400 hover:text-yellow-300"
                                    >
                                        <MapPin className="h-4 w-4" />
                                        View on Google Maps
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Information */}
                <div className="mt-6 rounded-2xl border border-yellow-400/10 bg-yellow-400/[0.04] p-4">
                    <p className="text-sm leading-6 text-gray-400">
                        <span className="font-bold text-yellow-400">Tip:</span>{" "}
                        Print this QR code and place it on your restaurant counter,
                        tables, entrance, or promotional material.
                    </p>
                </div>
            </div>

            {/* Print styles */}
            <style>
                {`
          @media print {
            body * {
              visibility: hidden;
            }

            #qr-print-area,
            #qr-print-area * {
              visibility: visible;
            }

            #qr-print-area {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            }
          }
        `}
            </style>
        </div>
    );
}

export default AdminQRCode;