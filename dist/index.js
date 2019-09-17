"use strict";
console.log('inicio');
class loan {
    constructor() {
        this.dateSimulate = new Date();
        this.dateFirstPay = loan.dateAddMonth(new Date(), 1);
        this.valueLoan = 0;
        this.valueInterest = 4.5;
        this.valueIOF = 0.0082;
        this.valueIOFAdd = 0.38;
        this.valueTAC = 0;
        this.installments = 10;
        this.datePayment = (installment) => loan.dateAddMonth(this.dateFirstPay, installment);
        this.calcIofNoAdjust = () => {
            let valueFunded = this.valueLoan;
            let calcIofNoAdjustAdd = valueFunded * this.taxIOFAdd;
            let exp = 1;
            let baseIof = 0;
            let cursor = this.installments;
            let ret = 0;
            let installmentValue = loan.valueCalcInstallment(valueFunded, this.taxInterest, this.installments);
            let dayPayment = loan.dateAddMonth(this.dateStartLoan, this.installments);
            do {
                baseIof = installmentValue / Math.pow(1 + this.taxInterest, exp);
                let daysToPayment = loan.daysBetweenDates(this.dateStartLoan, dayPayment);
                if (daysToPayment > 365)
                    daysToPayment = 365;
                let valueIOFInstallment = baseIof * daysToPayment * (this.taxIOF);
                ret += valueIOFInstallment;
                exp++;
                cursor--;
                dayPayment = loan.dateAddMonth(this.dateStartLoan, this.installments + 1 - exp);
            } while (cursor > 0);
            ret = ret + calcIofNoAdjustAdd;
            ret = (valueFunded /
                (1 - ret / valueFunded)) - valueFunded;
            return ret;
        };
    }
    ;
    get dateStartLoan() { return loan.dateAddDays(this.dateSimulate, this.daysAjust); }
    get taxInterest() { return this.valueInterest / 100; }
    get taxIOF() { return this.valueIOF / 100; }
    get taxIOFAdd() { return this.valueIOFAdd / 100; }
    get taxTAC() { return this.valueTAC / 100; }
    get daysAjust() {
        return loan.daysBetweenDates(loan.dateAddMonth(this.dateSimulate, 1), this.dateFirstPay);
    }
}
loan.taxYearToMonth = (tax) => Math.pow((1 + tax), (1 / 12)) - 1;
loan.taxMonthToYear = (tax) => Math.pow((1 + tax), 12) - 1;
loan.taxMonthToDay = (tax) => Math.pow((1 + tax), (1 / 30)) - 1;
loan.taxDayToMonth = (tax) => Math.pow((1 + tax), 30) - 1;
loan.valueCalcInstallment = (capital, taxInterest, installments) => capital *
    ((Math.pow(taxInterest + 1, installments)) * taxInterest) /
    (Math.pow(taxInterest + 1, installments) - 1);
loan.valueRound = (value, decimalPlaces = 2) => parseFloat(value.toFixed(decimalPlaces));
loan.dateClearTime = (date) => new Date(date.toISOString().substr(0, 10));
loan.daysBetweenDates = (date1, date2) => {
    let now = loan.dateClearTime(date2);
    let past = loan.dateClearTime(date1);
    let diff = now.getTime() - past.getTime();
    let days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
};
loan.dateAddDays = (date, days) => {
    var result = loan.dateClearTime(date);
    result.setDate(result.getDate() + days);
    return result;
};
loan.dateAddMonth = (date, month) => {
    let swp = loan.dateClearTime(date);
    swp.setMonth(swp.getMonth() + month);
    loan.dateClearTime(swp);
    return swp;
};
let x = new loan();
x.dateSimulate = new Date('2019-09-17T23:00:00.000Z');
x.dateFirstPay = new Date('2019-10-30T00:00:01.001Z');
x.valueLoan = 50000;
x.valueInterest = 3.25;
x.installments = 4;
console.log('4\t x 511,80 \t---', loan.valueRound(x.calcIofNoAdjust()) / 511.80, loan.valueRound(x.calcIofNoAdjust()));
x.installments = 8;
console.log('8\t x 784,21 \t---', loan.valueRound(x.calcIofNoAdjust()) / 784.21, loan.valueRound(x.calcIofNoAdjust()));
x.installments = 10;
console.log('10\t x 925,60 \t---', loan.valueRound(x.calcIofNoAdjust()) / 925.60, loan.valueRound(x.calcIofNoAdjust()));
x.installments = 11;
console.log('11\t x 997,79 \t---', loan.valueRound(x.calcIofNoAdjust()) / 997.79, loan.valueRound(x.calcIofNoAdjust()));
x.installments = 12;
console.log('12\t x 1070,65 \t---', loan.valueRound(x.calcIofNoAdjust()) / 1070.65, loan.valueRound(x.calcIofNoAdjust()));
x.installments = 13;
console.log('13\t x 1132,35 \t---', loan.valueRound(x.calcIofNoAdjust()) / 1132.35, loan.valueRound(x.calcIofNoAdjust()));
x.installments = 15;
console.log('15\t x 1231,04 \t---', loan.valueRound(x.calcIofNoAdjust()) / 1231.04, loan.valueRound(x.calcIofNoAdjust()));
x.installments = 20;
console.log('20\t x 1390,79 \t---', loan.valueRound(x.calcIofNoAdjust()) / 1390.79, loan.valueRound(x.calcIofNoAdjust()));
x.installments = 24;
console.log('24\t x 1469,83 \t---', loan.valueRound(x.calcIofNoAdjust()) / 1469.83, loan.valueRound(x.calcIofNoAdjust()));
//# sourceMappingURL=index.js.map