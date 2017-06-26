"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// Componentes de Angular 2
var core_1 = require("@angular/core");
// Componentes de modelo y servicio.
var ciclo_service_1 = require("../ciclo/ciclo.service");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var cicloSemanasComponent = (function (_super) {
    __extends(cicloSemanasComponent, _super);
    function cicloSemanasComponent(objetoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        this.nombre_fichero_csv = "ciclosSemanas_wShifts.csv";
        this.tipo_visualizacion = "estatica";
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
    }
    cicloSemanasComponent.prototype.crearNuevaFilaDatos = function () {
        var nuevaFila = {
            id: 1,
            lunes: "A",
            martes: "q",
            miercoles: "S",
            jueves: "A",
            viernes: "A",
            sabado: "A",
            domingo: 'B'
        };
        this.gridOptions.api.addItems([nuevaFila]);
        return true;
    };
    cicloSemanasComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "Semana",
                field: "id",
                // hide: true,
                width: 80 },
            { headerName: "L",
                field: "lunes",
                width: 50
            },
            { headerName: "M",
                field: "martes",
                width: 50
            },
            { headerName: "X",
                field: "miercoles",
                width: 50
            },
            { headerName: "J",
                field: "jueves",
                width: 50
            },
            { headerName: "V",
                field: "viernes",
                width: 50
            },
            { headerName: "S",
                field: "sabado",
                width: 50
            },
            { headerName: "D",
                field: "domingo",
                width: 50
            }
        ];
    };
    cicloSemanasComponent = __decorate([
        core_1.Component({
            selector: 'cicloSemanas',
            templateUrl: 'app/ciclo/cicloSemanas.html',
            providers: [ciclo_service_1.CicloService]
        }), 
        __metadata('design:paramtypes', [ciclo_service_1.CicloService])
    ], cicloSemanasComponent);
    return cicloSemanasComponent;
}(GridComponent_1.GridComponent));
exports.cicloSemanasComponent = cicloSemanasComponent;
//# sourceMappingURL=cicloSemanas.component.js.map