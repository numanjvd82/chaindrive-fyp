export enum ViolationType {
  NONE = 0,
  DAMAGE = 1,
  LATE_RETURN = 2,
  ILLEGAL_ACTIVITY = 3,
  UNAUTHORIZED_DRIVER = 4,
}

export const violationTypes = [
  { value: ViolationType.DAMAGE, label: "Vehicle Damage", color: "bg-red-500" },
  {
    value: ViolationType.ILLEGAL_ACTIVITY,
    label: "Illegal Activity",
    color: "bg-purple-500",
  },
  {
    value: ViolationType.UNAUTHORIZED_DRIVER,
    label: "Unauthorized Driver",
    color: "bg-orange-500",
  },
];
