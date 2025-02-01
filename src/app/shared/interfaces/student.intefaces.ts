export interface students{
    _id : string,
    alumnos : student[]
}

export interface student{
    _id : string,
    nombre : string,
    numeroControl : string,
    promedioFinal? : number,
    calificaciones : unit[],
}

export interface unit{
    unidad : number,
    actividades : activity[],
    promedioUnidad? : number,
}

export interface activity{
    nombreActividad: string,
    calificacionActividad: number,
}