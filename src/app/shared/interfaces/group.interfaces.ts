export interface activity {
    nombre: string;
    porcentaje: number;
    _id: string;
}

export interface unit {
    unidad: number;
    actividades: activity[];
    _id: string;
}

export interface group {
    _id: string;
    periodo: string;
    numeroGrupo: number;
    materia: string;
    docente: string;
    unidades: unit[];
    alumnosAprobados: number;
    alumnosReprobados: number;
    alumnosDesertados: number;
    porcentajeAprobados: number;
    porcentajeReprobados: number;
    porcentajeDesertados: number;
    promedioGeneral: number;
    listaAlumnos : string;
    totalPages : number;
    grupoActivo : Boolean;
}