import { Grupos, IGrupos } from "./grupo.model";


export interface IUsuario {
  id: number | null;
  first_name: string | null;
  last_name: string | null;
  password?: string | null;
  username: string | null;
  email: string | null;
  direccion: string | null;
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
  telefono = ''
  groups =-1;
}

export interface IUserUpdate {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  direccion: string;
  telefono: string;
  groups: IGrupos[]
}

export class UserUpdate implements IUserUpdate {
  id = -1;
  first_name = '';
  last_name = '';
  username = '';
  email = '';
  direccion = '';
  telefono = '';
  groups: IGrupos[] = []
}

export class SendEmail {
  email!: string;
}

export interface IChangeForgottenPassword {
  token: string;
  password:string;
}

export class ChangeForgottenPassword implements IChangeForgottenPassword {
  token = '';
  password = '';
}

export class IChangePassword{
  id!:number;
  old_password!: string;
  new_password!: string;
}

export class ChangePassword implements IChangePassword{
  id = -1;
  old_password = '';
  new_password = '';
}
