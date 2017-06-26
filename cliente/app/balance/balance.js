/*

ALGG 05-02-2017 Definición de clase Balance.

*/
"use strict";
var Balance = (function () {
    function Balance(balance, trabajador, horas, mes, anno, cf, sf, eq, p) {
        this.balance = balance;
        this.trabajador = trabajador;
        this.horas = horas;
        this.mes = mes;
        this.anno = anno;
        this.cf = cf;
        this.sf = sf;
        this.eq = eq;
        this.p = p;
    }
    return Balance;
}());
exports.Balance = Balance;
//# sourceMappingURL=balance.js.map