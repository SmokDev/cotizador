import { useState, useEffect } from "react";
import { Head, Link, useForm, router } from "@inertiajs/react";
import axios from "axios";
import {
    Button,
    Surface,
    TextField,
    Input,
    TextArea,
    Label,
    FieldError,
    NumberField,
    ComboBox,
    ListBox,
    ListBoxItem,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    DatePicker,
    DateField,
    Calendar,
    Checkbox,
} from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import { ArrowLeft, Plus, Trash, Calculator, Save } from "lucide-react";
import QuotationPreview from "@/components/QuotationPreview";
import CostProfitModal from "@/components/CostProfitModal";
import { calculatorPrice, calculatorTotal } from "@/utils/calculator";
import { formatCurrency } from "@/utils/helpers";
import { CalendarDate, parseDate } from "@internationalized/date";

interface Client {
    id: number;
    name: string;
    company: string;
}

interface Props {
    clients: Client[];
    quotation?: any;
    paymentTerms?: string[];
    configContact?: { name?: string; email?: string; phone?: string };
    configLogo?: string;
    accentColor?: string;
}

export default function Create({
    clients,
    quotation,
    paymentTerms = [],
    configContact = {},
    configLogo,
    accentColor,
}: Props) {
    const isEditing = !!quotation;

    const { data, setData, post, put, processing, errors } = useForm({
        client_id: quotation ? String(quotation.client_id) : "",
        title: quotation?.title ?? "",
        description: quotation?.description ?? "",
        number: quotation ? String(quotation.id).padStart(4, "0") : "",
        date:
            quotation?.date?.split?.("T")?.[0] ??
            new Date().toISOString().split("T")[0],
        expiration_date:
            quotation?.expiration_date?.split?.("T")?.[0] ??
            new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
        notes: quotation?.notes ?? "",
        contact: {
            name: quotation?.contact?.name ?? configContact?.name ?? "",
            email: quotation?.contact?.email ?? configContact?.email ?? "",
            phone: quotation?.contact?.phone ?? configContact?.phone ?? "",
        },
        payment_terms:
            quotation?.payment_terms ?? (paymentTerms[0] || "100% Anticipo"),
        days_delivery: quotation?.days_delivery ?? 5,
        is_total_individual: quotation?.is_total_individual ?? false,
        items: (quotation?.items ?? []).map((i: any) => ({
            description: i.description,
            quantity: Number(i.quantity),
            unit_price: i.unit_price,
            percent_discount: Number(i.percent_discount || 0),
        })),
    });

    const [costModalIndex, setCostModalIndex] = useState<number | null>(null);
    const [clientModalOpen, setClientModalOpen] = useState(false);
    const [newClientName, setNewClientName] = useState("");
    const [newClientCompany, setNewClientCompany] = useState("");
    const [clientsList, setClientsList] = useState(clients);
    const [mobileTab, setMobileTab] = useState("form");

    const toCalendarDate = (str: string) => {
        try {
            return parseDate(str);
        } catch {
            return null;
        }
    };

    const [calDate, setCalDate] = useState<CalendarDate | null>(() =>
        toCalendarDate(data.date),
    );
    const [calExpDate, setCalExpDate] = useState<CalendarDate | null>(() =>
        toCalendarDate(data.expiration_date),
    );

    const handleCalDateChange = (v: CalendarDate | null) => {
        setCalDate(v);
        if (v) setData("date", v.toString());
    };

    const handleCalExpDateChange = (v: CalendarDate | null) => {
        setCalExpDate(v);
        if (v) setData("expiration_date", v.toString());
    };

    useEffect(() => {
        if (data.items.length === 0 && !quotation) {
            setData("items", [
                {
                    description: "",
                    quantity: 1,
                    unit_price: 0,
                    percent_discount: 0,
                },
            ]);
        }
    }, []);

    const addItem = () =>
        setData("items", [
            ...data.items,
            {
                description: "",
                quantity: 1,
                unit_price: 0,
                percent_discount: 0,
            },
        ]);

    const removeItem = (index: number) => {
        setData(
            "items",
            data.items.filter((_, i) => i !== index),
        );
    };

    const updateItem = (index: number, field: string, value: any) => {
        const next = [...data.items];
        (next[index] as any)[field] = value;
        setData("items", next);
    };

    const updateContact = (field: string, value: string) =>
        setData("contact", { ...data.contact, [field]: value });

    const handleCostConfirm = (
        spents: { name: string; quantity: number }[],
        utility: number,
    ) => {
        if (costModalIndex === null) return;
        const item = data.items[costModalIndex];
        const total = spents.reduce((s, a) => s + (Number(a.quantity) || 0), 0);
        const unitPrice = total * (1 + utility / 100);
        const qty = Number(item.quantity) || 1;
        updateItem(costModalIndex, "unit_price", { spents, utility });
        setCostModalIndex(null);
    };

    const handleCreateClient = async () => {
        if (!newClientName.trim()) return;
        try {
            const res = await axios.post("/clients", {
                name: newClientName,
                company: newClientCompany,
            });
            const newClient = res.data;
            setClientsList((prev) => [...prev, newClient]);
            setData("client_id", String(newClient.id));
            setNewClientName("");
            setNewClientCompany("");
            setClientModalOpen(false);
        } catch {
            /* ignore */
        }
    };

    const handleClearPrice = () => {
        if (costModalIndex === null) return;
        updateItem(costModalIndex, "unit_price", 0);
        setCostModalIndex(null);
    };

    const submitForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/${quotation.id}`);
        } else {
            post("/");
        }
    };

    const results = data.items.map((item) =>
        calculatorPrice(item.quantity, item.unit_price, item.percent_discount),
    );
    const totals = calculatorTotal(results);

    const selectedClient = clientsList.find(
        (c) => String(c.id) === data.client_id,
    );

    const getUnitPriceFromObject = (
        unit_price: any,
        quantity: number,
    ): number => {
        if (typeof unit_price !== "object" || unit_price === null)
            return Number(unit_price) || 0;
        const spents = unit_price.spents || [];
        const total = spents.reduce(
            (s: number, a: any) => s + (Number(a.quantity) || 0),
            0,
        );
        const perUnit = total * (1 + (unit_price.utility || 0) / 100);
        return quantity > 0 ? perUnit / quantity : perUnit;
    };

    const formContent = (
        <form onSubmit={submitForm} className="flex flex-col gap-5">
            <Surface variant="default" className="p-5 flex flex-col gap-4">
                <h2 className="text-base font-semibold border-b pb-1">
                    Información Básica
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="flex gap-2 items-end sm:col-span-2">
                        <div className="flex-1">
                            <ComboBox
                                selectedKey={data.client_id || null}
                                onSelectionChange={(key) =>
                                    setData("client_id", String(key))
                                }
                                isInvalid={!!errors.client_id}
                                isRequired
                            >
                                <Label>
                                    Cliente{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <ComboBox.InputGroup>
                                    <Input placeholder="Buscar cliente..." />
                                    <ComboBox.Trigger />
                                </ComboBox.InputGroup>
                                <ComboBox.Popover>
                                    <ListBox>
                                        {clientsList.map((c) => (
                                            <ListBox.Item
                                                key={c.id}
                                                id={String(c.id)}
                                                textValue={c.name}
                                            >
                                                {c.name} — {c.company}
                                                <ListBox.ItemIndicator />
                                            </ListBox.Item>
                                        ))}
                                    </ListBox>
                                </ComboBox.Popover>
                                <FieldError>{errors.client_id}</FieldError>
                            </ComboBox>
                        </div>
                        <Button
                            isIconOnly
                            size="sm"
                            onPress={() => setClientModalOpen(true)}
                        >
                            <Plus size={14} />
                        </Button>
                    </div>
                    <DatePicker
                        value={calDate}
                        onChange={handleCalDateChange}
                        isInvalid={!!errors.date}
                        isRequired
                    >
                        <Label>
                            Fecha <span className="text-red-500">*</span>
                        </Label>
                        <DateField.Group fullWidth>
                            <DateField.Input>
                                {(segment) => (
                                    <DateField.Segment segment={segment} />
                                )}
                            </DateField.Input>
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
                                    <Calendar.GridHeader>
                                        {(day) => (
                                            <Calendar.HeaderCell>
                                                {day}
                                            </Calendar.HeaderCell>
                                        )}
                                    </Calendar.GridHeader>
                                    <Calendar.GridBody>
                                        {(d) => <Calendar.Cell date={d} />}
                                    </Calendar.GridBody>
                                </Calendar.Grid>
                                <Calendar.YearPickerGrid>
                                    <Calendar.YearPickerGridBody>
                                        {({ year }) => (
                                            <Calendar.YearPickerCell
                                                year={year}
                                            />
                                        )}
                                    </Calendar.YearPickerGridBody>
                                </Calendar.YearPickerGrid>
                            </Calendar>
                        </DatePicker.Popover>
                        <FieldError>{errors.date}</FieldError>
                    </DatePicker>
                    <DatePicker
                        value={calExpDate}
                        onChange={handleCalExpDateChange}
                        isInvalid={!!errors.expiration_date}
                        isRequired
                    >
                        <Label>
                            Expiración <span className="text-red-500">*</span>
                        </Label>
                        <DateField.Group fullWidth>
                            <DateField.Input>
                                {(segment) => (
                                    <DateField.Segment segment={segment} />
                                )}
                            </DateField.Input>
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
                                    <Calendar.GridHeader>
                                        {(day) => (
                                            <Calendar.HeaderCell>
                                                {day}
                                            </Calendar.HeaderCell>
                                        )}
                                    </Calendar.GridHeader>
                                    <Calendar.GridBody>
                                        {(d) => <Calendar.Cell date={d} />}
                                    </Calendar.GridBody>
                                </Calendar.Grid>
                                <Calendar.YearPickerGrid>
                                    <Calendar.YearPickerGridBody>
                                        {({ year }) => (
                                            <Calendar.YearPickerCell
                                                year={year}
                                            />
                                        )}
                                    </Calendar.YearPickerGridBody>
                                </Calendar.YearPickerGrid>
                            </Calendar>
                        </DatePicker.Popover>
                        <FieldError>{errors.expiration_date}</FieldError>
                    </DatePicker>
                </div>
                <TextField
                    value={data.title}
                    onChange={(v) => setData("title", v)}
                    isInvalid={!!errors.title}
                    isRequired
                >
                    <Label>
                        Título / Proyecto{" "}
                        <span className="text-red-500">*</span>
                    </Label>
                    <Input />
                    <FieldError>{errors.title}</FieldError>
                </TextField>
                <TextField
                    value={data.description}
                    onChange={(v) => setData("description", v)}
                    isInvalid={!!errors.description}
                >
                    <Label>Descripción</Label>
                    <TextArea className="min-h-15" />
                    <FieldError>{errors.description}</FieldError>
                </TextField>
            </Surface>

            <Surface variant="default" className="p-5 flex flex-col gap-3">
                <div className="flex justify-between items-center border-b pb-1">
                    <h2 className="text-base font-semibold">Ítems</h2>
                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="total-individual"
                            isSelected={data.is_total_individual}
                            onChange={(v) => setData("is_total_individual", v)}
                        >
                            <Checkbox.Control>
                                <Checkbox.Indicator />
                            </Checkbox.Control>
                            <Checkbox.Content>
                                <Label
                                    htmlFor="total-individual"
                                    className="text-sm cursor-pointer"
                                >
                                    Total Individual
                                </Label>
                            </Checkbox.Content>
                        </Checkbox>
                    </div>
                </div>
                {typeof errors.items === "string" && (
                    <span className="text-red-500 text-xs">{errors.items}</span>
                )}
                <div className="flex flex-col gap-3 max-h-100 overflow-y-auto">
                    {data.items.map((item, i) => (
                        <Surface
                            key={i}
                            variant="primary"
                            className="relative p-3"
                        >
                            {data.items.length > 1 && (
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="danger"
                                    type="button"
                                    className="absolute top-2 right-2"
                                    onPress={() => removeItem(i)}
                                >
                                    <Trash size={14} />
                                </Button>
                            )}
                            <div className="flex flex-col gap-2">
                                <TextField
                                    value={item.description}
                                    onChange={(v) =>
                                        updateItem(i, "description", v)
                                    }
                                    isInvalid={
                                        !!errors[`items.${i}.description`]
                                    }
                                    isRequired
                                >
                                    <Label>
                                        Descripción{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input />
                                    <FieldError>
                                        {errors[`items.${i}.description`]}
                                    </FieldError>
                                </TextField>
                                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-end">
                                    <div className="min-w-0">
                                        <NumberField
                                            value={item.quantity}
                                            onChange={(v) =>
                                                updateItem(i, "quantity", v)
                                            }
                                            isInvalid={
                                                !!errors[`items.${i}.quantity`]
                                            }
                                            isRequired
                                            minValue={0}
                                        >
                                            <Label>Cant.</Label>
                                            <NumberField.Group>
                                                <NumberField.DecrementButton>
                                                    -
                                                </NumberField.DecrementButton>
                                                <NumberField.Input />
                                                <NumberField.IncrementButton>
                                                    +
                                                </NumberField.IncrementButton>
                                            </NumberField.Group>
                                            <FieldError>
                                                {errors[`items.${i}.quantity`]}
                                            </FieldError>
                                        </NumberField>
                                    </div>
                                    <div className="min-w-0">
                                        {typeof item.unit_price === "object" ? (
                                            <TextField
                                                value={`$${formatCurrency(getUnitPriceFromObject(item.unit_price, Number(item.quantity) || 1))}`}
                                                isDisabled
                                                isRequired
                                            >
                                                <Label>P. Unitario</Label>
                                                <Input />
                                            </TextField>
                                        ) : (
                                            <NumberField
                                                value={item.unit_price}
                                                onChange={(v) =>
                                                    updateItem(
                                                        i,
                                                        "unit_price",
                                                        v,
                                                    )
                                                }
                                                isInvalid={
                                                    !!errors[
                                                        `items.${i}.unit_price`
                                                    ]
                                                }
                                                isRequired
                                                minValue={0}
                                                step={1}
                                                formatOptions={{
                                                    style: "decimal",
                                                    minimumFractionDigits: 2,
                                                }}
                                            >
                                                <Label>P/U</Label>
                                                <NumberField.Group>
                                                    <NumberField.DecrementButton>
                                                        -
                                                    </NumberField.DecrementButton>
                                                    <NumberField.Input />
                                                    <NumberField.IncrementButton>
                                                        +
                                                    </NumberField.IncrementButton>
                                                </NumberField.Group>
                                                <FieldError>
                                                    {
                                                        errors[
                                                            `items.${i}.unit_price`
                                                        ]
                                                    }
                                                </FieldError>
                                            </NumberField>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <NumberField
                                            value={item.percent_discount}
                                            onChange={(v) =>
                                                updateItem(
                                                    i,
                                                    "percent_discount",
                                                    v,
                                                )
                                            }
                                            minValue={0}
                                            maxValue={100}
                                        >
                                            <Label>Desc.%</Label>
                                            <NumberField.Group>
                                                <NumberField.DecrementButton>
                                                    -
                                                </NumberField.DecrementButton>
                                                <NumberField.Input />
                                                <NumberField.IncrementButton>
                                                    +
                                                </NumberField.IncrementButton>
                                            </NumberField.Group>
                                        </NumberField>
                                    </div>
                                    <div className="flex-none pb-1">
                                        <Button
                                            isIconOnly
                                            size="sm"
                                            type="button"
                                            onPress={() => setCostModalIndex(i)}
                                        >
                                            <Calculator size={14} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Surface>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onPress={addItem}
                        className="w-full"
                    >
                        <Plus size={14} /> Agregar
                    </Button>
                </div>
            </Surface>

            <Surface variant="default" className="p-5 flex flex-col gap-4">
                <h2 className="text-base font-semibold border-b pb-1">
                    Condiciones
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <ComboBox
                        className="sm:col-span-2 w-full"
                        defaultInputValue={data.payment_terms}
                        allowsCustomValue
                        defaultFilter={(text, inputValue) => {
                            if (!inputValue) return true;
                            return text
                                .toLowerCase()
                                .includes(inputValue.toLowerCase());
                        }}
                        onSelectionChange={(key) => {
                            if (key) setData("payment_terms", String(key));
                        }}
                        onInputChange={(v) => setData("payment_terms", v)}
                        isInvalid={!!errors.payment_terms}
                        isRequired
                    >
                        <Label>
                            Términos de Pago{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <ComboBox.InputGroup>
                            <Input placeholder="Escribe o selecciona..." />
                            <ComboBox.Trigger />
                        </ComboBox.InputGroup>
                        <ComboBox.Popover>
                            <ListBox>
                                {paymentTerms.map((term, i) => (
                                    <ListBox.Item
                                        key={term}
                                        id={term}
                                        textValue={term}
                                    >
                                        {term}
                                        <ListBox.ItemIndicator />
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </ComboBox.Popover>
                        <FieldError>{errors.payment_terms}</FieldError>
                    </ComboBox>
                    <NumberField
                        value={data.days_delivery}
                        onChange={(v) => setData("days_delivery", v)}
                        isInvalid={!!errors.days_delivery}
                        isRequired
                        minValue={0}
                    >
                        <Label>
                            Días de Entrega{" "}
                            <span className="text-red-500">*</span>
                        </Label>
                        <NumberField.Group>
                            <NumberField.DecrementButton>
                                -
                            </NumberField.DecrementButton>
                            <NumberField.Input />
                            <NumberField.IncrementButton>
                                +
                            </NumberField.IncrementButton>
                        </NumberField.Group>
                        <FieldError>{errors.days_delivery}</FieldError>
                    </NumberField>
                </div>
                <TextField
                    value={data.notes}
                    onChange={(v) => setData("notes", v)}
                    isInvalid={!!errors.notes}
                >
                    <Label>Notas adicionales</Label>
                    <TextArea className="min-h-[80px]" />
                    <FieldError>{errors.notes}</FieldError>
                </TextField>
            </Surface>

            <Surface variant="default" className="p-5 flex flex-col gap-4">
                <h2 className="text-base font-semibold border-b pb-1">
                    Contacto
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <TextField
                        value={data.contact.name}
                        onChange={(v) => updateContact("name", v)}
                    >
                        <Label>Nombre</Label>
                        <Input />
                    </TextField>
                    <TextField
                        type="email"
                        value={data.contact.email}
                        onChange={(v) => updateContact("email", v)}
                    >
                        <Label>Correo Electrónico</Label>
                        <Input />
                    </TextField>
                    <TextField
                        value={data.contact.phone}
                        onChange={(v) => updateContact("phone", v)}
                    >
                        <Label>Teléfono</Label>
                        <Input />
                    </TextField>
                </div>
                {errors.contact && (
                    <span className="text-red-500 text-xs">
                        {errors.contact}
                    </span>
                )}
            </Surface>
        </form>
    );

    const previewContent = (
        <div className="w-full min-h-full max-w-[816px]">
            <QuotationPreview
                title={data.title}
                number={data.number || "---"}
                date={data.date}
                expiration_date={data.expiration_date}
                description={data.description}
                items={data.items}
                notes={data.notes}
                contact={data.contact}
                payment_terms={data.payment_terms}
                days_delivery={data.days_delivery}
                client_name={selectedClient?.name}
                client_company={selectedClient?.company}
                logo={configLogo}
                accentColor={accentColor}
                isTotalIndividual={data.is_total_individual}
            />
        </div>
    );

    const headerContent = (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 md:mb-6 shrink-0">
            <div className="flex items-center gap-3">
                <Link
                    href="/"
                    className={buttonVariants({ variant: "tertiary" })}
                >
                    <ArrowLeft size={20} /> Volver
                </Link>
                <h1 className="text-xl md:text-2xl font-bold">
                    {isEditing
                        ? `Editar Cotización #${String(quotation.id).padStart(4, "0")}`
                        : "Nueva Cotización"}
                </h1>
            </div>
            <Button
                variant="primary"
                onPress={() =>
                    isEditing
                        ? put(`/${quotation.id}`)
                        : post("/")
                }
                isLoading={processing}
            >
                <Save size={16} />{" "}
                {isEditing ? "Guardar Cambios" : "Crear Cotización"}
            </Button>
        </div>
    );

    return (
        <div className="min-h-screen h-auto md:h-screen bg-background p-3 md:p-8 flex flex-col">
            <Head
                title={
                    isEditing
                        ? `Editar Cotización #${String(quotation.id).padStart(4, "0")}`
                        : "Nueva Cotización"
                }
            />

            {headerContent}

            <div className="flex lg:hidden flex-col flex-1 min-h-0">
                <Tabs
                    className="w-full"
                    selectedKey={mobileTab}
                    onSelectionChange={(key) => setMobileTab(String(key))}
                >
                    <TabList className="w-full">
                        <Tab id="form" className="flex-1">
                            Formulario
                        </Tab>
                        <Tab id="preview" className="flex-1">
                            Vista Previa
                        </Tab>
                    </TabList>
                    <TabPanel id="form" className="pt-4 h-full">
                        <div className="h-full overflow-y-auto">
                            {formContent}
                        </div>
                    </TabPanel>
                    <TabPanel id="preview" className="pt-4 h-full">
                        <div className="h-full overflow-y-auto flex items-start justify-center">
                            {previewContent}
                        </div>
                    </TabPanel>
                </Tabs>
            </div>

            <div className="hidden lg:flex flex-1 min-h-0 gap-4 grow">
                <Surface className="w-1/2 h-full overflow-y-scroll p-5 flex flex-col gap-5">
                    {formContent}
                </Surface>

                <Surface className="w-1/2 h-full overflow-y-auto p-5 flex items-start justify-center">
                    {previewContent}
                </Surface>
            </div>

            <CostProfitModal
                isOpen={costModalIndex !== null}
                onClose={() => setCostModalIndex(null)}
                onConfirm={handleCostConfirm}
                onClear={handleClearPrice}
                hasLockedPrice={
                    costModalIndex !== null &&
                    typeof data.items[costModalIndex]?.unit_price === "object"
                }
                initialSpents={
                    costModalIndex !== null &&
                    typeof data.items[costModalIndex]?.unit_price === "object"
                        ? data.items[costModalIndex].unit_price.spents
                        : undefined
                }
                initialUtility={
                    costModalIndex !== null &&
                    typeof data.items[costModalIndex]?.unit_price === "object"
                        ? data.items[costModalIndex].unit_price.utility
                        : undefined
                }
                quantity={
                    costModalIndex !== null
                        ? Number(data.items[costModalIndex]?.quantity) || 1
                        : 1
                }
            />

            {clientModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="fixed inset-0 bg-black/40"
                        onClick={() => setClientModalOpen(false)}
                    />
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
                        <div className="p-5 border-b">
                            <h2 className="text-lg font-bold">Nuevo Cliente</h2>
                        </div>
                        <div className="p-5 flex flex-col gap-4">
                            <TextField
                                value={newClientName}
                                onChange={setNewClientName}
                            >
                                <Label>
                                    Nombre{" "}
                                    <span className="text-red-500">*</span>
                                </Label>
                                <Input placeholder="Nombre del cliente" />
                            </TextField>
                            <TextField
                                value={newClientCompany}
                                onChange={setNewClientCompany}
                            >
                                <Label>Empresa</Label>
                                <Input placeholder="Nombre de la empresa" />
                            </TextField>
                        </div>
                        <div className="flex justify-end gap-2 p-5 border-t">
                            <Button
                                variant="tertiary"
                                onPress={() => setClientModalOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                onPress={handleCreateClient}
                            >
                                Crear Cliente
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
