import { Habitacion } from './habitacion.model';
import { Cliente } from './cliente.model';

export class Reserva implements IReserva {
    id: number = -1;
    cliente_id = -1;
    habitacion_id = -1;
    fecha_inicio = '';
    fecha_fin = '';
    tipo_pago = '';
    descripcion = '';
}


export interface IReserva {
    id: number | null
    cliente_id: number;
    habitacion_id: number
    fecha_inicio: string;
    fecha_fin: string;
    tipo_pago: string;
    descripcion: string;
}

export interface IReservaResponse {
    id: number;
    cliente_id: Cliente;
    habitacion_id: Habitacion
    fecha_inicio: string;
    fecha_fin: string;
    tipo_pago: string;
    descripcion: string;
}
