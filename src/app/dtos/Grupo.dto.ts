/* eslint-disable @typescript-eslint/no-empty-interface */
import { IMainResponseArrayDto, IMainResponseObjectDto } from "./Response.dto";

import { Grupos } from '../Models/grupo.model';

export interface IGrupoResponseDto extends IMainResponseObjectDto<Grupos> {

}

export interface IGruposResponseDto extends IMainResponseArrayDto<Grupos> {

}
