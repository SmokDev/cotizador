import { Head, Link } from '@inertiajs/react';
import { Surface, SearchField, Button } from "@heroui/react"
import { buttonVariants } from '@heroui/styles';
import { Plus, Calendar } from "lucide-react"
import { InvoicesTable } from '@/components/InvoicesTable';

// Si prefieres usar la interfaz de types/invoice.ts en lugar de `any`, puedes importarla.
interface Props {
  invoices: any[];
}

export default function Index({ invoices }: Props) {

  return (
    <div className="p-8 h-screen box-border">
      <Head title="Cotizaciones" />

      <Surface variant="default" className='flex flex-col gap-4 h-full box-border'>

        <div className="flex justify-between items-center grow-0">
          <div className='flex gap-2'>
            <SearchField name="search">
              <SearchField.Group>
                <SearchField.SearchIcon />
                <SearchField.Input className="w-[280px]" placeholder="Buscar cotización..." />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
            <Button variant='secondary'>
              <Calendar /> Filtrar por Fecha
            </Button>
          </div>
          <Link href="/invoices/create" className={buttonVariants({ variant: "primary" })}><Plus />Crear Cotización</Link>
        </div>

        <div className='grow min-h-0'>
           <InvoicesTable invoices={invoices.map((invoice) => ({...invoice, date: new Date(invoice.date)}))} />
        </div>
        

      </Surface>
    </div>
  );
}
