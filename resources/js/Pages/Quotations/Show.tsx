import { Head, Link } from "@inertiajs/react";
import { Button, Surface } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import { ArrowLeft, Download } from "lucide-react";
import QuotationPreview from "@/components/QuotationPreview";

export default function Show({ quotation, configLogo, accentColor }: any) {
    const contact = typeof quotation.contact === "string"
        ? JSON.parse(quotation.contact) : (quotation.contact || {});

    return (
        <div className="min-h-screen bg-background p-8">
            <Head title={`Cotización ${String(quotation.id).padStart(4, "0")}`} />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link href="/quotations" className={buttonVariants({ variant: "tertiary" })}>
                        <ArrowLeft size={20} /> Volver
                    </Link>
                    <h1 className="text-2xl font-bold">Cotización #{String(quotation.id).padStart(4, "0")}</h1>
                </div>
                <a href={`/quotations/${quotation.id}/pdf`} className={buttonVariants({ variant: "primary" })}>
                    <Download size={16} /> Descargar PDF
                </a>
            </div>

            <Surface className="p-6">
                <QuotationPreview
                    title={quotation.title}
                    number={String(quotation.id).padStart(4, "0")}
                    date={quotation.date}
                    expiration_date={quotation.expiration_date}
                    description={quotation.description}
                    items={(quotation.items || []).map((item: any) => ({
                        description: item.description,
                        quantity: Number(item.quantity),
                        unit_price: item.unit_price,
                        percent_discount: Number(item.percent_discount || 0),
                    }))}
                    notes={quotation.notes || ""}
                    contact={{
                        name: contact.name || "",
                        email: contact.email || "",
                        phone: contact.phone || "",
                    }}
                    payment_terms={quotation.payment_terms}
                    delivery_label={quotation.delivery_label}
                    days_delivery={Number(quotation.days_delivery)}
                    client_name={quotation.client?.name}
                    client_company={quotation.client?.company}
                    logo={configLogo}
                    accentColor={accentColor}
                    isTotalIndividual={quotation.is_total_individual}
                />
            </Surface>
        </div>
    );
}