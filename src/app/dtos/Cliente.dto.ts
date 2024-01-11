import { IMainResponseArrayDto, IMainResponseObjectDto } from "./Response.dto";
import { Cliente } from '../Models/cliente.model';



export interface IClienteResponseDto extends IMainResponseObjectDto<Cliente> {

}

export interface IClientesResponseDto extends IMainResponseArrayDto<Cliente> {

}
