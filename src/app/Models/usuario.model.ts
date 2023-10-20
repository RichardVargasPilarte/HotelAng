import { Grupos, IGrupos } from "./grupo.model";


export interface IUsuario {
  id: number | null;
  first_name: string | null;
  last_name: string | null;
  password: string | null;
  username: string | null;
  email: string | null;
  direccion: string | null;
  estado: number | null;
  telefono: string | null;
  groups: IGrupos[]
}


export class Usuario implements IUsuario {
  id = -1;
  first_name = ''
  last_name = ''
  password = ''
  username = ''
  email = ''
  direccion = ''
  estado = -1;
  telefono = ''
  groups: IGrupos[] = []
}



export interface ICreateUser {
  first_name:string
  last_name:string
  password:string
  username:string
  email:string
  direccion:string
  estado:number;
  telefono:string
  groups:number;
}


export class CreateUser implements ICreateUser{
  id = -1;
  first_name = ''
  last_name = ''
  password = ''
  username = ''
  email = ''
  direccion = ''
  estado = -1;
  telefono = ''
  groups =-1;
}


export class SendEmail {
  email!: string;
}

export interface IChangeForgottenPassword {
  password:string;
}

export class ChangeForgottenPassword implements IChangeForgottenPassword {
  password = ''
}