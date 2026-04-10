import styles from "./quotation-pdf.module.css";
import { formatCurrency, formatDate } from "../utils/helpers";
import type { Quotation } from "../types/invoice";

export default function QuotationPDF({quotation}: {quotation: Quotation}) {

	

	return (
		<div className={`${styles.quotationContainer}`} style={{
			"--quotation-text-color": quotation.template.colors.text,
			"--quotation-background-color": quotation.template.colors.background,
			"--quotation-primary-color": quotation.template.colors.primary,
			"--quotation-primary-foreground-color": quotation.template.colors.primaryForeground,
			"--quotation-bg-image": quotation.template.background,
		} as React.CSSProperties}>
			{/* ENCABEZADO */}
			<div className={styles.header}>
				{/* Logo */}
				<img
					src={quotation.template.logo}
					alt="Logo"
					className={styles.logo}
				/>
				<div className={styles.headerInfo}>
					{!quotation.isSingle && (
						<h1 className={styles.headerTitle}>{quotation.title}</h1>
					)}
					<p className={styles.headerText}>
						<strong className={styles.headerStrong}>No. de Cotización:</strong>{" "}
						{quotation.number}
					</p>
					<p className={styles.headerText}>
						<strong className={styles.headerStrong}>Fecha:</strong>{" "}
						{formatDate(quotation.date)}
					</p>
					{/* Mostrar vigencia solo si es diferente a la fecha */}
					{quotation.date.getTime() !== quotation.expirationDate.getTime() && (
						<p className={styles.headerText}>
							<strong className={styles.headerStrong}>Vigencia:</strong>{" "}
							{formatDate(quotation.expirationDate)}
						</p>
					)}
				</div>
			</div>

			{/* CLIENTE */}	
			<div className={styles.clientSection}>
				<h2 className={styles.clientName}>{quotation.client.name}</h2>
				{quotation.client.company && (
					<p className={styles.clientCompany}>{quotation.client.company}</p>
				)}
				{quotation.client.email && <p className={styles.clientEmail}>{quotation.client.email}</p>}
			</div>

			{/* TABLA DE ITEMS PARA COTIZACION DE MULTIPLES ELEMENTOS */}
			{!quotation.isSingle && (
			<div className={styles.itemsTable}>
				{/* Encabezado de tabla */}
				<div className={styles.tableHeader}>
					<p className={styles.headerColumn1}>Nombre</p>
					<p className={styles.headerColumn2}>Descripción</p>
					<p className={styles.headerColumn3}>Cantidad</p>
					<p className={styles.headerColumn4}>P/U</p>
					<p className={styles.headerColumn5}>Desc.</p>
					<p className={styles.headerColumn6}>Total</p>
				</div>

				{/* Filas */}

				{
					quotation.body.map((item, index) => (
					// Handle different unitPrice shapes safely
					<div key={index} className={styles.tableRow}>
							<div className={styles.rowColumn1}>{item.name}</div>
							<div className={styles.rowColumn2}>{item.description}</div>
							<div className={styles.rowColumn3}>{item.price.quantity}</div>
							<div className={styles.rowColumn4}>
								${formatCurrency(item.price.unitPrice)}
							</div>
							<div className={styles.rowColumn5}>
								{item.price.discount ? `$${formatCurrency(item.price.discount)}` : "-"}
							</div>
							<div className={styles.rowColumn6}>${formatCurrency(item.price.result.subtotalWithoutDiscount)}</div>
						</div>
				))}
			</div>
			)}

			{/* TABLA DE PRECIOS PARA COTIZACION DE UN ELEMENTO */}
			{quotation.isSingle && (
				<div className={styles.singleItemSection}>
					{/* Encabezado del item */}
					<div className={styles.singleItemHeader}>
						<div className={styles.singleItemHeaderContent}>
							<h2 className={styles.singleItemName}>{quotation.body.name}</h2>
							{quotation.body.description && (
								<p className={styles.singleItemDescription}>{quotation.body.description}</p>
							)}
						</div>
					</div>

					{/* Tabla de precios */}
					<div className={styles.singlePriceTable}>
						{/* Encabezado de tabla */}
						<div className={styles.singleTableHeader}>
							<p className={styles.singleHeaderCol1}>Cantidad</p>
							<p className={styles.singleHeaderCol2}>Precio Unitario</p>
							<p className={styles.singleHeaderCol3}>Descuento</p>
							<p className={styles.singleHeaderCol4}>Subtotal</p>
							<p className={styles.singleHeaderCol5}>IVA</p>
							<p className={styles.singleHeaderCol6}>Total</p>
						</div>

						{/* Filas de precios */}
						{quotation.body.prices.map((price, index) => (
							<div key={index} className={styles.singleTableRow}>
								<div className={styles.singleRowCol1}>{price.quantity}</div>
								<div className={styles.singleRowCol2}>${formatCurrency(price.unitPrice)}</div>
								<div className={styles.singleRowCol3}>
									{price.discount ? `${price.discount}%` : "-"}
								</div>
								<div className={styles.singleRowCol4}>${formatCurrency(price.result.subtotalWithoutDiscount)}</div>
								<div className={styles.singleRowCol5}>${formatCurrency(price.result.iva)}</div>
								<div className={styles.singleRowCol6}>${formatCurrency(price.result.total)}</div>
							</div>
						))}
					</div>
				</div>
			)}




			{/* TÉRMINOS Y TOTALES */}
			<div className={styles.termsAndTotals}>
				<div className={styles.termsSection}>
					<h3 className={styles.termsTitle}>Términos y condiciones</h3>
					{quotation.daysDelivery && (
						<p className={styles.termsText}>
							<strong>Tiempo de entrega:</strong>{" "}
							{(() => {
								const diasStr = quotation.daysDelivery.toString().trim();
								// Verificar si es un número
								const esNumero = !isNaN(Number(diasStr)) && diasStr !== "";

								if (esNumero) {
									return `${diasStr} días hábiles a partir de su aprobación`;
								} else {
									return diasStr;
								}
							})()}
						</p>
					)}
					<p className={styles.termsText}>
						<strong>Forma de pago:</strong>{" "}
						{quotation.paymentTerms || "50% anticipo y 50% contra entrega"}
					</p>
					{quotation.notes && (
						<div className={styles.notesInTerms}>
							<p className={styles.termsText}>
								<strong>Notas:</strong>
							</p>
							{quotation.notes.split("\n").map((line, index) => (
								<p
									key={index}
									className={styles.termsText}
									style={{ marginLeft: "1rem" }}
								>
									{line || "\u00A0"}
								</p>
							))}
						</div>
					)}
				</div>

				{
					!quotation.isSingle &&	
					<div className={styles.totalsSection}>
						<div className={styles.totalsContainer}>
								<div className={styles.totalRow}>
									<span>Subtotal:</span>
									<span>${formatCurrency(quotation.result.subtotalWithoutDiscount)}</span>
								</div>
								<div className={styles.totalRow}>
									<span>Descuento:</span>
									<span>${formatCurrency(quotation.result.discount)}</span>
								</div>
								<div className={styles.totalRow}>
									<span>Subtotal:</span>
									<span>${formatCurrency(quotation.result.subtotal)}</span>
								</div>
								<div className={styles.totalRow}>
									<span>IVA:</span>
									<span>${formatCurrency(quotation.result.iva)}</span>
								</div>
								<hr className={styles.totalDivider} />
								<div className={styles.totalFinal}>
									<span>Total:</span>
									<span>${formatCurrency(quotation.result.total)}</span>
								</div>
							</div>
						</div>
						}

				
			</div>

			{/* PIE */}
			<div className={styles.footer}>
				<div className={styles.footerContent}>
					<div className={styles.signatureSection}>
						{/* Firma */}
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							key={`signature-${quotation.contact.signature}`}
							src={quotation.contact.signature}
							alt="firma"
							className={styles.signature}
						/>
						<h3 className={styles.signatureName}>
							{quotation.contact.name}
						</h3>
						<p className={styles.signatureInfo}>
							{quotation.contact.phone}
						</p>
						<p className={styles.signatureInfo}>
							{quotation.contact.email}
						</p>
					</div>
				</div>
				<div>
					<p className={styles.footerMessage}>
						{quotation.template.footerMessage}
					</p>
				</div>
			</div>
		</div>
	);
}
