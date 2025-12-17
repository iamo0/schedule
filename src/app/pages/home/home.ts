import { Component, computed, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import ScheduleService, { SpecialistNumberOfDays, SpecialistRoleNamePipe } from '../../data/services/schedule-service';
import daysInMonth from '../../data/helpers/days-in-month';
import isWeekend from '../../data/helpers/is-weekend';
import isToday from '../../data/helpers/is-today';
import { Role } from '../../data/types/specialist.interface';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [SpecialistRoleNamePipe, SpecialistNumberOfDays, AsyncPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  @ViewChild("todayCol") todayCol!: ElementRef;

  SpecialistColor = new Map([
    [Role.MANAGER, "rgba(153, 46, 46, 0.2)",],
    [Role.MARSHALL, "rgba(228, 215, 31, 0.3)",],
    [Role.SENIOR_MARSHALL, "rgba(27, 155, 97, 0.2)",],
    [Role.MECHANIC, "rgba(228, 97, 31, 0.3)",],
    [Role.JANITOR, "rgba(228, 97, 31, 0.1)",],
  ])

  schedule = inject(ScheduleService);

  year = signal(new Date().getFullYear());

  month = signal(new Date().getMonth() + 1);

  selectedDate = computed(() => new Date(this.year(), this.month() - 1, 1));

  monthDates = computed(() => new Array(daysInMonth(this.month(), this.year()))
    .fill(undefined)
    .map((_val, i) => ({
      date: i + 1,
      isWeekend: isWeekend(new Date(this.year(), this.month() - 1, i + 1)),
      isToday: isToday(new Date(this.year(), this.month() - 1, i + 1)),
    })));

  ngOnInit() {
    this.schedule.load().subscribe(() => {
      setTimeout(() => {
        try {
          (this.todayCol.nativeElement as HTMLElement)?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        } catch(err) {}
      }, 0);
    });
  }
}
