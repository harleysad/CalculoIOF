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
        this.calcIofWithAdjust = () => {
            let valueFunded = this.valueLoan;
            let calcIofNoAdjustAdd = valueFunded * this.taxIOFAdd;
            let aux3 = (Math.pow(this.taxInterest + 1, (this.daysAjust / 30 + 1))) - 1;
            let aux4 = Math.pow(this.taxInterest + 1, (this.daysAjust / 30));
            let exp = 1;
            let cursor = 1;
            let baseIof = 0;
            let ret = 0;
            let valueAux = valueFunded * aux4;
            let installmentValue = loan.valueCalcInstallment(valueAux, this.taxInterest, this.installments);
            let dayPayment = loan.dateAddMonth(this.dateStartLoan, this.installments);
            do {
                if (cursor == this.installments)
                    baseIof = installmentValue - (valueFunded * aux3);
                else
                    baseIof = installmentValue / (Math.pow(1 + this.taxInterest, exp));
                let daysToPayment = loan.daysBetweenDates(this.dateSimulate, dayPayment);
                if (daysToPayment > 365)
                    daysToPayment = 365;
                let valueIOFInstallment = baseIof * daysToPayment * (this.taxIOF);
                ret += valueIOFInstallment;
                dayPayment = loan.dateAddMonth(this.dateStartLoan, this.installments - exp);
                exp++;
                cursor++;
            } while (cursor <= this.installments);
            ret = ret + calcIofNoAdjustAdd;
            ret = (valueFunded /
                (1 - ret / valueFunded)) - valueFunded;
            return ret;
        };
        this.testeCalc = () => {
            if (this.daysAjust > 0)
                return this.calcIofWithAdjust();
            else
                return this.calcIofNoAdjust();
        };
    }
    ;
    get dateStartLoan() { return loan.dateAddMonth(loan.dateClearTime(this.dateFirstPay), -1); }
    get taxInterest() { return this.valueInterest / 100; }
    get taxIOF() { return this.valueIOF / 100; }
    get taxIOFAdd() { return this.valueIOFAdd / 100; }
    get taxTAC() { return this.valueTAC / 100; }
    get daysAjust() {
        return loan.daysBetweenDates(loan.dateAddMonth(loan.dateClearTime(this.dateSimulate), 1), loan.dateClearTime(this.dateFirstPay));
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
    date1 = loan.dateClearTime(date1);
    date2 = loan.dateClearTime(date2);
    let now = loan.dateClearTime(date2);
    let past = loan.dateClearTime(date1);
    let diff = now.getTime() - past.getTime();
    let days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
};
loan.dateAddDays = (date, days) => {
    date = loan.dateClearTime(date);
    var result = loan.dateClearTime(date);
    result.setDate(result.getDate() + days);
    return result;
};
loan.dateAddMonth = (date, month) => {
    date = loan.dateClearTime(date);
    // var swp = loan.dateClearTime(date);
    // var years = Math.floor(month / 11);
    // var months = month - (years * 11);
    // if (years) swp.setFullYear(swp.getFullYear() + years);
    // if (months) swp.setMonth(swp.getMonth() + months);
    // if (swp.getDate() !== date.getDate())
    //     console.log(date, month, swp);
    // return swp;
    let swp = loan.dateClearTime(date);
    swp.setMonth(swp.getMonth() + month, swp.getDate());
    loan.dateClearTime(swp);
    // if (swp.getDate() !== date.getDate())
    //     console.log(date, month, swp);
    loan.dateClearTime(swp);
    return swp;
};
function testeNoAdj(x) {
    x.installments = 4;
    console.log('4\t x 511,80 \t---', loan.valueRound(x.testeCalc()) / 511.80, loan.valueRound(x.testeCalc()));
    x.installments = 8;
    console.log('8\t x 784,21 \t---', loan.valueRound(x.testeCalc()) / 784.21, loan.valueRound(x.testeCalc()));
    x.installments = 10;
    console.log('10\t x 925,60 \t---', loan.valueRound(x.testeCalc()) / 925.60, loan.valueRound(x.testeCalc()));
    x.installments = 11;
    console.log('11\t x 997,79 \t---', loan.valueRound(x.testeCalc()) / 997.79, loan.valueRound(x.testeCalc()));
    x.installments = 12;
    console.log('12\t x 1070,65 \t---', loan.valueRound(x.testeCalc()) / 1070.65, loan.valueRound(x.testeCalc()));
    x.installments = 13;
    console.log('13\t x 1132,35 \t---', loan.valueRound(x.testeCalc()) / 1132.35, loan.valueRound(x.testeCalc()));
    x.installments = 15;
    console.log('15\t x 1231,04 \t---', loan.valueRound(x.testeCalc()) / 1231.04, loan.valueRound(x.testeCalc()));
    x.installments = 20;
    console.log('20\t x 1390,79 \t---', loan.valueRound(x.testeCalc()) / 1390.79, loan.valueRound(x.testeCalc()));
    x.installments = 24;
    console.log('24\t x 1469,83 \t---', loan.valueRound(x.testeCalc()) / 1469.83, loan.valueRound(x.testeCalc()));
    console.log('******************************************************************');
}
function testeWithAdj(x) {
    x.installments = 4;
    console.log(4, 616.29 / loan.valueRound(x.testeCalc()), 616.29, loan.valueRound(x.testeCalc()));
    x.installments = 8;
    console.log(8, 895.54 / loan.valueRound(x.testeCalc()), 895.54, loan.valueRound(x.testeCalc()));
    x.installments = 10;
    console.log(10, 1041.10 / loan.valueRound(x.testeCalc()), 1041.10, loan.valueRound(x.testeCalc()));
    x.installments = 12;
    console.log(12, 1180.43 / loan.valueRound(x.testeCalc()), 1180.43, loan.valueRound(x.testeCalc()));
    x.installments = 14;
    console.log(14, 1282.25 / loan.valueRound(x.testeCalc()), 1282.25, loan.valueRound(x.testeCalc()));
    x.installments = 16;
    console.log(16, 1358.52 / loan.valueRound(x.testeCalc()), 1358.52, loan.valueRound(x.testeCalc()));
    x.installments = 18;
    console.log(18, 1417.67 / loan.valueRound(x.testeCalc()), 1417.67, loan.valueRound(x.testeCalc()));
    x.installments = 20;
    console.log(20, 1464.80 / loan.valueRound(x.testeCalc()), 1464.80, loan.valueRound(x.testeCalc()));
    x.installments = 22;
    console.log(22, 1503.17 / loan.valueRound(x.testeCalc()), 1503.17, loan.valueRound(x.testeCalc()));
    console.log('******************************************************************');
}
function testeWithAdj2(x) {
    x.installments = 4;
    console.log(4, 569.06 / loan.valueRound(x.testeCalc()), 569.06, loan.valueRound(x.testeCalc()));
    x.installments = 8;
    console.log(8, 845.34 / loan.valueRound(x.testeCalc()), 845.34, loan.valueRound(x.testeCalc()));
    x.installments = 10;
    console.log(10, 989.18 / loan.valueRound(x.testeCalc()), 989.18, loan.valueRound(x.testeCalc()));
    x.installments = 12;
    console.log(12, 1131.13 / loan.valueRound(x.testeCalc()), 1131.13, loan.valueRound(x.testeCalc()));
    x.installments = 14;
    console.log(14, 1238.86 / loan.valueRound(x.testeCalc()), 1238.86, loan.valueRound(x.testeCalc()));
    x.installments = 16;
    console.log(16, 1319.57 / loan.valueRound(x.testeCalc()), 1319.57, loan.valueRound(x.testeCalc()));
    x.installments = 18;
    console.log(18, 1382.18 / loan.valueRound(x.testeCalc()), 1382.18, loan.valueRound(x.testeCalc()));
    x.installments = 20;
    console.log(20, 1432.07 / loan.valueRound(x.testeCalc()), 1432.07, loan.valueRound(x.testeCalc()));
    x.installments = 22;
    console.log(22, 1472.68 / loan.valueRound(x.testeCalc()), 1472.68, loan.valueRound(x.testeCalc()));
    console.log('******************************************************************');
}
function testeWithAdj3(x) {
    x.installments = 4;
    console.log(4, 524.99 / loan.valueRound(x.testeCalc()), 524.99, loan.valueRound(x.testeCalc()));
    x.installments = 8;
    console.log(8, 798.42 / loan.valueRound(x.testeCalc()), 798.42, loan.valueRound(x.testeCalc()));
    x.installments = 10;
    console.log(10, 940.35 / loan.valueRound(x.testeCalc()), 940.35, loan.valueRound(x.testeCalc()));
    x.installments = 12;
    console.log(12, 1084.67 / loan.valueRound(x.testeCalc()), 1084.67, loan.valueRound(x.testeCalc()));
    x.installments = 14;
    console.log(14, 1197.68 / loan.valueRound(x.testeCalc()), 1197.68, loan.valueRound(x.testeCalc()));
    x.installments = 16;
    console.log(16, 1286.36 / loan.valueRound(x.testeCalc()), 1286.36, loan.valueRound(x.testeCalc()));
    x.installments = 18;
    console.log(18, 1348.05 / loan.valueRound(x.testeCalc()), 1348.05, loan.valueRound(x.testeCalc()));
    x.installments = 20;
    console.log(20, 1400.41 / loan.valueRound(x.testeCalc()), 1400.41, loan.valueRound(x.testeCalc()));
    x.installments = 22;
    console.log(22, 1443.04 / loan.valueRound(x.testeCalc()), 1443.04, loan.valueRound(x.testeCalc()));
    console.log('******************************************************************');
}
let x = new loan();
x.valueLoan = 50000;
x.valueInterest = 3.25;
// testa anos bisextos e parece ok
x.dateSimulate = new Date('2019-09-17T23:00:00.000Z');
x.dateFirstPay = new Date('2019-10-17T00:00:01.001Z');
testeNoAdj(x);
x.dateSimulate = new Date('2023-09-17T23:00:00.000Z');
x.dateFirstPay = new Date('2023-10-17T00:00:01.001Z');
testeNoAdj(x);
x.dateSimulate = new Date('2019-09-17T23:00:00.000Z');
x.dateFirstPay = new Date('2019-10-18T00:00:01.001Z');
testeNoAdj(x);
x.dateSimulate = new Date('2019-09-17T23:00:00.000Z');
x.dateFirstPay = new Date('2019-11-10T00:00:01.001Z');
console.log(x.daysAjust);
testeWithAdj(x);
x.dateSimulate = new Date('2019-09-17T23:00:00.000Z');
x.dateFirstPay = new Date('2019-10-30T00:00:01.001Z');
console.log(x.daysAjust);
testeWithAdj2(x);
x.dateSimulate = new Date('2019-09-17T23:00:00.000Z');
x.dateFirstPay = new Date('2019-10-20T00:00:01.001Z');
console.log(x.daysAjust);
testeWithAdj3(x);
//# sourceMappingURL=index.js.map