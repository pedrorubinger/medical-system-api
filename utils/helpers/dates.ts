interface DateTimeObject {
  datetime_start: string
  datetime_end: string
}

export const datesOverlap = (A: DateTimeObject, B: DateTimeObject) => {
  return (
    A.datetime_end >= B.datetime_start && A.datetime_start <= B.datetime_end
  )
}
