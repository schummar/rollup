const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$';
const base = 64;

export function toBase64(num: number): string {
	let outStr = '';
	do {
		const curDigit = num % base;
		num = (num / base) | 0;
		outStr = chars[curDigit] + outStr;
	} while (num !== 0);
	return outStr;
}
