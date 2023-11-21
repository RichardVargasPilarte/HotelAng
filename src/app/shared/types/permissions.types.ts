interface BaseCrud {
    Create: number;
    Read: number;
    Update: number;
    Delete: number;
}

export class Permission {
    Alojamiento = Alojamientos;
    Habitacion = Habitaciones;
    Cliente = Clientes;
    Reserva = Reservas;
    Usuario = Usuarios;
}

const Alojamientos = {
    Create: 21,
    Read: 24,
    Update: 22,
    Delete: 23
}

const Habitaciones = {
    Create: 25,
    Read: 28,
    Update: 26,
    Delete: 27
}

const Clientes = {
    Create: 33,
    Read: 36,
    Update: 34,
    Delete: 35
}

const Reservas = {
    Create: 37,
    Read: 40,
    Update: 38,
    Delete: 39
}

const Usuarios = {
    Create: 29,
    Read: 32,
    Update: 30,
    Delete: 31
}
