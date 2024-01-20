/* eslint-disable @typescript-eslint/no-empty-interface */
import { IMainResponseArrayDto, IMainResponseObjectDto } from "./Response.dto";

import { Reserva } from '../Models/reserva.model';


export interface IReservaResponseDto extends IMainResponseObjectDto<Reserva> {

}

export interface IReservasResponseDto extends IMainResponseArrayDto<Reserva> {

}
