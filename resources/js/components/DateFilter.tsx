import { Button, Calendar, DateField, DatePicker, DateRangePicker, Label, RangeCalendar, Surface, Tab, TabList, TabPanel, Tabs } from "@heroui/react";
import { router } from "@inertiajs/react";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CalendarDate } from "@internationalized/date";

interface Props {
    filters?: {
        search?: string;
        date?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function DateFilter({ filters }: Props) {
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState("single");
    const [date, setDate] = useState<CalendarDate | null>(null);
    const [range, setRange] = useState<{ start: CalendarDate | null; end: CalendarDate | null }>({ start: null, end: null });
    const ref = useRef<HTMLDivElement>(null);

    const currentSearch = filters?.search || "";

    useEffect(() => {
        if (!open) return;

        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handler);

        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    const clearFilters = () => {
        setDate(null);
        setRange({ start: null, end: null });
        setOpen(false);
        router.get("/invoices", { search: currentSearch }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const applySingleDate = () => {
        if (!date) return;
        setOpen(false);
        router.get("/invoices", { search: currentSearch, date: date.toString() }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const applyRange = () => {
        if (!range.start || !range.end) return;
        setOpen(false);
        router.get(
            "/invoices",
            { search: currentSearch, start_date: range.start.toString(), end_date: range.end.toString() },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    return (
        <div className="relative inline-block" ref={ref}>
            <Button variant="secondary" onPress={() => setOpen((current) => !current)}>
                <CalendarIcon size={16} /> Filtrar por Fecha
            </Button>

            {open && (
                <Surface className="absolute top-full left-0 z-50 mt-2 min-w-[360px] p-4 shadow-xl">
                    <Tabs selectedKey={tab} onSelectionChange={(key) => setTab(String(key))}>
                        <TabList className="mb-4 w-full">
                            <Tab id="single" className="flex-1">Fecha Exacta</Tab>
                            <Tab id="range" className="flex-1">Rango</Tab>
                        </TabList>

                        <TabPanel id="single" className="flex flex-col gap-3">
                            <DatePicker value={date} onChange={setDate} className="w-full" name="invoice-date">
                                <Label>Seleccionar fecha</Label>
                                <DateField.Group fullWidth>
                                    <DateField.Input>
                                        {(segment) => <DateField.Segment segment={segment} />}
                                    </DateField.Input>
                                    <DateField.Suffix>
                                        <DatePicker.Trigger>
                                            <DatePicker.TriggerIndicator />
                                        </DatePicker.Trigger>
                                    </DateField.Suffix>
                                </DateField.Group>
                                <DatePicker.Popover>
                                    <Calendar aria-label="Fecha exacta">
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
                                                {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                                            </Calendar.GridHeader>
                                            <Calendar.GridBody>
                                                {(calendarDate) => <Calendar.Cell date={calendarDate} />}
                                            </Calendar.GridBody>
                                        </Calendar.Grid>
                                        <Calendar.YearPickerGrid>
                                            <Calendar.YearPickerGridBody>
                                                {({ year }) => <Calendar.YearPickerCell year={year} />}
                                            </Calendar.YearPickerGridBody>
                                        </Calendar.YearPickerGrid>
                                    </Calendar>
                                </DatePicker.Popover>
                            </DatePicker>

                            <div className="flex justify-between items-center gap-2">
                                <Button size="sm" variant="tertiary" onPress={clearFilters}>
                                    Limpiar
                                </Button>
                                <Button size="sm" variant="primary" onPress={applySingleDate}>
                                    Aplicar
                                </Button>
                            </div>
                        </TabPanel>

                        <TabPanel id="range" className="flex flex-col gap-3">
                            <DateRangePicker
                                className="w-full"
                                value={range.start && range.end ? { start: range.start, end: range.end } : null}
                                onChange={(value) => setRange({ start: value?.start ?? null, end: value?.end ?? null })}
                                name="invoice-range"
                            >
                                <Label>Rango de fechas</Label>
                                <DateField.Group fullWidth>
                                    <DateField.Input slot="start">
                                        {(segment) => <DateField.Segment segment={segment} />}
                                    </DateField.Input>
                                    <DateRangePicker.RangeSeparator> - </DateRangePicker.RangeSeparator>
                                    <DateField.Input slot="end">
                                        {(segment) => <DateField.Segment segment={segment} />}
                                    </DateField.Input>
                                    <DateField.Suffix>
                                        <DateRangePicker.Trigger>
                                            <DateRangePicker.TriggerIndicator />
                                        </DateRangePicker.Trigger>
                                    </DateField.Suffix>
                                </DateField.Group>
                                <DateRangePicker.Popover>
                                    <RangeCalendar aria-label="Rango de fechas">
                                        <RangeCalendar.Header>
                                            <RangeCalendar.YearPickerTrigger>
                                                <RangeCalendar.YearPickerTriggerHeading />
                                                <RangeCalendar.YearPickerTriggerIndicator />
                                            </RangeCalendar.YearPickerTrigger>
                                            <RangeCalendar.NavButton slot="previous" />
                                            <RangeCalendar.NavButton slot="next" />
                                        </RangeCalendar.Header>
                                        <RangeCalendar.Grid>
                                            <RangeCalendar.GridHeader>
                                                {(day) => <RangeCalendar.HeaderCell>{day}</RangeCalendar.HeaderCell>}
                                            </RangeCalendar.GridHeader>
                                            <RangeCalendar.GridBody>
                                                {(calendarDate) => <RangeCalendar.Cell date={calendarDate} />}
                                            </RangeCalendar.GridBody>
                                        </RangeCalendar.Grid>
                                        <RangeCalendar.YearPickerGrid>
                                            <RangeCalendar.YearPickerGridBody>
                                                {({ year }) => <RangeCalendar.YearPickerCell year={year} />}
                                            </RangeCalendar.YearPickerGridBody>
                                        </RangeCalendar.YearPickerGrid>
                                    </RangeCalendar>
                                </DateRangePicker.Popover>
                            </DateRangePicker>

                            <div className="flex justify-between items-center gap-2">
                                <Button size="sm" variant="tertiary" onPress={clearFilters}>
                                    Limpiar
                                </Button>
                                <Button size="sm" variant="primary" onPress={applyRange}>
                                    Aplicar
                                </Button>
                            </div>
                        </TabPanel>
                    </Tabs>
                </Surface>
            )}
        </div>
    );
}
