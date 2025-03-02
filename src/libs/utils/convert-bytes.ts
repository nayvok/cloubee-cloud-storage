export function convertBytes(bytes: number): string {
    const units = ['Байт', 'КБ', 'МБ', 'ГБ', 'ТБ'];
    let unitIndex = 0;

    while (bytes >= 1024 && unitIndex < units.length - 1) {
        bytes /= 1024;
        unitIndex++;
    }

    const roundedValue = Math.round(bytes * 10) / 10;

    const value =
        roundedValue % 1 === 0
            ? roundedValue.toString()
            : roundedValue.toFixed(1);
    return `${value} ${units[unitIndex]}`;
}
