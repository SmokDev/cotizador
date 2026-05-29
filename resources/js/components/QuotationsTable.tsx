import { Table } from "@heroui/react";
import { Link } from "@inertiajs/react";
import { Button } from "@heroui/react";
import { Eye, Pencil, Trash, ArrowDown } from "lucide-react";

import { calculatorTotal, calculatorPrice } from "../utils/calculator";

export function QuotationsTableRow({ quotation }: { quotation: any }) {
    const result = calculatorTotal(
        quotation.items.map((item: any) =>
            calculatorPrice(
                item.quantity,
                item.unit_price,
                item.percent_discount,
            ),
        ),
    );
    return (
        <Table.Row>
            <Table.Cell className="w-30 text-left">
                {String(quotation.id).padStart(4, "0")}
            </Table.Cell>
            <Table.Cell>
                <div className="flex flex-col">
                    <span className="text-xs">{quotation.client.name}</span>
                    <span className="text-xs text-muted">
                        {quotation.client.company}
                    </span>
                </div>
            </Table.Cell>
            <Table.Cell>{quotation.title}</Table.Cell>
            <Table.Cell className="w-30 text-center">
                {quotation.date.toLocaleDateString()}
            </Table.Cell>
            <Table.Cell className="w-30 text-center">
                ${result.total.toFixed(2)}
            </Table.Cell>
            <Table.Cell className="w-40">
                <div className="flex gap-1 justify-end">
                    <Link href={`/${quotation.id}`}>
                        <Button isIconOnly size="sm" variant="tertiary">
                            <Eye />
                        </Button>
                    </Link>
                    <Link href={`/${quotation.id}/pdf`}>
                        <Button isIconOnly size="sm" variant="tertiary">
                            <ArrowDown />
                        </Button>
                    </Link>
                    <Link href={`/${quotation.id}/edit`}>
                        <Button isIconOnly size="sm" variant="tertiary">
                            <Pencil />
                        </Button>
                    </Link>
                    <Link href={`/${quotation.id}`} method="delete" as="button">
                        <Button isIconOnly size="sm" variant="danger-soft">
                            <Trash />
                        </Button>
                    </Link>
                </div>
            </Table.Cell>
        </Table.Row>
    );
}

export function QuotationsTable({
    quotations,
}: {
    quotations: ({ id: number })[];
}) {
    return (
        <Table variant="secondary" className="h-full">
            <Table.ScrollContainer className="h-full">
                <Table.Content aria-label="Cotizaciones" className="min-w-150">
                    <Table.Header className="sticky top-0 z-10">
                        <Table.Column isRowHeader className="w-30 text-left">#</Table.Column>
                        <Table.Column>Cliente</Table.Column>
                        <Table.Column>Titulo</Table.Column>
                        <Table.Column className="w-30 text-center">Fecha</Table.Column>
                        <Table.Column className="w-30 text-center">Total</Table.Column>
                        <Table.Column className="w-40 text-right">Acciones</Table.Column>
                    </Table.Header>
                    <Table.Body>
                        {quotations.map((quotation) => (
                            <QuotationsTableRow
                                key={quotation.id}
                                quotation={quotation}
                            />
                        ))}
                    </Table.Body>
                </Table.Content>
            </Table.ScrollContainer>
        </Table>
    );
}