declare class loan {
    static taxYearToMonth: (tax: number) => number;
    static taxMonthToYear: (tax: number) => number;
    static taxMonthToDay: (tax: number) => number;
    static taxDayToMonth: (tax: number) => number;
    static valueCalcInstallment: (capital: number, taxInterest: number, installments: number) => number;
    static valueRound: (value: number, decimalPlaces?: number) => number;
    static dateClearTime: (date: Date) => Date;
    static daysBetweenDates: (date1: Date, date2: Date) => number;
    static dateAddDays: (date: Date, days: number) => Date;
    static dateAddMonth: (date: Date, month: number) => Date;
    dateSimulate: Date;
    dateFirstPay: Date;
    readonly dateStartLoan: Date;
    valueLoan: number;
    valueInterest: number;
    valueIOF: number;
    valueIOFAdd: number;
    valueTAC: number;
    installments: number;
    readonly taxInterest: number;
    readonly taxIOF: number;
    readonly taxIOFAdd: number;
    readonly taxTAC: number;
    readonly daysAjust: number;
    datePayment: (installment: number) => Date;
    calcIofNoAdjust: () => number;
}
declare let x: loan;
//# sourceMappingURL=index.d.ts.map