import { useState, useEffect } from "react";
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
    days_delivery: number;
    client_name?: string;
    client_company?: string;
    logo?: string;
    accentColor?: string;
    isTotalIndividual?: boolean;
}

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
    days_delivery,
    client_name,
    client_company,
    logo,
    accentColor = "#b8860b",
    isTotalIndividual = false,
}: Props) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 640px)");
        setIsMobile(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    const results = items.map((item) =>
        calculatorPrice(item.quantity, item.unit_price, item.percent_discount),
    );
    const totals = calculatorTotal(results);

    const hasDiscount = items.some(
        (item) => Number(item.percent_discount) > 0,
    );

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

    const p = isMobile ? 24 : 72;

    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                padding: `${p}px`,
                backgroundColor: "#fff",
                color: "#3a3a3a",
                fontFamily: "'Instrument Sans', Arial, sans-serif",
                gap: isMobile ? "16px" : "20px",
                boxSizing: "border-box",
                borderRadius: "12px",
                fontSize: isMobile ? "0.8125rem" : "inherit",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "flex-start" : "flex-start",
                    gap: isMobile ? "12px" : "0",
                }}
            >
                <div>
                    {logo ? (
                        <img
                            src={logo}
                            alt="Logo"
                            style={{
                                width: isMobile ? "200px" : "280px",
                                height: "auto",
                                maxWidth: isMobile ? "200px" : "280px",
                                display: "block",
                            }}
                        />
                    ) : (
                        <h1
                            style={{
                                color: accentColor,
                                fontSize: isMobile ? "1.25rem" : "1.5rem",
                                fontWeight: "bold",
                                margin: 0,
                            }}
                        >
                            COTIZACIÓN
                        </h1>
                    )}
                </div>
                <div style={{ textAlign: isMobile ? "left" : "right" }}>
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

            {client_name && (
                <div style={{ margin: "1rem 0" }}>
                    <h2
                        style={{
                            fontSize: isMobile ? "1.125rem" : "1.25rem",
                            fontWeight: 600,
                            color: "#4a4a4a",
                        }}
                    >
                        {client_name}
                    </h2>
                    {client_company && (
                        <p
                            style={{
                                fontSize: isMobile ? "1rem" : "1.125rem",
                                margin: "0 0 0.5rem 0",
                                color: "#666",
                            }}
                        >
                            {client_company}
                        </p>
                    )}
                </div>
            )}

            {title && (
                <h3
                    style={{
                        fontSize: isMobile ? "1.25rem" : "1.5rem",
                        fontWeight: 600,
                        margin: 0,
                        color: "#4a4a4a",
                        textTransform: "uppercase",
                    }}
                >
                    {title}
                </h3>
            )}

            {description && (
                <p style={{ fontSize: "0.875rem", margin: 0, color: "#666" }}>
                    {description}
                </p>
            )}

            {isMobile ? (
                <div
                    style={{
                        width: "100%",
                        fontSize: "0.875rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.625rem",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            backgroundColor: accentColor,
                            color: "#fff",
                            textTransform: "uppercase",
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            padding: "0.5rem 0.625rem",
                            borderRadius: "0.5rem",
                        }}
                    >
                        <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>Descripción</div>
                        <div style={{ textAlign: "center", padding: "0 0.375rem" }}>Cant</div>
                        <div style={{ textAlign: "center", padding: "0 0.375rem" }}>Total</div>
                    </div>
                    {items.map((item, i) => {
                        const r = calculatorPrice(item.quantity, item.unit_price, item.percent_discount);
                        return (
                            <div key={i} style={{ display: "flex", flexDirection: "column", border: `1px solid ${accentColor}`, borderRadius: "0.5rem", padding: "0.5rem 0.625rem", gap: "0.25rem" }}>
                                <div style={{ fontWeight: 600, color: "#3a3a3a", fontSize: "0.875rem" }}>{item.description || "-"}</div>
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8125rem", color: "#666", gap: "0.5rem", flexWrap: "wrap" }}>
                                    <span>Cant: {item.quantity}</span>
                                    <span>P/U: ${formatCurrency(unitPriceValue(item.unit_price, item.quantity))}</span>
                                    {hasDiscount && Number(item.percent_discount) > 0 && (
                                        <span>Desc: {item.percent_discount}%</span>
                                    )}
                                    <span style={{ fontWeight: 600, color: "#3a3a3a" }}>${formatCurrency(isTotalIndividual ? r.total : r.subtotal)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
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
                            display: "flex",
                            backgroundColor: accentColor,
                            color: "#fff",
                            textTransform: "uppercase",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            padding: "0.875rem",
                            borderRadius: "0.5rem",
                        }}
                    >
                        <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>Descripción</div>
                        <div style={{ width: "10%", textAlign: "center", flex: "none" }}>Cantidad</div>
                        <div style={{ width: "10%", textAlign: "center", flex: "none" }}>P/U</div>
                        {hasDiscount && <div style={{ width: "10%", textAlign: "center", flex: "none" }}>Desc.</div>}
                        {isTotalIndividual && <div style={{ width: "13%", textAlign: "center", flex: "none" }}>Subtotal</div>}
                        {isTotalIndividual && <div style={{ width: "10%", textAlign: "center", flex: "none" }}>IVA</div>}
                        <div style={{ width: "13%", textAlign: "center", flex: "none" }}>Total</div>
                    </div>

                    {items.map((item, i) => {
                        const r = calculatorPrice(item.quantity, item.unit_price, item.percent_discount);
                        return (
                        <div key={i} style={{ display: "flex", border: `1px solid ${accentColor}`, backgroundColor: "#fff", padding: "0.875rem", borderRadius: "0.5rem" }}>
                            <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", color: "#3a3a3a" }}>
                                {item.description || "-"}
                            </div>
                            <div style={{ width: "10%", flex: "none", display: "flex", justifyContent: "center", alignItems: "center", color: "#3a3a3a" }}>
                                {item.quantity}
                            </div>
                            <div style={{ width: "10%", flex: "none", display: "flex", justifyContent: "center", alignItems: "center", color: "#3a3a3a" }}>
                                ${formatCurrency(unitPriceValue(item.unit_price, item.quantity))}
                            </div>
                            {hasDiscount && (
                                <div style={{ width: "10%", flex: "none", display: "flex", justifyContent: "center", alignItems: "center", color: "#3a3a3a" }}>
                                    {item.percent_discount ? `${item.percent_discount}%` : "-"}
                                </div>
                            )}
                            {isTotalIndividual && (
                                <div style={{ width: "13%", flex: "none", display: "flex", justifyContent: "center", alignItems: "center", color: "#3a3a3a" }}>
                                    ${formatCurrency(r.subtotal)}
                                </div>
                            )}
                            {isTotalIndividual && (
                                <div style={{ width: "10%", flex: "none", display: "flex", justifyContent: "center", alignItems: "center", color: "#3a3a3a" }}>
                                    ${formatCurrency(r.iva)}
                                </div>
                            )}
                            <div style={{ width: "13%", flex: "none", display: "flex", justifyContent: "center", alignItems: "center", color: "#3a3a3a" }}>
                                ${formatCurrency(isTotalIndividual ? r.total : r.subtotal)}
                            </div>
                        </div>
                        );
                    })}
                </div>
            )}

        <div
            style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between",
                gap: isMobile ? "1rem" : "2rem",
                marginTop: "auto",
            }}
        >
            <div
                style={{
                    width: isMobile ? "100%" : isTotalIndividual ? "100%" : "66.66%",
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

            {!isTotalIndividual && (
            <div
                style={{
                    width: isMobile ? "100%" : "33.33%",
                    backgroundColor: accentColor,
                    color: "#fff",
                    padding: isMobile ? "0.75rem" : "1rem",
                    borderRadius: "0.5rem",
                    border: `1px solid ${accentColor}`,
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
            )}
        </div>

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
