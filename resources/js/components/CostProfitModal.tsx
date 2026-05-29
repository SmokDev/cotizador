import {
    Button,
    TextField,
    Input,
    Label,
    NumberField,
    Surface,
} from "@heroui/react";
import { Plus, Trash } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { formatCurrency } from "../utils/helpers";

interface Spent {
    name: string;
    quantity: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (spents: Spent[], utility: number) => void;
    onClear?: () => void;
    initialSpents?: Spent[];
    initialUtility?: number;
    hasLockedPrice?: boolean;
}

export default function CostProfitModal({
    isOpen,
    onClose,
    onConfirm,
    onClear,
    initialSpents,
    initialUtility,
    hasLockedPrice,
    quantity = 1,
}: Props) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [spents, setSpents] = useState<Spent[]>(
        initialSpents?.length
            ? initialSpents.map((s) => ({ ...s }))
            : [{ name: "", quantity: 0 }],
    );
    const [utility, setUtility] = useState(initialUtility ?? 20);

    useEffect(() => {
        const el = dialogRef.current;
        if (!el) return;
        if (isOpen && !el.open) el.showModal();
        if (!isOpen && el.open) el.close();
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setSpents(
                initialSpents?.length
                    ? initialSpents.map((s) => ({ ...s }))
                    : [{ name: "", quantity: 0 }],
            );
            setUtility(initialUtility ?? 20);
        }
    }, [isOpen]);

    const totalSpents = spents.reduce(
        (acc, s) => acc + (Number(s.quantity) || 0),
        0,
    );
    const totalWithUtility = totalSpents * (1 + utility / 100);
    const unitPrice =
        quantity > 0 ? totalWithUtility / quantity : totalWithUtility;

    const updateSpent = (
        index: number,
        field: keyof Spent,
        value: string | number,
    ) => {
        const next = spents.map((s, i) =>
            i === index ? { ...s, [field]: value } : s,
        );
        setSpents(next);
    };

    const addSpent = () => setSpents([...spents, { name: "", quantity: 0 }]);

    const removeSpent = (index: number) => {
        if (spents.length <= 1) return;
        setSpents(spents.filter((_, i) => i !== index));
    };

    const handleConfirm = () => {
        const valid = spents.filter(
            (s) => s.name.trim() && Number(s.quantity) > 0,
        );
        onConfirm(valid.length ? valid : spents, utility);
        dialogRef.current?.close();
    };

    return (
        <dialog
            ref={dialogRef}
            onClose={onClose}
            className="rounded-xl shadow-2xl border-0 p-0 w-full max-w-2xl backdrop:bg-black/40 fixed inset-0 m-auto"
        >
            <div className="bg-white rounded-xl overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b">
                    <h2 className="text-lg font-bold">
                        Cálculo de Precio por Gastos + Utilidad
                    </h2>
                    <form method="dialog">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="tertiary"
                            type="submit"
                        >
                            ✕
                        </Button>
                    </form>
                </div>

                <div className="p-5 flex flex-col gap-4 max-h-[60vh] overflow-y-auto">
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-semibold">
                                Gastos Operativos
                            </h3>
                            <Button
                                size="sm"
                                variant="secondary"
                                onPress={addSpent}
                            >
                                <Plus size={14} /> Agregar Gasto
                            </Button>
                        </div>

                        {spents.map((spent, i) => (
                            <div key={i} className="flex gap-2 items-start">
                                <div className="flex-1">
                                    <TextField
                                        value={spent.name}
                                        onChange={(v) =>
                                            updateSpent(i, "name", v)
                                        }
                                    >
                                        <Label>Concepto</Label>
                                        <Input placeholder="Ej. Material, Mano de obra" />
                                    </TextField>
                                </div>
                                <div className="w-full sm:w-44">
                                    <NumberField
                                        value={spent.quantity}
                                        onChange={(v) =>
                                            updateSpent(i, "quantity", v)
                                        }
                                        minValue={0}
                                        formatOptions={{
                                            style: "decimal",
                                            minimumFractionDigits: 2,
                                        }}
                                    >
                                        <Label>Monto $</Label>
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
                                <div className="w-10 flex items-end pb-2">
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        variant="danger"
                                        onPress={() => removeSpent(i)}
                                        isDisabled={spents.length === 1}
                                    >
                                        <Trash size={14} />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="w-full sm:w-48">
                        <NumberField
                            value={utility}
                            onChange={(v) => setUtility(v)}
                            minValue={0}
                            maxValue={1000}
                        >
                            <Label>% Utilidad</Label>
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

                    <Surface
                        variant="secondary"
                        className="p-4 flex flex-col gap-2"
                    >
                        <div className="flex justify-between text-sm">
                            <span className="font-semibold">Costo Total:</span>
                            <span className="font-bold">
                                ${formatCurrency(totalSpents)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-semibold">
                                Utilidad ({utility}%):
                            </span>
                            <span className="font-bold">
                                ${formatCurrency(totalSpents * (utility / 100))}
                            </span>
                        </div>
                        <hr className="my-1 border-border" />
                        <div className="flex justify-between text-sm">
                            <span className="font-semibold">
                                Total con Utilidad:
                            </span>
                            <span className="font-bold">
                                ${formatCurrency(totalWithUtility)}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="font-semibold">Cantidad:</span>
                            <span className="font-bold">{quantity}</span>
                        </div>
                        <hr className="my-1 border-border" />
                        <div className="flex justify-between text-base">
                            <span className="font-bold">Precio Unitario:</span>
                            <span className="font-bold text-accent">
                                ${formatCurrency(unitPrice)}
                            </span>
                        </div>
                    </Surface>
                </div>

                <div className="flex justify-end gap-2 p-5 border-t">
                    <form method="dialog">
                        <Button variant="tertiary" type="submit">
                            Cancelar
                        </Button>
                    </form>
                    {hasLockedPrice && onClear && (
                        <Button
                            variant="danger"
                            onPress={() => {
                                onClear();
                                dialogRef.current?.close();
                            }}
                        >
                            Limpiar
                        </Button>
                    )}
                    <Button variant="primary" onPress={handleConfirm}>
                        Aplicar
                    </Button>
                </div>
            </div>
        </dialog>
    );
}
