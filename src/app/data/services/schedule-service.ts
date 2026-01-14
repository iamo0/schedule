import { Injectable, Pipe, PipeTransform, signal } from '@angular/core';
import Specialist, { Role } from '../types/specialist.interface';
import Data from './loader';
import { Observable } from 'rxjs';

@Pipe({ name: "rolename" })
export class SpecialistRoleNamePipe implements PipeTransform {
  #roleNames = new Map<Role, string>([
    [Role.MANAGER, "Администратор"],
    [Role.JUNIOR_MANAGER, "Помощник администратора"],
    [Role.MARSHALL, "Маршал"],
    [Role.SENIOR_MARSHALL, "Старший смены"],
    [Role.MECHANIC, "Механик"],
    [Role.JANITOR, "Уборщица"],
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
  specialists$!:Observable<readonly Specialist[]>;

  load() {
    this.specialists$ = new Observable((subscriber) => {
      subscriber.next(Data);
      subscriber.complete();
    });
    return this.specialists$;
  }
}
