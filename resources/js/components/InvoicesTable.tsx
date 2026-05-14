import { Table } from "@heroui/react";
import { Link } from "@inertiajs/react";
import { Button } from "@heroui/react";
import { Eye, Pencil, Trash, ArrowDown } from "lucide-react";
import { Invoice } from "../types/invoice";

import { calculatorTotal, calculatorPrice } from "../utils/calculator";

export function InvoicesTableRow({ invoice}: { invoice: any}) {
    const result = calculatorTotal(invoice.items.map((item: any) => calculatorPrice(item.quantity, item.unit_price, item.percent_discount)));
    return (
        <Table.Row>
          <Table.Cell className="w-30 text-left">{String(invoice.id).padStart(4, "0")}</Table.Cell>
          <Table.Cell><div className="flex flex-col">
              <span className="text-xs">{invoice.client.name}</span>
              <span className="text-xs text-muted">{invoice.client.company}</span>
          </div></Table.Cell>
          <Table.Cell>{invoice.title}</Table.Cell>
          <Table.Cell className="w-30 text-center">{invoice.date.toLocaleDateString()}</Table.Cell>
          <Table.Cell className="w-30 text-center">${result.total.toFixed(2)}</Table.Cell>
          <Table.Cell className="w-40">
            <div className="flex gap-1 justify-end">
              <Link href={`/invoices/${invoice.id}`}><Button isIconOnly size="sm" variant="tertiary"><Eye /></Button></Link>
              <Link href={`/invoices/${invoice.id}/pdf`}><Button isIconOnly size="sm" variant="tertiary"><ArrowDown /></Button></Link>
              <Link href={`/invoices/${invoice.id}/edit`}><Button isIconOnly size="sm" variant="tertiary"><Pencil /></Button></Link>
              <Link href={`/invoices/${invoice.id}/delete`}><Button isIconOnly size="sm" variant="danger-soft"><Trash /></Button></Link>
            </div>
          </Table.Cell>
        </Table.Row>
    );
}

export function InvoicesTable({ invoices }: { invoices: (Invoice & {id: number})[] }) {
    return (
        <Table variant="secondary" className="h-full">
          <Table.ScrollContainer className="h-full">
            <Table.Content aria-label="Cotizaciones" className="min-w-[600px]">
              <Table.Header className="sticky top-0 z-10">
                <Table.Column isRowHeader className="w-30 text-left">#</Table.Column>
                <Table.Column>Cliente</Table.Column>
                <Table.Column>Titulo</Table.Column>
                <Table.Column className="w-30 text-center">Fecha</Table.Column>
                <Table.Column className="w-30 text-center">Total</Table.Column>
                <Table.Column className="w-40 text-right">Acciones</Table.Column>
              </Table.Header>
              <Table.Body>
                {
                  invoices.map((invoice) => (
                    <InvoicesTableRow key={invoice.id} invoice={invoice} />
                  ))
                }
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
    );
}