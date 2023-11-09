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

/* Se envia enlace al correo del usuario */
export class SendEmail {
  email!: string;
}

/* Usuario cambia su contraseña desde enlace del correo */
export interface IChangeForgottenPassword {
  password:string;
}

export class ChangeForgottenPassword implements IChangeForgottenPassword {
  password = ''
}

/* Usuario cambia su contraseña por una nueva */
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