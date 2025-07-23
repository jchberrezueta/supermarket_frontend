interface Permiso {
  ruta: string;
  listar: boolean;
  insertar: boolean;
  modificar: boolean;
  eliminar: boolean;
  activo: boolean;
}

interface Usuario {
  id: number;
  username: string;
  state: string;
  perfil: string;
  permisos: Permiso[];
}

const userPermissions: Usuario = JSON.parse(localStorage.getItem('userpermissions') || '{}');

// Ahora puedes acceder:
console.log(userPermissions.permisos);
