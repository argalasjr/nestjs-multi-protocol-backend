export enum WhenEventFilter {
  All = '1',
  Today = '2',
  Tommorow = '3',
  ThisWeek = '4',
  NextWeek = '5',
}

export class ListEvents {
  when?: WhenEventFilter = WhenEventFilter.All;
  page?: number = 1;
  limit?: number = 2;
  total?: boolean = false;
}
