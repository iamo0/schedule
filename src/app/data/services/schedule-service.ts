import { inject, Injectable, Pipe, PipeTransform, signal } from '@angular/core';
import Specialist, { Role } from '../types/specialist.interface';
import { Loader } from './loader';

@Pipe({ name: "rolename" })
export class SpecialistRoleNamePipe implements PipeTransform {
  #roleNames = new Map<Role, string>([
    [Role.MANAGER, "Менеджер",],
    [Role.MARSHALL, "Маршал",],
    [Role.SENIOR_MARSHALL, "Старший маршал",],
    [Role.MECHANIC, "Механик",],
    [Role.JANITOR, "Уборщица",],
  ]);

  transform(role: Role) {
    return this.#roleNames.get(role);
  }
}

@Pipe({ name: "numberofdays" })
export class SpecialistNumberOfDays implements PipeTransform {
  transform(value: boolean[]):string {
    return value.filter((v) => v).length.toString();
  }
}

@Injectable({ providedIn: 'root' })
export default class ScheduleService {
  #loader = inject(Loader);

  specialists = signal<Specialist[]>([]);

  isLoading = signal(true);

  constructor() {
    this.#loader.get("api/schedule.json").subscribe((data) => {
      this.specialists.set(data as Specialist[]);
      this.isLoading.set(false);
    });
  }
}
