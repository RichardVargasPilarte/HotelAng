export class Permission {
    Alojamiento = Alojamientos;
    Habitacion = Habitaciones;
    Cliente = Clientes;
    Reserva = Reservas;
    Usuario = Usuarios;
}

const Alojamientos = {
    Create: 25,
    Read: 28,
    Update: 26,
    Delete: 27
}

const Habitaciones = {
    Create: 29,
    Read: 32,
    Update: 30,
    Delete: 31
}

const Clientes = {
    Create: 37,
    Read: 40,
    Update: 38,
    Delete: 39
}

const Reservas = {
    Create: 41,
    Read: 44,
    Update: 42,
    Delete: 43
}

const Usuarios = {
    Create: 33,
    Read: 36,
    Update: 34,
    Delete: 35
}
