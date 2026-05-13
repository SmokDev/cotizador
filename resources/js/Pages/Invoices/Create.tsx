import { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import axios from "axios";
import {
    Button, Surface, TextField, Input, TextArea, Label, FieldError,
    NumberField, Select, ListBox, ListBoxItem, DatePicker, DateField, Calendar,
} from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import { ArrowLeft, Plus, Trash, Calculator, Download } from "lucide-react";
import QuotationPreview from "@/components/QuotationPreview";
import CostProfitModal from "@/components/CostProfitModal";
import { calculatorPrice, calculatorTotal, calculatorUnitPrice } from "@/utils/calculator";
import { formatCurrency } from "@/utils/helpers";
import { CalendarDate, parseDate } from "@internationalized/date";

interface Client { id: number; name: string; company: string; }

interface Props { clients: Client[]; invoice?: any; }

export default function Create({ clients, invoice }: Props) {
    const isEditing = !!invoice;
    const [downloadProcessing, setDownloadProcessing] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm({
        client_id: invoice ? String(invoice.client_id) : "",
        title: invoice?.title ?? "",
        description: invoice?.description ?? "",
        number: invoice ? String(invoice.number) : "",
        date: invoice?.date?.split?.("T")?.[0] ?? new Date().toISOString().split('T')[0],
        expiration_date: invoice?.expiration_date?.split?.("T")?.[0] ?? new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: invoice?.notes ?? "",
        contact: {
            name: invoice?.contact?.name ?? "",
            email: invoice?.contact?.email ?? "",
            phone: invoice?.contact?.phone ?? "",
        },
        payment_terms: invoice?.payment_terms ?? "100% Anticipo",
        delivery_label: invoice?.delivery_label ?? "Días hábiles",
        days_delivery: invoice?.days_delivery ?? 5,
        items: (invoice?.items ?? []).map((i: any) => ({
            description: i.description,
            quantity: Number(i.quantity),
            unit_price: i.unit_price,
            percent_discount: Number(i.percent_discount || 0),
        })),
    });

    const [costModalIndex, setCostModalIndex] = useState<number | null>(null);

    const toCalendarDate = (str: string) => {
        try { return parseDate(str); } catch { return null; }
    };

    const [calDate, setCalDate] = useState<CalendarDate | null>(() => toCalendarDate(data.date));
    const [calExpDate, setCalExpDate] = useState<CalendarDate | null>(() => toCalendarDate(data.expiration_date));

    const handleCalDateChange = (v: CalendarDate | null) => {
        setCalDate(v);
        if (v) setData("date", v.toString());
    };

    const handleCalExpDateChange = (v: CalendarDate | null) => {
        setCalExpDate(v);
        if (v) setData("expiration_date", v.toString());
    };

    useEffect(() => {
        if (data.items.length === 0 && !invoice) {
            setData("items", [{ description: "", quantity: 1, unit_price: 0, percent_discount: 0 }]);
        }
    }, []);

    const addItem = () =>
        setData("items", [...data.items, { description: "", quantity: 1, unit_price: 0, percent_discount: 0 }]);

    const removeItem = (index: number) => {
        setData("items", data.items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: string, value: any) => {
        const next = [...data.items];
        (next[index] as any)[field] = value;
        setData("items", next);
    };

    const updateContact = (field: string, value: string) =>
        setData("contact", { ...data.contact, [field]: value });

    const handleCostConfirm = (spents: { name: string; quantity: number }[], utility: number) => {
        if (costModalIndex === null) return;
        const item = data.items[costModalIndex];
        const total = spents.reduce((s, a) => s + (Number(a.quantity) || 0), 0);
        const unitPrice = total * (1 + utility / 100);
        const qty = Number(item.quantity) || 1;
        updateItem(costModalIndex, "unit_price", { spents, utility });
        setCostModalIndex(null);
    };

    const handleClearPrice = () => {
        if (costModalIndex === null) return;
        updateItem(costModalIndex, "unit_price", 0);
        setCostModalIndex(null);
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/invoices/${invoice.id}`);
        } else {
            post("/invoices");
        }
    };

    const handleDownload = async () => {
        setDownloadProcessing(true);
        try {
            const response = await axios.post("/invoices/save-and-download", data);
            const invoiceId = response.data.id;
            window.open(`/invoices/${invoiceId}/pdf`, "_blank");
            router.visit("/invoices");
        } catch {
            setDownloadProcessing(false);
        }
    };

    const results = data.items.map(item =>
        calculatorPrice(item.quantity, item.unit_price, item.percent_discount)
    );
    const totals = calculatorTotal(results);

    const selectedClient = clients.find(c => String(c.id) === data.client_id);

    const getUnitPriceFromObject = (unit_price: any, quantity: number): number => {
        if (typeof unit_price !== "object" || unit_price === null) return Number(unit_price) || 0;
        const spents = unit_price.spents || [];
        const total = spents.reduce((s: number, a: any) => s + (Number(a.quantity) || 0), 0);
        const perUnit = total * (1 + (unit_price.utility || 0) / 100);
        return quantity > 0 ? perUnit / quantity : perUnit;
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-background">
            <Head title="Crear Cotización" />

            <header className="shrink-0 px-6 py-3 border-b border-border flex items-center justify-between bg-surface">
                <div className="flex items-center gap-3">
                    <Link href="/invoices" className={buttonVariants({ variant: "tertiary", size: "sm" })}>
                        <ArrowLeft size={18} />
                    </Link>
                    <h1 className="text-lg font-bold">{isEditing ? `Editar Cotización #${invoice.number}` : "Nueva Cotización"}</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" onPress={() => isEditing ? put(`/invoices/${invoice.id}`) : post("/invoices")} isLoading={processing}>
                        {isEditing ? "Actualizar Cotización" : "Guardar Cotización"}
                    </Button>
                    <Button variant="primary" size="sm" onPress={handleDownload} isLoading={processing || downloadProcessing}>
                        <Download size={16} /> Descargar PDF
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 min-h-0">
                <div className="w-1/2 overflow-y-auto p-6 border-r border-border">
                    <form onSubmit={submitForm} className="flex flex-col gap-5">
                        <Surface className="p-5 flex flex-col gap-4">
                            <h2 className="text-base font-semibold border-b pb-1">Información Básica</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <TextField value={data.title} onChange={v => setData("title", v)}
                                    isInvalid={!!errors.title} isRequired>
                                    <Label>Título / Proyecto <span className="text-red-500">*</span></Label>
                                    <Input />
                                    <FieldError>{errors.title}</FieldError>
                                </TextField>
                                <TextField value={data.number} onChange={v => setData("number", v)}
                                    isInvalid={!!errors.number} isRequired>
                                    <Label>No. de Cotización <span className="text-red-500">*</span></Label>
                                    <Input />
                                    <FieldError>{errors.number}</FieldError>
                                </TextField>
                                <Select selectedKey={data.client_id || null}
                                    onSelectionChange={key => setData("client_id", String(key))}
                                    isInvalid={!!errors.client_id} isRequired>
                                    <Label>Cliente <span className="text-red-500">*</span></Label>
                                    <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
                                    <FieldError>{errors.client_id}</FieldError>
                                    <Select.Popover>
                                        <ListBox>
                                            {clients.map(c => (
                                                <ListBoxItem key={c.id} id={String(c.id)} textValue={c.name}>
                                                    {c.name} — {c.company}
                                                </ListBoxItem>
                                            ))}
                                        </ListBox>
                                    </Select.Popover>
                                </Select>
                                <div className="grid grid-cols-2 gap-2">
                                    <DatePicker value={calDate} onChange={handleCalDateChange} isInvalid={!!errors.date} isRequired>
                                        <Label>Fecha <span className="text-red-500">*</span></Label>
                                        <DateField.Group fullWidth>
                                            <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
                                            <DateField.Suffix>
                                                <DatePicker.Trigger>
                                                    <DatePicker.TriggerIndicator />
                                                </DatePicker.Trigger>
                                            </DateField.Suffix>
                                        </DateField.Group>
                                        <DatePicker.Popover>
                                            <Calendar aria-label="Fecha">
                                                <Calendar.Header>
                                                    <Calendar.YearPickerTrigger>
                                                        <Calendar.YearPickerTriggerHeading />
                                                        <Calendar.YearPickerTriggerIndicator />
                                                    </Calendar.YearPickerTrigger>
                                                    <Calendar.NavButton slot="previous" />
                                                    <Calendar.NavButton slot="next" />
                                                </Calendar.Header>
                                                <Calendar.Grid>
                                                    <Calendar.GridHeader>{(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}</Calendar.GridHeader>
                                                    <Calendar.GridBody>{(d) => <Calendar.Cell date={d} />}</Calendar.GridBody>
                                                </Calendar.Grid>
                                                <Calendar.YearPickerGrid>
                                                    <Calendar.YearPickerGridBody>{({ year }) => <Calendar.YearPickerCell year={year} />}</Calendar.YearPickerGridBody>
                                                </Calendar.YearPickerGrid>
                                            </Calendar>
                                        </DatePicker.Popover>
                                        <FieldError>{errors.date}</FieldError>
                                    </DatePicker>
                                    <DatePicker value={calExpDate} onChange={handleCalExpDateChange} isInvalid={!!errors.expiration_date} isRequired>
                                        <Label>Expiración <span className="text-red-500">*</span></Label>
                                        <DateField.Group fullWidth>
                                            <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
                                            <DateField.Suffix>
                                                <DatePicker.Trigger>
                                                    <DatePicker.TriggerIndicator />
                                                </DatePicker.Trigger>
                                            </DateField.Suffix>
                                        </DateField.Group>
                                        <DatePicker.Popover>
                                            <Calendar aria-label="Expiración">
                                                <Calendar.Header>
                                                    <Calendar.YearPickerTrigger>
                                                        <Calendar.YearPickerTriggerHeading />
                                                        <Calendar.YearPickerTriggerIndicator />
                                                    </Calendar.YearPickerTrigger>
                                                    <Calendar.NavButton slot="previous" />
                                                    <Calendar.NavButton slot="next" />
                                                </Calendar.Header>
                                                <Calendar.Grid>
                                                    <Calendar.GridHeader>{(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}</Calendar.GridHeader>
                                                    <Calendar.GridBody>{(d) => <Calendar.Cell date={d} />}</Calendar.GridBody>
                                                </Calendar.Grid>
                                                <Calendar.YearPickerGrid>
                                                    <Calendar.YearPickerGridBody>{({ year }) => <Calendar.YearPickerCell year={year} />}</Calendar.YearPickerGridBody>
                                                </Calendar.YearPickerGrid>
                                            </Calendar>
                                        </DatePicker.Popover>
                                        <FieldError>{errors.expiration_date}</FieldError>
                                    </DatePicker>
                                </div>
                                <TextField className="col-span-2" value={data.description}
                                    onChange={v => setData("description", v)}
                                    isInvalid={!!errors.description}>
                                    <Label>Descripción</Label>
                                    <TextArea className="min-h-[60px]" />
                                    <FieldError>{errors.description}</FieldError>
                                </TextField>
                            </div>
                        </Surface>

                        <Surface className="p-5 flex flex-col gap-4">
                            <h2 className="text-base font-semibold border-b pb-1">Contacto</h2>
                            <div className="grid grid-cols-3 gap-3">
                                <TextField value={data.contact.name} onChange={v => updateContact("name", v)}>
                                    <Label>Nombre</Label>
                                    <Input />
                                </TextField>
                                <TextField type="email" value={data.contact.email}
                                    onChange={v => updateContact("email", v)}>
                                    <Label>Correo Electrónico</Label>
                                    <Input />
                                </TextField>
                                <TextField value={data.contact.phone} onChange={v => updateContact("phone", v)}>
                                    <Label>Teléfono</Label>
                                    <Input />
                                </TextField>
                            </div>
                            {errors.contact && <span className="text-red-500 text-xs">{errors.contact}</span>}
                        </Surface>

                        <Surface className="p-5 flex flex-col gap-4">
                            <h2 className="text-base font-semibold border-b pb-1">Condiciones</h2>
                            <div className="grid grid-cols-3 gap-3">
                                <TextField value={data.payment_terms}
                                    onChange={v => setData("payment_terms", v)}
                                    isInvalid={!!errors.payment_terms} isRequired>
                                    <Label>Términos de Pago <span className="text-red-500">*</span></Label>
                                    <Input />
                                    <FieldError>{errors.payment_terms}</FieldError>
                                </TextField>
                                <TextField value={data.delivery_label}
                                    onChange={v => setData("delivery_label", v)}
                                    isInvalid={!!errors.delivery_label} isRequired>
                                    <Label>Etiqueta de Entrega <span className="text-red-500">*</span></Label>
                                    <Input placeholder="Ej. Días hábiles" />
                                    <FieldError>{errors.delivery_label}</FieldError>
                                </TextField>
                                <NumberField value={data.days_delivery}
                                    onChange={v => setData("days_delivery", v)}
                                    isInvalid={!!errors.days_delivery} isRequired minValue={0}>
                                    <Label>Días de Entrega <span className="text-red-500">*</span></Label>
                                    <NumberField.Group>
                                        <NumberField.DecrementButton>-</NumberField.DecrementButton>
                                        <NumberField.Input />
                                        <NumberField.IncrementButton>+</NumberField.IncrementButton>
                                    </NumberField.Group>
                                    <FieldError>{errors.days_delivery}</FieldError>
                                </NumberField>
                            </div>
                            <TextField value={data.notes} onChange={v => setData("notes", v)}
                                isInvalid={!!errors.notes}>
                                <Label>Notas adicionales</Label>
                                <TextArea className="min-h-[80px]" />
                                <FieldError>{errors.notes}</FieldError>
                            </TextField>
                        </Surface>

                        <Surface className="p-5 flex flex-col gap-3">
                            <div className="flex justify-between items-center border-b pb-1">
                                <h2 className="text-base font-semibold">Ítems</h2>
                                <Button type="button" variant="secondary" size="sm" onPress={addItem}>
                                    <Plus size={14} /> Agregar
                                </Button>
                            </div>
                            {typeof errors.items === 'string' && (
                                <span className="text-red-500 text-xs">{errors.items}</span>
                            )}
                            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
                                {data.items.map((item, i) => (
                                    <div key={i} className="relative border border-border rounded-lg p-3">
                                        {data.items.length > 1 && (
                                            <Button isIconOnly size="sm" variant="danger" type="button"
                                                className="absolute top-2 right-2"
                                                onPress={() => removeItem(i)}>
                                                <Trash size={14} />
                                            </Button>
                                        )}
                                        <div className="flex flex-col gap-2">
                                            <TextField value={item.description}
                                                onChange={v => updateItem(i, "description", v)}
                                                isInvalid={!!errors[`items.${i}.description`]} isRequired>
                                                <Label>Descripción <span className="text-red-500">*</span></Label>
                                                <Input />
                                                <FieldError>{errors[`items.${i}.description`]}</FieldError>
                                            </TextField>
                                            <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
                                                <div className="min-w-0">
                                                    <NumberField value={item.quantity}
                                                        onChange={v => updateItem(i, "quantity", v)}
                                                        isInvalid={!!errors[`items.${i}.quantity`]} isRequired minValue={0}>
                                                        <Label>Cant.</Label>
                                                        <NumberField.Group>
                                                            <NumberField.DecrementButton>-</NumberField.DecrementButton>
                                                            <NumberField.Input />
                                                            <NumberField.IncrementButton>+</NumberField.IncrementButton>
                                                        </NumberField.Group>
                                                        <FieldError>{errors[`items.${i}.quantity`]}</FieldError>
                                                    </NumberField>
                                                </div>
                                                <div className="min-w-0">
                                                    {typeof item.unit_price === "object" ? (
                                                        <TextField value={`$${formatCurrency(getUnitPriceFromObject(item.unit_price, Number(item.quantity) || 1))}`} isDisabled isRequired>
                                                            <Label>P. Unitario</Label>
                                                            <Input />
                                                        </TextField>
                                                    ) : (
                                                        <NumberField value={item.unit_price}
                                                            onChange={v => updateItem(i, "unit_price", v)}
                                                            isInvalid={!!errors[`items.${i}.unit_price`]}
                                                            isRequired minValue={0} step={1}
                                                            formatOptions={{ style: "decimal", minimumFractionDigits: 2 }}>
                                                            <Label>P/U</Label>
                                                            <NumberField.Group>
                                                                <NumberField.DecrementButton>-</NumberField.DecrementButton>
                                                                <NumberField.Input />
                                                                <NumberField.IncrementButton>+</NumberField.IncrementButton>
                                                            </NumberField.Group>
                                                            <FieldError>{errors[`items.${i}.unit_price`]}</FieldError>
                                                        </NumberField>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <NumberField value={item.percent_discount}
                                                        onChange={v => updateItem(i, "percent_discount", v)}
                                                        minValue={0} maxValue={100}>
                                                        <Label>Desc.%</Label>
                                                        <NumberField.Group>
                                                            <NumberField.DecrementButton>-</NumberField.DecrementButton>
                                                            <NumberField.Input />
                                                            <NumberField.IncrementButton>+</NumberField.IncrementButton>
                                                        </NumberField.Group>
                                                    </NumberField>
                                                </div>
                                                <div className="flex-none pb-1">
                                                    <Button isIconOnly size="sm" variant="tertiary" type="button"
                                                        onPress={() => setCostModalIndex(i)}>
                                                        <Calculator size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Surface>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
                            <div className="flex justify-between"><span>Subtotal:</span><span className="font-semibold">${formatCurrency(totals.subtotalWithoutDiscount)}</span></div>
                            <div className="flex justify-between"><span>Descuento:</span><span className="font-semibold">${formatCurrency(totals.discount)}</span></div>
                            <div className="flex justify-between"><span>Subtotal con Desc.:</span><span className="font-semibold">${formatCurrency(totals.subtotal)}</span></div>
                            <div className="flex justify-between"><span>IVA (16%):</span><span className="font-semibold">${formatCurrency(totals.iva)}</span></div>
                            <hr className="my-1.5 border-amber-200" />
                            <div className="flex justify-between font-bold text-base"><span>Total:</span><span className="text-amber-700">${formatCurrency(totals.total)}</span></div>
                        </div>
                    </form>
                </div>

                <div className="w-1/2 overflow-y-auto p-6 bg-gray-50 flex flex-col items-center">
                    <div className="w-full max-w-[816px]">
                        <QuotationPreview
                            title={data.title}
                            number={data.number}
                            date={data.date}
                            expiration_date={data.expiration_date}
                            description={data.description}
                            items={data.items}
                            notes={data.notes}
                            contact={data.contact}
                            payment_terms={data.payment_terms}
                            delivery_label={data.delivery_label}
                            days_delivery={data.days_delivery}
                            client_name={selectedClient?.name}
                            client_company={selectedClient?.company}
                        />
                    </div>
                </div>
            </div>

            <CostProfitModal
                isOpen={costModalIndex !== null}
                onClose={() => setCostModalIndex(null)}
                onConfirm={handleCostConfirm}
                onClear={handleClearPrice}
                hasLockedPrice={costModalIndex !== null && typeof data.items[costModalIndex]?.unit_price === "object"}
                initialSpents={costModalIndex !== null && typeof data.items[costModalIndex]?.unit_price === "object"
                    ? data.items[costModalIndex].unit_price.spents : undefined}
                initialUtility={costModalIndex !== null && typeof data.items[costModalIndex]?.unit_price === "object"
                    ? data.items[costModalIndex].unit_price.utility : undefined}
            />
        </div>
    );
}

