import { IMainResponseArrayDto, IMainResponseObjectDto } from "./Response.dto";

import { Reserva } from '../models/reserva.model';

export interface IReservaResponseDto extends IMainResponseObjectDto<Reserva> {

}

export interface IReservasResponseDto extends IMainResponseArrayDto<Reserva> {

}