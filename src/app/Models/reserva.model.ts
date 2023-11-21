import { FormControl, FormGroup } from "@angular/forms";
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

    // public static fromForm(form: IFormReserva) {
    //     const reserva: Reserva = new Reserva();
    //     reserva.id = -1
    //     reserva.cliente_id = form.cliente_id as unknown as number;
    //     reserva.habitacion_id = form.habitacion_id as unknown as number;
    //     reserva.fecha_inicio = form.fecha_inicio as unknown as string;
    //     reserva.fecha_fin = form.fecha_fin as unknown as string;
    //     reserva.tipo_pago = form.tipo_pago as unknown as string;
    //     reserva.descripcion = form.descripcion as unknown as string;
    //     return reserva;
    // }
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



// export interface IFormReserva {
//     id: FormControl<number | null>;
//     cliente_id: FormControl<number | null>;
//     habitacion_id: FormControl<number | null>;
//     fecha_inicio: FormControl<string | null>;
//     fecha_fin: FormControl<string | null>;
//     tipo_pago: FormControl<string | null>;
//     descripcion: FormControl<string | null>;
//     eliminado: FormControl<string | null>;

// }


export interface IReservaResponse {
    id: number;
    cliente_id: Cliente;
    habitacion_id: Habitacion
    fecha_inicio: string;
    fecha_fin: string;
    tipo_pago: string;
    descripcion: string;
}
