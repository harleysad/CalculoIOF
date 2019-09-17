console.log('inicio');

class loan {


    public static taxYearToMonth = (tax: number): number => Math.pow((1 + tax), (1 / 12)) - 1;;
    public static taxMonthToYear = (tax: number): number => Math.pow((1 + tax), 12) - 1;
    public static taxMonthToDay = (tax: number): number => Math.pow((1 + tax), (1 / 30)) - 1;
    public static taxDayToMonth = (tax: number): number => Math.pow((1 + tax), 30) - 1;
    public static valueCalcInstallment = (capital: number, taxInterest: number, installments: number): number => capital *
        ((Math.pow(taxInterest + 1, installments)) * taxInterest) /
        (Math.pow(taxInterest + 1, installments) - 1);

    public static valueRound = (value: number, decimalPlaces: number = 2): number => parseFloat(value.toFixed(decimalPlaces));

    public static dateClearTime = (date: Date): Date => new Date(date.toISOString().substr(0, 10));

    public static daysBetweenDates = (date1: Date, date2: Date): number => {
        let now = loan.dateClearTime(date2);
        let past = loan.dateClearTime(date1);
        let diff = now.getTime() - past.getTime();
        let days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        return days;
    }

    public static dateAddDays = (date: Date, days: number): Date => {
        var result = loan.dateClearTime(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    public static dateAddMonth = (date: Date, month: number): Date => {
        let swp = loan.dateClearTime(date);
        swp.setMonth(swp.getMonth() + month)
        loan.dateClearTime(swp);
        return swp;
    }

    public dateSimulate: Date = new Date();
    public dateFirstPay: Date = loan.dateAddMonth(new Date(), 1);

    public valueLoan: number = 0;
    // public get valueTotalLoan(): number { return this.valueLoan };
    public valueInterest: number = 4.5;
    public valueIOF: number = 0.0082;
    public valueIOFAdd: number = 0.38;
    public valueTAC: number = 0;


    public installments: number = 10;
    public get taxInterest(): number { return this.valueInterest / 100; }
    public get taxIOF(): number { return this.valueIOF / 100; }
    public get taxIOFAdd(): number { return this.valueIOFAdd / 100; }
    public get taxTAC(): number { return this.valueTAC / 100; }

    public get daysAjust(): number {
        return loan.daysBetweenDates(loan.dateAddMonth(this.dateSimulate, 1), this.dateFirstPay);
    }

    public datePayment = (installment: number) => loan.dateAddMonth(this.dateFirstPay, installment);

    public calcIofNoAdjust = (): number => {
        let valueFunded = this.valueLoan;
        let calcIofNoAdjustAdd = valueFunded * this.taxIOFAdd;
        let exp: number = 1;
        let baseIof: number = 0;
        let cursor: number = this.installments;
        let ret: number = 0;
        let aux3 = 1;
        let aux4 = 1;

        if (this.daysAjust > 0) {
            aux3 = (Math.pow(this.taxInterest + 1, (this.daysAjust / 30 + 1))) - 1;
            aux4 = Math.pow(this.taxInterest + 1, (this.daysAjust / 30));
        }
        if (cursor != this.installments)
            valueFunded = valueFunded * aux4;
        else
            valueFunded = valueFunded * aux3;

        let installmentValue: number = loan.valueCalcInstallment(valueFunded, this.taxInterest, this.installments);
        let dayPayment: Date = loan.dateAddMonth(this.dateFirstPay, this.installments -1);
        do {
            baseIof = installmentValue / Math.pow(1 + this.taxInterest, exp);
            let daysToPayment = loan.daysBetweenDates(this.dateSimulate, dayPayment);
            if (daysToPayment > 365) daysToPayment = 365;
            let valueIOFInstallment = baseIof * daysToPayment * (this.taxIOF);           
            ret += valueIOFInstallment;
            exp++;
            cursor--;
            dayPayment = loan.dateAddMonth(this.dateFirstPay, this.installments  - exp);
        } while (cursor > 0)

        ret = ret + calcIofNoAdjustAdd;

        ret = (valueFunded /
            (1 - ret / valueFunded)) - valueFunded;

        return ret;
    }
}


let x = new loan();
x.dateSimulate = new Date('2019-09-17T23:00:00.000Z');
x.dateFirstPay = new Date('2019-10-17T00:00:01.001Z');
x.valueLoan = 41345.64;
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
