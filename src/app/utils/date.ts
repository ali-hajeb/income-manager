import moment from "jalali-moment";

export function shamsi(date: string): string {
    return moment(date).format('jYYYY/jMM/jDD');
}

export function shamsiDateTime(date: string): string {
    return moment(date).format('jYYYY/jMM/jDD - HH:MM');
}
