import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'creditCardMask'
})
export class CreditCardMaskPipe implements PipeTransform {
    transform(value: string, typeV: string = "normal", visibleDigits: number = 4): string {
        if (typeV === "tel") {
            return value === null ? "" : value.replace(/(\d{2})(\d{4,5})(\d{4})/gm, "($1) $2-$3");
        }
        if (typeV === "cnpj") {
            return value === null ? "" : value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/gm, "$1.$2.$3/$4-$5");
        }
        if (typeV === "cpf") {
            return value === null ? "" : value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/gm, "$1.$2.$3-$4");
        }
        const maskedSection = value.slice(0, -visibleDigits);
        const visibleSection = value.slice(-visibleDigits);
        return maskedSection.replace(/./g, '*') + visibleSection;
    }
}
