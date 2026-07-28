import { CommonModule, Location } from '@angular/common';

import { Component, OnInit, inject } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

import {
  IGuardarPermisoPerfil,
  IPermisoPerfilOpcion,
  IPerfilPermisosInfo,
  ValorPermiso,
} from '@models';

import { PerfilesService } from '@services/index';

import { UiButtonComponent } from '@shared/components/button/button.component';

import { LoadingService } from '@shared/services/loading.service';

import Swal from 'sweetalert2';

type AccionPermiso = 'listar' | 'insertar' | 'modificar' | 'eliminar';

interface IPermisoView extends IPermisoPerfilOpcion {
  listarActivo: boolean;
  insertarActivo: boolean;
  modificarActivo: boolean;
  eliminarActivo: boolean;
}

@Component({
  selector: 'app-profile-permissions',

  standalone: true,

  imports: [CommonModule, MatIconModule, UiButtonComponent],

  templateUrl: './permissions.component.html',

  styleUrl: './permissions.component.scss',
})
export default class PermissionsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);

  private readonly perfilesService = inject(PerfilesService);

  private readonly loadingService = inject(LoadingService);

  protected readonly location = inject(Location);

  protected perfil: IPerfilPermisosInfo | null = null;

  protected permisos: IPermisoView[] = [];

  protected search = '';

  protected isSaving = false;

  protected isAdministrator = false;

  private idPerfil = -1;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id < 0) {
      this.location.back();
      return;
    }

    this.idPerfil = id;

    this.loadPermissions();
  }

  protected get filteredPermissions(): IPermisoView[] {
    const filter = this.search.trim().toLowerCase();

    if (!filter) {
      return this.permisos;
    }

    return this.permisos.filter(
      (permission) =>
        permission.nombre_opci.toLowerCase().includes(filter) ||
        permission.ruta_opci.toLowerCase().includes(filter) ||
        (permission.descripcion_opci ?? '').toLowerCase().includes(filter),
    );
  }

  protected updateSearch(event: Event): void {
    this.search = (event.target as HTMLInputElement).value;
  }

  protected toggleAssigned(permission: IPermisoView): void {
    if (this.isAdministrator) {
      return;
    }

    const currentlyAssigned = this.hasAnyPermission(permission);

    if (currentlyAssigned) {
      permission.listarActivo = false;

      permission.insertarActivo = false;

      permission.modificarActivo = false;

      permission.eliminarActivo = false;

      return;
    }

    permission.listarActivo = true;
  }

  protected toggleAction(
    permission: IPermisoView,

    action: AccionPermiso,

    event: Event,
  ): void {
    if (this.isAdministrator) {
      return;
    }

    const checked = (event.target as HTMLInputElement).checked;

    permission[this.actionProperty(action)] = checked;

    /*
     * Insertar, modificar o eliminar
     * necesitan acceso de lectura.
     */
    if (checked && action !== 'listar') {
      permission.listarActivo = true;
    }

    /*
     * Si se retira listar, se retiran
     * las acciones dependientes.
     */
    if (!checked && action === 'listar') {
      permission.insertarActivo = false;

      permission.modificarActivo = false;

      permission.eliminarActivo = false;
    }
  }

  protected hasAnyPermission(permission: IPermisoView): boolean {
    return (
      permission.listarActivo ||
      permission.insertarActivo ||
      permission.modificarActivo ||
      permission.eliminarActivo
    );
  }

  protected selectAllRead(): void {
    if (this.isAdministrator) {
      return;
    }

    for (const permission of this.permisos) {
      if (permission.activo_opci === 'si') {
        permission.listarActivo = true;
      }
    }
  }

  protected clearAll(): void {
    if (this.isAdministrator) {
      return;
    }

    for (const permission of this.permisos) {
      permission.listarActivo = false;

      permission.insertarActivo = false;

      permission.modificarActivo = false;

      permission.eliminarActivo = false;
    }
  }

  protected save(): void {
    if (this.isAdministrator || this.isSaving) {
      return;
    }

    const body = {
      permisos: this.permisos
        .filter((permission) => this.hasAnyPermission(permission))
        .map(
          (permission): IGuardarPermisoPerfil => ({
            ideOpci: permission.ide_opci,

            listar: this.toPermissionValue(permission.listarActivo),

            insertar: this.toPermissionValue(permission.insertarActivo),

            modificar: this.toPermissionValue(permission.modificarActivo),

            eliminar: this.toPermissionValue(permission.eliminarActivo),
          }),
        ),
    };

    void Swal.fire({
      title: '¿Guardar permisos?',

      text: 'Los permisos anteriores del perfil serán reemplazados.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Sí, guardar',

      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        return;
      }

      this.isSaving = true;
      this.loadingService.show();

      this.perfilesService.guardarPermisos(this.idPerfil, body).subscribe({
        next: (response) => {
          this.isSaving = false;
          this.loadingService.hide();

          const success = Number(response.p_result) === 1;

          const message = this.parseMessage(
            response.p_response,
            success
              ? 'Permisos actualizados correctamente.'
              : 'No se pudieron actualizar los permisos.',
          );

          void Swal.fire({
            icon: success ? 'success' : 'error',

            title: success ? 'Permisos guardados' : 'Operación rechazada',

            text: message,
          }).then(() => {
            if (success) {
              this.loadPermissions();
            }
          });
        },

        error: (error) => {
          this.isSaving = false;
          this.loadingService.hide();

          const message = error?.error?.message;

          void Swal.fire({
            icon: 'error',
            title: 'No se pudo guardar',

            text: Array.isArray(message)
              ? message.join('. ')
              : typeof message === 'string'
                ? message
                : 'Ocurrió un error al comunicarse con el servidor.',
          });
        },
      });
    });
  }

  protected back(): void {
    this.location.back();
  }

  protected optionIndent(permission: IPermisoView): string {
    const level = Math.max(0, Number(permission.nivel_opci));

    return `${level * 1.25}rem`;
  }

  private loadPermissions(): void {
    this.loadingService.show();

    this.perfilesService.listarPermisos(this.idPerfil).subscribe({
      next: (response) => {
        this.perfil = response.data.perfil;

        this.isAdministrator =
          this.perfil.ide_perf === 0 || this.perfil.nombre_perf === 'padmin';

        this.permisos = response.data.permisos.map(
          (permission): IPermisoView => ({
            ...permission,

            listarActivo: permission.listar === 'si',

            insertarActivo: permission.insertar === 'si',

            modificarActivo: permission.modificar === 'si',

            eliminarActivo: permission.eliminar === 'si',
          }),
        );

        this.loadingService.hide();
      },

      error: (error) => {
        this.loadingService.hide();

        const message = error?.error?.message;

        void Swal.fire({
          icon: 'error',
          title: 'No se pudieron cargar los permisos',

          text:
            typeof message === 'string'
              ? message
              : 'No fue posible consultar la configuración del perfil.',
        }).then(() => this.location.back());
      },
    });
  }

  private actionProperty(
    action: AccionPermiso,
  ): 'listarActivo' | 'insertarActivo' | 'modificarActivo' | 'eliminarActivo' {
    switch (action) {
      case 'listar':
        return 'listarActivo';

      case 'insertar':
        return 'insertarActivo';

      case 'modificar':
        return 'modificarActivo';

      case 'eliminar':
        return 'eliminarActivo';
    }
  }

  private toPermissionValue(value: boolean): ValorPermiso {
    return value ? 'si' : 'no';
  }

  private parseMessage(
    response: string | undefined,

    fallback: string,
  ): string {
    if (!response) {
      return fallback;
    }

    try {
      const parsed = JSON.parse(response) as {
        message?: string;
      };

      return parsed.message ?? fallback;
    } catch {
      return response;
    }
  }
}
