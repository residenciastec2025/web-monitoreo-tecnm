export interface teacher{
    _id : string,
    nombre : string,
    correo : string,
    cuenta : string,
    fechaRegistro : string,
    horaRegistro : string,
    carreras : carrera[]
}

export interface carrera {
    _id : string,
    carrera : string,
}