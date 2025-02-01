export interface subjects {
    _id : string,
    claveReticula : string,
    carrera : string,
    materias : subject[]
}

export interface subject {
    _id : string
    nombreMateria : string,
    claveMateria : string,
    semestreMateria : number,
    descripcionMateria : string,
}