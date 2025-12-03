import { Injectable, Pipe, PipeTransform, signal } from '@angular/core';
import Specialist, { Role } from '../types/specialist.interface';
import getRandom from '../helpers/get-random';

@Pipe({ name: "rolename" })
export class SpecialistRoleNamePipe implements PipeTransform {
  #roleNames = new Map<Role, string>([
    [Role.MANAGER, "Менеджер",],
    [Role.MARSHALL, "Маршал",],
    [Role.SENIOR_MARSHALL, "Старший маршал",],
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
  static names = ["Максим Семашко", "Игорь Алексеенко", "Ростислав Максимов", "Максим Меркурьев", "Щекотов Илья", "Каменьков Глеб"];

  specialists = signal<Specialist[]>([]);

  constructor() {
    for (let i = 0; i < ScheduleService.names.length; i++) {
      this.specialists.update((val) => [...val, {
        id: i.toString(),
        role: getRandom(1, 3) as Role,
        name: ScheduleService.names[i],
        dates: {
          [new Date().getFullYear().toString()]: {
            [(new Date().getMonth() + 1).toString()]: new Array(31)
              .fill(undefined)
              .map(() => Math.random() > 0.5)
          },
        },
      }]);
    }
  }
}
