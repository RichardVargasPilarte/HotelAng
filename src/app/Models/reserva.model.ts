export class Reserva implements IReserva {
    id: number = -1;
    cliente_id = -1;
    habitacion_id = -1;
    fecha_inicio = '';
    fecha_fin = '';
    tipo_pago = 0;
    pago_choices = '';
    descripcion = '';
}

export interface IReserva {
    id: number;
    cliente_id: number;
    habitacion_id: number;
    fecha_inicio: string;
    fecha_fin: string;
    tipo_pago: number;
    pago_choices: string;
    descripcion: string;
} 