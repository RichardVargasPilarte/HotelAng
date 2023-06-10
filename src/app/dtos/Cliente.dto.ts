import { IMainResponseArrayDto, IMainResponseObjectDto } from "./Response.dto";
import { Cliente } from '../models/cliente.model';



export interface IClienteResponseDto extends IMainResponseObjectDto<Cliente> {

}

export interface IClientesResponseDto extends IMainResponseArrayDto<Cliente> {

}