import { formatCurrency, formatDate } from "../utils/helpers";
import { calculatorPrice, calculatorTotal } from "../utils/calculator";

interface Item {
    description: string;
    quantity: number;
    unit_price: any;
    percent_discount: number;
}

interface Contact {
    name: string;
    email: string;
    phone: string;
}

interface Props {
    title: string;
    number: string;
    date: string;
    expiration_date: string;
    description: string;
    items: Item[];
    notes: string;
    contact: Contact;
    payment_terms: string;
    delivery_label: string;
    days_delivery: number;
    client_name?: string;
    client_company?: string;
    logo?: string;
    accentColor?: string;
}

const tableRow = (accent: string) => ({
    display: "grid",
    gridTemplateColumns: "repeat(20, minmax(0, 1fr))",
    border: `1px solid ${accent}`,
    backgroundColor: "#fff",
    padding: "0.875rem",
    borderRadius: "0.5rem",
});

export default function QuotationPreview({
    title,
    number,
    date,
    expiration_date,
    description,
    items,
    notes,
    contact,
    payment_terms,
    delivery_label,
    days_delivery,
    client_name,
    client_company,
    logo,
    accentColor = "#b8860b",
}: Props) {
    const results = items.map((item) =>
        calculatorPrice(item.quantity, item.unit_price, item.percent_discount),
    );
    const totals = calculatorTotal(results);

    const unitPriceValue = (unit_price: any, quantity: number): number => {
        if (typeof unit_price === "object" && unit_price !== null) {
            const spents = unit_price.spents || [];
            const totalSpents = spents.reduce(
                (acc: number, s: any) => acc + (Number(s.quantity) || 0),
                0,
            );
            const total = totalSpents * (1 + (unit_price.utility || 0) / 100);
            return quantity > 0 ? total / quantity : total;
        }
        return Number(unit_price) || 0;
    };

    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                padding: "72px",
                backgroundColor: "#fff",
                color: "#3a3a3a",
                fontFamily: "'Instrument Sans', Arial, sans-serif",
                gap: "20px",
                boxSizing: "border-box",
                borderRadius: "12px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
        >
            {/* HEADER */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                }}
            >
                <div>
                    {logo ? (
                        <img
                            src={logo}
                            alt="Logo"
                            style={{
                                width: "280px",
                                height: "auto",
                                maxWidth: "280px",
                                display: "block",
                            }}
                        />
                    ) : (
                        <h1
                            style={{
                                color: accentColor,
                                fontSize: "1.5rem",
                                fontWeight: "bold",
                                margin: 0,
                            }}
                        >
                            COTIZACIÓN
                        </h1>
                    )}
                </div>
                <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "0.875rem", margin: "0.25rem 0" }}>
                        <strong>No. de Cotización:</strong> {number}
                    </p>
                    <p style={{ fontSize: "0.875rem", margin: "0.25rem 0" }}>
                        <strong>Fecha:</strong> {formatDate(new Date(date))}
                    </p>
                    {date !== expiration_date && (
                        <p
                            style={{
                                fontSize: "0.875rem",
                                margin: "0.25rem 0",
                            }}
                        >
                            <strong>Vigencia:</strong>{" "}
                            {formatDate(new Date(expiration_date))}
                        </p>
                    )}
                </div>
            </div>

            {/* CLIENT */}
            {client_name && (
                <div style={{ margin: "1rem 0" }}>
                    <h2
                        style={{
                            fontSize: "1.25rem",
                            fontWeight: 600,
                            color: "#4a4a4a",
                        }}
                    >
                        {client_name}
                    </h2>
                    {client_company && (
                        <p
                            style={{
                                fontSize: "1.125rem",
                                margin: "0 0 0.5rem 0",
                                color: "#666",
                            }}
                        >
                            {client_company}
                        </p>
                    )}
                </div>
            )}

            {/* TITLE */}
            {title && (
                <h3
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        margin: 0,
                        color: "#4a4a4a",
                        textTransform: "uppercase",
                    }}
                >
                    {title}
                </h3>
            )}

            {/* DESCRIPTION */}
            {description && (
                <p style={{ fontSize: "0.875rem", margin: 0, color: "#666" }}>
                    {description}
                </p>
            )}

            {/* ITEMS TABLE */}
            <div
                style={{
                    width: "100%",
                    fontSize: "0.875rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(20, minmax(0, 1fr))",
                        backgroundColor: accentColor,
                        color: "#fff",
                        textTransform: "uppercase",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        padding: "0.875rem",
                        borderRadius: "0.5rem",
                    }}
                >
                    <p
                        style={{
                            gridColumn: "span 8",
                            textAlign: "left",
                            margin: 0,
                        }}
                    >
                        Descripción
                    </p>
                    <p
                        style={{
                            gridColumn: "span 3",
                            textAlign: "center",
                            margin: 0,
                        }}
                    >
                        Cantidad
                    </p>
                    <p
                        style={{
                            gridColumn: "span 3",
                            textAlign: "center",
                            margin: 0,
                        }}
                    >
                        P/U
                    </p>
                    <p
                        style={{
                            gridColumn: "span 3",
                            textAlign: "center",
                            margin: 0,
                        }}
                    >
                        Desc.
                    </p>
                    <p
                        style={{
                            gridColumn: "span 3",
                            textAlign: "right",
                            margin: 0,
                        }}
                    >
                        Total
                    </p>
                </div>

                {items.map((item, i) => (
                    <div key={i} style={tableRow(accentColor)}>
                        <div
                            style={{
                                gridColumn: "span 8",
                                display: "flex",
                                alignItems: "center",
                                color: "#3a3a3a",
                            }}
                        >
                            {item.description || "-"}
                        </div>
                        <div
                            style={{
                                gridColumn: "span 3",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "#3a3a3a",
                            }}
                        >
                            {item.quantity}
                        </div>
                        <div
                            style={{
                                gridColumn: "span 3",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "#3a3a3a",
                            }}
                        >
                            $
                            {formatCurrency(
                                unitPriceValue(item.unit_price, item.quantity),
                            )}
                        </div>
                        <div
                            style={{
                                gridColumn: "span 3",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "#3a3a3a",
                            }}
                        >
                            {item.percent_discount
                                ? `${item.percent_discount}%`
                                : "-"}
                        </div>
                        <div
                            style={{
                                gridColumn: "span 3",
                                display: "flex",
                                justifyContent: "flex-end",
                                alignItems: "center",
                                color: "#3a3a3a",
                            }}
                        >
                            $
                            {formatCurrency(
                                calculatorPrice(
                                    item.quantity,
                                    item.unit_price,
                                    item.percent_discount,
                                ).subtotalWithoutDiscount,
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* TERMS AND TOTALS */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "2rem",
                    marginTop: "auto",
                }}
            >
                <div
                    style={{
                        width: "66.66%",
                        fontSize: "0.875rem",
                        color: "#3a3a3a",
                    }}
                >
                    <h3
                        style={{
                            fontWeight: 600,
                            color: accentColor,
                            margin: "0 0 0.5rem 0",
                        }}
                    >
                        Términos y condiciones
                    </h3>
                    {days_delivery && (
                        <p style={{ margin: "0.25rem 0" }}>
                            <strong>Tiempo de entrega:</strong>{" "}
                            {isNaN(Number(days_delivery))
                                ? days_delivery
                                : `${days_delivery} días hábiles a partir de su aprobación`}
                        </p>
                    )}
                    <p style={{ margin: "0.25rem 0" }}>
                        <strong>Forma de pago:</strong> {payment_terms}
                    </p>
                    {notes && (
                        <div style={{ marginTop: "0.5rem" }}>
                            <p style={{ margin: "0.25rem 0" }}>
                                <strong>Notas:</strong>
                            </p>
                            {notes.split("\n").map((line, i) => (
                                <p
                                    key={i}
                                    style={{
                                        margin: "0.25rem 0",
                                        marginLeft: "1rem",
                                    }}
                                >
                                    {line || "\u00A0"}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                <div
                    style={{
                        width: "33.33%",
                        backgroundColor: accentColor,
                        color: "#fff",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                        border: `1px solid ${accentColor}`,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                            fontSize: "0.875rem",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <span>Subtotal:</span>
                            <span>
                                $
                                {formatCurrency(totals.subtotalWithoutDiscount)}
                            </span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <span>Descuento:</span>
                            <span>${formatCurrency(totals.discount)}</span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <span>Subtotal:</span>
                            <span>${formatCurrency(totals.subtotal)}</span>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <span>IVA:</span>
                            <span>${formatCurrency(totals.iva)}</span>
                        </div>
                        <hr
                            style={{
                                border: "none",
                                borderTop: "1px solid rgba(255,255,255,0.4)",
                                margin: "0.5rem 0",
                            }}
                        />
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontWeight: "bold",
                                fontSize: "1rem",
                            }}
                        >
                            <span>Total:</span>
                            <span>${formatCurrency(totals.total)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    flexGrow: 1,
                    gap: "1.25rem",
                }}
            >
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    <div
                        style={{
                            width: "66.66%",
                            fontSize: "0.875rem",
                            color: "#3a3a3a",
                            position: "relative",
                        }}
                    >
                        <h3
                            style={{
                                fontWeight: 600,
                                color: "#3a3a3a",
                                margin: "0 0 0.5rem 0",
                            }}
                        >
                            {contact.name || ""}
                        </h3>
                        {contact.phone && (
                            <p style={{ margin: "0.25rem 0" }}>
                                {contact.phone}
                            </p>
                        )}
                        {contact.email && (
                            <p style={{ margin: "0.25rem 0" }}>
                                {contact.email}
                            </p>
                        )}
                    </div>
                </div>
                <p
                    style={{
                        paddingTop: "1.5rem",
                        textAlign: "center",
                        fontSize: "0.75rem",
                        color: "#3a3a3a",
                        borderTop: `4px solid ${accentColor}`,
                        margin: 0,
                    }}
                >
                    Gracias por su preferencia
                </p>
            </div>
        </div>
    );
}
