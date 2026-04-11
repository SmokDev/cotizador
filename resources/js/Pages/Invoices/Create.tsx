import { Head, Link, useForm } from "@inertiajs/react";
import {
    Surface, Button, TextField, Input, TextArea, Label, FieldError,
    NumberField, Select, ListBox, ListBoxItem
} from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import { ArrowLeft, Plus, Trash } from "lucide-react";

interface Client {
    id: number;
    name: string;
    company: string;
}

interface Props {
    clients: Client[];
}

export default function Create({ clients }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        client_id: "",
        title: "",
        description: "",
        number: "",
        date: new Date().toISOString().split('T')[0],
        expiration_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: "",
        contact: {
            name: "",
            email: "",
            phone: ""
        },
        payment_terms: "100% Anticipo",
        delivery_label: "Días hábiles",
        days_delivery: 5,
        items: [
            { description: "", quantity: 1, unit_price: 0, percent_discount: 0 }
        ]
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/invoices");
    };

    const addItem = () => {
        setData("items", [...data.items, { description: "", quantity: 1, unit_price: 0, percent_discount: 0 }]);
    };

    const removeItem = (index: number) => {
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData("items", newItems);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        (newItems[index] as any)[field] = value;
        setData("items", newItems);
    };

    const updateContact = (field: string, value: string) => {
        setData("contact", { ...data.contact, [field]: value });
    };

    return (
        <div className="p-8 box-border min-h-screen">
            <Head title="Crear Cotización" />

            <div className="flex gap-4 items-center mb-6">
                <Link href="/invoices" className={buttonVariants({ variant: "tertiary" })}>
                    <ArrowLeft size={20} /> Volver
                </Link>
                <h1 className="text-2xl font-bold">Nueva Cotización</h1>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-6">
                {/* ── Información Básica ── */}
                <Surface className="p-6 flex flex-col gap-6">
                    <h2 className="text-xl font-semibold border-b pb-2">Información Básica</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextField
                            value={data.title}
                            onChange={v => setData("title", v)}
                            isInvalid={!!errors.title}
                            isRequired
                        >
                            <Label>Título / Proyecto</Label>
                            <Input />
                            <FieldError>{errors.title}</FieldError>
                        </TextField>

                        <TextField
                            value={data.number}
                            onChange={v => setData("number", v)}
                            isInvalid={!!errors.number}
                            isRequired
                        >
                            <Label>Número de Cotización</Label>
                            <Input />
                            <FieldError>{errors.number}</FieldError>
                        </TextField>

                        <Select
                            selectedKey={data.client_id || null}
                            onSelectionChange={key => setData("client_id", String(key))}
                            isInvalid={!!errors.client_id}
                            isRequired
                        >
                            <Label>Cliente</Label>
                            <Select.Trigger>
                                <Select.Value />
                                <Select.Indicator />
                            </Select.Trigger>
                            <FieldError>{errors.client_id}</FieldError>
                            <Select.Popover>
                                <ListBox>
                                    {clients.map(client => (
                                        <ListBoxItem key={client.id} id={String(client.id)} textValue={client.name}>
                                            {client.name} — {client.company}
                                        </ListBoxItem>
                                    ))}
                                </ListBox>
                            </Select.Popover>
                        </Select>

                        <div className="grid grid-cols-2 gap-2">
                            <TextField
                                type="date"
                                value={data.date}
                                onChange={v => setData("date", v)}
                                isInvalid={!!errors.date}
                                isRequired
                            >
                                <Label>Fecha</Label>
                                <Input />
                                <FieldError>{errors.date}</FieldError>
                            </TextField>

                            <TextField
                                type="date"
                                value={data.expiration_date}
                                onChange={v => setData("expiration_date", v)}
                                isInvalid={!!errors.expiration_date}
                                isRequired
                            >
                                <Label>Expiración</Label>
                                <Input />
                                <FieldError>{errors.expiration_date}</FieldError>
                            </TextField>
                        </div>

                        <TextField
                            className="col-span-1 md:col-span-2"
                            value={data.description}
                            onChange={v => setData("description", v)}
                            isInvalid={!!errors.description}
                            isRequired
                        >
                            <Label>Descripción</Label>
                            <TextArea className="min-h-[80px]" />
                            <FieldError>{errors.description}</FieldError>
                        </TextField>
                    </div>
                </Surface>

                {/* ── Contacto ── */}
                <Surface className="p-6 flex flex-col gap-6">
                    <h2 className="text-xl font-semibold border-b pb-2">Información del Contacto</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <TextField value={data.contact.name} onChange={v => updateContact("name", v)}>
                            <Label>Nombre</Label>
                            <Input />
                        </TextField>
                        <TextField type="email" value={data.contact.email} onChange={v => updateContact("email", v)}>
                            <Label>Correo Electrónico</Label>
                            <Input />
                        </TextField>
                        <TextField value={data.contact.phone} onChange={v => updateContact("phone", v)}>
                            <Label>Teléfono</Label>
                            <Input />
                        </TextField>
                    </div>
                    {errors.contact && <span className="text-red-500 text-sm">{errors.contact}</span>}
                </Surface>

                {/* ── Condiciones ── */}
                <Surface className="p-6 flex flex-col gap-6">
                    <h2 className="text-xl font-semibold border-b pb-2">Condiciones</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <TextField
                            value={data.payment_terms}
                            onChange={v => setData("payment_terms", v)}
                            isInvalid={!!errors.payment_terms}
                            isRequired
                        >
                            <Label>Términos de Pago</Label>
                            <Input />
                            <FieldError>{errors.payment_terms}</FieldError>
                        </TextField>

                        <TextField
                            value={data.delivery_label}
                            onChange={v => setData("delivery_label", v)}
                            isInvalid={!!errors.delivery_label}
                            isRequired
                        >
                            <Label>Etiqueta de Entrega</Label>
                            <Input placeholder="Ej. Días hábiles" />
                            <FieldError>{errors.delivery_label}</FieldError>
                        </TextField>

                        <NumberField
                            value={data.days_delivery}
                            onChange={v => setData("days_delivery", v)}
                            isInvalid={!!errors.days_delivery}
                            isRequired
                            minValue={0}
                        >
                            <Label>Días de Entrega</Label>
                            <NumberField.Group>
                                <NumberField.DecrementButton>−</NumberField.DecrementButton>
                                <NumberField.Input />
                                <NumberField.IncrementButton>+</NumberField.IncrementButton>
                            </NumberField.Group>
                            <FieldError>{errors.days_delivery}</FieldError>
                        </NumberField>
                    </div>

                    <TextField
                        value={data.notes}
                        onChange={v => setData("notes", v)}
                        isInvalid={!!errors.notes}
                    >
                        <Label>Notas adicionales</Label>
                        <TextArea className="min-h-[100px]" />
                        <FieldError>{errors.notes}</FieldError>
                    </TextField>
                </Surface>

                {/* ── Ítems ── */}
                <Surface className="p-6 flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b pb-2">
                        <h2 className="text-xl font-semibold">Ítems de Cotización</h2>
                        <Button type="button" variant="secondary" size="sm" onPress={addItem}>
                            <Plus size={16} /> Agregar Ítem
                        </Button>
                    </div>

                    {typeof errors.items === 'string' && (
                        <span className="text-red-500 text-sm">{errors.items}</span>
                    )}

                    <div className="flex flex-col gap-4">
                        {data.items.map((item, index) => (
                            <div key={index} className="flex gap-4 items-start border p-4 rounded-lg">
                                <div className="flex-1">
                                    <TextField
                                        value={item.description}
                                        onChange={v => updateItem(index, "description", v)}
                                        isInvalid={!!errors[`items.${index}.description`]}
                                        isRequired
                                    >
                                        <Label>Descripción</Label>
                                        <Input />
                                        <FieldError>{errors[`items.${index}.description`]}</FieldError>
                                    </TextField>
                                </div>
                                <div className="w-24">
                                    <NumberField
                                        value={item.quantity}
                                        onChange={v => updateItem(index, "quantity", v)}
                                        isInvalid={!!errors[`items.${index}.quantity`]}
                                        isRequired
                                        minValue={0}
                                    >
                                        <Label>Cantidad</Label>
                                        <NumberField.Group>
                                            <NumberField.Input />
                                        </NumberField.Group>
                                        <FieldError>{errors[`items.${index}.quantity`]}</FieldError>
                                    </NumberField>
                                </div>
                                <div className="w-32">
                                    <NumberField
                                        value={item.unit_price}
                                        onChange={v => updateItem(index, "unit_price", v)}
                                        isInvalid={!!errors[`items.${index}.unit_price`]}
                                        isRequired
                                        minValue={0}
                                        formatOptions={{ style: "decimal", minimumFractionDigits: 2 }}
                                    >
                                        <Label>Precio Unit.</Label>
                                        <NumberField.Group>
                                            <NumberField.Input />
                                        </NumberField.Group>
                                        <FieldError>{errors[`items.${index}.unit_price`]}</FieldError>
                                    </NumberField>
                                </div>
                                <div className="w-24">
                                    <NumberField
                                        value={item.percent_discount}
                                        onChange={v => updateItem(index, "percent_discount", v)}
                                        isInvalid={!!errors[`items.${index}.percent_discount`]}
                                        minValue={0}
                                        maxValue={100}
                                    >
                                        <Label>Desc. %</Label>
                                        <NumberField.Group>
                                            <NumberField.Input />
                                        </NumberField.Group>
                                        <FieldError>{errors[`items.${index}.percent_discount`]}</FieldError>
                                    </NumberField>
                                </div>
                                <div className="w-10 flex items-center justify-center pt-6">
                                    <Button
                                        isIconOnly
                                        variant="danger"
                                        type="button"
                                        onPress={() => removeItem(index)}
                                        isDisabled={data.items.length === 1}
                                    >
                                        <Trash size={16} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Surface>

                <div className="flex justify-end mb-8">
                    <Button type="submit" variant="primary">
                        Guardar Cotización
                    </Button>
                </div>
            </form>
        </div>
    );
}
