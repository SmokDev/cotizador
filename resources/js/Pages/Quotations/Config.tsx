import { useRef, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import {
    Button, Surface, TextField, Input, TextArea, Label,
    ColorField, ColorSwatch,
} from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import { ArrowLeft, Plus, Trash, Save, Upload, XCircle } from "lucide-react";
import axios from "axios";

interface Props {
    config: {
        logo?: string;
        color?: string;
        contact?: { name?: string; email?: string; phone?: string };
        payment_terms?: string[];
    };
}

export default function Config({ config }: Props) {
    const logo = config?.logo || "";
    const color = config?.color || "#b8860b";
    const contact = config?.contact || { name: "", email: "", phone: "" };
    const paymentTerms = config?.payment_terms || [];
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [logoPreview, setLogoPreview] = useState(logo);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [formColor, setFormColor] = useState(color);
    const [formContact, setFormContact] = useState(contact);
    const [terms, setTerms] = useState<string[]>(paymentTerms);
    const [newTerm, setNewTerm] = useState("");
    const [saving, setSaving] = useState(false);

    const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLogoFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const addTerm = () => {
        const t = newTerm.trim();
        if (!t || terms.includes(t)) return;
        setTerms([...terms, t]);
        setNewTerm("");
    };

    const removeTerm = (index: number) => {
        setTerms(terms.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            let logoUrl = logoPreview;

            if (logoFile) {
                const fd = new FormData();
                fd.append("logo", logoFile);
                const res = await axios.post("/config/logo", fd);
                logoUrl = res.data.url;
            }

            router.post("/config", {
                logo: logoUrl,
                color: formColor,
                contact: formContact,
                payment_terms: terms,
            }, {
                onFinish: () => setSaving(false),
                onError: () => setSaving(false),
            });
        } catch {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 flex flex-col">
            <Head title="Configuración" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 md:mb-6">
                <div className="flex items-center gap-3">
                    <Link href="/" className={buttonVariants({ variant: "tertiary" })}>
                        <ArrowLeft size={20} /> Volver
                    </Link>
                    <h1 className="text-xl md:text-2xl font-bold">Configuración de Cotización</h1>
                </div>
                <Button variant="primary" onPress={handleSave} isDisabled={saving}>
                    {saving ? "Guardando..." : <><Save size={16} /> Guardar</>}
                </Button>
            </div>

            <Surface className="p-4 md:p-6 flex flex-col gap-6 w-full flex-1">
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold border-b pb-2">Logo</h2>
                    <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                        {logoPreview && (
                            <div className="relative inline-flex">
                                <img src={logoPreview} alt="Logo" className="h-16 w-auto object-contain border rounded-lg p-1" />
                                <Button isIconOnly size="sm" variant="danger"
                                    className="absolute -top-2 -right-2 min-w-0 h-5 w-5 rounded-full"
                                    onPress={() => { setLogoPreview(""); setLogoFile(null); }}>
                                    <XCircle size={14} />
                                </Button>
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <Button variant="secondary" onPress={() => fileInputRef.current?.click()}>
                                <Upload size={16} /> Seleccionar imagen
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpg,image/jpeg,image/svg+xml"
                                className="hidden"
                                onChange={handleLogoChange}
                            />
                            <p className="text-xs text-gray-400">PNG, JPG o SVG. Máx 2MB.</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold border-b pb-2">Color Principal</h2>
                    <ColorField className="w-full sm:w-[280px]" name="color" value={formColor} onChange={(c) => setFormColor(c ? c.toString("hex") : "#b8860b")}>
                        <Label>Color</Label>
                        <ColorField.Group>
                            <ColorField.Prefix>
                                <ColorSwatch color={formColor ?? undefined} size="xs" />
                            </ColorField.Prefix>
                            <ColorField.Input />
                        </ColorField.Group>
                    </ColorField>
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold border-b pb-2">Información de Contacto</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <TextField value={formContact.name} onChange={v => setFormContact({ ...formContact, name: v })}>
                            <Label>Nombre</Label>
                            <Input />
                        </TextField>
                        <TextField type="email" value={formContact.email} onChange={v => setFormContact({ ...formContact, email: v })}>
                            <Label>Correo Electrónico</Label>
                            <Input />
                        </TextField>
                        <TextField value={formContact.phone} onChange={v => setFormContact({ ...formContact, phone: v })}>
                            <Label>Teléfono</Label>
                            <Input />
                        </TextField>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold border-b pb-2">Formas de Pago</h2>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
                        <TextField value={newTerm} onChange={setNewTerm} className="flex-1">
                            <Label>Nueva forma de pago</Label>
                            <Input placeholder="Ej. 50% Anticipo y 50% Contra Entrega" />
                        </TextField>
                        <div className="sm:pt-6 flex sm:block">
                            <Button isIconOnly size="sm" variant="secondary" onPress={addTerm}>
                                <Plus size={16} />
                            </Button>
                        </div>
                    </div>
                    {terms.length > 0 && (
                        <div className="flex flex-col gap-2">
                            {terms.map((term, i) => (
                                <div key={i} className="flex items-center gap-2 border rounded-lg px-3 py-2">
                                    <span className="flex-1 text-sm">{term}</span>
                                    <Button isIconOnly size="sm" variant="danger" onPress={() => removeTerm(i)}>
                                        <Trash size={14} />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Surface>
        </div>
    );
}
