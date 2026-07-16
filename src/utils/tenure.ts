export type DateParts = { year: number; month: number; day?: number };

type RoleDates = { start: DateParts; end?: DateParts | null };

function toDate({ year, month, day = 1 }: DateParts): Date {
    return new Date(year, month, day);
}

function formatTenure(start: Date, end: Date): string {
    let months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());

    if (end.getDate() >= start.getDate()) {
        months += 1;
    }

    const years = Math.floor(months / 12);
    const rem = months % 12;

    const parts: string[] = [];
    if (years > 0) parts.push(`${years} yr${years === 1 ? "" : "s"}`);
    if (rem > 0) parts.push(`${rem} mo`);
    if (parts.length === 0) parts.push("1 mo");

    return parts.join(" ");
}

/** Duration from a single start/end range; end omitted means today. */
export function tenureFromRange(start: DateParts, end?: DateParts | null): string {
    return formatTenure(toDate(start), end ? toDate(end) : new Date());
}

/** Duration spanning the earliest start and latest end across roles. */
export function tenureFromRoles(roles: RoleDates[]): string {
    const earliest = roles.reduce(
        (min, role) => Math.min(min, toDate(role.start).getTime()),
        Infinity,
    );
    const latest = roles.reduce(
        (max, role) =>
            Math.max(max, role.end ? toDate(role.end).getTime() : Date.now()),
        -Infinity,
    );

    return formatTenure(new Date(earliest), new Date(latest));
}
