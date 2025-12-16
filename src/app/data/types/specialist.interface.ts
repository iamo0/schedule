export enum Role {
  MANAGER = 1,
  MARSHALL = 2,
  SENIOR_MARSHALL = 3,
  MECHANIC = 4,
  JANITOR = 5,
}

export default interface Specialist {
  id: string,
  role: Role,
  name: string,
  dates: {
    [year: string]: {
      [month: string]: boolean[],
    },
  },
}
