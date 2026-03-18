import React, { useState, useMemo } from 'react';
import { Link, Head } from '@inertiajs/react';
import { Button, Card, Chip, Input } from '@heroui/react';
import {
    Plus,
    Search,
    Eye,
    Pencil,
    FileText,
    DollarSign,
    Filter,
    ChevronUp,
    ChevronDown,
    ChevronsUpDown,
} from 'lucide-react';

declare var route: any;

interface Props {
    quotations: any[];
}

type SortField = 'number' | 'client' | 'date' | 'expiration_date' | 'total';
type SortDir = 'asc' | 'desc';

export default function Index({ quotations }: Props) {
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState<SortField>('number');
    const [sortDir, setSortDir] = useState<SortDir>('desc');

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortDir('asc');
        }
    };

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return quotations
            .filter((qt) =>
                String(qt.number).includes(q) ||
                (qt.client?.name ?? '').toLowerCase().includes(q) ||
                (qt.date ?? '').includes(q)
            )
            .sort((a, b) => {
                let valA: any, valB: any;
                if (sortField === 'number')       { valA = Number(a.number);              valB = Number(b.number); }
                else if (sortField === 'client')  { valA = (a.client?.name ?? '').toLowerCase(); valB = (b.client?.name ?? '').toLowerCase(); }
                else if (sortField === 'total')   { valA = Number(a.total);               valB = Number(b.total); }
                else                              { valA = a[sortField] ?? '';             valB = b[sortField] ?? ''; }
                if (valA < valB) return sortDir === 'asc' ? -1 : 1;
                if (valA > valB) return sortDir === 'asc' ?  1 : -1;
                return 0;
            });
    }, [quotations, search, sortField, sortDir]);

    const totalAmount = quotations.reduce((acc, q) => acc + Number(q.total || 0), 0);
    const filteredTotal = filtered.reduce((acc, q) => acc + Number(q.total || 0), 0);

    const fmt = (n: number) =>
        n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Sortable column header
    const SortableHeader = ({
        field,
        label,
        align = 'left',
    }: {
        field: SortField;
        label: string;
        align?: 'left' | 'right';
    }) => {
        const active = sortField === field;
        const Icon = active ? (sortDir === 'asc' ? ChevronUp : ChevronDown) : ChevronsUpDown;
        return (
            <th
                onClick={() => handleSort(field)}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer select-none whitespace-nowrap text-${align}`}
                style={{ color: 'var(--muted)' }}
            >
                <span className={`inline-flex items-center gap-1.5 ${align === 'right' ? 'justify-end w-full' : ''}`}>
                    {label}
                    <Icon
                        size={12}
                        style={{
                            color: active ? 'var(--accent)' : 'var(--muted)',
                            opacity: active ? 1 : 0.5,
                        }}
                    />
                </span>
            </th>
        );
    };

    return (
        <div className="min-h-screen p-6 md:p-10" style={{ background: 'var(--background)' }}>
            <Head title="Quotations" />

            {/* ── Page header ── */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
                    Quotations
                </h1>
                <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
                    Manage and track all your client quotations.
                </p>
            </div>



            {/* ── Main table card ── */}
            <Card>
                {/* Toolbar */}
                <Card.Content
                    className="p-4 border-b flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
                >
                    {/* Search input */}
                    <div className="relative w-full sm:w-72">
                        <Search
                            size={15}
                            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                        />
                        <Input
                            type="text"
                            placeholder="Search by number, client…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm outline-none transition-shadow"
                            variant="bordered"
                        />
                    </div>

                    {/* Create button */}
                    <Link href={route('quotations.create')}>
                        <Button>
                            <Plus size={15} />
                            New Quotation
                        </Button>
                    </Link>
                </Card.Content>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr >
                                <SortableHeader field="number" label="# Quot." />
                                <SortableHeader field="client" label="Client" />
                                <SortableHeader field="date" label="Date" />
                                <SortableHeader field="expiration_date" label="Expires" />
                                <SortableHeader field="total" label="Total" align="right" />
                                <th
                                    className="px-4 py-3 pr-6 text-xs font-semibold uppercase tracking-wider text-right"
                                    style={{ color: 'var(--muted)' }}
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        

                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div
                                                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                                style={{ background: 'var(--surface-secondary)' }}
                                            >
                                                <FileText size={24} style={{ color: 'var(--muted)' }} />
                                            </div>
                                            <p className="font-semibold" style={{ color: 'var(--foreground)' }}>
                                                {search ? 'No matching quotations' : 'No quotations yet'}
                                            </p>
                                            <p className="text-sm" style={{ color: 'var(--muted)' }}>
                                                {search
                                                    ? 'Try adjusting your search term.'
                                                    : 'Create your first quotation to get started.'}
                                            </p>
                                            {!search && (
                                                <Link href={route('quotations.create')}>
                                                    <Button
                                                        
                                                    >
                                                        <Plus size={15} />
                                                        New Quotation
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((quotation, idx) => {
                                    const isExpired =
                                        quotation.expiration_date &&
                                        new Date(quotation.expiration_date) < new Date();

                                    return (
                                        <tr
                                            key={quotation.id}
                                            className="group transition-colors"
                                            style={{
                                                borderBottom:
                                                    idx < filtered.length - 1
                                                        ? '1px solid var(--separator)'
                                                        : 'none',
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.background = 'var(--surface-secondary)')
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.background = 'transparent')
                                            }
                                        >
                                            {/* Number */}
                                            <td className="pl-6 pr-4 py-3.5">
                                                <div className="flex items-center gap-2.5">
                                                    <div
                                                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 tabular-nums"
                                                        style={{
                                                            background:
                                                                'color-mix(in oklch, var(--accent) 12%, transparent)',
                                                            color: 'var(--accent)',
                                                        }}
                                                    >
                                                        {String(quotation.number).slice(-2)}
                                                    </div>
                                                    <span
                                                        className="font-semibold tabular-nums"
                                                        style={{ color: 'var(--foreground)' }}
                                                    >
                                                        #{quotation.number}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Client */}
                                            <td className="px-4 py-3.5">
                                                <p className="font-medium" style={{ color: 'var(--foreground)' }}>
                                                    {quotation.client?.name ?? 'N/A'}
                                                </p>
                                                {quotation.client?.empresa && (
                                                    <p
                                                        className="text-xs mt-0.5 truncate max-w-[180px]"
                                                        style={{ color: 'var(--muted)' }}
                                                    >
                                                        {quotation.client.empresa}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Date */}
                                            <td className="px-4 py-3.5" style={{ color: 'var(--foreground)' }}>
                                                {quotation.date ?? '—'}
                                            </td>

                                            {/* Expiration */}
                                            <td className="px-4 py-3.5">
                                                <Chip
                                                    size="sm"
                                                    className="text-xs font-medium px-2 py-0.5"
                                                    style={{
                                                        background: isExpired
                                                            ? 'color-mix(in oklch, var(--danger) 14%, transparent)'
                                                            : 'color-mix(in oklch, var(--success) 12%, transparent)',
                                                        color: isExpired ? 'var(--danger)' : 'var(--success)',
                                                    }}
                                                >
                                                    <Chip.Label>
                                                        {quotation.expiration_date ?? '—'}
                                                    </Chip.Label>
                                                </Chip>
                                            </td>

                                            {/* Total */}
                                            <td className="px-4 py-3.5 text-right">
                                                <span
                                                    className="font-semibold tabular-nums"
                                                    style={{ color: 'var(--foreground)' }}
                                                >
                                                    ${fmt(Number(quotation.total))}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3.5 pr-6 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        href={route('quotations.show', quotation.id)}
                                                        title="View"
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                                                        style={{ color: 'var(--muted)' }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background = 'color-mix(in oklch, var(--accent) 10%, transparent)';
                                                            e.currentTarget.style.color = 'var(--accent)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = 'transparent';
                                                            e.currentTarget.style.color = 'var(--muted)';
                                                        }}
                                                    >
                                                        <Eye size={15} />
                                                    </Link>
                                                    <Link
                                                        href={route('quotations.edit', quotation.id)}
                                                        title="Edit"
                                                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
                                                        style={{ color: 'var(--muted)' }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background = 'color-mix(in oklch, var(--accent) 10%, transparent)';
                                                            e.currentTarget.style.color = 'var(--accent)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = 'transparent';
                                                            e.currentTarget.style.color = 'var(--muted)';
                                                        }}
                                                    >
                                                        <Pencil size={15} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer summary */}
                {filtered.length > 0 && (
                    <div
                        className="px-6 py-3 border-t flex items-center justify-between text-xs"
                        style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                    >
                        <span>
                            {filtered.length} of {quotations.length} quotation
                            {quotations.length !== 1 ? 's' : ''}
                        </span>
                        <span>
                            Showing total:{' '}
                            <span className="font-semibold" style={{ color: 'var(--foreground)' }}>
                                ${fmt(filteredTotal)}
                            </span>
                        </span>
                    </div>
                )}
            </Card>
        </div>
    );
}
