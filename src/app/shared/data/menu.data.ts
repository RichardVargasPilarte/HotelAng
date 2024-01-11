import { Menu } from '../../Models/menu.models';

export const menu: Menu[]=[
    {
        id:1,
        nombre: 'Alojamientos',
        descripcion: 'En este apartado se puede crear, eliminar, actualizar y ver los alojamientos',
        icon: 'home'
    },
    {
        id:2,
        nombre: 'Habitaciones',
        descripcion: 'Aquí se puede crear, eliminar, actualizar y ver las diferentes habitaciones que están disponibles',
        icon: 'bedroom_parent'
    },
    {
        id:3,
        nombre: 'Reservas',
        descripcion: 'Aquí puede crear, eliminar y ver las reservas que se han realizado',
        icon: 'group'
    },
    {
        id:4,
        nombre: 'Clientes',
        descripcion: 'En este apartado se encuentran registrados los clientes y se puede crear, eliminar, actualizar y ver los datos de ellos',
        icon: 'family_restroom'
    },
    {
        id:5,
        nombre: 'Usuarios',
        descripcion: 'En esta sección se encuentra lo relacionado a la administración de los usuarios de la aplicación y su mantenimiento',
        icon: 'person'
    },
];
