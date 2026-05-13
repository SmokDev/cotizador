import { Head, Link } from "@inertiajs/react";
import { Surface, SearchField, Button, Pagination } from "@heroui/react";
import { buttonVariants, paginationVariants } from "@heroui/styles";
import { Plus } from "lucide-react";
import { InvoicesTable } from "@/components/InvoicesTable";
import DateFilter from "@/components/DateFilter";
import { useState, useMemo } from "react";
import { router } from "@inertiajs/react";
import debounce from "lodash/debounce";

function getPaginationRange(first: number, last: number, current: number) {
    const pages = [];

    // límite inferior (2 páginas antes)
    const start = Math.max(first, current - 2);

    // límite superior (2 páginas después)
    const end = Math.min(last, current + 2);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    return pages;
}

// Si prefieres usar la interfaz de types/invoice.ts en lugar de `any`, puedes importarla.
interface Props {
    invoices: {
        data: any[];
        links: any[];
        from: number;
        to: number;
        total: number;
        prev_page_url: string;
        next_page_url: string;
        current_page: number;
        last_page: number;
        path: string;
    };
    filters: {
        search: string;
        date?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function Index({ invoices, filters }: Props) {
    const [search, setSearch] = useState(filters.search);

    const handleSearch = (search: string) => {
        setSearch(search);
        const f: Record<string, string> = { search };
        if (filters?.date) f.date = filters.date;
        if (filters?.start_date) f.start_date = filters.start_date;
        if (filters?.end_date) f.end_date = filters.end_date;
        debouncedSearch(f);
    };

    const debouncedSearch = useMemo(() => debounce(
        (f: Record<string, string>) => {
            router.get("/invoices", f, { preserveState: true, preserveScroll: true, replace: true });
        },
        500,
    ), []);

    return (
        <div className="p-8 h-screen box-border">
            <Head title="Cotizaciones" />

            <Surface
                variant="default"
                className="flex flex-col gap-4 h-full box-border"
            >
                <div className="flex justify-between items-center grow-0">
                    <div className="flex gap-2">
                        <SearchField
                            name="search"
                            onChange={(search) => handleSearch(search)}
                            value={search}
                        >
                            <SearchField.Group>
                                <SearchField.SearchIcon />
                                <SearchField.Input
                                    className="w-[280px]"
                                    placeholder="Buscar cotización..."
                                />
                                <SearchField.ClearButton />
                            </SearchField.Group>
                        </SearchField>
                        <DateFilter filters={filters} />
                    </div>
                    <Link
                        href="/invoices/create"
                        className={buttonVariants({ variant: "primary" })}
                    >
                        <Plus />
                        Crear Cotización
                    </Link>
                </div>

                <div className="grow min-h-0">
                    <InvoicesTable
                        invoices={invoices.data.map((invoice) => ({
                            ...invoice,
                            date: new Date(invoice.date),
                        }))}
                    />
                </div>

                <div className="flex gap-2">
                    {invoices.last_page > 1 && (
                        <Pagination size="sm">
                            <Pagination.Summary>
                                {invoices.from} a {invoices.to} de{" "}
                                {invoices.total}
                            </Pagination.Summary>

                            <Pagination.Content>
                                {/* PREVIOUS */}
                                <Pagination.Item>
                                    {invoices.prev_page_url ? (
                                        <Link
                                            href={
                                                invoices.prev_page_url ||
                                                undefined
                                            }
                                            preserveState
                                            preserveScroll
                                        >
                                            <Pagination.Previous>
                                                <Pagination.PreviousIcon />
                                            </Pagination.Previous>
                                        </Link>
                                    ) : (
                                        <Pagination.Previous isDisabled>
                                            <Pagination.PreviousIcon />
                                        </Pagination.Previous>
                                    )}
                                </Pagination.Item>

                                {getPaginationRange(
                                    1,
                                    invoices.last_page,
                                    invoices.current_page,
                                ).map((page) => (
                                    <Pagination.Item key={page}>
                                        <Link
                                            href={`/invoices?search=${search || ""}&page=${page}`}
                                            preserveState
                                            preserveScroll
                                            replace
                                        >
                                            <Pagination.Link
                                                isActive={
                                                    page ===
                                                    invoices.current_page
                                                }
                                            >
                                                {page}
                                            </Pagination.Link>
                                        </Link>
                                    </Pagination.Item>
                                ))}

                                {/* NEXT */}

                                <Pagination.Item>
                                    {invoices.next_page_url ? (
                                        <Link
                                            href={
                                                invoices.next_page_url ||
                                                undefined
                                            }
                                            preserveState
                                            preserveScroll
                                            replace
                                        >
                                            <Pagination.Next>
                                                <Pagination.NextIcon />
                                            </Pagination.Next>
                                        </Link>
                                    ) : (
                                        <Pagination.Next isDisabled>
                                            <Pagination.NextIcon />
                                        </Pagination.Next>
                                    )}
                                </Pagination.Item>
                            </Pagination.Content>
                        </Pagination>
                    )}
                </div>
            </Surface>
        </div>
    );
}
