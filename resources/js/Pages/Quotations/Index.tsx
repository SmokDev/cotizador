import { Head, Link } from "@inertiajs/react";
import { Surface, SearchField, Button, Pagination } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import { Plus } from "lucide-react";
import { QuotationsTable } from "@/components/QuotationsTable";
import DateFilter from "@/components/DateFilter";
import { useState, useMemo } from "react";
import { router } from "@inertiajs/react";
import debounce from "lodash/debounce";

function getPaginationRange(first: number, last: number, current: number) {
    const pages = [];
    const start = Math.max(first, current - 2);
    const end = Math.min(last, current + 2);
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
}

interface Props {
    quotations: {
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

export default function Index({ quotations, filters }: Props) {
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
            router.get("/quotations", f, { preserveState: true, preserveScroll: true, replace: true });
        },
        500,
    ), []);

    return (
        <div className="p-4 md:p-8 h-screen box-border">
            <Head title="Cotizaciones" />

            <Surface variant="default" className="flex flex-col gap-4 h-full box-border">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 grow-0">
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <SearchField name="search" onChange={(search) => handleSearch(search)} value={search} className="w-full sm:w-auto">
                            <SearchField.Group>
                                <SearchField.SearchIcon />
                                <SearchField.Input className="w-full sm:w-[280px]" placeholder="Buscar cotización..." />
                                <SearchField.ClearButton />
                            </SearchField.Group>
                        </SearchField>
                        <DateFilter />
                    </div>
                    <Link href="/quotations/create" className={`${buttonVariants({ variant: "primary" })} w-full sm:w-auto justify-center`}>
                        <Plus /> Crear Cotización
                    </Link>
                </div>

                <div className="grow min-h-0 overflow-hidden">
                    <QuotationsTable
                        quotations={quotations.data.map((q: any) => ({
                            ...q,
                            date: new Date(q.date),
                        }))}
                    />
                </div>

                <div className="flex gap-2">
                    {quotations.last_page > 1 && (
                        <Pagination size="sm">
                            <Pagination.Summary>
                                {quotations.from} a {quotations.to} de {quotations.total}
                            </Pagination.Summary>
                            <Pagination.Content>
                                <Pagination.Item>
                                    {quotations.prev_page_url ? (
                                        <Link href={quotations.prev_page_url || undefined} preserveState preserveScroll>
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
                                {getPaginationRange(1, quotations.last_page, quotations.current_page).map((page) => (
                                    <Pagination.Item key={page}>
                                        <Link href={`/quotations?search=${search || ""}&page=${page}`}
                                            preserveState preserveScroll replace>
                                            <Pagination.Link isActive={page === quotations.current_page}>
                                                {page}
                                            </Pagination.Link>
                                        </Link>
                                    </Pagination.Item>
                                ))}
                                <Pagination.Item>
                                    {quotations.next_page_url ? (
                                        <Link href={quotations.next_page_url || undefined} preserveState preserveScroll replace>
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
