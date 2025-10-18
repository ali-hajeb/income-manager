export function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

type DigitString = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export function toFarsiNumber(n: number | string) {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

    return n
        .toString()
        .replace(/\d/g, (x: string) => farsiDigits[x as DigitString]);
}
