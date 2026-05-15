import { Head, Link } from "@inertiajs/react";
import { Button, Surface } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import { ArrowLeft, Download } from "lucide-react";
import QuotationPreview from "@/components/QuotationPreview";

export default function Show({ invoice, configLogo, accentColor }: any) {
    const contact = typeof invoice.contact === "string"
        ? JSON.parse(invoice.contact) : (invoice.contact || {});

    return (
        <div className="min-h-screen bg-background p-8">
            <Head title={`Cotización ${String(invoice.id).padStart(4, "0")}`} />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Link href="/invoices" className={buttonVariants({ variant: "tertiary" })}>
                        <ArrowLeft size={20} /> Volver
                    </Link>
                    <h1 className="text-2xl font-bold">Cotización #{String(invoice.id).padStart(4, "0")}</h1>
                </div>
                <Link href={`/invoices/${invoice.id}/pdf`} className={buttonVariants({ variant: "primary" })}>
                    <Download size={16} /> Descargar PDF
                </Link>
            </div>

            <Surface className="p-6">
                <QuotationPreview
                    title={invoice.title}
                    number={String(invoice.id).padStart(4, "0")}
                    date={invoice.date}
                    expiration_date={invoice.expiration_date}
                    description={invoice.description}
                    items={(invoice.items || []).map((item: any) => ({
                        description: item.description,
                        quantity: Number(item.quantity),
                        unit_price: item.unit_price,
                        percent_discount: Number(item.percent_discount || 0),
                    }))}
                    notes={invoice.notes || ""}
                    contact={{
                        name: contact.name || "",
                        email: contact.email || "",
                        phone: contact.phone || "",
                    }}
                    payment_terms={invoice.payment_terms}
                    delivery_label={invoice.delivery_label}
                    days_delivery={Number(invoice.days_delivery)}
                    client_name={invoice.client?.name}
                    client_company={invoice.client?.company}
                    logo={configLogo}
                    accentColor={accentColor}
                    isTotalIndividual={invoice.is_total_individual}
                />
            </Surface>
        </div>
    );
}