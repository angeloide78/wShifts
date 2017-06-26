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
var persona_service_1 = require("./persona.service");
var buscar_persona_component_1 = require("../buscar_persona/buscar_persona.component");
// Clase grid.
var GridComponent_1 = require('../grid-utils/GridComponent');
// Grid.
var PersonaComponent = (function (_super) {
    __extends(PersonaComponent, _super);
    function PersonaComponent(objetoService) {
        _super.call(this, objetoService);
        this.objetoService = objetoService;
        this.display = false;
        this.titulo = "Visualización de datos personales del trabajador";
        this.nombre_fichero_csv = "datosTrabajador_wShifts.csv";
        this.dni = null;
        this.id = null;
        this.nombre = null;
        this.ape1 = null;
        this.ape2 = null;
        this.direccion = null;
        this.cp = null;
        this.poblacion = null;
        this.provincia = null;
        this.pais = null;
        this.tlfno1 = null;
        this.tlfno2 = null;
        this.email = null;
        this.observaciones = null;
        this.sexo = null;
        this.fnac = null;
        // Configuración del ag-grid.
        _super.prototype.configurarGrid.call(this);
    }
    PersonaComponent.prototype.showDialog = function () {
        this.display = true;
    };
    PersonaComponent.prototype.ngOnChanges = function (changes) {
        // Se detectan cambios...
        var dato;
        var perSel = changes['perSel'];
        // Se recuperan cambios...
        dato = perSel.currentValue;
        // Si no hay nada, salimos.
        if (dato == undefined) {
            return;
        }
        // Se recupera el id, que será con lo que se busque...
        var id = dato.id;
        console.log("[PERSONA] Recuperando trabajador con DNI " + dato.dni);
        // Se recupera información.
        this.filtro_recuperar = { id: id };
        this.recuperar();
    };
    PersonaComponent.prototype.recuperar = function () {
        var _this = this;
        // Se llama a servicio de componente para recuperar información.
        this.objetoService.send_data(this.filtro_recuperar, 'recuperar')
            .subscribe(function (data) {
            _this.array_objetos = data;
            _this.rowData = _this.createRowData(_this.array_objetos);
            _this.id = _this.rowData[0]['id'];
            _this.dni = _this.rowData[0]['dni'];
            _this.nombre = _this.rowData[0]['nombre'];
            _this.ape1 = _this.rowData[0]['ape1'];
            _this.ape2 = _this.rowData[0]['ape2'];
            _this.direccion = _this.rowData[0]['direccion'];
            _this.cp = _this.rowData[0]['cp'];
            _this.poblacion = _this.rowData[0]['poblacion'];
            _this.provincia = _this.rowData[0]['provincia'];
            _this.pais = _this.rowData[0]['pais'];
            _this.tlfno1 = _this.rowData[0]['tlfno1'];
            _this.tlfno2 = _this.rowData[0]['tlfno2'];
            _this.email = _this.rowData[0]['email'];
            _this.observaciones = _this.rowData[0]['observaciones'];
            _this.sexo = _this.rowData[0]['sexo'];
            _this.fnac = _this.rowData[0]['fnac'];
            //if ( this.fnac != null ) {
            //  let partes_fecha = this.fnac.split('/');
            //  this.fnac = partes_fecha[2] + "-" + partes_fecha[1] + "-" + partes_fecha[0] ;
            //}
        }, function (error) {
            _this.errorMessage = error;
            _this.mensajes('error_guardar', 'Error de acceso a servidores');
        });
    };
    PersonaComponent.prototype.createColumnDefs = function () {
        return [
            { headerName: "id", field: "id", hide: true, width: 100 },
            { headerName: "Documento", field: "dni", width: 120 },
            { headerName: "Nombre", field: "nombre", width: 200 },
            { headerName: "Primer apellido", field: "ape1", width: 200 },
            { headerName: "Segundo apellido", field: "ape2", width: 200 },
            { headerName: "Sexo", field: "sexo", width: 200 },
            { headerName: "F. Nac.", field: "fnac", width: 200 },
            { headerName: "Dirección", field: "direccion", width: 400 },
            { headerName: "CP", field: "cp", width: 50 },
            { headerName: "Población", field: "poblacion", width: 400 },
            { headerName: "Provincia", field: "provincia", width: 100 },
            { headerName: "País", field: "pais", width: 100 },
            { headerName: "Primer teléfono", field: "tlfno1", width: 200 },
            { headerName: "Segundo teléfono", field: "tlfno2", width: 200 },
            { headerName: "e-mail", field: "email", width: 200 },
            { headerName: "Observaciones", field: "observaciones", width: 400,
                celleditor: "largeText" }
        ];
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', buscar_persona_component_1.PersonaSeleccionada)
    ], PersonaComponent.prototype, "perSel", void 0);
    PersonaComponent = __decorate([
        core_1.Component({
            selector: 'persona',
            templateUrl: 'app/persona/persona.html',
            providers: [persona_service_1.PersonaService]
        }), 
        __metadata('design:paramtypes', [persona_service_1.PersonaService])
    ], PersonaComponent);
    return PersonaComponent;
}(GridComponent_1.GridComponent));
exports.PersonaComponent = PersonaComponent;
//# sourceMappingURL=persona.component.js.map